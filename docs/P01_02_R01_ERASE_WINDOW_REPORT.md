# P01-02A — R01 fresh-consent window around combined erasure

## Scope and identity

Evidence-only investigation. Production code, storage schemas/keys/locks, UI, dependencies, workflows, governance and scientific assets are unchanged. Existing tests remain intact; two parameterized ordering cases are appended to `tests/routine.spec.ts`, exercised on desktop and mobile Chromium.

Authorized base: `c6074049043fe66468fa9078a4962a574300cc61`.
Base tree: `63070566d5d924511750cc5354c2890cbfa44e75`.
Preflight independently confirmed main/tree, no competing open PRs, active G01 `24954073`, strict `validate` integration `15368`, mandatory thread resolution, deletion/non-fast-forward restrictions, no bypass actors and current-user bypass never. The known legacy protection endpoint access limitation is not a governance failure.

## Reproduction and ordering barriers

Use the unchanged pinned repository pipeline and `npx playwright test tests/routine.spec.ts --grep P01-02A` against the static export. Both pages share one browser context/origin. The clocks are set to the same local date, 2026-10-12 at noon in America/New_York, avoiding midnight as a confounder. All records are synthetic.

R01 key: `smile-track:routine:1`; R02 key: `smile-track:routine-history:1`.
Initial R01 bytes:
`{"version":1,"date":"2026-10-12","brushedTeeth":true,"cleanedBetweenTeeth":false}`
Fresh R01 bytes:
`{"version":1,"date":"2026-10-12","brushedTeeth":false,"cleanedBetweenTeeth":true}`
Initial R02 bytes:
`{"version":1,"enabled":true,"entries":[{"date":"2026-10-12","brushedTeeth":true,"cleanedBetweenTeeth":false}]}`

Records are created through explicit application controls. An unrelated synthetic sentinel `p01-02a:unrelated=synthetic-preserve` is seeded and must remain unchanged.

1. Acquire history lock H (`smile-track:routine-history`) in a holder page; await the callback's acquisition marker.
2. Tab A opens and affirmatively confirms existing UX02 combined erase-all.
3. Query actual Web Locks: A is pending H, H is held, and R01 lock R (`smile-track:routine`) is neither held nor pending. No erasure-success notice may appear.
4. For ordering A only, Tab B explicitly unchecks R01 consent, verifies null, then independently selects false/true and enables saving. Exact fresh bytes and checked consent must exist while H remains held. R02 bytes are unchanged.
5. Acquire R in a separate holder, release H, then query pending R. Verify H is absent, R01 is still exactly fresh (ordering A) or initial (ordering B), and A reports pending coordination. H is no longer held.
6. Release R and await completion. Capture actual bytes/notices before asserting verified deletion. Both R01 and H must be null; both tabs' consent and activity controls must be off/reset.
7. For ordering B only, B now explicitly selects false/true and enables saving. Verify exact fresh bytes, B saved/on and A detached/off with the existing saved-record notice.
8. Acquire/release R again as a real queue-drain barrier. Assert final values, unchanged sentinel, exact key inventory, empty session storage/cookies and no additional observed application-page requests.

No sleeps establish operation order. Queue observations, grant callbacks, stored-value checks and UI completion assertions establish it. Phase JSON is printed in CI and attached by Playwright; each phase includes held/pending locks, exact stored bytes and both pages' checkbox values and status text.

## Relationship to accepted evidence

References: `docs/P01_01_COORDINATION_DESIGN.md` and `docs/P01_01_COORDINATION_CORRECTION_REPORT.md`. Historical reports are unchanged.

| Existing coverage | Relationship |
| --- | --- |
| T05 stale edit versus erase | Stale edit cannot recreate an absent record. This investigation uses a separate explicit enable and a later explicit erase, not a stale edit. |
| T19 combined lock ordering | Reuses H-then-R separation and proves the R01 window with a distinct freshly consented value. |
| T20 partial erasure | Silent-removal control checks truthful partial result reporting; it does not redefine success. |
| T21 history re-enablement | Existing evidence permits fresh H after its erase. Here fresh R01 is ordered on either side of its own erase. |
| T23 identical-byte ABA | No consent epoch exists. Our distinct bytes avoid conflating this scenario with identical-byte observational equality. |

The accepted design explicitly states that reset removes whichever value exists at deletion and is not atomic with later writers. A fresh value removed by a later explicit erasure is therefore not automatically a new production defect. UX02 confirmation and its separate-operations/re-enablement warning are unchanged. UX04's separate history opt-out confirmation and cross-tab qualifications are unchanged and exercised by existing regression tests.


## VERIFIED observations and reproducible traces

Normal evidence: run [39714282518](https://github.com/mcpf8hwgyb-ship-it/smile-track/actions/runs/39714282518), attempt 1, validate job 119612573646, head `8dae2953d2946886d2d4ed27c9f080db1cd3c1a8`, tree `459de5c69891924ec4ba235001eca85d329438dc`. Both orderings passed on desktop and mobile. This run's audit failed; it is not a full-pipeline pass.

Let X be the initial true/false R01 bytes, Y the fresh false/true bytes, H0 the initial history bytes, and null an absent key. These are the exact synthetic objects specified above, not arbitrary placeholders.

| Barrier/phase | Ordering A: fresh consent before R01 erase | Ordering B: fresh consent after R01 erase |
| --- | --- | --- |
| Initial saved | R01=X, H=H0; A/B R01 and H checked | Same |
| A pending H; holder owns H | R01=X, H=H0; no R lock held/requested | Same |
| B revokes then independently enables | R01 absent after revoke, then Y; H=H0; B checked, false/true; A off/reset | Not performed yet |
| H released, A queued behind held R | R01=Y, H=null; B saved/on | R01=X, H=null; B saved/on |
| R released, A completes | R01=null, H=null; both tabs off/reset | R01=null, H=null; both tabs off/reset |
| B enables after completion | Not performed | R01=Y, H=null; B on/false/true; A off/reset |
| Final R acquisition barrier | Only unrelated sentinel remains | Y and unrelated sentinel remain |

At the pending-H phase A shows today-only saving off and memory-only selections; it does not claim deletion success. At the pending-R phase A says: "Waiting for coordinated browser storage. Saving or erasure is not yet confirmed." H is already absent and history status says "History erased. History is off."

After A completes successfully its notice includes:
> All routine data erased in separately verified operations. Today-only saving is off here. Another tab may enable saving again between or after these operations; history shows its latest state below.

In ordering A, B's freshly saved Y is removed by A's later explicit R01 erase. Both tabs' consent is off and activities false/false. In ordering B, B's later Y persists; B says "Saved in this browser for today." A remains off/reset and replaces its earlier result with:
> A saved current-day record exists but is not attached here. Choose saving to restore it without replacing it.

H stays off in both tabs. The unrelated sentinel, exact key inventory, empty cookies/sessionStorage, no additional observed application-page requests and no page errors all passed in both desktop/mobile normal cases.

These are VERIFIED bounded observations of current behavior. No new false deletion-success claim or contradiction of the accepted per-key contract was established. Whether fresh consent should receive a stronger protection rule is UNRESOLVED policy, not an inference from test success.

## Negative controls and restoration evidence

Both controls changed only the appended synthetic test harness. All existing normal assertions remained in place. Neither control changed production code or added a permanent storage override.

| Control | Mutation commit / tree | CI attempt 1 | Decisive result |
| --- | --- | --- | --- |
| A: uncoordinated stale restoration | `65738f296985be63608eac31a00e1b779b87544f` / `9e04bcc3947490f96a7d50ff3f9b5b8344706ab9` | [39715842608](https://github.com/mcpf8hwgyb-ship-it/smile-track/actions/runs/39715842608), job 119617619606 | 4 intended failures, 146 passes |
| B: silent owned-R01 removal rejection | `37c438c5cc1a02b07f07f232f7140c37883608ad` / `2adb50e505da1e0f1b42cd0034ea8b012d0b0e9f` | [39716113789](https://github.com/mcpf8hwgyb-ship-it/smile-track/actions/runs/39716113789), job 119618505436 | 4 intended failures, 146 passes |

A: after A's successful erasure and before the normal null assertion, a holder page called localStorage.setItem with X outside navigator.locks. The trace shows no held/pending locks, X recreated, H absent and sentinel unchanged. Each unchanged `expect(await stored(page)).toBeNull()` failed (mutation line 630), receiving the exact X bytes. This deliberately violates the cooperation boundary; it does not demonstrate a new production restoration defect.

B: only Tab A's Storage.prototype.removeItem was wrapped; calls for the owned localStorage R01 key returned without removal, and all other calls delegated to the original method. Before the unchanged absence assertion, extra control-only checks independently verified the unverified notice, absence of a success notice, A's off consent and unchanged sentinel. The logged `CONTROL-B-unverified-removal-warning-confirmed` phase was reached in all four cases. A reported:
> Erasure of all routine data could not be verified. History erasure: verified; today-only erasure: unverified. Today-only saving is off here. Use your browser’s site-data controls to remove remaining records.

Each normal null assertion then failed (mutation line 640): Y remained in ordering A; X remained in ordering B. B still showed the corresponding saved record/on state. H was absent. This is accurate partial-failure reporting, not a claimed successful deletion.

A was completely restored by commit `16ff866fc911d9a82bf7304bef8cd17869496bed`. B was completely restored by commit `3052b57a8263b19b8988832e97e28ddf51caa62b`. Both restoration commits point to the exact interim tree `459de5c69891924ec4ba235001eca85d329438dc`. The report-completion commit descends from B's restoration and changes only this report; the final tests are byte-for-byte identical to the accepted interim tests. No unsafe injection remains.

## Validation history and final-head binding

- Initial setup run 39713514242, job 119610139194, head `51cf1a22fe42d85710a42413dfd11fda52ff2776`, tree `7f9332993c24707ff3450a61c7f18b2c7b24d4e2`: 146 existing tests passed; 4 new cases failed before scenario execution because Playwright check() expected an immediate checked state. The correction used the existing click() plus retrying toBeChecked() pattern for asynchronous history enablement. No assertion was weakened.
- Interim run 39714282518, attempt 1: clean install, lint, strict types, education 5/5, F02 4 passes/1 expected restricted-data skip, production/static export exclusion (35 files, 0 approved lessons), Chromium 150/150, smoke sensitivity (74 passes/1 intended failure) and education-export negative control passed.
- That run's mandatory audit genuinely FAILED: `npm warn audit network timeout at: https://registry.npmjs.org/-/npm/v1/security/advisories/bulk`; `npm error audit endpoint returned an error`. Installation output reporting zero vulnerabilities did not replace this gate. Execution stopped and Architect explicitly authorized the bounded continuation.
- Negative-control runs above failed only the four intended absence assertions. Downstream steps skipped after those intentional failures are not passing audit evidence.
- The final restored commit is subject to the entire unchanged required workflow. Its exact head/tree, run/job IDs, attempt conclusions and decoded-log results are recorded in the [PR #21 evidence table](https://github.com/mcpf8hwgyb-ship-it/smile-track/pull/21), avoiding a self-referential commit identifier in this report. A green interim or mutation run is never substituted for that final gate.
- One unchanged-head retry is authorized only if the final dependency audit alone fails from an external service/network error. All attempts must remain visible; otherwise stop for Architect review.

## Unresolved questions

The evidence does not decide whether initiation-time or execution-time consent should control deletion, how a future consent generation survives reload/legacy tabs, how independently enabled R01/R02 should interact with a joint erasure, or how partial failures should be reconciled under a stronger policy. Those require Architect decisions and separately authorized design work. No policy, schema, lock protocol, UI or production behavior has been changed.

## Architectural alternatives — policy remains UNRESOLVED

| Alternative | Correctness and independent consent | Complexity and migration | Browser constraints and regression risk |
| --- | --- | --- | --- |
| Retain sequential per-key erasure, with explicit limitations | Each owned key is independently verified at its erase; neither simultaneous absence nor snapshot-specific protection is promised. Independent R01/R02 opt-in remains intact. | No schema/lock migration; communication and acceptance of the current window still require an Architect decision. | Existing Web Locks availability/failure limits remain. Lowest implementation change, but ordering-dependent outcomes remain. |
| Stronger protection for independently re-enabled data | Must define what counts as fresh consent and the point beyond which it survives. Byte comparisons alone cannot distinguish identical-byte ABA. A skipped deletion must be truthfully reported. R01/R02 consent must remain independent. | May require version/epoch metadata and revised erase semantics; old records/tabs, reloads, cleanup and partial failures need migration rules. | Cross-tab compatibility and noncooperating writes complicate guarantees. Significant regression surface across failure, retention, stale-edit and explicit-erase paths. |
| Investigate transactional/consent-epoch architecture | A shared protocol or transactional store could coordinate multiple keys and identify consent generations, but the desired cancellation/deletion policy must first be specified. A joint transaction alone does not decide which future consent wins. | Highest design/migration burden: legacy tabs, schema transitions, lock ordering, independent consent, retention and recovery. Shared locks alone do not make two localStorage removals transactional. | Browser storage/coordination availability, transaction aborts and quotas require evidence. Broadest regression risk; no guarantee against arbitrary outside-protocol restoration or browser backups. |

No alternative is selected or implemented. Recommendation: Architect review should first classify these operation-order results against the accepted sequential contract, then decide whether a separate policy/design assignment is warranted.

## Limits

This bounded Chromium investigation does not establish atomic cross-tab erasure, snapshot-specific deletion, durable consent epochs, comprehensive transmission assurance, cross-browser/privacy/accessibility/security certification, or resolution of P01-02. Request observations cover the exercised application pages and interval, not every browser/network mechanism. Synthetic external writes in a negative control deliberately violate cooperation. Existing publication gates and all Dundee/Stage 09C scientific restrictions remain intact.

Local clean install, lint and strict types passed on the initial local draft. After session resume the local execution service returned an unavailable-process error; no local browser success is claimed. Verified GitHub CI is the required execution evidence.
