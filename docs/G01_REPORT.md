# G01 — Solo-project governance closure

Verification date: **2026-10-12**, approximately 21:43–21:45 UTC (17:43–17:45 EDT).
Disposition: **G01 COMPLETE — solo-maintainer technical governance**.
G01-DOC records this state; it makes no administrative or application changes.

## Verified repository baseline

- Repository: [mcpf8hwgyb-ship-it/smile-track](https://github.com/mcpf8hwgyb-ship-it/smile-track).
- Visibility: **public** (`private: false`, `visibility: public`).
- Default branch: `main`.
- Exact baseline: [`53337472c46a8c0dc0cbd83c4157bc8831b05d65`](https://github.com/mcpf8hwgyb-ship-it/smile-track/commit/53337472c46a8c0dc0cbd83c4157bc8831b05d65).
- A fresh public clone and the GitHub ref API independently returned that SHA.
- Repository metadata reports `allow_merge_commit: true` and `license: null`.
  No license is added or claimed by this task. Public visibility is not an
  open-source-license grant, deployment approval or scientific-asset release.

## Verified GitHub configuration

Read-only evidence endpoints:

- [Repository metadata](https://api.github.com/repos/mcpf8hwgyb-ship-it/smile-track).
- [Main ref](https://api.github.com/repos/mcpf8hwgyb-ship-it/smile-track/git/ref/heads/main).
- [Ruleset details](https://api.github.com/repos/mcpf8hwgyb-ship-it/smile-track/rulesets/24954073)
  and [GitHub ruleset page](https://github.com/mcpf8hwgyb-ship-it/smile-track/rules/24954073).
- [Applicable branch rules](https://api.github.com/repos/mcpf8hwgyb-ship-it/smile-track/rules/branches/main).
- [Ruleset inventory including parents](https://api.github.com/repos/mcpf8hwgyb-ship-it/smile-track/rulesets?includes_parents=true).

| Setting | Verified value |
| --- | --- |
| Ruleset name / ID | `G01-main-protection` / `24954073` |
| Source / target | Repository ruleset / branch |
| Enforcement | `active` |
| Target condition | `~DEFAULT_BRANCH`; default branch is `main`; no exclusions |
| Required PR | `pull_request` rule present |
| Required approving reviews | `0`; no required reviewers or code-owner review |
| Last-push approval | Not required |
| Conversation resolution | `required_review_thread_resolution: true` |
| Required check | `validate`, integration ID `15368` |
| Up-to-date enforcement | `strict_required_status_checks_policy: true` |
| Check enforcement on creation | `do_not_enforce_on_create: false` |
| Force-push restriction | `non_fast_forward` rule present |
| Branch deletion restriction | `deletion` rule present |
| Bypass list | `bypass_actors: []` |
| Administrator/current-actor bypass status | API field `current_user_can_bypass: never`; no administrator bypass actor is listed |
| Merge-commit workflow | Preserved: repository permits merge commits; ruleset permits `merge`, `squash`, `rebase` |

The inventory returned this single active ruleset, including inherited rulesets.
The applicable-rules endpoint returned its deletion, non-fast-forward, PR and status
check rules on `main`, matching the approved configuration. The convention remains
merge commits; the API does **not** describe a merge-commit-only restriction.
No ruleset, visibility, permission, secret or workflow was changed by G01-DOC.

The connector did not expose the applicable-rules URL, so it was read through the
public GitHub REST endpoint without authentication. The separate legacy branch-
protection endpoint returned 403 to the connector; no successful read of that
administrator-only endpoint is claimed. Ruleset details and applicable branch rules
were readable and agreed. The bypass value above is the API's current-actor field,
not an independently exercised administrator bypass attempt.

## Disposable PR #4 experiment

[PR #4](https://github.com/mcpf8hwgyb-ship-it/smile-track/pull/4) identifies itself as
a temporary G01 protection test that must not be merged. The following records
were independently read from GitHub, including job steps and decoded logs:

| Evidence | Verified observation |
| --- | --- |
| Failed [run 38311018467](https://github.com/mcpf8hwgyb-ship-it/smile-track/actions/runs/38311018467) | Completed with `failure`, head `30c8f1e669ee196f5d6c46d3ffd5f47bbd0587bf`, job `115016499329` |
| Failure cause | Lint rejected unused `g01IntentionalTypeFailure` in `app/page.tsx` under `@typescript-eslint/no-unused-vars`; later validation steps were skipped |
| Passing [run 38311416569](https://github.com/mcpf8hwgyb-ship-it/smile-track/actions/runs/38311416569) | Completed with `success`, head `d426ac6310b2c75c1e071e86f5f3f8ab8b97262e`, job `115017789975` |
| Passing-run scope | Install, lint, types, education/F02 synthetic tests, export guards, browser checks, both negative controls and audit passed |
| Closure | PR state `closed`, `merged: false`, `merged_at: null`; closed 2026-10-12 at 21:38:00 UTC |
| Temporary branch | `g01-protection-test`; its ref endpoint returned 404 after closure, verifying it is absent |
| Main | Remains `53337472c46a8c0dc0cbd83c4157bc8831b05d65`; no experiment commit entered main |

The passing run recorded five education tests, four F02 synthetic tests with one
restricted-data skip, four Home/Learn browser cases, zero published lessons, successful
deliberate-leak rejection and zero reported dependency vulnerabilities. Its deliberate
missing-safety-copy assertion failure is the expected negative control, not a CI failure.
The earlier failed run stopped at **lint**, not an observed TypeScript-check failure.

The Architect/Owner's experiment and closure observations are historical evidence;
this Builder did not operate or independently witness the merge-button UI during
the failed/passing phases. The run outcomes, closed-unmerged PR, current absent ref
and unchanged main are independently verified here. These records plus active rules
support the technical-governance closure; they are not a replay of a rejected merge,
direct push, force push, deletion or administrator-bypass attempt. No such potentially
destructive enforcement experiment was repeated in this documentation task.

## Governance boundary

Enforced PR, CI, freshness and conversation-resolution requirements are technical
safeguards. **Independent GitHub approval is not currently required.** The Project
Owner may self-merge a passing, up-to-date PR once conversations are resolved. This
is **not independent human review** and does not replace Architect task selection or
the requirement for Builder merge authorization.

Independent GitHub approval may be enabled through a separately authorized governance
change when an actual second maintainer becomes available. No second maintainer,
reviewer or approval is invented to satisfy a setting.

Dental/health content still requires separately authorized, qualified substantive
human review and an explicit publication decision under
[CONTENT_EVIDENCE.md](CONTENT_EVIDENCE.md). E01's contract, authority requirements and
publication gate are unchanged. The production lesson and authority registries remain
empty. A successful `validate` check does not establish dental accuracy, credentials,
review independence, clinical certification or regulatory compliance.

The code repository is public; frozen Dundee source assets remain restricted and
outside the repository and production export. Public visibility authorizes neither
their distribution nor application deployment. Stage 09C remains CLOSED with
`OUTWARD_PROVISIONAL_V1`, internal-only, NOT_CERTIFIED, and public educational
suitability NOT_ESTABLISHED. F02 remains internal feasibility only; its original-texture
real-device suitability and full GPU reclamation limitations remain unresolved.

## Reconciled project state

| Milestone | Current accepted state and evidence |
| --- | --- |
| F01 | COMPLETE; [PR #1](https://github.com/mcpf8hwgyb-ship-it/smile-track/pull/1), merge `2aa706c5ea609dc41b6e0cdca6969b847f75d0af` |
| Stage 09C | CLOSED with frozen `OUTWARD_PROVISIONAL_V1`; original closure provenance and scientific limitations retained in [F02_REPORT.md](F02_REPORT.md) |
| F02 | COMPLETE; internal feasibility only; [PR #2](https://github.com/mcpf8hwgyb-ship-it/smile-track/pull/2), merge `a95a8ff1831900e6148a00c3681d928518bd8875` |
| E01 | COMPLETE; empty education foundation only; [PR #3](https://github.com/mcpf8hwgyb-ship-it/smile-track/pull/3), merge equals this task's baseline; [post-merge CI 38304062354](https://github.com/mcpf8hwgyb-ship-it/smile-track/actions/runs/38304062354) passed |
| G01 | COMPLETE; solo-maintainer technical governance described above |

G01-DOC adds dated current entries to CURRENT_STATE, ROADMAP, DECISIONS,
CONTENT_EVIDENCE and VALIDATION_LOG, and a brief README governance section.
All prior document bodies remain intact. Earlier pending-review/private-repository
wording is historical and superseded, not silently rewritten. Original scientific
closure records, master specification, implementation, tests, dependencies and workflow
behavior are unchanged. No subsequent application task is selected.

## G01-DOC validation and review handoff

Branch: `g01-doc-governance-closure`. Base is the exact main SHA above.
Only seven Markdown files are in scope: README.md; docs/G01_REPORT.md;
docs/CURRENT_STATE.md; docs/ROADMAP.md; docs/DECISIONS.md;
docs/VALIDATION_LOG.md; docs/CONTENT_EVIDENCE.md.

Validation results are recorded in [VALIDATION_LOG.md](VALIDATION_LOG.md).
The final commit, review PR and exact-head `validate` result are recorded in the
PR handoff after observation; no pending run is represented as passing.
No merge is authorized before Architect review. Stop after G01-DOC.
