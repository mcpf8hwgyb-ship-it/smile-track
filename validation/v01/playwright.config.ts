import { defineConfig } from "@playwright/test";

// Investigation only: reuse existing assertions without changing required CI.
export default defineConfig({
  testDir: "../..",
  testMatch: ["tests/routine.spec.ts", "tests/history.spec.ts", "validation/v01/capabilities.spec.ts"],
  outputDir: process.env.V01_OUTPUT_DIR || "/tmp/smile-track-v01-results",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  maxFailures: 1,
  reporter: [["list"], ["json", { outputFile: process.env.V01_JSON || "/tmp/smile-track-v01-results.json" }]],
  use: { baseURL: "http://127.0.0.1:4173", headless: true, trace: "retain-on-failure" },
  projects: (["chromium", "firefox", "webkit"] as const).flatMap(browserName =>
    (["desktop", "mobile-viewport"] as const).map(layout => ({
      name: `${browserName}-${layout}`,
      // Firefox has no Playwright isMobile emulation; use the same CSS viewport
      // for all engines. This is layout evidence, not mobile-device validation.
      use: { browserName, viewport: layout === "desktop" ? { width: 1440, height: 1000 } : { width: 390, height: 844 } },
      // Original Chromium CDP test remains unchanged. No live-timezone claim
      // is made for other engines; portable DST/calendar tests still execute.
      grepInvert: browserName === "chromium" ? undefined : /a timezone change rejects now-future dates/,
    }))),
  webServer: { command: "npm run preview", url: "http://127.0.0.1:4173", reuseExistingServer: false, timeout: 30_000 },
});
