import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright-core";

const baseUrl = process.env.QA_BASE_URL || "http://localhost:3003";
const outputDir = "qa/audit-implemented";
const executablePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const routes = [
  ["01", "home", "/"],
  ["02", "about", "/about"],
  ["03", "fibre-internet", "/fibre-internet"],
  ["04", "cctv", "/cctv"],
  ["05", "biometric-access", "/biometric-access"],
  ["06", "coverage", "/coverage"],
  ["07", "contact", "/contact"],
  ["08", "enquire", "/enquire"],
  ["09", "help", "/help"],
  ["10", "privacy", "/privacy"],
];
const viewports = [
  ["desktop", { width: 1440, height: 1000 }],
  ["mobile", { width: 375, height: 812 }],
];

await mkdir(outputDir, { recursive: true });
const browser = await chromium.launch({ executablePath, headless: true });
const evidence = [];

async function prepare(page, url) {
  const response = await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
  if (!response?.ok()) throw new Error(`${url}: HTTP ${response?.status()}`);
  await page.evaluate(async () => {
    await document.fonts.ready;
    const height = document.documentElement.scrollHeight;
    for (let y = 0; y < height; y += Math.max(500, innerHeight * 0.75)) {
      scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 45));
    }
    scrollTo(0, 0);
  });
  await page.waitForTimeout(180);
}

try {
  for (const [viewportName, viewport] of viewports) {
    const context = await browser.newContext({ viewport, reducedMotion: "no-preference" });
    const page = await context.newPage();
    for (const [number, slug, route] of routes) {
      await prepare(page, `${baseUrl}${route}`);
      const file = `${outputDir}/${number}-${slug}-${viewportName}.png`;
      const metrics = await page.evaluate(() => {
        const html = document.documentElement;
        const bodyText = document.body.innerText;
        const images = [...document.images].map((img) => ({
          alt: img.alt,
          complete: img.complete,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          width: Math.round(img.getBoundingClientRect().width),
          height: Math.round(img.getBoundingClientRect().height),
        }));
        const duplicateIds = [...document.querySelectorAll("[id]")]
          .map((node) => node.id)
          .filter((id, index, all) => all.indexOf(id) !== index)
          .filter((id, index, all) => all.indexOf(id) === index);
        return {
          title: document.title,
          h1: document.querySelector("h1")?.textContent?.trim() || "",
          width: html.clientWidth,
          scrollWidth: html.scrollWidth,
          height: html.scrollHeight,
          bodyTextLength: bodyText.length,
          images,
          duplicateIds,
        };
      });
      if (!metrics.h1 || metrics.bodyTextLength < 80) throw new Error(`${route} ${viewportName}: wrong or incomplete page`);
      if (metrics.images.some((image) => !image.complete || !image.naturalWidth)) throw new Error(`${route} ${viewportName}: unloaded image`);
      await page.screenshot({ path: file, fullPage: true });
      evidence.push({ number, slug, route, viewport: viewportName, file, metrics });
      console.log(`captured ${file}`);
    }
    await context.close();
  }

  const mobile = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const page = await mobile.newPage();
  await page.route("**/api/leads", (route) => route.fulfill({
    status: 400,
    contentType: "application/json",
    body: JSON.stringify({ saved: false, message: "Review the highlighted fields and try again.", fieldErrors: { location: "Enter the property location.", building: "Enter the building name.", unitNumber: "Enter the house or unit number.", name: "Enter your full name.", phone: "Enter a valid phone number.", whatsapp: "Enter a valid WhatsApp number.", consent: "Confirm that we may use these details to respond." } }),
  }));
  await prepare(page, `${baseUrl}/`);
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.waitForTimeout(180);
  await page.screenshot({ path: `${outputDir}/11-home-mobile-menu.png`, fullPage: false });
  const menuMetrics = await page.locator("#primary-navigation").evaluate((node) => {
    const rect = node.getBoundingClientRect();
    const header = document.querySelector(".site-header")?.getBoundingClientRect();
    return { top: rect.top, bottom: rect.bottom, width: rect.width, headerBottom: header?.bottom ?? null };
  });
  await page.keyboard.press("Escape");
  await prepare(page, `${baseUrl}/coverage`);
  await page.getByRole("button", { name: /Submit request/i }).click();
  await page.locator(".error-summary").waitFor();
  await page.waitForTimeout(180);
  await page.screenshot({ path: `${outputDir}/12-coverage-mobile-error.png`, fullPage: true });
  const errorMetrics = await page.evaluate(() => ({
    focusedClass: document.activeElement?.className || "",
    errorCount: document.querySelectorAll(".field-error").length,
    invalidSelectCount: document.querySelectorAll('select[aria-invalid="true"]').length,
  }));
  await mobile.close();

  await writeFile(`${outputDir}/capture-metrics.json`, `${JSON.stringify({ baseUrl, evidence, menuMetrics, errorMetrics }, null, 2)}\n`, "utf8");
  console.log(JSON.stringify({ count: evidence.length, menuMetrics, errorMetrics }, null, 2));
} finally {
  await browser.close();
}
