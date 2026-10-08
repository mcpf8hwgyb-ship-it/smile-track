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
