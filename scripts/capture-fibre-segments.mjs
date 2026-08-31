import { chromium } from "playwright-core";

const browser = await chromium.launch({ executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", headless: true });
try {
  for (const [name, viewport] of [["desktop", { width: 1440, height: 1000 }], ["mobile", { width: 375, height: 812 }]]) {
    const page = await browser.newPage({ viewport });
    await page.goto("http://localhost:3003/fibre-internet", { waitUntil: "networkidle" });
    await page.screenshot({ path: `qa/audit-implemented/03a-fibre-internet-${name}-top.png`, fullPage: false });
    for (const [part, selector] of [["board", ".fibre-board-section"], ["resident", "#resident-inquiry"], ["property", "#property-tab"]]) {
      if (part === "property") await page.locator("#property-tab").click();
      const locator = page.locator(selector);
      await locator.scrollIntoViewIfNeeded();
      await page.waitForTimeout(220);
      await page.screenshot({ path: `qa/audit-implemented/03-${part}-fibre-internet-${name}.png`, fullPage: false });
    }
    for (const hash of ["resident-inquiry", "property-meeting"]) {
      await page.goto(`http://localhost:3003/fibre-internet#${hash}`, { waitUntil: "networkidle" });
      await page.waitForTimeout(220);
      await page.screenshot({ path: `qa/audit-implemented/03-deeplink-${hash}-${name}.png`, fullPage: false });
    }
    await page.close();
  }
} finally {
  await browser.close();
}
