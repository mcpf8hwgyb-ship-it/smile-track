import { z } from 'zod';
const finite = z.number().finite();
const row = z.tuple([finite, finite, finite, finite]);
export const matrixSchema = z.tuple([row, row, row, row]).refine(m => m[3].every((v,i) => v === (i===3 ? 1 : 0)), 'Affine matrix required');
export type Rows = z.infer<typeof matrixSchema>;
const hash = z.string().regex(/^[a-f0-9]{64}$/);
export const modes = ['COMBINED_EXPLODED_NONOCCLUSAL','MAXILLARY_ARCH_LOCAL','MANDIBULAR_ARCH_LOCAL'] as const;
export type Mode = typeof modes[number];
const primitive = z.object({positionSHA256:hash,indexSHA256:hash,positions:z.number().int().positive(),triangles:z.number().int().positive(),components:z.number().int().positive()}).strict();
const schema = z.object({
 schemaVersion:z.literal('f02-manifest-1'),baseline:z.literal('OUTWARD_PROVISIONAL_V1'),authorization:z.literal('INTERNAL_ONLY'),certification:z.literal('NOT_CERTIFIED'),publicRelease:z.literal('NOT_ESTABLISHED'),
 coordinates:z.object({geometry:z.literal('RAW_MESH_LOCAL'),matrixStorage:z.literal('ROW_MAJOR_ROWS'),vectors:z.literal('COLUMN'),composition:z.literal('APPROVED_MATRIX_TIMES_RAW_POSITION_ONCE'),units:z.literal('UNCALIBRATED_SOURCE_LOCAL_DEVELOPMENT_UNITS'),basisConversion:z.literal('IDENTITY')}).strict(),
 sources:z.array(z.object({id:z.string().regex(/^[a-z_]+$/),originalFilename:z.string(),originalReference:z.string(),sha256:hash,format:z.literal('glTF 2.0 GLB'),immutable:z.literal(true),bytes:z.number().int().positive(),attribution:z.record(z.string(),z.unknown()),inheritedNodeMatrix:matrixSchema,primitives:z.array(primitive).min(1),images:z.array(z.object({width:z.number().int().positive(),height:z.number().int().positive(),compressedBytes:z.number().int().positive()}))}).strict()).length(16),
 instances:z.array(z.object({id:z.string(),sourceId:z.string(),arch:z.enum(['maxillary','mandibular']),orientation:z.enum(['A','B']),expectedParity:z.union([z.literal(1),z.literal(-1)]),candidate:matrixSchema,display:matrixSchema}).strict()).length(32),
 modes:z.tuple([z.literal(modes[0]),z.literal(modes[1]),z.literal(modes[2])]),
 bounds:z.record(z.enum(modes),z.object({C:z.tuple([finite,finite,finite]),D:finite.positive(),min:z.array(finite).length(3),max:z.array(finite).length(3)})),
 scientificRegistry:z.object({statuses:z.tuple([z.literal("PHYSICAL_CALIBRATION_UNRESOLVED"),z.literal("DEVELOPMENT_SCALE_PROVISIONAL"),z.literal("MANDIBULAR_INCISOR_IDENTITY_PROVISIONAL_UNRESOLVED"),z.literal("MAXILLARY_CANINE_LATERALITY_UNRESOLVED"),z.literal("OTHER_LATERALITY_PROVISIONAL"),z.literal("A_B_ANATOMICAL_SEMANTICS_UNRESOLVED"),z.literal("ANATOMICAL_AXES_PROVISIONAL"),z.literal("CEJ_UNRESOLVED"),z.literal("MANDIBULAR_CANINE_INTERNAL_SHELL_UNRESOLVED"),z.literal("ARCH_FORM_UNRESOLVED"),z.literal("CONTACTS_UNRESOLVED"),z.literal("OCCLUSION_UNRESOLVED"),z.literal("NUMBERING_DEFERRED"),z.literal("QUALIFIED_ANATOMICAL_REVIEW_NOT_REVIEWED"),z.literal("ANATOMICAL_CERTIFICATION_NOT_CERTIFIED")]),flags_reclassified:z.literal(false),inherited_16_review_flags:z.array(z.record(z.string(),z.unknown())).length(16),inherited_scientific_records:z.array(z.record(z.string(),z.unknown())).length(16)}).passthrough(),provenance:z.record(z.string(),z.unknown()),sourceManifestSHA256:hash,transformRecordSHA256:hash,cameraReference:z.string(),
}).strict().superRefine((m,ctx)=>{
 const ids=new Set(m.sources.map(s=>s.id));
 if(ids.size!==16||new Set(m.instances.map(i=>i.id)).size!==32)ctx.addIssue({code:'custom',message:'Duplicate identity'});
 for(const s of m.sources){const is=m.instances.filter(i=>i.sourceId===s.id);if(is.length!==2||new Set(is.map(i=>i.orientation)).size!==2)ctx.addIssue({code:'custom',message:'Each source requires A and B'});}
 for(const i of m.instances)if(i.id!==`${i.sourceId}_orientation_${i.orientation}`||!i.sourceId.startsWith(i.arch+'_')||!ids.has(i.sourceId)||i.expectedParity!==(i.orientation==='A'?1:-1))ctx.addIssue({code:'custom',message:'Invalid source or parity mapping'});
});
export type Manifest = z.infer<typeof schema>;
export type Instance = Manifest['instances'][number];
export type Source = Manifest['sources'][number];
export function freeze<T>(value:T):T {if(value&&typeof value==='object'){Object.freeze(value);for(const v of Object.values(value))freeze(v);}return value;}
export function parseManifest(value:unknown):Manifest{return freeze(schema.parse(value));}
