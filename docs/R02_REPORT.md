# R02 — opt-in seven-day routine history

Verification date: 2026-10-13. Architect-authorized scope; implementation submitted
for review before merge. No subsequent product task is authorized.

## Baseline and implementation

Verified main: `5c12d3c468582b3e86ceaa40dd96eba4b20fffc6`, the accepted R01 merge.
Branch: `r02-seven-day-history`. The final commit and exact-head CI are recorded in
the PR handoff; a commit cannot embed its own SHA. No stack/dependency change.

The existing static `/routine/` page has a separate history section showing the
current and preceding six local calendar dates, newest first. An absent entry says
**No recorded check-in**. A recorded entry labels each activity **Marked** or **Not
marked**. Neither absence nor an unchecked value implies oral care was not performed.
No health judgment, score, streak, target, reminder or clinical interpretation exists.

R01's current selections and history are deliberately separate: history contains
explicitly recorded snapshots, not automatically retained editor changes. The page
explains this before consent and announces when current selections differ from the
recorded snapshot. No two stores are silently synchronized or treated as interchangeable
consent. The same day's snapshot is replaced, not duplicated, when recorded again.

## Schema and independent consent

R01 key/schema remain byte-for-byte unchanged: `smile-track:routine:1`, containing
version, current local date and two booleans. It continues to expire its current-day
record/consent and default to page memory. R02 adds exactly one localStorage key:
`smile-track:routine-history:1`. Synthetic example:

```json
{
  "version": 1,
  "enabled": true,
  "entries": [
    { "date": "2026-10-13", "brushedTeeth": false, "cleanedBetweenTeeth": true }
  ]
}
```

No names, user/device IDs, notes, symptoms, images, diagnoses, procedures, timestamps,
extra consent tokens or clinical fields. Disabled history is represented by absence
of this key; an `enabled: false` record is invalid and removed. Validation requires
exact fields/types, supported version, valid calendar dates, no duplicate dates,
no future dates and at most seven entries. Invalid records fail closed as a whole;
valid but expired entries are excluded and pruned, preserving only eligible dates.

| Action | Today-only state | History state |
| --- | --- | --- |
| Default / no existing keys | Memory only | Off; no history writes |
| Save today's check-in | Explicit R01 consent writes current day | Unchanged; never implies history consent |
| Enable seven-day history | Unchanged; no R01 import/migration | Explicit consent writes an empty history record |
| Edit activity checkboxes | Existing R01 behavior; updates today-only storage only if consented | Unchanged; differences from saved history announced |
| Record today's check-in in history | Unchanged | Requires enabled history; explicitly snapshots current local date and selections |
| Uncheck today-only saving | Removes R01 key; keeps selections in memory | Unchanged |
| Erase today-only record | Removes R01 key, disables today-only saving, resets selections | Unchanged; UI states its scope |
| Uncheck history / Erase history | Unchanged | Removes history key and disables history |
| Erase all routine data | Removes R01 key, disables saving, resets selections | Removes history key and disables history |

Only the explicit record action creates a dated history entry. It can intentionally
record both values false, distinguishing that record from an absent day. Enabling
history never copies even a valid existing R01 record; older days cannot be entered,
reconstructed or backfilled. History consent survives midnight and an empty pruned
window until opt-out. R01 consent still expires each new local day independently.

## Retention and browser date handling

The seven dates use the device's local year/month/day and calendar subtraction at
local noon, not UTC-today truncation or repeated 24-hour subtraction. DST days need
not contain 24 hours. The parser rejects impossible calendar dates and future dates;
large clock/timezone changes can therefore discard existing records, not relabel them.

The Routine component reads/prunes on mount, local-midnight/minute timer, focus,
visibility, page restoration and storage changes. All operations also validate the
current date inside the lock. An application-level cleanup component reads/prunes
on application entry and focus/visibility/pageshow, including Home and Learn;
it renders nothing, enables nothing and never adds an entry. A queued record whose
captured date no longer equals local today is refused with a review-current-date
message. It cannot write yesterday after waiting across midnight.

A closed/suspended browser cannot execute deletion. Expired bytes may remain until
the application next runs; stale entries are never accepted as eligible history.
There is no historical archive, history export, cloud storage or recovery mechanism.
An entirely expired valid history becomes an enabled record with an empty array.

## Deletion, failures and tabs

Writes and removals are verified by reading back the owned key. Only the two routine
keys are touched; unrelated browser data is preserved. Erase-all attempts both keys
even if one fails and claims completion only when both removals were verified.
Storage getter, quota/write, silent-write, removal and silent-removal failures are
handled. Failed history saving disables history here and attempts removal; failed
erasure explicitly states that saved data may remain and directs the person to
browser site-data controls. After failure, automatic refresh cannot silently turn
history back on in that page. A later reload can see bytes the browser refused to
remove; the application cannot guarantee their deletion or persist an opt-out marker
when browser storage itself is unavailable. R01 remains independently usable.

History uses the browser Web Locks API with one constant coordination name,
`smile-track:routine-history`. It is not a persisted identifier. Cooperating tabs
serialize reads that prune, recording and deletion, and record operations re-read
consent inside the lock. A queued stale writer behind deletion observes a missing key
and cannot recreate history. Storage events refresh the other tab; the lock also
protects the interval before the event arrives. No in-memory history array is used
as authority for a later write. UI request revisions prevent earlier pending reads
from overriding a later erase result.

Same-day explicit records are last-write-wins within this serialization; no activity
merge or conflict-recovery protocol exists. An explicit new enable action after an
erase can create a fresh empty history again. Other scripts, browser extensions or
external storage editing do not participate in the lock. Locks are browser-local,
not cross-device synchronization. Unsupported/denied coordination fails closed for
history (normally Web Locks requires HTTPS or localhost); no unsafe lock-free write
fallback is used. Erasure is still attempted where browser access permits.

## Privacy and product boundaries

Browser-local storage is not encrypted private storage. Shared profile users can
see records. Browser backups, extensions, synchronization and site-data policies are
outside Smile Track's control. Device dates/timezones may be wrong. These limitations
are disclosed on the page; the interface does not promise private encryption,
instant suspended-browser expiry or guaranteed removal after storage failure.

No routine entries are transmitted in requests, URLs, cookies or telemetry. Normal
static page/assets still load. No backend, accounts, database, service worker,
third-party processing, cloud sync, dependency or deployment is introduced. Only
synthetic entries are used in tests/screenshots. This is a personal activity record,
not clinical monitoring or a dentist-reviewed assessment.

F01, F02, E01, G01, G01-DOC and R01 remain complete. F02 remains internal-only;
Stage 09C remains CLOSED/frozen `OUTWARD_PROVISIONAL_V1`, with original scientific
interpretations and uncertainties unchanged. No restricted archive was opened for
R02. E01 gate/schema and empty production lesson/authority registries are unchanged.
C01 remains Owner-blocked and incomplete; no professional recruitment or appointment,
lesson publication or anatomical/clinical claim is authorized. The public repository
does not authorize deployment or scientific-asset distribution.

## Validation, inventory and remaining limitations

[VALIDATION_LOG.md](VALIDATION_LOG.md) lists exact local commands/results; final-head
CI is separately linked in the PR. Browser scenarios cover consent before writes,
R01 consent separation, no auto-copy/backfill, snapshots and neutral missing days,
seven-day expiry, local midnight, both DST boundaries, live timezone change,
malformed/duplicate/future/stale data, deletion scopes, all storage failure modes,
coordination unavailable, queued cross-tab erase, queued midnight record rejection,
Home/Learn retention, keyboard/focus/mobile layout and no outbound entry transmission.
Original R01 assertions remain, updated only for scoped labels and named statuses.

Synthetic full-page desktop/mobile screenshots are generated under `test-results/`
and visually reviewed, not committed. Native checkboxes, labels, semantic list/date
markup, named live status regions, keyboard traversal and touch targets are tested.
Chromium/emulation coverage does not establish real-device, screen-reader or other
browser compatibility. Audit and automated checks are not clinical, privacy,
security or accessibility certification.

Changed files:

- `app/layout.tsx`: mount non-rendering retention cleanup.
- `app/routine/history-retention.tsx`: all-route entry/resume cleanup.
- `app/routine/history-storage.ts`: versioned schema, dates, validation and locked storage operations.
- `app/routine/history.tsx`: consent, explicit recording, history list and scoped erase controls.
- `app/routine/check-in.tsx`: integrate history and erase-all; preserve R01 storage behavior.
- `app/routine/routine.module.css`: responsive history list and actions.
- `tests/history.spec.ts`: synthetic history/browser/privacy/race evidence.
- `tests/routine.spec.ts`: R01 control-label/status selector updates, no removed scenarios.
- `README.md`, `docs/CURRENT_STATE.md`, `docs/ROADMAP.md`, `docs/DECISIONS.md`,
  `docs/VALIDATION_LOG.md`, `docs/R02_REPORT.md`: dated state, design and evidence.

No unresolved implementation defect is currently identified. The explicit-snapshot
interaction and disclosed browser limitations remain for Architect review. No merge
or subsequent task is authorized by this implementation handoff. Stop after R02.
