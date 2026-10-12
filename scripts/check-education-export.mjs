import { readdir, readFile, lstat } from "node:fs/promises";
import { resolve } from "node:path";
import { getPublishedLessons, readEducationInputs } from "../education/catalog.ts";

const published = getPublishedLessons(); // Invalid records fail, never silently publish.
const { records } = readEducationInputs();
const publishedIds = new Set(published.map(r => `${r.id}:${r.version}`));
// Identical text shared with an approved revision is not an unpublished-text leak.
const allowedText = new Set(published.flatMap(r => [r.title, ...r.paragraphs]));
const forbidden = records.filter(r => !publishedIds.has(`${r.id}:${r.version}`))
  .flatMap(r => [r.title, ...r.paragraphs]).filter(text => !allowedText.has(text));
let count = 0;
async function scan(dir) {
  for (const name of await readdir(dir)) {
    const path = resolve(dir, name), stat = await lstat(path);
    if (stat.isSymbolicLink()) throw Error("Symlink in export");
    if (stat.isDirectory()) { await scan(path); continue; }
    const text = await readFile(path, "utf8");
    const needles = ["E01_SYNTHETIC_", ...forbidden.flatMap(s => [s, JSON.stringify(s).slice(1, -1), s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#x27;")])];
    if (needles.some(needle => text.includes(needle))) throw Error(`Unpublished/test content in export: ${path}`);
    count++;
  }
}
await scan(resolve("out"));
process.stdout.write(`PASS: ${published.length} approved lessons; ${count} exported files contain no unpublished bodies or synthetic fixtures.\n`);
