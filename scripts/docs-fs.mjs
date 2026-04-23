#!/usr/bin/env node
// docs-fs.mjs — mirror /docs into a flat, agent-friendly filesystem.
//
// Pattern from Ben's Bites Apr 2 + Apr 7, 2026: turn any docs site into a tree
// agents can navigate with \`tree\`, \`grep\`, and \`cat\` instead of HTML scraping.
//
// Usage:  pnpm docs:fs   (or)   node scripts/docs-fs.mjs
// Output: .docs-fs/<flattened-path>.md

import { readdir, readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';

const SRC = 'docs';
const OUT = '.docs-fs';

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const out = [];
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (/\\.mdx?$/.test(e.name)) out.push(p);
  }
  return out;
}

async function main() {
  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });
  const files = await walk(SRC);
  for (const f of files) {
    const rel = relative(SRC, f).split(sep).join('--');
    const body = await readFile(f, 'utf8');
    await writeFile(join(OUT, rel), body);
  }
  console.log(\`docs-fs: mirrored \${files.length} files into \${OUT}/\`);
}

main().catch((e) => { console.error(e); process.exit(1); });
