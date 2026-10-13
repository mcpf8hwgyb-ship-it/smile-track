# SMILE TRACK — CONTENT EVIDENCE

## R01 / C01 boundary — 2026-10-13

The Project Owner has **BLOCKED the proposed C01 professional-review activity at
this stage**. It has not been completed; no professional review or appointment is
implied. R01 records self-reported actions without clinical interpretation or
educational lessons. E01's schema, publication gate, review requirements and empty
production registries are unchanged. Dental/health publication remains blocked
until separately authorized qualified substantive review and explicit publication
approval satisfy the existing contract. Technical PR approval does not satisfy it.

Historical records and scientific uncertainties below remain unchanged.

---

## G01 governance clarification — 2026-10-12

E01 is COMPLETE and merged: [PR #3](https://github.com/mcpf8hwgyb-ship-it/smile-track/pull/3),
`53337472c46a8c0dc0cbd83c4157bc8831b05d65`. F01 is complete, Stage 09C is closed,
F02 is complete for internal feasibility only, and G01 technical governance is complete.
**Approved dental lessons: zero. Appointed production reviewers/publishers: zero.**

The repository is now public, with enforced PR and CI requirements but zero required
approving GitHub reviews. The Project Owner can self-merge passing, up-to-date PRs
with resolved conversations. This does not establish independent human review,
qualified subject-matter review, evidence accuracy, or content publication approval.
[G01_REPORT.md](G01_REPORT.md) documents the technical safeguards and their limits.
Independent GitHub approval may be enabled when an actual second maintainer is available;
it would still not substitute for the substantive review required below.

The E01 review/publication process below is unchanged. Dental/health content requires
separate authorization, qualified human substantive review, recorded authority and an
explicit publication decision bound to its version/digest. No appointments or content
approvals are created by this documentation update. The frozen Dundee assets remain
restricted, internal-only, NOT_CERTIFIED and public educational suitability
NOT_ESTABLISHED. Public repository visibility does not authorize asset distribution
or application deployment. Historical transitions below remain preserved.

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

This document will track evidence and review status for oral-health educational content intended for users.

Educational material should eventually record, where applicable:

- topic;
- source;
- source type;
- publication or revision date;
- evidence quality;
- last reviewed date;
- professional review status;
- reviewer information where appropriate;
- notes or limitations.

AI-generated text is not considered authoritative merely because it was generated confidently.

## Current Status

No production educational content has been approved yet.

## E01 — minimum review and publication process (2026-10-12)

**Actual approved content: none. Actual appointed reviewers/publishers: none.**
`records.json` and `authorities.json` are empty. This process is implemented for
future separately authorized content work; it does not approve a dental lesson.

### Versioned record and sources

`education-content-1` records a stable slug, positive integer version, English
language, topic, title, named author/editor IDs, plain-text paragraphs, sources,
limitations, safety notices and update date. Each source records stable ID, title,
publisher, HTTPS reference, type, accessed date and publication/revision dates
(`null` explicitly means unavailable). No citation implies endorsement or approval.
A reviewer must evaluate source relevance, quality, currency and support for the
actual statements; a source list alone is not an evidence assessment.

There is no CMS or editorial service. Keep all prior versions and decisions in
version control. Fields are described by the strict schema in `education/contract.ts`.
Malformed records stop the build rather than being silently accepted.

### Authority and independent review

The Project Owner appoints named human evidence reviewers, qualified subject-matter
reviewers, and a publication approver (the Owner or an explicitly delegated human).
Appointments must be recorded in `authorities.json` with role, qualifications,
appointment date, an auditable appointment reference and active status, reviewed in
Git before content release. Builder implementation, model output, test results and
Architect approval of E01 are **not** educational-content approval. The Builder may
record authorized decisions but may not invent reviewers, grants or sign-offs.

For this initial oral-health pathway, every published record conservatively requires
qualified subject-matter review as well as evidence review. A qualified dental/oral-
health professional appropriate to the subject must assess health-related factual
claims and safety framing. One suitably appointed qualified person may perform both
review roles. Neither reviewer may be the recorded author/editor. The separately
appointed publication approver must also be distinct from the reviewers and contributors.
No reviewers are currently available through the registry; real content remains blocked.

Evidence states: `draft`, `awaiting-review`, `changes-required`, `reviewed`.
Publication states are separate: `not-approved`, `rejected`, `approved`.
A reviewed record needs reviewer IDs, review date, next-review date, supporting
review-record reference, and the exact content digest. Publication approval needs
its own decision ID/reference, authorized human approver, date, version and digest.
The digest covers substantive content, provenance, sources and safety wording;
changing any of them invalidates existing review and publication bindings.
A completed review must follow the content update; approval must follow review.

These are metadata integrity and appointment checks, not digital signatures or
credential verification. The repository's human review/merge governance is the
trust boundary. An authorized maintainer can change code or falsify metadata;
automated tests cannot determine whether a review really occurred or a claim is true.
Reviewers' real identity, qualification, independence and decision evidence must be
verified by the Owner during appointment/content review, not asserted by the Builder.

### Eligibility, stale material and withdrawal

The build selects only active, latest-version records with complete valid provenance,
completed current reviews and explicit version/digest-matched approval by authorized
active humans. A newer unapproved revision blocks fallback to an older approval.
Duplicate identities/versions and dangling supersession references fail validation.
Future-dated decisions or expired reviews are excluded. No algorithm infers approval.

The reviewer selects `reviewDueOn` according to source/content risk; no invented
universal clinical review interval is imposed. On and after that date, the next build
excludes the record. Owners must review dates before releases and arrange authorized
rebuild/redeployment when an already hosted page expires or needs removal. A static
export cannot revoke an already deployed/cached page by itself. No scheduled job,
hosting change or runtime infrastructure is introduced by E01.

Corrections create a new integer version and require new review/approval bindings.
Retain the preceding version and mark it superseded with date, reason and replacement
ID/version. Withdrawal marks the record `withdrawn` with date/reason, retaining the
previous evidence and decisions. Record revocations immediately and do not leave an
older active version as an automatic fallback. Inactivate authority entries when
appointments end; the next build excludes their otherwise approved records.

### Test and release boundaries

Only non-medical paper/folder fixtures are used. Their people, roles, review records
and approvals are invented test data, not professional testimony. They live outside
the production catalog and are absent from exported pages and bundles.
Positive/negative tests verify mechanical decisions, malformed-input rejection,
revision binding, expiry, revocation, withdrawal and generated-output exclusion.
They establish neither medical correctness nor legal/regulatory compliance.

`/learn/` is static. It receives only the gate's public projection; the raw catalog,
authority register and private review decision fields are not passed to client code.
The gate lists future eligible lessons on the same Learn page with fragment links;
there is no ungated article route. No real lesson is approved or published in E01.
The scientific model is not approved educational content and remains excluded.
