import { chromium } from "playwright-core";

const browser = await chromium.launch({ executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", headless: true });
try {
  for (const [number, slug, route] of [["12", "coverage", "/coverage"], ["13", "cctv", "/cctv"]]) {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    await page.goto(`http://127.0.0.1:3100${route}`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: /Submit request/i }).click();
    const summary = page.locator(".error-summary");
    await summary.waitFor();
    await summary.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({ path: `qa/audit-current/${number}-${slug}-mobile-error-viewport.png`, fullPage: false });
    await page.close();
  }
} finally {
  await browser.close();
}
