import { chromium } from "playwright-core";

const browser = await chromium.launch({ executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", headless: true });
try {
  for (const [number, slug, route] of [["12", "coverage", "/coverage"], ["13", "cctv", "/cctv"]]) {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    await page.route("**/api/leads", (route) => route.fulfill({ status: 400, contentType: "application/json", body: JSON.stringify({ saved: false, message: "Review the highlighted fields and try again.", fieldErrors: route.request().postData()?.includes("cctv_quote") ? { location: "Enter the property location.", propertyType: "Choose the property type.", name: "Enter your full name.", phone: "Enter a valid phone number.", contactPreference: "Choose a contact method.", consent: "Confirm that we may use these details to respond." } : { location: "Enter the property location.", building: "Enter the building name.", unitNumber: "Enter the house or unit number.", name: "Enter your full name.", phone: "Enter a valid phone number.", whatsapp: "Enter a valid WhatsApp number.", consent: "Confirm that we may use these details to respond." } }) }));
    await page.goto(`http://localhost:3003${route}`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: /Submit request/i }).click();
    const summary = page.locator(".error-summary");
    await summary.waitFor();
    await summary.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({ path: `qa/audit-implemented/${number}-${slug}-mobile-error-viewport.png`, fullPage: false });
    await page.close();
  }
} finally {
  await browser.close();
}
