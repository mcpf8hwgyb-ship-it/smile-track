import { readdir, readFile, lstat } from 'node:fs/promises';
import { resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

// Fail closed on restricted payloads, renamed binary assets, symlinks and internal imports.
export async function checkBoundary(root) {
  let checked = 0;
  async function walk(dir) {
    for (const name of await readdir(dir)) {
      const path = resolve(dir, name), stat = await lstat(path);
      if (stat.isSymbolicLink()) throw Error(`Symlink in deployment boundary: ${name}`);
      if (stat.isDirectory()) { await walk(path); continue; }
      const bytes = await readFile(path), text = bytes.toString('utf8');
      if (/\.(glb|gltf|zip)$/i.test(name) || bytes.subarray(0, 4).toString() === 'glTF' ||
          /OUTWARD_PROVISIONAL_V1|f02-manifest-1|internal\/f02|source_local_to_candidate|01_DUNDEE_ORIGINAL_16/.test(text)) {
        throw Error(`Restricted content in deployment boundary: ${relative(root, path)}`);
      }
      checked++;
    }
  }
  await walk(root);
  return checked;
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  for (const dir of ['app', 'public', 'out']) {
    try { process.stdout.write(`${dir}: ${await checkBoundary(resolve(dir))} files checked\n`); }
    catch (error) { if (dir === 'public' && error.code === 'ENOENT') continue; throw error; }
  }
}
