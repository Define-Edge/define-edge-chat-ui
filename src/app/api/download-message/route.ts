import { NextRequest, NextResponse } from "next/server";

// URL to the Chromium binary package hosted in /public, if not in production, use a fallback URL
// alternatively, you can host the chromium-pack.tar file elsewhere and update the URL below
const CHROMIUM_PACK_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/chromium-pack.tar`
  : "https://github.com/gabenunez/puppeteer-on-vercel/raw/refs/heads/main/example/chromium-dont-use-in-prod.tar";

// Cache the Chromium executable path to avoid re-downloading on subsequent requests
let cachedExecutablePath: string | null = null;
let downloadPromise: Promise<string> | null = null;

/**
 * Downloads and caches the Chromium executable path.
 * Uses a download promise to prevent concurrent downloads.
 */
async function getChromiumPath(): Promise<string> {
  // Return cached path if available
  if (cachedExecutablePath) return cachedExecutablePath;

  // Prevent concurrent downloads by reusing the same promise
  if (!downloadPromise) {
    const chromium = (await import("@sparticuz/chromium-min")).default;
    downloadPromise = chromium
      .executablePath(CHROMIUM_PACK_URL)
      .then((path) => {
        cachedExecutablePath = path;
        console.log("Chromium path resolved:", path);
        return path;
      })
      .catch((error) => {
        console.error("Failed to get Chromium path:", error);
        downloadPromise = null; // Reset on error to allow retry
        throw error;
      });
  }

  return downloadPromise;
}

export async function POST(request: NextRequest) {
  const { threadId, analysisId, analysisType = "stock_analysis" } = await request.json();
  if (!threadId || !analysisId) {
    return new NextResponse("Please provide a threadId and analysisId.", {
      status: 400,
    });
  }

  const origin =
    request.headers.get("origin") ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:3000";

  // Determine report route based on analysis type
  const reportPath = analysisType === "mf_analysis"
    ? "mf-analysis-report"
    : "stock-analysis-report";

  const gotoRoute = new URL(
    `${origin}/api/download-message/${reportPath}`,
  );
  gotoRoute.searchParams.set("threadId", threadId);
  gotoRoute.searchParams.set("analysisId", analysisId);

  let browser;
  try {
    // Configure browser based on environment
    const isVercel = !!process.env.VERCEL_ENV;
    let puppeteer: any,
      launchOptions: any = {
        headless: true,
      };

    if (isVercel) {
      // Vercel: Use puppeteer-core with downloaded Chromium binary
      const chromium = (await import("@sparticuz/chromium-min")).default;
      puppeteer = await import("puppeteer-core");
      const executablePath = await getChromiumPath();
      launchOptions = {
        ...launchOptions,
        args: chromium.args,
        executablePath,
      };
      console.log("Launching browser with executable path:", executablePath);
    } else {
      // Local: Use regular puppeteer with bundled Chromium
      puppeteer = await import("puppeteer");
    }

    // Launch browser and capture screenshot
    browser = await puppeteer.launch(launchOptions);

    const page = await browser.newPage();

    // Use a consistent viewport to avoid reflow when printing to PDF
    await page.setViewport({ width: 864, height: 800, deviceScaleFactor: 1 });

    // Ensure screen CSS (not print CSS) is applied and wait for network + fonts
    await page.emulateMediaType("screen");
    await page.goto(gotoRoute.toString(), { waitUntil: "networkidle0" });
    try {
      await page.evaluate(() => (window as any).document.fonts?.ready);
    } catch (err) {
      console.debug("Skipping font readiness wait:", err);
    }

    // Compute full page height to preserve layout as seen on screen
    const fullHeight = await page.evaluate(() => {
      const body = document.body;
      const html = document.documentElement;
      return Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight,
      );
    });

    const pdfBuffer = await page.pdf({
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
      width: "864px",
      height: `${fullHeight}px`,
      // height: "1123px",
      scale: 1,
    });
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="screenshot.pdf"',
      },
    });
  } catch (error: any) {
    console.error("Screenshot error:", error);
    console.error("Error stack:", error.stack);
    return new NextResponse(
      `An error occurred while generating the screenshot: ${error.message}`,
      { status: 500 },
    );
  } finally {
    // Always clean up browser resources
    if (browser) {
      await browser.close();
    }
  }
}
