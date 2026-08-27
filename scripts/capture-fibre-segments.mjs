import { chromium } from "playwright-core";

const browser = await chromium.launch({ executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", headless: true });
try {
  for (const [name, viewport] of [["desktop", { width: 1440, height: 1000 }], ["mobile", { width: 375, height: 812 }]]) {
    const page = await browser.newPage({ viewport });
    await page.goto("http://127.0.0.1:3100/fibre-internet", { waitUntil: "networkidle" });
    await page.screenshot({ path: `qa/audit-current/03a-fibre-internet-${name}-top.png`, fullPage: false });
    for (const [part, selector] of [["owner", ".owner-section"], ["resident", ".resident-section .fiber-ready-section"], ["resident-form", ".resident-section .embedded-form-section"]]) {
      const locator = page.locator(selector);
      await locator.scrollIntoViewIfNeeded();
      await page.waitForTimeout(220);
      await page.screenshot({ path: `qa/audit-current/03${part === "owner" ? "b" : part === "resident" ? "c" : "d"}-fibre-internet-${name}-${part}.png`, fullPage: false });
    }
    await page.close();
  }
} finally {
  await browser.close();
}
