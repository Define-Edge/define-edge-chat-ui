/**
 * Puppeteer utilities for PDF generation and browser automation
 */

// URL to the Chromium binary package hosted in /public
// In production, uses the Vercel project URL. For local dev, uses fallback.
const CHROMIUM_PACK_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/chromium-pack.tar`
  : "https://github.com/gabenunez/puppeteer-on-vercel/raw/refs/heads/main/example/chromium-dont-use-in-prod.tar";

// Timeout constants
export const PUPPETEER_TIMEOUTS = {
  PAGE_LOAD: 30000, // 30 seconds
  FONT_READY: 5000, // 5 seconds
} as const;

// Cache the Chromium executable path to avoid re-downloading on subsequent requests
let cachedExecutablePath: string | null = null;
let downloadPromise: Promise<string> | null = null;

/**
 * Downloads and caches the Chromium executable path.
 * Uses a download promise to prevent concurrent downloads.
 */
export async function getChromiumPath(): Promise<string> {
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

/**
 * Creates browser launch options based on environment
 */
export async function getBrowserLaunchOptions() {
  const isVercel = !!process.env.VERCEL_ENV;
  let puppeteer: any;
  let launchOptions: any = {
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

  return { puppeteer, launchOptions };
}
