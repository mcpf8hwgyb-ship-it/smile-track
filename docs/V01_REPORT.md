# V01 — Cross-browser privacy and compatibility investigation

## Disposition — 2026-10-14

**BLOCKED / INCONCLUSIVE. V01 is not a successful product validation.**

Verified base: `0812357cabb40b43a409e1235acfe78e84742145` (merged R02-DOC).
G01 ruleset `24954073` was verified active before investigation. Work is isolated on
`v01-browser-validation`; no production changes are proposed.

The required engine-execution stop condition was reached during environment preflight:
WebKit could not launch, and the standard dependency installer failed because the
execution environment disallows required OS identity/group operations. Scenario
implementation/testing stopped. This evidence-only submission does not complete V01's
cross-browser acceptance criteria. No compatibility fix, alternate architecture,
lock-free fallback, permission workaround or new npm dependency was attempted.

## Environment and engine matrix

Observed host: Ubuntu 24.04.3 LTS, Linux x86_64. Node.js 24.19.0; npm 11.9.0;
existing Playwright 1.64.0. Execution was headless, through Playwright's Node API,
with no headed browser, real mobile device, Safari or iOS execution.

| Engine | Requested pinned binary | Observed runtime version | Preflight result | Product scenarios |
| --- | --- | --- | --- | --- |
| Chromium | Chrome for Testing / headless shell 156.0.8078.4, revision 1248 | NOT_OBSERVED | BLOCKED: expected headless executable absent; isolated installer retry returned invalid/truncated ZIP errors | NOT_REVIEWED in V01 |
| Firefox | Firefox 157.0, revision 1555 | 157.0 (`browser.version()`) | PASS for one launch and close only; installer overall failed later | NOT_REVIEWED: investigation stopped at environment gate |
| WebKit | WebKit 27.2, revision 2370 | NOT_OBSERVED | BLOCKED: downloaded binary cannot launch because native libraries are missing; dependency installation fails | NOT_REVIEWED |

Requested versions are from the installed Playwright browser manifest, not claims
that those browsers executed. Firefox launch success alone establishes neither
reliable repeated execution nor application/API compatibility. Playwright WebKit is
only a Safari-engine approximation and is not real Safari on iOS.

No application page was opened by the V01 preflight. The existing test origin is
`http://127.0.0.1:4173` (loopback preview of static export). Secure-context status,
Web Locks and storage availability at that origin were **NOT_REVIEWED** in V01;
no `isSecureContext` or API behavior is inferred from a successful browser launch.
Desktop/mobile emulation was not reached. Existing CI remains Chromium-only.

## Reproduction and observed failures

From a clean checkout of the verified base, run `npm ci` (observed PASS, 186 packages).
Use the installed dependency, not an unpinned package download:

```sh
export PLAYWRIGHT_BROWSERS_PATH=/workspace/scratch/91c1429b212c/v01-browser-tools
export PLAYWRIGHT_DOWNLOAD_CONNECTION_TIMEOUT=15000
node node_modules/playwright/cli.js install chromium
node node_modules/playwright/cli.js install firefox
node node_modules/playwright/cli.js install webkit
```

The initial three install attempts were started concurrently against that same
external directory. They exited unsuccessfully with installer lock-maintenance
errors; this is an investigation setup limitation, not an application concurrency
finding. Downloads also emitted `End of central directory record signature not found.
Either not a zip file, or file is truncated.` Firefox and WebKit binaries were
nonetheless downloaded from Playwright's fallback mirror. Do not equate downloaded
bytes with successful browser validation. Reproduction should run installers
serially to avoid introducing shared-install-directory contention.

The launch probe, using the same browser path, was:

```sh
node - <<'JS'
const { chromium, firefox, webkit } = require('playwright');
(async () => {
  for (const [name, type] of Object.entries({ chromium, firefox, webkit })) {
    try {
      const browser = await type.launch({ headless: true, timeout: 15000 });
      console.log({ name, status: 'LAUNCHED', version: browser.version() });
      await browser.close();
    } catch (error) {
      console.log({ name, status: 'BLOCKED', error: error.message });
    }
  }
})();
JS
```

Probe exit 0 is **not** a passing test result: it catches and reports launch failures.
Chromium reported a missing executable at
`chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell`.
Firefox reported `LAUNCHED`, version `157.0`.
WebKit reported `Host system is missing dependencies to run browsers`, including:
`libgstreamer-1.0.so.0`, `libwebkitgtk-6.0.so.4`, `libgtk-4.so.1`,
`libgraphene-1.0.so.0`, `libjavascriptcoregtk-6.0.so.1`, `libevent-2.1.so.7`,
GStreamer component libraries, `libavif.so.16`, `libharfbuzz-icu.so.0`,
`libwayland-server.so.0`, `libmanette-0.2.so.0`, `libhyphen.so.0`, and `libGLESv2.so.2`.

Standard host-dependency setup was attempted without changing repository files:

```sh
node node_modules/playwright/cli.js install-deps webkit
```

It failed with installer process exit 100 (CLI exit 1), including:

```text
E: setgroups 65534 failed - setgroups (1: Operation not permitted)
E: setegid 65534 failed - setegid (22: Invalid argument)
E: seteuid 42 failed - seteuid (22: Invalid argument)
E: Method https has died unexpectedly!
E: Sub-process https returned an error code (112)
Failed to install browser dependencies
```

A separate-directory Chromium retry, started before the WebKit blocker was confirmed,
removed shared installer contention as a confounder for the observed ZIP errors:

```sh
PLAYWRIGHT_BROWSERS_PATH=/tmp/v01-chromium-tools \
PLAYWRIGHT_DOWNLOAD_CONNECTION_TIMEOUT=15000 \
node node_modules/playwright/cli.js install chromium --only-shell
```

It also emitted the invalid/truncated ZIP error from the configured Chrome download
URL and finished with exit 1: `Failed to download Chrome Headless Shell 156.0.8078.4`
and `Download failure, code=1`. No production changes or attempts to bypass OS
permissions were made.

## Scenario classifications

All rows below are **NOT_REVIEWED in V01 for all three engines**. Chromium/WebKit
execution is BLOCKED; Firefox scenario testing was not started after the stop condition.
No product scenario is counted as PASS, FAIL or SKIP on the basis of preflight.

| Bounded scenario | V01 status |
| --- | --- |
| R01 memory-only default and explicit saving | NOT_REVIEWED |
| Independent R02 consent; no R01 migration; explicit snapshots only | NOT_REVIEWED |
| Invalid/expired/future records and seven-local-day window | NOT_REVIEWED |
| Today/history/erase-all scopes and removal verification | NOT_REVIEWED |
| Storage denial and unsuccessful-deletion warnings | NOT_REVIEWED |
| No network transmission of routine values | NOT_REVIEWED |
| Actual Web Locks support/denial and fail-closed R01 usability | NOT_REVIEWED |
| Locked recording; storage events; cross-tab deletion; queued stale record | NOT_REVIEWED |
| Idempotent stale enable and queued recording across midnight | NOT_REVIEWED |
| Navigation, reload, local rollover, keyboard/focus and DOM announcements | NOT_REVIEWED |
| Responsive desktop/mobile emulation; console/runtime/hydration errors | NOT_REVIEWED |

## Findings ranked by impact and Architect decision

1. **Blocking environment limitation:** WebKit native dependencies cannot be installed
   through the standard tool in this execution environment. Independent-engine privacy
   assurance remains unavailable. This is not evidence of a Smile Track privacy defect.
2. **Blocking Chromium tooling limitation:** pinned headless binary was unavailable and
   retry downloads produced invalid ZIP errors. Existing required GitHub CI is a
   separate environment/control, not a substitute for this three-engine investigation.
3. **Investigation setup limitation:** simultaneous initial installs shared a directory
   and reported compromised locks. Future runs should install serially; no browser or
   product concurrency conclusion may be drawn from these installer errors.

No application disclosure, consent violation or browser-specific product defect was
observed because application scenarios were not reached. Absence of a finding is not
proof of safety. Recommend Architect approval for a provisioned validation environment
with native Firefox/WebKit dependencies and reliable Playwright downloads, followed
by a separately authorized continuation of this bounded investigation. Do not authorize
production compatibility fixes based on these environment results.

## Preserved boundaries and evidence limits

Only this report and additive CURRENT_STATE, ROADMAP and VALIDATION_LOG entries change.
No new test harness was implemented after the stopping condition. The inline probe
above is reproduction tooling; generated logs/binaries are outside version control.
Existing tests, required CI, dependencies/lockfile, storage schemas and production
behavior are unchanged. Fresh exact-head required CI is reported in the PR handoff;
its Chromium results must not be labeled Firefox/WebKit or V01 scenario passes.

F01, F02 (internal feasibility only), E01, G01, G01-DOC, R01, R02 and R02-DOC remain
complete. Stage 09C remains CLOSED/frozen `OUTWARD_PROVISIONAL_V1`; restricted Dundee
assets and scientific uncertainties are untouched. E01 publication controls and empty
lesson/authority registries remain unchanged. C01 professional review remains
Owner-blocked and incomplete. No deployment, professional recruitment, lessons, V02,
R03 or other feature is authorized. Automated results are not scientific, medical,
privacy, security, screen-reader or accessibility certification.


## Historical-record note — 2026-10-15 America/New_York

The preflight record above remains **BLOCKED / INCONCLUSIVE**, preserved verbatim.
After Architect acceptance of PR #9 post-merge evidence, a bounded continuation
was activated from `7120770f430663c548ec592397e5d63e36cbfff7`. Its separate
[continuation report](V01_CONTINUATION_REPORT.md) records renewed supported
provisioning, Firefox blank-page failures and unexecuted application scenarios.
It does not retroactively validate this preflight or establish cross-browser compatibility.
