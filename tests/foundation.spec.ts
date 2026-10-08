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
  await expect(page.getByText("This is an early preview. Education, tracking, and capture features are not available yet.", { exact: true })).toBeVisible();
  await expect(page.getByText("Smile Track is not a diagnostic medical device and does not provide diagnoses or replace professional dental care.", { exact: true })).toBeVisible();
  await expect(page.getByText("This preview has no accounts, photo uploads, or health-data entry.", { exact: true })).toBeVisible();

  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await expect(skip).toHaveCSS("outline-style", "solid");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
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
