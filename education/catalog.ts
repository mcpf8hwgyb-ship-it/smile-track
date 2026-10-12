import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { publishCatalog } from "./contract.ts";

export function readEducationInputs() {
  const read = (file: string): unknown => JSON.parse(readFileSync(resolve(process.cwd(), "content/education", file), "utf8"));
  return { records: read("records.json"), authorities: read("authorities.json") };
}

// Build-time filesystem access keeps the unpublished catalog out of client imports/props.
export function getPublishedLessons() {
  const { records, authorities } = readEducationInputs();
  return publishCatalog(records, authorities, new Date().toISOString().slice(0, 10));
}
