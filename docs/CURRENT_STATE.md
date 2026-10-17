# SMILE TRACK — CURRENT STATE

## P01-01 coordination design — current status — 2026-10-17 America/New_York

P01 evidence is accepted and merged in PR #11 at
`71ffae276131190d66e4809830cc6a060e7cc146`. P01-01 remains a source-verified,
unfixed defect. The Architect accepted P01-01-CORR as BLOCKED / INCONCLUSIVE
and rejected read-before-delete as an adequate correction.

[P01_01_COORDINATION_DESIGN.md](P01_01_COORDINATION_DESIGN.md) submits the newly
authorized architecture investigation only. It proposes a dedicated R01 lock,
fail-closed persistence with memory-only use, and sequential independent R02/R01
erasure. These are recommendations requiring Architect decisions, not implemented
behavior. Availability/cleanup, rollover consent display, stale-edit conflicts,
consent-epoch ambiguity and P01-02 erase-all boundaries are explicitly unresolved
approval points. No production remediation or new test was made.

V01 remains **BLOCKED / INCONCLUSIVE and PARKED**. E01 gates/empty registries,
C01 Owner-blocked status, F02 internal-only scope and Stage 09C CLOSED/frozen
`OUTWARD_PROVISIONAL_V1` remain preserved. No V02, R03, deployment or model
integration began. Return the draft design PR for Architect review; do not merge.
This section supersedes older current-status wording; all historical text below
is preserved verbatim.


## P01 — current review status — 2026-10-17 UTC

P01 is a bounded source-based privacy/data-lifecycle review of baseline
`afd9e2dc388adff10db9bb3187dae1e9edd4902b`, submitted for Architect disposition.
See [P01_REPORT.md](P01_REPORT.md) for the two-key inventory, consent/deletion traces,
user-facing accuracy review and findings P01-01 through P01-08. P01-01 establishes a
conditional stale-tab R01 rollover deletion defect; other findings distinguish known
limitations, unresolved risks and unreviewed behavior. No production fix is authorized
or implemented. Existing Chromium CI is regression evidence, not independent privacy
or cross-browser certification.

V01 remains **BLOCKED / INCONCLUSIVE and PARKED**. F01, F02 (internal-only), E01,
G01/G01-DOC, R01 and R02/R02-DOC remain preserved. Stage 09C remains CLOSED/frozen
`OUTWARD_PROVISIONAL_V1`; E01 controls and empty registries are unchanged. C01
professional review remains Owner-blocked and incomplete. No next product task,
V02, R03, deployment, professional recruitment or compatibility fix is authorized.
All pre-existing historical text follows verbatim; this new P01 status does not
reactivate or relabel V01.

## V01 continuation — current status — 2026-10-16 America/New_York

The original V01 preflight was accepted as **BLOCKED / INCONCLUSIVE**. Its bounded
continuation was subsequently authorized and executed from
`7120770f430663c548ec592397e5d63e36cbfff7`.

The continuation also ended **BLOCKED / INCONCLUSIVE**: no engine reached Smile
Track application navigation in the continuation host. Chromium remained
provisioning/download-blocked; Firefox 157.0 launched but page creation crashed
before application navigation; WebKit remained blocked by missing host dependencies.
No browser-specific Smile Track product defect was demonstrated.

Existing Chromium GitHub CI remains regression evidence only. It does **not**
establish Firefox/WebKit or cross-browser compatibility, and V01 is not completed
cross-browser validation. See the [continuation evidence](V01_CONTINUATION_REPORT.md).

Older preflight statements below saying continuation was not yet authorized are
historical and explicitly superseded by this authoritative status section. All
pre-existing sections, including their historical current-state labels, remain
verbatim below and do not override this newer disposition.

V01 is now **PARKED**. Further execution requires a materially different host
capable of supported browser installation, dependency installation, page creation
and navigation under normal security controls, with Architect authorization.
No sandbox weakening, production compatibility fix, V02, R03, deployment or other
product task is authorized.

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

## R02 final closure — 2026-10-14 (current accepted state)

R02 is **COMPLETE**, accepted and merged through [PR #7](https://github.com/mcpf8hwgyb-ship-it/smile-track/pull/7).

- Merge / verified main: `56a576a81c21d8e79c68403d720f47319fcf8d6e`.
- Approved corrected head: `0e6e9b868e9ef79aa076daa172418eb001468af3`.
- Merged tree: `139e0c3e9a5627c3368aba7115e28ec16555d4f4`.
- Merge parents: prior main `5c12d3c468582b3e86ceaa40dd96eba4b20fffc6` and the approved corrected head.
- Exact-main post-merge CI: [run 38516699902](https://github.com/mcpf8hwgyb-ship-it/smile-track/actions/runs/38516699902), [validate job 115697006589](https://github.com/mcpf8hwgyb-ship-it/smile-track/actions/runs/38516699902/job/115697006589) — **PASS**.

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

G01 ruleset `24954073` remains active with required PR, `validate`, strict up-to-date
checks, conversation resolution, blocked force pushes/deletion and no bypass actors.
See [R02 report](R02_REPORT.md) and [validation evidence](VALIDATION_LOG.md).

## Historical records — superseded status

The records below are preserved verbatim. Their draft/unmerged/awaiting-review and
“current” labels describe earlier checkpoints, not the current accepted state.
Blanket statements that enabling always starts empty are superseded by the accepted
idempotent behavior recorded above.

## R02 correction C01 — 2026-10-14 (current)

The Architect requested correction of PR #7's stale-enable overwrite at reviewed
head `4b7532368c03dab05d25bf90783fd0e6a8669ab8`. Enable now preserves valid history
read under the Web Lock, pruning only ineligible dates. A new empty record is created
only when no valid enabled history exists. R01 is not copied or changed. This
supersedes earlier blanket empty-on-enable wording; prior records remain historical.
PR #7 remains draft and unmerged; main remains `5c12d3c468582b3e86ceaa40dd96eba4b20fffc6`.
See [validation evidence](VALIDATION_LOG.md). No subsequent task is authorized.
This R02 correction identifier is unrelated to the Owner-blocked professional-review
C01 activity, which remains incomplete. All scientific/publication boundaries persist.

## R02 — 2026-10-13 (current; supersedes earlier review-pending states)

Verified baseline: `main` at `5c12d3c468582b3e86ceaa40dd96eba4b20fffc6`.
R01 is COMPLETE and merged in [PR #6](https://github.com/mcpf8hwgyb-ship-it/smile-track/pull/6);
[post-merge CI 38335984236](https://github.com/mcpf8hwgyb-ship-it/smile-track/actions/runs/38335984236)
passed. F01, F02, E01, G01 and G01-DOC remain COMPLETE. F02 is internal-only;
Stage 09C remains CLOSED/frozen `OUTWARD_PROVISIONAL_V1`, with unchanged scientific
uncertainties. E01's publication gate and empty production registries are unchanged.

R02 is the sole authorized task: opt-in seven-local-day history, implemented on
`r02-seven-day-history`, pending Architect review before merge. Today-only saving
and history have separate consent and erasure. History starts empty, and an explicit
record action saves a snapshot of today's selections; there is no backfill. Missing
entries and unchecked values are distinct and carry no health or behavioral judgment.
See [R02 design, evidence and limitations](R02_REPORT.md).

C01 remains **Owner-blocked and incomplete**. No professional appointment, lesson,
clinical claim, restricted asset release, deployment or subsequent task is authorized.
The repository is public; restricted Dundee source assets are not. Earlier entries
below remain verbatim historical evidence and do not override this dated state.

---


## R01 — 2026-10-13 (current; supersedes historical review states below)

Verified main base: `9dbda414f7d9f6b97ef5508a61ad6d5314c8def0`, the merged
G01-DOC PR #5. F01 COMPLETE; F02 COMPLETE, internal feasibility only; E01 COMPLETE,
empty education foundation; G01 COMPLETE, solo-maintainer technical governance.
Stage 09C remains CLOSED/frozen `OUTWARD_PROVISIONAL_V1`; scientific work is paused.

R01 implements only a private daily check-in at `/routine/` on
`r01-private-daily-check-in`, awaiting Architect review before merge. Entries default
to memory; explicit saving retains one current-day record in this browser profile.
There is no clinical interpretation, history, account, transmission or deployment.
See [R01 design, validation and limitations](R01_REPORT.md).

The Project Owner has **BLOCKED the proposed C01 professional-review activity at
this stage**. C01 was not completed. No reviewer, review or educational publication
is authorized by R01; the unchanged E01 gate and empty production registries keep
publication blocked. No scientific interpretation or restricted asset boundary changed.
Public repository visibility is not permission to distribute Dundee assets or deploy.

No subsequent task is authorized. Architect review is required before merging R01.
Earlier records below remain unchanged as historical evidence.

---


## G01 closure — 2026-10-12 (current; supersedes earlier review-pending entries)

| Milestone | Current accepted state |
| --- | --- |
| F01 | COMPLETE — application foundation, merged PR #1 |
| Stage 09C | CLOSED — frozen `OUTWARD_PROVISIONAL_V1`, internal-only |
| F02 | COMPLETE — internal feasibility investigation only, merged PR #2 |
| E01 | COMPLETE — empty evidence-gated education foundation, merged PR #3 |
| G01 | COMPLETE — solo-maintainer technical governance |

Verified baseline: `main` at `53337472c46a8c0dc0cbd83c4157bc8831b05d65`.
The repository is public; the frozen Dundee source assets remain restricted and
are not in the public repository or application export. Public visibility does not
authorize deployment, scientific-asset distribution or publication of dental lessons.

[G01 evidence and limitations](G01_REPORT.md) record the active PR/CI safeguards.
Zero approving GitHub reviews are required: the Project Owner can self-merge a
passing, up-to-date PR with resolved conversations. This is not independent human
review. Existing qualified substantive dental/health review and explicit publication
approval requirements remain unchanged; both production content/authority registries
remain empty. Scientific development remains paused and all inherited uncertainties
remain unchanged.

G01-DOC is documentation reconciliation only, pending Architect review before merge.
No next application task is selected or authorized. Earlier entries below retain
their historical wording and evidence; they do not override this dated current state.

---

## E01 transition — 2026-10-12 (supersedes earlier active-task/review status)

F01 is complete and merged. Stage 09C is closed with frozen
`OUTWARD_PROVISIONAL_V1`, accepted for internal development only.
F02 received final Architect approval and PR #2 merged at
`a95a8ff1831900e6148a00c3681d928518bd8875`; post-merge
[CI 38215252635](https://github.com/mcpf8hwgyb-ship-it/smile-track/actions/runs/38215252635)
passed. That commit was reverified as main before E01 branching.
F02 is an accepted internal feasibility investigation, not production integration.
Real-mobile texture suitability and complete GPU-memory reclamation remain unresolved.
The original F02 report, uncertainty records and review chronology remain preserved.

**E01 is the sole selected application task:** establish the evidence-gated content
contract and minimal Learn interface, submitted for Architect review before merge.
No dental lesson or content reviewer has been approved/appointed in the repository.
The production lesson catalog and human authority registry are empty. Test approvals
are synthetic, non-medical fixtures only. See CONTENT_EVIDENCE.md for the process.

Scientific model development remains paused. All 15 scientific statuses and 16
review flags remain unchanged; anatomy NOT_CERTIFIED and public educational
suitability NOT_ESTABLISHED. No public dental-model release, derivatives, hosting,
backend, accounts or subsequent feature is authorized. The historical entries below
remain intact; prior F02 review-pending wording describes the pre-merge state.

---

## Status transition — 2026-10-12 (supersedes historical state below)

F01 is **merged and complete**: PR #1 merged on 2026-10-08 at 02:54:46 UTC,
commit `2aa706c5ea609dc41b6e0cdca6969b847f75d0af`; current `main` was rechecked
at that SHA. Historical F01 local/CI evidence remains in VALIDATION_LOG.md.

The Scientific Lead closed Stage 09C on 2026-10-11, accepting
`OUTWARD_PROVISIONAL_V1` for **internal development only**. The closure
record supplies later **owner-attested** desktop Gate B acceptance; the
older archived Gate B incomplete record remains unchanged. This Builder did
not independently repeat the native VTK desktop attestation.

F02 is the sole authorized application investigation. Its internal manifest,
raw-geometry adapter, conformance checks, and isolated browser harness are
submitted for Architect review; no public explorer or production integration
is authorized. See [F02 evidence](F02_REPORT.md) for artifact hashes,
measurements, limitations, and required decisions. Further application work
is paused pending Architect review; no F03 or merge is authorized.

Physical calibration remains UNRESOLVED; relative scale and public educational
suitability NOT_ESTABLISHED; identity/laterality/CEJ remain provisional or
unresolved; A/B anatomical semantics and anatomy NOT_CERTIFIED; contacts and
occlusion NOT_VALIDATED. All 15 inherited statuses and 16 review flags remain
unchanged. No scientific geometry, placement, or certification was changed.

The records below are preserved as historical evidence, including statements
that predate F01 merge or Stage 09C closure.

---

## Project Status

Status: F01 IMPLEMENTED AND CI VERIFIED — ARCHITECT REVIEW PENDING

F01 establishes a minimal static application shell. No product features are implemented.

The Architect-approved stack is recorded in D-003 in `DECISIONS.md`.

No application features have been implemented yet.

---

## Current Repository State

VERIFIED:

- Private GitHub repository created.
- Master project specification added.
- Architect and Builder workflows established in the ChatGPT Smile Track Project.

---

## Implemented

- Static Next.js App Router shell, React, strict TypeScript, CSS Modules.
- Preview status and non-diagnostic positioning; semantic landmarks and skip navigation.
- Node/npm pins, lockfile, ESLint, Playwright desktop/mobile smoke tests.
- Read-only GitHub Actions validation workflow.
- No accounts, media capture, analytics, health-data inputs, or persistence.

---

## In Progress

- Architect review of F01 on `f01-app-foundation`, PR #1.

---

## Known Bugs

None yet.

---

## Technical Debt

Minimal ESLint baseline does not include Next/React-specific plugin rules. Browser coverage is Chromium only; real-device and assistive-technology review remain future work.

---

## Scientific / Dental Unknowns

See `MASTER_PROJECT.md`.

Important unresolved areas include:

- physical scale calibration;
- selected tooth identity/laterality questions;
- CEJ interpretation;
- complete arch construction;
- contacts;
- occlusion;
- anatomical certification.

These uncertainties must not be silently resolved during normal product development.

---

## Current Blockers

Local browser downloads failed in the Builder environment; browser/keyboard checks passed independently in GitHub Actions. Architect approval is required before merging F01 or beginning another task.

Scientific dental-model work has unresolved questions documented in the master project specification.

---

## Last Validation

See `VALIDATION_LOG.md` for exact commands, results, environment blockers, and CI evidence.

---

## Next Decision

The Architect must review F01 evidence before merge or authorizing another task.



## V01 continuation — current investigation — 2026-10-15 America/New_York

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
