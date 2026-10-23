# P01-07A — Bounded Transmission Evidence

Date: 2026-10-23. Owner-authorized testing-only investigation; Architect acceptance pending.

## Baseline and scope

Repository: `mcpf8hwgyb-ship-it/smile-track`.
Accepted main: `79a4964e7de2cf3aa89b3a271790069519755947`.
Accepted tree: `3b5e2a5fdd021304cb99bdb0f5ece41650934abb`.
Live preflight confirmed zero open PRs, Foundation CI `39992833324` successful,
and G01 `24954073` active: strict `validate` integration `15368`, required PR,
thread resolution, deletion/non-fast-forward restrictions, no bypass actors.
Both proposed files were absent. The clean checkout matched the exact baseline.

Only this new report and `tests/privacy-transmission.spec.ts` are introduced.
No existing tracked file, application behavior, storage schema, dependencies,
publication gate, workflow or scientific asset is changed.

## Reproducible test design

The unchanged Playwright configuration discovers two new tests in both projects:
Desktop Chromium (1440 × 1000) and mobile Chromium/Pixel 7 (390 × 844).
The workflow uses America/New_York and freezes the clock at 2026-10-12T16:00:00Z.
The synthetic R01 record is exactly:

```json
{"version":1,"date":"2026-10-12","brushedTeeth":true,"cleanedBetweenTeeth":false}
```

R02 is `{version:1,enabled:true,entries:[...]}` with one entry containing that
same date and activity pair, without the R01 version field. No real user data
is used. UI actions create all saved records; no storage-seeding shortcut is used.

The workflow checks memory-only selections with both consents off and no saved
keys; explicit R01 consent and exact bytes; independent R02 consent with an
initially empty list; explicit snapshot; Home/Learn/Routine navigation; reload
and restoration; R01-only erasure preserving R02; R02-only erasure preserving
R01 and selections; and opening then affirmatively confirming combined Erase All.
Each relevant operation verifies exact localStorage contents, consent and UI
state. Named status messages and stored values are captured at checkpoints.
Session storage and cookies must remain empty. Existing tests remain untouched.
No arbitrary sleep establishes sequencing; UI and stored-state assertions supply
operation barriers. This is not a concurrency investigation or a Policy A change.

## Interception and policy

Context HTTP and WebSocket routing is installed before first navigation.
An exact filesystem inventory of the generated `out` directory defines allowed
paths (including directory index aliases). HTTP is allowed only for same-origin
GET, no body, an existing export path, no detected synthetic record, and no query
other than an opaque Next `_rsc` cache token. External origins, non-static paths,
unexpected methods and other queries are aborted in the route handler.
Allowed requests continue to the unchanged loopback static preview server.

For every routed request, evidence includes source frame URL, destination origin,
full URL/path/query, method, available allHeaders(), postData(), resource type,
classification and request-finished/failure outcome when exposed. Evidence is
printed to CI logs and attached to the Playwright test result. No external
collection endpoint is introduced. Captured headers belong to isolated synthetic
browser contexts; this is not a packet capture or proof of every eventual
browser-generated transport header. Closing the exercised page bounds the
observation interval; it does not test indefinite future activity.

The detector checks each URL, body and header value for the synthetic date plus
both named boolean fields, with literal/JSON and up to two URL-decoding passes.
It does not infer disclosure from a generic date or boolean alone. It does not
claim arbitrary encryption, compression, hashing, binary encodings, split-field
channels, partial-record disclosures or undocumented runtime-channel coverage.
Unexpected destinations/methods/paths are blocked independently of this detector.

Service workers are blocked by test-local `test.use`, addressing Playwright's
HTTP routing interception limitation. Service-worker-mediated transmission is
therefore NOT exercised. WebSocket routing never calls `connectToServer`:
attempts are recorded and locally mocked, with outbound text/buffer observations
and a local acknowledgement for the sensitivity control. No handshake or frame
is forwarded to a receiving server. This demonstrates routing and message
recognition, not live TLS/handshake/header/frame behavior or every socket API.

API references reviewed: [BrowserContext routing](https://playwright.dev/docs/api/class-browsercontext#browser-context-route)
and [WebSocketRoute mocking](https://playwright.dev/docs/api/class-websocketroute).

## Sensitivity controls and additional evidence

A separate test/context attempts a valid synthetic record in a URL query, POST
body and header; an unexpected DELETE; an external `.invalid` URL; and a
same-origin non-static URL. All must be blocked. Three record-bearing requests
must be positively identified. An ordinary static GET must return 200 without a
disclosure classification. A local mocked WebSocket receives the same synthetic
record and must identify it without server forwarding. Deliberate violations
are expected passing detector assertions, not application regressions. No
production mutation or unsafe network receiver remains in the tree.

Existing routine/history tests inspect page-level request URLs, methods and
bodies and assert no unexpected origin. The new evidence adds pre-navigation
context routing, preventive blocking, exact export-path classification, header
inspection, explicit detector controls and separate WebSocket coverage. This
is meaningful additional bounded evidence rather than a replacement for those
assertions. Tests on existing erasure, cross-tab, retention and publication
behavior remain required.

## Validation record

Local work uses Node 24.19.0 / npm 11.9.0 and the unchanged lockfile. Completed:
`npm ci` (186 packages); `npm run lint`; `npm run typecheck`;
`npm run test:education` (5 passed); `npm run test:f02` (4 passed, 1 expected
restricted frozen-baseline skip); `NEXT_TELEMETRY_DISABLED=1 npm run build`;
`npm run check:export` (14 app files / 35 exported files, zero approved lessons,
no unpublished bodies or synthetic fixtures). The restricted-data skip is not
full scientific validation. npm reports an environment-level http-proxy option
warning; no registry or configuration change was made.

Browser, sensitivity, dedicated audit and exact-head GitHub results are pending
at this report revision. No final candidate SHA or successful transmission
finding is asserted here. The draft PR description and Builder handoff must
identify the actual tested branch head, any synthetic PR merge parents/tree,
run/attempt/job/check identities and complete final results. Earlier baseline CI
is supporting provenance only, never substitute validation of this new test.

## Classifications and boundaries

- **VERIFIED:** Baseline identities, unchanged governance and the completed
  local gates explicitly listed above.
- **PROVISIONAL:** Proposed workflow and detector coverage until fresh execution
  evidence verifies both configured Chromium projects.
- **UNRESOLVED:** Comprehensive P01-07 transmission assurance; unobserved browser
  channels, blocked service-worker paths, extensions, backup/synchronization,
  other browser engines, other hosting environments and future application paths.
- **NOT_CERTIFIED:** Comprehensive privacy, security, cross-browser, accessibility
  or clinical assurance.

Only after passing execution is the bounded conclusion eligible:
“No unexpected browser-observable routine-data transmission was found in the
specified R01/R02 workflows under the tested Chromium conditions.”
This is not comprehensive transmission assurance or authorization to deploy.

Policy A remains Owner-ratified; P01-02 technical limitations remain unresolved.
P01-08 remains NOT_REVIEWED; V01 BLOCKED / INCONCLUSIVE / PARKED. E01 is evidence-
gated with zero approved lessons; C01 Owner-blocked; F02 internal-only /
NOT_CERTIFIED. Dundee Stage 09C remains frozen OUTWARD_PROVISIONAL_V1; physical
millimeter calibration unresolved and anatomy NOT_CERTIFIED. Deployment and
public scientific integration remain unauthorized. No further task follows
from this investigation; independent Architect review is required.

## STOP — local browser installation failure

`npx playwright install chromium` exited 1 while downloading Chrome for Testing
156.0.8078.4 / Playwright Chromium v1248. The installer reported:

```text
Error: End of central directory record signature not found.
Either not a zip file, or file is truncated.
Failed to install browsers
Error: Failed to download Chrome for Testing 156.0.8078.4
Download failure, code=1
```

The single installer invocation performed its own repeated download attempts;
no second command or alternate browser recovery was attempted. The precise
upstream/network cause is not established. This is an environment/setup failure,
not evidence of an application regression or a passing transmission test.
Under the assignment's mandatory validation stop condition, execution stopped.
No Chromium tests, detector controls, smoke sensitivity, education-export
sensitivity or dedicated audit were subsequently run. No new branch, commit,
PR or GitHub validation was created. The two files remain local, uncommitted
drafts. No final candidate head/tree exists. All browser transmission findings
remain unverified; P01-07 remains UNRESOLVED. Architect disposition is required
before any continuation or alternative validation environment is attempted.

## E1 recovery — authorized GitHub Actions runner validation, 2026-10-23

The Owner/Architect authorized P01-07A-E1 after the local setup stop above.
The historical installation failure remains unchanged; no local browser install
or launch was repeated. The original drafts were preserved in the same checkout
and verified before edits against the reviewed uploaded SHA-256 identities:

- Test: `784a2eac195a6595d6a940d092ff734cf71108147b1bda1b3823059ce306cdac`.
- Report: `cd1a9b942ed325feb688d4e3b0801c32cf741b822c112841c3d51866a9b3ebc9`.

Fresh preflight confirmed the exact main/tree listed above, zero open PRs,
unchanged G01 and successful baseline run `39992833324`, attempt 1.
The sole test correction guards source-frame observation: check serviceWorker()
first, isNavigationRequest() second, and only then access frame().url().
Service-worker and navigation cases have explicit source classifications;
empty frame URLs or unexpected frame-access errors are recorded as unavailable
and emit a metadata-uncertainty warning. Every observation retains destination,
URL, method, headers, body, resource type and disclosure classification.
Missing frame metadata does not change the allow/block decision. Unexpected
metadata failures remain visible for independent review rather than being
silently discarded. The detector, allowlist, workflow, schemas, controls and
WebSocket behavior are unchanged.

The installed pinned Playwright 1.64.0 type declarations document these exact
interfaces and frame-availability cases. Local `npm run lint` and
`NEXT_TELEMETRY_DISABLED=1 npm run typecheck` passed. Browser-free
`npx playwright test --list` discovered 154 tests in 5 files: the original 150
plus the two new tests in each Chromium project. No existing tracked file
changed. These static checks do not establish runtime detector correctness.

This E1 revision is submitted for a single initial pull-request-triggered
Foundation CI attempt using the unchanged GitHub Actions runner. Actual final
head/tree, synthetic merge identity, run/job/check IDs, decoded-log findings
and outcomes will be reported in the PR handoff, once available. No future
identifiers or execution results are asserted in this committed report. The
original STOP section describes the previous attempt, not an E1 CI outcome.
Any mandatory CI failure requires another stop without correction or retry.
All classifications and restrictions above remain in force.
