import { mkdir } from "node:fs/promises";
import { chromium } from "playwright-core";

const baseUrl = process.env.QA_BASE_URL || "http://localhost:3000";
const executablePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const routes = ["/", "/about", "/fibre-internet", "/cctv", "/biometric-access", "/coverage", "/contact", "/enquire", "/help", "/privacy"];
const viewports = [{ name: "desktop", width: 1440, height: 1000 }, { name: "mobile", width: 375, height: 812 }];
const failures = [];
await mkdir("qa", { recursive: true });
console.log("qa: launching system Chrome");
const browser = await chromium.launch({ executablePath, headless: true });
console.log("qa: Chrome ready");

try {
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    for (const route of routes) {
      console.log(`qa: ${viewport.name} ${route}`);
      const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
      if (!response?.ok()) failures.push(`${viewport.name} ${route}: HTTP ${response?.status()}`);
      const h1Count = await page.locator("h1").count();
      if (h1Count !== 1) failures.push(`${viewport.name} ${route}: expected one h1, found ${h1Count}`);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (overflow > 1) failures.push(`${viewport.name} ${route}: horizontal overflow ${overflow}px`);
      const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < pageHeight; y += viewport.height * 0.8) { await page.evaluate((position) => window.scrollTo(0, position), y); await page.waitForTimeout(35); }
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(120);
      const slug = route === "/" ? "home" : route.slice(1).replaceAll("/", "-");
      await page.screenshot({ path: `qa/${slug}-${viewport.name}.png`, fullPage: true });
    }
    await context.close();
  }

  const context = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  const menu = page.getByRole("button", { name: "Open menu" });
  await menu.click();
  if (!(await page.getByRole("navigation", { name: "Primary navigation" }).isVisible())) failures.push("mobile menu did not open");
  await page.keyboard.press("Escape");
  if (await page.getByRole("navigation", { name: "Primary navigation" }).isVisible()) failures.push("mobile menu did not close on Escape");

  await page.goto(`${baseUrl}/coverage`, { waitUntil: "networkidle" });
  const poster = page.locator(".fiber-ready-board-visual.full-poster img");
  const posterState = await poster.evaluate((image) => ({ naturalWidth: image.naturalWidth, naturalHeight: image.naturalHeight, width: image.getBoundingClientRect().width, height: image.getBoundingClientRect().height, fit: getComputedStyle(image).objectFit }));
  if (!posterState.naturalWidth || posterState.fit !== "contain") failures.push("full poster is not rendered uncropped");
  const posterHref = await page.locator(".fiber-ready-board-visual.full-poster").getAttribute("href");
  if (posterHref !== "/images/fiber-ready-board.png") failures.push("full poster link is missing");
  await page.getByRole("button", { name: /Submit request/i }).click();
  const summary = page.locator(".error-summary");
  await summary.waitFor();
  if (!(await summary.evaluate((element) => element === document.activeElement))) failures.push("validation error summary did not receive focus");

  for (const [legacy, expected] of [["/services/fiber-internet-nairobi", "/fibre-internet"], ["/services/fiber-internet-juja", "/fibre-internet"], ["/services/cctv-installation-nairobi", "/cctv"], ["/services/biometric-access-control-juja", "/biometric-access"]]) {
    await page.goto(`${baseUrl}${legacy}`, { waitUntil: "networkidle" });
    if (new URL(page.url()).pathname !== expected) failures.push(`${legacy} did not redirect to ${expected}`);
  }
  for (const endpoint of ["/sitemap.xml", "/robots.txt", "/manifest.webmanifest"]) {
    const response = await page.request.get(`${baseUrl}${endpoint}`);
    if (!response.ok()) failures.push(`${endpoint}: HTTP ${response.status()}`);
  }
  await context.close();
  console.log(JSON.stringify({ routes: routes.length, viewports: viewports.map(({ name, width }) => ({ name, width })), poster: posterState, failures }, null, 2));
  if (failures.length) process.exitCode = 1;
} finally {
  await browser.close();
}
