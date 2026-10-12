# SMILE TRACK — VALIDATION LOG

This file records meaningful technical validation.

## E01 — 2026-10-12 — local validation and post-F02 reconciliation

Base/main reverified through GitHub: `a95a8ff1831900e6148a00c3681d928518bd8875`.
Branch: `e01-education-foundation`. F02 PR #2 is merged; post-merge
[CI 38215252635](https://github.com/mcpf8hwgyb-ship-it/smile-track/actions/runs/38215252635)
passed on that base. Prior entries below remain historical and unchanged.

Exact environment, commands, fixture cases, non-sensitive browser evidence, changed
files, security boundaries and limitations: [E01_REPORT.md](E01_REPORT.md).

- `npm ci`: PASS, 186 packages, unchanged lockfile; Node 24.19.0 / npm 11.9.0.
- `npm run lint`: PASS, zero warnings after fixing an initial missing Buffer import.
- `npm run typecheck`: PASS, strict TypeScript and generated route types.
- `npm run test:education`: PASS, 5 tests, no skips; approved synthetic positive,
  citation-only/draft/pending/review-only exclusions, malformed/missing review and
  provenance rejection, version/digest binding, withdrawal/supersession, expiry,
  inactive/missing authority and contributor/reviewer approval-conflict controls.
- `npm run test:f02`: PASS, 4 synthetic tests; 1 restricted frozen-data test explicitly
  SKIPPED. No scientific model work or new controlled rendering was performed.
- `NEXT_TELEMETRY_DISABLED=1 npm run build`: PASS; `/`, `/_not-found`, `/learn` static.
- `npm run check:export`: PASS; app 6 files, out 28 files, 0 approved lessons;
  no restricted payloads, unpublished bodies or test fixtures in export.
- `npm run test:e2e` with the exact fallback environment in E01_REPORT: PASS, 4 cases;
  Home and Learn at 1440x1000 and 390x844. Keyboard skip/main/link focus and navigation,
  visible outlines, target height, no overflow/errors/external requests/storage writes.
  Local Chromium 153.0.8010.0; Learn screenshots visually inspected at both sizes.
- `npm run test:smoke-sensitivity` with the same environment: PASS. Deliberately
  removing Home safety copy fails its exact text assertion; Learn remains passing;
  the wrapper exits 0 and restores output. This is intentional negative evidence.
- `NEXT_TELEMETRY_DISABLED=1 npm run test:education-sensitivity`: PASS. Temporarily
  installed cited unpublished synthetic records; actual static export excluded them.
  Deliberately leaked fixture marker caused export validation failure; original
  catalog bytes restored and production rebuilt. Final `npm run check:export`: PASS.
- `npm audit --audit-level=high`: PASS, zero reported vulnerabilities at check time.
- `git diff --check`: PASS. F02 code/evidence, scientific export guard, Next config,
  lockfile and F01 browser test are byte-unchanged. All seven prior documentation
  bodies preserved verbatim beneath additive transitions. Candidate source inventory
  has no restricted/generated/credential files or obvious token/private-key patterns.

No real educational content or human reviewer appointment is approved. The static
gate checks metadata and version bindings, not medical correctness or human testimony.
Real devices, assistive technology, comprehensive security review and automatic
revocation of already-hosted static pages remain outside these results. No scientific
ZIP was opened/imported in E01; no model, backend, health-data or hosting change occurred.

### E01 CI evidence

PASS — [Foundation CI 38264947639](https://github.com/mcpf8hwgyb-ship-it/smile-track/actions/runs/38264947639),
job `114864646063`, associated with exact implementation head
`539c5d4491485d19de8c01862c85dfa9f4d88622`. GitHub checked out its PR test merge
(`b09a3b5…`) against the unchanged approved main base. Run metadata, job steps and
decoded logs were checked, not merely the PR badge.

Clean installation, lint, strict types, 5 education tests, 4 F02 synthetic tests
(1 restricted-data skip), static build, both export guards, bundled-browser installation,
4 desktop/mobile browser checks, safety-copy sensitivity, education export negative
controls and dependency audit all passed. The logs report 28 export files, zero
approved lessons, successful deliberate-leak rejection and zero vulnerabilities.
CI independently reproduces the local results without the local browser fallback.

This evidence update changes documentation only. Its exact final PR head and CI run
are verified separately in the PR handoff after that run completes, avoiding a
self-referential commit hash or prematurely claiming a pending run passed.
After a session interruption the local execution service was unavailable; the already
committed implementation and prior local results were preserved in GitHub. This
documentation follow-up uses those verified records and GitHub CI, not a claimed
new local validation run.

No merge, lesson publication or further feature is authorized.

---

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

## F02 — 2026-10-12 UTC / America/New_York — local evidence

Scope is the Architect-approved internal investigation, not a public explorer.
Inspected and rechecked main `2aa706c5ea609dc41b6e0cdca6969b847f75d0af`;
PR #1 merged 2026-10-08 02:54:46 UTC. Feature branch
`f02-internal-3d-feasibility`. Historical records above remain unchanged.
Stage 09C closure and the exact four independently verified archive hashes are in
[F02_REPORT.md](F02_REPORT.md); later Gate B desktop acceptance is owner-attested,
not an independently repeated Builder result. Fifteen statuses and sixteen flags
remain unchanged. No scientific model or public application feature was changed.

### Observed commands and outcomes

- `npm ci`: PASS from committed lockfile; Node 24.19.0/npm 11.9.0.
- `npm run lint`: PASS, no warnings; React Hooks rules-of-hooks and exhaustive-deps added with compatible plugin 7.1.1. Full Next preset remains omitted.
- `npm run typecheck`: PASS, strict TypeScript includes internal code.
- `NEXT_TELEMETRY_DISABLED=1 npm run build`: PASS, static `/` and `/_not-found` only.
- `npm run check:export`: PASS, 4 application files and 23 exported files scanned; no public directory exists. No GLB, restricted manifest, or internal viewer route/import found. Negative-control guard tests reject renamed GLB magic, manifest marker, and internal code reference.
- `npm run test:f02`: 4 PASS, 1 explicitly SKIPPED controlled scientific test without `F02_DATA_DIR`. This is the non-sensitive CI path.
- `F02_DATA_DIR=../f02-controlled-runtime npm run test:f02:controlled`: 5 PASS, 0 skipped; wrapper refuses absent/in-repository controlled data. Exact source arrays, 16/32 mapping, frozen matrices, 2,596,056 coordinate evaluations, independent oracle, reflections, deliberate transposition/double-transform negatives. Maximum direct arithmetic difference 0; oracle tolerance absolute 1e-11 + relative 1e-12.
- `python internal/f02/prepare.py --original '../project_sources/02-SMILE_TRACK_B_STAGE09C_NEW_CHAT_HANDOFF-1-.zip' --scene '../f02-controlled-inputs/SMILE_TRACK_B_STAGE09C_07_SCENE (1).zip' --evidence '../f02-controlled-inputs/SMILE_TRACK_B_STAGE09C_07_EVIDENCE (1).zip' --closure '../f02-controlled-inputs/SMILE_TRACK_B_STAGE09C_CLOSURE_RECORD(1).zip' --out ../f02-controlled-runtime`: PASS, four whole-archive hashes, 271 member checksums/CRC, scene/evidence metadata equality, closure pins, all sources byte-equal originals, full component partitions. Python 3.12.14, NumPy 2.3.5. Source copies rehashed after browser tests: all 16 unchanged.
- `F02_DATA_DIR=../f02-controlled-runtime F02_CHROMIUM_PATH=/workspace/scratch/91c1429b212c/f02-browser-tools/runtime/chromium F02_SOFTWARE_GL=1 LD_LIBRARY_PATH=/workspace/scratch/91c1429b212c/f02-browser-tools/runtime FONTCONFIG_PATH=/workspace/scratch/91c1429b212c/f02-browser-tools/runtime/fonts node internal/f02/browser-check.mjs`: PASS, final metrics in `docs/f02/browser-results.json`. Desktop and 4x CPU-throttled mobile emulation; both material modes; all 24 original textures actually loaded; mode/isolation controls, unchanged matrices after camera movement, reflected A/B pixel visibility, 404/malformed third-source failures, WebGL2-unavailable path. No external requests/page or console errors in valid runs; no WebGL errors/context loss. No restricted screenshots/traces saved.
- `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/workspace/scratch/91c1429b212c/f02-browser-tools/runtime/chromium LD_LIBRARY_PATH=/workspace/scratch/91c1429b212c/f02-browser-tools/runtime FONTCONFIG_PATH=/workspace/scratch/91c1429b212c/f02-browser-tools/runtime/fonts npm run test:e2e`: 2 PASS locally (Chromium 153.0.8010.0). Existing desktop/mobile identity/safety, Tab/Enter navigation, focus outline, touch target, overflow, no errors/external calls/cookies/storage assertions unchanged.
- Same three browser environment variables with `npm run test:smoke-sensitivity`: PASS; deliberately removed safety text triggers exact `toBeVisible` failure, output restored in finally. The intentional failure is positive sensitivity evidence.
- `npm audit --audit-level=high`: PASS, 0 vulnerabilities reported, not comprehensive security certification.
- `git diff --check`: PASS. No scientific assets, generated manifests/oracles, source coordinates, credential files, dependency directories, or build output staged. Public `app/`, F01 assertions and Next config unchanged.

### Failed attempts and measurement limitations

Standard `npx playwright install chromium` again returned an invalid/truncated ZIP.
External test-only @sparticuz/chromium 153.0.0 supplied Chromium 153.0.8010.0;
its default extraction failed on chown, so its own Brotli archives were unpacked
locally without owner restoration. No package or browser binary is committed.
SwiftShader is software rendering, not mobile hardware validation.

Initial cleanup assertions incorrectly expected zero renderer texture count;
tracked assets release, geometry count returns to zero, but one internal texture
remains counted. The report retains that limitation instead of claiming total
GPU memory reclamation. Original images are explicitly closed (24 per original run).

The initial original-material comparison was INVALID: CSP blocked embedded blob
fetching and GLTFLoader fell back to untextured material. Corrected CSP permits
local blob decoding only; an explicit 24-texture assertion and console-error
collection prevent that false positive. Those timings are not used as valid
texture evidence. Two corrected runs are retained; timing variation and shared-host
interference are disclosed. No optimization or source modification was attempted.

### CI scope

CI executes installation, lint, strict types, synthetic F02 tests, production build,
export-boundary guard, original desktop/mobile smoke tests, negative control and
dependency audit. No restricted models/metadata, asset downloads, screenshots or
traces are uploaded. Local controlled source testing is separate from CI.
CI results will be recorded in a subsequent dated evidence entry after observation.

### Clean source-only reproduction and final inspection

`git checkout-index --all --prefix=/tmp/smile-track-f02-clean/` produced a source-only
copy of the staged review tree. In that directory, `npm ci`, `npm run lint`,
`npm run typecheck`, `npm run test:f02`, `NEXT_TELEMETRY_DISABLED=1 npm run build`,
and `npm run check:export` all PASS. `cmp package-lock.json` against the working
checkout was identical. No restricted data was needed or copied for this check.
Changed-file diff, binary/extensions, obvious token/private-key patterns, and
unchanged app/F01 test/Next config checks pass. These are limited inspections,
not comprehensive security or scientific certification.

## F02 — 2026-10-12 — observed CI and review handoff

PASS: [Foundation CI 38213722829](https://github.com/mcpf8hwgyb-ship-it/smile-track/actions/runs/38213722829),
job `114693490111`, implementation head
`11b43514877a7a85b949e07c193a82c6fcfc6f8d`, PR test-merge
`c055be67ca224fc67c80cb4a36d5689018c300ec`. Job steps and decoded logs inspected.
Ubuntu 24.04.5; Node 24.19.0; npm explicitly pinned to 11.9.0; Playwright's
Chrome for Testing / Headless Shell 156.0.8078.4 installed successfully in CI.

All required steps succeeded: clean install, lint, strict types, synthetic F02
checks (4 PASS / 1 controlled-data SKIP), static export, deployment boundary,
F01 desktop/mobile smoke (2 PASS), intentional missing-safety-copy negative control,
and dependency audit (0 vulnerabilities). The test-merge is GitHub's temporary CI
ref; PR #2 remains unmerged and main remains unchanged. No controlled source assets
were present, downloaded, rendered, or uploaded in CI.

[Draft PR #2](https://github.com/mcpf8hwgyb-ship-it/smile-track/pull/2) submits F02
for Architect review. Implementation tree: `ab0a40e4451ef5d71988c102f21bba9dcfe16280`.
The GitHub API commit retains the verified main parent; the local reconstruction
uses separate snapshot history with the same tree, which is not pushed.
This documentation-only follow-up records observed CI; it changes no executable
code, dependency, source asset, or scientific classification. Its CI is visible
in the PR checks. Builder assessment: PASS for further internal integration review;
original-texture real-mobile suitability remains INCONCLUSIVE. Stop after F02.
