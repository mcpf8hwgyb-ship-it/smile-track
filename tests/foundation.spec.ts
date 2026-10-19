import { expect, test } from "@playwright/test";

test("static landing page communicates identity, limits, and supports keyboard navigation", async ({ page, context }) => {
  const errors: string[] = [];
  const externalRequests: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => {
    if (new URL(request.url()).origin !== "http://127.0.0.1:4173") externalRequests.push(request.url());
  });

  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle("Smile Track | Oral health, understood");
  await expect(page.getByRole("banner")).toContainText("Smile Track");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Oral health,understood.");
  await expect(page.getByText("This is an early preview. A private daily routine check-in is available. Educational lessons and capture features are not available yet.", { exact: true })).toBeVisible();
  await expect(page.getByText("Smile Track is not a diagnostic medical device and does not provide diagnoses or replace professional dental care.", { exact: true })).toBeVisible();
  await expect(page.getByText("This preview has no accounts or photo uploads. Routine entries stay in your browser, with saving off by default.", { exact: true })).toBeVisible();

  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await expect(skip).toHaveCSS("outline-style", "solid");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  await page.keyboard.press("Tab");
  const daily = page.getByRole("link", { name: "Open daily check-in" });
  await expect(daily).toBeFocused();
  await expect(daily).toBeInViewport();
  await expect(daily).toHaveCSS("outline-style", "solid");
  const dailyTarget = await daily.boundingBox();
  expect(dailyTarget?.height).toBeGreaterThanOrEqual(44);
  expect(dailyTarget?.width).toBeGreaterThanOrEqual(44);
  await expect(daily).toHaveAttribute("href", "/routine/");
  await page.keyboard.press("Tab");
  const about = page.getByRole("link", { name: "About this preview" });
  await expect(about).toBeFocused();
  await expect(about).toBeInViewport();
  await expect(about).toHaveCSS("outline-style", "solid");
  const target = await about.boundingBox();
  expect(target?.height).toBeGreaterThanOrEqual(44);
  await page.keyboard.press("Enter");
  await expect(page.getByRole("region", { name: "Understanding starts with clear boundaries." })).toBeFocused();
  await expect(page).toHaveURL(/#about$/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  expect(await context.cookies()).toEqual([]);
  expect(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length }))).toEqual({ local: 0, session: 0 });
  expect(errors).toEqual([]);
  expect(externalRequests).toEqual([]);
});

test("Home primary action opens Routine without enabling persistence or collecting data", async ({ page, context }) => {
  const errors: string[] = [];
  const externalRequests: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("request", request => {
    if (new URL(request.url()).origin !== "http://127.0.0.1:4173") externalRequests.push(request.url());
  });
  await page.goto("/");
  const primary = page.getByRole("link", { name: "Open daily check-in" });
  await expect(primary).toHaveAttribute("href", "/routine/");
  await expect(page.getByText("Optional, self-reported activity tracking. Not a clinical assessment. Saving is off by default.")).toBeVisible();
  expect(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length }))).toEqual({ local: 0, session: 0 });
  await primary.click();
  await expect(page).toHaveURL(/\/routine\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("My daily routine");
  await expect(page.getByRole("checkbox", { name: "Save today’s check-in in this browser" })).not.toBeChecked();
  await expect(page.getByRole("checkbox", { name: "Enable seven-day history in this browser" })).not.toBeChecked();
  await expect(page.getByRole("checkbox", { name: "Brushed teeth" })).not.toBeChecked();
  await expect(page.getByRole("checkbox", { name: "Cleaned between teeth" })).not.toBeChecked();
  expect(await page.evaluate(() => ({
    today: localStorage.getItem("smile-track:routine:1"),
    history: localStorage.getItem("smile-track:routine-history:1"),
    session: sessionStorage.length,
  }))).toEqual({ today: null, history: null, session: 0 });
  expect(await context.cookies()).toEqual([]);
  expect(externalRequests).toEqual([]);
  expect(errors).toEqual([]);
});
