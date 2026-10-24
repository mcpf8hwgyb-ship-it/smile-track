import { expect, test, type BrowserContext, type Page, type Request } from "@playwright/test";
import { readdirSync } from "node:fs";
import { join } from "node:path";

const origin = "http://127.0.0.1:4173";
const date = "2026-10-12";
const todayKey = "smile-track:routine:1";
const historyKey = "smile-track:routine-history:1";
const sample = { version: 1, date, brushedTeeth: true, cleanedBetweenTeeth: false };
const entry = { date, brushedTeeth: true, cleanedBetweenTeeth: false };
const history = { version: 1, enabled: true, entries: [entry] };

test.use({ timezoneId: "America/New_York", serviceWorkers: "block" });

// Match contextual synthetic records, never a boolean or date alone. This is
// deliberately bounded: no claim about arbitrary transforms or partial fields.
function routineBearing(value: string): boolean {
  let decoded = value;
  for (let pass = 0; pass < 3; pass++) {
    if (decoded.includes(date) && /brushedTeeth["'\s]*[:=][\s]*(true|false)/.test(decoded)
      && /cleanedBetweenTeeth["'\s]*[:=][\s]*(true|false)/.test(decoded)) return true;
    try { decoded = decodeURIComponent(decoded.replace(/\+/g, " ")); } catch { break; }
  }
  return false;
}

// An exact on-disk export inventory is narrower than permitting an entire origin
// or extension. No endpoint outside this inventory can leave the route handler.
function staticPaths(directory = "out", prefix = ""): Set<string> {
  const paths = new Set<string>();
  for (const item of readdirSync(directory, { withFileTypes: true })) {
    const path = `${prefix}/${item.name}`;
    if (item.isDirectory()) {
      for (const child of staticPaths(join(directory, item.name), path)) paths.add(child);
    } else {
      paths.add(path);
      if (item.name === "index.html") paths.add(`${prefix}/`);
    }
  }
  return paths;
}

type Observation = {
  source: string; destination: string; url: string; path: string; query: string;
  method: string; headers: Record<string, string>; body: string | null;
  resourceType: string; disclosure: boolean; allowed: boolean; outcome: string;
};
async function instrument(context: BrowserContext) {
  const assets = staticPaths();
  const requests: Observation[] = [];
  const byRequest = new Map<Request, Observation>();
  const sockets: { url: string; messages: { text: string; disclosure: boolean }[]; forwarded: false }[] = [];
  context.on("requestfinished", request => { const row = byRequest.get(request); if (row) row.outcome = "finished"; });
  context.on("requestfailed", request => { const row = byRequest.get(request); if (row) row.outcome = request.failure()?.errorText ?? "failed"; });
  await context.route("**/*", async route => {
    const request = route.request();
    const url = new URL(request.url());
    const headers = await request.allHeaders();
    const body = request.postData();
    const disclosure = [url.href, body ?? "", ...Object.values(headers)].some(routineBearing);
    // Next static RSC navigation may add its opaque cache token. All other
    // queries are denied, even for a real static file.
    const staticQuery = [...url.searchParams].every(([key, value]) => key === "_rsc" && /^[a-zA-Z0-9_-]+$/.test(value));
    const allowed = url.origin === origin && request.method() === "GET"
      && body === null && assets.has(url.pathname) && staticQuery && !disclosure;
    let source: string;
    if (request.serviceWorker()) {
      source = "service-worker-originated: frame unavailable";
    } else if (request.isNavigationRequest()) {
      source = "navigation: frame URL not observed (frame may not yet exist)";
    } else {
      try {
        const frameURL = request.frame().url();
        source = frameURL ? `frame-originated: ${frameURL}` : "unavailable-frame: empty frame URL";
        if (!frameURL) console.warn("P01-07A frame metadata uncertainty", request.url(), source);
      } catch (error) {
        source = `unavailable-frame: unexpected access failure: ${String(error)}`;
        console.warn("P01-07A frame metadata uncertainty", request.url(), source);
      }
    }
    const row: Observation = {
      source, destination: url.origin, url: url.href,
      path: url.pathname, query: url.search, method: request.method(), headers, body,
      resourceType: request.resourceType(), disclosure, allowed, outcome: allowed ? "continued" : "blocked",
    };
    requests.push(row);
    byRequest.set(request, row);
    if (allowed) await route.continue();
    else await route.abort("blockedbyclient");
  });
  await context.routeWebSocket("**/*", socket => {
    const row = { url: socket.url(), messages: [] as { text: string; disclosure: boolean }[], forwarded: false as const };
    sockets.push(row);
    // Never connectToServer: a local mocked channel only, including controls.
    socket.onMessage(message => {
      const text = typeof message === "string" ? message : message.toString("utf8");
      row.messages.push({ text, disclosure: routineBearing(text) });
      socket.send("captured locally");
    });
  });
  return { requests, sockets };
}
const checkbox = (page: Page, name: string) => page.getByRole("checkbox", { name, exact: true });
const brush = (page: Page) => checkbox(page, "Brushed teeth");
const saving = (page: Page) => checkbox(page, "Save today’s check-in in this browser");
const consent = (page: Page) => checkbox(page, "Enable seven-day history in this browser");
const status = (page: Page) => page.getByRole("status", { name: "Today-only status" });
const historyStatus = (page: Page) => page.getByRole("status", { name: "History status" });
const record = (page: Page) => page.getByRole("button", { name: "Record today’s check-in in history" });
async function storage(page: Page) {
  return page.evaluate(() => Object.fromEntries(Object.keys(localStorage).sort().map(key => [key, localStorage.getItem(key)])));
}
async function expectStorage(page: Page, today: unknown, savedHistory: unknown) {
  const expected: Record<string, string> = {};
  if (today !== null) expected[todayKey] = JSON.stringify(today);
  if (savedHistory !== null) expected[historyKey] = JSON.stringify(savedHistory);
  await expect.poll(() => storage(page)).toEqual(expected);
  expect(await page.evaluate(() => sessionStorage.length)).toBe(0);
}

test("P01-07A: bounded R01/R02 workflow transmission observations", async ({ page, context }, testInfo) => {
  const observations = await instrument(context);
  const states: { action: string; storage: Record<string, string | null>; todayNotice: string | null; historyNotice: string | null }[] = [];
  async function capture(action: string) {
    states.push({ action, storage: await storage(page), todayNotice: await status(page).textContent(), historyNotice: await historyStatus(page).textContent() });
  }
  await page.clock.install({ time: new Date("2026-10-12T16:00:00Z") });
  try {
    await page.goto("/routine/");
    await expect(brush(page)).toBeEnabled();
    await expect(consent(page)).toBeEnabled();
    await brush(page).check();
    await expect(saving(page)).not.toBeChecked();
    await expect(consent(page)).not.toBeChecked();
    await expectStorage(page, null, null);
    await capture("memory-only selections");
    await saving(page).check();
    await expect(status(page)).toContainText("Saved in this browser for today.");
    await expectStorage(page, sample, null);
    await expect(consent(page)).not.toBeChecked();
    await capture("explicit R01 saving");
    await consent(page).click();
    await expect(consent(page)).toBeChecked();
    await expect(consent(page)).toBeChecked();
    await expect(record(page)).toBeEnabled();
    await expectStorage(page, sample, { version: 1, enabled: true, entries: [] });
    await record(page).click();
    await expect(historyStatus(page)).toContainText("Today’s check-in recorded");
    await expectStorage(page, sample, history);
    await capture("independent R02 explicit snapshot");
    for (const destination of ["Home", "Learn", "Routine"] as const) {
      await page.getByRole("link", { name: destination, exact: true }).click();
      await expect(page).toHaveURL(`${origin}${destination === "Home" ? "/" : `/${destination.toLowerCase()}/`}`);
      await expectStorage(page, sample, history);
    }
    await page.reload();
    await expect(brush(page)).toBeChecked();
    await expect(checkbox(page, "Cleaned between teeth")).not.toBeChecked();
    await expect(saving(page)).toBeChecked();
    await expect(consent(page)).toBeChecked();
    await expect(page.getByRole("listitem", { name: date, exact: true })).toContainText("Brushed teeth: Marked");
    await expectStorage(page, sample, history);
    await capture("navigation and reload restoration");
    await page.getByRole("button", { name: "Erase today-only record and turn off today-only saving" }).click();
    await expect(status(page)).toContainText("Check-in erased. Saving is off.");
    await expect(saving(page)).not.toBeChecked();
    await expect(brush(page)).not.toBeChecked();
    await expect(consent(page)).toBeChecked();
    await expectStorage(page, null, history);
    await capture("independent R01 erasure");
    await brush(page).check();
    await saving(page).check();
    await expectStorage(page, sample, history);
    await page.getByRole("button", { name: "Erase history and turn it off", exact: true }).click();
    await expect(historyStatus(page)).toContainText("History erased. History is off.");
    await expect(consent(page)).not.toBeChecked();
    await expect(saving(page)).toBeChecked();
    await expect(brush(page)).toBeChecked();
    await expectStorage(page, sample, null);
    await capture("independent R02 erasure");
    await consent(page).click();
    await expect(consent(page)).toBeChecked();
    await expect(record(page)).toBeEnabled();
    await record(page).click();
    await expectStorage(page, sample, history);
    await page.getByRole("button", { name: "Erase all routine data and turn off both saving options", exact: true }).click();
    await expectStorage(page, sample, history);
    await page.getByRole("button", { name: "Confirm — erase all routine data", exact: true }).click();
    await expect(status(page)).toContainText("All routine data erased in separately verified operations.");
    await expect(saving(page)).not.toBeChecked();
    await expect(consent(page)).not.toBeChecked();
    await expect(brush(page)).not.toBeChecked();
    await expect(checkbox(page, "Cleaned between teeth")).not.toBeChecked();
    await expect(page.getByTestId("history-overview")).toHaveCount(0);
    await expectStorage(page, null, null);
    await capture("confirmed combined erasure");
    expect(await context.cookies()).toEqual([]);
    await page.close();
    expect(observations.requests.length).toBeGreaterThan(0);
    expect(observations.requests.filter(row => !row.allowed || row.disclosure)).toEqual([]);
    expect(observations.sockets).toEqual([]);
  } finally {
    const evidence = JSON.stringify({ project: testInfo.project.name, states, ...observations }, null, 2);
    await testInfo.attach("P01-07A-workflow-observations", { body: evidence, contentType: "application/json" });
    console.log("P01-07A workflow evidence", evidence);
  }
});

test("P01-07A: local URL/body/header/method/WebSocket sensitivity and static positive control", async ({ page, context }, testInfo) => {
  const observations = await instrument(context);
  await page.goto("/");
  const start = observations.requests.length;
  const results = await page.evaluate(async data => {
    async function attempt(url: string, init?: RequestInit) {
      try { await fetch(url, init); return "unexpectedly completed"; } catch { return "blocked"; }
    }
    const json = JSON.stringify(data);
    return {
      url: await attempt(`/routine/?record=${encodeURIComponent(json)}`),
      body: await attempt("/routine/", { method: "POST", body: json }),
      header: await attempt("/routine/", { headers: { "X-Synthetic-Record": json } }),
      method: await attempt("/routine/", { method: "DELETE" }),
      external: await attempt("https://p01-07a.invalid/blocked"),
      nonStatic: await attempt("/not-a-static-export-endpoint"),
      static: (await fetch("/routine/")).status,
      websocket: await new Promise<string>((resolve, reject) => {
        const socket = new WebSocket("ws://127.0.0.1:4173/p01-07a-control");
        socket.onopen = () => socket.send(json);
        socket.onmessage = event => { resolve(String(event.data)); socket.close(); };
        socket.onerror = () => reject(new Error("WebSocket mock could not be assessed"));
      }),
    };
  }, sample);
  expect(results).toEqual({ url: "blocked", body: "blocked", header: "blocked", method: "blocked", external: "blocked", nonStatic: "blocked", static: 200, websocket: "captured locally" });
  const controls = observations.requests.slice(start);
  expect(controls.filter(row => row.disclosure)).toHaveLength(3);
  expect(controls.filter(row => !row.allowed)).toHaveLength(6);
  expect(controls.filter(row => row.allowed)).toHaveLength(1);
  expect(controls.find(row => row.method === "DELETE")).toMatchObject({ allowed: false, disclosure: false });
  expect(controls.find(row => row.method === "POST")).toMatchObject({ allowed: false, disclosure: true, body: JSON.stringify(sample) });
  expect(observations.sockets).toEqual([{ url: "ws://127.0.0.1:4173/p01-07a-control", messages: [{ text: JSON.stringify(sample), disclosure: true }], forwarded: false }]);
  expect(await context.cookies()).toEqual([]);
  await expectStorage(page, null, null);
  const evidence = JSON.stringify({ project: testInfo.project.name, results, controls, sockets: observations.sockets }, null, 2);
  await testInfo.attach("P01-07A-detector-controls", { body: evidence, contentType: "application/json" });
  console.log("P01-07A detector evidence", evidence);
});
