import { chromium } from "playwright-core";

const browser = await chromium.launch({ executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", headless: true });
try {
  for (const [name, viewport] of [["desktop", { width: 1440, height: 1000 }], ["mobile", { width: 375, height: 812 }]]) {
    const page = await browser.newPage({ viewport });
    await page.goto("http://127.0.0.1:3100/fibre-internet", { waitUntil: "networkidle" });
    const section = page.locator(".resident-section .fiber-ready-section");
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    const state = await section.evaluate((node) => {
      const image = node.querySelector("img");
      const copy = node.querySelector(".fiber-ready-board-copy");
      const rect = node.getBoundingClientRect();
      const imageRect = image?.getBoundingClientRect();
      const copyRect = copy?.getBoundingClientRect();
      return {
        scrollY,
        section: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
        image: image ? { complete: image.complete, naturalWidth: image.naturalWidth, opacity: getComputedStyle(image).opacity, display: getComputedStyle(image).display, rect: imageRect && { top: imageRect.top, left: imageRect.left, width: imageRect.width, height: imageRect.height } } : null,
        copy: copy ? { opacity: getComputedStyle(copy).opacity, display: getComputedStyle(copy).display, rect: copyRect && { top: copyRect.top, left: copyRect.left, width: copyRect.width, height: copyRect.height } } : null,
      };
    });
    await page.screenshot({ path: `qa/audit-current/03-fibre-internet-${name}-poster-check.png`, fullPage: false });
    await page.screenshot({ path: `qa/audit-current/03-fibre-internet-${name}-recapture.png`, fullPage: true });
    console.log(name, JSON.stringify(state));
    await page.close();
  }
} finally {
  await browser.close();
}
