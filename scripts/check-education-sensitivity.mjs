// Negative controls touch only the local inputs/output, restore exact bytes, and rebuild.
import { readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { draftFixture, approvedFixture } from "../education/fixtures.ts";
const recordsPath = "content/education/records.json", original = readFileSync(recordsPath);
const htmlPath = "out/learn/index.html";
const run = (args) => spawnSync(process.execPath, args, { encoding: "utf8", env: process.env });
try {
  // Both have citations; neither has authorization in the production authority registry.
  writeFileSync(recordsPath, JSON.stringify([draftFixture(), { ...approvedFixture(), id: "synthetic-withdrawn",
    evidenceReview: { status: "draft" }, publication: { status: "not-approved" },
    lifecycle: { status: "withdrawn", changedOn: "2026-10-12", reason: "Synthetic negative control" } }]));
  const build = run(["node_modules/next/dist/bin/next", "build"]);
  process.stdout.write(build.stdout + build.stderr);
  assert.equal(build.status, 0, "Build with unpublished synthetic inputs must succeed");
  const clean = run(["--experimental-strip-types", "scripts/check-education-export.mjs"]);
  process.stdout.write(clean.stdout + clean.stderr);
  assert.equal(clean.status, 0, "Unapproved content must be absent from actual static export");
  const html = readFileSync(htmlPath);
  try {
    writeFileSync(htmlPath, Buffer.concat([html, Buffer.from("E01_SYNTHETIC_BODY: deliberate export leak")]));
    const rejected = run(["--experimental-strip-types", "scripts/check-education-export.mjs"]);
    assert.notEqual(rejected.status, 0);
    assert.match(rejected.stderr, /Unpublished\/test content in export/);
    process.stdout.write("PASS: deliberately leaked fixture fails the export check.\n");
  } finally { writeFileSync(htmlPath, html); }
} finally {
  writeFileSync(recordsPath, original);
  const restored = run(["node_modules/next/dist/bin/next", "build"]);
  process.stdout.write(restored.stdout + restored.stderr);
  assert.equal(restored.status, 0, "Restored production catalog must rebuild successfully");
}
