# P01-01 — Coordinated R01 storage correction

Date: 2026-10-17 UTC.
Status: draft implementation; acceptance INCONCLUSIVE pending Architect review of asynchronous-policy test conflicts. Not merged or certified.
Baseline: `8c7693438285fe74168e66b2fdde4e9f706cac74`.
Branch: `p01-01-coordination-impl`; draft PR #13.
Authority: [accepted coordination design](P01_01_COORDINATION_DESIGN.md) and the
Architect's bounded P01-01-COORD-IMPL authorization. The original [P01 report](P01_REPORT.md)
and design remain byte-identical historical evidence. No R02 source/test change.

## Mechanism and cooperating-tab contract

[storage.ts](../app/routine/storage.ts) replaces the public synchronous save/erase
helpers with `routineOperation`. The existing key, four-field schema, date helpers
and strict parser remain unchanged. The constant `smile-track:routine` is a lock
name, not an additional storage key, identifier or consent field.

Every R01 read, validation, invalid/expired-record removal, explicit enable/edit/erase,
readback and failed-write recovery occurs inside one exclusive Web Lock callback.
There are no awaits, nested lock acquisitions or unlocked persistence fallbacks inside
the callback. An AbortSignal rejects queued requests, and callback-entry plus mutation
checks reject cancellation/date changes before mutation. Initial read failure does not
mutate storage; failed write recovery attempts removal while still holding that lock.
Failures return off-here with remaining-bytes and browser site-data guidance.

Cleanup examines current stored bytes after acquisition, not stale memory or an
observation retained from before acquisition. If B writes first, A reads/preserves
B's current-day record. If A cleans first, B cannot write until A releases. A later
write cannot be removed by an earlier operation's post-release failure handler because
there is no such handler. This guarantee requires every writer/cleanup participant to
use the protocol and agree on the current local day.

An edit carries the exact observed raw string, an immutable intended record and a
requested date. It rereads inside the lock: absent consent is never recreated by an
edit; differing bytes produce a conflict and the current values for review. No automatic
retry writes stale values. Explicit enable preserves and attaches to an existing valid
record rather than overwriting it. Only explicit enable can create absent consent.

[check-in.tsx](../app/routine/check-in.tsx) resets old-day memory and detaches local
saving before coordinated rollover reads. It announces preserved current-day bytes and
requires explicit saving to reattach. A page-local detach flag prevents delayed events
from reattaching automatically. Fresh mount still restores valid current-day consent.
A page-local error latch prevents automatic reattachment to bytes surviving a failed
operation; explicit recovery/remount remains subject to the known surviving-byte limit.

Pending operations show an unconfirmed status. An enable checkbox expresses a pending
explicit request while checked/aria-disabled (kept focusable); the status does not claim a verified save.
A visible cancellation control, memory editing, lifecycle teardown, date rollover and
storage notifications can abort obsolete queued work. Controller identity/alive guards
separately suppress outdated UI results. Cancellation cannot undo a completed write.
Memory edits during pending persistence detach/cancel rather than silently queue saves.
Background reads are coalesced; there is no lock stealing, timeout bypass or unlocked
removal on API absence/rejection. Pending R01 use can continue in memory.

## Intentional approved policy changes

- R01 persistence and in-app deletion now require coordination. On absence/rejection,
  memory remains usable, stored bytes are untouched and may remain past nominal expiry.
  The UI directs users to browser site-data controls. This is not verified erasure.
- Rollover resets local selections/off state but preserves other-tab current-day bytes;
  explicit reattachment adopts the existing record. Normal fresh-mount restoration is
  retained. The UI copy distinguishes detachment, surviving bytes and persistence.
- Conflicting stale saved edits display current values for review instead of overwriting
  them. Exact raw comparison may conservatively reject equivalent reordered JSON.
- Pending saving/deletion is explicitly unconfirmed; cancellation is not rollback.
- Successful erase-all wording qualifies the existing “All routine data erased” phrase
  with “in separately verified operations” and warns that another tab may enable saving
  again. Failures report each erasure result separately. No old assertion was weakened.

All original R01 test bodies/assertions remain verbatim; tests were appended only.
The unchanged R02 suite includes the exact existing `toContainText("All routine data
 erased")` success assertion (with a normal space, not a newline in source). The
qualified success wording retains that substring and explicitly narrows its meaning
rather than claiming simultaneous absence or editing the test.

## R02 and erase-all

The existing History ref operation completes/releases `smile-track:routine-history`
before CheckIn requests `smile-track:routine` for erasure. No R01 lock is held while
waiting for history, and no history lock is acquired from an R01 callback. Results
remain sequential/non-atomic. A failed history deletion does not prevent the R01
attempt once it returns. A pending history operation still delays the R01 step and
retains the existing erase-all busy behavior; this is not redesigned here.

P01-02 remains unresolved: another tab can explicitly enable history between steps;
identical-byte erase/re-enable (ABA) cannot identify a distinct consent epoch without
schema information not authorized here. The observed-value contract does not claim
durable revocation across a later explicit re-enable. Independent history consent,
retention, recording, failure handling and history-only erasure remain unchanged.

## Original-failure evidence

The same PR first ran a test-only negative control with original baseline production:
head `e052d0900807d10ded37d2e499074b9c7d39c3e5`, tree
`e330a5e361dbc875c5808937227e0d413ab77ea3`.
[Run 39043107930](https://github.com/mcpf8hwgyb-ship-it/smile-track/actions/runs/39043107930),
[validate job 117426408741](https://github.com/mcpf8hwgyb-ship-it/smile-track/actions/runs/39043107930/job/117426408741):
expected FAILURE at the browser regression step. All 72 pre-existing tests passed.
Both new preservation tests failed on desktop and mobile (4 failures) at the exact-byte
assertion: expected the new-day false/true record; received null. Lint/types, education,
F02 and export checks passed before that failure. Later sensitivity/audit steps were
skipped in this deliberate negative-control run, not counted as passes.

The two identical preservation assertions remain in the corrected suite. A setup barrier now waits for A’s confirmed old-day save before advancing the clock, so asynchronous setup cannot accidentally preempt the intended stale-memory state. They suppress
A's storage-event delivery, advance the clock without running A's timer, let B explicitly
save the new-day record, then trigger A's focus-refresh or activity interaction by
programmatic dispatch to avoid selecting the other path accidentally. This is controlled
browser scheduling, not evidence about natural occurrence frequency.

## Deterministic acceptance coverage

New tests use real Web Locks held by a separate same-origin page, observable queue/grant
barriers and explicit release promises. No arbitrary sleeps establish race ordering.
Storage events and time are controlled separately. A scoped instrumented test verifies
all R01 storage calls, including failed-write cleanup, run inside the R01 callback.
Fault injection delegates unrelated keys unchanged. Test code exists only in
[tests/routine.spec.ts](../tests/routine.spec.ts).

The matrix below maps the original design cases to executable evidence or explicit
limits. PASS is assigned only after the final GitHub run in the handoff; partial means
only the listed ordering/subcase is exercised, not every proposed variant.

| Design case | Evidence / coverage boundary |
| --- | --- |
| T01 stale pre-observation before B write/cleanup | Queued stale-observation test: A old memory, B enable queued first, A cleanup queued second; B bytes preserved; explicit reattachment verified |
| T02 B saves before A wake | Original negative-control tests, unchanged assertions for refresh and interaction, desktop/mobile |
| T03 acquired-lock boundary | Holder prevents queued writes; instrumentation detects outside-lock reads/writes/removals including failed-write cleanup. Partial: no artificial pause between native synchronous get/remove |
| T04 two stale saved edits | B edit then A stale edit under queue barrier; first values retained, latest values shown with conflict |
| T05 save versus explicit erase | Both erase-before-stale-edit and saved-edit-before-erase orderings |
| T06 rollover versus explicit erase | Both queue orders; null remains, stale memory reset and saving off |
| T07 stale edit after revocation | Queue revocation before stale edit, suppress notification; null remains; consent stays off |
| T08 queued midnight | Queued enable crossing local midnight refuses saving and resets stale selections; partial: dedicated queued-edit variant not added |
| T09 initial storage read failure | Existing get denial/startup-unavailable tests; no fabricated consent; memory remains usable |
| T10 throwing write/next peer write | Existing failure test plus failed-write-cleanup/next-save queue test |
| T11 silent write/next peer write | Existing silent-set failure plus same queue test with ignored write |
| T12 removal throws | Existing today-only and unchanged history partial-erasure tests |
| T13 removal silently ignored | New silent-removal test verifies bytes remain, warning/off latch and event/timer behavior |
| T14 missing lock API | New seeded-record test: restore/save/erase/rollover leave bytes untouched, memory editing works |
| T15 rejected R01 lock | Same scoped rejection test; R02 calls delegated; no fallback writes/removals |
| T16 held lock / cancellation | Pending status and no mutation before release; cancellation/memory edit abort requests; drain barrier proves no late commit |
| T17 lifecycle | Queued pagehide cancellation and existing navigation regression. Genuine BFCache/process-discard behavior NOT_REVIEWED |
| T18 storage notifications | Event cancels queued intent; delayed notifications in conflict/revocation/rollover tests. Partial: not every before/after completion permutation |
| T19 erase-all lock ordering | Hold H and show no R request/holding; release H while R held; history gone/today retained until R release; truthful pending/result |
| T20 partial erase | Existing unchanged R02 tests cover history failure/R01 success and history success/R01 failure |
| T21 history re-enable between erasures | Hold R after H erasure, peer explicitly enables H, release R; H survives and result is qualified. P01-02 not solved |
| T22 R02 independence | Entire existing history suite, plus all existing erase-scope/retention/snapshot assertions unchanged |
| T23 identical-byte ABA | Peer erase/re-enable exact X followed by stale A edit; edit is permitted. Explicit evidence of limitation, not a durable-epoch guarantee |
| T24 explicit reattachment | Preserved current-day record adopted without replacement; original memory-default explicit saving covers absent-key creation |
| T25 combined failed write/removal | Scoped silent write and removal failure preserve X; error latch remains off across notification/timer |

Final browser counts, head/tree and exact-run evidence are supplied in the PR handoff
once the final submitted tree is validated. These tests are Chromium evidence only.

## Verification and protected boundaries

Only two production files, one test file, this report and three additive status records
may change (seven files total). Historical document bodies are preserved verbatim.
All other tracked blobs/modes, including both historical P01 reports, R02 code/tests,
registries, schemas outside these unchanged definitions, dependencies/lockfile,
CI/configuration, governance and scientific records are compared with the baseline.
Required existing validation and both sensitivity controls run without changed gates.

Local pinned Chromium is unavailable; an already-present optional fallback executable
was attempted before correction and crashed at launch (SIGSEGV). That attempt is
BLOCKED and supplies no original-failure evidence. No installation/provisioning or
V01 reactivation occurred. GitHub's normal provisioned Chromium supplies before/after
acceptance. Local environment: Ubuntu 24.04.3, Node 24.19.0, npm 11.9.0; no dependency
changes. Exact local check outcomes are recorded with the final submission.

## Residual guarantees and stop boundary

Guarantees require current-version cooperating tabs, one origin/storage bucket, granted
locks, truthful storage operations and matching local-date interpretation. They exclude
older/uncoordinated tabs, arbitrary same-origin scripts, DevTools, extensions, browser
sync/restoration, durability/crash loss, false storage readback, unsupported engines,
incorrect clocks/timezones and indefinitely pending/rejected coordination. No guarantee
of physical disk erasure or revocation of backups is made. A completed write is not
reversed by later cancellation. API absence deliberately leaves bytes for browser
site-data cleanup rather than risking an unlocked race.

P01-02, P01-03 through P01-08 and all scientific limitations retain their documented
status except the bounded P01-01 implementation proposed for review here. E01 gates
and empty registries remain; C01 remains Owner-blocked/incomplete; F02 internal-only;
Stage 09C CLOSED/frozen OUTWARD_PROVISIONAL_V1; V01 BLOCKED / INCONCLUSIVE and PARKED.
No backend, account, clinical claim, V02/R03, deployment or model integration began.
Stop after evidence submission; no merge before independent Architect review.

## Intermediate corrected CI and policy conflicts for Architect review

Head `b9b6912a27632f4573c22b2f37ca70659440e06a`, run
[39065873892](https://github.com/mcpf8hwgyb-ship-it/smile-track/actions/runs/39065873892),
validate job `117493302937`: **FAILURE**, 85 passed / 17 failed browser cases.
Lint/types, education (5), F02 (4 + 1 restricted-data skip), build and export passed.
Later workflow sensitivity/audit gates were skipped, not passed.

The failures exposed a real keyboard-focus regression (native disabling of a focused
pending checkbox), corrected by keeping it focusable with aria-disabled and rejecting
duplicate submissions. Two new fixtures were corrected: wait for A’s original save
before clock advance, and wait for asynchronous R02 enable using click plus checked
assertion. These are fixture changes, not removed preservation assertions.

The remaining synchronous-policy incompatibilities must not be hidden:

- `tests/routine.spec.ts:51`: immediately after consent `.check()`, an unpolled raw
  storage assertion expects the saved sample. Under a Web Lock, checked pending intent
  is not confirmed persistence; the visible pending status explicitly says so.
- `tests/routine.spec.ts:142`: immediately after `.uncheck()`, an unpolled raw assertion
  expects null. Saving-off is immediate local revocation; physical removal is confirmed
  only after lock acquisition and verified readback.
- `tests/history.spec.ts:195` (five injected-history-failure cases): immediately after
  R01 `.check()`, it parses an unpolled R01 key and expects `brushedTeeth === true`.
  This checks synchronous R01 completion inside the otherwise unchanged R02 suite.

No old assertion is deleted, weakened, skipped or rewritten. No R02 test file is
modified. These races cannot establish an asynchronous completion contract. Architect
review is requested for explicit completion waits in those assertions; this draft does
not assume permission to edit protected R02 tests. A red unchanged regression suite
is a failed acceptance gate even where the reason is an intentional async policy.
The proposal is not merge-ready and no full regression-preservation claim is made.

Second corrected run: head `748bdcb361b567e44cc3a589ad5bb330f33d7c0c`,
run [39066242416](https://github.com/mcpf8hwgyb-ship-it/smile-track/actions/runs/39066242416),
job `117494419282`: 95 passed / 13 failed. Both rollover preservation paths now passed
on both Chromium projects. The keyboard regression passed. An additional unchanged
history assertion (`history.spec.ts:428`) captured `todayBefore` immediately after R01
`.check()` at line 390; null was sampled before the asynchronous save completed. This
is another completion-wait incompatibility, not evidence of a history schema mutation.

The newly added edit-before-erase fixture initially allowed the first write's storage
event to cancel the queued erase, as specified by pending-operation cancellation.
The ordering fixture now suppresses notification to the eraser so that both queued
operations actually execute; the separate event-cancellation test remains. This
qualification is essential: queued explicit deletion can be cancelled before acquisition,
and no success is then reported. No claim says cancellation reverses an earlier write.

Erase-all wording is further narrowed to today-only saving off here, with history's
latest state shown below: peer history enable between the sequential steps can be
reflected in this tab by unchanged R02 listeners. The result does not assert both local
controls remain off, or that both keys are simultaneously absent.

## Local validation and submission inventory

Local lint and strict type checking passed after the final source edits. Production
build passed before the final notice-only edit. Education: 5 passed. F02: 4 passed,
1 restricted-data skip. Export boundary passed (14 app files; generated export count
varies with rebuilt chunks; zero approved lessons). Education sensitivity rejected
the deliberate leak and rebuilt normal output. Dependency audit reported zero
vulnerabilities. Local Chromium remains blocked at browser launch; local smoke
sensitivity is not claimed. Exact final-tree browser/build/gate results are in PR #13.

Changed files (complete inventory):

- `app/routine/storage.ts`
- `app/routine/check-in.tsx`
- `tests/routine.spec.ts` (original content retained as an exact prefix)
- `docs/P01_01_COORDINATION_CORRECTION_REPORT.md` (new)
- `docs/CURRENT_STATE.md` (additive)
- `docs/ROADMAP.md` (additive)
- `docs/VALIDATION_LOG.md` (additive)

Live G01 check: ruleset `24954073` remains active with original update timestamp
`2026-10-12T17:15:53.928-04:00`, strict required `validate` (integration 15368), PR,
resolved threads, deletion/non-fast-forward protection, no bypass actors and current
actor bypass `never`. Main remained at the baseline; repository public; PR #13 draft.
A failed required validate is not bypassed. Final exact-head evidence is recorded in
the PR body to avoid claiming that a commit contains its own future workflow result.


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
