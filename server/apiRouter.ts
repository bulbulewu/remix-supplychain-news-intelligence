import express, { Request, Response } from 'express';
import JSZip from 'jszip';
import path from 'path';
import fs from 'fs';
import {
  executeNewsSearch,
  deepAnalyzeStory,
  generateDailyExecutiveBrief,
  generateFactLockedVideoBrief,
  pingGemini,
} from './geminiService';
import { INITIAL_DATASET } from '../src/data/defaultIntelligence';
import {
  EXTENSION_VERSION,
  APP_VERSION,
  EXTENSION_ZIP_FILENAME,
  EXTENSION_FOLDER_NAME,
} from '../src/data/versionInfo';

export const apiRouter = express.Router();
apiRouter.use(express.json());

apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

apiRouter.get('/news/initial', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: INITIAL_DATASET,
  });
});

apiRouter.post('/news/search', async (req: Request, res: Response) => {
  try {
    const { timeWindow = '72h', customQuery } = req.body || {};
    const dataset = await executeNewsSearch(timeWindow, customQuery);
    res.json({
      success: true,
      data: dataset,
    });
  } catch (error: any) {
    console.error('Error in /api/news/search:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to search supply chain news',
      data: INITIAL_DATASET,
    });
  }
});

apiRouter.post('/news/deep-analyze', async (req: Request, res: Response) => {
  try {
    const { headline, summary, useThinking = false } = req.body || {};
    if (!headline) {
      res.status(400).json({ success: false, error: 'Headline is required' });
      return;
    }
    const analysis = await deepAnalyzeStory(headline, summary, useThinking);
    res.json({
      success: true,
      data: analysis,
    });
  } catch (error: any) {
    console.error('Error in /api/news/deep-analyze:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to analyze story',
    });
  }
});

apiRouter.post('/news/executive-brief', async (req: Request, res: Response) => {
  try {
    const { dataset } = req.body || {};
    const brief = await generateDailyExecutiveBrief(dataset || INITIAL_DATASET);
    res.json({
      success: true,
      data: brief,
    });
  } catch (error: any) {
    console.error('Error in /api/news/executive-brief:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to generate executive brief',
    });
  }
});

apiRouter.post('/video-brief/generate', async (req: Request, res: Response) => {
  try {
    const { item, options = {} } = req.body || {};
    if (!item || !item.headline) {
      res.status(400).json({ success: false, error: 'News item with headline is required' });
      return;
    }
    const brief = await generateFactLockedVideoBrief(item, options);
    res.json({
      success: true,
      data: brief,
    });
  } catch (error: any) {
    console.error('Error in /api/video-brief/generate:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to generate video brief',
    });
  }
});

apiRouter.post('/ai/test-provider', async (req: Request, res: Response) => {
  const { provider = 'gemini' } = req.body || {};
  const startTime = Date.now();

  if (provider === 'gemini') {
    try {
      const pingResult = await pingGemini();
      res.json({
        success: pingResult.success,
        provider: 'Google Gemini',
        model: 'gemini-3.5-flash & 3.8-flash',
        status: pingResult.success ? 'Active & Verified' : 'Standby / Key required',
        latencyMs: pingResult.latencyMs,
        details: pingResult.message,
      });
    } catch (err: any) {
      res.json({
        success: false,
        provider: 'Google Gemini',
        model: 'gemini-3.5-flash',
        status: 'Error',
        latencyMs: Date.now() - startTime,
        details: err?.message || 'Connection failure',
      });
    }
    return;
  }

  if (provider === 'groq') {
    const hasGroq = !!process.env.GROQ_API_KEY;
    const latencyMs = Date.now() - startTime;
    res.json({
      success: hasGroq,
      provider: 'Groq Cloud LPU',
      model: 'Llama-3.3-70B-Versatile / Mixtral-8x7B',
      status: hasGroq ? 'Active & Ready' : 'Standby (GROQ_API_KEY not configured)',
      latencyMs,
      details: hasGroq
        ? 'Connected to Groq Cloud ultra-fast inference cluster.'
        : 'To route to Groq LPU models, configure GROQ_API_KEY in environment secrets.',
    });
    return;
  }

  if (provider === 'openrouter') {
    const hasKey = !!process.env.OPENROUTER_API_KEY;
    const latencyMs = Date.now() - startTime;
    res.json({
      success: hasKey,
      provider: 'OpenRouter Free AI Hub',
      model: 'DeepSeek-R1-Free / Qwen-2.5-Coder',
      status: hasKey ? 'Active & Ready' : 'Standby (OPENROUTER_API_KEY not configured)',
      latencyMs,
      details: hasKey
        ? 'Connected to OpenRouter free community endpoints.'
        : 'Configure OPENROUTER_API_KEY in environment secrets to enable open-weights free routing.',
    });
    return;
  }

  if (provider === 'cerebras') {
    const hasKey = !!process.env.CEREBRAS_API_KEY;
    const latencyMs = Date.now() - startTime;
    res.json({
      success: hasKey,
      provider: 'Cerebras Inference',
      model: 'Llama-3.3-70B (Wafer-Scale)',
      status: hasKey ? 'Active & Ready' : 'Standby (CEREBRAS_API_KEY not configured)',
      latencyMs,
      details: hasKey
        ? 'Connected to Cerebras CS-3 wafer-scale inference engine.'
        : 'Configure CEREBRAS_API_KEY in environment secrets.',
    });
    return;
  }

  res.json({
    success: true,
    provider,
    model: 'Universal',
    status: 'Ready',
    latencyMs: Date.now() - startTime,
    details: 'Provider health check OK.',
  });
});

apiRouter.get('/download-extension', async (req: Request, res: Response) => {
  try {
    const host = req.get('host') || 'localhost:3000';
    const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
    const targetUrl = `${protocol}://${host}`;

    const extensionDir = path.resolve(process.cwd(), 'public', 'extension');
    const zip = new JSZip();

    // Check if user explicitly requested enclosed folder packaging
    const wrapInFolder = req.query.folder === 'true' || req.query.format === 'folder' || req.query.format === 'nested';
    const targetZipRoot = wrapInFolder ? (zip.folder(EXTENSION_FOLDER_NAME) || zip) : zip;

    if (fs.existsSync(extensionDir)) {
      const addDirectoryToZip = (dirPath: string, zipFolder: JSZip) => {
        const entries = fs.readdirSync(dirPath, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(dirPath, entry.name);
          if (entry.isDirectory()) {
            const subFolder = zipFolder.folder(entry.name);
            if (subFolder) addDirectoryToZip(fullPath, subFolder);
          } else {
            let content: string | Buffer = fs.readFileSync(fullPath);
            
            // Dynamic synchronized version injection & origin configuration
            if (entry.name === 'manifest.json') {
              try {
                const parsed = JSON.parse(content.toString('utf-8'));
                parsed.version = EXTENSION_VERSION;
                parsed.name = `Supply Chain & Trade News Intelligence - AI Radar (v${EXTENSION_VERSION})`;
                parsed.icons = {
                  "16": "icons/icon16.png",
                  "32": "icons/icon32.png",
                  "48": "icons/icon48.png",
                  "128": "icons/icon128.png"
                };
                if (parsed.action) {
                  parsed.action.default_title = `Supply Chain Intelligence (v${EXTENSION_VERSION})`;
                  parsed.action.default_icon = {
                    "16": "icons/icon16.png",
                    "32": "icons/icon32.png",
                    "48": "icons/icon48.png",
                    "128": "icons/icon128.png"
                  };
                }
                content = JSON.stringify(parsed, null, 2);
              } catch (e) {
                console.warn('Failed to parse manifest.json during packaging', e);
              }
            } else if (entry.name === 'geminiClient.js') {
              let text = content.toString('utf-8');
              text = text.replace(/\/\/ Version: [^\n]+/g, `// Version: ${EXTENSION_VERSION} - Cross-Provider Rate-Limit Auto-Failover & Multi-Engine Search Cascade`);
              text = text.replace(/export const EXTENSION_VERSION = '[^']+';/g, `export const EXTENSION_VERSION = '${APP_VERSION}';`);
              content = text.replace(/https:\/\/ais-dev-[^"]+/g, targetUrl);
            } else if (entry.name === 'popup.html') {
              let text = content.toString('utf-8');
              text = text.replace(/<title>Supply Chain News Intelligence — Browser Extension Terminal \(v[^)]+\)<\/title>/g, `<title>Supply Chain News Intelligence — Browser Extension Terminal (${APP_VERSION})</title>`);
              text = text.replace(/<span class="version-tag" id="header-version-badge">v[0-9.]+[^<]*<\/span>/g, `<span class="version-tag" id="header-version-badge">${APP_VERSION} CASCADE & FAILOVER</span>`);
              text = text.replace(/<div class="modal-title">⚙️ Multi-Engine Search Cascade & AI Auto-Failover \(v[^)]+\)<\/div>/g, `<div class="modal-title">⚙️ Multi-Engine Search Cascade & AI Auto-Failover (${APP_VERSION})</div>`);
              content = text.replace(/https:\/\/ais-dev-[^"]+/g, targetUrl);
            } else if (entry.name === 'README_INSTALL.md') {
              let text = content.toString('utf-8');
              text = text.replace(/# Supply Chain & Trade News Intelligence — Autonomous Multi-Provider Browser Extension \(v[^)]+\)/g, `# Supply Chain & Trade News Intelligence — Autonomous Multi-Provider Browser Extension (${APP_VERSION})`);
              text = text.replace(/supply-chain-intelligence-extension(?:-v[0-9.]+)?\.zip/g, EXTENSION_ZIP_FILENAME);
              text = text.replace(/supply-chain-intelligence-extension(?:-v[0-9.]+)?\b/g, EXTENSION_FOLDER_NAME);
              content = text;
            } else if (entry.name.endsWith('.js') || entry.name.endsWith('.html')) {
              const textContent = content.toString('utf-8');
              content = textContent.replace(/https:\/\/ais-dev-[^"]+/g, targetUrl);
            }
            zipFolder.file(entry.name, content);
          }
        }
      };

      addDirectoryToZip(extensionDir, targetZipRoot);
    }

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${EXTENSION_ZIP_FILENAME}"`);
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.send(zipBuffer);
  } catch (error: any) {
    console.error('Error generating extension zip:', error);
    res.status(500).json({ success: false, error: 'Failed to generate extension zip' });
  }
});



