// TEST ONLY. Invented people/reviews and non-medical text; never import from app/catalog.
import { contentDigest } from "./contract.ts";
import type { Authority, ContentRecord } from "./contract.ts";
export const testDate = "2026-10-12";
export const authorities: Authority[] = [
  { id: "test-reviewer", name: "Synthetic reviewer (not a real person)", human: true, active: true,
    roles: ["evidence-reviewer", "qualified-subject-reviewer"], qualification: "Synthetic role for non-medical tests; no real credential claimed",
    appointedOn: "2026-10-01", appointmentReference: "https://example.invalid/test-appointment" },
  { id: "test-publisher", name: "Synthetic publisher (not a real person)", human: true, active: true,
    roles: ["publication-approver"], qualification: "Synthetic role for tests only",
    appointedOn: "2026-10-01", appointmentReference: "https://example.invalid/test-publisher" },
];
export function approvedFixture(): ContentRecord {
  const record: ContentRecord = {
    schemaVersion: "education-content-1", id: "synthetic-paper-example", version: 1,
    title: "E01_SYNTHETIC_APPROVED_TITLE", topic: "general", language: "en",
    authors: [{ id: "test-author", name: "Synthetic author" }], editors: [{ id: "test-editor", name: "Synthetic editor" }],
    paragraphs: ["E01_SYNTHETIC_BODY: Put the paper square in the blue folder. This is a non-medical test."],
    sources: [{ id: "test-source", title: "Synthetic paper example", publisher: "Test publisher", type: "other",
      url: "https://example.invalid/paper", publishedOn: null, revisedOn: null, accessedOn: "2026-10-01" }],
    limitations: ["Synthetic fixture only."], safetyNotices: ["Not real educational content."], updatedOn: "2026-10-02",
    evidenceReview: { status: "reviewed", reviewedOn: "2026-10-03", reviewDueOn: "2026-11-01",
      evidenceReviewerId: "test-reviewer", subjectReviewerId: "test-reviewer", recordReference: "https://example.invalid/test-review", contentDigest: "0".repeat(64) },
    publication: { status: "approved", decisionId: "test-decision", approvedBy: "test-publisher", approvedOn: "2026-10-04",
      recordReference: "https://example.invalid/test-decision", contentVersion: 1, contentDigest: "0".repeat(64) },
    lifecycle: { status: "active" },
  };
  if (record.evidenceReview.status === "reviewed") record.evidenceReview.contentDigest = contentDigest(record);
  if (record.publication.status === "approved") record.publication.contentDigest = contentDigest(record);
  return record;
}
export function draftFixture(): ContentRecord {
  return { ...approvedFixture(), evidenceReview: { status: "draft" }, publication: { status: "not-approved" } };
}
