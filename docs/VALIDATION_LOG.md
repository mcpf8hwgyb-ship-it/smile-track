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

PASS — [Foundation CI run 37719005238](https://github.com/mcpf8hwgyb-ship-it/smile-track/actions/runs/37719005238), job `113122063939`, for implementation head `35ee86d5093867207ed2328c3ae52008447d57ff` (PR test merge `e2681c753041ced916a6607d080fb7b0b41a6861`). Checked job steps and logs.

- Clean `npm ci`, lint, strict typecheck, and production static export: PASS.
- `npx playwright install --with-deps chromium`: PASS on Ubuntu 24.04.
- `npm run test:e2e`: **2 passed** — desktop 1440×1000 and mobile 390×844.
- Verified required identity, preview and non-diagnostic copy; Tab/Enter skip navigation; visible focus outlines; focused in-page destination; >=44px link height; no horizontal overflow; no page errors, external requests, cookies, localStorage, or sessionStorage writes during the tested flow.
- `npm run test:smoke-sensitivity`: PASS. Removing required safety wording caused the exact `getByText(...).toBeVisible()` assertion to fail with element(s) not found; the script restored exported HTML. The intentional failing test in this step is positive evidence of sensitivity.
- `npm audit --audit-level=high`: PASS, zero vulnerabilities reported.

Browser success is CI evidence, not local evidence. This documentation-only follow-up does not change application/tooling/test files.

### Scope and limitations

No assets extracted/imported from the supplied Stage 09C ZIP. Master specification, content-review state, and research README remain untouched remotely. No clinical content, geometry, calibration, laterality, numbering, or certification changes. No product features, cloud services, persistence, sensitive data, or credentials added. Browser checks are Chromium only; mobile emulation does not demonstrate real-device compatibility. Full screen-reader and security reviews are not performed.

### Reproducibility and final repository checks

- `git archive HEAD | tar -x -C /tmp --one-top-level=f01-clean-checkout`, then `npm ci`, `npm run lint`, `npm run typecheck`, and `NEXT_TELEMETRY_DISABLED=1 npm run build`: PASS in a fresh source-only directory. `cmp package-lock.json /tmp/f01-clean-checkout/package-lock.json`: identical. GitHub Actions independently reproduced installation/build from its checkout.
- `NEXT_TELEMETRY_DISABLED=1 npm run dev -- --port 3001` in that fresh directory: PASS; HTTP GET `/` returned 200 with identity and safety copy. An earlier working-directory attempt conflicted with a still-running development process during reinstall; it was stopped before the isolated successful check.
- Tracked-file inspection found no generated output, dependencies, credential files, source geometry, or ZIPs. Obvious AWS/GitHub-token/private-key pattern checks found no matches; this is not a full secret audit.
- `git diff` confirms no changes to master specification, content-evidence document, or research README. Existing D-001/D-002 governance remains unchanged.
- Supplied, unopened Stage 09C ZIP SHA-256: `a473b9850447295136a6f4abce952836728ee19053b83f56df1da001a8e9cafa`. No extraction or import occurred.
- F01 implementation and automated evidence are ready for Architect review. No merge or next feature is authorized.
