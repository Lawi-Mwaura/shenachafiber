import { chromium } from "playwright-core";

const browser = await chromium.launch({ executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await page.goto("http://127.0.0.1:3100/cctv", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Submit request/i }).click();
  await page.locator(".error-summary").waitFor();
  const state = await page.evaluate(() => {
    const input = document.querySelector('input[aria-invalid="true"]');
    const select = document.querySelector('select[aria-invalid="true"]');
    const style = (node) => node ? ({ borderColor: getComputedStyle(node).borderColor, backgroundColor: getComputedStyle(node).backgroundColor }) : null;
    return { focusedClass: document.activeElement?.className || "", invalidInput: style(input), invalidSelect: style(select) };
  });
  await page.screenshot({ path: "qa/audit-current/13-cctv-mobile-error.png", fullPage: true });
  console.log(JSON.stringify(state));
} finally {
  await browser.close();
}
