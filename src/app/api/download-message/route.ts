import { NextRequest, NextResponse } from "next/server";
import {
  getBrowserLaunchOptions,
  PUPPETEER_TIMEOUTS,
} from "@/lib/puppeteer-utils";

export async function POST(request: NextRequest) {
  let body;
  try {
    body = await request.json();
  } catch {
    return new NextResponse("Invalid request body: expected valid JSON.", {
      status: 400,
    });
  }

  const {
    threadId,
    analysisId,
    analysisType = "stock_analysis",
    selectedSections,
    personalComment,
  } = body;
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
  let reportPath: string;
  if (analysisType === "mf_analysis") {
    reportPath = "mf-analysis-report";
  } else if (analysisType === "pf_analysis") {
    reportPath = "pf-analysis-report";
  } else {
    reportPath = "stock-analysis-report";
  }

  const gotoRoute = new URL(`${origin}/api/download-message/${reportPath}`);
  gotoRoute.searchParams.set("threadId", threadId);
  gotoRoute.searchParams.set("analysisId", analysisId);

  // Pass selected sections and personal comment to the report page
  if (selectedSections && Array.isArray(selectedSections)) {
    gotoRoute.searchParams.set(
      "selectedSections",
      JSON.stringify(selectedSections),
    );
  }
  if (personalComment) {
    const sanitizedComment = String(personalComment).slice(0, 2000);
    gotoRoute.searchParams.set("personalComment", sanitizedComment);
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
          setTimeout(resolve, PUPPETEER_TIMEOUTS.FONT_READY),
        ),
      ]);
    } catch (err) {
      console.warn("Font readiness check failed:", err);
    }

    // Compute full page height to preserve layout as seen on screen
    const heightMetrics = await page.evaluate(() => {
      const body = document.body;
      const html = document.documentElement;

      // Also check the main element's height
      const main = document.querySelector("main");
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

    const pdfOptions = {
      printBackground: true,
      ...(reportPath === "pf-analysis-report" || reportPath === "stock-analysis-report"
        ? { format: "A4" }
        : {
            margin: { top: "0", right: "0", bottom: "0", left: "0" },
            width: "756px",
            height: `${fullHeight}px`,
          }),
      scale: 1,
    };
    const pdfBuffer = await page.pdf(pdfOptions);
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="report.pdf"',
      },
    });
  } catch (error: unknown) {
    console.error("PDF generation error:", error);
    const message =
      error instanceof Error ? error.message : "Unknown error";
    return new NextResponse(
      `An error occurred while generating the PDF report: ${message}`,
      { status: 500 },
    );
  } finally {
    // Always clean up browser resources
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.warn("Failed to close browser:", closeError);
      }
    }
  }
}
