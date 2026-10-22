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
  await expect(page.getByRole("status", { name: "Today-only status" })).toContainText("Saved in this browser for today.");
  await expect.poll(async () => JSON.parse((await stored(page)) ?? "null")).toEqual(sample);
  expect(JSON.parse((await stored(page))!)).toEqual(sample);
  await page.reload();
  await expect(brush(page)).toBeChecked();
  await expect(between(page)).not.toBeChecked();
  await expect(consent(page)).toBeChecked();
  await between(page).check();
  await expect(page.getByRole("status", { name: "Today-only status" })).toContainText("Saved in this browser for today.");
  await expect.poll(async () => JSON.parse((await stored(page)) ?? "null")).toEqual({ ...sample, cleanedBetweenTeeth: true });
  expect(JSON.parse((await stored(page))!)).toEqual({ ...sample, cleanedBetweenTeeth: true });
  await page.getByRole("button", { name: "Erase today-only record and turn off today-only saving" }).click();
  await expect(brush(page)).not.toBeChecked();
  await expect(between(page)).not.toBeChecked();
  await expect(consent(page)).not.toBeChecked();
  await expect(page.getByRole("status", { name: "Today-only status" })).toContainText("Check-in erased. Saving is off.");
  await expect.poll(() => stored(page)).toBeNull();
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
  await expect(page.getByRole("status", { name: "Today-only status" })).toContainText("Saved in this browser for today.");
  await expect.poll(async () => JSON.parse((await stored(page)) ?? "null")).toEqual(sample);
  await consent(page).uncheck();
  await expect(page.getByRole("status", { name: "Today-only status" })).toContainText("Check-in erased. Saving is off.");
  await expect.poll(() => stored(page)).toBeNull();
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
    await expect.poll(() => stored(page)).toBe(JSON.stringify(sample));
    await settle(page);
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

const routineLock = "smile-track:routine";
const todayStatus = (page: Page) => page.getByRole("status", { name: "Today-only status" });
const eraseToday = (page: Page) => page.getByRole("button", { name: "Erase today-only record and turn off today-only saving" });
async function hold(page: Page, lock = routineLock) {
  await page.evaluate(lock => {
    const state = window as unknown as { releaseTestLock?: () => void };
    delete state.releaseTestLock;
    void navigator.locks.request(lock, () => new Promise<void>(resolve => { state.releaseTestLock = resolve; }));
  }, lock);
  await expect.poll(() => page.evaluate(() => typeof (window as unknown as { releaseTestLock?: unknown }).releaseTestLock)).toBe("function");
}
async function release(page: Page) {
  await page.evaluate(() => (window as unknown as { releaseTestLock: () => void }).releaseTestLock());
}
async function waitQueued(page: Page, count = 1, lock = routineLock) {
  await expect.poll(() => page.evaluate(async lock => (await navigator.locks.query()).pending?.filter(item => item.name === lock).length ?? 0, lock)).toBeGreaterThanOrEqual(count);
}
async function suppressStorageEvents(page: Page) {
  await page.addInitScript(() => window.addEventListener("storage", event => event.stopImmediatePropagation(), true));
}
async function settle(page: Page) {
  await expect(page.getByRole("button", { name: "Cancel pending work and continue in memory" })).toHaveCount(0);
  await expect(consent(page)).toBeEnabled();
}

test("P01-01 stale observation queued behind new-day enable preserves record and requires reattachment", async ({ page, context }) => {
  await suppressStorageEvents(page);
  await page.goto("/routine/");
  await brush(page).check(); await consent(page).check(); await settle(page);
  const other = await context.newPage();
  await other.clock.install({ time: new Date("2026-10-13T16:00:00Z") });
  await other.goto("/routine/"); await settle(other);
  const holder = await context.newPage(); await holder.goto("/");
  await hold(holder);
  await between(other).check(); await consent(other).check(); await waitQueued(holder);
  await page.clock.setSystemTime(new Date("2026-10-13T16:00:00Z"));
  await page.evaluate(() => window.dispatchEvent(new Event("focus"))); await waitQueued(holder, 2);
  await release(holder); await settle(other); await settle(page);
  const expected = { ...sample, date: "2026-10-13", brushedTeeth: false, cleanedBetweenTeeth: true };
  expect(JSON.parse((await stored(page))!)).toEqual(expected);
  await expect(consent(page)).not.toBeChecked(); await expect(brush(page)).not.toBeChecked();
  await expect(todayStatus(page)).toContainText("saved current-day record");
  await consent(page).check(); await settle(page);
  await expect(between(page)).toBeChecked();
  expect(JSON.parse((await stored(page))!)).toEqual(expected);
});

test("P01-01 all storage reads mutations and failed-write recovery occur under R01 lock", async ({ page }) => {
  await page.addInitScript(({ key, lockName }) => {
    const state = window as unknown as { held: boolean; outside: string[] };
    state.held = false; state.outside = [];
    const request = navigator.locks.request.bind(navigator.locks);
    Object.defineProperty(navigator.locks, "request", { value: (name: string, options: LockOptions | LockGrantedCallback<unknown>, callback?: LockGrantedCallback<unknown>) => {
      const cb = typeof options === "function" ? options : callback!;
      return request(name, typeof options === "function" ? {} : options, lock => {
        if (name === lockName) state.held = true;
        try { return cb(lock); } finally { if (name === lockName) state.held = false; }
      });
    } });
    const get = Storage.prototype.getItem, set = Storage.prototype.setItem, remove = Storage.prototype.removeItem;
    Storage.prototype.getItem = function(k) { if (k === key && !state.held) state.outside.push("read"); return get.call(this, k); };
    Storage.prototype.setItem = function(k, value) { if (k === key) { if (!state.held) state.outside.push("write"); throw new Error("synthetic write failure"); } return set.call(this, k, value); };
    Storage.prototype.removeItem = function(k) { if (k === key && !state.held) state.outside.push("remove"); return remove.call(this, k); };
  }, { key, lockName: routineLock });
  await page.goto("/routine/"); await settle(page);
  await brush(page).check(); await consent(page).click();
  await expect(todayStatus(page)).toContainText("could not be verified");
  await eraseToday(page).click(); await settle(page);
  expect(await page.evaluate(() => (window as unknown as { outside: string[] }).outside)).toEqual([]);
});

for (const change of ["newer values", "revocation"] as const) {
  test(`P01-01 queued stale edit rejects ${change} before delayed notification`, async ({ page, context }) => {
    await suppressStorageEvents(page);
    await page.goto("/routine/"); await brush(page).check(); await consent(page).check(); await settle(page);
    const other = await context.newPage(); await other.clock.install({ time: new Date("2026-10-13T03:59:50Z") });
    await other.goto("/routine/"); await settle(other);
    const holder = await context.newPage(); await holder.goto("/"); await hold(holder);
    if (change === "revocation") await eraseToday(other).click();
    else await between(other).check();
    await waitQueued(holder);
    await brush(page).evaluate(e => (e as HTMLInputElement).click()); await waitQueued(holder, 2);
    // Neither queued operation has changed X while the holder owns the lock.
    expect(JSON.parse((await stored(holder))!)).toEqual(sample);
    await release(holder); await settle(page); await settle(other);
    if (change === "revocation") {
      expect(await stored(holder)).toBeNull(); await expect(consent(page)).not.toBeChecked();
      await expect(todayStatus(page)).toContainText("consent was removed");
    } else {
      expect(JSON.parse((await stored(holder))!)).toEqual({ ...sample, cleanedBetweenTeeth: true });
      await expect(brush(page)).toBeChecked(); await expect(between(page)).toBeChecked();
      await expect(todayStatus(page)).toContainText("Review the latest values");
    }
  });
}

for (const cause of ["cancel", "memory edit", "pagehide", "storage event", "midnight"] as const) {
  test(`P01-01 obsolete queued enable cannot commit after ${cause}`, async ({ page, context }) => {
    await page.goto("/routine/"); await settle(page); await brush(page).check();
    const holder = await context.newPage(); await holder.goto("/"); await hold(holder);
    await consent(page).check(); await waitQueued(holder);
    await expect(todayStatus(page)).toContainText("not yet confirmed"); expect(await stored(holder)).toBeNull();
    if (cause === "cancel") await page.getByRole("button", { name: "Cancel pending work and continue in memory" }).click();
    if (cause === "memory edit") await between(page).check();
    if (cause === "pagehide") await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent("pagehide")));
    if (cause === "storage event") await page.evaluate(key => window.dispatchEvent(new StorageEvent("storage", { key })), key);
    if (cause === "midnight") await page.clock.setSystemTime(new Date("2026-10-13T16:00:00Z"));
    await release(holder);
    // A real lock barrier drains preceding requests; no arbitrary delay.
    await holder.evaluate(lock => navigator.locks.request(lock, () => {}), routineLock);
    await expect(consent(page)).not.toBeChecked(); expect(await stored(holder)).toBeNull();
    if (cause === "midnight") {
      await expect(brush(page)).not.toBeChecked(); await expect(todayStatus(page)).toContainText("date changed");
    }
  });
}

for (const failure of ["unavailable", "rejected"] as const) {
  test(`P01-01 ${failure} coordination leaves bytes untouched and memory usable`, async ({ page }) => {
    await page.addInitScript(({ key, sample, failure, lock }) => {
      localStorage.setItem(key, JSON.stringify(sample));
      if (failure === "unavailable") Object.defineProperty(navigator, "locks", { value: undefined });
      else {
        const original = navigator.locks.request.bind(navigator.locks);
        Object.defineProperty(navigator.locks, "request", { value: (name: string, options: LockOptions | LockGrantedCallback<unknown>, callback?: LockGrantedCallback<unknown>) => {
          if (name === lock) return Promise.reject(new Error("synthetic rejection"));
          return typeof options === "function" ? original(name, options) : original(name, options, callback!);
        } });
      }
    }, { key, sample, failure, lock: routineLock });
    await page.goto("/routine/");
    await expect(todayStatus(page)).toContainText("coordination is unavailable");
    await expect(consent(page)).not.toBeChecked();
    await brush(page).check(); await between(page).check();
    await consent(page).click(); await expect(consent(page)).not.toBeChecked();
    await eraseToday(page).click(); await expect(todayStatus(page)).toContainText("site-data controls");
    expect(JSON.parse((await stored(page))!)).toEqual(sample);
    await page.clock.setSystemTime(new Date("2026-10-13T16:00:00Z"));
    await page.evaluate(() => window.dispatchEvent(new Event("focus")));
    await expect(brush(page)).not.toBeChecked();
    expect(JSON.parse((await stored(page))!)).toEqual(sample);
    await between(page).check(); await expect(between(page)).toBeChecked();
  });
}

test("P01-01 silent removal failure latches off despite surviving consent and notifications", async ({ page }) => {
  await page.goto("/routine/"); await brush(page).check(); await consent(page).check(); await settle(page);
  await page.evaluate(key => {
    const original = Storage.prototype.removeItem;
    Storage.prototype.removeItem = function(k) { if (k !== key) original.call(this, k); };
  }, key);
  await eraseToday(page).click();
  await expect(todayStatus(page)).toContainText("could not be verified"); await expect(consent(page)).not.toBeChecked();
  expect(JSON.parse((await stored(page))!)).toEqual(sample);
  await page.evaluate(key => window.dispatchEvent(new StorageEvent("storage", { key })), key);
  await page.clock.fastForward(61_000);
  await expect(consent(page)).not.toBeChecked(); await between(page).check();
  expect(JSON.parse((await stored(page))!)).toEqual(sample);
});

test("P01-01 erase-all releases history lock before requesting R01 and reports partial progress honestly", async ({ page, context }) => {
  await page.goto("/routine/"); await brush(page).check(); await consent(page).check(); await settle(page);
  await page.getByRole("checkbox", { name: "Enable seven-day history in this browser" }).click();
  await expect(page.getByRole("checkbox", { name: "Enable seven-day history in this browser" })).toBeChecked();
  const holder = await context.newPage(); await holder.goto("/");
  await hold(holder, "smile-track:routine-history");
  await page.getByRole("button", { name: "Erase all routine data and turn off both saving options" }).click();
  await page.getByRole("button", { name: "Confirm — erase all routine data", exact: true }).click();
  await waitQueued(holder, 1, "smile-track:routine-history");
  const initial = await holder.evaluate(async () => navigator.locks.query());
  expect(initial.held?.some(l => l.name === routineLock)).toBe(false);
  expect(initial.pending?.some(l => l.name === routineLock)).toBe(false);
  const holderR = await context.newPage(); await holderR.goto("/"); await hold(holderR);
  await release(holder); await waitQueued(holderR);
  expect(await holder.evaluate(() => localStorage.getItem("smile-track:routine-history:1"))).toBeNull();
  expect(JSON.parse((await stored(holder))!)).toEqual(sample);
  await expect(todayStatus(page)).not.toContainText("All routine data erased");
  await release(holderR);
  await expect(todayStatus(page)).toContainText("separately verified operations");
  expect(await stored(holder)).toBeNull();
});

for (const failure of ["throw", "silent"] as const) {
  test(`P01-01 failed-write cleanup cannot erase the next cooperating save: ${failure}`, async ({ page, context }) => {
    await suppressStorageEvents(page);
    await page.goto("/routine/"); await settle(page); await brush(page).check();
    const other = await context.newPage(); await other.clock.install({ time: new Date("2026-10-13T03:59:50Z") });
    await other.goto("/routine/"); await settle(other); await between(other).check();
    await page.evaluate(({ key, failure }) => {
      const set = Storage.prototype.setItem;
      Storage.prototype.setItem = function(k, value) {
        if (k === key) { if (failure === "throw") throw new Error("synthetic write failure"); return; }
        return set.call(this, k, value);
      };
    }, { key, failure });
    const holder = await context.newPage(); await holder.goto("/"); await hold(holder);
    await consent(page).check(); await waitQueued(holder);
    await consent(other).check(); await waitQueued(holder, 2);
    await release(holder); await settle(page); await settle(other);
    await expect(todayStatus(page)).toContainText("could not be verified");
    await expect(consent(page)).not.toBeChecked(); await expect(consent(other)).toBeChecked();
    expect(JSON.parse((await stored(holder))!)).toEqual({ ...sample, brushedTeeth: false, cleanedBetweenTeeth: true });
  });
}

test("P01-01 saved edit ordered before explicit erase cannot survive erasure", async ({ page, context }) => {
  await page.goto("/routine/"); await brush(page).check(); await consent(page).check(); await settle(page);
  const other = await context.newPage(); await suppressStorageEvents(other); await other.clock.install({ time: new Date("2026-10-13T03:59:50Z") });
  await other.goto("/routine/"); await settle(other);
  const holder = await context.newPage(); await holder.goto("/"); await hold(holder);
  await between(page).check(); await waitQueued(holder);
  await eraseToday(other).click(); await waitQueued(holder, 2);
  await release(holder); await settle(page); await settle(other);
  expect(await stored(holder)).toBeNull();
  await expect(consent(page)).not.toBeChecked(); await expect(consent(other)).not.toBeChecked();
});

for (const order of ["rollover first", "erase first"] as const) {
  test(`P01-01 rollover and explicit erase create no consent: ${order}`, async ({ page, context }) => {
    await suppressStorageEvents(page);
    await page.goto("/routine/"); await settle(page); await brush(page).check();
    const other = await context.newPage(); await other.clock.install({ time: new Date("2026-10-13T16:00:00Z") });
    await other.goto("/routine/"); await settle(other); await between(other).check(); await consent(other).check(); await settle(other);
    await page.clock.setSystemTime(new Date("2026-10-13T16:00:00Z"));
    const holder = await context.newPage(); await holder.goto("/"); await hold(holder);
    const wake = () => page.evaluate(() => window.dispatchEvent(new Event("focus")));
    if (order === "rollover first") { await wake(); await waitQueued(holder); await eraseToday(other).click(); }
    else { await eraseToday(other).click(); await waitQueued(holder); await wake(); }
    await waitQueued(holder, 2); await release(holder); await settle(page); await settle(other);
    expect(await stored(holder)).toBeNull();
    await expect(consent(page)).not.toBeChecked(); await expect(brush(page)).not.toBeChecked();
    await expect(consent(other)).not.toBeChecked();
  });
}

test("P01-01 combined failed write and failed cleanup retain honest off-here latch", async ({ page }) => {
  await page.goto("/routine/"); await settle(page); await brush(page).check(); await consent(page).check(); await settle(page);
  await page.evaluate(key => {
    const set = Storage.prototype.setItem, remove = Storage.prototype.removeItem;
    Storage.prototype.setItem = function(k, value) { if (k !== key) set.call(this, k, value); };
    Storage.prototype.removeItem = function(k) { if (k !== key) remove.call(this, k); };
  }, key);
  await between(page).check(); await settle(page);
  await expect(todayStatus(page)).toContainText("previous saved record may remain");
  expect(JSON.parse((await stored(page))!)).toEqual(sample);
  await page.evaluate(key => window.dispatchEvent(new StorageEvent("storage", { key })), key);
  await page.clock.fastForward(61_000);
  await expect(consent(page)).not.toBeChecked();
  expect(JSON.parse((await stored(page))!)).toEqual(sample);
});

test("P01-01 erase-all permits later independent history enable and qualifies its result", async ({ page, context }) => {
  await page.goto("/routine/"); await settle(page); await brush(page).check(); await consent(page).check(); await settle(page);
  const other = await context.newPage(); await other.clock.install({ time: new Date("2026-10-13T03:59:50Z") });
  await other.goto("/routine/"); await settle(other);
  const holder = await context.newPage(); await holder.goto("/"); await hold(holder);
  await page.getByRole("button", { name: "Erase all routine data and turn off both saving options" }).click();
  await page.getByRole("button", { name: "Confirm — erase all routine data", exact: true }).click();
  await waitQueued(holder);
  await other.getByRole("checkbox", { name: "Enable seven-day history in this browser" }).click();
  await expect(other.getByRole("checkbox", { name: "Enable seven-day history in this browser" })).toBeChecked();
  const historyBytes = await holder.evaluate(() => localStorage.getItem("smile-track:routine-history:1"));
  expect(historyBytes).not.toBeNull();
  await release(holder); await expect(todayStatus(page)).toContainText("separately verified operations");
  expect(await stored(holder)).toBeNull();
  expect(await holder.evaluate(() => localStorage.getItem("smile-track:routine-history:1"))).toBe(historyBytes);
});

test("P01-01 identical-byte re-enable remains indistinguishable under observed-value contract", async ({ page, context }) => {
  await suppressStorageEvents(page);
  await page.goto("/routine/"); await settle(page); await brush(page).check(); await consent(page).check(); await settle(page);
  const other = await context.newPage(); await other.clock.install({ time: new Date("2026-10-13T03:59:50Z") });
  await other.goto("/routine/"); await settle(other);
  await eraseToday(other).click(); await settle(other); expect(await stored(other)).toBeNull();
  await brush(other).check(); await consent(other).check(); await settle(other);
  expect(JSON.parse((await stored(other))!)).toEqual(sample);
  await between(page).evaluate(element => (element as HTMLInputElement).click()); await settle(page);
  expect(JSON.parse((await stored(other))!)).toEqual({ ...sample, cleanedBetweenTeeth: true });
  // This is deliberately evidence of the ABA limitation, not durable-epoch revocation.
});

test("P01-07 today-only privacy copy is scoped and retains local-storage warnings", async ({ page }) => {
  await page.goto("/routine/");
  await expect(page.getByText(/entries are not sent anywhere/i)).toHaveCount(0);
  const details = page.locator("#saving-details");
  await expect(details.getByText("This version of Smile Track has no in-app feature for uploading or sharing routine entries.", { exact: false })).toBeVisible();
  await expect(details.getByText("By default, selections stay in this page’s memory and disappear when you leave or reload it.", { exact: false })).toBeVisible();
  await expect(details.getByText("Other people using this profile may see it. Browser backups or synchronization are outside Smile Track’s control.", { exact: false })).toBeVisible();
  await expect(details.getByText("Saving and in-app deletion require browser tab coordination.", { exact: false })).toBeVisible();
  await expect(details.getByText("This option does not keep history.", { exact: false })).toBeVisible();
});

for (const ordering of ["before", "after"] as const) {
  test(`P01-02A fresh R01 consent ${ordering} combined R01 erasure`, async ({ page, context }, testInfo) => {
    const historyKey = "smile-track:routine-history:1";
    const historyLock = "smile-track:routine-history";
    const unrelated = "p01-02a:unrelated";
    const fresh = { ...sample, brushedTeeth: false, cleanedBetweenTeeth: true };
    const history = { version: 1, enabled: true, entries: [{ date: today, brushedTeeth: true, cleanedBetweenTeeth: false }] };
    const historyConsent = (tab: Page) => tab.getByRole("checkbox", { name: "Enable seven-day history in this browser" });
    const all = page.getByRole("button", { name: "Erase all routine data and turn off both saving options", exact: true });
    const requests: string[] = [];
    const errors: string[] = [];
    const trace: unknown[] = [];
    const other = await context.newPage();
    await page.clock.setSystemTime(new Date("2026-10-12T16:00:00Z"));
    await other.clock.install({ time: new Date("2026-10-12T16:00:00Z") });
    for (const tab of [page, other]) {
      tab.on("pageerror", error => errors.push(error.message));
      tab.on("request", request => requests.push(`${request.method()} ${request.url()} ${request.postData() ?? ""}`));
    }
    await page.goto("/routine/");
    await brush(page).check(); await consent(page).check();
    await expect(todayStatus(page)).toContainText("Saved in this browser for today.");
    await historyConsent(page).click();
    await expect(historyConsent(page)).toBeChecked();
    await page.getByRole("button", { name: "Record today’s check-in in history" }).click();
    await expect.poll(() => page.evaluate(k => localStorage.getItem(k), historyKey)).toBe(JSON.stringify(history));
    await page.evaluate(k => localStorage.setItem(k, "synthetic-preserve"), unrelated);
    await other.goto("/routine/");
    await expect(consent(other)).toBeChecked(); await expect(brush(other)).toBeChecked();
    await expect(historyConsent(other)).toBeChecked();
    const holderH = await context.newPage(); await holderH.goto("/");
    const holderR = await context.newPage(); await holderR.goto("/");
    const requestCount = requests.length;
    async function snapshot(phase: string) {
      const state = { phase, locks: await holderH.evaluate(() => navigator.locks.query()),
        storage: await page.evaluate(() => Object.fromEntries(Object.keys(localStorage).sort().map(k => [k, localStorage.getItem(k)]))),
        tabs: await Promise.all([page, other].map(async tab => ({
          consent: await consent(tab).isChecked(), brush: await brush(tab).isChecked(), between: await between(tab).isChecked(),
          todayNotice: await todayStatus(tab).innerText(), historyConsent: await historyConsent(tab).isChecked(),
          historyNotice: await tab.getByRole("status", { name: "History status" }).innerText(),
        }))) };
      trace.push(state); console.log("P01-02A", ordering, JSON.stringify(state));
    }
    async function saveFresh() {
      await brush(other).uncheck(); await between(other).check(); await consent(other).check();
      await expect(todayStatus(other)).toContainText("Saved in this browser for today.");
      expect(await stored(other)).toBe(JSON.stringify(fresh));
      await expect(consent(other)).toBeChecked(); await expect(between(other)).toBeChecked();
      await expect(brush(other)).not.toBeChecked();
    }
    await snapshot("initial-saved");
    expect(await stored(page)).toBe(JSON.stringify(sample));
    // Control B injection point: silent rejection is test-scoped to Tab A.
    await hold(holderH, historyLock);
    await all.click(); await page.getByRole("button", { name: "Confirm — erase all routine data", exact: true }).click();
    await waitQueued(holderH, 1, historyLock);
    const waiting = await holderH.evaluate(() => navigator.locks.query());
    expect(waiting.held?.some(lock => lock.name === historyLock)).toBe(true);
    expect(waiting.held?.some(lock => lock.name === routineLock)).toBe(false);
    expect(waiting.pending?.some(lock => lock.name === routineLock)).toBe(false);
    await expect(all).toBeDisabled();
    await expect(todayStatus(page)).not.toContainText("All routine data erased");
    await snapshot("A-waits-for-history");
    if (ordering === "before") {
      await consent(other).uncheck();
      await expect(todayStatus(other)).toContainText("Check-in erased");
      expect(await stored(other)).toBeNull();
      await expect(brush(other)).toBeChecked(); await expect(consent(other)).not.toBeChecked();
      await snapshot("B-explicit-revocation");
      await saveFresh();
      expect(await other.evaluate(k => localStorage.getItem(k), historyKey)).toBe(JSON.stringify(history));
      await snapshot("B-fresh-saved-before-history-release");
    }
    await hold(holderR);
    await release(holderH); await waitQueued(holderR);
    expect(await page.evaluate(k => localStorage.getItem(k), historyKey)).toBeNull();
    expect(await stored(page)).toBe(JSON.stringify(ordering === "before" ? fresh : sample));
    expect((await holderR.evaluate(() => navigator.locks.query())).held?.some(lock => lock.name === historyLock)).toBe(false);
    await expect(todayStatus(page)).toContainText("Waiting for coordinated browser storage");
    await snapshot("history-erased-A-queued-for-R01");
    await release(holderR);
    await expect(all).toBeEnabled();
    await snapshot("A-erasure-returned");
    // Control A injection point: deliberately violate the cooperating lock boundary.
    expect(await stored(page)).toBeNull();
    await expect(todayStatus(page)).toContainText("All routine data erased in separately verified operations.");
    await expect(todayStatus(page)).toContainText("Another tab may enable saving again between or after these operations");
    for (const tab of [page, other]) {
      await expect(consent(tab)).not.toBeChecked(); await expect(historyConsent(tab)).not.toBeChecked();
      await expect(brush(tab)).not.toBeChecked(); await expect(between(tab)).not.toBeChecked();
    }
    await snapshot("both-tabs-observe-erasure");
    if (ordering === "after") {
      await saveFresh();
      await expect(todayStatus(page)).toContainText("A saved current-day record exists but is not attached here.");
      await expect(consent(page)).not.toBeChecked(); await expect(brush(page)).not.toBeChecked();
      await expect(between(page)).not.toBeChecked();
      await snapshot("B-fresh-saved-after-completed-erasure");
    }
    // A real lock acquisition barrier drains earlier cooperating R01 work.
    await holderR.evaluate(lock => navigator.locks.request(lock, () => undefined), routineLock);
    expect(await stored(page)).toBe(ordering === "after" ? JSON.stringify(fresh) : null);
    expect(await page.evaluate(k => localStorage.getItem(k), historyKey)).toBeNull();
    expect(await page.evaluate(k => localStorage.getItem(k), unrelated)).toBe("synthetic-preserve");
    expect(await page.evaluate(() => Object.keys(localStorage).sort())).toEqual(
      (ordering === "after" ? [unrelated, key] : [unrelated]).sort());
    for (const tab of [page, other]) expect(await tab.evaluate(() => sessionStorage.length)).toBe(0);
    expect(await context.cookies()).toEqual([]); expect(requests.slice(requestCount)).toEqual([]); expect(errors).toEqual([]);
    await snapshot("final-after-lock-barrier");
    await testInfo.attach(`p01-02a-${ordering}.json`, { body: JSON.stringify(trace, null, 2), contentType: "application/json" });
  });
}
