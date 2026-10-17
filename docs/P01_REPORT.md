# P01 — Browser-Local Data Privacy and Failure-Mode Review

Review date: 2026-10-17 UTC (begun 2026-10-16 America/New_York).
Status: source review submitted for Architect disposition; no remediation authorized or implemented.

## Scope and exact baseline

Repository: `mcpf8hwgyb-ship-it/smile-track`. Reviewed baseline/main:
`afd9e2dc388adff10db9bb3187dae1e9edd4902b`; baseline tree:
`bdc3b997f798494e38cc0295af2fe8471dcc0555`.
Live GitHub reads confirmed this main SHA, active `24954073 — G01-main-protection`,
and no open PRs before P01. The authoritative current-state/roadmap identify V01 as
**BLOCKED / INCONCLUSIVE and PARKED**, not an active product task. This is evidence
from repository state, not an assertion about undisclosed work elsewhere.

Only this report, CURRENT_STATE, ROADMAP and VALIDATION_LOG change. Historical
bodies are preserved. No production source, test, schema, dependency, workflow,
registry, governance setting or scientific artifact is changed.

## Methodology and evidence limits

Read the complete [R01 storage implementation](../app/routine/storage.ts),
[R02 storage implementation](../app/routine/history-storage.ts),
[check-in component](../app/routine/check-in.tsx), [history component](../app/routine/history.tsx),
[root retention component](../app/routine/history-retention.tsx),
[root layout](../app/layout.tsx), [R01 tests](../tests/routine.spec.ts) and
[R02 tests](../tests/history.spec.ts). Followed their imports/callers, all application
routes/navigation/styles, education catalog wiring, static-export configuration,
preview server, package scripts, required CI, and existing R01/R02/V01 reports.
Code locations below use baseline file names and exact symbols/test titles so they
remain identifiable independently of documentation line-number changes.

This is **static/source review, not independent browser validation or security
certification**. Existing Chromium tests are regression evidence for their explicit
assertions. They do not prove all scheduling, lifecycle, storage, browser-engine,
network or hostile-script conditions. P01-01 includes a conditional source-path
exercise using synthetic values and the exact extracted refresh function; it does
not establish natural multi-process event ordering or frequency in a browser.
No real user entries or restricted scientific assets were used. No browser was
provisioned and V01 was not reactivated. Neither findings nor CI are privacy,
security, accessibility, scientific, medical or clinical certification.

## Data inventory and lifecycle trace

| Owned key / coordination name | Exact logical schema | Consent and lifetime |
| --- | --- | --- |
| `smile-track:routine:1` | `{ version: 1, date: string, brushedTeeth: boolean, cleanedBetweenTeeth: boolean }` | A valid record for the current local date represents today-only saving consent. No separate persisted flag. One JSON value; no historical list. |
| `smile-track:routine-history:1` | `{ version: 1, enabled: true, entries: Array<{ date: string, brushedTeeth: boolean, cleanedBetweenTeeth: boolean }> }` | Explicit, independent history consent; up to seven unique dated entries. The empty enabled record can remain indefinitely; entry retention is rolling, not consent expiry. |
| `smile-track:routine-history` | Web Locks coordination name only | Constant origin-scoped lock name. **Not a storage key, persisted identifier, user ID or device ID.** |

Dates use local calendar getters in `storage.localDate`, not UTC truncation.
R01's parser requires exactly its four keys, version 1, today's date and booleans.
R02 requires exactly three top-level keys, `enabled: true`, version 1, at most seven
entries and exactly the three entry keys. Calendar validation rejects impossible
dates. Duplicate or future dates invalidate the whole history; stale eligible-format
entries are pruned, not treated as evidence of missing oral care. Neither schema
contains names, identifiers, symptoms, notes, images, treatment or clinical fields.
There is no app-defined encryption or authentication envelope.

### R01 trace

1. `CheckIn` starts with null component state; `restore()` reads the owned key after
   mount. Missing data becomes `fresh()` in memory, saving off. Valid same-day data
   restores values and consent. Invalid data triggers verified deletion. Read denial
   gives fresh memory state and the storage warning.
2. `select()` calls `rollover()`, independently toggles a boolean and publishes memory
   state. With saving off it does not write. With saving on it rereads/validates the
   owned key to notice revoked consent, then calls `save()`; this sequence is not locked.
3. `toggleSaving()` explicitly opts in by saving the current record. Saving serializes
   the record and verifies exact string readback; a thrown or silent write failure
   attempts erase and returns false. Saving off removes the key, retains current
   memory selections and reports a warning if deletion is unverified.
4. `parseRecord()` validates but does not canonicalize storage on reads. A later save
   serializes the current record; valid differently ordered JSON is accepted.
5. `rollover()` and `refresh()` clear the shared key when the **in-memory** date differs
   from the local date, then reset consent and values. The stored record's own date is
   not checked before this removal: P01-01. A timer runs at most 60 seconds apart, or
   at local midnight; focus/visibility/pageshow can refresh. Suspended execution and
   closed pages cannot actively expire bytes.
6. `storageChanged()` restores on the owned key or a null-key clear event. `pagehide`
   resets memory; persisted `pageshow` restores saved state. Listeners/timer are cleaned
   on unmount. There is no R01 reader/expiry component on Home or Learn; old today-only
   bytes can remain until Routine executes or site data is cleared.
7. `reset()` erases only the today key and resets memory. Failed deletion switches UI
   saving off but bytes may remain. Reload or a later matching storage event can read
   those bytes as consent again. No durable revocation marker exists. This is covered
   by the residual-data warning, not guaranteed deletion.

### R02 trace

1. `History` initially shows history off. `run("read")` restores valid stored consent;
   it never imports the R01 key. Merely editing the current checkboxes does not call
   a history write. Separate explicit enabling is required when no valid history exists.
2. Every supported operation acquires `navigator.locks.request(HISTORY_LOCK, ...)`
   and reads current storage inside the lock. Invalid non-null data must be removed
   successfully before proceeding; otherwise the operation fails closed.
3. `enable` is idempotent: preserve the valid enabled, pruned history read under the
   lock. Create `{ version: 1, enabled: true, entries: [] }` only if none exists. This
   preserves another tab's entries and surviving bytes after failed deletion. It is
   not R01 migration or retrospective reconstruction.
4. Only `record` adds/replaces an entry from the explicit current record argument.
   It requires stored consent and rechecks the record date **after lock acquisition**.
   A stale queued record after deletion sees no history and cannot recreate it. A
   record queued across midnight is refused rather than backfilling yesterday.
5. `parseHistory` constructs canonical objects, filters to current/prior six local
   calendar dates and sorts descending. `historyDays()` subtracts calendar days at
   local noon, avoiding elapsed-24-hour DST arithmetic. Read/enable/record writes only
   if canonical serialization differs, and verifies exact readback. Thus a read can
   mutate already-consented history for pruning/canonicalization, but cannot create
   missing consent or add an entry. A date-mismatched record returns before writing
   its pruned result; a subsequent read is needed to persist that pruning.
6. `erase` removes only history and verifies null readback. Exceptions/readback mismatch
   return history null and an explicit warning that saved data may remain. A failed
   history operation latches `blocked` in that component, suppressing automatic reads;
   explicit re-enable, remount or another tab can still encounter surviving bytes.
7. Routine refreshes history on timer, storage event, focus, pageshow and visibility.
   `revision` suppresses obsolete UI results from earlier actions; `alive` suppresses
   updates after unmount. These do not cancel an already queued storage operation.
   Root `HistoryRetention` is wired in `layout.tsx` for **all routes**, including Home
   and Learn: it calls read on mount/pageshow/focus/visibility, returns no markup and
   discards notices. It has no interval or storage-event listener. It can prune or
   canonicalize existing history outside Routine; it cannot enable absent history.

## Consent, deletion, retention and concurrency analysis

Consent is independent per key and shared by same-origin browser-profile tabs,
not per person. An R01 save can coexist with an older explicit R02 snapshot; the
history UI announces differing selections instead of silently replacing the snapshot.
No record is distinguished from recorded false/false; neither means oral care failed.

Today-only erase resets checkboxes and today-only consent, leaving history unchanged.
History erase leaves today's state unchanged. `resetAll()` disables current controls,
awaits history erase, then removes today-only storage and resets memory. It reports
success only if both calls verify removal. This is **two separate removals**, not an
atomic transaction or a guarantee against later concurrent writes. Unrelated keys are
untouched. A failed first removal does not prevent trying today deletion after it
returns. An indefinitely pending history lock delays that second attempt (P01-05).

The history lock serializes cooperating app operations, including deletion. It does
not serialize R01, DevTools/extensions, external scripts that ignore the lock, or
browser sync. If an explicit enable is ordered after successful history erase, it can
legitimately establish new consent; the stale-record protection is not a persistent
ban on future enabling. Same-day explicit history snapshots are last-write-wins.
R01 similarly has documented last-write-wins limitations, without an atomic transaction.

Absence of Web Locks refuses history reads/writes and warns that prior history may
remain. An explicit erase still tries direct verified removal in this absence case.
A rejected `locks.request` returns the general warning; it does not reach that fallback.
There is no lock-free recording path, timeout or abort signal. Normal lock callbacks
perform only synchronous local work; a normal-operation deadlock was not demonstrated.

Clock/timezone truth is delegated to the device. Moving backwards may turn valid
stored dates into rejected future dates; moving forwards can permanently prune
records. The app cannot infer the user's true civil date or reconstruct deleted data.
A closed/suspended app, inaccessible storage, unavailable locks or pending lock can
leave bytes beyond the nominal window. Seven days bounds validated entries, not all
physical copies or the duration of the enabled-consent flag.

## Exposure model and reachable network paths

Traced checkbox handlers into React state, JSON serialization and the two localStorage
keys; traced explicit history recording into the same local sinks and neutral DOM
text. The authored reachable application has no fetch, XHR, beacon, WebSocket,
EventSource, service worker registration, cookies, sessionStorage, form submission,
server action or API route carrying these values. No routine value is interpolated
into a URL, link, metadata, image or remote script. Navigation uses fixed local anchors.
The root retention reader has no network sink. Learn reads empty production registries
at build time; it does not import routine values. Static export has no runtime backend.
The local preview accepts GET/HEAD for static assets and is not production hosting.

This supports **no identified authored value-to-network path**, not an unconditional
proof that entries cannot leave a browser. Framework/runtime dependency internals were
not exhaustively audited, arbitrary compromised scripts can read the origin's storage,
and extensions/browser backup/sync/OS access are outside the application boundary.
A future host or injected script could change that boundary. Ordinary page/asset
requests disclose navigation/request metadata to their serving origin, although the
reviewed application does not attach routine values to them. Build-time Next telemetry
is distinct from browser routine processing; required CI disables it. No telemetry
path receiving routine state was found.

Existing tests capture page requests during selected scenarios: same localhost origin,
GET, null body and no activity field names in URLs; cookies/sessionStorage are also
checked. They do not inspect every encoded value, every execution path, browser-level
sync traffic, external extension traffic or arbitrary future hosting. Therefore the
absolute UI claim “entries are not sent anywhere” has the residual assurance gap in
P01-07. No actual transmission or disclosure was demonstrated by this review.

## User-facing accuracy review

| Actual UI statement / area | Comparison with source and evidence |
| --- | --- |
| Default selections stay in page memory and disappear on leaving/reloading | Supported for absent consent by mount/unmount/pagehide behavior and R01 navigation test. Valid previously saved data restores. Full BFCache/process-discard behavior is not independently validated (P01-08). |
| Save only today's check-in, new local day clears it | Current-date validation and rollover support intent; deletion is execution/access dependent, Home/Learn do not read R01, and stale-tab rollover can delete valid new-day data (P01-01/04). |
| Browser/device profile and shared users | Accurate storage scope, not a private account boundary or encryption promise (P01-06). |
| History is separate; enabling does not copy a check-in | Supported: enable receives no R01 entry. Existing valid history is preserved, not always emptied. |
| Explicit recording; checkbox edits do not update history | Supported: only record action creates a snapshot; differing selections are announced. |
| Current/prior six days; older removed when app next runs | Correct normal accessible-storage path; closed/suspended limitation is disclosed. Locks/storage failure and event timing can delay physical pruning (P01-04/05). |
| Erase scopes and “All routine data erased” | Success is verified per key at operation time, not atomic or forensic deletion. Failures warn and direct to browser controls (P01-02/03). |
| Saving/history “off here”; saved records may remain | Accurate failure warning. Surviving valid bytes can restore consent after remount/another tab; same-page history latch is not global revocation (P01-03). |
| Backups, extensions and synchronization outside control; not encrypted private storage | Accurate limitations; erasing app keys cannot revoke those copies (P01-06). |
| “Entries are not sent anywhere” (both components) | No authored transmission found, but literal all-runtime assurance exceeds static evidence (P01-07). Adjacent external-copy caveats narrow the practical interpretation. |
| Own records, not health/technique/frequency assessment; not dentist-reviewed or clinically validated | Consistent with boolean recording/display; no scores, recommendations, disease inference or clinical interpretation found. |

## Findings ranked by materiality

Priority is an Architect triage aid, not a clinical or quantified security severity.

| Priority | ID | Classification | Material issue |
| --- | --- | --- | --- |
| 1 | P01-01 | VERIFIED DEFECT | Stale R01 date refresh can delete another tab's valid new-day saved record. |
| 2 | P01-02 | UNRESOLVED RISK | R01 consent-check/write race and non-atomic erase-all boundaries. |
| 3 | P01-03 | VERIFIED LIMITATION | Failed erasure can leave bytes and consent can restore later. |
| 4 | P01-04 | VERIFIED LIMITATION | Device clock, execution and storage access bound retention guarantees. |
| 5 | P01-05 | VERIFIED LIMITATION | Lock availability/rejection/indefinite wait constrain cleanup and erase-all. |
| 6 | P01-06 | VERIFIED LIMITATION | Plaintext origin/profile storage and external copies are not private vault storage. |
| 7 | P01-07 | UNRESOLVED RISK | Universal no-transmission wording exceeds reviewed implementation assurance. |
| 8 | P01-08 | NOT_REVIEWED | Independent engine/lifecycle/host security and assistive-technology behavior. |

### P01-01 — VERIFIED DEFECT

- **Location:** `app/routine/check-in.tsx`, `refresh()` and `rollover()`; `app/routine/storage.ts`, `erase()`.
- **Evidence:** both date-change paths call unconditional key removal based only on
  `current.current.record.date`. Conditional source exercise below erased a valid
  synthetic new-day record even with stale tab saving false. Existing tests “local
  midnight expires memory and saved state without retaining consent” and “erasure
  in another tab disables saving here” test these areas separately, not this ordering.
- **Scenario/behavior:** A retains yesterday's memory state; B saves a valid today
  record; before A processes B's storage event, A's refresh/rollover observes a date
  mismatch and deletes B's current record without reading its date.
- **Consequence:** loss of a valid current-day user entry/consent across tabs, conflicting
  with expiry of the previous day's record. No network disclosure is implied.
- **Mitigation:** storage events often refresh A first; resetting stale state prevents
  retaining yesterday in the UI. Neither makes unconditional shared deletion correct.
- **Residual uncertainty:** the conditional code path is established; natural browser
  task ordering, suspension behavior and reproduction frequency remain unmeasured.
- **Architect decision:** disposition this lifecycle defect; consider separately
  authorizing a deterministic cross-tab regression and narrowly scoped remediation.
  No fix or new committed test is part of P01.

Conditional reproduction (run from baseline checkout; exact function extraction,
synthetic stand-ins for date/storage; not a full component or browser test):

```sh
node <<'JS'
const fs = require('fs'), vm = require('vm'), assert = require('assert');
const src = fs.readFileSync('app/routine/check-in.tsx', 'utf8');
const refresh = src.slice(src.indexOf('    function refresh() {'),
  src.indexOf('    function storageChanged'));
let bytes = JSON.stringify({version:1,date:'2026-10-17',
  brushedTeeth:true,cleanedBetweenTeeth:false});
const fresh = () => ({version:1,date:'2026-10-17',
  brushedTeeth:false,cleanedBetweenTeeth:false});
const current = {current:{record:{...fresh(),date:'2026-10-16'},
  saving:false,warning:''}};
vm.runInNewContext(refresh + ';refresh();', {current,
  localDate:()=> '2026-10-17', fresh,
  erase:()=> {bytes=null;return true;},
  publish:next=> {current.current=next;}, storageWarning:'warning'});
assert.equal(bytes, null);
assert.equal(current.current.saving, false);
console.log('Conditional stale refresh deletes valid new-day bytes');
JS
```

### P01-02 — UNRESOLVED RISK

- **Location:** `CheckIn.select()` consent re-read then `save()`; `resetAll()`; R01
  `save`/`erase`; [documented R01 concurrency limitation](R01_REPORT.md).
- **Tests:** ordinary cross-tab erase and history queued-erase tests exist; none
  deterministically interleaves R01 removal between consent re-read and write.
- **Behavior/scenario/consequence:** individual synchronous storage calls do not
  constitute an app transaction across tabs. A possible read-valid / peer-delete /
  stale-save ordering could recreate today-only consent. Erase-all checks history
  before today; another explicit enable between operations can create a new history
  record before the final success notice. The latter is new user consent, not itself
  proof of a violation; the combined operation has no global linearization guarantee.
- **Mitigation:** immediate pre-write consent read, storage-event restoration, history
  lock and per-key readback; current-page controls disabled during erase-all.
- **Residual uncertainty:** no browser reproduction of the R01 interleaving here;
  actual execution ordering matters. Do not report this as demonstrated resurrection.
- **Architect decision:** decide whether to authorize focused concurrency evidence and
  clarify the intended erase-all boundary before considering any production change.

### P01-03 — VERIFIED LIMITATION

- **Location:** R01 `erase`/`save`, `CheckIn.restore`/`toggleSaving`/`resetAll`;
  R02 `removeHistory`/`failure`, `History.run`/`refresh`, root retention reader.
- **Tests:** R01 get/set/silent-set/remove denial; R02 read/write/silent-write/remove/
  silent-remove; failed history update; partial erase-all; explicit re-enable after
  failed deletion. R01 silent-remove has readback handling in source but no dedicated
  test variant. Combined persistent multi-API failures are not comprehensively tested.
- **Behavior/scenario/consequence:** when removal/readback fails, UI turns saving off
  and warns, but bytes can remain. A later valid read after reload/other tab can restore
  consent. R02's blocked latch prevents automatic same-component re-enabling, not
  global revocation. Root retention can independently canonicalize surviving bytes.
- **Mitigation:** verifies null readback, catches failures, no false success notice in
  covered tests, explicit browser site-data instructions; no blanket deletion claim.
- **Residual uncertainty:** app readback is not forensic erasure of disks, backups or
  sync copies and cannot verify inaccessible storage. Adversarial mocked APIs could lie.
- **Architect decision:** accept this browser-local boundary or separately request
  more failure-combination evidence/copy review; do not claim guaranteed deletion.

### P01-04 — VERIFIED LIMITATION

- **Location:** `localDate`, `parseRecord`, `historyDays`, `parseHistory`, queued record
  date guard, CheckIn/History timers and HistoryRetention event listeners.
- **Tests:** midnight, spring/fall DST, Chromium CDP timezone change, stale/future/
  malformed inputs, Home/Learn reopening, queued history midnight refusal.
- **Behavior/scenario/consequence:** device time changes may discard otherwise useful
  data; suspended/closed execution cannot prune; inaccessible storage/locks can retain
  bytes. R01 cleanup is Routine-only; history consent can remain enabled with no entries.
  Date-mismatch early return does not immediately persist canonical pruning.
- **Mitigation:** local calendar arithmetic, strict dates, seven-entry/window bound,
  periodic/event reads and explicit closed/suspended/device-clock copy.
- **Residual uncertainty:** exact scheduling under process suspension and arbitrary
  timezone changes is not established by static inspection or the bounded tests.
- **Architect decision:** retain explicit execution/access limitations and decide if
  broader guarantees are wanted; do not infer them from nominal seven-day retention.

### P01-05 — VERIFIED LIMITATION

- **Location:** `historyOperation()` outer try/catch and `navigator.locks.request`;
  `CheckIn.resetAll()` await order; `History` busy state.
- **Tests:** missing-lock fail-closed, queued erasure, stale enable, queued midnight.
  Lock-request denial in the parked V01 harness is not executed cross-browser evidence.
- **Behavior/scenario/consequence:** missing locks refuse history writes; rejected lock
  requests warn without reaching removal; a held/unresolved lock has no app timeout,
  can keep controls busy and delay erase-all's today-key deletion. Existing history
  may remain. This is an API/coordination boundary, not a reproduced ordinary deadlock.
- **Mitigation:** short synchronous app callbacks, no lock-free writer, warnings on
  completed failures, direct verified history erase when the API is absent. R01's
  ordinary workflow remains independent except during the combined erase-all wait.
- **Residual uncertainty:** hung lock scheduling/engine behavior and hostile same-origin
  lock holders were not independently tested. A holder ignoring protocol is not
  protected against by cooperative locking.
- **Architect decision:** decide whether bounded failure/recovery investigation is
  needed; no fallback, timeout, production workaround or provisioning is authorized.

### P01-06 — VERIFIED LIMITATION

- **Location:** both storage modules' JSON/localStorage sinks; privacy copy in both
  components; root retention wiring in `app/layout.tsx`.
- **Tests:** no cookies/sessionStorage in selected flows; unrelated keys survive erase.
  Tests do not audit browser backups, extensions or profile access.
- **Behavior/scenario/consequence:** anyone with profile access or same-origin script
  execution can read/alter records. Extensions/backup/sync may copy values. App erasure
  cannot revoke external copies or prove physical disk deletion; navigation to Learn
  does not create an origin isolation boundary.
- **Mitigation:** minimal schemas, consent, owned-key erasure, no authored external
  processor, truthful shared-profile/no-encrypted-vault/backup-extension-sync warnings.
- **Residual uncertainty:** no host, OS, browser-profile or extension security audit;
  no exploitation demonstrated and no approved production host exists.
- **Architect decision:** accept and retain these boundaries or commission separately
  bounded review before stronger confidentiality claims.

### P01-07 — UNRESOLVED RISK

- **Location:** CheckIn saving copy; History notice; reachable application sinks traced
  above; request assertions in the first R01 and first R02 browser tests.
- **Evidence/behavior:** no authored routine-value transmission path found. The wording
  “entries are not sent anywhere” is universal, whereas source/test evidence is bounded.
- **Scenario/consequence:** a reader could infer protection against browser sync,
  extensions or a compromised same-origin runtime, despite adjacent caveats. The review
  does not establish an actual outbound transmission, consent violation or disclosure.
- **Mitigation:** adjacent external-copy caveats, no authored network sink, selected
  request/cookie assertions, static architecture and no account/backend integration.
- **Residual uncertainty:** dependency/runtime and arbitrary hosting behavior were not
  exhaustively proved; request tests do not cover every encoded-value channel.
- **Architect decision:** decide whether to authorize narrower app-controlled wording
  or additional assurance evidence. No wording or production code is changed here.

### P01-08 — NOT_REVIEWED

- **Location/evidence:** pagehide/pageshow/visibility/storage listeners in both UI
  components and root retention; existing browser tests and [V01 continuation report](V01_CONTINUATION_REPORT.md).
- **Scenario/consequence:** genuine BFCache restoration, process discard, all engine
  security contexts, assistive technology and extension/browser sync behavior may
  differ from reviewed source intent or existing Chromium synthetic tests.
- **Mitigation:** lifecycle hooks, DOM status regions, existing Chromium navigation/
  keyboard/layout assertions. These are not independent real-device evidence.
- **Residual uncertainty:** Firefox/WebKit application validation remains unavailable;
  no claim of cross-browser compatibility, screen-reader or privacy certification.
- **Architect decision:** keep V01 parked; any further environment investigation or
  independent validation requires separate authorization. No such work began in P01.

## Unresolved questions and recommended Architect decisions

1. Disposition P01-01 as a source-established lifecycle defect and decide whether a
   separate regression/remediation task is warranted. P01 does not authorize it.
2. Decide the intended concurrent erase-all and R01 consent guarantees before
   requesting targeted runtime evidence for P01-02. Avoid calling it a proven leak.
3. Accept or request further evidence for P01-03 through P01-06, including failed erase
   revival, unavailable-lock cleanup and real clock/lifecycle behavior.
4. Decide the acceptable assurance scope of no-transmission wording (P01-07).
5. Preserve P01-08's unreviewed boundary and V01's parked disposition. No next product
   task is selected by this report.

## Validation and preserved project boundaries

The four-file scope, verbatim historical bodies, relative documentation links and
`git diff --check` are checked before submission. Required suite commands are run
without changed expectations: `npm ci`, `npm run lint`, `npm run typecheck`,
`npm run test:education`, `npm run test:f02`, `npm run build`, `npm run check:export`,
`npm run test:e2e`, `npm run test:smoke-sensitivity`,
`npm run test:education-sensitivity`, `npm audit --audit-level=high`.
The PR handoff records exact-head required CI run/job identifiers and observed results,
separately from local attempts. A passing pre-existing suite does not refute a finding
outside its coverage. Restricted-data F02 remains a skip, not a pass.

F01, F02 (internal feasibility only), E01, G01/G01-DOC, R01, R02/R02-DOC remain preserved.
Stage 09C remains CLOSED/frozen `OUTWARD_PROVISIONAL_V1`, with uncertainty and restricted
Dundee boundaries unchanged. E01 gates and both empty production registries are unchanged.
C01 professional review remains Owner-blocked and incomplete; it is distinct from the
historical R02 correction identifier. V01 remains BLOCKED / INCONCLUSIVE and PARKED.
No production remediation, lesson, reviewer appointment, deployment, V02, R03, new
retention, scientific change or unrelated task was undertaken.

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
