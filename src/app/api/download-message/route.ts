import { NextRequest, NextResponse } from "next/server";
import {
  getBrowserLaunchOptions,
  PUPPETEER_TIMEOUTS,
} from "@/lib/puppeteer-utils";

export async function POST(request: NextRequest) {
  const {
    threadId,
    analysisId,
    analysisType = "stock_analysis",
    selectedSections,
    personalComment
  } = await request.json();
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

  // Pass selected sections and personal comment to the report page
  if (selectedSections && Array.isArray(selectedSections)) {
    gotoRoute.searchParams.set("selectedSections", JSON.stringify(selectedSections));
  }
  if (personalComment) {
    gotoRoute.searchParams.set("personalComment", personalComment);
  }

  let browser;
  try {
    // Get browser configuration based on environment
    const { puppeteer, launchOptions } = await getBrowserLaunchOptions();

    // Launch browser
    browser = await puppeteer.launch(launchOptions);
    
    const page = await browser.newPage();

    // Use a consistent viewport to avoid reflow when printing to PDF
    await page.setViewport({ width: 864, height: 800, deviceScaleFactor: 1 });

    // Ensure screen CSS (not print CSS) is applied and wait for network + fonts
    await page.emulateMediaType("screen");
    await page.goto(gotoRoute.toString(), {
      waitUntil: "networkidle0",
      timeout: PUPPETEER_TIMEOUTS.PAGE_LOAD,
    });
    try {
      await Promise.race([
        page.evaluate(() => (window as any).document.fonts?.ready),
        new Promise((resolve) =>
          setTimeout(resolve, PUPPETEER_TIMEOUTS.FONT_READY)
        ),
      ]);
    } catch (err) {
      console.debug("Skipping font readiness wait:", err);
    }

    // Compute full page height to preserve layout as seen on screen
    const heightMetrics = await page.evaluate(() => {
      const body = document.body;
      const html = document.documentElement;

      // Also check the main element's height
      const main = document.querySelector('main');
      const mainHeight = main?.scrollHeight || 0;

      return {
        bodyScrollHeight: body.scrollHeight,
        bodyOffsetHeight: body.offsetHeight,
        htmlClientHeight: html.clientHeight,
        htmlScrollHeight: html.scrollHeight,
        htmlOffsetHeight: html.offsetHeight,
        mainHeight: mainHeight,
      };
    });

    const fullHeight = Math.max(
      heightMetrics.bodyScrollHeight,
      heightMetrics.bodyOffsetHeight,
      heightMetrics.htmlClientHeight,
      heightMetrics.htmlScrollHeight,
      heightMetrics.htmlOffsetHeight,
      heightMetrics.mainHeight,
    );
    const pdfBuffer = await page.pdf({
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
      width: "756px",
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
    console.error("=== PDF GENERATION FAILED ===");
    console.error("Error:", error.message);
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
