# F02 — Internal integration evidence, 2026-10-12

## Additive acceptance record — 2026-10-12

The Architect approved the reviewed F02 head `a93ad3a600c85cc4949da93b44c7ba6a668636c8`.
PR #2 merged into main at `a95a8ff1831900e6148a00c3681d928518bd8875`; post-merge
CI `38215252635` passed. Acceptance is solely for internal feasibility investigation.
The original report below, including its pre-review wording, remains unchanged.
No scientific or public-release status changed. E01 does not extend the 3D investigation.

---

**Builder determination: PASS — FEASIBLE FOR FURTHER INTERNAL INTEGRATION REVIEW.**
Transform conformance and controlled rendering are demonstrated. This is not
Architect acceptance, anatomical certification, real-device qualification, or
public-release approval. Direct original-texture mobile suitability remains
**INCONCLUSIVE**: no physical mobile hardware or GPU-memory measurement was available.

Implementation commit: `11b43514877a7a85b949e07c193a82c6fcfc6f8d`.
[Draft review PR #2](https://github.com/mcpf8hwgyb-ship-it/smile-track/pull/2).
[Observed CI PASS](https://github.com/mcpf8hwgyb-ship-it/smile-track/actions/runs/38213722829)
includes all required checks; restricted scientific tests remain controlled local evidence.
See the dated CI entry in VALIDATION_LOG.md for exact tested head/merge/job references.

## Repository and historical reconciliation

Inspected/rechecked `main`: `2aa706c5ea609dc41b6e0cdca6969b847f75d0af`.
PR #1 was merged on 2026-10-08 02:54:46 UTC. F01 is complete; its original
local/CI results remain unchanged in VALIDATION_LOG.md. Working branch:
`f02-internal-3d-feasibility`. Final commit/PR/CI references are recorded in the
review PR and the dated validation addendum; this report does not claim a future CI result.

Scientific closure record `SMILE_TRACK_B_STAGE09C_CLOSURE_2026-10-11`, authority
SCIENTIFIC_LEAD, accepts `OUTWARD_PROVISIONAL_V1` as a staged provisional
engineering milestone for internal development. Archived Gate B remains
`GATE_B_INCOMPLETE_AND_NOT_TESTED_INTERACTIVE`; later closure records
`PASS_OWNER_ATTESTED` (macOS 15.7.9, Python 3.12.15, VTK 9.6.2).
The closure explains the chronology. Native VTK was not independently rerun by
this Builder; its archived conventions and controls served as behavioral reference.
This is an additive transition, not a rewrite of historical evidence.

## Immutable input verification

Four supplied archives were independently checked: pinned whole-file SHA-256,
ZIP CRC, unique/safe member names, complete checksum-manifest coverage, and every
member hash (271 entries). Actual local filenames follow; canonical names omit
copy suffixes and the upload's `02-` prefix. The original upload corresponds to
`SMILE_TRACK_B_STAGE09C_NEW_CHAT_HANDOFF (1).zip`.

| Actual supplied/local archive | SHA-256 | Members checked |
| --- | --- | ---: |
| 02-SMILE_TRACK_B_STAGE09C_NEW_CHAT_HANDOFF-1-.zip | a473b9850447295136a6f4abce952836728ee19053b83f56df1da001a8e9cafa | 156 |
| SMILE_TRACK_B_STAGE09C_07_SCENE (1).zip | 5276e4be6ce01bcbcf92996192dd76339e768026dec49f024548f4a9ac1231c0 | 33 |
| SMILE_TRACK_B_STAGE09C_07_EVIDENCE (1).zip | f1f187092a1ca23697abc4ba77f3adfe912665bfe1a571161f166ad40e736252 | 79 |
| SMILE_TRACK_B_STAGE09C_CLOSURE_RECORD(1).zip | 418f9978a5abc32e9fca6e1df918ce2b7029464a62250bfb464e602f774ebb10 | 3 |

Scene sources match originals byte-for-byte before and after controlled preparation.
All 16 copied assets were rehashed after browser testing; no GLB was rewritten.
Scene metadata and transforms match the evidence package byte-for-byte; the closure
pins scene/evidence and limitations. The closure cites a ten-archive historical
review: only the four supplied archives above were independently repeated here.
The accepted 09C-06 archive reference is
`0973b56968f82c91e8f4d4a2681b036ffe4db1adbd857369279cb2ee0c3f5ab9`;
its transform record is consumed from the hash-verified scene/evidence copies.
No unexplained provenance conflict was found.

Machine-readable inventory: [integrity.json](f02/integrity.json), including all
source before/after hashes and 32 IDs. Matrices, vertex fixtures, GLBs, and full
scientific registry remain restricted local inputs and are not committed.
Recorded attribution is University of Dundee, School of Dentistry; CC-BY-4.0,
source URLs, titles, and embedded/historical license evidence are retained per
source in generated metadata and displayed internally. No new legal verification
or anatomical interpretation is claimed.

## Contract and conformance

`internal/f02/contract.ts` defines strict runtime validation and TypeScript types
for `f02-manifest-1`: 16 unique immutable glTF 2.0 sources, 32 unique A/B
instances, archive/source/transform hashes, attribution, bounds, camera reference,
and the full preserved scientific registry. Invalid counts, duplicate identities,
source/arch/parity mappings, missing statuses/flags, nonfinite or non-affine matrices
fail closed. Validated metadata is recursively frozen.

`prepare.py` copies accepted JSON numbers without placement recomputation. Scientific
truth is the frozen archives; generated metadata is an application-facing mapping;
camera/visibility/materials are transient presentation; public educational claims
remain unapproved. Instances join uncertainty/provenance through `sourceId` to the
scientific registry's `type_id` and source attribution; all global statuses apply.
Mode membership is deterministic from `arch`: combined includes 32; maxillary and
mandibular local modes include their respective 16. Combined uses the accepted
`source_local_to_display`; local views use `source_local_to_candidate`.

Coordinates are raw source-local, uncalibrated, with identity basis conversion.
Matrices are stored as four row-major rows and multiply column vectors. The adapter
explicitly converts storage for Three.js and applies the scientific matrix once.
Inherited GLB node matrices are retained for verification, never parented or applied
to the renderable raw geometry. No millimeter conversion exists.

All position/index arrays hash-identically to the frozen decoder output. All
856,176 unique triangles and 432,676 vertices are preserved, including the
mandibular canine's two components (47,672 and 7,384 triangles). Component membership
covers every triangle exactly once during preparation. 32 instances render
1,712,352 triangles using 16 shared geometries and separate Mesh objects;
InstancedMesh, transform baking, index reversal, and geometry optimization are absent.

Controlled tests passed exact matrix/source/instance equality and 2,596,056
vertex evaluations across three modes. Maximum JS adapter/direct-row arithmetic
difference: 0. Independent NumPy oracle samples use absolute 1e-11 + relative 1e-12
tolerance for float64 arithmetic (not scientific accuracy). Source arrays remain
float32; GPU precision and pixels are not claimed bitwise equivalent. Every
instance rejects deliberately transposed storage and doubled inherited transforms
through a numerical mismatch >1e-6. A/B determinant signs and inverse-transpose
normal/winding relationships pass. DoubleSide is an explicitly reversible display
choice; indices and all components remain untouched. Representative A and reflected
B each produced non-background pixels in both presentations and viewport classes.
This detects complete culling, not anatomical validity or exhaustive visual equivalence.

## Controlled browser observations

Linux 6.18.44 x86_64; Node 24.19.0/npm 11.9.0; 9 visible CPU threads,
10,451,464,192 host bytes reported (not a phone memory limit). Three 0.186.1;
Playwright 1.64.0 driving Chromium 153.0.8010.0 from external test-only
`@sparticuz/chromium` 153.0.0. Renderer: ANGLE/Vulkan SwiftShader software WebGL2;
max texture dimension 8192. DPR 1. Desktop 1440×1000; mobile emulation 390×844,
touch enabled, 4× CDP CPU throttling. No physical mobile GPU/device was tested.

Each load read 58,785,460 source GLB bytes, including embedded texture bytes even
when solid overrides skipped image decoding. This counts source payloads, not
HTTP overhead, bundle bytes, or end-user network transfer. No external requests
were observed. Decode totals exclude network/hash time; material parse/decode
includes GLTFLoader's temporary mesh parse. First usable frame includes manifest,
source fetch/hash/decode, serial uploads and a final WebGL finish. Frame intervals
cover a short orbit/zoom window and rendering, not pure GPU execution time.

| Final observed run | Ready ms | Geometry decode ms | Original material parse/decode ms | Median / P95 frame interval ms | Samples |
| --- | ---: | ---: | ---: | ---: | ---: |
| Desktop / solid | 670.3 | 193.7 | 0.0 | 16.7 / 142.3 | 47 |
| Desktop / original | 4799.2 | 168.9 | 2134.2 | 16.7 / 153.3 | 34 |
| Mobile emulation / solid | 2276.8 | 603.4 | 0.0 | 17.1 / 306.1 | 39 |
| Mobile emulation / original | 10662.2 | 540.4 | 4276.5 | 17.0 / 262.6 | 33 |

[Final raw metrics](f02/browser-results.json) and [earlier valid run](f02/browser-initial-valid-run.json)
are sanitized aggregate records without matrices, geometry, screenshots, traces,
or restricted asset URLs. Timings are exploratory on a shared host, not a controlled
performance benchmark: the earlier valid run overlapped dependency installation
and showed original-texture readiness of 11.9 s desktop / 17.2 s emulated mobile.
Do not treat single-run medians as a performance guarantee or invent a pass budget.

Solid mode decoded 0 source textures; original mode decoded all 24 (asserted), with
renderer counts 1 and 25 respectively. The additional texture remains counted even
after all tracked source resources are disposed. All original ImageBitmaps were
closed (24), tracked texture/material/geometry/actor collections cleared, and
geometry count returned to 0. Renderer disposal and browser-context closure occur;
complete GPU reclamation and the residual internal texture's lifecycle are not
independently measured. No context loss or WebGL errors occurred in these runs.
JS heap readings are Chromium's coarse `performance.memory`, excluding GPU and
most decoded images; they are not total process or texture memory.

**Estimate, not measured allocation:** 24 × 4096² × 4 = 1,610,612,736 bytes
(1.5 GiB) decoded RGBA; full mip chains approximately 2,147,483,648 bytes (2 GiB),
before geometry/driver overhead. Solid overrides retain original file bytes and
geometry while avoiding image decode/upload. They do not constitute an optimized
asset derivative.

Mode switching retained 32/16/16 visibility counts; isolation retained one;
camera interaction left all scientific matrices unchanged. Partial load failures
on the third source (404 and malformed/hash mismatch) released existing geometry
and returned explicit errors. WebGL2-unavailable simulation returned
`WEBGL2_UNAVAILABLE`. These are controlled failure simulations, not hardware-failure
certification. No model images, screenshots or traces were recorded/uploaded.

## Isolation and privacy

The harness binds only 127.0.0.1:4174 with a random per-process path, exact Host/
Origin checks, GET allowlist, no-store responses and restrictive CSP. Embedded
blob image decoding is explicitly permitted; no external texture URL is allowed.
The token is a local development boundary, not production authentication. Never
forward the port, host the bundle, or share its URL. Assets are served only from a
verified external data directory; Next routes never import the harness. It bundles
in memory (`write:false`), not a deployable directory. `.gitignore` excludes
GLB/glTF/ZIP and generated records remain outside the repo. Guard checks reject
restricted names, GLB magic, manifest/viewer markers and symlinks in app/public/out.
Synthetic negative controls demonstrate that guard rejection actually occurs.

CI has read-only permissions, no source-archive fetching, no scientific fixtures,
no screenshot/trace upload, and no artifact upload step. F01 smoke traces, if any,
contain only the unchanged public landing shell and remain ignored. No patient
records, tracking, cloud processing, credentials, or storage service was introduced.
This baseline is not a comprehensive security assessment or a deployment access-control design.

## Reproduction

Application/CI require only Node/npm and the committed lockfile. Controlled scientific
preparation additionally used Python 3.12.14 and NumPy 2.3.5. Use the four exact
archive hashes above in a restricted local directory outside the checkout.
`prepare.py` uses assertions as fail-closed integrity checks: do not run Python with `-O`.

```sh
npm ci
npm run lint
npm run typecheck
npm run test:f02
NEXT_TELEMETRY_DISABLED=1 npm run build
npm run check:export
npx playwright install --with-deps chromium
npm run test:e2e
npm run test:smoke-sensitivity
npm audit --audit-level=high

python internal/f02/prepare.py \
  --original '../project_sources/02-SMILE_TRACK_B_STAGE09C_NEW_CHAT_HANDOFF-1-.zip' \
  --scene '../f02-controlled-inputs/SMILE_TRACK_B_STAGE09C_07_SCENE (1).zip' \
  --evidence '../f02-controlled-inputs/SMILE_TRACK_B_STAGE09C_07_EVIDENCE (1).zip' \
  --closure '../f02-controlled-inputs/SMILE_TRACK_B_STAGE09C_CLOSURE_RECORD(1).zip' \
  --out ../f02-controlled-runtime
export F02_DATA_DIR=../f02-controlled-runtime
npm run test:f02:controlled
npm run f02:browser
# Or manual controlled inspection (stop with Ctrl-C):
npm run f02:serve
```

This environment's standard Playwright Chromium download returned an invalid ZIP.
The local fallback used `F02_CHROMIUM_PATH` pointing to the external Chromium binary,
`F02_SOFTWARE_GL=1`, `LD_LIBRARY_PATH` to its runtime directory and `FONTCONFIG_PATH`
to its fonts directory. F01 smoke tests used the same binary through
`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`. CI uses the normal Playwright installer;
local fallback success must not be reported as bundled-browser success.

## Limitations and Architect decisions

- Accept or reject this F02 evidence; no merge or F03 is automatic.
- Retain Three.js for further internal review; no material stack incompatibility found.
- Approve real mobile/device and long-session resource testing before production suitability claims.
- Decide delivery strategy: full original textures carry an estimated 2 GiB mipmapped
  texture cost. Any texture-only delivery derivative or revised loading policy needs
  separate authorization; no such derivative was made. Geometry-changing work also
  requires Scientific Lead authorization.
- Investigate residual renderer texture accounting and actual process/GPU memory on
  target hardware before treating repeated reset as a proven bounded-memory lifecycle.
- Suggested budgets for discussion only: first usable frame ≤5 s and interaction
  P95 ≤50 ms on an explicitly selected target device, with a separately agreed total
  memory ceiling. Current results do not establish compliance with those proposals.
- Narrow GLB decoder supports only this hash-pinned representation, not arbitrary uploads.
  React Hooks lint was added compatibly; full Next/React lint coverage remains incomplete.
- Original material comparison loads GLTFLoader's temporary geometry in addition to
  the raw decoder and disposes it; this is an investigation implementation, not a
  production asset pipeline. Mobile memory caps, touch interaction coverage, Safari,
  screen readers and qualified anatomical review remain untested.
- Security/access-control design is required before any shared hosting. Public release,
  certification, calibration, numbering, contacts and occlusion remain unauthorized.

## Source and instance inventory

| Source identity | Original filename | SHA-256 (before = after) |
| --- | --- | --- |
| maxillary_central_incisor | `maxillary_left_central_incisor(1).glb` | `f2228381354e29d1d207df2f1ce33d2a781ccc67b018aa05c98d5d0319ac8db9` |
| maxillary_lateral_incisor | `maxillary_lateral_incisor(2).glb` | `ba580fa83a1ed4cd3ce81eba564d24ffd2c6bcf6a10e7ee457c1ebd6c42f2962` |
| maxillary_canine | `maxillary_canine(2).glb` | `ed392a07ff63737e8c4e29ce2aecd42fbba89f6e27d746ccd6c1b4c902ae5336` |
| maxillary_first_premolar | `maxillary_first_premolar.glb` | `9b1f6fb6808f4cd1c49568ccaa8077d28e719edcb752f9ebe256ff726ec9a583` |
| maxillary_second_premolar | `maxillary_second_premolar.glb` | `06e1b569f1ee8b58749e340ad0f8bcb4877ce875f7c9c132e185d13fb1c2b4b6` |
| maxillary_first_molar | `maxillary_first_molar.glb` | `fa9dd4ce00a6bad08c7ff6311f1966aad91eedee81b34c31966f5225284ea7d3` |
| maxillary_second_molar | `maxillary_second_molar.glb` | `708ed5ee854af6a81526202e5c7f9703a88d67bcf4593ff379beecfbae12841e` |
| maxillary_third_molar | `maxillary_third_molar.glb` | `30f1bcb5a7fe412d586b24da7834411a54f0d44244e6d6521b63a18cd9d950e2` |
| mandibular_central_incisor | `mandibular_left_central_incisor(2).glb` | `090164b042cada566c558da6a6caa05ca0d6d1962a04b876a3c4e5a6e690cd67` |
| mandibular_lateral_incisor | `mandibular_left_lateral_incisor(2).glb` | `941563a672c364e7edbe4ba4db2362382b76d74a02f9cbba655083013a1a61b0` |
| mandibular_canine | `mandibular_left_canine(2).glb` | `5ea2839a41122b4fb32a12dc2fb05c0fe69c1b1ad3dfa33f8c0fa239e2742bcb` |
| mandibular_first_premolar | `mandibular_first_premolar.glb` | `debf625167af597f5c9bba60185c8621ae6a49d6925357749f4926c74ab761db` |
| mandibular_second_premolar | `mandibular_left_second_premolar.glb` | `ae42399fee979e9b283c277a97256643ed278c5292f4ea6797c9afaaa7e5fd8d` |
| mandibular_first_molar | `mandibular_first_molar (1).glb` | `e507faf796b154f88aea7b175dc1d2401efcb1933a2b469bf1989f001ad15b00` |
| mandibular_second_molar | `mandibular_second_molar.glb` | `caf2c380c2403b40873e1963a0450a1b7e497cee3666f43e3de0b268e154d926` |
| mandibular_third_molar | `mandibular_third_molar.glb` | `bbf9cf56c9de286225423561770d1b856eb101871119aab8fb9f06640b6aa7d0` |

All exact accepted instance mappings (A/B remain computational labels):

- `maxillary_central_incisor_orientation_A` → `maxillary_central_incisor`
- `maxillary_lateral_incisor_orientation_A` → `maxillary_lateral_incisor`
- `maxillary_canine_orientation_A` → `maxillary_canine`
- `maxillary_first_premolar_orientation_A` → `maxillary_first_premolar`
- `maxillary_second_premolar_orientation_A` → `maxillary_second_premolar`
- `maxillary_first_molar_orientation_A` → `maxillary_first_molar`
- `maxillary_second_molar_orientation_A` → `maxillary_second_molar`
- `maxillary_third_molar_orientation_A` → `maxillary_third_molar`
- `maxillary_central_incisor_orientation_B` → `maxillary_central_incisor`
- `maxillary_lateral_incisor_orientation_B` → `maxillary_lateral_incisor`
- `maxillary_canine_orientation_B` → `maxillary_canine`
- `maxillary_first_premolar_orientation_B` → `maxillary_first_premolar`
- `maxillary_second_premolar_orientation_B` → `maxillary_second_premolar`
- `maxillary_first_molar_orientation_B` → `maxillary_first_molar`
- `maxillary_second_molar_orientation_B` → `maxillary_second_molar`
- `maxillary_third_molar_orientation_B` → `maxillary_third_molar`
- `mandibular_central_incisor_orientation_A` → `mandibular_central_incisor`
- `mandibular_lateral_incisor_orientation_A` → `mandibular_lateral_incisor`
- `mandibular_canine_orientation_A` → `mandibular_canine`
- `mandibular_first_premolar_orientation_A` → `mandibular_first_premolar`
- `mandibular_second_premolar_orientation_A` → `mandibular_second_premolar`
- `mandibular_first_molar_orientation_A` → `mandibular_first_molar`
- `mandibular_second_molar_orientation_A` → `mandibular_second_molar`
- `mandibular_third_molar_orientation_A` → `mandibular_third_molar`
- `mandibular_central_incisor_orientation_B` → `mandibular_central_incisor`
- `mandibular_lateral_incisor_orientation_B` → `mandibular_lateral_incisor`
- `mandibular_canine_orientation_B` → `mandibular_canine`
- `mandibular_first_premolar_orientation_B` → `mandibular_first_premolar`
- `mandibular_second_premolar_orientation_B` → `mandibular_second_premolar`
- `mandibular_first_molar_orientation_B` → `mandibular_first_molar`
- `mandibular_second_molar_orientation_B` → `mandibular_second_molar`
- `mandibular_third_molar_orientation_B` → `mandibular_third_molar`

Unchanged global scientific registry:

- `PHYSICAL_CALIBRATION_UNRESOLVED`
- `DEVELOPMENT_SCALE_PROVISIONAL`
- `MANDIBULAR_INCISOR_IDENTITY_PROVISIONAL_UNRESOLVED`
- `MAXILLARY_CANINE_LATERALITY_UNRESOLVED`
- `OTHER_LATERALITY_PROVISIONAL`
- `A_B_ANATOMICAL_SEMANTICS_UNRESOLVED`
- `ANATOMICAL_AXES_PROVISIONAL`
- `CEJ_UNRESOLVED`
- `MANDIBULAR_CANINE_INTERNAL_SHELL_UNRESOLVED`
- `ARCH_FORM_UNRESOLVED`
- `CONTACTS_UNRESOLVED`
- `OCCLUSION_UNRESOLVED`
- `NUMBERING_DEFERRED`
- `QUALIFIED_ANATOMICAL_REVIEW_NOT_REVIEWED`
- `ANATOMICAL_CERTIFICATION_NOT_CERTIFIED`

The full 16 inherited frame-sensitivity flags and per-source scientific records are
preserved verbatim in controlled metadata. No flag was resolved or reclassified.

## Changed files

- `.github/workflows/ci.yml`
- `.gitignore`
- `README.md`
- `docs/CONTENT_EVIDENCE.md`
- `docs/CURRENT_STATE.md`
- `docs/DECISIONS.md`
- `docs/F02_REPORT.md`
- `docs/MASTER_PROJECT.md`
- `docs/ROADMAP.md`
- `docs/VALIDATION_LOG.md`
- `docs/f02/browser-initial-valid-run.json`
- `docs/f02/browser-results.json`
- `docs/f02/integrity.json`
- `eslint.config.mjs`
- `internal/f02/adapter.ts`
- `internal/f02/boundary.test.mjs`
- `internal/f02/browser-check.mjs`
- `internal/f02/conformance.test.ts`
- `internal/f02/contract.ts`
- `internal/f02/main.tsx`
- `internal/f02/package.json`
- `internal/f02/prepare.py`
- `internal/f02/raw-glb.ts`
- `internal/f02/require-data.mjs`
- `internal/f02/server.mjs`
- `internal/f02/viewer.ts`
- `package-lock.json`
- `package.json`
- `playwright.config.ts`
- `research/stage09c/README.md`
- `scripts/check-export-boundary.mjs`
- `tsconfig.json`
