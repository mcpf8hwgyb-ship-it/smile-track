# Smile Track

An early foundation for oral-health education and tracking. This preview is not a diagnostic medical device. Education, tracking, capture, accounts, and analysis are not implemented.

## Local setup

Use Node.js **24.19.0** (`nvm install && nvm use` where nvm is available) and npm **11.9.0** (`npm install --global npm@11.9.0`).

```sh
git clone https://github.com/mcpf8hwgyb-ship-it/smile-track.git
cd smile-track
git switch f01-app-foundation
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
npm run build
npm run test:e2e
npm run test:smoke-sensitivity
npm audit --audit-level=high
npm run preview
```

Preview: http://127.0.0.1:4173. `npm run validate` combines lint, typecheck, build, and smoke tests after browser installation. The sensitivity command deliberately removes safety wording from generated HTML, requires the content assertion to fail, and restores the file in a finally block. Run it after a passing smoke test.

`next build` generates `out/`, including index.html and 404.html. Hosting needs only these static files; no Node runtime is required in production. Do not use `next start` for this export. Hosting remains unselected. The loopback-only Node preview script is development tooling, not production infrastructure.

## Structure

- `app/`: static App Router layout and landing screen, CSS Modules and standard CSS.
- `tests/`, `playwright.config.ts`: Chromium desktop (1440×1000) and mobile emulation (390×844), keyboard navigation, required copy, overflow and baseline privacy assertions.
- `scripts/`: static-file preview and smoke-test negative control.
- `.github/workflows/ci.yml`: clean install, lint, types, export, browser tests, negative control, and dependency audit; read-only permissions and SHA-pinned actions.
- `docs/`: current state, accepted decisions, roadmap, and validation evidence.
- `research/`: reserved scientific context, excluded from the app.

No external fonts, imagery, accounts, analytics, cookies, user-data entry, or storage APIs are used. Do not add secrets or health data to fixtures, logs, or the repository. `.gitignore` excludes credentials, dependency directories, generated output, and test traces. Dependency audits and smoke tests are limited checks, not compliance certification.

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

## Review status

F01 requires Architect review before merge. See `docs/VALIDATION_LOG.md` for observed local and CI results; configured checks are not evidence that they passed. Stage 09C and its scientific uncertainties are unchanged.
