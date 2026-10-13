# Smile Track

## R01 review branch — 2026-10-13

R01 is implemented on `r01-private-daily-check-in` from main
`9dbda414f7d9f6b97ef5508a61ad6d5314c8def0`, pending Architect review before merge.
After cloning, use `git switch r01-private-daily-check-in` to review `/routine/`.
F01, F02, E01, G01 and G01-DOC remain complete; Stage 09C remains closed/frozen.
The earlier dated governance entry below retains its historical context.

**My daily routine** records only whether you report brushing or cleaning between
teeth today. It does not assess health, technique or medically appropriate frequency.
Entries default to page memory and disappear on leaving/reloading. Explicit opt-in
saves one current-day record in this browser/device profile; the erase control
clears it and disables saving. A new local day expires the record and consent when
the page runs or next opens. No history or network transmission of entries is added.

Other people using the browser profile may see saved entries. Browser backups,
synchronization and suspended/closed-browser deletion timing are outside the app's
control. Storage failure is reported; if erasure cannot be verified, use browser
site-data controls. See [R01 storage design and evidence](docs/R01_REPORT.md).

The Owner has blocked proposed C01 professional review at this stage; it is not
completed. Educational publication remains blocked under unchanged E01 requirements.
No qualified review, reviewer appointment, lesson, scientific release or deployment
is authorized by this task.


## Current project and governance — 2026-10-12

F01, F02, E01 and G01 are complete; Stage 09C is closed with frozen
`OUTWARD_PROVISIONAL_V1`. F02 is internal feasibility only. E01 provides an empty
education foundation, not approved dental lessons. Use `main` for the completed
foundation; the earlier E01 review-branch instructions below are historical.

This repository is public. Active main-branch protection requires a PR, passing
up-to-date `validate` checks and resolved conversations, with no bypass actors.
Zero approving reviews are required: the Project Owner may self-merge passing PRs.
These are technical safeguards, not independent human review or qualified dental
content approval. The merge-commit workflow is preserved. See
[G01 governance evidence and limitations](docs/G01_REPORT.md).

Public visibility does not authorize deployment or distribution of the restricted
Dundee scientific assets, which are not included here. No open-source license is
currently recorded in the repository; public visibility alone is not an open-source
license. This task adds no license, reviewer appointment, lesson or deployment.

---

An early foundation for oral-health education and tracking. This preview is not a diagnostic medical device. The Learn foundation has an honest empty state; no dental lessons are approved or published. The R01 review branch adds only the daily routine check-in; capture, accounts and analysis are not implemented.

## Local setup

Use Node.js **24.19.0** (`nvm install && nvm use` where nvm is available) and npm **11.9.0** (`npm install --global npm@11.9.0`).

```sh
git clone https://github.com/mcpf8hwgyb-ship-it/smile-track.git
cd smile-track
git switch main
npm ci
export NEXT_TELEMETRY_DISABLED=1
npm run dev
```

Open http://127.0.0.1:3000. The telemetry environment variable disables Next.js development/build telemetry; the application itself has no analytics. On PowerShell use `$env:NEXT_TELEMETRY_DISABLED="1"`.

## Validation and static preview

```sh
npx playwright install --with-deps chromium
npm run lint
npm run typecheck
npm run test:education
npm run test:f02
npm run build
npm run check:export
npm run test:e2e
npm run test:smoke-sensitivity
npm run test:education-sensitivity
npm audit --audit-level=high
npm run preview
```

Preview: http://127.0.0.1:4173. `npm run validate` combines lint, typecheck, education/F02 tests, build, export guards, and smoke tests after browser installation. The sensitivity command deliberately removes safety wording from generated HTML, requires the content assertion to fail, and restores the file in a finally block. Run it after a passing smoke test.

`next build` generates `out/`, including index.html and 404.html. Hosting needs only these static files; no Node runtime is required in production. Do not use `next start` for this export. Hosting remains unselected. The loopback-only Node preview script is development tooling, not production infrastructure.

## Structure

- `app/`: static App Router layout and landing screen, CSS Modules and standard CSS.
- `tests/`, `playwright.config.ts`: Chromium desktop (1440×1000) and mobile emulation (390×844), keyboard navigation, required copy, overflow and baseline privacy assertions.
- `scripts/`: static-file preview and smoke-test negative control.
- `.github/workflows/ci.yml`: clean install, lint, types, export, browser tests, negative control, and dependency audit; read-only permissions and SHA-pinned actions.
- `docs/`: current state, accepted decisions, roadmap, and validation evidence.
- `research/`: reserved scientific context, excluded from the app.

No external fonts, imagery, accounts, analytics or application cookies are used. R01 adds only two user-entered activity values and optional current-day localStorage; no entries are transmitted. Do not add secrets or health data to fixtures, logs, or the repository. `.gitignore` excludes credentials, dependency directories, generated output, and test traces. Dependency audits and smoke tests are limited checks, not compliance certification.

## Pinned direct dependencies

| Package | Version |
| --- | --- |
| next | 16.4.0 |
| react | 19.3.0 |
| react-dom | 19.3.0 |
| @eslint/js | 10.0.1 |
| @playwright/test | 1.64.0 |
| @types/node | 24.19.1 |
| @types/react | 19.3.0 |
| @types/react-dom | 19.3.0 |
| eslint | 10.12.0 |
| typescript | 6.0.3 |
| typescript-eslint | 8.71.1 |

Transitive versions and integrity hashes are recorded in package-lock.json. TypeScript 6.0.3 is selected for parser compatibility. See D-003 for lint preset selection and limitations.

## Internal F02 investigation and review status

F01 and F02 are merged. F02 is accepted solely as an internal feasibility investigation; no public viewer or further 3D work is authorized. [Evidence and reproducible controlled commands](docs/F02_REPORT.md) distinguish actual local checks from CI and preserve Stage 09C closure/uncertainty provenance.

```sh
npm run test:f02       # Synthetic checks; restricted test explicitly skipped without inputs
npm run check:export   # After build: reject restricted assets/manifest/viewer in app/public/out
```

`internal/f02/` is excluded from the application import graph. Do not copy its data into this repository, public/, out/, CI, or any deployment. Full scientific conformance requires the pinned controlled archives and `F02_DATA_DIR` outside the repo. See the report before running `npm run f02:serve` or `npm run f02:browser`.

Additional exact development dependencies: three 0.186.1, @types/three 0.186.0, zod 4.6.6, esbuild 0.28.2, eslint-plugin-react-hooks 7.1.1. No new production dependencies. The controlled preparation script was tested with Python 3.12.14 and numpy 2.3.5; Python is not needed by the application or CI.

When the bundled browser cannot be installed, `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` optionally selects a controlled local Chromium for F01 smoke tests. The fallback version must be reported; CI continues to use Playwright's bundled browser. This option does not change the assertions.


## E01 content foundation

`/learn/` lists only lessons returned by the build-time publication gate. Both
`content/education/records.json` and `authorities.json` are intentionally empty.
No actual content, appointment, evidence review, or publication approval has occurred.
See [content review process](docs/CONTENT_EVIDENCE.md) and [E01 evidence](docs/E01_REPORT.md).
E01 is merged; the default setup tracks main. R01 branch instructions are above.

`education/contract.ts` defines `education-content-1`; `education/catalog.ts` reads
version-controlled inputs at build time and returns only eligible public fields.
Never import raw records, authorities or `education/fixtures.ts` into client code.
The non-medical fixtures are test-only; no real lessons may be added under E01.
No new dependency or dependency version was introduced.

The education sensitivity check temporarily replaces the local catalog with
unpublished synthetic records, builds the actual static site, checks every exported
file, deliberately injects a test marker to prove rejection, then restores the
original catalog and rebuilds in `finally`. Run it alone, with no dev server or
parallel build; it makes no Git commit. Interrupted processes cannot execute cleanup:
restore `content/education/records.json` from Git and rebuild before continuing.
Build and export checks gate publication at build time; an already hosted static
copy would need an authorized rebuild/redeployment to reflect expiry or withdrawal.
Hosting is still unselected. Metadata integrity checks do not verify scientific accuracy,
reviewer credentials or testimony; human appointments and release decisions require
review in Git. The Builder cannot grant itself approval.
