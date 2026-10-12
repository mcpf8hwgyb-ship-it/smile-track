import { createHash } from "node:crypto";
import { z } from "zod";

const text = z.string().trim().min(1);
const id = z.string().regex(/^[a-z][a-z0-9-]*$/);
const date = z.iso.date();
const digest = z.string().regex(/^[a-f0-9]{64}$/);
const https = z.url().refine(value => {
  const url = new URL(value);
  return url.protocol === "https:" && !url.username && !url.password;
}, "An HTTPS URL without credentials is required");
const person = z.object({ id, name: text }).strict();
const source = z.object({
  id, title: text, url: https,
  type: z.enum(["guideline", "systematic-review", "primary-research", "professional-resource", "other"]),
  publisher: text, publishedOn: date.nullable(), revisedOn: date.nullable(), accessedOn: date,
}).strict().refine(s => !s.publishedOn || !s.revisedOn || s.revisedOn >= s.publishedOn,
  "Source revision cannot precede publication");

const contentBaseSchema = z.object({
  schemaVersion: z.literal("education-content-1"),
  id, version: z.number().int().positive(), title: text,
  topic: z.enum(["oral-health", "oral-care", "dental-anatomy", "general"]),
  language: z.literal("en"),
  authors: z.array(person).min(1), editors: z.array(person).min(1),
  // Plain text only: no executable markup, embedded assets, or model references.
  paragraphs: z.array(text).min(1), sources: z.array(source),
  limitations: z.array(text).min(1), safetyNotices: z.array(text).min(1), updatedOn: date,
  evidenceReview: z.discriminatedUnion("status", [
    z.object({ status: z.enum(["draft", "awaiting-review", "changes-required"]) }).strict(),
    z.object({ status: z.literal("reviewed"), reviewedOn: date, reviewDueOn: date,
      evidenceReviewerId: id, subjectReviewerId: id, recordReference: https,
      contentDigest: digest }).strict(),
  ]),
  publication: z.discriminatedUnion("status", [
    z.object({ status: z.enum(["not-approved", "rejected"]) }).strict(),
    z.object({ status: z.literal("approved"), decisionId: id, approvedBy: id,
      approvedOn: date, recordReference: https, contentVersion: z.number().int().positive(),
      contentDigest: digest }).strict(),
  ]),
  lifecycle: z.discriminatedUnion("status", [
    z.object({ status: z.literal("active") }).strict(),
    z.object({ status: z.literal("withdrawn"), changedOn: date, reason: text }).strict(),
    z.object({ status: z.literal("superseded"), changedOn: date, reason: text,
      replacement: z.object({ id, version: z.number().int().positive() }).strict() }).strict(),
  ]),
}).strict();
export type ContentRecord = z.infer<typeof contentBaseSchema>;
export const contentSchema = contentBaseSchema.superRefine((record, ctx) => {
  const fail = (message: string) => ctx.addIssue({ code: "custom", message });
  if (new Set(record.sources.map(s => s.id)).size !== record.sources.length) fail("Duplicate source identity");
  for (const s of record.sources) {
    if (s.accessedOn > record.updatedOn || (s.publishedOn && s.publishedOn > s.accessedOn) ||
        (s.revisedOn && s.revisedOn > s.accessedOn)) fail("Inconsistent source dates");
  }
  const review = record.evidenceReview;
  if (review.status === "reviewed") {
    if (!record.sources.length) fail("Reviewed content requires sources");
    if (review.reviewedOn < record.updatedOn || review.reviewDueOn <= review.reviewedOn) fail("Inconsistent review dates");
    if (review.contentDigest !== contentDigest(record)) fail("Review does not cover this content revision");
  }
  const decision = record.publication;
  if (decision.status === "approved") {
    if (review.status !== "reviewed") fail("Publication approval requires completed evidence review");
    else if (decision.approvedOn < review.reviewedOn) fail("Publication predates review");
    if (decision.contentVersion !== record.version || decision.contentDigest !== contentDigest(record)) fail("Approval does not cover this content revision");
  }
  if (record.lifecycle.status !== "active" && record.lifecycle.changedOn < record.updatedOn) fail("Lifecycle change predates content");
  if (record.lifecycle.status === "superseded" && record.lifecycle.replacement.id === record.id &&
      record.lifecycle.replacement.version <= record.version) fail("Invalid replacement version");
});

export const authoritySchema = z.object({
  id, name: text, human: z.literal(true), active: z.boolean(),
  roles: z.array(z.enum(["evidence-reviewer", "qualified-subject-reviewer", "publication-approver"])).min(1),
  qualification: text, appointedOn: date, appointmentReference: https,
}).strict();
export type Authority = z.infer<typeof authoritySchema>;

// Fixed field order makes the digest independent of JSON key ordering.
// Review/publication/lifecycle records are intentionally outside their own digest.
export function contentDigest(record: Pick<ContentRecord,
  "schemaVersion" | "id" | "version" | "title" | "topic" | "language" | "authors" |
  "editors" | "paragraphs" | "sources" | "limitations" | "safetyNotices" | "updatedOn">): string {
  function canonical(value: unknown): unknown {
    if (Array.isArray(value)) return value.map(canonical);
    if (value && typeof value === "object") return Object.fromEntries(
      Object.entries(value).sort(([a], [b]) => a.localeCompare(b)).map(([key, v]) => [key, canonical(v)]));
    return value;
  }
  const { schemaVersion, id, version, title, topic, language, authors, editors, paragraphs,
    sources, limitations, safetyNotices, updatedOn } = record;
  return createHash("sha256").update(JSON.stringify(canonical({ schemaVersion, id, version, title,
    topic, language, authors, editors, paragraphs, sources, limitations, safetyNotices, updatedOn }))).digest("hex");
}

export type PublishedLesson = Readonly<Pick<ContentRecord,
  "id" | "version" | "title" | "topic" | "language" | "paragraphs" | "sources" | "limitations" | "safetyNotices">>;

export function publishCatalog(input: unknown, authorityInput: unknown, asOf: string): PublishedLesson[] {
  date.parse(asOf);
  // Malformed records fail the entire build, including malformed unapproved records.
  const records = z.array(contentSchema).parse(input);
  const authorities = z.array(authoritySchema).parse(authorityInput);
  if (new Set(authorities.map(a => a.id)).size !== authorities.length) throw Error("Duplicate authority identity");
  const versions = new Set<string>();
  for (const r of records) {
    const key = `${r.id}:${r.version}`;
    if (versions.has(key)) throw Error("Duplicate content version");
    versions.add(key);
  }
  for (const r of records) if (r.lifecycle.status === "superseded" &&
    !versions.has(`${r.lifecycle.replacement.id}:${r.lifecycle.replacement.version}`)) throw Error("Missing superseding record");
  return records.filter(record => {
    // Never fall back to an older approval when a newer revision is unapproved/withdrawn.
    if (records.some(other => other.id === record.id && other.version > record.version)) return false;
    const review = record.evidenceReview, decision = record.publication;
    if (record.lifecycle.status !== "active" || review.status !== "reviewed" || decision.status !== "approved") return false;
    if (record.updatedOn > asOf || review.reviewedOn > asOf || decision.approvedOn > asOf || review.reviewDueOn <= asOf) return false;
    const contributors = new Set([...record.authors, ...record.editors].map(p => p.id));
    const authorized = (id: string, role: Authority["roles"][number], on: string) => authorities.some(a =>
      a.id === id && a.human && a.active && a.roles.includes(role) && a.appointedOn <= on && !contributors.has(id));
    return authorized(review.evidenceReviewerId, "evidence-reviewer", review.reviewedOn) &&
      authorized(review.subjectReviewerId, "qualified-subject-reviewer", review.reviewedOn) &&
      authorized(decision.approvedBy, "publication-approver", decision.approvedOn) &&
      decision.approvedBy !== review.evidenceReviewerId && decision.approvedBy !== review.subjectReviewerId;
  }).map(({ id, version, title, topic, language, paragraphs, sources, limitations, safetyNotices }) =>
    ({ id, version, title, topic, language, paragraphs, sources, limitations, safetyNotices }));
}
