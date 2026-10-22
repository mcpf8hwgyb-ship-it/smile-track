# P01-02A — Concurrent Erase-All and Fresh Consent Investigation

Status: investigation in progress; no production policy selected.

Authorized baseline: `c6074049043fe66468fa9078a4962a574300cc61`, tree `63070566d5d924511750cc5354c2890cbfa44e75`. Live preflight matched; G01 24954073 active, strict validate integration 15368, no bypass, no competing open PRs.

Two appended Chromium tests exercise fresh R01 consent before and after the combined operation's R01 erasure. Actual history/R01 Web Lock holders and pending-queue queries establish order without sleeps. Each phase logs stored bytes, both tabs' consent, activity selections and notices, and held/pending locks. Existing tests remain unchanged. Only this report and tests/routine.spec.ts are proposed changes.

Results, negative controls and final CI evidence will be recorded before review. No behavior is classified VERIFIED until execution succeeds. Local clean installation, lint and strict types passed on the initial local test draft; after session resume the execution service became unavailable, so GitHub CI is the required browser/complete-pipeline evidence.
