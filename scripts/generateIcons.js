import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const iconsDir = path.join(rootDir, 'public', 'extension', 'icons');

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// 512x512 Master Vector Icon
const masterSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Deep Space Navy Background -->
    <linearGradient id="bgGrad" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0a0f1d"/>
      <stop offset="50%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>

    <!-- Radar Sweep Glow -->
    <radialGradient id="radarSweep" cx="256" cy="256" r="200" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.55"/>
      <stop offset="55%" stop-color="#3b82f6" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#0f172a" stop-opacity="0"/>
    </radialGradient>

    <!-- Border Glow Gradient -->
    <linearGradient id="borderGlow" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="35%" stop-color="#818cf8"/>
      <stop offset="70%" stop-color="#10b981"/>
      <stop offset="100%" stop-color="#06b6d4"/>
    </linearGradient>

    <!-- Route Gradients -->
    <linearGradient id="corridorGrad1" x1="110" y1="180" x2="400" y2="340" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#00f0ff"/>
      <stop offset="45%" stop-color="#10b981"/>
      <stop offset="100%" stop-color="#f59e0b"/>
    </linearGradient>

    <linearGradient id="corridorGrad2" x1="120" y1="310" x2="380" y2="160" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#8b5cf6"/>
      <stop offset="55%" stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#00f0ff"/>
    </linearGradient>

    <!-- Central AI Glow -->
    <radialGradient id="centerPulse" cx="256" cy="256" r="40" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="35%" stop-color="#00f0ff"/>
      <stop offset="75%" stop-color="#0284c7" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#0f172a" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- 1. Squircle App Icon Base -->
  <rect x="18" y="18" width="476" height="476" rx="112" ry="112" fill="url(#bgGrad)"/>
  <rect x="18" y="18" width="476" height="476" rx="112" ry="112" stroke="url(#borderGlow)" stroke-width="12" stroke-opacity="0.9"/>

  <!-- 2. Concentric Radar Range Rings -->
  <circle cx="256" cy="256" r="195" stroke="#1e293b" stroke-width="5" stroke-dasharray="10 8"/>
  <circle cx="256" cy="256" r="145" stroke="#334155" stroke-width="5"/>
  <circle cx="256" cy="256" r="95" stroke="#0ea5e9" stroke-width="4" stroke-opacity="0.6"/>
  <circle cx="256" cy="256" r="50" stroke="#38bdf8" stroke-width="3" stroke-opacity="0.8"/>

  <!-- 3. Radar Sweep Sector (Upper Right Quad) -->
  <path d="M 256 256 L 256 61 A 195 195 0 0 1 451 256 Z" fill="url(#radarSweep)"/>

  <!-- 4. Global Meridian Ellipses (Trade Globe) -->
  <ellipse cx="256" cy="256" rx="195" ry="195" fill="none" stroke="#0284c7" stroke-width="6" stroke-opacity="0.8"/>
  <ellipse cx="256" cy="256" rx="110" ry="195" fill="none" stroke="#0ea5e9" stroke-width="4" stroke-opacity="0.7"/>
  <ellipse cx="256" cy="256" rx="195" ry="90" fill="none" stroke="#0ea5e9" stroke-width="4" stroke-opacity="0.7"/>

  <!-- 5. Crosshair Axes -->
  <line x1="256" y1="50" x2="256" y2="462" stroke="#38bdf8" stroke-width="3" stroke-opacity="0.4"/>
  <line x1="50" y1="256" x2="462" y2="256" stroke="#38bdf8" stroke-width="3" stroke-opacity="0.4"/>

  <!-- 6. Intersecting Global Logistics Trade Routes (Curved Arcs) -->
  <path d="M 115 180 Q 220 120 340 160 T 405 320" fill="none" stroke="url(#corridorGrad1)" stroke-width="16" stroke-linecap="round"/>
  <path d="M 115 180 Q 220 120 340 160 T 405 320" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-opacity="0.85"/>

  <path d="M 110 325 Q 210 370 345 310 T 395 160" fill="none" stroke="url(#corridorGrad2)" stroke-width="14" stroke-linecap="round"/>
  <path d="M 110 325 Q 210 370 345 310 T 395 160" fill="none" stroke="#ffffff" stroke-width="3.5" stroke-dasharray="12 10" stroke-linecap="round"/>

  <!-- 7. Strategic Supply Chain Hub Nodes -->
  <!-- Node A: North Atlantic / Port Hub (Cyan Glow) -->
  <circle cx="115" cy="180" r="24" fill="#0284c7"/>
  <circle cx="115" cy="180" r="14" fill="#00f0ff"/>
  <circle cx="115" cy="180" r="6" fill="#ffffff"/>

  <!-- Node B: Eurasian Hub (Emerald Glow) -->
  <circle cx="340" cy="160" r="22" fill="#059669"/>
  <circle cx="340" cy="160" r="13" fill="#34d399"/>
  <circle cx="340" cy="160" r="5" fill="#ffffff"/>

  <!-- Node C: Asia-Pacific Hub (Amber / Gold Glow) -->
  <circle cx="405" cy="320" r="26" fill="#d97706"/>
  <circle cx="405" cy="320" r="15" fill="#fbbf24"/>
  <circle cx="405" cy="320" r="6" fill="#ffffff"/>

  <!-- Node D: Southern Maritime Corridor Hub (Purple Glow) -->
  <circle cx="110" cy="325" r="20" fill="#7c3aed"/>
  <circle cx="110" cy="325" r="11" fill="#a78bfa"/>
  <circle cx="110" cy="325" r="5" fill="#ffffff"/>

  <!-- 8. Central AI Radar Intelligence Nexus -->
  <circle cx="256" cy="256" r="48" fill="url(#centerPulse)"/>
  <circle cx="256" cy="256" r="32" fill="#090d16" stroke="#00f0ff" stroke-width="7"/>
  <circle cx="256" cy="256" r="18" fill="#06b6d4"/>
  
  <!-- Four-Point Precision Compass Star -->
  <path d="M 256 238 L 262 250 L 274 256 L 262 262 L 256 274 L 250 262 L 238 256 L 250 250 Z" fill="#ffffff"/>

  <!-- 9. Cardinal North Direction Pointer / Vessel Compass Arrow -->
  <polygon points="256,36 272,70 256,62 240,70" fill="#00f0ff"/>
  <polygon points="256,36 256,62 240,70" fill="#38bdf8"/>
</svg>
`;

// 64x64 High-Contrast Vector Icon for 16x16 and 32x32 Toolbar Icons
const toolbarSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Rounded Base for High Density Toolbar Contrast -->
  <rect x="2" y="2" width="60" height="60" rx="15" fill="#0a0f1d" stroke="#00f0ff" stroke-width="4"/>
  
  <!-- Outer Globe / Radar Ring -->
  <circle cx="32" cy="32" r="23" stroke="#0ea5e9" stroke-width="3.5" fill="#0f172a"/>
  
  <!-- Radar Crosshairs -->
  <line x1="32" y1="9" x2="32" y2="55" stroke="#0284c7" stroke-width="2.5"/>
  <line x1="9" y1="32" x2="55" y2="32" stroke="#0284c7" stroke-width="2.5"/>

  <!-- Glowing Radar Sweep Arc -->
  <path d="M 32 32 L 32 9 A 23 23 0 0 1 55 32 Z" fill="#00f0ff" fill-opacity="0.45"/>

  <!-- High-Contrast Trade Route Arcs -->
  <path d="M 12 36 Q 24 14 44 16 T 53 30" fill="none" stroke="#10b981" stroke-width="5" stroke-linecap="round"/>
  <path d="M 12 36 Q 24 14 44 16 T 53 30" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round"/>

  <path d="M 16 18 Q 32 38 49 48" fill="none" stroke="#f59e0b" stroke-width="5" stroke-linecap="round"/>
  <path d="M 16 18 Q 32 38 49 48" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round"/>

  <!-- Bold Hub Nodes for Small Scale Visibility -->
  <circle cx="16" cy="18" r="5.5" fill="#00f0ff" stroke="#ffffff" stroke-width="1.8"/>
  <circle cx="49" cy="48" r="6" fill="#f59e0b" stroke="#ffffff" stroke-width="1.8"/>
  <circle cx="44" cy="16" r="5" fill="#10b981" stroke="#ffffff" stroke-width="1.8"/>
  
  <!-- Central Radar Core Pulse -->
  <circle cx="32" cy="32" r="7.5" fill="#0a0f1d" stroke="#00f0ff" stroke-width="2.5"/>
  <circle cx="32" cy="32" r="4" fill="#ffffff"/>

  <!-- North Beacon -->
  <polygon points="32,4 36,9 32,8 28,9" fill="#00f0ff"/>
</svg>
`;

const masterSvgPath = path.join(iconsDir, 'icon_master.svg');
const toolbarSvgPath = path.join(iconsDir, 'icon_toolbar.svg');

fs.writeFileSync(masterSvgPath, masterSvg, 'utf8');
fs.writeFileSync(toolbarSvgPath, toolbarSvg, 'utf8');
console.log('✓ Created master and toolbar vector SVG templates.');

// Target paths
const icon128Path = path.join(iconsDir, 'icon128.png');
const icon48Path = path.join(iconsDir, 'icon48.png');
const icon32Path = path.join(iconsDir, 'icon32.png');
const icon16Path = path.join(iconsDir, 'icon16.png');

const tmpMasterPng = path.join('/tmp', 'icon_master_512.png');
const tmpToolbarPng = path.join('/tmp', 'icon_toolbar_64.png');

console.log('Rendering 512x512 master PNG using ffmpeg librsvg...');
execSync(`ffmpeg -y -i "${masterSvgPath}" "${tmpMasterPng}"`, { stdio: 'ignore' });

console.log('Rendering 64x64 toolbar PNG using ffmpeg librsvg...');
execSync(`ffmpeg -y -i "${toolbarSvgPath}" "${tmpToolbarPng}"`, { stdio: 'ignore' });

console.log('Generating crisp multi-resolution icons (128, 48, 32, 16)...');
execSync(`convert "${tmpMasterPng}" -resize 128x128 "${icon128Path}"`);
execSync(`convert "${tmpMasterPng}" -resize 48x48 "${icon48Path}"`);
execSync(`convert "${tmpToolbarPng}" -resize 32x32 "${icon32Path}"`);
execSync(`convert "${tmpToolbarPng}" -resize 16x16 "${icon16Path}"`);

console.log('✓ Successfully rendered:');
console.log('  - icon128.png:', fs.statSync(icon128Path).size, 'bytes');
console.log('  - icon48.png: ', fs.statSync(icon48Path).size, 'bytes');
console.log('  - icon32.png: ', fs.statSync(icon32Path).size, 'bytes');
console.log('  - icon16.png: ', fs.statSync(icon16Path).size, 'bytes');

// Also generate base64 constants file for client-side packaging in extensionZip.ts
const base64Content = `// Automatically generated base64 icon data
export const ICON_16_BASE64 = '${fs.readFileSync(icon16Path).toString('base64')}';
export const ICON_32_BASE64 = '${fs.readFileSync(icon32Path).toString('base64')}';
export const ICON_48_BASE64 = '${fs.readFileSync(icon48Path).toString('base64')}';
export const ICON_128_BASE64 = '${fs.readFileSync(icon128Path).toString('base64')}';
`;

const base64OutPath = path.join(rootDir, 'src', 'utils', 'extensionIconsBase64.ts');
fs.writeFileSync(base64OutPath, base64Content, 'utf8');
console.log('✓ Generated src/utils/extensionIconsBase64.ts with real icon data.');
