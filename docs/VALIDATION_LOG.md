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
