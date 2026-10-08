# SMILE TRACK — DECISION LOG

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
