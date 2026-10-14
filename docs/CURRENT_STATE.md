# SMILE TRACK — CURRENT STATE

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

