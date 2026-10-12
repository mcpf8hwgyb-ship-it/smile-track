# SMILE TRACK — MASTER PROJECT PROMPT

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

## 1. PROJECT IDENTITY

You are working on **Smile Track**, a consumer-focused oral-health application.

Smile Track's long-term vision is to make oral health easier to understand, visualize, monitor, and discuss by combining:

- oral-health education;
- interactive dental anatomy;
- personal oral-care tracking;
- visual progress over time;
- guided smartphone mouth photography/scanning;
- eventually, validated computer-vision and 3D oral-analysis capabilities.

The application should help users better understand their mouths and build better oral-health habits.

**Smile Track is not currently a diagnostic medical device.**

Do not present educational information, photographs, 3D models, computer-vision results, AI observations, or future scan results as a professional diagnosis unless a later project stage explicitly establishes the required clinical validation and regulatory basis.

---

# 2. PRIMARY PRODUCT GOAL

Build an approachable, high-quality oral-health platform that turns complicated dental information into understandable visual experiences.

The product should answer questions such as:

- What am I looking at in my mouth?
- What does each tooth do?
- What does healthy oral anatomy generally look like?
- How should I brush, floss, and care for different areas?
- What oral-health changes should I pay attention to?
- How has my mouth changed over time?
- What information could I bring to my dentist?
- How can my phone eventually help me document my oral health?

The application should **educate first, observe second, and diagnose only if a future validated product stage explicitly permits it.**

---

# 3. CURRENT PRODUCT PRIORITY

The current priority is an excellent **oral-health education and visualization app**.

Phone-based oral scanning is an important future capability, but the current product must remain useful before that technology is complete.

Do not make the entire application dependent on a working scanner.

Build the product so scanning can be added incrementally.

### Current product layers

1. **Education**
2. **Interactive anatomy**
3. **Personal oral-care tracking**
4. **Mouth/tooth visualization**
5. **Photo documentation**
6. **Longitudinal history**
7. **Future scan and computer-vision infrastructure**
8. **Future clinically validated analysis**

Each layer should remain modular.

---

# 4. TARGET USER EXPERIENCE

Smile Track should feel:

- modern;
- trustworthy;
- visual;
- simple;
- calm;
- educational;
- medically responsible without feeling clinical or intimidating.

Avoid fear-based messaging.

Avoid presenting normal anatomical variation as pathology.

Use plain language by default and make professional dental terminology available when useful.

The experience should work for users who know almost nothing about dentistry while still containing enough anatomical accuracy to remain useful to knowledgeable users.

---

# 5. CORE MVP PRODUCT AREAS

## A. Home

Create a useful dashboard showing information such as:

- today's oral-care actions;
- brushing/flossing progress;
- education recommendations;
- recent mouth photos;
- oral-health timeline;
- areas the user has marked for attention;
- reminders;
- shortcuts to Learn, My Mouth, and future Scan functions.

Do not fabricate clinical health scores.

If a score is introduced, clearly define what inputs produce it and ensure it represents behavior/engagement rather than unvalidated disease probability.

---

## B. Learn

Create an educational oral-health library.

Topics may include:

- tooth anatomy;
- tooth types;
- enamel;
- dentin;
- pulp;
- roots;
- gums;
- plaque;
- calculus;
- cavities;
- gingivitis;
- periodontal disease;
- brushing;
- flossing;
- interdental cleaning;
- fluoride;
- diet and oral health;
- sensitivity;
- wisdom teeth;
- crowns;
- fillings;
- implants;
- orthodontics;
- common dental terminology.

Educational content should distinguish between:

- normal anatomy;
- common variation;
- potential signs worth discussing with a dental professional;
- confirmed dental disease.

Do not tell the user that they have a condition based solely on educational material.

---

## C. Interactive 3D Dental Education

Use the existing Smile Track dental-model program to eventually create a navigable dental anatomy experience.

Possible interactions include:

- rotate;
- zoom;
- isolate a tooth;
- select a tooth;
- highlight crown/root regions;
- display tooth name/type;
- explain tooth function;
- show educational anatomy overlays;
- compare tooth classes.

The 3D experience should eventually support both:

- individual tooth education;
- complete dentition visualization.

However, complete dentition construction must respect the scientific constraints documented later in this prompt.

---

## D. My Mouth

Create a personal mouth-oriented interface where users can eventually document individual teeth or regions.

Potential capabilities:

- tooth/region selection;
- notes;
- symptoms entered by the user;
- photos;
- dental procedures entered by the user;
- appointments;
- observations;
- care history;
- timeline comparison.

User-entered information must be clearly distinguished from AI-generated observations and from professional diagnoses.

---

## E. Oral-Care Tracking

Support useful behaviors such as:

- brushing;
- flossing;
- interdental cleaning;
- tongue cleaning;
- mouthwash where appropriate;
- retainer care;
- aligner care;
- custom routines.

Favor useful habit tracking over gamification that could encourage unhealthy or excessive cleaning.

---

# 6. FUTURE PHONE SCAN / CAMERA VISION

Design the software architecture now so phone-based oral capture can be added without rebuilding the application.

The scanning system should be modular and separated into stages.

## Capture layer

Eventually support guided capture using a phone camera.

Possible capture workflows can include:

- frontal teeth;
- upper arch;
- lower arch;
- left side;
- right side;
- selected tooth or region;
- short guided video sequences.

Provide real-time capture guidance when technically possible, such as:

- lighting;
- focus;
- blur;
- framing;
- distance;
- camera angle;
- visibility;
- movement.

Do not claim the camera can see structures that are not actually visible.

---

## Quality layer

Before any analysis, determine whether the capture is usable.

Examples:

- sufficient lighting;
- acceptable focus;
- region visible;
- image not excessively blurred;
- sufficient coverage;
- no major obstruction.

A failed quality check should request a better capture rather than generate uncertain medical conclusions.

---

## Analysis layer

Build this as an abstraction/interface so analysis engines can change later.

Potential future capabilities may include:

- tooth localization;
- tooth segmentation;
- visible-surface segmentation;
- gum-region segmentation;
- plaque-like visual feature detection;
- discoloration tracking;
- visible restoration detection;
- longitudinal visual comparison;
- approximate geometry reconstruction;
- 3D reconstruction.

These are development goals, not currently validated clinical capabilities.

Use wording such as:

- "possible visual change";
- "area to review";
- "visible difference";
- "image quality insufficient";
- "consider discussing this area with a dental professional";

rather than declaring disease.

Do not infer pathology when the evidence is inadequate.

---

# 7. LONGITUDINAL TRACKING IS A CORE DIFFERENTIATOR

Design Smile Track around **change over time**, not just one-time image analysis.

Future functionality should make it possible to compare:

- current capture vs previous capture;
- individual tooth regions;
- gum appearance;
- visible discoloration;
- restorations;
- user-entered symptoms;
- oral-care behavior.

When possible, prioritize:

**"This area appears different from your previous capture"**

over:

**"You have disease X."**

This makes the product useful while maintaining appropriate uncertainty.

---

# 8. CLINICAL AND SAFETY BOUNDARY

Smile Track currently provides educational and informational functionality.

Never silently turn an experimental feature into a clinical claim.

For uncertain findings:

- expose uncertainty;
- do not create false precision;
- distinguish observations from conclusions;
- recommend professional assessment when appropriate;
- never claim professional review occurred unless it actually occurred.

Do not claim:

- FDA approval;
- medical-device clearance;
- clinical validation;
- diagnostic accuracy;
- HIPAA compliance;
- professional dental certification;

unless that claim has been independently established and documented for the relevant product/version.

Emergency or urgent symptoms should be directed toward appropriate professional care rather than handled as an AI diagnosis.

---

# 9. PRIVACY PRINCIPLES

Treat mouth photographs, scans, dental history, and related user data as sensitive information.

Architecture should support:

- explicit consent;
- clear explanation of why images/data are collected;
- minimum necessary data collection;
- secure storage;
- secure transmission;
- deletion controls;
- data export where appropriate;
- separation of identity data from analysis data where practical;
- configurable retention;
- avoidance of unnecessary third-party sharing.

Prefer privacy-preserving designs.

Do not add cloud uploads merely because they are convenient if on-device processing can reasonably accomplish the feature.

Never imply compliance with a particular health-data regulation without verification.

---

# 10. ACCESSIBILITY

Build accessibility into the product rather than treating it as a later add-on.

Consider:

- screen readers;
- text scaling;
- sufficient contrast;
- reduced-motion settings;
- understandable error states;
- touch-target sizes;
- captions or text alternatives;
- color-independent indicators;
- plain-language educational explanations.

Important information must never be communicated by color alone.

---

# 11. EXISTING DENTAL MODEL PROGRAM — SOURCE OF TRUTH

A separate scientific/model-development branch exists:

**Smile Track B — Dundee**

The attached/current handoff is:

`SMILE_TRACK_B_STAGE09C_NEW_CHAT_HANDOFF.zip`

Its current state is important.

### Verified source state

The handoff currently contains:

- 16 original Dundee standard permanent-tooth source models;
- 32 existing side-agnostic Orientation A/B derivatives;
- 2 supplemental source assets;
- provenance records;
- historical validation archives;
- stage-state records.

The 16 originals cover:

### Maxillary
1. central incisor
2. lateral incisor
3. canine
4. first premolar
5. second premolar
6. first molar
7. second molar
8. third molar

### Mandibular
9. central incisor
10. lateral incisor
11. canine
12. first premolar
13. second premolar
14. first molar
15. second molar
16. third molar

The 32 derivative models represent A/B orientation variants.

They do **not** yet constitute a validated assembled 32-tooth dental arch.

---

# 12. CRITICAL 3D GEOMETRY RULES

These are project-level constraints.

## Never rewrite original source assets

Original Dundee files must remain byte-preserved.

Do not:

- remesh;
- repair;
- normalize;
- scale;
- rotate and bake;
- mirror and overwrite;
- simplify;
- modify topology;
- delete internal geometry;

unless a future explicitly authorized scientific stage creates a derivative while preserving the source.

Originals are immutable provenance assets.

---

## Physical scale is unresolved

There is currently **no validated conversion from source units to millimeters**.

Do not assume:

`1 source unit = 1 mm`

Do not invent a physical calibration factor.

Do not describe model measurements as real-world millimeter measurements unless a later validated calibration stage establishes that relationship.

---

## Source coordinates versus scene transforms

The Dundee assets contain an important distinction between:

- raw/source-local vertex coordinates;
- node/scene presentation transforms.

Some historical assets contain scene/node scales approximately in the 0.41–0.52 range while others use 1.0.

This does NOT establish a physical conversion.

Current scientific direction is to investigate use of the **unmodified Dundee source-local geometry as development coordinates**, subject to Stage 09C review.

Existing derivative scene scales must not be mistaken for source-local normalization.

---

# 13. STAGE 09C STATUS

The next scientific geometry stage is:

**Stage 09C — Conservative Development-Scale Lock and Transition Toward 32-Tooth Dentition Construction**

Stage 09C has **not yet been executed**.

Its purpose is not to establish physical millimeter calibration.

Its purpose is to determine whether source-local geometry is sufficiently internally coherent to serve as a conservative development coordinate system for subsequent dentition construction.

Do not state that Stage 09C is complete until its required review and records have actually been produced.

---

# 14. UNRESOLVED DENTAL MODEL ISSUES

The following uncertainties must remain visible in project state.

### Mandibular central/lateral incisors

There is a historical metadata identity conflict.

Morphology provisionally supports the current labels, but this is **not anatomical certification**.

Do not silently relabel them.

---

### Maxillary canine laterality

Source-side assignment remains unresolved.

Other laterality assignments remain provisional.

Do not infer unsupported final left/right assignment.

---

### Orientation A/B

`SIDE_A` and `SIDE_B`, or equivalent A/B orientation labels, must **not** automatically be interpreted as mesial/distal, left/right, Universal numbering, or FDI numbering.

---

### CEJ

Circumferential cementoenamel-junction identification is unresolved.

Do not create claims dependent on a validated circumferential CEJ unless a later stage resolves this.

---

### Mandibular canine internal shell

An internal geometry/shell exists and its purpose remains unresolved.

Preserve it.

Do not delete it merely because it appears unexpected.

---

### Carabelli model

A supplemental maxillary first molar with a cusp of Carabelli exists as an educational/anatomical variant.

It is not the replacement standard first molar.

---

### Anatomical certification

The active models have **not received qualified professional anatomical certification**.

Their status remains effectively:

`NOT_REVIEWED / NOT_CERTIFIED`

until documented otherwise.

---

# 15. ARCH CONSTRUCTION RULE

No final 32-tooth arch, contacts, ideal occlusion, or validated tooth placement has yet been established for Track B.

Do not automatically:

- assemble the arch;
- establish interproximal contacts;
- create ideal occlusion;
- assign final Universal numbering;
- assign final FDI numbering;
- establish clinical measurements;

without an explicitly authorized project stage.

Application development should **not be blocked** by these unresolved scientific tasks.

Use isolated teeth, generic diagrams, temporary UI representations, or clearly labeled development visualizations where necessary.

Do not turn placeholder geometry into scientific ground truth.

---

# 16. HISTORICAL CALIBRATION BRANCH

Historical R3–R5 work attempted more detailed physical-calibration landmark validation.

That branch was stopped because measurement-frame and finite-contact definitions could not be reproduced reliably enough for physical calibration.

Do not automatically restart it.

Do not interpret historical numerical records as proof of anatomical validity.

No supported physical calibration factor emerged from that branch.

Historical archives are evidence/provenance, not authorization to resume abandoned experiments.

---

# 17. SEPARATE PRODUCT DEVELOPMENT FROM SCIENTIFIC VALIDATION

There are two related but distinct workstreams.

## Product Track

Can progress on:

- application architecture;
- interface;
- onboarding;
- educational content;
- authentication;
- accounts;
- user settings;
- habit tracking;
- photo management;
- educational tooth explorer;
- histories/timelines;
- accessibility;
- privacy architecture;
- future scan APIs;
- mock analysis results;
- camera UX.

## Scientific Dental Model Track

Requires controlled stage-by-stage work for:

- scale policy;
- geometry interpretation;
- laterality;
- semantic numbering;
- arch placement;
- contacts;
- occlusion;
- landmark validation;
- anatomical certification;
- clinical validation.

Never allow ordinary UI/product development to silently resolve scientific uncertainties.

---

# 18. SOFTWARE ARCHITECTURE PRINCIPLES

Before making architectural changes, inspect the existing repository and preserve good existing decisions.

Prefer:

- modular architecture;
- clear domain boundaries;
- typed interfaces;
- reusable components;
- testable services;
- minimal coupling between UI and analysis engines;
- versioned analysis results;
- deterministic data migrations;
- documented APIs;
- feature flags for experimental features.

Keep these domains separable where practical:

- Authentication
- User profile
- Education
- Dental anatomy
- Oral-care tracking
- Media capture
- Media storage
- Scan sessions
- Scan quality assessment
- Analysis engine
- 3D reconstruction
- Longitudinal comparison
- Notifications
- Privacy/consent
- Professional sharing/export

The analysis engine should be replaceable without rewriting the main app.

---

# 19. FUTURE SCAN DATA MODEL

Design scan sessions with explicit provenance.

A scan/capture record should eventually be able to identify:

- user;
- timestamp;
- capture type;
- device information where appropriate;
- camera/input source;
- original media;
- processed media;
- quality assessment;
- model/algorithm version;
- analysis version;
- output;
- confidence/uncertainty;
- user edits;
- consent state;
- retention state.

Never overwrite historical analysis when an algorithm changes.

Create a new version so longitudinal comparisons remain reproducible.

---

# 20. AI / COMPUTER-VISION OUTPUT RULE

Every AI-generated result should be traceable to:

- the input;
- model/version;
- processing version;
- timestamp;
- confidence or uncertainty where meaningful.

Avoid pseudo-precision.

A result should be allowed to say:

`INSUFFICIENT_EVIDENCE`

or

`CAPTURE_QUALITY_TOO_LOW`

instead of forcing a prediction.

This behavior is preferred over confident guessing.

---

# 21. DESIGN SYSTEM DIRECTION

The visual language should communicate:

- health;
- cleanliness;
- clarity;
- technology;
- trust;
- approachability.

Avoid making the application look like:

- a hospital administration system;
- a children's cartoon;
- a fear-based dental advertisement;
- a generic AI chatbot.

Use the mouth and dental anatomy visually where useful.

3D should serve understanding rather than act as decoration.

Keep screens focused and avoid information overload.

---

# 22. ENGINEERING WORKFLOW

Whenever you are asked to modify the project:

### First

Inspect the relevant existing files.

Do not assume the project architecture.

Identify:

- current implementation;
- affected components;
- existing conventions;
- dependencies;
- tests;
- relevant project-state documentation.

### Then

State the intended change and important constraints.

### Then

Implement the smallest coherent change that moves the product forward.

### After implementation

Verify:

- build status;
- type checks;
- linting where configured;
- relevant automated tests;
- major UI flows;
- no unintended deletion of existing functionality;
- no corruption of dental source assets.

Summarize:

1. what changed;
2. files/components affected;
3. tests performed;
4. remaining limitations;
5. recommended next step.

---

# 23. DO NOT SILENTLY CHANGE PROJECT TRUTH

If new evidence conflicts with existing project documentation:

Do not silently pick one.

Record the conflict.

Distinguish:

- VERIFIED
- PROVISIONAL
- UNRESOLVED
- NOT_REVIEWED
- NOT_APPLICABLE

Prefer an explicit unresolved state over an unsupported assumption.

---

# 24. FILE AND PROVENANCE DISCIPLINE

For important dental/model assets maintain:

- original filename;
- source;
- checksum/hash where available;
- derivative parent;
- transformation history;
- processing version;
- license/attribution;
- status.

Never substitute a derivative for an original while describing it as original.

Never remove provenance simply to make the project structure cleaner.

---

# 25. DEVELOPMENT PRIORITY ORDER

Unless I explicitly direct otherwise, prioritize work in approximately this order:

1. reliable product architecture;
2. excellent oral-health education UX;
3. interactive tooth/anatomy experience;
4. personal oral-care tracking;
5. personal mouth history;
6. photo capture and documentation;
7. capture-quality system;
8. longitudinal image comparison;
9. experimental computer vision;
10. experimental 3D reconstruction;
11. validated scan interpretation;
12. clinically validated capabilities.

A sophisticated scanner is not required before Smile Track becomes useful.

---

# 26. PRODUCT DECISION PRINCIPLE

When deciding between:

- an impressive feature that makes unsupported medical claims;

and

- a simpler feature that accurately communicates what is known;

choose the simpler, scientifically defensible implementation.

When deciding between:

- hiding uncertainty;

and

- clearly representing uncertainty;

represent the uncertainty.

When deciding between:

- blocking the entire app because the scientific model track is unfinished;

and

- designing the application so validated capabilities can be incorporated later;

use modular development and continue building the application.

---

# 27. CURRENT PROJECT NORTH STAR

The eventual experience should allow a person to:

**Learn → See → Record → Compare → Understand → Share with a dental professional**

A future validated version may add:

**Scan → Analyze → Monitor**

but do not prematurely turn those future goals into current clinical claims.

Smile Track should make people more informed about their oral health while respecting the limits of consumer cameras, 3D models, AI, and non-professional interpretation.

---

# 28. INSTRUCTIONS WHEN THE STAGE 09C HANDOFF IS PROVIDED

When `SMILE_TRACK_B_STAGE09C_NEW_CHAT_HANDOFF.zip` is provided for scientific model work:

1. Verify the provided integrity/checksum records.
2. Read:
   - `README_CURRENT_STATE.md`
   - `CURRENT_BLOCKERS.md`
   - `NEXT_STAGE.md`
   - `stage09c_start_state.json`
3. Treat the preserved originals as immutable.
4. Distinguish source-local coordinates from derivative scene transforms.
5. Do not infer physical millimeters.
6. Do not restart R3–R5 automatically.
7. Do not modify geometry before Stage 09C scope is established.
8. Present the proposed Stage 09C scope, evidence, measurements, acceptance criteria, and intended outputs before scientific implementation.
9. Preserve every unresolved identity/laterality/anatomical limitation.
10. Do not claim anatomical or clinical certification.

---

# 29. DEFAULT BEHAVIOR FOR FUTURE DEVELOPMENT CONVERSATIONS

Treat this document as the persistent high-level source of truth for Smile Track.

For each new request:

- determine whether it concerns the **product**, the **scientific model program**, or both;
- respect the boundary between them;
- inspect existing work before replacing it;
- continue from the current state rather than recreating completed work;
- preserve working functionality;
- preserve source assets;
- avoid unsupported medical/scientific assumptions;
- build toward the long-term vision incrementally.

The objective is not merely to create a dental app.

The objective is to create a trustworthy visual oral-health platform whose educational, tracking, imaging, 3D, and future AI capabilities can become progressively more sophisticated without sacrificing scientific integrity.
