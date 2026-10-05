// Version & Model Discovery Metadata
// Version: v3.5.0

export const APP_VERSION = 'v3.5.0';
export const AI_ENGINE_VERSION = 'v3.5.0-adaptive';
export const EXTENSION_VERSION = '3.5.0';
export const EXTENSION_ZIP_FILENAME = `supply-chain-intelligence-extension-v${EXTENSION_VERSION}.zip`;
export const EXTENSION_FOLDER_NAME = `supply-chain-intelligence-extension-v${EXTENSION_VERSION}`;

export interface VersionMetadata {
  version: string;
  engineVersion: string;
  extensionVersion: string;
  extensionZipFilename: string;
  extensionFolderName: string;
  releaseDate: string;
  releaseTitle: string;
  autoModelDiscoverySupported: boolean;
  supportedModels: string[];
  features: string[];
  modelLadder: string[];
  searchProviders: string[];
}

export const CURRENT_VERSION_INFO: VersionMetadata = {
  version: APP_VERSION,
  engineVersion: AI_ENGINE_VERSION,
  extensionVersion: EXTENSION_VERSION,
  extensionZipFilename: EXTENSION_ZIP_FILENAME,
  extensionFolderName: EXTENSION_FOLDER_NAME,
  releaseDate: '2026-10-05',
  releaseTitle: 'Synchronized Semantic Versioning, Dynamic Versioned Extension Distribution & Folder Numbering',
  autoModelDiscoverySupported: true,
  modelLadder: [
    'gemini-flash-latest',
    'gemini-3.8-flash',
    'gemini-3.5-flash',
    'gemini-2.5-flash',
  ],
  searchProviders: [
    'Google Search Grounding (Gemini Native)',
    'Tavily Search API (1,000 Free Credits/Mo)',
    'Serper.dev Google News (2,500 Free Queries)',
    'Brave Search API (2,000 Free Queries/Mo)',
    'Exa Neural Search (1,000 Free Queries/Mo)',
    'Firecrawl Web Search (500 Free Scrapes/Mo)',
  ],
  supportedModels: [
    'gemini-flash-latest (Dynamic Alias — Auto-Updates to Newest Gemini Flash Release)',
    'gemini-3.8-flash (Primary High-Throughput Reasoning & Script Generation)',
    'gemini-3.5-flash (Google Search Grounding Specialist for Breaking Wire Discovery)',
    'gemini-2.5-flash (High Reliability Resilience Fallback)',
    'Dynamic Model Discovery (/v1beta/models auto-detection for future models e.g. 3.9, 4.0)',
  ],
  features: [
    'Synchronized Semantic Versioning: Web app and browser extension update simultaneously to matching version numbers with zero drift',
    'Versioned Extension Archive & Folder: Downloaded extension archive is named supply-chain-intelligence-extension-v3.5.0.zip and extracts to the designated versioned folder supply-chain-intelligence-extension-v3.5.0',
    'Dynamic Version Injection on Download: Extension archive dynamically injects the active version number into manifest.json, background script, popup terminal, and README on every download',
    'Automated Version Sync Pipeline: Single command or update syncs package.json, extension manifest, popup UI, client, and documentation',
    'Automatic Cross-Provider Rate-Limit Failover: If your primary AI key hits 429 or quota limit, it immediately switches to your next configured provider (e.g. Gemini -> Groq -> OpenRouter -> Cerebras -> OpenAI)',
    'Multi-Engine Web Search Cascade: Full support for Tavily, Serper.dev, Brave Search, Exa, Firecrawl, and Google Search Grounding',
    'Customizable Priority Serial (1st, 2nd, 3rd...): Define exact order of search engines and AI providers; cascades automatically when quotas run out',
    'Universal Browser Support: 100% compliant Manifest V3 for Google Chrome, Microsoft Edge, Brave, Opera, Vivaldi, Firefox (Gecko ID), and Safari',
  ],
};
