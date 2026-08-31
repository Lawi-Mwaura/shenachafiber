import { chromium } from "playwright-core";

const baseUrl = "http://localhost:3003";
const executablePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const routes = ["/", "/about", "/fibre-internet", "/cctv", "/biometric-access", "/coverage", "/contact", "/enquire", "/help", "/privacy"];
const browser = await chromium.launch({ executablePath, headless: true });
const results = { routes: [], menu: [], deepLinks: [], forms: {}, reducedMotion: {}, consoleErrors: [] };

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function watch(page, label) {
  page.on("pageerror", (error) => results.consoleErrors.push(`${label}: pageerror ${error.message}`));
  page.on("console", (message) => {
    const location = message.location().url || "unknown-url";
    if (message.type() === "error" && !location.endsWith("/favicon.ico")) results.consoleErrors.push(`${label}: ${message.text()} (${location})`);
  });
}

try {
  for (const viewport of [{ width: 375, height: 812 }, { width: 390, height: 844 }, { width: 768, height: 1024 }, { width: 1024, height: 768 }, { width: 1440, height: 1000 }]) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    await watch(page, `${viewport.width}px`);
    for (const route of routes) {
      const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
      const metric = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth, duplicateIds: [...document.querySelectorAll("[id]")].map((node) => node.id).filter((id, index, all) => all.indexOf(id) !== index) }));
      assert(response?.ok(), `${route} returned ${response?.status()}`);
      assert(metric.scrollWidth === metric.width, `${route} overflows horizontally at ${viewport.width}px`);
      assert(metric.duplicateIds.length === 0, `${route} has duplicate IDs: ${metric.duplicateIds.join(", ")}`);
      results.routes.push({ route, viewport: viewport.width, ...metric });
    }
    await context.close();
  }

  for (const width of [375, 768, 1024]) {
    const context = await browser.newContext({ viewport: { width, height: 812 } });
    const page = await context.newPage();
    await page.goto(baseUrl, { waitUntil: "networkidle" });
    const trigger = page.getByRole("button", { name: "Open menu" });
    await trigger.click();
    const open = await page.evaluate(() => {
      const header = document.querySelector(".site-header")?.getBoundingClientRect();
      const nav = document.querySelector("#primary-navigation")?.getBoundingClientRect();
      const scrim = document.querySelector(".menu-scrim");
      return { headerBottom: header?.bottom, navTop: nav?.top, mainInert: document.querySelector("main")?.inert, overflow: document.body.style.overflow, activeText: document.activeElement?.textContent?.trim(), scrimBackground: scrim ? getComputedStyle(scrim).backgroundColor : "missing", scrimHeight: scrim?.getBoundingClientRect().height };
    });
    assert(open.headerBottom === open.navTop, `menu/header geometry mismatch at ${width}px`);
    assert(open.mainInert === true && open.overflow === "hidden", `background not isolated at ${width}px`);
    assert(open.activeText === "About us", `first menu item not focused at ${width}px`);
    assert(open.scrimBackground !== "rgba(0, 0, 0, 0)" && open.scrimHeight > 0, `scrim not visible at ${width}px`);
    await page.keyboard.press("Escape");
    const closed = await page.evaluate(() => ({ open: document.querySelector("#primary-navigation")?.classList.contains("is-open"), mainInert: document.querySelector("main")?.inert, overflow: document.body.style.overflow, activeLabel: document.activeElement?.getAttribute("aria-label") }));
    assert(!closed.open && closed.mainInert === false && closed.overflow === "" && closed.activeLabel === "Open menu", `menu did not cleanly close at ${width}px`);
    await trigger.click();
    await page.locator(".menu-scrim").click({ position: { x: 2, y: 700 } });
    assert(!(await page.locator("#primary-navigation").evaluate((node) => node.classList.contains("is-open"))), `scrim did not close menu at ${width}px`);
    results.menu.push({ width, open, closed });
    await context.close();
  }

  const deepContext = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const deepPage = await deepContext.newPage();
  for (const [hash, expectedTab] of [["property-meeting", "property-tab"], ["resident-inquiry", "resident-tab"]]) {
    await deepPage.goto(`${baseUrl}/fibre-internet#${hash}`, { waitUntil: "networkidle" });
    await deepPage.waitForTimeout(150);
    const state = await deepPage.evaluate(({ hash, expectedTab }) => {
      const target = document.getElementById(hash)?.getBoundingClientRect();
      const header = document.querySelector(".site-header")?.getBoundingClientRect();
      return { top: target?.top, headerBottom: header?.bottom, selected: document.getElementById(expectedTab)?.getAttribute("aria-selected") };
    }, { hash, expectedTab });
    assert(state.selected === "true", `${hash} did not select the correct journey`);
    assert((state.top ?? 0) >= (state.headerBottom ?? 0), `${hash} is obstructed by the sticky header`);
    results.deepLinks.push({ hash, ...state });
  }
  await deepContext.close();

  const formContext = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const formPage = await formContext.newPage();
  await formPage.goto(`${baseUrl}/enquire`, { waitUntil: "networkidle" });
  assert(await formPage.locator(".field-grid").count() === 0, "general enquiry preselects a journey before user action");
  await formPage.locator("#general-enquiry-enquiryKind").selectOption("cctv_quote");
  assert(await formPage.locator("#general-enquiry-propertyType").isVisible(), "CCTV journey fields did not appear after selection");
  results.forms.progressiveDisclosure = true;
  await formContext.close();

  const errorContext = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const errorPage = await errorContext.newPage();
  await errorPage.route("**/api/leads", (route) => route.fulfill({ status: 400, contentType: "application/json", body: JSON.stringify({ saved: false, message: "Review the highlighted fields and try again.", fieldErrors: { location: "Enter the property location.", propertyType: "Choose the property type.", name: "Enter your full name.", phone: "Enter a valid phone number.", contactPreference: "Choose a contact method.", consent: "Confirm that we may use these details to respond." } }) }));
  await errorPage.goto(`${baseUrl}/cctv`, { waitUntil: "networkidle" });
  await errorPage.getByRole("button", { name: /Submit request/i }).click();
  await errorPage.locator(".error-summary").waitFor();
  await errorPage.waitForTimeout(150);
  const errorState = await errorPage.evaluate(() => {
    const input = document.querySelector('input[aria-invalid="true"]');
    const select = document.querySelector('select[aria-invalid="true"]');
    const style = (node) => node ? { border: getComputedStyle(node).borderColor, background: getComputedStyle(node).backgroundColor } : null;
    return { activeClass: document.activeElement?.className, summaryHeight: document.querySelector(".error-summary")?.getBoundingClientRect().height, input: style(input), select: style(select), requiredSelect: select?.hasAttribute("required") };
  });
  assert(errorState.activeClass.includes("error-summary"), "error summary did not receive focus");
  assert(errorState.input?.border === errorState.select?.border && errorState.input?.background === errorState.select?.background, "invalid select styling differs from invalid inputs");
  assert(errorState.requiredSelect === true && errorState.summaryHeight < 520, "error state semantics or mobile summary height failed");
  results.forms.errorState = errorState;
  await errorContext.close();

  const motionContext = await browser.newContext({ viewport: { width: 375, height: 812 }, reducedMotion: "reduce" });
  const motionPage = await motionContext.newPage();
  await motionPage.goto(baseUrl, { waitUntil: "networkidle" });
  results.reducedMotion = await motionPage.evaluate(() => ({ media: matchMedia("(prefers-reduced-motion: reduce)").matches, scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior, transitionDuration: getComputedStyle(document.querySelector(".button")).transitionDuration }));
  assert(results.reducedMotion.media && results.reducedMotion.scrollBehavior === "auto", "reduced-motion behavior is not active");
  await motionContext.close();

  assert(results.consoleErrors.length === 0, `browser console errors: ${results.consoleErrors.join(" | ")}`);
  console.log(JSON.stringify(results, null, 2));
} finally {
  await browser.close();
}
