import { readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { URL } from "node:url";

// Mutate only generated output, never application source. Always restore it.
const path = new URL("../out/index.html", import.meta.url);
const original = readFileSync(path, "utf8");
const required = "Smile Track is not a diagnostic medical device and does not provide diagnoses or replace professional dental care.";
if (!original.includes(required)) throw new Error("Build the unmodified application first.");
try {
  writeFileSync(path, original.replaceAll(required, "Safety positioning removed for the negative control."));
  const result = spawnSync(process.execPath, ["node_modules/@playwright/test/cli.js", "test", "--project=desktop-chromium"], { encoding: "utf8" });
  const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`;
  process.stdout.write(output);
  if (result.status !== 1 || !output.includes(required) || !output.includes("toBeVisible")) {
    throw new Error("Negative control did not fail at the required safety-content assertion.");
  }
  process.stdout.write("PASS: removing required safety positioning makes the smoke test fail.\n");
} finally {
  writeFileSync(path, original);
}
