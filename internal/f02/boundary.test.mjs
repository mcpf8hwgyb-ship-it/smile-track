import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { checkBoundary } from '../../scripts/check-export-boundary.mjs';
test('deployment guard rejects model, manifest, and internal code negative controls', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'f02-boundary-'));
  try {
    await writeFile(join(dir, 'index.html'), '<h1>Smile Track</h1>');
    assert.equal(await checkBoundary(dir), 1);
    for (const payload of ['glTFsynthetic', 'f02-manifest-1', 'import "../internal/f02/viewer"']) {
      await writeFile(join(dir, 'payload.dat'), payload);
      await assert.rejects(checkBoundary(dir), /Restricted content/);
    }
  } finally { await rm(dir, { recursive: true, force: true }); }
});
