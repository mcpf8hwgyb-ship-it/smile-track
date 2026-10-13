# R01 — private daily oral-care check-in

Verification date: 2026-10-13 UTC. Scope authorized by the Architect; implementation
awaits Architect review before merge. No next feature or deployment is authorized.

## Baseline and scope

Verified GitHub main and fresh clone: `9dbda414f7d9f6b97ef5508a61ad6d5314c8def0`.
Branch: `r01-private-daily-check-in`. The final review commit and CI run are recorded
in the PR handoff (a commit cannot embed its own SHA). Main was rechecked unchanged
before submission. G01 ruleset `24954073` remains active with required PR, strict
`validate`, conversation resolution, zero approving reviews, blocked force pushes
and deletion, empty bypass actors and `current_user_can_bypass: never`.
No governance administration was changed.

`/routine/` contains two independent native checkboxes, **Brushed teeth** and
**Cleaned between teeth**, with toggle-to-undo and an erase button immediately below
them. Shared Home/Learn/Routine navigation marks the current page. Home accurately
names the available check-in and unavailable lessons/capture. There are no scores,
streaks, targets, frequency recommendations or claims of clinical validation.
The existing non-diagnostic positioning remains visible.

## Data and consent

One owned localStorage key: `smile-track:routine:1`. Exact synthetic example:

```json
{"version":1,"date":"2026-10-12","brushedTeeth":true,"cleanedBetweenTeeth":false}
```

Only these five fields are accepted. There is no history, consent identifier,
identity, note, symptom, image or clinical field. The date is derived with local
calendar getters, never UTC date truncation. The user's device clock/timezone is
trusted; the app cannot independently establish the real date.

- Default state is page memory; no `setItem` call occurs before explicit opt-in.
  Unsaved selections clear on page exit/reload, including page lifecycle handling
  for browser back/forward caching. Static hydration begins date-neutral and reads
  local date/storage only after mount. Without JavaScript the controls are disabled
  and a message explains that entries cannot be changed.
- Explicit opt-in writes the current record, including an all-false record if that
  is selected, and verifies the serialized value by reading it back. A valid stored
  current-day record represents earlier consent in this browser profile and restores
  both activities and saving. Each later update overwrites the same key.
- A new local date resets activities and disables saving. A timer targets midnight
  and checks at least once a minute while scheduled normally; focus, visibility,
  page restoration and each interaction also check the date. On opening the page,
  expired/future/malformed/unknown-version/extra-field records are rejected and the
  owned key is removed. A fresh day requires a fresh opt-in.
- Turning off saving removes the record but keeps current in-memory selections.
  Erase resets both selections and turns saving off. Neither action clears unrelated
  browser storage. A storage event propagates another tab's reset/erasure; before
  updating a saved record, the app also checks that same-day consent still exists.
- Getter, quota/write, silent-write and removal failures are caught. Failed saving
  switches to memory and attempts removal. Failed removal never claims successful
  erasure; it warns that a previous record may remain and directs the person to
  browser site-data controls. The activity controls remain usable.

## Privacy and retention limits

No application code sends entries anywhere. There is no fetch, beacon, analytics,
third-party processing, account, backend, database, service worker or deployment
addition. Static page/asset requests still occur as normal; no entries are included
in URLs, request bodies, logs or cookies. Test entries are synthetic only.

Browser-local is not encrypted private storage. Other users of the same browser
profile can read a saved record; browser backups, synchronization, extensions and
site-data policies are outside application control. localStorage is origin-scoped;
changing browser/device/profile or origin does not share the application's record.

A closed/suspended browser cannot run deletion timers. Old bytes can remain until
the page next executes; the app rejects the stale date before displaying it as a
check-in and attempts erasure. No accumulation or retrieval of historical records
exists. If browser access is denied, deletion cannot be guaranteed by JavaScript
and the warning explains this. These limits are also disclosed on the page.

Multiple tabs share the single key and use last-write-wins, without a transactional
merge protocol. This is a small current-day check-in, not a synchronized or durable
record system. No backup recovery, reminders, history or medical interpretation is
implemented.

## Validation and browser evidence

See [VALIDATION_LOG.md](VALIDATION_LOG.md) for exact commands and observed outcomes.
The unchanged CI workflow automatically includes the new Playwright tests.

The suite exercises initial no-write state, independent selection/undo, reload loss,
explicit opt-in and exact stored shape, same-day restoration, saved updates, erase
and persistence-off afterward, opting out while retaining memory, local midnight,
clock-change focus recovery, stale/future/malformed/extra-field data, unrelated-key
preservation, denied getter/quota/silent writes/removal, startup denial, cross-tab
erasure and leaving/back navigation. A synthetic New York clock at
`2026-10-13T03:59:50Z` must report local `2026-10-12`, then advance across local
midnight. This distinguishes local-day behavior from a UTC-only implementation.

Desktop 1440×1000 and mobile Chromium emulation 390×844 cover skip navigation,
Tab/Space/Enter selection and erase, visible focus, activity touch targets at least
44px, current-page navigation and no horizontal overflow. The complete check-in
flow asserts no console errors/page exceptions (including hydration), no external
requests, only GET asset/page requests without bodies, and no application cookies
or sessionStorage. Synthetic desktop/mobile screenshots are generated under
`test-results/`; they were visually inspected, not committed. No scientific imagery
was loaded. Chromium emulation is not real-device or assistive-technology certification.

## Preserved boundaries and changed-file inventory

No dependency, lockfile, CI workflow, deployment config, scientific implementation,
source asset, E01 gate/schema or production registry changes. Existing E01 and F02
regressions/export guards remain required. The controlled F02 test remains **SKIP**
without restricted inputs, not a pass; no restricted archive was opened for R01.

| Area | Files |
| --- | --- |
| Shared navigation / Home / Learn | `app/navigation.tsx`, `app/page.tsx`, `app/page.module.css`, `app/learn/page.tsx` |
| Routine | `app/routine/page.tsx`, `app/routine/check-in.tsx`, `app/routine/storage.ts`, `app/routine/routine.module.css` |
| Browser assertions | `tests/routine.spec.ts`, `tests/foundation.spec.ts` (update obsolete feature/privacy copy; keep original safety assertion) |
| Documentation | `README.md`, `docs/CURRENT_STATE.md`, `docs/ROADMAP.md`, `docs/DECISIONS.md`, `docs/CONTENT_EVIDENCE.md`, `docs/VALIDATION_LOG.md`, `docs/R01_REPORT.md` |

F01, F02, E01, G01 and G01-DOC remain complete. Stage 09C remains closed/frozen
`OUTWARD_PROVISIONAL_V1`; F02 remains internal-only and all scientific uncertainties
remain unchanged. Earlier status/decision/validation records are preserved additively.
The Project Owner has blocked proposed C01 professional review at this stage; it
was not completed. No reviewers or approvals were created. E01 registries remain
empty and educational publication remains blocked by its unchanged requirements.

R01 has no identified stack incompatibility or need for architectural escalation.
Architect review must assess the implementation and disclosed browser limitations
before authorizing a merge. This report is not medical, security or accessibility
certification. Stop after R01.
