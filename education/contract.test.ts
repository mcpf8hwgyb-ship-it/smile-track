import assert from "node:assert/strict";
import { test } from "node:test";
import { contentSchema, publishCatalog } from "./contract.ts";
import { approvedFixture, draftFixture, authorities, testDate } from "./fixtures.ts";

test("approved non-medical fixture passes schema and explicit publication gate", () => {
  const record = approvedFixture();
  assert.equal(contentSchema.parse(record).schemaVersion, "education-content-1");
  const published = publishCatalog([record], authorities, testDate);
  assert.equal(published.length, 1);
  assert.deepEqual(published[0].paragraphs, record.paragraphs);
  assert.equal("publication" in published[0], false);
  assert.equal("authors" in published[0], false);
});
test("citations and valid structure do not approve drafts, pending reviews, or reviewed-only records", () => {
  for (const status of ["draft", "awaiting-review", "changes-required"] as const) {
    const record = { ...draftFixture(), evidenceReview: { status } };
    assert.ok(contentSchema.safeParse(record).success);
    assert.ok(record.sources.length > 0);
    assert.deepEqual(publishCatalog([record], authorities, testDate), []);
  }
  assert.deepEqual(publishCatalog([{ ...approvedFixture(), publication: { status: "not-approved" } }], authorities, testDate), []);
});
test("missing review/provenance, malformed references and inconsistent approval fail closed", () => {
  const approved = approvedFixture();
  const cases = [
    { ...approved, evidenceReview: { status: "reviewed" } },
    { ...approved, authors: [] },
    { ...approved, editors: [] },
    { ...approved, sources: [] },
    { ...approved, sources: [{ ...approved.sources[0], url: "javascript:alert(1)" }] },
    { ...approved, publication: { status: "approved" } },
    { ...approved, evidenceReview: { status: "draft" } },
    { ...approved, publication: { ...approved.publication, contentVersion: 2 } },
    { ...approved, publication: { ...approved.publication, approvedOn: "2026-10-01" } },
    { ...approved, title: "Changed after approval" },
    { ...approved, paragraphs: ["Changed after approval"] },
    { ...approved, updatedOn: "2026-02-30" },
  ];
  for (const record of cases) assert.throws(() => publishCatalog([record], authorities, testDate));
});
test("withdrawal, supersession and newer unapproved versions prevent old content returning", () => {
  const approved = approvedFixture();
  assert.deepEqual(publishCatalog([{ ...approved, lifecycle: { status: "withdrawn", changedOn: testDate, reason: "Test withdrawal" } }], authorities, testDate), []);
  const revision = { ...draftFixture(), version: 2 };
  assert.deepEqual(publishCatalog([approved, revision], authorities, testDate), []);
  const superseded = { ...approved, lifecycle: { status: "superseded", changedOn: testDate, reason: "Test replacement", replacement: { id: approved.id, version: 2 } } };
  assert.deepEqual(publishCatalog([superseded, revision], authorities, testDate), []);
  assert.throws(() => publishCatalog([superseded], authorities, testDate), /Missing superseding/);
  assert.throws(() => publishCatalog([approved, approved], authorities, testDate), /Duplicate content/);
});
test("stale/future approvals and unauthorized, inactive or self-appointed actors cannot publish", () => {
  const record = approvedFixture();
  assert.deepEqual(publishCatalog([record], authorities, "2026-11-01"), []);
  assert.deepEqual(publishCatalog([record], authorities, "2026-10-02"), []);
  assert.deepEqual(publishCatalog([record], [], testDate), []);
  assert.deepEqual(publishCatalog([record], authorities.map(a => ({ ...a, active: false })), testDate), []);
  assert.deepEqual(publishCatalog([record], authorities.map(a => ({ ...a, roles: a.roles.filter(r => r !== "qualified-subject-reviewer") })), testDate), []);
  assert.deepEqual(publishCatalog([{ ...record, publication: { ...record.publication, approvedBy: "test-author" } }], authorities, testDate), []);
  // A registered contributor still cannot review or approve their own content.
  const registeredAuthor = { ...authorities[0], id: "test-author", roles: [...authorities[0].roles, "publication-approver" as const] };
  assert.deepEqual(publishCatalog([{ ...record, evidenceReview: { ...record.evidenceReview, evidenceReviewerId: "test-author" } }], [...authorities, registeredAuthor], testDate), []);
  assert.deepEqual(publishCatalog([{ ...record, publication: { ...record.publication, approvedBy: "test-author" } }], [...authorities, registeredAuthor], testDate), []);
  const reviewerWithApprovalRole = authorities.map(a => ({ ...a, roles: [...a.roles, "publication-approver" as const] }));
  assert.deepEqual(publishCatalog([{ ...record, publication: { ...record.publication, approvedBy: "test-reviewer" } }], reviewerWithApprovalRole, testDate), []);
  assert.throws(() => publishCatalog([record], [...authorities, authorities[0]], testDate), /Duplicate authority/);
});
