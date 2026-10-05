import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const versionInfoPath = path.join(rootDir, 'src', 'data', 'versionInfo.ts');
let versionInfoContent = fs.readFileSync(versionInfoPath, 'utf8');

const versionMatch = versionInfoContent.match(/export const EXTENSION_VERSION = '([^']+)';/);
if (!versionMatch) {
  console.error('Could not find EXTENSION_VERSION in src/data/versionInfo.ts');
  process.exit(1);
}

const currentVersion = versionMatch[1];
const parts = currentVersion.split('.').map(Number);

const bumpType = process.argv[2] || 'patch'; // 'patch', 'minor', 'major', or specific 'x.y.z'
let newVersion = '';

if (/^[0-9]+\.[0-9]+\.[0-9]+$/.test(bumpType)) {
  newVersion = bumpType;
} else if (bumpType === 'major') {
  newVersion = `${parts[0] + 1}.0.0`;
} else if (bumpType === 'minor') {
  newVersion = `${parts[0]}.${parts[1] + 1}.0`;
} else {
  // patch
  newVersion = `${parts[0]}.${parts[1]}.${parts[2] + 1}`;
}

const appVersion = `v${newVersion}`;
const today = new Date().toISOString().split('T')[0];

console.log(`[Version Bump] ${currentVersion} -> ${newVersion} (${bumpType})`);

// Update versionInfo.ts
versionInfoContent = versionInfoContent.replace(
  /\/\/ Version: v[0-9.]+/g,
  `// Version: ${appVersion}`
);
versionInfoContent = versionInfoContent.replace(
  /export const APP_VERSION = 'v[0-9.]+';/g,
  `export const APP_VERSION = '${appVersion}';`
);
versionInfoContent = versionInfoContent.replace(
  /export const AI_ENGINE_VERSION = 'v[0-9.]+-adaptive';/g,
  `export const AI_ENGINE_VERSION = '${appVersion}-adaptive';`
);
versionInfoContent = versionInfoContent.replace(
  /export const EXTENSION_VERSION = '[0-9.]+';/g,
  `export const EXTENSION_VERSION = '${newVersion}';`
);
versionInfoContent = versionInfoContent.replace(
  /releaseDate: '[0-9-]+',/g,
  `releaseDate: '${today}',`
);

fs.writeFileSync(versionInfoPath, versionInfoContent, 'utf8');
console.log(`  ✓ Updated src/data/versionInfo.ts to ${newVersion}`);

// Run syncVersion.js
execSync('node scripts/syncVersion.js', { cwd: rootDir, stdio: 'inherit' });
