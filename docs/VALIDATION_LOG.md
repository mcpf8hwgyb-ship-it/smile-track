# SMILE TRACK — VALIDATION LOG

## V01 — 2026-10-14 — BLOCKED / INCONCLUSIVE (current investigation)

Verified base: `0812357cabb40b43a409e1235acfe78e84742145`; G01 remains active.
V01 reached its engine-execution stop condition during preflight. Firefox 157.0
launched once; WebKit could not launch because native libraries are missing, and
standard dependency installation failed with OS permission errors. Chromium's pinned
headless executable was unavailable; an isolated retry produced invalid ZIP errors.
No application privacy/consent scenario was validated. These are environment/setup
findings, not product validation passes or demonstrated application defects.

See [V01 evidence, reproduction and classifications](V01_REPORT.md). Investigation
implementation stopped; this submission records evidence only. Architect disposition
is required before continuation in a provisioned environment. No V02, R03 or other
product task is selected or authorized. R02 and R02-DOC remain COMPLETE. All accepted
scientific, publication, privacy and governance boundaries remain unchanged; C01
professional review remains Owner-blocked and incomplete.

Earlier entries below are preserved verbatim as historical checkpoints. Their
current-state labels do not override this dated investigation disposition.

V01 evidence-submission checks: `npm ci` PASS (186 packages); `git diff --check`
PASS; relative documentation links resolve; the previous bodies of CURRENT_STATE,
ROADMAP and this log remain verbatim. Protected implementation/test/dependency/
workflow/registry/scientific paths have no diff. Only four Markdown files are changed.
All three initial browser installers exited 1; the separate Chromium retry exited 1;
WebKit dependency setup exited 1 (underlying installer 100). The launch probe caught
failures and exited 0: only Firefox reported a successful launch. That probe exit
code is not a privacy-test pass. Detailed commands/errors are in V01_REPORT.md.
Fresh required CI for the evidence-only head will be recorded in the PR handoff;
Chromium CI regression results are separate from the blocked V01 investigation.

## R02 final closure — 2026-10-14 (current accepted state)

R02 is **COMPLETE**, accepted and merged through [PR #7](https://github.com/mcpf8hwgyb-ship-it/smile-track/pull/7).

- Merge / verified main: `56a576a81c21d8e79c68403d720f47319fcf8d6e`.
- Approved corrected head: `0e6e9b868e9ef79aa076daa172418eb001468af3`.
- Merged tree: `139e0c3e9a5627c3368aba7115e28ec16555d4f4`.
- Merge parents: prior main `5c12d3c468582b3e86ceaa40dd96eba4b20fffc6` and the approved corrected head.
- Exact-main post-merge CI: [run 38516699902](https://github.com/mcpf8hwgyb-ship-it/smile-track/actions/runs/38516699902), [validate job 115697006589](https://github.com/mcpf8hwgyb-ship-it/smile-track/actions/runs/38516699902/job/115697006589) — **PASS**.

GitHub baseline and evidence reverified on 2026-10-14 before R02-DOC edits. PR #7 is
merged; both parents and the exact tree match. G01 ruleset `24954073` remains active
with its existing PR/CI safeguards and empty bypass list.

| Verified post-merge check | Result on exact merge commit |
| --- | --- |
| Clean installation, lint, strict types | PASS |
| Browser suite | 72 PASS, desktop and mobile, including stale-enable regressions |
| Education tests | 5 PASS |
| F02 tests | 4 PASS / 1 restricted-data SKIP; not a scientific-data pass |
| Production static build and export guards | PASS, 35 exported files; zero approved lessons |
| Smoke and education sensitivity controls | PASS |
| Dependency audit | Zero reported vulnerabilities |

History enable is idempotent under the existing Web Lock: it preserves valid enabled
history and eligible entries already stored, including valid bytes remaining after
failed deletion. First-time enabling without valid history starts empty. It never
copies R01 data. Today-only saving and seven-day history require independent consent;
only explicit recording saves a history snapshot, with no retrospective reconstruction.

History requires Web Locks and fails closed when coordination is unavailable; R01
remains usable. Browser-local storage is not encrypted private storage. Shared profiles
can expose records; browser backups, extensions and synchronization are outside the
app's control. Device dates/timezones may be wrong. Only the current and preceding
six local calendar days are eligible; expiry runs when the app next executes, not
while closed or suspended. Deletion is verified by reading back owned keys where
possible; failed verification is reported and browser site-data controls may be needed.
No guaranteed deletion is claimed when storage is unavailable.

F01, F02, E01, G01, G01-DOC, R01 and R02 are **COMPLETE**. F02 remains internal
feasibility only. Stage 09C remains **CLOSED/frozen `OUTWARD_PROVISIONAL_V1`**.
E01's publication gate is unchanged; production lesson and authority registries remain
empty. Scientific uncertainties, provenance and restricted Dundee asset boundaries
remain unchanged. Public repository visibility does not authorize deployment or
restricted-asset distribution.

The separate **C01 professional-review activity remains Owner-blocked and incomplete**.
It is not the R02 correction identifier C01, whose stale-enable fix was accepted.
No professional recruitment, reviewer appointment or substantive lesson is authorized.
No subsequent product task has been selected; the next task must be selected by
**00 — ARCHITECT — CTO / Next Step**. R02-DOC is documentation reconciliation only.

R02-DOC validation is distinct from the post-merge evidence above: the six authorized
Markdown files are the only proposed changes. Local `git diff --check`, relative-link
validation against the baseline repository tree, exact six-file inventory, and
verbatim historical-body preservation are checked before submission. No source,
test, workflow, dependency, registry, governance or scientific file is changed.
The documentation PR handoff records its exact head and fresh required `validate`
run/job result after CI completes; the earlier R02 CI is not represented as validation
of the new documentation commit. No scientific, medical, privacy or accessibility
certification is inferred from any CI result.

## Historical records — superseded status

The records below are preserved verbatim. Their draft/unmerged/awaiting-review and
“current” labels describe earlier checkpoints, not the current accepted state.
Blanket statements that enabling always starts empty are superseded by the accepted
idempotent behavior recorded above.

## R02 correction C01 — 2026-10-14 — stale-enable overwrite

Reviewed head: `4b7532368c03dab05d25bf90783fd0e6a8669ab8`; unchanged main/base:
`5c12d3c468582b3e86ceaa40dd96eba4b20fffc6`. PR #7 remains draft and unmerged.
The Architect identified that an unconditional enable reset could erase another
tab's valid history. Enable now preserves valid eligible history inside the Web Lock;
only absent/invalid history leads to a new empty record. No R01 migration or fallback.
Historical entries below describe the previous implementation, not this correction.

Deterministic regression: `npm run test:e2e -- --grep stale-enable` passed in both
desktop and mobile projects (2 PASS). Tab A's capture-phase refresh-event blockers
and paused timers retain disabled UI while B enables/records. B holds the real lock;
A's stale Enable is observed pending in `navigator.locks.query()` before release.
Exact stored entries, synchronized enabled UI, and R01 controls/bytes are asserted.

Sensitivity experiment: temporarily changed only `if (action === "enable" && !history)`
back to the reviewed `if (action === "enable")`, built the static application with
`NEXT_TELEMETRY_DISABLED=1 npm run build`, and reran the same focused command.
Both projects FAILED at the exact history equality assertion: expected the synthetic
2026-10-12 entry, received `entries: []`. Exit 1 was expected evidence, not a pass.
Restored the corrected source and rebuilt before all final browser checks. Generated
negative-control output was kept outside version control.

The failed-deletion regression remains: it still checks failure reporting, disabled
local consent, retained bytes and R01 usability. Its re-enable expectation now follows
the authorized idempotent semantics, and it additionally verifies that successful
erase followed by enable starts empty. No R01/R02 scenario was removed.

Environment: Node 24.19.0 / npm 11.9.0; unchanged dependency lockfile. Browser commands
use the same external Chromium path/environment documented in the preceding R02
submission below. Git HTTPS fetch returned 502; the reviewed files were recovered
through GitHub's read API, and their staged tree was verified exactly equal to
`55111a22906c82aac48d723c4d501817d72ec8ad` before correction. No scientific archive
was opened. Exact corrected head/tree and fresh CI run/job evidence are recorded in
the PR handoff after publication; earlier passing CI does not validate this correction.

| Correction validation command / check | Observed local result |
| --- | --- |
| `npm ci` | PASS, 186 packages; lockfile unchanged |
| `npm run lint` | PASS, zero warnings |
| `npm run typecheck` | PASS, strict types |
| `npm run test:education` | 5 PASS |
| `npm run test:f02` | 4 PASS / 1 restricted-data SKIP, not a scientific-data pass |
| `NEXT_TELEMETRY_DISABLED=1 npm run build` | PASS, corrected production static export |
| `npm run check:export` | PASS, 14 app files / 35 clean-build exported files (38 after sensitivity rebuild), zero approved lessons |
| `npm run test:e2e -- --grep stale-enable` | 2 PASS corrected; 2 expected FAIL with old reset temporarily restored |
| `npm run test:e2e` | 72 PASS (36 desktop / 36 mobile), including all prior scenarios |
| `npm run test:smoke-sensitivity` | PASS, deliberate removal of safety text rejected |
| `NEXT_TELEMETRY_DISABLED=1 npm run test:education-sensitivity` | PASS on clean-cache retry, including restored production rebuild; deliberate leak rejected |
| `npm audit --audit-level=high` | PASS, zero vulnerabilities |
| `git diff --check`; relative Markdown links | PASS |
| Protected source comparison | R01 storage, education gate/empty registries, F02, scientific files, dependencies and workflow unchanged |

One initial education-sensitivity attempt passed fixture exclusion and leak rejection
but failed its final restored rebuild with a truncated Turbopack cache `.sst` block.
Moved only generated `.next` aside and reran the unchanged command successfully;
then rechecked export and exact restoration of the empty production registries.
No source/configuration/dependency workaround was introduced. Initial restored-workspace
output contained 58 files; the clean corrected rebuild produced 35, and the final
post-sensitivity export check covered 38 files with no prohibited content. Generated build,
negative-control and browser artifacts are not committed. These checks are engineering
evidence, not clinical, privacy, security or accessibility certification.

## R02 — 2026-10-13 — local validation and review submission

Verified base: `5c12d3c468582b3e86ceaa40dd96eba4b20fffc6`; branch
`r02-seven-day-history`. R01 is complete and merged; earlier R01 review-pending
entries remain historical. Node 24.19.0 / npm 11.9.0 and all dependencies unchanged.
See [R02_REPORT.md](R02_REPORT.md) for consent, schema, deletion, inventory and limits.

| Exact command / check | Observed local result |
| --- | --- |
| `npm ci` | PASS, clean lockfile install, 186 packages |
| `npm run lint` | PASS, zero lint warnings |
| `npm run typecheck` | PASS, strict TypeScript |
| `npm run test:education` | PASS, 5 tests |
| `npm run test:f02` | 4 PASS, 1 restricted-data SKIP; not a scientific-data pass |
| `NEXT_TELEMETRY_DISABLED=1 npm run build` | PASS, static Home/Learn/Routine/not-found |
| `npm run check:export` | PASS, 14 application files; final 35 exported files, zero approved lessons, no restricted data or unpublished fixtures |
| `npm run test:e2e` with environment below | PASS, 70 tests: 35 desktop / 35 mobile; 42 R02 and all 28 inherited scenarios |
| `npm run test:smoke-sensitivity` with environment below | PASS; 34 desktop tests pass and deliberate removal of required safety wording makes the foundation visibility assertion fail; output restored |
| `NEXT_TELEMETRY_DISABLED=1 npm run test:education-sensitivity` | PASS; unpublished fixtures excluded, deliberate leaked fixture rejected, production inputs restored and static app rebuilt |
| `npm audit --audit-level=high` | PASS, zero reported vulnerabilities |
| `git diff --check` | PASS |
| Relative Markdown links / historical-body comparison | PASS; old README/state/roadmap/decisions/validation content preserved additively |
| Protected source comparison against base | PASS; R01 storage module, E01 gate/schema/empty registries, F02/scientific files, dependency pins and workflow unchanged |

Browser commands use these existing external test-tool paths:

```sh
export PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/workspace/scratch/91c1429b212c/f02-browser-tools/runtime/chromium
export LD_LIBRARY_PATH=/workspace/scratch/91c1429b212c/f02-browser-tools/runtime
export FONTCONFIG_PATH=/workspace/scratch/91c1429b212c/f02-browser-tools/runtime/fonts
npm run test:e2e
npm run test:smoke-sensitivity
```

Local Chromium **153.0.8010.0** was restored by re-extracting the existing test-only
Brotli binary outside the repo after the retained binary again proved truncated and
segfaulted. An overlapping initial test attempt also invalidated some trace artifacts;
those runs are not used as passing evidence. Subsequent runs were serial. Initial
history tests incorrectly expected asynchronous consent to update synchronously;
they now click then wait for verified state. Live timezone testing now owns its CDP
override rather than conflicting with Playwright's pre-existing timezone override.

One incremental static build failed with `ENOTEMPTY` while replacing generated
`out/`. Moving only generated `.next`/`out` aside produced a passing clean build;
later production and sensitivity builds also pass. No repository config or dependency
was changed to work around environment issues. npm's inherited `http-proxy` warning
is separate from lint, which has zero warnings.

Observed browser evidence includes separate opt-in and no pre-consent history writes,
no R01 migration or automatic snapshots, marked/unmarked/no-record distinction,
rolling window and stale pruning on Home/Learn, New York midnight, spring/fall DST,
live New York-to-Los Angeles timezone change, strict malformed/duplicate/future-date
rejection, all deletion scopes and read-back, denied and silent storage failures,
queued cross-tab erasure, queued midnight record refusal, and fresh empty re-enable
after failed removal. R01's original behavior tests remain passing.

Desktop 1440x1000 and mobile 390x844 synthetic screenshots were visually inspected.
Keyboard Tab/Space/Enter, visible focus, >=44px targets, live status regions and no
horizontal overflow pass. The full interaction flow asserts no console/page errors
(including hydration), external requests, entry-bearing URLs/bodies, application
cookies or sessionStorage. Coverage is Chromium and mobile emulation, not other
browser, hardware or assistive-technology certification. No real entries or restricted
scientific images are used. Obvious credential-pattern and changed-file reviews are
limited checks, not comprehensive privacy/security/clinical certification.

G01 ruleset `24954073` was read and remains active, with required PR/strict validate,
conversation resolution, blocked force pushes/deletion, empty bypass actors and
`current_user_can_bypass: never`. No settings were changed. C01 remains Owner-blocked
and incomplete, and production lesson/authority registries remain empty.

Final-head GitHub CI will be reported separately in the PR handoff after observation;
local passes are not represented as CI passes. No merge or next task is authorized.

---

## R01 — 2026-10-13 — local validation and review submission

Base `9dbda414f7d9f6b97ef5508a61ad6d5314c8def0` verified against GitHub and a fresh
clone before branching to `r01-private-daily-check-in`. Node 24.19.0 / npm 11.9.0;
all package pins/lockfile remain unchanged. [R01_REPORT.md](R01_REPORT.md) records
the data model, behavior, limits and changed files. This is not a merge approval.

| Exact command | Local result |
| --- | --- |
| `npm ci` | PASS, clean installation from existing lockfile |
| `npm run lint` | PASS, zero lint warnings |
| `npm run typecheck` | PASS, strict TypeScript |
| `npm run test:education` | PASS, 5 tests |
| `npm run test:f02` | 4 PASS, 1 restricted-data SKIP, zero failures |
| `NEXT_TELEMETRY_DISABLED=1 npm run build` | PASS, static Home, Learn, Routine and not-found routes |
| `npm run check:export` | PASS, no restricted scientific assets or unpublished bodies/fixtures; zero approved lessons |
| `npm run test:e2e` with browser environment below | PASS, 28 tests: 14 desktop and 14 mobile, including 12 R01 scenarios per viewport |
| `npm run test:smoke-sensitivity` with browser environment below | PASS: removal of required safety copy causes the expected visibility assertion failure; output restored |
| `NEXT_TELEMETRY_DISABLED=1 npm run test:education-sensitivity` | PASS: unpublished fixtures excluded, deliberate exported marker rejected, production catalog restored and rebuilt |
| `npm audit --audit-level=high` | PASS, zero reported vulnerabilities |
| `git diff --check` | PASS |

Local browser invocation (apply the same three variables to both browser commands):

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/workspace/scratch/91c1429b212c/f02-browser-tools/runtime/chromium \
LD_LIBRARY_PATH=/workspace/scratch/91c1429b212c/f02-browser-tools/runtime \
FONTCONFIG_PATH=/workspace/scratch/91c1429b212c/f02-browser-tools/runtime/fonts \
npm run test:e2e
```

Initial local launch failed before application execution: the retained test-only
Chromium was truncated and segfaulted. `npx playwright install chromium` failed on
an invalid/truncated download. Re-extracting the existing test-only Brotli browser
outside the repo restored Chromium **153.0.8010.0**; all browser checks then passed.
No package or configuration was added for this workaround. CI independently uses
Playwright's bundled browser. npm emits the inherited environment `http-proxy`
configuration warning; lint itself emits zero warnings.

Synthetic screenshot inspection: responsive desktop/mobile, wrapped navigation,
visible focus and readable controls. Automated checks cover consent before writes,
local-day expiry, storage failures, erasure, cross-tab behavior, no external
requests or entry transmission, and no console/runtime/hydration errors. Coverage
is Chromium/emulation only, not real-device or assistive-technology certification.

History, science, dependency/workflow and empty registry comparisons against base,
relative Markdown links and diff whitespace were reviewed. No real records, secrets,
restricted scientific inputs, generated artifacts or browser binaries are included.
Audit/browser checks do not establish comprehensive security or medical compliance.

GitHub CI is separate evidence: final-head run/result will be supplied in the PR
handoff after observing completion. No local pass is represented as a CI pass.
Architect review is required before merge; no subsequent task is authorized.

---

## G01-DOC — 2026-10-12 — governance closure and documentation validation

Baseline: `53337472c46a8c0dc0cbd83c4157bc8831b05d65` (main, reverified before edits).
Branch: `g01-doc-governance-closure`. F01 COMPLETE; Stage 09C CLOSED with frozen
`OUTWARD_PROVISIONAL_V1`; F02 COMPLETE for internal feasibility only; E01 COMPLETE
as an empty education foundation; G01 COMPLETE for solo-maintainer technical governance.
Earlier validation and status records below remain historical and unchanged.

### Governance evidence

Public visibility, main ref, active ruleset `G01-main-protection` / `24954073`,
applicable branch rules and inventory were read from GitHub. Required PR, zero
approving reviews, strict up-to-date `validate`, conversation resolution, deletion/
force-push restrictions, empty bypass actors and `current_user_can_bypass: never`
match the approved configuration. Merge commits remain allowed. No settings changed.
See [G01_REPORT.md](G01_REPORT.md) for exact fields, references and access limitations.

[PR #4](https://github.com/mcpf8hwgyb-ship-it/smile-track/pull/4) is closed unmerged;
`g01-protection-test` ref is absent; main is unchanged. Verified failed
[run 38311018467](https://github.com/mcpf8hwgyb-ship-it/smile-track/actions/runs/38311018467)
at lint (unused intentional test variable) and successful
[run 38311416569](https://github.com/mcpf8hwgyb-ship-it/smile-track/actions/runs/38311416569)
through metadata, job steps and logs. Merge-button behavior during the earlier Owner
experiment was not independently replayed. These are technical safeguards, not
independent GitHub approval or qualified dental-content review.

### Local validation — fresh source checkout

Node 24.19.0 / npm 11.9.0; dependency pins and lockfile unchanged.

| Command / review | Observed result |
| --- | --- |
| `git diff --check` | PASS |
| Markdown/link consistency review | PASS; added headings/tables reviewed, local link targets resolve; historical document bodies preserved verbatim |
| `npm ci` | PASS; 186 packages installed from lockfile |
| `npm run lint` | PASS; zero warnings |
| `npm run typecheck` | PASS; strict compiler and route types |
| `npm run test:education` | PASS; 5 tests, no skips |
| `npm run test:f02` | PASS; 4 synthetic tests, 1 restricted-data test explicitly SKIPPED |
| `NEXT_TELEMETRY_DISABLED=1 npm run build` | PASS; static `/`, `/_not-found`, `/learn` |
| `npm run check:export` | PASS; app 6 files, out 28 files; zero approved lessons and no restricted/unpublished/test payloads |
| `npm run test:e2e` with the environment below | PASS; 4 desktop/mobile Home/Learn cases |
| `npm audit --audit-level=high` | PASS; 0 reported vulnerabilities at check time |

Exact local browser environment:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/workspace/scratch/91c1429b212c/f02-browser-tools/runtime/chromium LD_LIBRARY_PATH=/workspace/scratch/91c1429b212c/f02-browser-tools/runtime FONTCONFIG_PATH=/workspace/scratch/91c1429b212c/f02-browser-tools/runtime/fonts npm run test:e2e
```

The existing external fallback reports Chromium 153.0.8010.0; no browser dependency
was added to the repository. CI uses Playwright's own installed browser. Tested viewports
are 1440x1000 and 390x844 emulation; identity/safety/empty state, keyboard navigation,
visible focus, no overflow, no external requests/page errors or storage writes passed.
Real-device, screen-reader, comprehensive security or scientific revalidation is not
claimed. The restricted scientific test remains a skip, not a pass.

The npm environment emits an `http-proxy` warning and browser tooling emits a color
variable warning; neither failed validation. No dependency update was performed.
Only the seven declared Markdown files changed. Application, E01 gate, catalogs,
F02 code/evidence, source transforms, research records, lockfile, dependencies,
workflow and test files are byte-unchanged. Production content/authority arrays stay
empty. No source ZIP was opened, no license added and no scientific interpretation changed.

### G01-DOC CI evidence

The local results above are separate from CI. The documentation PR will run the
unchanged `validate` job, including its existing sensitivity controls. The exact
final commit, PR and observed CI run are recorded in the review handoff after completion;
no pending result is claimed as passing. Architect review is required before merge.

---

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


## V01 continuation — validation evidence — 2026-10-15 America/New_York

Architect-authorized continuation from `7120770f430663c548ec592397e5d63e36cbfff7`
on `v01-continuation` remains **BLOCKED / INCONCLUSIVE**. Serial supported
provisioning did not produce an application-capable engine: Chromium downloads
failed; Firefox 157.0 launches but blank-page creation crashes (2/2, sandbox EPERM);
WebKit lacks native dependencies and the standard installer is permission-blocked.
No cross-browser product validation or defect is claimed. The original V01 evidence
is historical and unchanged. New validation-only tooling reuses existing assertions;
production, existing tests, dependencies and CI are unchanged. Local non-browser
checks pass; local browser/smoke-sensitivity execution is BLOCKED. Exact-head CI
will be supplied separately in the draft PR handoff.

See [continuation evidence and scenario matrix](V01_CONTINUATION_REPORT.md).
F01/F02/E01/G01/G01-DOC/R01/R02/R02-DOC remain complete; F02 internal-only;
Stage 09C CLOSED/frozen `OUTWARD_PROVISIONAL_V1`; E01 gate and empty registries
unchanged; C01 professional review Owner-blocked/incomplete. No V02/R03 or
compatibility fix is authorized. Return to Architect; do not merge this draft.


## P01 — source review submission — 2026-10-17 UTC

Baseline/main: `afd9e2dc388adff10db9bb3187dae1e9edd4902b`; G01 ruleset `24954073`
verified active before review; no open PRs or other product task recorded in the
current repository status. Review: [P01_REPORT.md](P01_REPORT.md).

P01-01's extracted-source conditional exercise with synthetic dates demonstrated
that stale-date refresh deletes a valid new-day shared record. This is not a natural
browser scheduling test. No production fix or new committed test was made.
The required validation suite is run unchanged; exact submitted-head CI evidence
is recorded in the draft PR/handoff. Local and CI results are distinguished there.
Four authorized Markdown files only; historical bodies remain verbatim. V01 stays
BLOCKED / INCONCLUSIVE and PARKED. No certification or subsequent task is implied.

### P01 local validation results — 2026-10-17 UTC

Environment: Ubuntu 24.04.3 LTS x86_64, Node v24.19.0, npm 11.9.0,
committed Playwright 1.64.0. Commands used the pinned lockfile, unchanged scripts,
`NEXT_TELEMETRY_DISABLED=1` and no browser installation/provisioning.

| Command | Local result |
| --- | --- |
| `npm ci --fetch-retries=0 --fetch-timeout=20000` | PASS; 186 packages installed. |
| `npm run lint` | PASS, zero warnings required. |
| `npm run typecheck` | PASS, strict TypeScript. |
| `npm run test:education` | PASS, 5 tests. |
| `npm run test:f02` | 4 PASS; 1 restricted-data SKIP, not a pass. |
| `npm run build` | PASS, static export. |
| `npm run check:export` | PASS; app 14 files, export 35 files; zero approved lessons. |
| `npm run test:e2e -- --workers=2` | BLOCKED locally: runner reports 72 failures at launch because its pinned Chromium executable is absent. No application assertions ran successfully. |
| `npm run test:smoke-sensitivity` | BLOCKED locally, exit 1: negative control did not fail at the required safety-content assertion because Chromium could not launch. This is not a sensitivity pass. |
| `npm run test:education-sensitivity` | PASS, deliberately leaked fixture rejected; normal export rebuilt. |
| `npm audit --audit-level=high` | PASS; 0 vulnerabilities reported. |

Exact browser error: `browserType.launch: Executable doesn't exist at
/root/.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell`.
No attempt was made to provision it. Fresh required GitHub CI runs the existing
suite on its normal provisioned runner; its exact-head results belong to the PR
handoff and do not turn this local limitation into a local pass or reactivate V01.


## P01-01 coordination design submission — 2026-10-17 America/New_York

Baseline: `71ffae276131190d66e4809830cc6a060e7cc146`; G01 `24954073` verified
active and matching the governance record; PR #11 merged; no open PRs at preflight.
The design-only authorization accepts the prior correction's BLOCKED / INCONCLUSIVE
outcome. P01-01 remains unfixed. See [coordination design](P01_01_COORDINATION_DESIGN.md).

Exactly four documentation files are authorized. The original P01 report and all
production/test/config/dependency/workflow blobs remain unchanged. Historical bodies,
relative links and diff whitespace are checked before submission. Existing required
validation is run unchanged; the handoff records fresh exact-head CI IDs and separates
local limitations from CI results. No proposed future acceptance test is implemented.
No browser provisioning or V01 reactivation occurs. No remediation/merge is authorized.

### Local validation — 2026-10-17 America/New_York

Ubuntu 24.04.3 LTS x86_64; Node 24.19.0; npm 11.9.0; pinned Playwright 1.64.0.
`npm ci --fetch-retries=0 --fetch-timeout=20000` passed (186 packages).
`NEXT_TELEMETRY_DISABLED=1 npm run validate` ran the existing pipeline unchanged.

| Check | Observed local result |
| --- | --- |
| Lint and strict typecheck | PASS |
| Education | 5 passed |
| F02 | 4 passed; 1 restricted-data skip |
| Static build / export boundary | PASS; 14 app files, 35 exported files, zero approved lessons |
| Chromium regression | BLOCKED: 72 browser-launch failures; pinned executable absent; no application pass claimed |
| Smoke sensitivity | BLOCKED: missing browser prevented required safety-content failure; negative-control command correctly exited nonzero |
| Education sensitivity | PASS; deliberate leak rejected and normal export rebuilt |
| Dependency audit | PASS; zero vulnerabilities reported |

Missing executable: `/root/.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell`.
No browser install or provisioning was attempted. These local blocks are separate from
fresh exact-head GitHub validation, whose run/job IDs and results are recorded in the
PR handoff after completion. A passing existing suite does not validate this unimplemented
design. Scope/history/link/whitespace checks passed; all 70 existing files outside the
three modified status documents are byte-identical, including the original P01 report.
The fourth changed file is the new design. All 41 relative links in these four documents
resolve. Proposed T01–T25 remain a future plan, not newly executed tests.


## P01-01-COORD-IMPL — draft correction — 2026-10-17 UTC

Baseline `8c7693438285fe74168e66b2fdde4e9f706cac74`; draft PR #13 on
`p01-01-coordination-impl`. A bounded implementation now coordinates R01 operations
under exclusive `smile-track:routine`, preserves current-day bytes at stale rollover,
requires explicit reattachment, rejects differing-observation edits, cancels obsolete
queued work, and fails closed without coordination. This supersedes design-only
NOT_AUTHORIZED status solely for this authorized draft. Main has not been changed.

**Acceptance INCONCLUSIVE / NOT MERGE-READY.** Original Chromium negative control
(run `39043107930`, head `e052d0900807d10ded37d2e499074b9c7d39c3e5`) passed all
72 old tests and failed both new preservation paths on both projects (4 failures,
new-day bytes erased). Corrected run `39066242416` passed both preservation paths and
95 cases overall, but failed 13. Existing synchronous R01 completion assumptions in
R01 and protected R02 tests conflict with the new asynchronous policy; no existing
assertion was changed or suppressed. New fixture corrections and additional matrix
coverage are included in the draft. Final exact-head CI and per-test results belong
to the PR handoff; pending or skipped gates are not passes.

See [correction mechanism, evidence and case matrix](P01_01_COORDINATION_CORRECTION_REPORT.md).
The original P01 report and accepted coordination-design report remain unchanged.
Cooperating-tab guarantees exclude identical-byte ABA, older tabs/external scripts,
incorrect clocks, browser durability, and unsupported engines. P01-02 remains
unresolved; erase-all is H-release-then-R, sequential/non-nested/non-atomic.
R02 implementation/tests, schemas, dependencies, workflows and governance remain
unchanged. E01 publication controls/empty registries remain; C01 Owner-blocked and
incomplete; F02 internal-only; Stage 09C CLOSED/frozen `OUTWARD_PROVISIONAL_V1`;
V01 BLOCKED / INCONCLUSIVE and PARKED. No V02, R03, model integration or deployment.
Return evidence to Architect for independent review; do not merge or start another task.


## Authorized history-test synchronization correction — 2026-10-17 America/New_York

Architect authorized a narrow exception for `tests/history.spec.ts` only, plus
these additive documentation records. Starting rejected head:
`85274a710a147dd45e8b37ac6a970e268254cf30`; main remains
`8c7693438285fe74168e66b2fdde4e9f706cac74`.
Correction commit: `b24c8150a354184df9168363150e95fef7156150`.

Exactly eight lines were inserted in history tests: two `expect.poll` waits read
`smile-track:routine:1`, return null while absent, otherwise parse and require
`brushedTeeth === true`. One precedes the original failure-handling field assertion;
the other precedes capturing actual `todayBefore` bytes in the stale-enable fixture.
The original field assertion and final exact-byte equality remain verbatim. Removing
only the two inserted waits reproduces the starting history test byte-for-byte.
No arbitrary sleep, test retry, skipped case or weakened assertion was introduced.
No production source or coordination-test expectation changed.

**Correction verified; overall acceptance BLOCKED / INCONCLUSIVE.**
[Run 39069960202](https://github.com/mcpf8hwgyb-ship-it/smile-track/actions/runs/39069960202),
validate job `117505334082`, exact correction commit above: **FAILURE**.
Chromium: **116 passed / 2 failed**. All nine previously failing cases passed:
desktop write, silent-write, silent-remove, stale-enable; mobile write, silent-write,
remove, silent-remove, stale-enable. Entire R02 suite: **44/44 passed**.
New coordination cases: **46/46 passed**. Existing R01: **22 passed / 2 failed**;
foundation/education-browser cases: **4/4 passed**.

The two failures are unchanged mobile R01 assertions: `routine.spec.ts:51` expected
the complete saved sample immediately after consent `.check()` but received null;
`routine.spec.ts:142` expected null immediately after `.uncheck()` but received
`{"version":1,"date":"2026-10-12","brushedTeeth":true,"cleanedBetweenTeeth":false}`.
These match the synchronous-completion hazards already documented in the rejected
handoff. Neither authorized history completion wait timed out or returned a wrong
final value. This run does not establish a permanent persistence/deletion failure,
but it fails the required all-green acceptance condition. No additional test/source
fix is made; Architect disposition is required for any further change.

Lint, strict types, education (5), F02 (4 passed / 1 restricted-data skip), build and
export boundaries passed. Smoke sensitivity, education sensitivity and dependency
audit were **SKIPPED** after browser failure, not counted as passes. Original
negative-control evidence remains unchanged. This documentation-only follow-up will
also receive exact-head CI; its outcome is recorded in PR #13, without erasing this
failed run or treating a scheduling-dependent later pass as resolution of these tests.

Scope after this exception is exactly eight PR paths: the prior seven plus
`tests/history.spec.ts`. Rejected-head delta is only that test and four additive
documentation files. R01/R02 production, `tests/routine.spec.ts`, schemas,
dependencies/lockfile, workflows, registries, governance and scientific assets remain
unchanged from the rejected head. P01-02 and all previous exclusions remain unresolved.
PR #13 remains draft/unmerged; no deployment or unrelated work. Return evidence to
00 — ARCHITECT — CTO / Next Step; stop without broadening the correction.


## Second R01 completion-synchronization correction — 2026-10-17 America/New_York

Architect authorized only two R01 test-completion points and additive evidence.
Starting head `b7de1b49934be26eefa910e575677d754124a6ee`; correction commit
`bddbcb568079dd5bfb9a75fbde80c66b79cc7afd`. No production or history-test change.

Six inserted lines in `tests/routine.spec.ts` establish observable completion:

- Before the original exact `toEqual(sample)`, wait for Today-only status to contain
  `Saved in this browser for today.`, then poll parsed storage for full sample equality.
- Before disabling saving in the deletion test, establish those same two conditions.
  This prevents a false deletion pass caused by saving never having completed.
- After unchecking consent, wait for `Check-in erased. Saving is off.`, then poll raw
  storage to be exactly null before the original `toBeNull()` assertion.

All original assertions, memory checks and later null assertion remain verbatim.
Removing the six inserted lines reproduces the starting routine test exactly. No
arbitrary sleeps, test retry loops, skips or weakened expected values were introduced.
The accepted history synchronization and all 46 coordination expectations are unchanged.

**Overall acceptance remains BLOCKED / INCONCLUSIVE.** Exact correction run
[39074533031](https://github.com/mcpf8hwgyb-ship-it/smile-track/actions/runs/39074533031),
validate job `117518841953`: **FAILURE; 117 passed / 1 failed**.
Both new save checkpoints and the verified deletion checks completed on desktop/mobile.
The full default-flow test passed desktop but failed mobile later, at current line 59
(starting line 57): immediately after `between(page).check()`, the unchanged exact
assertion expected `{ ...sample, cleanedBetweenTeeth: true }`, but received the same
record with `cleanedBetweenTeeth: false`. Date, version and brushedTeeth matched.
No authorized completion wait timed out. The observed later-edit assertion is outside
this authorization; it is not changed. The run does not establish whether the edit
completed later, and no permanent storage-failure or corrected-behavior claim is made.
The deletion test passed both desktop/mobile in full.

Counts: existing R01 23 passed / 1 failed; R02 44/44; coordination 46/46; foundation/
Learn 4/4. Lint, strict types, education 5, F02 4 with 1 expected restricted-data skip,
build and export passed. Smoke sensitivity, education sensitivity and dependency audit
were SKIPPED after browser failure, not passes. Original negative-control evidence is
unchanged. No additional functional correction is attempted. This additive evidence
commit will receive exact-head CI, recorded in PR #13; a later scheduling-dependent
pass must not erase the reproduced failure above.

The complete PR remains confined to eight authorized paths. Starting-head delta is
only routine-test insertions and four additive documents. Main remains the baseline;
PR #13 stays draft/unmerged. R01/R02 production, history tests, schemas, dependencies,
lockfile, workflows, registries, governance and scientific assets are unchanged from
the starting head. P01-02 remains unresolved; prior compatibility/scientific limits
remain intact. Return reproduction evidence to Architect; do not broaden scope or merge.


## Post-edit completion synchronization — 2026-10-18 America/New_York

Architect authorized one additional test-only completion point after
`between(page).check()` in the existing default/restoration flow. Preflight matched
main `8c7693438285fe74168e66b2fdde4e9f706cac74`, head
`ff19b69c2de98060645070cf0cc119a60ce5de76`, tree
`76325137047f8fafce135cc35c565554c556fc87`, eight paths, open/draft/unmerged PR,
active unchanged G01 and zero unresolved review threads.

Correction commit `4e0b3b34e989f8c5b043ddb1eefd06cc952d5c18` adds exactly two lines to
`tests/routine.spec.ts`: wait for Today-only status to contain
`Saved in this browser for today.`, then poll the complete parsed record for exact
`{ ...sample, cleanedBetweenTeeth: true }` equality. Storage equality is the decisive
edit-completion condition. The original exact assertion immediately follows unchanged.
Removing the two inserted lines recovers the starting file exactly; accepted save/
delete waits, history tests and all 46 coordination expectations remain untouched.
No sleeps, skips, retries-to-green, relaxed values or production changes were added.

Correction-commit [CI run 39100240503](https://github.com/mcpf8hwgyb-ship-it/smile-track/actions/runs/39100240503),
validate `117594853991`: **SUCCESS**. Normal desktop/mobile Chromium:
**118 passed / 0 failed** (R01 24, R02 44, coordination 46, foundation/Learn 4).
The complete formerly failing flow passed both desktop and mobile. This supports the
post-edit completion explanation for the recorded failure; it is bounded executable
evidence, not a guarantee about arbitrary schedules or excluded concurrency cases.
Lint, strict types, education 5/5, F02 4 with 1 expected restricted-data skip, build,
export, smoke sensitivity, education sensitivity and audit all executed and passed.
Audit reported zero vulnerabilities. No skipped downstream gate is called a pass.

**Additional observation for independent review:** in that run's deliberately mutated
smoke-sensitivity phase, the expected foundation safety-content assertion failed and
an unrelated unchanged desktop history test also failed at `history.spec.ts:51`:
after R01 consent check and immediate reload, brushedTeeth was unchecked instead of
checked. The sensitivity script returned PASS because its required safety-content
negative control was satisfied. Normal full-suite R02 executions were 44/44. The
additional failure is not erased by that green gate; its cause is unproven here and
no history-test or production correction is authorized or attempted. Architect must
assess this residual observation; no universal regression-stability claim is made.

This evidence-only follow-up receives its own exact-head CI, reported in PR #13.
Historical failed runs and original negative-control evidence remain unchanged.
All other tracked files remain byte-identical to the starting head; the only further
updates are these additive records. The PR remains eight paths, draft and unmerged;
main is unchanged. No deployment, model integration or additional feature work.
P01-02 and P01-07 remain unresolved; V01 remains PARKED; F02 internal-only;
Stage 09C CLOSED/frozen OUTWARD_PROVISIONAL_V1. Return evidence for Architect re-review;
merge is not authorized. Preserve all earlier scientific/compatibility limitations.

## Final history reload synchronization — 2026-10-18 UTC

Architect authorized one persistence-completion barrier at the first history test's
R01 save-before-reload boundary. Preflight matched head
`4fe9350b5d17dbffa642630a8ce36a3f7a1bab84`, tree
`d2e87b0ab109762638d076e25457444ec4780cbc`, unchanged main
`8c7693438285fe74168e66b2fdde4e9f706cac74`, open/draft/unmerged PR #13,
eight paths, active unchanged G01 and zero unresolved review threads.

Correction commit `c4ada77679134994e9d81d9ac8b1aeae5b25afb1` inserts ten lines:
Today-only status must contain `Saved in this browser for today.`, then
`expect.poll()` must observe the entire parsed `todayKey` record exactly equal to
`{ version: 1, date: "2026-10-12", brushedTeeth: true, cleanedBetweenTeeth: false }`.
Only then does the original reload execute. Removing that insertion recovers the
starting history file exactly: reload, restored-brush, independent R02 consent,
null-history, history-write and later history assertions are unchanged.
No sleeps, retries-to-green, skips, weakened values or production changes were added.
Routine tests and all previously accepted synchronization/coordination cases are unchanged.

Correction-commit [CI run 39101726857](https://github.com/mcpf8hwgyb-ship-it/smile-track/actions/runs/39101726857),
validate job `117599202693`: **PASS**. Normal Chromium **118/118**:
existing R01 24, R02 44, coordination 46, foundation/Learn 4.
The affected history test passed desktop and mobile after confirmed persistence.
Smoke sensitivity: **58 passed / 1 expected failure**, exclusively the deliberately
removed foundation safety-content assertion; no unrelated history reload failure.
The affected history test also passed in that sensitivity execution.
Lint, strict typecheck, education 5/5, F02 4 pass plus 1 expected restricted-data skip,
build, export boundary, smoke sensitivity, education sensitivity and dependency audit
all executed successfully; audit found zero vulnerabilities. No skipped downstream
step is counted as a pass. Original P01-01 negative-control evidence remains unchanged.

CURRENT_STATE and ROADMAP now place an authoritative implementation-under-review
section directly below their titles, above the unchanged historical coordination-design
sections. This additive evidence commit receives fresh exact-head CI; its SHA/run/job
and final checks are recorded in the PR #13 handoff, without claiming future results here.

PR #13 remains draft, unmerged and NOT MERGE-AUTHORIZED. Production implementation
remains only in PR #13, not main. P01-02/P01-07 remain unresolved; V01 remains
BLOCKED / INCONCLUSIVE / PARKED; E01 gates and empty registries unchanged;
C01 Owner-blocked/incomplete; F02 internal-only; Stage 09C CLOSED/frozen
OUTWARD_PROVISIONAL_V1. V02, R03, deployment and dental-model integration remain
not authorized. Return evidence for independent Architect re-review.

## P01-01 post-merge closure — 2026-10-18 America/New_York

Architect disposition: **VERIFIED — ACCEPTED; CLOSE P01-01-COORD-IMPL**.
PR #13 is closed and merged; the accepted engineering implementation is on main.

| Merge evidence | Exact value |
| --- | --- |
| Resulting main | `7f925d7c2166c4eee5a327bef2e53331b3e7b4a0` |
| First parent | `8c7693438285fe74168e66b2fdde4e9f706cac74` |
| Second parent / approved head | `0750e85f7875f431e9c5da37ca7327b21c5dbdf2` |
| Merged tree | `f9c19d42ec6e9d0df433c5eaa3c6f18377a359e6` |
| Post-merge workflow | [39103606363](https://github.com/mcpf8hwgyb-ship-it/smile-track/actions/runs/39103606363) — SUCCESS |
| Validate job | [117604724612](https://github.com/mcpf8hwgyb-ship-it/smile-track/actions/runs/39103606363/job/117604724612) — SUCCESS |

Fresh post-merge CI was inspected on the actual resulting main SHA, not inferred
from the PR run. Verified results:

| Gate | Result |
| --- | --- |
| Chromium desktop/mobile | 118/118 PASS |
| Existing R01 | 24/24 PASS |
| Existing R02 | 44/44 PASS |
| Coordination | 46/46 PASS |
| Education | 5/5 PASS |
| F02 | 4 PASS / 1 expected restricted-data skip |
| Lint / strict typecheck / build | PASS |
| Export boundary | PASS — 35 exported files, zero approved lessons |
| Smoke sensitivity | PASS — 58 passes and exactly 1 intended foundation safety-content failure |
| Education sensitivity | PASS |
| Dependency audit | PASS — zero vulnerabilities reported |

No downstream skipped gate is reported as a pass. Original defect negative-control
evidence and failed intermediate runs remain historical evidence and are not erased
by closure. G01 24954073 remained active and unchanged; the repository remained public
and both production education registries remained exactly empty.

Acceptance is bounded engineering acceptance for current-version cooperating contexts
with working coordination and accessible/truthful storage, not privacy, security,
cross-browser, universal-concurrency, accessibility or clinical certification.
All exclusions and unresolved findings remain in force, including identical-byte ABA,
older/uncoordinated contexts and sequential non-atomic erase-all. P01-02/P01-07 remain
UNRESOLVED; P01-03 through P01-06 VERIFIED LIMITATIONS; P01-08 NOT_REVIEWED.
The authoritative current boundaries appear above the historical sections in
[CURRENT_STATE](CURRENT_STATE.md) and [ROADMAP](ROADMAP.md). This documentation-only
reconciliation does not authorize further implementation or deployment.

## P01-07-COPY-CORR — copy contract and negative control — 2026-10-18 America/New_York

Authorized baseline: `fc91f876792749666c2341f137b00d920a56ef04`.
Preflight verified exact main, accepted P01-01 coordination, successful required
validate, and active G01 24954073 (strict validate, no bypass actors, user bypass never).
Reviewed P01_REPORT exposure-model/P01-07 findings, current-state/roadmap/decisions,
current R01/R02 components/storage and tests, and reachable application source.
No authored routine-data upload/sharing path was found; no claim about all possible
runtime, dependency, host, extension or browser-level transmission channels follows.

Only two production text locations change:
- CheckIn: “This option does not keep history, and entries are not sent anywhere.”
  becomes “This option does not keep history. This version of Smile Track has no
  in-app feature for uploading or sharing routine entries.”
- History: “Entries are not sent anywhere.” becomes the same scoped feature sentence.
All adjoining privacy/storage/consent warnings remain verbatim. Runtime handlers,
storage, schemas, consent, locks, retention and deletion are unchanged.

One focused test is appended to each existing routine/history test file. On desktop
and mobile, each checks the scoped wording in its applicable UI location and retained
warnings; a case-insensitive page-wide locator requires zero occurrences of the old
statement. Existing tests remain verbatim, including request/cookie/storage assertions
and all 46 coordination executions. These are bounded copy/regression checks, not
proof against every transmission channel or comprehensive privacy/security assurance.

### Reversible prohibited-wording negative control

Temporary head: `53e8cc6935694f088b5d2762aaee08506f58892b`.
Temporary tree: `98d3e8b980a4b6abe745e799278ac69e5195e267`.
The scoped sentence was present, but “Entries are not sent anywhere.” was deliberately
appended in both existing privacy locations. Tests were identical to the final tests.
[Run 39138550348](https://github.com/mcpf8hwgyb-ship-it/smile-track/actions/runs/39138550348),
validate `117708002361`: expected FAILURE, **118 passed / 4 failed**.
Only the two new P01-07 cases failed in desktop/mobile, at the prohibited-copy
`toHaveCount(0)` assertion: expected 0, received 2. Existing R01 24, R02 44,
coordination 46 and foundation/Learn 4 all passed. This directly demonstrates
sensitivity to reintroducing the prohibited wording, even alongside the correct copy.
Lint, types, education, F02, build and export passed. Downstream smoke sensitivity,
education sensitivity and audit were skipped after the intentional browser failures,
not counted as passes.

The deliberate sentence is removed before final validation, without changing tests
or runtime logic. Final exact-head full-CI results and scope/governance evidence are
recorded in draft PR #15's handoff. The temporary negative-control commit is retained
as evidence, not proposed final UI behavior. No retry-to-green or test weakening.

The correction is pending independent Architect review. P01-07 wording remediation
is separate from unresolved comprehensive transmission assurance. P01-01 stays closed;
P01-02 remains unresolved; P01-03–06 limitations and P01-08 NOT_REVIEWED remain.
V01 stays parked; E01 gates/empty registries, C01 Owner-blocked/incomplete, F02
internal-only/NOT_CERTIFIED and Stage 09C CLOSED/frozen OUTWARD_PROVISIONAL_V1
remain preserved. No deployment, model integration, V02/R03 or other feature work.

## 2026-10-19 — P01-07 post-merge R01 erase test synchronization (under review)

Architect authorized P01-07-POSTMERGE-R01-ERASE-TEST-CORR as one bounded test-only correction. PR #15 is verified merged at `1406ba76e13186747148409ca0951209d995f6fb`; this does not establish successful post-merge validation or final Architect closure of P01-07. Its post-merge run `39142935490`, validate job `117720891943`, reported 121 passed / 1 failed: the mobile default-flow test read the saved record immediately after unchecked controls appeared.

The complete affected test and production sources were reviewed. The reset publishes unchecked controls before asynchronous, exclusive `smile-track:routine` erasure completes. The success notice follows verified removal inside the lock. This supports a provisional test-completion explanation, rather than establishing permanent deletion failure.

Draft PR #16 adds only two completion assertions to the existing default-flow test after erase and unchecked-control assertions: Today-only status must contain `Check-in erased. Saving is off.`, then `expect.poll(() => stored(page)).toBeNull()` must confirm absence of `smile-track:routine:1`. The original `expect(await stored(page)).toBeNull();` remains verbatim. Earlier complete saved-record assertions and subsequent memory-only, reload, cookie, storage and network assertions remain unchanged. No production behavior, schema, consent, retention, erasure or lock is changed.

Controlled negative evidence: commit `7d79431cb5c665a5ff1e27bc18fa92b32c418059`, tree `1bfc20862c223ce82c2dcf6fe47812acef719059`, run `39193372636`, validate job `117870772891`. A temporary test-local override silently refused only the owned today-key removeItem. Chromium reported 120 passes and exactly two intended failures (desktop and mobile default flow). Both timed out at the new status assertion after 5000 ms, receiving “Browser storage could not be verified. Saving is off. A previous saved record may remain; use your browser’s site-data controls to remove it.” The poll and original null assertion were not reached. Smoke sensitivity, education sensitivity and dependency audit were skipped in that intentionally failing run, not passed. F02 retained its expected restricted-data skip.

The injection is removed from the submitted correction. Fresh exact-head full validation and its run/job evidence are reported in PR #16; the negative run is not a substitute for those gates. No arbitrary scheduling delay or retry-to-green is added. Historical failed runs and negative controls remain evidence.

P01-07 broader transmission assurance remains UNRESOLVED and final Architect closure is not claimed. P01-01 engineering remains accepted and closed within its bounded cooperating-context contract; P01-02 remains unresolved. E01 publication gates and empty registries are preserved; F02 remains internal-only / NOT_CERTIFIED, V01 parked, C01 Owner-blocked, and Stage 09C CLOSED/frozen `OUTWARD_PROVISIONAL_V1`. No deployment, model integration, V02, R03 or feature work is authorized. This correction is not privacy, security, universal-concurrency, cross-browser, accessibility or clinical certification.
