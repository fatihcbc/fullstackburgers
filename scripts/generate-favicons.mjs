// Derive favicons from the original mascot face; no generative or redrawn artwork.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import sharp from 'sharp';

const sourcePath = 'public/media/pixel/10x10 cm drukwerk.svg';
const original = await readFile(sourcePath);
const source = original.toString('utf8');
const shapes = [...source.matchAll(/<(?:path|polygon)\b[^>]*\/>/g)].map(match => match[0]);
const face = shapes.find(path => path.includes('d="M117.32,151.05'));
assert(face?.includes('class="st0"'), 'Original mascot face path not found; inspect artwork before regenerating');
assert(source.includes('fill: #ffd000;'), 'Original yellow changed; inspect artwork before regenerating');
const digest = createHash('sha256').update(original).digest('hex');
// Clip the original drawing to its own face silhouette, retaining original black eyes/details.
// Every path/polygon and the yellow fill remain verbatim; no features are recreated.
// The square viewport centers the face with padding. The source SVG is never written.
const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="67 22 168 168">\n' +
  '<!-- Original mascot face from ' + sourcePath + '; SHA256 ' + digest + ' -->\n' +
  '<style>.st0{fill:#ffd000}</style>\n<defs><clipPath id="face">' + face + '</clipPath></defs>\n' +
  '<rect x="67" y="22" width="168" height="168" fill="#000"/>\n' +
  '<g clip-path="url(#face)">' + shapes.join('\n') + '</g>\n</svg>\n';
await mkdir('public/icons', { recursive: true });
await writeFile('public/icons/favicon.svg', svg);
for (const size of [16, 32, 48, 180]) {
  const name = size === 180 ? 'apple-touch-icon.png' : 'favicon-' + size + '.png';
  await sharp(Buffer.from(svg), { density: 192 }).resize(size, size).png().toFile('public/icons/' + name);
}
// Standard ICO container with PNG-compressed 16/32/48px entries; no new dependency.
const images = await Promise.all([16, 32, 48].map(size => readFile('public/icons/favicon-' + size + '.png')));
const directory = Buffer.alloc(6 + images.length * 16);
directory.writeUInt16LE(1, 2);
directory.writeUInt16LE(images.length, 4);
let offset = directory.length;
images.forEach((bytes, index) => {
  const size = [16, 32, 48][index];
  const entry = 6 + index * 16;
  directory[entry] = size;
  directory[entry + 1] = size;
  directory.writeUInt16LE(1, entry + 4);
  directory.writeUInt16LE(32, entry + 6);
  directory.writeUInt32LE(bytes.length, entry + 8);
  directory.writeUInt32LE(offset, entry + 12);
  offset += bytes.length;
});
await writeFile('public/favicon.ico', Buffer.concat([directory, ...images]));
assert.deepEqual(await readFile(sourcePath), original, 'Source artwork must remain unchanged');
console.log('Created mascot-face SVG, 16/32/48px PNGs, 180px Apple icon and ICO. Source unchanged.');
