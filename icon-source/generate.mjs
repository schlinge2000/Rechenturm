import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sourceSvg = path.join(__dirname, 'icon.svg');
const publicDir = path.resolve(__dirname, '..', 'public');

fs.mkdirSync(publicDir, { recursive: true });

const svg = fs.readFileSync(sourceSvg);

// PNG-Größen, die wir brauchen:
// - apple-touch-icon: 180x180 (iOS Home Screen)
// - maskable / android: 192, 512
// - favicon-ähnlich: 32, 64
const targets = [
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 192, name: 'icon-192.png' },
  { size: 512, name: 'icon-512.png' },
  { size: 64, name: 'favicon-64.png' },
  { size: 32, name: 'favicon-32.png' },
];

for (const t of targets) {
  const outPath = path.join(publicDir, t.name);
  await sharp(svg).resize(t.size, t.size).png({ compressionLevel: 9 }).toFile(outPath);
  console.log(`✓ ${t.name} (${t.size}×${t.size})`);
}

// SVG-Favicon direkt kopieren
fs.copyFileSync(sourceSvg, path.join(publicDir, 'icon.svg'));
console.log('✓ icon.svg copied');
