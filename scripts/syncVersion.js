import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 1. Read version from src/data/versionInfo.ts
const versionInfoPath = path.join(rootDir, 'src', 'data', 'versionInfo.ts');
const versionInfoContent = fs.readFileSync(versionInfoPath, 'utf8');

const versionMatch = versionInfoContent.match(/export const EXTENSION_VERSION = '([^']+)';/);
if (!versionMatch) {
  console.error('Could not find EXTENSION_VERSION in src/data/versionInfo.ts');
  process.exit(1);
}
const version = versionMatch[1];
const appVersion = `v${version}`;
const zipFilename = `supply-chain-intelligence-extension-v${version}.zip`;
const folderName = `supply-chain-intelligence-extension-v${version}`;

console.log(`[Version Sync] Target Version: ${version} (${appVersion})`);

// 2. Sync package.json
const pkgPath = path.join(rootDir, 'package.json');
if (fs.existsSync(pkgPath)) {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  pkg.version = version;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
  console.log(`  ✓ Synced package.json version: ${version}`);
}

// 3. Sync public/extension/manifest.json
const manifestPath = path.join(rootDir, 'public', 'extension', 'manifest.json');
if (fs.existsSync(manifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  manifest.version = version;
  manifest.name = `Supply Chain & Trade News Intelligence - AI Radar (v${version})`;
  manifest.icons = {
    "16": "icons/icon16.png",
    "32": "icons/icon32.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  };
  if (manifest.action) {
    manifest.action.default_title = `Supply Chain Intelligence (v${version})`;
    manifest.action.default_icon = {
      "16": "icons/icon16.png",
      "32": "icons/icon32.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    };
  }
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
  console.log(`  ✓ Synced manifest.json version: ${version} with 16/32/48/128 icons`);
}

// 4. Sync public/extension/geminiClient.js
const geminiClientPath = path.join(rootDir, 'public', 'extension', 'geminiClient.js');
if (fs.existsSync(geminiClientPath)) {
  let content = fs.readFileSync(geminiClientPath, 'utf8');
  content = content.replace(/\/\/ Version: [^\n]+/g, `// Version: ${version} - Cross-Provider Rate-Limit Auto-Failover & Multi-Engine Search Cascade`);
  content = content.replace(/export const EXTENSION_VERSION = '[^']+';/g, `export const EXTENSION_VERSION = '${appVersion}';`);
  fs.writeFileSync(geminiClientPath, content, 'utf8');
  console.log(`  ✓ Synced geminiClient.js version: ${appVersion}`);
}

// 5. Sync public/extension/popup.html
const popupHtmlPath = path.join(rootDir, 'public', 'extension', 'popup.html');
if (fs.existsSync(popupHtmlPath)) {
  let content = fs.readFileSync(popupHtmlPath, 'utf8');
  content = content.replace(/<title>Supply Chain News Intelligence — Browser Extension Terminal \(v[^)]+\)<\/title>/g, `<title>Supply Chain News Intelligence — Browser Extension Terminal (${appVersion})</title>`);
  content = content.replace(/<span class="version-tag" id="header-version-badge">v[0-9.]+[^<]*<\/span>/g, `<span class="version-tag" id="header-version-badge">${appVersion} CASCADE & FAILOVER</span>`);
  content = content.replace(/<div class="modal-title">⚙️ Multi-Engine Search Cascade & AI Auto-Failover \(v[^)]+\)<\/div>/g, `<div class="modal-title">⚙️ Multi-Engine Search Cascade & AI Auto-Failover (${appVersion})</div>`);
  fs.writeFileSync(popupHtmlPath, content, 'utf8');
  console.log(`  ✓ Synced popup.html versions: ${appVersion}`);
}

// 6. Sync public/extension/README_INSTALL.md
const readmeInstallPath = path.join(rootDir, 'public', 'extension', 'README_INSTALL.md');
if (fs.existsSync(readmeInstallPath)) {
  let content = fs.readFileSync(readmeInstallPath, 'utf8');
  content = content.replace(/# Supply Chain & Trade News Intelligence — Autonomous Multi-Provider Browser Extension \(v[^)]+\)/g, `# Supply Chain & Trade News Intelligence — Autonomous Multi-Provider Browser Extension (${appVersion})`);
  content = content.replace(/supply-chain-intelligence-extension(?:-v[0-9.]+)?\.zip/g, zipFilename);
  content = content.replace(/supply-chain-intelligence-extension(?:-v[0-9.]+)?\b/g, folderName);
  fs.writeFileSync(readmeInstallPath, content, 'utf8');
  console.log(`  ✓ Synced README_INSTALL.md: ${zipFilename} & ${folderName}`);
}

// 7. Sync src/services/adaptiveAiService.ts
const adaptiveAiPath = path.join(rootDir, 'src', 'services', 'adaptiveAiService.ts');
if (fs.existsSync(adaptiveAiPath)) {
  let content = fs.readFileSync(adaptiveAiPath, 'utf8');
  content = content.replace(/\/\/ Version: [^\n]+/g, `// Version: ${version}`);
  fs.writeFileSync(adaptiveAiPath, content, 'utf8');
  console.log(`  ✓ Synced adaptiveAiService.ts version: ${version}`);
}

console.log(`[Version Sync] All artifacts successfully synchronized to v${version}!`);
