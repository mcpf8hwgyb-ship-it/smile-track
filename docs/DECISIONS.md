# SMILE TRACK — DECISION LOG

## D-007 — R01 private current-day check-in (2026-10-13)

Status: ARCHITECT-AUTHORIZED SCOPE; implementation pending Architect review.

Use the existing static Next.js/React/strict TypeScript/CSS Modules stack without
new dependencies. The client stores only version 1, local date and two booleans in
one browser-local key after explicit opt-in. No separate consent identifier or
history is stored. Record presence is same-day consent; expiry resets selections
and consent. Default entries stay in page memory. Erase resets the page and disables
saving; failed storage operations are reported rather than claimed successful.

Read-back verification, malformed-record rejection, local-day timers/lifecycle
checks and cross-tab erasure handling support this boundary. Browser suspension,
shared profiles, backups/sync, storage denial and last-write-wins tabs remain limits;
see [R01_REPORT.md](R01_REPORT.md). No clinical interpretation or professional-review
claim is introduced. C01 is Owner-blocked at this stage, not completed. E01 publication
authority, scientific semantics and G01 protections remain unchanged.

---

## D-006 — G01 solo-maintainer technical governance (2026-10-12)

Status: ACCEPTED — G01 complete; this documentation reconciliation awaits Architect review.

F01 and F02 implementations and E01 are complete and merged. Stage 09C is closed
with frozen `OUTWARD_PROVISIONAL_V1`; F02 remains internal feasibility only and E01
remains an education foundation with no published lessons. Earlier decision entries
retain pre-acceptance wording as historical records.

The public repository uses active `G01-main-protection` ruleset `24954073`:
required PR, zero required approving reviews, required `validate` with strict
up-to-date checks, conversation resolution, blocked deletion/force pushes, and no
bypass actors. The API reports `current_user_can_bypass: never`. See
[G01_REPORT.md](G01_REPORT.md) for configuration fields, experiment evidence and limits.

PR/CI requirements are technical safeguards. Independent GitHub approval is not
currently required; the Project Owner may self-merge a passing, up-to-date PR with
resolved conversations. This is not independent human review and does not replace
the Architect/Builder task and review process. The Builder still needs explicit
merge authorization. Independent GitHub approval may be enabled in a separately
authorized governance change when an actual second maintainer becomes available.

The merge-commit workflow remains available and is the project convention; the
ruleset also allows squash and rebase. No administration is changed by G01-DOC.
Qualified substantive dental/health review and separately authorized publication
remain required under [CONTENT_EVIDENCE.md](CONTENT_EVIDENCE.md). Public source-code
visibility authorizes neither deployment nor distribution of restricted Dundee assets.
No open-source license has been added or approved by this task.

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

This document records important architectural, product, scientific, privacy, and technical decisions.

Do not record trivial implementation details here.

---

## D-001 — Separate Architect and Builder Roles

Status: ACCEPTED

### Decision

Use separate Architect and Builder workflows.

The Architect determines the highest-value next task and reviews completed work.

The Builder implements approved tasks and validates the result.

### Reason

This reduces uncontrolled scope expansion and separates roadmap decisions from implementation decisions.

### Consequence

The Builder should not autonomously begin major new features after completing an assigned task.

---

## D-002 — Repository Is Technical Source of Truth

Status: ACCEPTED

### Decision

The current repository and project documentation are authoritative for implementation state.

### Reason

Conversation memory can become incomplete or stale.

### Consequence

Claims about completed functionality should be verified against repository evidence.


## D-003 — F01 Application Foundation

Status: ACCEPTED — Architect-approved stack; implementation awaits Architect review.

Authority: Architect F01 handoff supplied by the project owner on 2026-10-07 (America/New_York).

Use mobile-responsive web, Next.js stable App Router, React, strict TypeScript, static export, CSS Modules/standard CSS, Node.js 24 LTS, npm with committed lockfile, ESLint, Playwright, and GitHub Actions. No backend, database, authentication, or hosting provider is selected.

Next.js supports an education-first static site and later interactivity; Vite would reduce initial framework complexity but leave more public-content rendering decisions. Web avoids premature native build complexity. Static export avoids server infrastructure before it is needed. Future server capabilities and native/camera work require separate Architect approval.

Implementation details: components render at build time; only exported files are served. The Node preview script is local development tooling, not an application backend or production hosting choice. Exact dependency versions are in package.json and package-lock.json; Node/npm versions are pinned. Disable automatic framework-generated agent rules so development does not rewrite governance.

Lint baseline uses ESLint and typescript-eslint recommended rules. TypeScript 6.0.3 is within the parser's declared <6.1 support range; latest TypeScript 7 is not. The optional Next.js lint preset was excluded after an audit found an unpatched braces advisory and its plugins declared incompatible ESLint 10 peers. ESLint 9 was rejected because npm marked it unsupported. No forced peer resolution or audit suppression remains. Next/React-specific lint rules are a known coverage limitation to revisit before interactive components. This does not change the approved stack.

Consequences: runtime authentication, protected data, server actions, and dynamic APIs are unavailable. Web selection does not establish future smartphone scanning performance. Tests and dependency audits do not establish comprehensive security, accessibility, medical, or regulatory compliance.


## D-004 — F02 controlled integration investigation (2026-10-12)

Status: ACCEPTED SCOPE — Architect-approved F02 handoff; implementation acceptance pending review.

Evaluate Three.js/WebGL2 with the existing Next.js/React/strict TypeScript foundation.
Use separate Mesh objects sharing raw source-local immutable arrays; apply accepted
row-major, column-vector scientific matrices once, with explicit storage conversion.
Preserve negative determinant B transforms and use reversible DoubleSide presentation.
A/B are computational labels, never certified dental numbering or laterality.

The source GLBs and frozen scientific metadata remain authoritative. Generated
`f02-manifest-1` metadata is a traceable application-facing representation, not a
new scientific baseline. Camera, visibility, and solid material overrides are runtime
presentation state. User-facing scientific claims remain separately reviewed.

The harness is a loopback-only development process outside Next routes. Restricted
assets, matrices, and oracle fixtures are generated outside the repository; no
public assets, exported viewer, hosted service, CI asset downloads, or CI artifact
uploads. CI runs only synthetic conformance and deployment-boundary negative controls.

Compatible React Hooks rules are added to ESLint 10; the full Next preset remains
outside the limited baseline. No stack replacement, new product feature, geometry
optimization, or production delivery decision is authorized. Measured limitations
and potential follow-up budgets in F02_REPORT.md are proposals requiring Architect
review, with Scientific Lead approval additionally required for scientific derivatives.

## D-005 — E01 evidence-gated static education foundation

Status: Architect-selected E01 scope; implementation submitted for review.

Use the approved static stack and existing Zod dependency for `education-content-1`.
Build-time filesystem loading keeps unpublished records outside the client graph;
a single fail-closed gate supplies only eligible fields to `/learn/`. No CMS,
backend, accounts or reviewer login is introduced. Production records and the
human appointment registry remain empty. Qualified human review and a separate
explicit publication decision bind to the exact content version/digest. Builder
implementation is not content approval. No actual educational lesson is authorized.

Latest-version selection, expiry, withdrawal and inactive appointments exclude content;
malformed metadata stops the build. Static exports need a later authorized rebuild/
redeployment to reflect changes. Metadata checks rely on human Git review for the
truth of appointments and review evidence; they do not certify facts or credentials.
F02 scientific implementation and all scientific limitations remain unchanged.
