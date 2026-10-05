import JSZip from 'jszip';
import {
  EXTENSION_VERSION,
  APP_VERSION,
  EXTENSION_ZIP_FILENAME,
  EXTENSION_FOLDER_NAME,
} from '../data/versionInfo';
import {
  ICON_16_BASE64,
  ICON_32_BASE64,
  ICON_48_BASE64,
  ICON_128_BASE64,
} from './extensionIconsBase64';

export interface ExtensionDownloadOptions {
  folder?: boolean;
}

export async function generateExtensionZipBlob(options: ExtensionDownloadOptions = {}): Promise<Blob> {
  const zip = new JSZip();
  const targetZipRoot = options.folder ? (zip.folder(EXTENSION_FOLDER_NAME) || zip) : zip;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://ais-dev-r3glata6oz3rwzvgoumdmj-117353919783.asia-southeast1.run.app';

  const files = [
    'manifest.json',
    'popup.html',
    'popup.js',
    'geminiClient.js',
    'background.js',
    'sidepanel.html',
    'sidepanel.js',
    'README_INSTALL.md',
  ];

  for (const fileName of files) {
    try {
      const res = await fetch(`/extension/${fileName}`);
      if (res.ok) {
        let text = await res.text();

        // Dynamic synchronized version injection
        if (fileName === 'manifest.json') {
          try {
            const parsed = JSON.parse(text);
            parsed.version = EXTENSION_VERSION;
            parsed.name = `Supply Chain & Trade News Intelligence - AI Radar (v${EXTENSION_VERSION})`;
            if (parsed.action) {
              parsed.action.default_title = `Supply Chain Intelligence (v${EXTENSION_VERSION})`;
            }
            parsed.icons = {
              "16": "icons/icon16.png",
              "32": "icons/icon32.png",
              "48": "icons/icon48.png",
              "128": "icons/icon128.png"
            };
            if (parsed.action) {
              parsed.action.default_icon = {
                "16": "icons/icon16.png",
                "32": "icons/icon32.png",
                "48": "icons/icon48.png",
                "128": "icons/icon128.png"
              };
            }
            text = JSON.stringify(parsed, null, 2);
          } catch (e) {
            console.warn('Failed parsing manifest in client fallback', e);
          }
        } else if (fileName === 'geminiClient.js') {
          text = text.replace(/\/\/ Version: [^\n]+/g, `// Version: ${EXTENSION_VERSION} - Cross-Provider Rate-Limit Auto-Failover & Multi-Engine Search Cascade`);
          text = text.replace(/export const EXTENSION_VERSION = '[^']+';/g, `export const EXTENSION_VERSION = '${APP_VERSION}';`);
          text = text.replace(/https:\/\/ais-dev-[^"]+/g, currentOrigin);
        } else if (fileName === 'popup.html') {
          text = text.replace(/<title>Supply Chain News Intelligence — Browser Extension Terminal \(v[^)]+\)<\/title>/g, `<title>Supply Chain News Intelligence — Browser Extension Terminal (${APP_VERSION})</title>`);
          text = text.replace(/<span class="version-tag" id="header-version-badge">v[0-9.]+[^<]*<\/span>/g, `<span class="version-tag" id="header-version-badge">${APP_VERSION} CASCADE & FAILOVER</span>`);
          text = text.replace(/<div class="modal-title">⚙️ Multi-Engine Search Cascade & AI Auto-Failover \(v[^)]+\)<\/div>/g, `<div class="modal-title">⚙️ Multi-Engine Search Cascade & AI Auto-Failover (${APP_VERSION})</div>`);
          text = text.replace(/https:\/\/ais-dev-[^"]+/g, currentOrigin);
        } else if (fileName === 'README_INSTALL.md') {
          text = text.replace(/# Supply Chain & Trade News Intelligence — Autonomous Multi-Provider Browser Extension \(v[^)]+\)/g, `# Supply Chain & Trade News Intelligence — Autonomous Multi-Provider Browser Extension (${APP_VERSION})`);
          text = text.replace(/supply-chain-intelligence-extension(?:-v[0-9.]+)?\.zip/g, EXTENSION_ZIP_FILENAME);
          text = text.replace(/supply-chain-intelligence-extension(?:-v[0-9.]+)?\b/g, EXTENSION_FOLDER_NAME);
        } else if (fileName.endsWith('.js') || fileName.endsWith('.html')) {
          text = text.replace(/https:\/\/ais-dev-[^"]+/g, currentOrigin);
        }

        targetZipRoot.file(fileName, text);
      }
    } catch (err) {
      console.warn(`Could not fetch /extension/${fileName}, generating default...`, err);
    }
  }

  // Add high-resolution international standard icons
  const iconsFolder = targetZipRoot.folder('icons');
  if (iconsFolder) {
    const iconList = [
      { name: 'icon16.png', b64: ICON_16_BASE64 },
      { name: 'icon32.png', b64: ICON_32_BASE64 },
      { name: 'icon48.png', b64: ICON_48_BASE64 },
      { name: 'icon128.png', b64: ICON_128_BASE64 },
    ];

    for (const icon of iconList) {
      try {
        const res = await fetch(`/extension/icons/${icon.name}`);
        if (res.ok) {
          const buffer = await res.arrayBuffer();
          iconsFolder.file(icon.name, buffer);
        } else {
          iconsFolder.file(icon.name, icon.b64, { base64: true });
        }
      } catch {
        iconsFolder.file(icon.name, icon.b64, { base64: true });
      }
    }
  }

  return await zip.generateAsync({ type: 'blob' });
}

export async function downloadExtensionZip(options: ExtensionDownloadOptions = {}): Promise<void> {
  const queryParam = options.folder ? '?folder=true' : '';
  try {
    const res = await fetch(`/api/download-extension${queryParam}`);
    if (res.ok) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = EXTENSION_ZIP_FILENAME;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      return;
    }
  } catch (err) {
    console.warn('Backend download endpoint unavailable, generating client fallback zip...', err);
  }

  const blob = await generateExtensionZipBlob(options);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = EXTENSION_ZIP_FILENAME;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
