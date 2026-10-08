# SMILE TRACK — VALIDATION LOG

This file records meaningful technical validation.

Validation may include:

- builds;
- type checks;
- linting;
- automated tests;
- integration tests;
- UI validation;
- security checks;
- asset-integrity checks;
- scientific validation where explicitly applicable.

---

## Initial State

No application implementation exists yet.

No build, test suite, or technical validation has been performed.


## F01 — 2026-10-08 UTC (2026-10-07 America/New_York)

Base: `main` at `e7c451ccfb6bc046efa481afba147ee539002940`. Feature branch: `f01-app-foundation`.

Runtime: Node v24.19.0, npm 11.9.0. Exact direct versions: README/package.json; transitive versions: package-lock.json.

### Local evidence

- `npm ci`: PASS from lockfile.
- `npm run lint`: PASS, zero warnings, non-interactive.
- `npm run typecheck`: PASS, `next typegen && tsc --noEmit`; strict enabled.
- `NEXT_TELEMETRY_DISABLED=1 npm run build`: PASS; `/` and not-found statically prerendered, `out/index.html` generated.
- `npm audit`: PASS, zero known vulnerabilities in the final dependency graph at check time. Not a comprehensive security audit.
- `npm run test:e2e`: BLOCKED locally at browser launch; no Chromium executable. No browser assertion success is claimed.
- `npx playwright install chromium` and `npx playwright install chromium --only-shell`: FAILED, downloads returned invalid/truncated ZIP archives (end-of-central-directory signature missing).
- Desktop/mobile layout, keyboard focus, runtime request/storage checks, and smoke sensitivity: NOT VERIFIED LOCALLY. Configured for CI.
- `git diff --check`: PASS.

### Investigation and resolved setup failures

- Direct Git clone authentication was unavailable; repository files were read at the exact base commit through the connected GitHub API. Changes are committed through the Git data API with the original upstream parent; local snapshot history is not published.
- ESLint 9.39.5 was marked unsupported. ESLint 10 with the optional Next lint preset produced peer warnings. The preset also pulled an unpatched braces advisory. Final baseline uses supported ESLint 10 plus typescript-eslint; no overrides or suppressed advisories. Next/React-specific rule coverage remains a limitation.
- A provisional `serve` dependency had a compression advisory and failed here on `uv_interface_addresses`. It was removed in favor of a small loopback-only Node static preview script. No backend was added.
- Negative-control script initially triggered `no-undef` for URL; fixed with an explicit node:url import.
- Next dev generated a governance instruction file; automatic generation was disabled with `agentRules: false`, and the generated file removed. Existing governance is preserved.

### CI evidence

PENDING — workflow prepared; run results will be recorded after the feature commit and PR exist.

### Scope and limitations

No assets extracted/imported from the supplied Stage 09C ZIP. Master specification, content-review state, and research README remain untouched remotely. No clinical content, geometry, calibration, laterality, numbering, or certification changes. No product features, cloud services, persistence, sensitive data, or credentials added. Browser checks are Chromium only; mobile emulation does not demonstrate real-device compatibility. Full screen-reader and security reviews are not performed.
