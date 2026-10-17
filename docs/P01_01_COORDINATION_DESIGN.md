# P01-01 — R01 coordination design

Date: 2026-10-17 America/New_York.
Status: **PROPOSED — architecture investigation only; Architect decisions required**.
No production implementation, prototype, test expansion or remediation was performed.
P01-01 remains a VERIFIED DEFECT and unfixed. The rejected read-before-delete
correction remains BLOCKED / INCONCLUSIVE, accepted by the Architect.

## Exact baseline, scope and preflight

Repository: `mcpf8hwgyb-ship-it/smile-track`.
Baseline/main: `71ffae276131190d66e4809830cc6a060e7cc146`.
Baseline tree: `2fbcb10b7ebd7d9d8ad2f4ac8e87c98c42219aa7`.
Branch: `p01-01-coordination-design`.

GitHub main-ref and fresh clone agreed on this baseline. PR #11 is merged at this
commit; P01 acceptance is provided by the Architect handoff. Live G01 ruleset
`24954073` matches [G01_REPORT.md](G01_REPORT.md): active, required PR and `validate`
(integration 15368), strict freshness, thread resolution, force-push/deletion
restrictions, no bypass actors, current actor bypass `never`. Its update timestamp
remains 2026-10-12T17:15:53.928-04:00. No open PRs were present at preflight.
Current documentation keeps V01 BLOCKED / INCONCLUSIVE and PARKED. No other active
implementation task was found in repository evidence; undisclosed work elsewhere
cannot be inferred. The new authorization is design-only and supersedes historical
pending-P01 wording without rewriting it.

Read [CheckIn](../app/routine/check-in.tsx), [storage](../app/routine/storage.ts),
[history storage](../app/routine/history-storage.ts), [history UI](../app/routine/history.tsx),
[root history retention](../app/routine/history-retention.tsx), root layout and callers,
[R01 tests](../tests/routine.spec.ts), [R02 tests](../tests/history.spec.ts), package
scripts, CI workflow, [P01_REPORT.md](P01_REPORT.md), R01/R02 reports, current state,
decisions and governance. Search of application storage-key/helper references found
no other R01 storage consumer. Home/Learn invoke R02 retention, not R01 cleanup.
Source symbols below are pinned to the baseline, not future implementation promises.

Only this report and additive entries in CURRENT_STATE, ROADMAP and VALIDATION_LOG
change. P01_REPORT is preserved byte-for-byte. Existing validation is regression
evidence for unchanged software, not evidence that this proposal is implemented.

## Current defect mechanism and evidence limits

`rollover()` and `refresh()` remove `smile-track:routine:1` solely because
`current.current.record.date` differs from `localDate()`. They do not establish the
stored record's date. `erase()` removes by key and verifies null readback; that
verification cannot tell whose value was removed. `restore()` also has an unlocked
read-invalid/remove path, and `save()` performs unconditional cleanup after an
unverified write. Protecting only the two named rollover functions is insufficient.

The earlier source exercise establishes the already-written-current-day case.
Natural scheduling/frequency and a new implementation are NOT_REVIEWED here.
Reading again immediately before removal still leaves a read/write/remove interval.
No new browser defect reproduction is claimed in this design task.

Platform references consulted 2026-10-17:

- [HTML Web Storage](https://html.spec.whatwg.org/multipage/webstorage.html): independent
  key operations do not supply conditional atomic removal; authors must not assume
  cross-process locking. Storage events are queued notifications.
- [Web Locks specification](https://www.w3.org/TR/web-locks/): exclusive same-name
  locks coordinate participating contexts in the same storage bucket. The callback
  lifetime determines the held lock; pending requests can be aborted. Locks do not
  force scripts to participate. This published document is a Working Draft.
- [IndexedDB specification](https://www.w3.org/TR/IndexedDB/): transactions provide
  a different storage model, but do not transact over an existing localStorage key.

The following policy, operation contract and test plan are project-specific design
recommendations derived from the inspected code, not platform guarantees or quotations.

## Complete current R01 operation inventory

Notation: K = `smile-track:routine:1`; G = getItem(K); S = setItem(K);
D = removeItem(K); V = parseRecord requiring exact keys/version/booleans and today's
local date. E = `erase()` (D then G===null); W = `save()` (S then exact G readback;
failure invokes E). Every multi-call storage sequence below is currently unlocked.
Pure memory changes cannot mutate K, but event-driven callers may reach other rows.

| Operation / source symbol | Reads / validation | Writes / removals and verification | Trigger and purpose | Interleaving exposure |
| --- | --- | --- | --- | --- |
| `storage.localDate`, `fresh`, `parseRecord` | Clock; V parses supplied bytes | None | Date, fresh memory, validation helpers | Clock can change; no storage transaction |
| `storage.erase` | G after D, no date/consent validation | D; success iff G is null; exception false | Explicit revocation, expiry and failure cleanup callers | Peer write can precede D or follow D before readback |
| `storage.save` | Exact serialized G after S; no own V | S; failed/throwing/mismatched write invokes E; false even if cleanup succeeds | Enable/edit callers; recovery | Peer write can be mistaken for failure and erased by E |
| `CheckIn.rollover` | In-memory date vs clock; no initial G/V | If stale, E; fresh values/off; warning on unverified erase | Before select/toggleSaving; expiry | Deletes any current K despite stale memory |
| `restore` | G, V; no write if valid/missing | Non-null invalid K invokes E; publish valid record/on or fresh/off; catch warning | Mount, matching/null storage event, persisted pageshow; recovery | Peer can write between G and E; stale UI result also possible |
| `refresh` | In-memory date vs clock | Stale: E and fresh/off; otherwise no storage access | Timer, focus, visibility, nonpersisted pageshow; expiry | Same unconditional deletion as rollover |
| `select` with saving off | Calls rollover; then memory record | No S after rollover; checkbox toggled in memory | User activity edit | Rollover may already have deleted K |
| `select` with saving on | Calls rollover; G/V checks consent before W | W of full in-memory record with one toggled field; publishes off on failure | User activity edit | Consent read/write and stale whole-record overwrite gaps |
| `toggleSaving` off-to-on | Calls rollover; no fresh consent read in enable branch | W of next memory record; on only if verified | User explicit consent | Can replace another tab's newer record; stale rollover can erase first |
| `toggleSaving` on-to-off | Calls rollover; chooses branch from returned state | E; preserves current memory selections; warns on failure | User revocation | Stale rollover can change which branch is executed |
| `reset` | No initial G/V; fresh clock | E; fresh/off; success or warning | Explicit today-only erase | Removes whichever value exists at D; not atomic with later writers |
| `resetAll` | Awaits `history.current?.erase()`; then R01 E | H erasure then K erasure; success only both true; fresh/off | Explicit two-scope revocation | No common boundary; history wait can delay R01 erase indefinitely |
| `storageChanged` | Event key only, payload not used as source of truth | Calls restore for K or null key | Cross-tab recovery, including clear | Delayed notification; restore itself may remove |
| `hide` | Fresh clock | Memory fresh/off only | pagehide; memory lifecycle | Cannot cancel already-issued work (currently R01 synchronous) |
| `show` | persisted flag | persisted: restore; otherwise refresh | pageshow/BFCache recovery | Reaches restoration/cleanup paths above |
| `tick` | Clock and next midnight | refresh, then timer up to 60 seconds | Timer and immediate effect setup | Suspension postpones cleanup; timer does not coordinate tabs |
| effect setup/teardown | Setup restore then tick; teardown clears timer/listeners | Setup may reach E; teardown no K mutation | Mount/unmount | Leaving cannot roll back completed removal |
| `publish` / render / History prop | In-memory state; pass record to History | No K access | UI update and independent explicit history snapshots | Must not treat a rendered record as fresh storage authority |

Failure edges are part of this inventory: G throw in restore gives fresh/off warning;
G throw in select disables saving; any W failure attempts E; E failure leaves possible
bytes and warns. Missing K never grants consent through restore/select. R02 imports
only R01 types/date utilities and receives an explicit record argument; its persistence
uses a different key. No R01 storage mutation is hidden in R02 or root retention.

## Concurrency model and assumptions

Scope is current-version cooperating tabs sharing the same origin/storage bucket,
lock manager and accessible storage. All R01 key operations must enter one protocol,
including reads that may clean up and error recovery. No code may retain a lock
across user input, network requests, R02 calls or arbitrary asynchronous work.

Define one operation as acquisition, fresh read, validation against a captured local
operation date, conditional mutation, readback and result construction, then release.
Synchronous storage calls occur inside that callback. Recheck the local date before
any mutation; a detected date change aborts the stale intent and requests fresh review.
A final refresh handles a boundary reached after the operation. No claim of a perfect
wall-clock instant is made; wrong clocks/timezones and clock changes during a callback
remain a boundary. Cooperating contexts must agree on the relevant local day for the
current-day-preservation guarantee; a clock that classifies B's date as future/expired
can otherwise legitimately trigger the current invalid-record policy.

Serialization alone does not stop stale whole-record writes. User mutation requests
must carry an immutable target, requested date and last observed storage value (held
in memory only), plus a local operation revision. Reads and comparison happen again
inside the lock. A different value causes conflict/review, not stale overwrite.
No persistent version, user identifier, epoch or extra retention field is proposed.

Exact-byte comparison is deliberately conservative: reordered valid JSON can cause a
harmless conflict. An identical-value ABA sequence (delete then explicitly re-enable
identical bytes before a stale operation acquires) cannot be detected with this schema.
A stored value is not a durable consent epoch. Strong revocation-across-re-enable
semantics therefore remain an Architect/P01-02 question, not a solved property.

## Alternatives considered

All names in this section are coordination strings, not new persisted identifiers.
Only the dedicated-R01 option is recommended for further approval.

| Alternative | Names and protected operations | Acquisition/read/validation/mutation boundary | Consent, retention and memory implications | Complexity / exclusions |
| --- | --- | --- | --- | --- |
| Dedicated R01 Web Lock | Proposed `smile-track:routine`; every K read, enable, edit, explicit erase, invalid/expiry cleanup and failed-write cleanup | Exclusive lock before G; keep G/V/S/D/readback within callback; no public unlocked mutators | R01 persistence newly requires locks; memory check-in stays independent; cleanup delayed if lock unavailable | Smallest isolation from R02; requires async UI contract and stale-intent guards; legacy tabs excluded |
| Shared routine-wide lock | Proposed `smile-track:routine-all`; all K operations AND all R02 read/prune/enable/record/erase, including root retention | Same outer lock before either key; two-key operations can hold once; inner helpers must not reacquire it | Couples history availability/latency to R01; still two storage removals with possible partial failure | Broad R02 migration and P01-02 decisions; existing R02-only/legacy participants bypass it |
| Reuse existing history lock | `smile-track:routine-history` protects all K and H operations | K acquires existing H lock; erase-all must call unlocked-under-held-lock internals, not historyOperation recursively | Retains H name, but busy/history failures delay basic R01 persistence; no independent availability | Self-deadlock if resetAll holds H then calls existing historyOperation; refactor beyond smallest R01 scope |
| Compose dedicated locks | `smile-track:routine` plus existing `smile-track:routine-history` for a future joint operation | A joint design would need a single global order H then R, with unlocked internal helpers; no reverse edge | Independent single-key operations, but joint erase waits for both; partial storage failure still possible | More complex, alters erase-all contract and exposes P01-02; not recommended now |
| IndexedDB migration | New database/store, readwrite transaction for all R01 records | Validation and mutation within one transaction; completion/abort determines result | Changes storage location, migration/deletion/consent recovery; cannot atomically include old K | Materially different native option; not within unchanged-schema/key scope; old localStorage writers remain unsafe |

For every lock option, explicit deletion and automatic expiry must use the same lock
as saving; failure cleanup must remain under the lock already held. Exceptions or
silent write/remove failures require verified error results, not successful-save or
erase notices. Do not reacquire a non-reentrant lock from a helper already inside it.
The policies below apply to unavailable/rejected/pending requests for each lock option;
shared/reused locks extend their impact to history as well. IndexedDB instead must
handle unavailable/open/transaction failures and blocked upgrades with memory-only
fallback and retained-byte warnings; it cannot fall back to writing old K safely.

BroadcastChannel notifications, storage events, leader election by localStorage flags,
or a read/compare/remove loop are not substitutes for a mutually observed mutation
boundary. A SharedWorker authority would need every writer to use it plus lifecycle,
support and recovery policy; it does not protect legacy direct writers and is larger
than the dedicated-lock proposal. No fallback may claim universal atomicity.

## Recommended coordination contract — proposal requiring approval

Use exclusive `smile-track:routine` for all K operations. Keep R02's existing lock and
semantics unchanged. Centralize R01 operations behind a single async boundary in
storage.ts, with internal read/write/remove helpers callable only while already held.
Do not implement this recommendation in the current task.

| Intent | Required decision inside R01 lock | Storage outcome / UI contract |
| --- | --- | --- |
| Restore/read | Read current K, validate today; absent means no consent; invalid means verified cleanup | Valid record can restore already-existing consent under baseline restoration rules; no new record. Failure is off-here warning |
| Automatic rollover/refresh | Discard stale memory as authority; re-read K and current date inside lock | Preserve valid today K byte-for-byte. Remove only currently invalid/old K. Reset old memory values; do not enable saving merely because yesterday was on |
| Explicit enable | Capture enable intent rather than invert latest saving state; date-check inside lock | If valid K exists, preserve it and attach to its values instead of writing stale memory. If absent/invalid-cleaned, write explicit same-day fresh/requested memory only after date check and verified cleanup |
| Saved activity edit | Require current valid K, same requested day, and exact observed-value match | Persist explicit field target based on current record. On mismatch preserve K, show latest values for review and require a fresh action; on absent K remain memory-only/off, never recreate consent |
| Memory-only edit | No storage write; if date changed, reset old selections first | Feasible even without coordination; background cleanup must use protocol and never turn memory edit into enable |
| Explicit disable / today erase | Capture disable/erase intent; do not reinterpret as enable after rollover | Remove current K under lock, verify null; disable retains current-day memory; erase resets it. A later explicit enable may legitimately create K |
| Failed save recovery | Keep same lock through readback and any cleanup | Preserve baseline fail-closed cleanup intent: attempt verified removal of failed operation state, return off-here warning even if cleanup succeeds. No other cooperating writer can intervene until release |
| Erase-all today step | Invoke ordinary R01 erase after history operation releases H | Per-key result only; no R01 lock held while awaiting history |

On a stale-edit conflict, return the current stored record and a conflict notice, but
never replay the old snapshot or silently retry it. A fresh user action after reviewing
current data can change it. This deliberately replaces current last-write-wins stale
snapshot behavior; Architect approval is required.

### Rollover UI versus existing saved consent

Separate persisted consent from local UI attachment. Recommended date-transition
behavior: reset the stale tab's selections and local saving to off; preserve a valid
current-day K; announce that a current-day saved record exists and can be explicitly
restored by choosing saving. Keep a page-local rollover-detached latch so a delayed
storage event cannot immediately undo that off state. Explicit enable attaches to the
existing record without replacement. Ordinary fresh mount/restoration can still restore
existing current-day consent; this does not create consent. Explicit erase remains
available through the lock. The latch stores nothing persistently.

This is a proposed amendment to automatic cross-tab UI restoration, NOT an established
behavior. It satisfies the literal local-UI interpretation of “rollover must not silently
enable saving.” The Architect may instead approve immediate restoration of independently
granted current-day consent, with explicit restored-consent messaging. Implementation
must not choose between these interpretations silently. No copying of yesterday's
values is allowed in either interpretation.

### Pending operations and lifecycle

Capture desired enable/disable and activity target at the event, not a toggle to be
reinterpreted after waiting. Mark pending persistence as unconfirmed. Keep an in-memory
revision, alive flag and cancellation state; suppress outdated UI results AND cancel
obsolete mutation requests before they enter the lock. Suppressing UI alone is not
cancellation. Use AbortSignal for waiting R01 requests and an explicit cancellation
check at callback entry. Already executed storage effects cannot be undone by abort.

One persistence intent per component is sufficient. While waiting, allow memory editing
by explicitly detaching/cancelling the pending persistence intent; these edits must not
be silently enqueued for later saving. Disable duplicate save submissions. Pagehide,
unmount, date change, local revocation and detected conflicting storage events invalidate
older intents. Matching storage events schedule a fresh coordinated read; event.newValue
is not storage authority. Coalesce background reads rather than creating an unbounded
queue. No deadline guarantees are proposed: a held lock leaves persistence pending,
with a visible notice and a way to continue memory-only/cancel; no stealing or bypass.
The exact wording/control layout requires later UI implementation approval.

## Coordination unavailable, rejected or indefinitely pending

| Policy | Consequences for privacy, consent, bytes and use | Assessment |
| --- | --- | --- |
| Fail closed for all R01 storage access/mutation; keep memory use | No restore-as-enabled, save, automatic cleanup or app deletion without the lock. Warn that old/current bytes may remain and direct to browser site-data controls. Memory works; cannot claim erased or expired bytes | RECOMMENDED; requires explicit availability/retention policy approval |
| Continue uncoordinated with warning | UI can save/delete, but stale cleanup/data loss and consent races remain; warning does not enforce invariants. Memory works | Reject as satisfying this design |
| Only explicit uncoordinated deletion | Can remove bytes without creating consent, but races with cooperating writers/readback and can invalidate the serialization model. Memory works; success is only instant readback, not persistent revocation | Defensible only as separately labeled emergency policy outside guarantee; not recommended |
| Read-only access without lock | Could show stale saved values while withholding writes; creates consent/status ambiguity and cannot safely perform validation cleanup | Unnecessary for minimal design; recommend off-here without restoring |

Unavailable API or request rejection: terminate attempted persistence, keep local saving
off, do not fall back to unlocked E/W, and show coordination/storage-unverified warning.
Previously saved bytes may remain, including beyond their nominal day. Explicit app
erase cannot report success; browser site-data controls are the recovery path.
If a request remains pending, no mutation happens before acquisition; retain a pending
notice, allow cancellation/memory-only use, and do not claim success or schedule an
unlocked timeout fallback. A rejected/aborted request must not later commit; test this.

A storage exception/silent failure after successful acquisition is different from
missing coordination. Keep lock ownership through attempted recovery and verification,
return error/off-here, and warn that bytes may remain. Recommend a page-local error
latch preventing automatic same-page restoration after unverified deletion/write;
explicit recovery or remount may still encounter valid surviving consent bytes.
This is an additional proposed UI recovery policy requiring approval, not a durable
revocation mechanism. Do not promise a transaction
rollback or physical deletion. A truthful storage API is a guarantee assumption;
readback cannot prove disk durability or defeat a deliberately lying implementation.

**Product change:** R01 persistence currently works without Web Locks. The recommended
policy makes persistence and app-mediated cleanup unavailable in that environment,
while keeping the basic check-in usable. This is not justified merely by R02 precedent.
It trades availability/immediate cleanup for consistent cooperating-tab protection.

## Consent and retention invariants

| Invariant | Proposed enforcement / explicit limit |
| --- | --- |
| Stale tab cannot overwrite a valid newer current-day value | Inside-lock reread plus observed-value check; enable preserves an existing valid value. Different current values cause conflict, not overwrite. Equal-byte ABA is not detectable |
| Automatic stale cleanup cannot delete a valid newer current-day value | Cleanup decides from K inside same lock used by all writers, with current-date validation; never from old memory |
| Revoked consent cannot be recreated from stale memory | Ordinary edit never creates missing K; current valid consent required inside lock. Explicit new enable is a distinct action. Persistent revocation epochs are not represented |
| Rollover does not silently enable saving | Recommended off/reset plus local detach latch; valid other-tab bytes preserved. Restoration interpretation is an Architect decision above |
| Enabling remains explicit | Only explicit enable may create absent consent; background reads/cleanup and checkbox edits may not |
| Memory-only use remains feasible | No lock required for pure local selections; cancellation/detachment avoids delayed saving |
| Old-day data remains subject to cleanup | Accessible, acquired protocol removes invalid/expired K; no retained history/new date field. Suspended/unavailable/pending conditions defer removal and must be disclosed |
| Explicit deletion is truthful | Success only after D and null readback inside lock; failures off-here with remaining-bytes warning. No guarantee against a later explicit enable |
| No new persistent identifiers/retention fields | Existing K and four-field schema unchanged; lock name, revisions, comparison bytes and cancellation state are ephemeral |

Impossible combinations must be returned for decision: unconditional cleanup while
coordination is unavailable versus no uncoordinated deletion; stale-save rejection
across indistinguishable consent epochs versus no durable epoch information; immediate
all-tabs UI consistency versus asynchronous events; atomic erase-all versus unchanged
sequential two-key behavior. These are not silently resolved here. Wrong dates still
can discard data; the lock is not a clock/calibration mechanism.

## R02 / erase-all and deadlock analysis

R02 uses `smile-track:routine-history` (H), reads and mutates H's key under it, and
has an existing direct explicit-erase fallback when the API is absent. Rejection
returns failure; no timeout is present. `History.run` uses revisions/alive guards for
UI, and an error latch stops automatic restoration in that component. Root retention
can still independently read/prune history. None of these R02 behaviors changes here.

Recommended erase-all sequence remains **H operation completes and releases; then R
operation acquires and releases**. Never hold both. Do not wrap resetAll around H
and then call historyOperation, which would reacquire the same exclusive lock and
self-deadlock. No nested acquisition is needed for per-key erasure. R-only operations
never wait for H; H-only operations never wait for R. Thus there is no two-lock cycle
introduced by the recommended contract. A future joint design would need one global
order H then R and redesigned held-lock helpers, but is not selected by this task.

Current resetAll disables controls while awaiting history. If H never resolves, R
is never attempted; if R waits indefinitely after H succeeds, history is gone but today
may remain. Do not claim both erased. After completed partial failure, attempt/finish
the other step as the sequential contract allows, then report which result was
verified and direct to site-data controls. No rollback can safely recreate deleted
consent. R02's absent-lock erase fallback may succeed while recommended R01 deletion
fails closed: this asymmetry requires a truthful partial-result notice.

The proposed independent R01 lock does not make erase-all globally atomic. Another
tab may explicitly re-enable history after H releases and before R completes. A
success result can mean only both removals were individually verified, not both keys
remain absent at completion or afterwards. **P01-02 remains UNRESOLVED RISK**. The
Architect must accept that bounded meaning/copy or commission separate erase-all
work. Do not silently change R02, add both-lock acquisition, reorder erasure, or call
this an erase-all fix. Improving memory usability while H is indefinitely pending
would touch the existing cross-feature busy/cancellation contract and is a separate
explicit scope decision; memory usability here is guaranteed only for ordinary R01
use and pending R01 operations, not an already-pending unchanged erase-all UI.

## Explicit interleaving traces

A valid new-day value is N; an expired value is O; empty is null. These are conditional
protocol proofs assuming correct participating clients, matching date interpretation,
truthful storage and granted locks. They are not executed browser evidence.

| Case | Serialized trace and expected result |
| --- | --- |
| A: stale observation, then B write, then A cleanup | A sees O outside lock or in memory; B acquires R, explicitly saves/verifies N, releases; A acquires R, discards earlier observation, reads N and performs no D. N remains byte-identical |
| A: A acquires cleanup first | A reads O and removes/verifies it while holding R; B cannot commit inside that interval. After A releases, B explicitly enables N. If B's request was ordinary edit of expired consent, it must refuse instead. Final N only with fresh explicit consent |
| B: new write before stale wake/read | B saves N under R; A wakes with old memory, acquires R, reads N and preserves it. A resets/detaches stale UI; no S/D from stale memory |
| Two saved edits based on X | First matching operation commits Y; second reads Y, sees mismatch with X, rejects stale snapshot and requests review. No lost update by blindly applying both full snapshots. If first is a no-op byte-identical X, second may proceed |
| Save versus today erase | Save first then erase: null. Erase first then stale ordinary edit: null/off. Erase first then fresh explicit enable: new record is allowed; not persistent revocation |
| Rollover versus explicit erase | Rollover sees valid N and preserves, then erase removes; erase first leaves null, later rollover creates nothing. Expired O may be removed by either; readback governs status |
| Failed save versus successful peer write | A holds R through failure/readback/cleanup; B cannot save until release. B later explicitly enables N, which A cannot delete after release. If B's save was first, A's stale edit conflicts before writing. No catch/finally cleanup may execute after releasing R |
| Revocation versus stale edit | D completes under R; queued edit rereads null, refuses S, goes off. If a later explicit enable restored identical bytes, epoch identity is unknown (ABA boundary) |
| Operation queued across midnight | Requested day no longer matches acquisition day: cancel enable/edit, reset stale memory, fresh coordinated cleanup only; do not save yesterday or silently create today's consent |
| Storage event before queued operation | Invalidate/cancel obsolete request, then reread under R; current bytes govern, not event payload. No late mutation from an invalidated request |
| Storage event after queued operation | Operation independently rereads under R and enforces conflict/date/consent checks; later event triggers read only. UI revision guards suppress obsolete completions |

Readback does not extend lock protection beyond release. Successful writes and explicit
erasures may be superseded by later valid explicit actions. Older builds and external
writers can violate these traces because they do not acquire R.

## Deterministic future acceptance-test design (not implemented)

Run in provisioned GitHub Chromium, desktop/mobile, with existing checks unchanged
except separately approved assertions for intentional policy changes. Tests must run
through the component and real storage/lock APIs; source extraction alone is not
acceptance. No arbitrary sleep establishes ordering. Use Playwright clocks, controlled
same-context pages and a test-holder page acquiring real R/H locks with explicit
release promises. Poll lock queue/grant barriers and observable storage, not timing.

Block delivery to the stale tab's application storage listener with an init-script
capture listener, then explicitly release/dispatch controlled notifications; record
that this is deterministic event suppression, not natural event scheduling evidence.
Freeze/advance clocks without running timers to retain old memory; dispatch focus or
invoke a checkbox/consent action to cover refresh and rollover separately. For the
inside-lock boundary, a test-only lock callback wrapper may expose a grant barrier
before the app callback, without changing production code or splitting synchronous
getItem/removeItem into a fake atomic API. Query pending locks to demonstrate B cannot
acquire while A holds R. Use fault injection scoped to K, delegating all other keys.

Notation for the matrix: X = today true/false; Y = today false/true; O = yesterday
true/true; H0 = valid enabled history. Exact four-field JSON strings are compared.
R free unless otherwise stated. OFF means local saving unchecked, not a claim that
bytes are absent. RE = explicit re-enable/restore action. Status labels below are
semantic assertions for later approved copy, not strings shipped by this task.

| ID / initial bytes and tab state | Lock / deterministic scheduling and actions | Expected final bytes | UI consent and status |
| --- | --- | --- | --- |
| T01: O; A yesterday/on, B today/off | A stale pre-observation; block A storage events; B explicitly saves Y under R; A focus-refresh, then repeat with action-rollover on a fresh fixture | Exactly Y; no A S/D | A fresh/off and saved-record-exists review notice (a new activity click may change memory only); B on/Y; no yesterday values or new consent |
| T02: Y; A yesterday/off or on | B's save barrier completes before A wake; exercise timer, focus, visibility, nonpersisted pageshow and interaction paths separately | Exactly Y | A reset/off under proposed detach policy; no false erase/saved claim |
| T03: O; A stale/on; B explicit enable ready | Hold A's granted R before callback; queue B; release A then B; also reverse grant order | Y after explicit B enable in both schedules | A reset/off, B on; queue evidence proves B could not write between A's validation and D |
| T04: X; A/B attached X, differing edit targets | Hold R, queue A then B, release; repeat reverse order; suppress events to keep second stale | First changed value only; second rejected, exact bytes retained | Winner on/saved; loser shows current values and conflict/review, no stale success |
| T05: X; A attached edit, B erase | Holder orders edit then erase, then fresh fixture erase then edit | Null in both | Eraser off/verified; stale editor off if erase first, later notified off otherwise |
| T06: X; A stale yesterday, B explicit erase | Queue rollover then erase and reverse | Null | A fresh/off; B off/verified; neither recreates consent |
| T07: X; A attached; B revoke | Revoke completes before stale edit grant; suppress event to A until after | Null | A off/memory-only, consent-removed notice; no successful save |
| T08: O; A yesterday enable/edit intent queued | Hold R, advance A/B clock across midnight, release | O cleaned to null if accessible; if B has independently saved today Y, Y preserved | A fresh/off, date-changed review notice; no backfill/new consent |
| T09: X; A restoring or editing | K getItem throws under granted R; no external mutation | Exactly X; initial authoritative read failure must not mutate | A off/unverified-storage warning; no saved/erased claim; memory usable |
| T10: X; A matching edit | K setItem throws; fault-free remove/readback; B explicit enable queued behind A | Null after A recovery, then exactly Y after B explicit enable | A off/error despite cleanup success; B on/saved; no later A cleanup |
| T11: X; A matching edit | K setItem silently ignores; readback detects mismatch; removal works; then B enable | Null after A, then Y | Same as T10; no success from silent write |
| T12: X; A explicit erase | K removeItem throws, reads truthful; release R | X | Off-here; deletion-unverified/bytes-may-remain; never erased |
| T13: X; A explicit erase | K removeItem silently ignores, reads truthful | X | Same as T12; readback catches silent removal |
| T14: X (repeat O); A fresh/memory | navigator.locks unavailable; attempt restore, enable, edit, erase, expiry | Exact original X or O untouched | Off; coordination-unavailable and retained-bytes/site-data notice; memory editing works |
| T15: X; A attached | R request rejects before callback; exercise save and erase | X | Off-here/error; no unlocked fallback or later mutation |
| T16: X; A pending edit/erase | Holder keeps R; verify pending; continue memory-only cancels; release holder afterwards | X; cancelled request cannot later mutate | Pending then off/memory-only/cancelled notice; no premature success |
| T17: Y; A yesterday; delayed wake | pagehide/persisted pageshow plus stale timer/focus variants; hold R during wake | Y | Fresh mount may restore existing consent; stale rollover-detached page remains off pending RE; no stale values |
| T18: X; A edit pending, B changes to Y | Deliver event before A grant and after grant in separate controlled fixtures; match key and null-key clear | Y retained on conflict, or null retained on clear/revocation | No obsolete completion overwrites newer UI; conflict/off as appropriate; no stale save |
| T19: K=X, H=H0; erase-all | Hold H, start erase-all; confirm no R held/requested until H settles; release H then hold R before today erase | H null; K X while R pending, then K null | Pending/partial status while waiting; off and per-key verified after both; never premature all-erased |
| T20: K=X,H=H0; erase-all | H removal fails but completes; R removal succeeds; repeat H success/R failure | First H0/null; second null/X | Both local options off-here; explicit partial failure/remaining-bytes notice |
| T21: K=X,H=H0; peer history enable | H erase releases; peer explicitly enables H before R erase completes | K null; H enabled again | Do not assert both globally absent; per-operation result only; documents unresolved P01-02 boundary |
| T22: Independent R01/R02 fixtures | Run existing history suite unchanged; record history explicitly; R01 edits/erase/rollover, then history-only erase | Owned scopes unchanged; checkbox edits never rewrite history | Independent consent, seven-day behavior, warnings and snapshot semantics preserved |
| T23: X; stale A intent; B erase then explicit re-enable exact X | Hold A; B D then explicit X under R; release A | Observational equality may allow A's pending edit | No epoch-level acceptance claimed; requires Architect decision, not disguised as passing revocation test |
| T24: Y from B; A memory differs/off | Explicit enable in A while Y exists; then repeat missing K | Existing Y preserved; absent case saves only explicit same-day A values | Attached to Y with restored-existing notice; absent case on only after verified explicit save |
| T25: X; A failed write plus failed removal | Scoped write/readback failure, removal failure; later lifecycle refresh | Bytes possibly X or unverified write value; never claim absent | A off-here/error latch; no automatic same-page re-enable; remount surviving-byte limitation disclosed |

T01/T02 must fail against the original unconditional implementation at exact-byte
preservation assertions and pass against the eventual fix. T03 must demonstrate the
coordination boundary, not merely a pre-delete read. Test B before and after A's actual
acquisition. Add missing/invalid/current/expired combinations and both initial A saving
states. Check activity values, date, consent, warnings, write/removal counts, untouched
history and unrelated keys. T04/T07/T23 separate stale-value protection from the
unresolved epoch/consent issue. Any additional privacy defect discovered during later
implementation must trigger its authorized stop conditions, not expand scope silently.

Existing normal midnight cleanup, malformed/future cleanup, explicit disable/erase,
read/write/remove denial, memory navigation, history independence and retention tests
remain required. Existing tests are not proof of proposed behavior. A design approval
must specify amendments for any assertion that conflicts with an approved new fallback;
do not weaken expectations merely to make a suite pass.

## Guarantee boundary and residual risks

Within the proposal's guarantee: current-version cooperating clients, same storage
bucket and lock manager, all K operations using R, consistent local-date interpretation,
correct operation guards, available/granted locks and truthful storage calls. In this
boundary a stale automatic cleanup cannot remove a valid current-day value written by
another participant: it either runs before that write or reads/preserves it after.
Distinct newer values are not overwritten by stale snapshot edits. This is cooperative
serialization with application checks, not universal atomicity or transactional rollback.

Outside or conditional: older Smile Track tabs, same-origin scripts ignoring R,
DevTools/user changes, extensions, browser sync/restoration, browser bugs/process
failure, differing or incorrect clocks/timezones, unsupported locks, rejected/pending
requests and throwing/silent/lying storage. Error paths are handled honestly but cannot
guarantee persistence, deletion or durability. A crash after S before readback can leave
bytes; failure after a removal cannot be undone. No universal cross-browser, security,
privacy or clinical certification is claimed. V01 remains parked.

Legacy tabs are a deployment hazard even though no deployment is authorized: a future
rollout must account for old open pages. A new lock name does not fence them out.
Do not add a new persistent version marker or migration here. P01-03 through P01-06
limitations remain; P01-07 remains unresolved and P01-08 unreviewed. The exact-byte ABA
limit, sequential erase-all race and indefinitely pending H operation are explicit
P01-02 dependencies, not resolved by this proposal.

## Architect decisions and smallest later implementation boundary

1. Approve or reject dedicated R01 `smile-track:routine` covering ALL K operations.
   One mechanism can cover them; protecting only rollover is insufficient.
2. Approve fail-closed R01 persistence AND app erasure when coordination is unavailable,
   rejected or cancelled, with memory-only use and retained-byte warnings. This changes
   availability and delays cleanup, even though nominal same-day retention is unchanged.
3. Decide rollover local UI restoration: recommend reset/off plus ephemeral detach latch
   and explicit reattachment to preserved today data. Approve truthful copy accordingly; also approve the proposed page-local failure latch/recovery policy.
4. Approve conflict rejection for stale different-value edits and explicit-enable
   preservation. Decide whether the undetectable identical-byte consent-epoch case is
   an accepted boundary or requires separate P01-02/schema investigation. Do not claim
   durable revocation across a later explicit re-enable without such a decision.
5. Retain sequential H-release-then-R erase-all and approve per-key outcome wording,
   or issue a separate P01-02 task. No nested locks in the recommended design. Decide
   separately whether pending-H cancellation/memory usability warrants broader scope.
6. Approve deterministic future browser acceptance cases before implementation. Both
   race orderings are protected under the stated contract, contingent on these choices.

Smallest proposed later scope: `app/routine/storage.ts` and `check-in.tsx` for the
central async R01 boundary, intent/date/conflict checks, internal failure cleanup,
UI revisions/cancellation, rollover attachment policy and truthful statuses;
`tests/routine.spec.ts` for deterministic R01/interaction acceptance; a new correction
report plus additive state/roadmap/validation entries. Keep schemas/keys, dependencies,
CI, R02 storage/UI/tests and root history retention unchanged. The existing History
ref can supply the sequential H result; no R02 lock refactor is needed for that contract.
If truthful cross-feature copy or pending erase-all UI requires changing history.tsx,
request that exact scope separately rather than editing it under this recommendation.
No implementation task is authorized by submission or acceptance of this design alone.

## Validation and preserved boundaries

Required validation uses the existing lockfile/scripts and CI workflow unchanged.
Scope checks compare every other tracked blob and file mode with the exact baseline,
verify historical bodies verbatim, relative links and `git diff --check`. The handoff
records exact head/tree and fresh CI run/job IDs after observation. No proposed test
case above has been added or executed as a new regression by this task.

R01/R02 production behavior and P01 findings remain unchanged. E01 publication controls
and both empty registries remain unchanged. C01 remains Owner-blocked/incomplete.
F02 remains internal-only. Stage 09C remains CLOSED/frozen `OUTWARD_PROVISIONAL_V1`.
No browser provisioning, V01 continuation, V02/R03, scientific integration, dependency,
governance, deployment or unrelated product work was undertaken.

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
