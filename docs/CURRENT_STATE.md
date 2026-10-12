# SMILE TRACK — CURRENT STATE

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

