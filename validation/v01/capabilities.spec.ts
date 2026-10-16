import { expect, test } from "@playwright/test";

test("V01 actual application capabilities", async ({ page, browser, browserName }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto("/routine/");
  await expect(page.getByRole("heading", { name: "My daily routine" })).toBeVisible();
  const capabilities = await page.evaluate(async () => {
    const key = "v01-synthetic-capability-probe";
    let storage: boolean;
    try {
      localStorage.setItem(key, "synthetic");
      storage = localStorage.getItem(key) === "synthetic";
      localStorage.removeItem(key);
      storage = storage && localStorage.getItem(key) === null;
    } catch { storage = false; }
    let lockExecuted = false;
    if (navigator.locks) await navigator.locks.request("v01-synthetic-capability-probe", () => { lockExecuted = true; });
    return { origin: location.origin, secureContext: isSecureContext, storage, locksAvailable: !!navigator.locks, lockExecuted };
  });
  await testInfo.attach("capabilities", { body: JSON.stringify({ browserName, runtimeVersion: browser.version(), mode: "headless", viewport: page.viewportSize(), ...capabilities, errors }), contentType: "application/json" });
  expect(capabilities.origin).toBe("http://127.0.0.1:4173");
  expect(capabilities.secureContext).toBe(true);
  expect(capabilities.storage).toBe(true);
  // Capability absence is evidence, not a fabricated pass for history support.
  expect(capabilities.lockExecuted).toBe(capabilities.locksAvailable);
  expect(errors).toEqual([]);
});

test("V01 denied Web Locks fails closed while R01 remains usable", async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, "locks", { value: { request: () => Promise.reject(new Error("synthetic lock denial")) } }));
  await page.goto("/routine/");
  await expect(page.getByRole("status", { name: "History status" })).toContainText("could not be verified");
  const history = page.getByRole("checkbox", { name: "Enable seven-day history in this browser" });
  await history.click();
  await expect(history).not.toBeChecked();
  expect(await page.evaluate(() => localStorage.getItem("smile-track:routine-history:1"))).toBeNull();
  const brush = page.getByRole("checkbox", { name: "Brushed teeth", exact: true });
  await brush.check();
  await expect(brush).toBeChecked();
});
