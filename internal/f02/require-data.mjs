import { access, realpath } from 'node:fs/promises';
import { resolve, relative } from 'node:path';
if (!process.env.F02_DATA_DIR) throw Error('Controlled conformance requires F02_DATA_DIR; refusing a skipped scientific test.');
const root = await realpath(process.env.F02_DATA_DIR);
if (!relative(process.cwd(), root).startsWith('../')) throw Error('Controlled data must remain outside repository.');
await access(resolve(root, 'manifest.json'));
