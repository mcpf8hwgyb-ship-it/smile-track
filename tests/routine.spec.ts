import { expect, test, type Page } from "@playwright/test";

const key = "smile-track:routine:1";
const today = "2026-10-12";
const sample = { version: 1, date: today, brushedTeeth: true, cleanedBetweenTeeth: false };
const brush = (page: Page) => page.getByRole("checkbox", { name: "Brushed teeth", exact: true });
const between = (page: Page) => page.getByRole("checkbox", { name: "Cleaned between teeth", exact: true });
const consent = (page: Page) => page.getByRole("checkbox", { name: "Save today’s check-in in this browser" });
const stored = (page: Page) => page.evaluate(k => localStorage.getItem(k), key);

test.use({ timezoneId: "America/New_York" });
test.beforeEach(async ({ page }) => {
  // UTC date is already the 13th: local date must remain the 12th.
  await page.clock.install({ time: new Date("2026-10-13T03:59:50Z") });
});

test("memory default, independent undo, explicit saving, restoration and erase", async ({ page, context }) => {
  const errors: string[] = [];
  const requests: { url: string; method: string; body: string | null }[] = [];
  page.on("pageerror", e => errors.push(e.message));
  page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
  page.on("request", r => requests.push({ url: r.url(), method: r.method(), body: r.postData() }));
  await page.addInitScript(() => {
    const original = Storage.prototype.setItem;
    Object.defineProperty(window, "routineWrites", { value: [], configurable: true });
    Storage.prototype.setItem = function(k, v) {
      (window as unknown as { routineWrites: string[] }).routineWrites.push(k);
      return original.call(this, k, v);
    };
  });
  await page.goto("/routine/");
  await expect(page.getByRole("heading", { name: "My daily routine" })).toBeVisible();
  await expect(brush(page)).toBeEnabled();
  await expect(brush(page)).not.toBeChecked();
  await expect(between(page)).not.toBeChecked();
  await expect(consent(page)).not.toBeChecked();
  await expect(page.getByText(`Today · ${today}`, { exact: true })).toBeVisible();
  await brush(page).check();
  await expect(between(page)).not.toBeChecked();
  await between(page).check();
  await brush(page).uncheck();
  await expect(between(page)).toBeChecked();
  await between(page).uncheck();
  await brush(page).check();
  expect(await stored(page)).toBeNull();
  expect(await page.evaluate(() => (window as unknown as { routineWrites: string[] }).routineWrites)).toEqual([]);
  await page.reload();
  await expect(brush(page)).not.toBeChecked();
  await brush(page).check();
  await consent(page).check();
  expect(JSON.parse((await stored(page))!)).toEqual(sample);
  await page.reload();
  await expect(brush(page)).toBeChecked();
  await expect(between(page)).not.toBeChecked();
  await expect(consent(page)).toBeChecked();
  await between(page).check();
  expect(JSON.parse((await stored(page))!)).toEqual({ ...sample, cleanedBetweenTeeth: true });
  await page.getByRole("button", { name: "Erase today-only record and turn off today-only saving" }).click();
  await expect(brush(page)).not.toBeChecked();
  await expect(between(page)).not.toBeChecked();
  await expect(consent(page)).not.toBeChecked();
  expect(await stored(page)).toBeNull();
  await brush(page).check();
  expect(await stored(page)).toBeNull();
  await page.reload();
  await expect(brush(page)).not.toBeChecked();
  expect(await context.cookies()).toEqual([]);
  expect(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length }))).toEqual({ local: 0, session: 0 });
  expect(requests.filter(({ url }) => new URL(url).origin !== "http://127.0.0.1:4173")).toEqual([]);
  expect(requests.every(({ url }) => !url.includes("brushedTeeth") && !url.includes("cleanedBetweenTeeth"))).toBe(true);
  expect(requests.every(r => r.method === "GET" && r.body === null)).toBe(true);
  expect(errors).toEqual([]);
});

test("local midnight expires memory and saved state without retaining consent", async ({ page }) => {
  await page.goto("/routine/");
  await brush(page).check();
  await consent(page).check();
  await page.clock.fastForward(11_000);
  await expect(page.getByText("Today · 2026-10-13", { exact: true })).toBeVisible();
  await expect(brush(page)).not.toBeChecked();
  await expect(consent(page)).not.toBeChecked();
  expect(await stored(page)).toBeNull();
  await between(page).check();
  expect(await stored(page)).toBeNull();
  await page.clock.setSystemTime(new Date("2026-10-14T14:00:00Z"));
  await page.evaluate(() => window.dispatchEvent(new Event("focus")));
  await expect(between(page)).not.toBeChecked();
});

test("stale, future and malformed storage is removed; unrelated data survives", async ({ page }) => {
  await page.goto("/routine/");
  for (const value of ["{broken", "null", "[]", JSON.stringify({ ...sample, version: 2 }), JSON.stringify({ ...sample, date: "2026-10-11" }), JSON.stringify({ ...sample, date: "2026-10-14" }), JSON.stringify({ ...sample, brushedTeeth: "yes" }), JSON.stringify({ ...sample, notes: "synthetic" })]) {
    await page.evaluate(({ key, value }) => { localStorage.setItem(key, value); localStorage.setItem("unrelated", "synthetic"); }, { key, value });
    await page.reload();
    await expect(brush(page)).toBeEnabled();
    await expect(brush(page)).not.toBeChecked();
    await expect(consent(page)).not.toBeChecked();
    expect(await stored(page)).toBeNull();
    expect(await page.evaluate(() => localStorage.getItem("unrelated"))).toBe("synthetic");
  }
});

for (const failure of ["get", "set", "silent-set", "remove"] as const) {
  test(`storage failure: ${failure} never claims a successful save or erase`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", e => errors.push(e.message));
    await page.goto("/routine/");
    if (failure === "remove") { await brush(page).check(); await consent(page).check(); }
    await page.evaluate(failure => {
      if (failure === "get") Object.defineProperty(window, "localStorage", { get() { throw new Error("synthetic unavailable"); } });
      if (failure === "set") Storage.prototype.setItem = () => { throw new Error("synthetic quota"); };
      if (failure === "silent-set") Storage.prototype.setItem = () => {};
      if (failure === "remove") Storage.prototype.removeItem = () => { throw new Error("synthetic denied"); };
    }, failure);
    if (failure === "remove") await page.getByRole("button", { name: "Erase today-only record and turn off today-only saving" }).click();
    else { await brush(page).check(); await consent(page).click(); }
    await expect(consent(page)).not.toBeChecked();
    await expect(page.getByRole("status", { name: "Today-only status" })).toContainText("Browser storage could not be verified");
    await expect(page.getByRole("status", { name: "Today-only status" })).not.toContainText("Saved in this browser for today.");
    await expect(page.getByRole("status", { name: "Today-only status" })).not.toContainText("Check-in erased.");
    await between(page).check();
    await expect(between(page)).toBeChecked();
    expect(errors).toEqual([]);
  });
}

test("storage unavailable at startup stays usable", async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(window, "localStorage", { get() { throw new Error("synthetic denied"); } }));
  await page.goto("/routine/");
  await brush(page).check();
  await expect(brush(page)).toBeChecked();
  await expect(page.getByRole("status", { name: "Today-only status" })).toContainText("Browser storage could not be verified");
  await expect(consent(page)).not.toBeChecked();
});

test("turning saving off removes the record but keeps memory selections", async ({ page }) => {
  await page.goto("/routine/");
  await brush(page).check();
  await consent(page).check();
  await consent(page).uncheck();
  expect(await stored(page)).toBeNull();
  await expect(brush(page)).toBeChecked();
  await between(page).check();
  expect(await stored(page)).toBeNull();
});

test("erasure in another tab disables saving here", async ({ page, context }) => {
  await page.goto("/routine/");
  await brush(page).check();
  await consent(page).check();
  const other = await context.newPage();
  await other.clock.install({ time: new Date("2026-10-13T03:59:50Z") });
  await other.goto("/routine/");
  await expect(consent(other)).toBeChecked();
  await other.getByRole("button", { name: "Erase today-only record and turn off today-only saving" }).click();
  await expect(consent(page)).not.toBeChecked();
  await expect(brush(page)).not.toBeChecked();
  await brush(page).check();
  expect(await stored(page)).toBeNull();
});

test("keyboard, visible focus, responsive controls and three-way navigation", async ({ page }, testInfo) => {
  await page.goto("/routine/");
  await expect(brush(page)).toBeEnabled();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Tab");
  for (const control of [brush(page), between(page)]) {
    await expect(control).toBeFocused();
    await expect(control).toHaveCSS("outline-style", "solid");
    expect((await control.locator("..").boundingBox())!.height).toBeGreaterThanOrEqual(44);
    await page.keyboard.press("Space");
    await expect(control).toBeChecked();
    await page.keyboard.press("Tab");
  }
  const erase = page.getByRole("button", { name: "Erase today-only record and turn off today-only saving" });
  await expect(erase).toBeFocused();
  await expect(erase).toHaveCSS("outline-style", "solid");
  await page.keyboard.press("Tab");
  await expect(consent(page)).toBeFocused();
  await expect(consent(page)).toHaveCSS("outline-style", "solid");
  await page.keyboard.press("Space");
  await expect(consent(page)).toBeChecked();
  await page.keyboard.press("Shift+Tab");
  await expect(erase).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(consent(page)).not.toBeChecked();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("routine.png"), fullPage: true });
  const nav = page.getByRole("navigation", { name: "Main navigation" });
  await expect(nav.getByRole("link", { name: "Routine" })).toHaveAttribute("aria-current", "page");
  await nav.getByRole("link", { name: "Learn" }).click();
  await expect(page.getByRole("heading", { name: "No lessons published yet" })).toBeVisible();
  await nav.getByRole("link", { name: "Home", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Oral health,understood.");
  await nav.getByRole("link", { name: "Routine" }).click();
  await expect(page.getByRole("heading", { name: "My daily routine" })).toBeVisible();
});

test("leaving and returning does not retain an unsaved check-in", async ({ page }) => {
  await page.goto("/routine/");
  await brush(page).check();
  await page.getByRole("navigation").getByRole("link", { name: "Home", exact: true }).click();
  await page.goBack();
  await expect(brush(page)).toBeEnabled();
  await expect(brush(page)).not.toBeChecked();
  await expect(consent(page)).not.toBeChecked();
  expect(await stored(page)).toBeNull();
});

// P01-01 negative control: these same assertions must fail on the original source.
for (const pathway of ["refresh", "interaction"] as const) {
  test(`P01-01 preserves new-day bytes before delayed storage event: ${pathway}`, async ({ page, context }) => {
    await page.addInitScript(() => window.addEventListener("storage", e => e.stopImmediatePropagation(), true));
    await page.goto("/routine/");
    await brush(page).check();
    await consent(page).check();
    await page.clock.setSystemTime(new Date("2026-10-13T16:00:00Z"));
    const other = await context.newPage();
    await other.clock.install({ time: new Date("2026-10-13T16:00:00Z") });
    await other.goto("/routine/");
    await between(other).check();
    await consent(other).check();
    const expected = JSON.stringify({ ...sample, date: "2026-10-13", brushedTeeth: false, cleanedBetweenTeeth: true });
    await expect.poll(() => stored(other)).toBe(expected);
    // Programmatic dispatch avoids an incidental focus event selecting the other path.
    if (pathway === "refresh") await page.evaluate(() => window.dispatchEvent(new Event("focus")));
    else await brush(page).evaluate(element => (element as HTMLInputElement).click());
    await expect(page.getByText("Today · 2026-10-13", { exact: true })).toBeVisible();
    await expect(consent(page)).not.toBeChecked();
    expect(await stored(other)).toBe(expected);
    await expect(between(page)).not.toBeChecked();
    await expect(page.getByRole("status", { name: "Today-only status" })).toContainText("saved current-day record");
  });
}
