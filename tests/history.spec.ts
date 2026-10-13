import { expect, test, type Page } from "@playwright/test";

const key = "smile-track:routine-history:1";
const todayKey = "smile-track:routine:1";
const lock = "smile-track:routine-history";
const entry = (date: string, brushedTeeth = false, cleanedBetweenTeeth = false) => ({ date, brushedTeeth, cleanedBetweenTeeth });
const history = (entries: unknown[] = [entry("2026-10-12")]) => ({ version: 1, enabled: true, entries });
const consent = (page: Page) => page.getByRole("checkbox", { name: "Enable seven-day history in this browser" });
const brush = (page: Page) => page.getByRole("checkbox", { name: "Brushed teeth", exact: true });
const record = (page: Page) => page.getByRole("button", { name: "Record today’s check-in in history" });
const eraseAll = (page: Page) => page.getByRole("button", { name: "Erase all routine data and turn off both saving options" });
const status = (page: Page) => page.getByRole("status", { name: "History status" });
const stored = (page: Page) => page.evaluate(k => localStorage.getItem(k), key);
async function enable(page: Page) {
  await consent(page).click();
  await expect(consent(page)).toBeChecked();
  await expect(record(page)).toBeEnabled();
}
async function seed(page: Page, value: unknown) {
  await page.evaluate(({ key, raw }) => localStorage.setItem(key, raw), { key, raw: typeof value === "string" ? value : JSON.stringify(value) });
  await page.reload();
  await expect(consent(page)).toBeEnabled();
}

test.use({ timezoneId: "America/New_York" });
test.beforeEach(async ({ page }) => {
  await page.clock.install({ time: new Date("2026-10-12T16:00:00Z") });
});

test("separate consent, no automatic copying, explicit snapshots and neutral missing days", async ({ page, context }) => {
  const errors: string[] = [];
  const requests: { url: string; method: string; body: string | null }[] = [];
  page.on("pageerror", e => errors.push(e.message));
  page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
  page.on("request", r => requests.push({ url: r.url(), method: r.method(), body: r.postData() }));
  await page.addInitScript(() => {
    const original = Storage.prototype.setItem;
    Object.defineProperty(window, "historyWrites", { value: [] });
    Storage.prototype.setItem = function(k, v) {
      if (k === "smile-track:routine-history:1") (window as unknown as { historyWrites: string[] }).historyWrites.push(v);
      return original.call(this, k, v);
    };
  });
  await page.goto("/routine/");
  await expect(consent(page)).toBeEnabled();
  await expect(consent(page)).not.toBeChecked();
  await expect(record(page)).toBeDisabled();
  await brush(page).check();
  await page.getByRole("checkbox", { name: "Save today’s check-in in this browser" }).check();
  await page.reload();
  await expect(brush(page)).toBeChecked();
  await expect(consent(page)).not.toBeChecked();
  expect(await stored(page)).toBeNull();
  expect(await page.evaluate(() => (window as unknown as { historyWrites: string[] }).historyWrites)).toEqual([]);
  await enable(page);
  await expect(record(page)).toBeEnabled();
  expect(JSON.parse((await stored(page))!)).toEqual(history([]));
  const today = page.getByRole("listitem", { name: "2026-10-12", exact: true });
  await expect(today).toContainText("No recorded check-in");
  await record(page).click();
  await expect(status(page)).toContainText("Today’s check-in recorded");
  await expect(today).toContainText("Brushed teeth: Marked");
  await brush(page).uncheck();
  await expect(status(page)).toContainText("Current selections differ");
  await expect(today).toContainText("Brushed teeth: Marked");
  await record(page).click();
  await expect(status(page)).not.toContainText("Current selections differ");
  await expect(today).toContainText("Brushed teeth: Not marked");
  await expect(today).toContainText("Cleaned between teeth: Not marked");
  await expect(today).not.toContainText("No recorded check-in");
  expect(JSON.parse((await stored(page))!)).toEqual(history());
  expect(await page.getByRole("listitem").count()).toBe(7);
  await expect(page.getByRole("listitem", { name: "2026-10-11", exact: true })).toContainText("No recorded check-in");
  await page.reload();
  await expect(consent(page)).toBeChecked();
  await expect(today).toContainText("Brushed teeth: Not marked");
  await eraseAll(page).click();
  await expect(consent(page)).not.toBeChecked();
  expect(await stored(page)).toBeNull();
  expect(await context.cookies()).toEqual([]);
  expect(await page.evaluate(() => sessionStorage.length)).toBe(0);
  expect(errors).toEqual([]);
  expect(requests.every(r => new URL(r.url).origin === "http://127.0.0.1:4173" && r.method === "GET" && r.body === null && !r.url.includes("brushedTeeth") && !r.url.includes("cleanedBetweenTeeth"))).toBe(true);
});

test("local midnight prunes the rolling window without fabricating a new check-in", async ({ page }) => {
  await page.clock.setSystemTime(new Date("2026-10-13T03:59:50Z"));
  await page.goto("/routine/");
  await seed(page, history(Array.from({ length: 7 }, (_, i) => entry(`2026-10-${String(12 - i).padStart(2, "0")}`, true))));
  await expect(consent(page)).toBeChecked();
  expect(await page.getByRole("listitem").evaluateAll(items => items.map(i => i.getAttribute("aria-label")))).toEqual(["2026-10-12", "2026-10-11", "2026-10-10", "2026-10-09", "2026-10-08", "2026-10-07", "2026-10-06"]);
  await page.clock.fastForward(11_000);
  await expect(page.getByRole("listitem", { name: "2026-10-13", exact: true })).toContainText("No recorded check-in");
  await expect(page.getByRole("listitem", { name: "2026-10-06", exact: true })).toHaveCount(0);
  await expect.poll(async () => JSON.parse((await stored(page))!).entries.length).toBe(6);
  await page.clock.setSystemTime(new Date("2026-11-01T17:00:00Z"));
  await page.evaluate(() => window.dispatchEvent(new Event("focus")));
  await expect.poll(async () => JSON.parse((await stored(page))!).entries).toEqual([]);
  await expect(consent(page)).toBeChecked();
});

for (const scenario of [
  { name: "spring DST", time: "2026-03-09T04:30:00Z", dates: ["2026-03-09", "2026-03-08", "2026-03-07", "2026-03-06", "2026-03-05", "2026-03-04", "2026-03-03"] },
  { name: "fall DST", time: "2026-11-02T04:30:00Z", dates: ["2026-11-01", "2026-10-31", "2026-10-30", "2026-10-29", "2026-10-28", "2026-10-27", "2026-10-26"] },
]) {
  test(`${scenario.name} uses seven calendar dates rather than UTC dates or 24-hour offsets`, async ({ page }) => {
    await page.clock.setSystemTime(new Date(scenario.time));
    await page.goto("/routine/");
    await enable(page);
    await expect(page.getByRole("listitem")).toHaveCount(7);
    expect(await page.getByRole("listitem").evaluateAll(items => items.map(i => i.getAttribute("aria-label")))).toEqual(scenario.dates);
  });
}

test.describe("live timezone change", () => {
  test.use({ timezoneId: undefined });
test("a timezone change rejects now-future dates and recalculates the local window", async ({ page, context }) => {
  const cdp = await context.newCDPSession(page);
  await cdp.send("Emulation.setTimezoneOverride", { timezoneId: "America/New_York" });
  await page.clock.setSystemTime(new Date("2026-10-12T04:30:00Z"));
  await page.goto("/routine/");
  await seed(page, history());
  await expect(consent(page)).toBeChecked();
  await cdp.send("Emulation.setTimezoneOverride", { timezoneId: "America/Los_Angeles" });
  await page.evaluate(() => window.dispatchEvent(new Event("focus")));
  await expect(consent(page)).not.toBeChecked();
  expect(await stored(page)).toBeNull();
  await enable(page);
  await expect(page.getByRole("listitem").first()).toHaveAttribute("aria-label", "2026-10-11");
});
});

test("strict schema rejects malformed, duplicate, future, unsupported and extra fields", async ({ page }) => {
  await page.goto("/routine/");
  for (const value of ["{broken", "null", "[]", { ...history(), enabled: false }, { ...history(), version: 2 }, { ...history(), notes: "synthetic" }, history([entry("2026-10-12"), entry("2026-10-12")]), history([entry("2026-10-13")]), history([entry("2026-02-30")]), history([{ ...entry("2026-10-12"), brushedTeeth: "yes" }]), history([{ ...entry("2026-10-12"), notes: "synthetic" }]), history(Array.from({ length: 8 }, (_, i) => entry(`2026-10-${String(12-i).padStart(2,"0")}`)))]) {
    await seed(page, value);
    await expect(consent(page)).not.toBeChecked();
    expect(await stored(page)).toBeNull();
  }
  await seed(page, history([entry("2026-10-05"), entry("2026-10-06"), entry("2026-10-12")]));
  await expect(consent(page)).toBeChecked();
  expect(JSON.parse((await stored(page))!).entries.map((e: { date: string }) => e.date)).toEqual(["2026-10-12", "2026-10-06"]);
});

test("erase scopes are separate; erase-all removes both keys and leaves unrelated data", async ({ page }) => {
  await page.goto("/routine/");
  await brush(page).check();
  const todayConsent = page.getByRole("checkbox", { name: "Save today’s check-in in this browser" });
  await todayConsent.check();
  await enable(page);
  await record(page).click();
  await page.getByRole("button", { name: "Erase today-only record and turn off today-only saving" }).click();
  await expect(todayConsent).not.toBeChecked();
  await expect(consent(page)).toBeChecked();
  expect(JSON.parse((await stored(page))!).entries[0].brushedTeeth).toBe(true);
  await expect(status(page)).toContainText("Current selections differ");
  await todayConsent.check();
  await consent(page).click();
  await expect(consent(page)).not.toBeChecked();
  expect(await stored(page)).toBeNull();
  await expect(todayConsent).toBeChecked();
  await enable(page);
  await record(page).click();
  await page.evaluate(() => localStorage.setItem("unrelated", "synthetic"));
  await eraseAll(page).click();
  await expect(page.getByRole("status", { name: "Today-only status" })).toContainText("All routine data erased");
  await expect(consent(page)).not.toBeChecked();
  await expect(todayConsent).not.toBeChecked();
  expect(await page.evaluate(({ key, todayKey }) => [localStorage.getItem(key), localStorage.getItem(todayKey), localStorage.getItem("unrelated")], { key, todayKey })).toEqual([null, null, "synthetic"]);
  await brush(page).check();
  await page.reload();
  await expect(brush(page)).not.toBeChecked();
  await expect(consent(page)).not.toBeChecked();
});

for (const failure of ["read", "write", "silent-write", "remove", "silent-remove"] as const) {
  test(`history handles ${failure} failure honestly and keeps R01 usable`, async ({ page }) => {
    await page.goto("/routine/");
    if (failure.includes("remove")) { await enable(page); await record(page).click(); }
    await page.evaluate(({ failure, key }) => {
      const get = Storage.prototype.getItem, set = Storage.prototype.setItem, remove = Storage.prototype.removeItem;
      Storage.prototype.getItem = function(k) { if (k === key && failure === "read") throw new Error("synthetic denied read"); return get.call(this,k); };
      Storage.prototype.setItem = function(k,v) { if(k===key && failure==="write") throw new Error("synthetic quota"); if(k===key && failure==="silent-write") return; return set.call(this,k,v); };
      Storage.prototype.removeItem = function(k) { if(k===key && failure==="remove") throw new Error("synthetic denied remove"); if(k===key && failure==="silent-remove") return; return remove.call(this,k); };
    }, { failure, key });
    if (failure.includes("remove")) await eraseAll(page).click();
    else await consent(page).click();
    await expect(status(page)).toContainText("could not be verified");
    await expect(consent(page)).not.toBeChecked();
    await page.clock.fastForward(61_000);
    await expect(consent(page)).not.toBeChecked();
    if (failure.includes("remove")) await expect(page.getByRole("status", { name: "Today-only status" })).toContainText("Erasure of all routine data could not be verified");
    await brush(page).check();
    await page.getByRole("checkbox", { name: "Save today’s check-in in this browser" }).check();
    expect(JSON.parse((await page.evaluate(k => localStorage.getItem(k), todayKey))!).brushedTeeth).toBe(true);
  });
}

test("missing tab coordination disables history without disabling R01", async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, "locks", { value: undefined }));
  await page.goto("/routine/");
  await expect(status(page)).toContainText("cannot coordinate tabs");
  await consent(page).click();
  await expect(consent(page)).not.toBeChecked();
  expect(await stored(page)).toBeNull();
  await brush(page).check();
  await expect(brush(page)).toBeChecked();
});

test("cross-tab erasure wins over a queued stale recording operation", async ({ page, context }) => {
  await page.goto("/routine/");
  await enable(page);
  await record(page).click();
  const other = await context.newPage();
  await other.clock.install({ time: new Date("2026-10-12T16:00:00Z") });
  await other.goto("/routine/");
  await expect(consent(other)).toBeChecked();
  // Hold the lock, then queue erase before the stale tab's record request.
  await page.evaluate(lock => {
    void navigator.locks.request(lock, () => new Promise<void>(resolve => {
      (window as unknown as { releaseHistory: () => void }).releaseHistory = resolve;
    }));
  }, lock);
  await expect.poll(() => page.evaluate(() => typeof (window as unknown as { releaseHistory?: unknown }).releaseHistory)).toBe("function");
  await other.getByRole("button", { name: "Erase history and turn it off" }).click();
  await expect.poll(() => page.evaluate(async lock => (await navigator.locks.query()).pending?.filter(item => item.name === lock).length, lock)).toBeGreaterThanOrEqual(1);
  await record(page).click();
  await expect.poll(() => page.evaluate(async lock => (await navigator.locks.query()).pending?.filter(item => item.name === lock).length, lock)).toBeGreaterThanOrEqual(2);
  await page.evaluate(() => (window as unknown as { releaseHistory: () => void }).releaseHistory());
  await expect(consent(page)).not.toBeChecked();
  await expect(consent(other)).not.toBeChecked();
  expect(await stored(page)).toBeNull();
  await brush(page).check();
  await page.clock.fastForward(61_000);
  expect(await stored(page)).toBeNull();
});

test("keyboard, focus, mobile layout and accessible announcements", async ({ page }, testInfo) => {
  await page.goto("/routine/");
  await expect(consent(page)).toBeEnabled();
  await page.getByRole("checkbox", { name: "Save today’s check-in in this browser" }).focus();
  await page.keyboard.press("Tab");
  await expect(consent(page)).toBeFocused();
  await expect(consent(page)).toHaveCSS("outline-style", "solid");
  expect((await consent(page).locator("..").boundingBox())!.height).toBeGreaterThanOrEqual(44);
  await page.keyboard.press("Space");
  await expect(consent(page)).toBeChecked();
  await expect(record(page)).toBeEnabled();
  await page.keyboard.press("Tab");
  await expect(record(page)).toBeFocused();
  await expect(record(page)).toHaveCSS("outline-style", "solid");
  await page.keyboard.press("Enter");
  await expect(status(page)).toContainText("Today’s check-in recorded");
  for (const name of ["Erase history and turn it off", "Erase all routine data and turn off both saving options"]) {
    await page.keyboard.press("Tab");
    const button = page.getByRole("button", { name });
    await expect(button).toBeFocused();
    await expect(button).toHaveCSS("outline-style", "solid");
    expect((await button.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("history.png"), fullPage: true });
  await page.keyboard.press("Enter");
  await expect(consent(page)).not.toBeChecked();
});


test("reopening Home or Learn enforces history retention without displaying entries", async ({ page }) => {
  await page.goto("/routine/");
  for (const route of ["/", "/learn/"]) {
    await page.evaluate(({ key, value }) => localStorage.setItem(key, JSON.stringify(value)), { key, value: history([entry("2026-10-05"), entry("2026-10-12", true)]) });
    await page.goto(route);
    await expect.poll(async () => JSON.parse((await stored(page))!).entries.length).toBe(1);
    await expect(page.getByText("Brushed teeth: Marked", { exact: true })).toHaveCount(0);
    expect(JSON.parse((await stored(page))!).entries).toEqual([entry("2026-10-12", true)]);
  }
});

test("a queued record crossing midnight cannot backfill yesterday", async ({ page }) => {
  await page.goto("/routine/");
  await enable(page);
  await page.evaluate(lock => {
    void navigator.locks.request(lock, () => new Promise<void>(resolve => {
      (window as unknown as { releaseHistory: () => void }).releaseHistory = resolve;
    }));
  }, lock);
  await expect.poll(() => page.evaluate(() => typeof (window as unknown as { releaseHistory?: unknown }).releaseHistory)).toBe("function");
  await record(page).click();
  await page.clock.setSystemTime(new Date("2026-10-13T16:00:00Z"));
  await page.evaluate(() => (window as unknown as { releaseHistory: () => void }).releaseHistory());
  await expect(status(page)).toContainText("local date changed");
  expect(JSON.parse((await stored(page))!).entries).toEqual([]);
});

test("unavailable storage at startup never enables history or throws", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", e => errors.push(e.message));
  await page.addInitScript(() => Object.defineProperty(window, "localStorage", { get() { throw new Error("synthetic denied"); } }));
  await page.goto("/routine/");
  await expect(status(page)).toContainText("could not be verified");
  await expect(consent(page)).not.toBeChecked();
  await brush(page).check();
  await expect(brush(page)).toBeChecked();
  expect(errors).toEqual([]);
});

test("a failed history update disables history and does not alter today-only saving", async ({ page }) => {
  await page.goto("/routine/");
  await brush(page).check();
  const todayConsent = page.getByRole("checkbox", { name: "Save today’s check-in in this browser" });
  await todayConsent.check();
  await enable(page);
  await record(page).click();
  await expect(status(page)).toContainText("Today’s check-in recorded");
  await page.evaluate(key => {
    const set = Storage.prototype.setItem;
    Storage.prototype.setItem = function(k,v) { if(k===key) throw new Error("synthetic update failure"); return set.call(this,k,v); };
  }, key);
  await brush(page).uncheck();
  await record(page).click();
  await expect(status(page)).toContainText("could not be verified");
  await expect(consent(page)).not.toBeChecked();
  expect(await stored(page)).toBeNull();
  await expect(todayConsent).toBeChecked();
  expect(JSON.parse((await page.evaluate(k => localStorage.getItem(k), todayKey))!).brushedTeeth).toBe(false);
});

test("erase-all reports a failed today-only deletion even when history was erased", async ({ page }) => {
  await page.goto("/routine/");
  const todayConsent = page.getByRole("checkbox", { name: "Save today’s check-in in this browser" });
  await todayConsent.check();
  await enable(page);
  await record(page).click();
  await page.evaluate(todayKey => {
    const remove = Storage.prototype.removeItem;
    Storage.prototype.removeItem = function(k) { if(k===todayKey) throw new Error("synthetic today removal failure"); return remove.call(this,k); };
  }, todayKey);
  await eraseAll(page).click();
  await expect(page.getByRole("status", { name: "Today-only status" })).toContainText("Erasure of all routine data could not be verified");
  await expect(consent(page)).not.toBeChecked();
  await expect(todayConsent).not.toBeChecked();
  expect(await stored(page)).toBeNull();
  expect(await page.evaluate(k => localStorage.getItem(k), todayKey)).not.toBeNull();
});

test("explicit re-enable starts empty after an earlier failed deletion", async ({ page }) => {
  await page.goto("/routine/");
  await enable(page);
  await brush(page).check();
  await record(page).click();
  await expect(status(page)).toContainText("Today’s check-in recorded");
  await page.evaluate(key => {
    const remove = Storage.prototype.removeItem;
    (window as unknown as { restoreRemove: () => void }).restoreRemove = () => { Storage.prototype.removeItem = remove; };
    Storage.prototype.removeItem = function(k) { if(k===key) throw new Error("synthetic removal denied"); return remove.call(this,k); };
  }, key);
  await page.getByRole("button", { name: "Erase history and turn it off" }).click();
  await expect(consent(page)).not.toBeChecked();
  await expect(status(page)).toContainText("could not be verified");
  await page.evaluate(() => (window as unknown as { restoreRemove: () => void }).restoreRemove());
  await enable(page);
  expect(JSON.parse((await stored(page))!)).toEqual(history([]));
  await expect(brush(page)).toBeChecked();
});
