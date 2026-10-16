# V01 continuation — provisioned-environment attempt

## Disposition — 2026-10-15 America/New_York (2026-10-16 UTC)

**BLOCKED / INCONCLUSIVE. No application-level cross-browser result was obtained.**

Architect activation was received after acceptance of PR #9 post-merge evidence.
Verified main/base: `7120770f430663c548ec592397e5d63e36cbfff7`.
Branch: `v01-continuation`. G01 `24954073 — G01-main-protection` was active,
with required PR/validate, strict up-to-date checks, conversation resolution,
force-push/deletion restrictions, no bypass actors and administrator bypass `never`.
The [original V01 preflight](V01_REPORT.md) remains historical BLOCKED / INCONCLUSIVE
and is not relabeled. This continuation also did not reach product validation.

## Environment and supported provisioning

Ubuntu 24.04.3 LTS, x86_64; Node `24.19.0`; npm `11.9.0`;
committed `@playwright/test` / Playwright `1.64.0`. Headless execution only.
The static export built successfully; intended application origin was
`http://127.0.0.1:4173`. No engine reached application navigation, so actual
origin, `isSecureContext`, localStorage and Web Locks behavior are NOT_REVIEWED.
No headed, real-device, Safari/iOS or screen-reader execution occurred.

`npm ci` installed 186 packages. Browser installers ran serially into external
`/tmp/v01c-browsers` (no shared-directory installer race). Full Chromium failed;
Firefox and WebKit downloaded via Playwright's built-in fallback mirror. A separate
Chromium headless-shell attempt failed too. Standard `install-deps` was attempted,
without OS security overrides, and failed. Neither Docker nor Podman was available
on PATH; no container environment is claimed. No sandbox relaxation, alternative
browser version, dependency change, custom download source or permission bypass
was used. Logs, traces, binaries and caches are outside version control.

| Engine | Pinned requested version | Actual runtime | Launch/page repeatability | Application capability result |
| --- | --- | --- | --- | --- |
| Chromium | 156.0.8078.4, revision 1248 | NOT_OBSERVED | BLOCKED: executable absent after both supported download attempts | BLOCKED; origin/security/storage/locks NOT_REVIEWED |
| Firefox | 157.0, revision 1555 | 157.0 | Launch PASS twice in independent probes; blank-page creation crashed twice; application preflight also crashed before navigation | BLOCKED; origin/security/storage/locks NOT_REVIEWED |
| WebKit | 27.2, revision 2370 | NOT_OBSERVED | BLOCKED: launch rejected for missing host libraries; repeat application attempt not executed after first failure | BLOCKED; origin/security/storage/locks NOT_REVIEWED |

Firefox launch is only launch evidence, not application compatibility. WebKit's
requested version comes from the pinned manifest, not an observed runtime.

## Reproduction commands and tooling

From this branch at repository root, using the existing pinned dependency:

```sh
npm ci
export PLAYWRIGHT_BROWSERS_PATH=/tmp/v01c-browsers
node node_modules/playwright/cli.js install chromium
node node_modules/playwright/cli.js install firefox
node node_modules/playwright/cli.js install webkit
node node_modules/playwright/cli.js install-deps chromium firefox webkit
node node_modules/playwright/cli.js install chromium --only-shell
npm run build
```

Run installers separately even when an earlier one fails. Observed exit codes:
Chromium full 1; Firefox 0; WebKit 0; install-deps CLI 1 (APT 100);
Chromium headless-shell 1. A download exit 0 does not mean launch or page execution
works. Exact relevant error excerpts:

```text
Chromium full and headless-shell:
End of central directory record signature not found. Either not a zip file, or file is truncated.
Failed to download Chrome Headless Shell 156.0.8078.4
Download failure, code=1

Firefox blank-page probes, attempts 1 and 2:
{"version":"157.0","launch":"PASS"}
Sandbox: writing /proc/self/uid_map: EPERM
browser.newPage: Target crashed

Standard install-deps:
E: setgroups 65534 failed - setgroups (1: Operation not permitted)
E: setegid 65534 failed - setegid (22: Invalid argument)
E: seteuid 42 failed - seteuid (22: Invalid argument)
E: Method https has died unexpectedly!
E: Sub-process https returned an error code (112)
Error: Installation process exited with code: 100
```

WebKit launch explicitly listed missing libraries: `libgstreamer-1.0.so.0`,
`libgtk-4.so.1`, `libgraphene-1.0.so.0`, `libevent-2.1.so.7`, GStreamer component
libraries (allocators/app/base/pbutils/audio/tag/video/gl/codecparsers/fft),
`libavif.so.16`, `libharfbuzz-icu.so.0`, `libwayland-server.so.0`,
`libmanette-0.2.so.0`, `libsecret-1.so.0`, `libhyphen.so.0`, `libGLESv2.so.2`.

The smallest Firefox reproduction does not load Smile Track:

```sh
DEBUG=pw:browser node - <<'JS'
const { firefox } = require('playwright');
(async () => {
  for (let attempt = 1; attempt <= 2; attempt++) {
    let browser;
    try {
      browser = await firefox.launch({ headless: true });
      console.log({ attempt, version: browser.version(), launch: 'PASS' });
      const page = await browser.newPage();
      await page.goto('about:blank');
      console.log({ attempt, page: 'PASS' });
    } catch (error) {
      console.log({ attempt, result: 'BLOCKED', error: error.message });
    } finally { await browser?.close(); }
  }
})();
JS
```

This diagnostic catches errors; exit 0 is not a test pass. Both launches succeeded,
both `newPage()` calls failed deterministically before `about:blank` navigation.
The EPERM messages support an environment limitation; exact underlying OS cause
has not been fully diagnosed. No application storage/network/concurrency state was
created by this reproduction and no product privacy defect is inferred.

The validation-only configuration reuses unchanged `tests/routine.spec.ts` and
`tests/history.spec.ts`, plus two supplementary capability/denied-lock tests.
It discovers 212 tests across desktop and 390x844 CSS viewports for three engines.
The narrow viewport is not mobile-device emulation or evidence of real-device
compatibility. Existing Chromium CI configuration/tests remain untouched.
One existing live-timezone-change test uses Chromium CDP: it is selected only for
Chromium; Firefox/WebKit live timezone switching is explicitly NOT_REVIEWED.
Portable DST/calendar tests remain selected unchanged. This is not an assertion
relaxation or a substitute result for the excluded CDP operation.

```sh
node node_modules/playwright/cli.js test -c validation/v01/playwright.config.ts --list
# Run each engine separately, serially. Save separate evidence outputs:
V01_JSON=/tmp/v01-firefox-preflight.json V01_OUTPUT_DIR=/tmp/v01-firefox-preflight \
  node node_modules/playwright/cli.js test -c validation/v01/playwright.config.ts \
  --project=firefox-desktop --grep 'V01 actual' --repeat-each=2
# Substitute chromium-desktop or webkit-desktop for the other preflights.
# Only after an engine's preflight passes, run its unchanged application assertions:
V01_JSON=/tmp/v01-firefox-scenarios.json V01_OUTPUT_DIR=/tmp/v01-firefox-scenarios \
  node node_modules/playwright/cli.js test -c validation/v01/playwright.config.ts \
  --project=firefox-desktop --project=firefox-mobile-viewport
```

Observed preflight commands used each desktop project, `--grep 'V01 actual'`,
`--repeat-each=2`, and separate `/tmp/v01c-ENGINE-preflight.json` files. Each exited 1:
one setup failure, one repetition not run (`maxFailures: 1`). These runner failures
are BLOCKED environment results, not product FAIL or compatibility SKIP/PASS.
No application scenario run followed failed preflight. Supplementary harness
behavior is lint/typechecked and discovered but **not application-validated**.

## Per-engine application scenario matrix

BLOCKED means execution prevented by the evidenced environment; no scenario
assertion reached a product result. There are zero application PASS/FAIL claims.

| Scenario | Chromium | Firefox | WebKit |
| --- | --- | --- | --- |
| 1. R01 memory default and explicit saving | BLOCKED | BLOCKED | BLOCKED |
| 2. Independent R02 consent/no import | BLOCKED | BLOCKED | BLOCKED |
| 3. Explicit snapshots only | BLOCKED | BLOCKED | BLOCKED |
| 4. Seven local days, invalid/stale/future records | BLOCKED | BLOCKED | BLOCKED |
| 5. Independent erase and erase-all scopes | BLOCKED | BLOCKED | BLOCKED |
| 6. Denial/failed-deletion warnings | BLOCKED | BLOCKED | BLOCKED |
| 7. No unexpected origins or routine request bodies | BLOCKED | BLOCKED | BLOCKED |
| 8. Actual Web Locks and fail-closed R01 usability | BLOCKED | BLOCKED | BLOCKED |
| 9. Locked recording/cooperating-tab serialization | BLOCKED | BLOCKED | BLOCKED |
| 10. Storage events/cross-tab deletion | BLOCKED | BLOCKED | BLOCKED |
| 11. Queued stale recording | BLOCKED | BLOCKED | BLOCKED |
| 12. Idempotent stale enable | BLOCKED | BLOCKED | BLOCKED |
| 13. Queued midnight/local rollover | BLOCKED | BLOCKED | BLOCKED |
| 14. Reload/navigation | BLOCKED | BLOCKED | BLOCKED |
| 15. Keyboard/focus/DOM announcements | BLOCKED | BLOCKED | BLOCKED |
| 16. Desktop/mobile viewport layout | BLOCKED | BLOCKED | BLOCKED |
| 17. Application console/runtime/hydration errors | BLOCKED | BLOCKED | BLOCKED |

Live timezone switching is additionally NOT_REVIEWED on Firefox/WebKit because
of the CDP-only automation boundary, even in a future provisioned host.
Browser startup diagnostics must not be confused with application console errors.

## Regression evidence (local versus CI)

| Local command | Observed result |
| --- | --- |
| `npm ci` | PASS, 186 packages |
| `npm run lint` | PASS after fixing an unused initial assignment in new validation tooling |
| `npm run typecheck` | PASS |
| `npm run test:education` | PASS, 5 |
| `npm run test:f02` | 4 PASS / 1 restricted-data SKIP (not a pass) |
| `npm run build` | PASS, static export |
| `npm run check:export` | PASS, 14 app / 35 export files, zero approved lessons |
| `npm run test:e2e -- --workers=2` | BLOCKED: 72 runner failures, all missing pinned Chromium executable; no product assertion evidence |
| `npm run test:smoke-sensitivity` | BLOCKED/exit 1: missing Chromium; correctly rejected with `Negative control did not fail at the required safety-content assertion.` |
| `npm run test:education-sensitivity` | PASS; unpublished fixture excluded, deliberately leaked fixture rejected, generated output restored |
| `npm audit --audit-level=high` | PASS, zero vulnerabilities |
| `git diff --check` and relative-link/historical-record review | PASS before submission |

Fresh required GitHub Actions validation will be reported against the exact draft
PR head in the handoff/PR body. It is separate Chromium regression evidence, not
cross-browser V01 application validation. The existing CI is deliberately unchanged
and does not execute this supplementary cross-browser harness. Raw host logs/traces
are temporary external artifacts; the commands and exact decisive excerpts above
are the durable evidence. No artifact upload is represented as a retained trace.

## Findings and Architect decision requested

1. **Blocking environment limitation:** Firefox launches but cannot create even a
   blank page under this host's security boundary (2/2 reproductions).
2. **Blocking provisioning limitation:** WebKit needs libraries that the standard
   installer cannot install in this host; Chromium full/shell downloads are invalid.
3. **Evidence gap:** no application-level engine matrix can be established here.
   Fresh Chromium CI cannot fill independent-engine privacy/concurrency evidence.

No genuine browser-specific product defect was reproduced. Do not authorize a
production fix based on these setup failures. Recommend Architect disposition of
this blocked continuation and selection of a host that supports standard browser
sandbox/page creation and OS dependency installation. Do not weaken host security.
No further task or continuation is self-activated by this report.

## Preserved boundaries

Production source, R01/R02 schemas, existing tests, dependencies/lockfile, CI,
E01 publication gate/empty registries and G01 settings remain unchanged. The original
V01 report body is preserved verbatim with only an appended continuation link.
F01, F02, E01, G01, G01-DOC, R01, R02 and R02-DOC remain complete; F02 is internal-only.
Stage 09C stays CLOSED/frozen `OUTWARD_PROVISIONAL_V1`; restricted Dundee assets,
provenance and scientific uncertainty remain untouched. C01 professional review
remains Owner-blocked and incomplete. No lesson, professional appointment,
deployment, V02, R03 or production compatibility work was started. Automation
provides no privacy/security/accessibility/scientific/medical/clinical certification.
