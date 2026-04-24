// Usage: node diff.mjs <baseline-dir> <candidate-dir> <output-dir> [--threshold=0.005]
// Compares matching PNGs pair-by-pair, writes per-page diff PNGs, exits non-zero
// if any page exceeds the per-page diff ratio threshold (default 0.5%).

import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const [baselineDir, candidateDir, outDir, ...rest] = process.argv.slice(2);
const threshold = Number((rest.find(a => a.startsWith('--threshold=')) || '--threshold=0.005').split('=')[1]);

if (!baselineDir || !candidateDir || !outDir) {
  console.error('usage: diff.mjs <baseline-dir> <candidate-dir> <output-dir> [--threshold=0.005]');
  process.exit(2);
}
fs.mkdirSync(outDir, { recursive: true });

const files = fs.readdirSync(baselineDir).filter(f => f.endsWith('.png'));
let failures = 0;

for (const f of files) {
  const a = PNG.sync.read(fs.readFileSync(path.join(baselineDir, f)));
  const candidatePath = path.join(candidateDir, f);
  if (!fs.existsSync(candidatePath)) {
    console.log(`MISSING ${f}`);
    failures++;
    continue;
  }
  const b = PNG.sync.read(fs.readFileSync(candidatePath));
  if (a.width !== b.width || a.height !== b.height) {
    console.log(`SIZE-MISMATCH ${f}: baseline ${a.width}x${a.height}, candidate ${b.width}x${b.height}`);
    failures++;
    continue;
  }
  const diff = new PNG({ width: a.width, height: a.height });
  const diffPx = pixelmatch(a.data, b.data, diff.data, a.width, a.height, { threshold: 0.1 });
  const ratio = diffPx / (a.width * a.height);
  fs.writeFileSync(path.join(outDir, f), PNG.sync.write(diff));
  const status = ratio > threshold ? 'FAIL' : 'OK  ';
  console.log(`${status} ${f}  ratio=${(ratio * 100).toFixed(3)}%`);
  if (ratio > threshold) failures++;
}

if (failures > 0) {
  console.error(`\n${failures} page(s) failed`);
  process.exit(1);
}
console.log('\nall pages within tolerance');
