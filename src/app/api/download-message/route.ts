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
  const { threadId, analysisId } = await request.json();
  if (!threadId || !analysisId) {
    return new NextResponse("Please provide a threadId and analysisId.", {
      status: 400,
    });
  }

  const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const gotoRoute = new URL(
    `${origin}/api/download-message/stock-analysis-report`,
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

    const headerTemplate = `
      <div style="width: 100%; height: 4.5rem; background: linear-gradient(to right, #063baaff, #00004fff); color: white; display: flex; align-items: center; padding: 0 3.5rem; font-family: sans-serif; -webkit-print-color-adjust: exact;">
        <div style="flex: 1; font-size: 1.25rem; line-height: 1.75rem;">
          FinSharpe's <strong style="color: #33CC99;">Insight360</strong>
        </div>
        <div style="margin-top: 0.5rem; text-align: right;">
          <div style="font-size: 1.25rem; line-height: 0.75rem;">
            FinSharpe
          </div>
          <span style="font-size: 0.65rem;">
            Investment Advisors
          </span>
        </div>
      </div>
    `;

    const footerTemplate = `
      <div style="width: 100%; height: 4.5rem; background: linear-gradient(to right, #00004fff, #063baaff); color: white; display: flex; align-items: center; padding: 0 3.5rem; font-family: sans-serif; -webkit-print-color-adjust: exact; font-size: 10px;">
        <div style="flex: 1; margin-top: 0.25rem;">
          <div style="font-size: 0.875rem; line-height: 0.75rem;">
            Copyright @FinSharpe Investment Advisors
          </div>
          <span style="font-size: 0.65rem;">*T & C Apply</span>
        </div>
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <svg width="75" height="30" viewBox="0 0 51 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <mask id="mask0_8_146" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="12" width="4" height="8">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M3.10968 19.5853V12.1835H0.898376V19.5853H3.10968Z" fill="white"/>
            </mask>
            <g mask="url(#mask0_8_146)">
              <path d="M161.276 38.8898H-434V-803H161.276V38.8898Z" fill="url(#paint0_linear_8_146)"/>
            </g>
            <mask id="mask1_8_146" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="5" y="10" width="3" height="10">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M7.89343 19.5853V10.6482H5.68243V19.5853H7.89343Z" fill="white"/>
            </mask>
            <g mask="url(#mask1_8_146)">
              <path d="M161.276 38.8898H-434V-803H161.276V38.8898Z" fill="url(#paint1_linear_8_146)"/>
            </g>
            <mask id="mask2_8_146" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="10" y="9" width="3" height="11">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M12.6774 19.5853V9.1127H10.4661V19.5853H12.6774Z" fill="white"/>
            </mask>
            <g mask="url(#mask2_8_146)">
              <path d="M161.276 38.8898H-434V-803H161.276V38.8898Z" fill="url(#paint2_linear_8_146)"/>
            </g>
            <mask id="mask3_8_146" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="15" y="7" width="3" height="13">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M17.4613 19.5853V7.5772H15.2502V19.5853H17.4613Z" fill="white"/>
            </mask>
            <g mask="url(#mask3_8_146)">
              <path d="M161.276 38.8898H-434V-803H161.276V38.8898Z" fill="url(#paint3_linear_8_146)"/>
            </g>
            <mask id="mask4_8_146" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="34" y="15" width="3" height="5">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M34.386 19.5853V15.8844H36.597V19.5853H34.386Z" fill="white"/>
            </mask>
            <g mask="url(#mask4_8_146)">
              <path d="M161.276 38.8898H-434V-803H161.276V38.8898Z" fill="url(#paint4_linear_8_146)"/>
            </g>
            <mask id="mask5_8_146" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="29" y="13" width="3" height="7">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M29.602 19.5853V13.0067H31.8131V19.5853H29.602Z" fill="white"/>
            </mask>
            <g mask="url(#mask5_8_146)">
              <path d="M161.276 38.8898H-434V-803H161.276V38.8898Z" fill="url(#paint5_linear_8_146)"/>
            </g>
            <mask id="mask6_8_146" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="24" y="9" width="4" height="11">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M24.8183 19.5853V9.1127H27.0293V19.5853H24.8183Z" fill="white"/>
            </mask>
            <g mask="url(#mask6_8_146)">
              <path d="M161.276 38.8898H-434V-803H161.276V38.8898Z" fill="url(#paint6_linear_8_146)"/>
            </g>
            <mask id="mask7_8_146" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="20" y="5" width="3" height="15">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M20.0342 19.5853V5.3661H22.2452V19.5853H20.0342Z" fill="white"/>
            </mask>
            <g mask="url(#mask7_8_146)">
              <path d="M161.276 38.8898H-434V-803H161.276V38.8898Z" fill="url(#paint7_linear_8_146)"/>
            </g>
            <mask id="mask8_8_146" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="39" y="12" width="3" height="8">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M41.3811 19.5853V12.6614H39.1701V19.5853H41.3811Z" fill="white"/>
            </mask>
            <g mask="url(#mask8_8_146)">
              <path d="M161.276 38.8898H-434V-803H161.276V38.8898Z" fill="url(#paint8_linear_8_146)"/>
            </g>
            <mask id="mask9_8_146" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="43" y="7" width="4" height="13">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M46.1653 19.5853V7.2778H43.9542V19.5853H46.1653Z" fill="white"/>
            </mask>
            <g mask="url(#mask9_8_146)">
              <path d="M161.276 38.8898H-434V-803H161.276V38.8898Z" fill="url(#paint9_linear_8_146)"/>
            </g>
            <mask id="mask10_8_146" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="48" y="-1" width="3" height="21">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M50.9503 19.5853V-0.00720215H48.7393V19.5853H50.9503Z" fill="white"/>
            </mask>
            <g mask="url(#mask10_8_146)">
              <path d="M161.276 38.8898H-434V-803H161.276V38.8898Z" fill="url(#paint10_linear_8_146)"/>
            </g>
            <defs>
              <linearGradient id="paint0_linear_8_146" x1="1.99993" y1="19.5898" x2="1.99993" y2="12.1798" gradientUnits="userSpaceOnUse">
                <stop stop-color="#0040FF"/>
                <stop offset="1" stop-color="#33CC99"/>
              </linearGradient>
              <linearGradient id="paint1_linear_8_146" x1="6.78991" y1="19.5898" x2="6.78991" y2="10.6498" gradientUnits="userSpaceOnUse">
                <stop stop-color="#0040FF"/>
                <stop offset="1" stop-color="#33CC99"/>
              </linearGradient>
              <linearGradient id="paint2_linear_8_146" x1="11.5699" y1="19.5898" x2="11.5699" y2="9.1098" gradientUnits="userSpaceOnUse">
                <stop stop-color="#0040FF"/>
                <stop offset="1" stop-color="#33CC99"/>
              </linearGradient>
              <linearGradient id="paint3_linear_8_146" x1="16.36" y1="19.5898" x2="16.36" y2="7.5798" gradientUnits="userSpaceOnUse">
                <stop stop-color="#0040FF"/>
                <stop offset="1" stop-color="#33CC99"/>
              </linearGradient>
              <linearGradient id="paint4_linear_8_146" x1="35.4899" y1="19.5898" x2="35.4899" y2="15.8798" gradientUnits="userSpaceOnUse">
                <stop stop-color="#0040FF"/>
                <stop offset="1" stop-color="#33CC99"/>
              </linearGradient>
              <linearGradient id="paint5_linear_8_146" x1="30.71" y1="19.5898" x2="30.71" y2="13.0098" gradientUnits="userSpaceOnUse">
                <stop stop-color="#0040FF"/>
                <stop offset="1" stop-color="#33CC99"/>
              </linearGradient>
              <linearGradient id="paint6_linear_8_146" x1="25.92" y1="19.5898" x2="25.92" y2="9.1098" gradientUnits="userSpaceOnUse">
                <stop stop-color="#0040FF"/>
                <stop offset="1" stop-color="#33CC99"/>
              </linearGradient>
              <linearGradient id="paint7_linear_8_146" x1="21.1399" y1="19.5898" x2="21.1399" y2="5.3698" gradientUnits="userSpaceOnUse">
                <stop stop-color="#0040FF"/>
                <stop offset="1" stop-color="#33CC99"/>
              </linearGradient>
              <linearGradient id="paint8_linear_8_146" x1="40.28" y1="19.5898" x2="40.28" y2="12.6598" gradientUnits="userSpaceOnUse">
                <stop stop-color="#0040FF"/>
                <stop offset="1" stop-color="#33CC99"/>
              </linearGradient>
              <linearGradient id="paint9_linear_8_146" x1="45.0601" y1="19.5898" x2="45.0601" y2="7.2798" gradientUnits="userSpaceOnUse">
                <stop stop-color="#0040FF"/>
                <stop offset="1" stop-color="#33CC99"/>
              </linearGradient>
              <linearGradient id="paint10_linear_8_146" x1="49.84" y1="19.5898" x2="49.84" y2="-0.010199" gradientUnits="userSpaceOnUse">
                <stop stop-color="#0040FF"/>
                <stop offset="1" stop-color="#33CC99"/>
              </linearGradient>
            </defs>
          </svg>
          <div style="display: flex; align-items: center; gap: 0.25rem;">
            Pg. <span class="pageNumber"></span> 
            <svg width="2" height="10" viewBox="0 0 2 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M58.2756 30.8898H-537V-811H58.2756V30.8898Z" fill="url(#paint0_linear_1_475)"/>
              <defs>
                <linearGradient id="paint0_linear_1_475" x1="0.950067" y1="9.01977" x2="0.950067" y2="0.85977" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#0040FF"/>
                  <stop offset="1" stop-color="#33CC99"/>
                </linearGradient>
              </defs>
            </svg>
            <span class="totalPages"></span>
          </div>
        </div>
      </div>
    `;

    // -----------------------------------------------------------------------
    // 2-Pass PDF Generation Strategy
    // -----------------------------------------------------------------------
    // Pass 1: Generate the Cover Page (Page 1)
    // - No header/footer
    // - No margins (full bleed for background image)
    // -----------------------------------------------------------------------
    const coverPdfBuffer = await page.pdf({
      printBackground: true,
      displayHeaderFooter: false, // Hide header/footer explicitly
      pageRanges: "1",            // Only the first page
      margin: { top: "0px", right: "0px", bottom: "0px", left: "0px" },
      width: "864px",
      height: "1123px",
      scale: 1,
    });

    // -----------------------------------------------------------------------
    // Pass 2: Generate Content Pages (Page 2 onwards)
    // - With header/footer
    // - With margins to accommodate header/footer
    // -----------------------------------------------------------------------
    let contentPdfBuffer: Uint8Array | null = null;
    try {
      contentPdfBuffer = await page.pdf({
        printBackground: true,
        displayHeaderFooter: true,
        headerTemplate,
        footerTemplate,
        pageRanges: "2-",           // From page 2 to the end
        margin: { top: "72px", right: "0px", bottom: "72px", left: "0px" },
        width: "864px",
        height: "1123px",
        scale: 1,
      });
    } catch (error: any) {
      console.log("Pass 2 skipped (likely single page document):", error.message);
    }

    // -----------------------------------------------------------------------
    // Merge the two PDFs
    // -----------------------------------------------------------------------
    const { PDFDocument } = await import("pdf-lib");

    // Create a new document
    const mergedPdf = await PDFDocument.create();

    // Load cover PDF
    const coverPdf = await PDFDocument.load(coverPdfBuffer);
    const coverPages = await mergedPdf.copyPages(coverPdf, coverPdf.getPageIndices());
    coverPages.forEach((page) => mergedPdf.addPage(page));

    // Load content PDF if it exists
    if (contentPdfBuffer) {
      const contentPdf = await PDFDocument.load(contentPdfBuffer);
      const contentPages = await mergedPdf.copyPages(contentPdf, contentPdf.getPageIndices());
      contentPages.forEach((page) => mergedPdf.addPage(page));
    }

    // Save the merged PDF
    const mergedPdfBytes = await mergedPdf.save();
    const finalPdfBuffer = Buffer.from(mergedPdfBytes);

    return new NextResponse(finalPdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="stock-analysis-report.pdf"',
      },
    });
  } catch (error: any) {
    console.error("Screenshot error:", error);
    console.error("Error stack:", error.stack);
    return new NextResponse(
      `An error occurred while generating the screenshot: ${error.message}`,
      { status: 500 }
    );
  } finally {
    // Always clean up browser resources
    if (browser) {
      await browser.close();
    }
  }
}
