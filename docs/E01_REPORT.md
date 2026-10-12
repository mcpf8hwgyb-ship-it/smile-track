# E01 — Evidence-gated education foundation

Date: 2026-10-12 (UTC / America/New_York). Status: implemented and locally validated;
submitted for Architect review before merge. No real educational content is approved.

## Repository and scope

- Repository: `mcpf8hwgyb-ship-it/smile-track`.
- Branch: `e01-education-foundation`.
- Verified upstream base: `a95a8ff1831900e6148a00c3681d928518bd8875`.
- Base tree: `38f0e7909b1df79fd3feb1751ca83cd497af4f05`.
- The PR head and CI evidence are recorded in the review handoff and the CI section below.
  A commit cannot contain its own SHA; use the GitHub PR head as the canonical final commit.

Main was re-read from GitHub before continuing E01 and still matched the approved
F02 merge. PR #2 was verified merged with reviewed head
`a93ad3a600c85cc4949da93b44c7ba6a668636c8`; post-merge CI
[38215252635](https://github.com/mcpf8hwgyb-ship-it/smile-track/actions/runs/38215252635)
passed. The local source snapshot has exactly the base tree above. Git data API
commits retain the real upstream parent; local snapshot history is not published.

The complete Architect E01 specification controls this implementation. The uploaded
master's older Stage 09C statements remain historical; the later repository closure
record is preserved, not rewritten. The supplied scientific ZIP was not opened,
extracted, imported or modified for E01. No model investigation resumed.

## Implemented functionality

`/learn/` is a statically generated, English-language empty catalog. It has Home/Learn
navigation, a current-page indication, a skip link, semantic main/section/aside/footer,
plain-language positioning, and the existing non-diagnostic safety notice. It offers
no unavailable article links. A small reusable renderer can list future eligible
lessons and their sources on this same route; there is no separate ungated article route.

`content/education/records.json` and `authorities.json` both contain `[]`.
No dental lesson, real reviewer appointment, actual professional review or publication
decision has been created. The only positive examples are invented non-medical tests.

## Contract and publication eligibility

`education/contract.ts` defines the strict runtime schema and inferred TypeScript type
for **`education-content-1`** using the already-installed Zod dependency.

| Area | Required representation |
| --- | --- |
| Identity | Stable slug, positive integer version, title, topic, English language |
| Provenance | Nonempty author/editor IDs and names, update date |
| Content | Plain-text paragraphs, limitations and safety notices |
| Sources | Stable ID, title, publisher, HTTPS URL, type, accessed date, publication/revision dates or explicit null |
| Evidence review | Draft / awaiting-review / changes-required / reviewed; completed review has reviewers, dates, reference and content digest |
| Publication | Not-approved / rejected / approved; approval has decision ID, authorized person, date, reference, version and digest |
| Lifecycle | Active / withdrawn with reason/date / superseded with reason/date/replacement |
| Authority registry | Active human identity, roles, qualifications, appointment date and auditable reference |

`publishCatalog` parses the entire input and authority registry before selecting records.
Malformed metadata, missing provenance, duplicate identities/versions or dangling
supersession references fail the build. Valid unpublished records remain excluded.

Only the latest version of each content ID may publish. It must be active, reviewed,
not overdue, not future-dated, and explicitly approved for its exact version and SHA-256
content digest. Changing text, sources, provenance or safety notices invalidates the
existing digest. A newer draft blocks fallback to an older approved version.

Evidence and qualified subject review are both required. One appropriately appointed
qualified person may hold both roles; publication approval requires a distinct human.
Contributors cannot review or approve their own record. Inactive or missing appointments
exclude content. E01 creates no real appointments and grants the Builder no authority.

The loader reads JSON from disk at build time and returns only eligible public fields.
Raw records, authority entries and private review metadata are not client props/imports.
Rendering uses React's escaped plain text, without HTML injection or embedded media.

This enforces the version-controlled content pathway, not the truth of human testimony.
Human repository review remains necessary to authenticate appointments, qualifications,
review records and release decisions. A maintainer able to change code or falsify
metadata can bypass a source-controlled policy. No credential-verification service,
digital-signature system, CMS or backend is claimed or added.

## Local validation — observed results

Runtime: Node **24.19.0**, npm **11.9.0**. Next **16.4.0**, React/React DOM **19.3.0**,
TypeScript **6.0.3**, ESLint **10.12.0**, Playwright **1.64.0**, Zod **4.6.6**.
All direct versions are pinned in package.json; the dependency graph and lockfile are
unchanged from F02. No dependency was added or upgraded.

| Command | Observed result |
| --- | --- |
| `npm ci` | PASS; 186 packages installed from the unchanged lockfile |
| `npm run lint` | PASS; zero warnings |
| `npm run typecheck` | PASS; route types generated, strict `tsc --noEmit` |
| `npm run test:education` | PASS; 5 tests, 0 failures/skips, multiple negative cases per test |
| `npm run test:f02` | PASS; 4 synthetic tests, 1 explicitly skipped restricted-data test |
| `NEXT_TELEMETRY_DISABLED=1 npm run build` | PASS; `/`, `/_not-found`, `/learn` statically generated |
| `npm run check:export` | PASS; 6 application files and 28 exported files checked; 0 approved lessons, no unpublished/test bodies |
| `npm run test:e2e` with local browser environment below | PASS; all 4 Home/Learn desktop/mobile cases |
| `npm run test:smoke-sensitivity` with same browser environment | PASS; removed Home safety text caused the exact required-content assertion to fail; output restored |
| `NEXT_TELEMETRY_DISABLED=1 npm run test:education-sensitivity` | PASS; actual build excluded unpublished fixtures; deliberate marker leak rejected; exact catalog bytes restored and production rebuilt |
| `npm audit --audit-level=high` | PASS; 0 reported vulnerabilities at check time |
| `git diff --check` | PASS |

Exact local browser environment (the existing external fallback, not a repository dependency):

```sh
export PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/workspace/scratch/91c1429b212c/f02-browser-tools/runtime/chromium
export LD_LIBRARY_PATH=/workspace/scratch/91c1429b212c/f02-browser-tools/runtime
export FONTCONFIG_PATH=/workspace/scratch/91c1429b212c/f02-browser-tools/runtime/fonts
npm run test:e2e
npm run test:smoke-sensitivity
```

Local Chromium reports **153.0.8010.0**. CI uses Playwright's bundled browser and its
own clean checkout. Local npm emits an environment `http-proxy` warning and Playwright
emits a color-environment warning; neither changes outcomes. An initial development
lint failure for `Buffer` in the sensitivity script was corrected with an explicit
`node:buffer` import before the passing validation above.

### Fixtures and negative controls

- Positive: invented paper/folder content with synthetic appointed humans passes schema
  and eligibility; public output omits contributor/approval metadata.
- Excluded: drafts, awaiting-review, changes-required, reviewed-without-approval,
  withdrawn, superseded, stale/future approvals, inactive/unregistered actors,
  missing qualified role, contributors attempting review/approval and reviewer/publisher
  role conflicts. Citation presence never grants publication.
- Rejected: incomplete review/decision records, absent authors/editors/sources,
  malformed reference, invalid date, inconsistent approval date/version, content edits
  after approval, duplicate content/authority identities and missing replacement.
- Real export: temporarily inserted cited draft and withdrawn synthetic records;
  built the actual Learn route; scanned all output including HTML and JS/RSC assets.
  No synthetic content appeared. Injecting a synthetic marker into generated HTML
  made the export checker fail. Cleanup restored `[]` and rebuilt production.
- F01 sensitivity intentionally reports one failed Home assertion and one passed Learn
  test; the wrapper exits successfully only when the expected safety-copy failure occurs.

The exporter checks literal, JSON-escaped and HTML-escaped unpublished titles/bodies,
plus the fixture marker. It is a supplementary leak detector, not a general information-
flow proof. Shared text with an approved revision is allowed; short common draft text
can conservatively cause a false-positive failure requiring human investigation.
The primary control is the single build-time gate and the absence of raw client imports.

### Non-sensitive browser and accessibility evidence

Both **1440×1000 desktop** and **390×844 mobile emulation** passed:

- HTTP 200, page title, one expected H1, named navigation and `aria-current`.
- Honest empty state, zero articles, no fixture marker, visible safety notice.
- Tab reaches the visible skip link; Enter focuses main; the next Tab reaches Back to
  home with a visible outline and at least 44px height; Enter returns home.
- Home's Learn link returns to `/learn/`; no horizontal overflow.
- No page errors, off-origin requests, cookies, localStorage or sessionStorage writes
  during the tested navigation.

The generated full-page Learn screenshots were visually inspected at both viewport
sizes: no clipping/overlap, readable wrapping, visible focus and coherent spacing.
Screenshots are local generated test output, not scientific assets. Browser assertions
in `tests/learn.spec.ts` are the reproducible review evidence. No screen-reader session,
real phone, browser-engine matrix, automated WCAG audit or compliance certification is claimed.

## Scientific, security and privacy boundaries

`internal/f02/`, its evidence JSON files, `scripts/check-export-boundary.mjs`,
`next.config.ts`, the lockfile and the F01 browser test are unchanged from the verified
base. Existing export negative controls still reject restricted model/manifest/internal
code content. No 3D files, manifests, scientific matrices or ZIPs entered app/public/out.
The source inventory contains no generated directories, credentials, restricted assets
or obvious token/private-key patterns. This is not a comprehensive secret/security audit.

No public viewer, hosting/deployment, backend, accounts, analytics, external processing,
patient records or health-data collection was added. Source URLs are future reader-clicked
HTTPS links, not build-time fetches; the empty page makes no external requests.
The restricted frozen-data test is not claimed as re-executed in E01: it is explicitly
skipped without inputs. F02's earlier controlled evidence remains historical and unchanged.

## Documentation and changed-file inventory

Post-merge state is reconciled additively in master/current state/roadmap/decisions,
content evidence, F02 report and research README. A byte comparison confirmed the
seven prior document bodies remain intact. F01 is complete; Stage 09C is closed;
F02 is accepted internally with its limitations; E01 is the sole selected task.
README now defaults to main and documents validation plus explicit E01 review checkout.
`CONTENT_EVIDENCE.md` covers source provenance, human authority, stale material,
corrections, withdrawals, retained history and the limits of automated validation.

Changed/new files:

- `.github/workflows/ci.yml`
- `README.md`
- `app/page.tsx`, `app/page.module.css`
- `app/learn/page.tsx`, `app/learn/page.module.css`
- `content/education/records.json`, `content/education/authorities.json`
- `education/catalog.ts`, `education/contract.ts`, `education/contract.test.ts`,
  `education/fixtures.ts`, `education/package.json`
- `scripts/check-education-export.mjs`, `scripts/check-education-sensitivity.mjs`
- `tests/learn.spec.ts`
- `package.json`
- `docs/MASTER_PROJECT.md`, `docs/CURRENT_STATE.md`, `docs/ROADMAP.md`,
  `docs/DECISIONS.md`, `docs/CONTENT_EVIDENCE.md`, `docs/VALIDATION_LOG.md`,
  `docs/F02_REPORT.md`, `docs/E01_REPORT.md`
- `research/stage09c/README.md`

## CI and final review state

Local validation above is complete. E01 CI is not yet claimed in this initial report;
verified run/head details will be added after the review PR triggers CI.

## Limitations and Architect decisions

- **Actual professionally reviewed/approved lessons: zero.** Future substantive content
  requires a separately authorized task and real qualified human review/appointments.
  Lack of appointed reviewers blocks lessons; no such authorization is needed for these
  non-medical tests or the empty foundation.
- Expiry/withdrawal is enforced at build time. A hosted or cached static copy requires
  an authorized rebuild/redeployment to remove old material. Hosting is unselected;
  E01 adds no scheduler or deployment infrastructure.
- English, plain-text paragraphs and a small topic vocabulary are intentionally limited.
  Approval truth/credentials and source quality require human verification. The builder
  cannot infer them from a successful test or a citation.
- Real-mobile original-texture suitability and full GPU reclamation remain unresolved
  F02 limitations. Scientific statuses, calibration, identity/laterality, contacts,
  occlusion, `NOT_CERTIFIED` and `NOT_ESTABLISHED` remain unchanged.
- No stopping condition required an architectural workaround: the static stack suffices,
  no medical content needed approval, isolation checks pass and no regression remains.
- Architect must review the E01 implementation and evidence before merge. No F03,
  lesson-writing, further model development or subsequent task is started or authorized.
