// Autonomous Client-Side Multi-Provider AI & Search Cascade for Browser Extension
// Version: 3.5.0 - Cross-Provider Rate-Limit Auto-Failover & Multi-Engine Search Cascade

export const EXTENSION_VERSION = 'v3.5.0';

export const SUPPORTED_PROVIDERS = {
  gemini: {
    id: 'gemini',
    name: 'Google Gemini',
    tag: 'Free · Search Grounding · Auto-Adaptive',
    defaultModel: 'gemini-3.8-flash',
    keyPlaceholder: 'AQ... or AIzaSy...',
    keyUrl: 'https://aistudio.google.com/app/apikey',
    urlText: 'Get Free Gemini Key (Google AI Studio)',
  },
  groq: {
    id: 'groq',
    name: 'Groq (Llama 3.3)',
    tag: 'Ultra-Fast <200ms · Free Tier',
    defaultModel: 'llama-3.3-70b-versatile',
    endpoint: 'https://api.groq.com/openai/v1/chat/completions',
    keyPlaceholder: 'gsk_...',
    keyUrl: 'https://console.groq.com/keys',
    urlText: 'Get Free Groq Key (Groq Cloud)',
  },
  openrouter: {
    id: 'openrouter',
    name: 'OpenRouter (All-in-One)',
    tag: 'Grok 2, Claude 3.5, DeepSeek, GPT-4o',
    defaultModel: 'google/gemini-2.0-flash-001',
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    keyPlaceholder: 'sk-or-v1-...',
    keyUrl: 'https://openrouter.ai/keys',
    urlText: 'Get OpenRouter Key',
  },
  cerebras: {
    id: 'cerebras',
    name: 'Cerebras (Llama 3.1)',
    tag: 'High Throughput Llama',
    defaultModel: 'llama3.1-70b',
    endpoint: 'https://api.cerebras.ai/v1/chat/completions',
    keyPlaceholder: 'csk-...',
    keyUrl: 'https://cloud.cerebras.ai/',
    urlText: 'Get Cerebras Key',
  },
  grok: {
    id: 'grok',
    name: 'Grok (xAI)',
    tag: 'Real-time & Unfiltered',
    defaultModel: 'grok-2-latest',
    endpoint: 'https://api.x.ai/v1/chat/completions',
    keyPlaceholder: 'xai-...',
    keyUrl: 'https://console.x.ai/',
    urlText: 'Get Grok Key (xAI Console)',
  },
  openai: {
    id: 'openai',
    name: 'OpenAI (GPT-4o)',
    tag: 'Industry Standard',
    defaultModel: 'gpt-4o-mini',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    keyPlaceholder: 'sk-proj-...',
    keyUrl: 'https://platform.openai.com/api-keys',
    urlText: 'Get OpenAI Key',
  },
};

export const SEARCH_PROVIDERS = {
  gemini_grounding: {
    id: 'gemini_grounding',
    name: 'Google Search Grounding',
    tag: 'Native AI Grounding',
    freeAllowance: 'Built into Gemini (Free Tier)',
    keyPlaceholder: 'Uses your Gemini Key',
    keyUrl: 'https://aistudio.google.com/app/apikey',
    urlText: 'Get Free Gemini Key (AI Studio)',
  },
  tavily: {
    id: 'tavily',
    name: 'Tavily Search API',
    tag: 'Built for AI Agents',
    freeAllowance: '1,000 Free Credits / Month',
    keyPlaceholder: 'tvly-...',
    keyUrl: 'https://app.tavily.com/sign-in',
    urlText: 'Get Free Tavily Key (1,000 req/mo)',
  },
  serper: {
    id: 'serper',
    name: 'Serper.dev (Google News)',
    tag: 'Real-time Google Results',
    freeAllowance: '2,500 Free Queries',
    keyPlaceholder: 'Your Serper API key...',
    keyUrl: 'https://serper.dev/signup',
    urlText: 'Get Free Serper Key (2,500 queries)',
  },
  brave: {
    id: 'brave',
    name: 'Brave Search API',
    tag: 'Independent & Private',
    freeAllowance: '2,000 Free Queries / Month',
    keyPlaceholder: 'BSA-...',
    keyUrl: 'https://brave.com/search/api/',
    urlText: 'Get Free Brave Key (2,000 req/mo)',
  },
  exa: {
    id: 'exa',
    name: 'Exa Neural Search',
    tag: 'Embeddings & Web Filtering',
    freeAllowance: '1,000 Free Searches',
    keyPlaceholder: 'Your Exa key...',
    keyUrl: 'https://dashboard.exa.ai/',
    urlText: 'Get Free Exa Key (1,000 searches)',
  },
  firecrawl: {
    id: 'firecrawl',
    name: 'Firecrawl API',
    tag: 'Markdown Web Scraper',
    freeAllowance: '500 Free Credits',
    keyPlaceholder: 'fc-...',
    keyUrl: 'https://www.firecrawl.dev/app/api-keys',
    urlText: 'Get Free Firecrawl Key (500 scrapes)',
  },
};

let cachedBestGeminiModel = null;

export class AutonomousAIService {
  static getStoredConfig() {
    return new Promise((resolve) => {
      const keys = [
        'activeProvider',
        'geminiApiKey',
        'grokApiKey',
        'openrouterKey',
        'groqKey',
        'cerebrasKey',
        'openaiKey',
        'customModel',
        'videoLanguage',
        'videoDuration',
        'videoTone',
        'videoPlatform',
        'tavilyApiKey',
        'serperApiKey',
        'braveApiKey',
        'exaApiKey',
        'firecrawlApiKey',
        'searchProviderOrder',
        'aiProviderOrder',
        'autoFailoverEnabled',
      ];

      const readLocalFallback = () => {
        let savedSearchOrder = null;
        let savedAiOrder = null;
        try {
          const s = localStorage.getItem('ext_search_order');
          if (s) savedSearchOrder = JSON.parse(s);
          const a = localStorage.getItem('ext_ai_order');
          if (a) savedAiOrder = JSON.parse(a);
        } catch {}

        return {
          activeProvider: localStorage.getItem('ext_active_provider') || 'gemini',
          geminiApiKey: localStorage.getItem('ext_gemini_key') || localStorage.getItem('sc_gemini_key') || '',
          grokApiKey: localStorage.getItem('ext_grok_key') || '',
          openrouterKey: localStorage.getItem('ext_openrouter_key') || '',
          groqKey: localStorage.getItem('ext_groq_key') || '',
          cerebrasKey: localStorage.getItem('ext_cerebras_key') || '',
          openaiKey: localStorage.getItem('ext_openai_key') || '',
          customModel: localStorage.getItem('ext_custom_model') || '',
          videoLanguage: localStorage.getItem('ext_video_lang') || 'Bangla',
          videoDuration: localStorage.getItem('ext_video_duration') || '60s',
          videoTone: localStorage.getItem('ext_video_tone') || 'Professional News Documentary',
          videoPlatform: localStorage.getItem('ext_video_platform') || 'YouTube Shorts',

          tavilyApiKey: localStorage.getItem('ext_tavily_key') || '',
          serperApiKey: localStorage.getItem('ext_serper_key') || '',
          braveApiKey: localStorage.getItem('ext_brave_key') || '',
          exaApiKey: localStorage.getItem('ext_exa_key') || '',
          firecrawlApiKey: localStorage.getItem('ext_firecrawl_key') || '',

          searchProviderOrder: savedSearchOrder || ['tavily', 'serper', 'brave', 'exa', 'firecrawl', 'gemini_grounding'],
          aiProviderOrder: savedAiOrder || ['gemini', 'groq', 'openrouter', 'cerebras', 'grok', 'openai'],
          autoFailoverEnabled: localStorage.getItem('ext_auto_failover') !== 'false',
        };
      };

      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get(keys, (res) => {
          const fallback = readLocalFallback();
          resolve({
            activeProvider: res.activeProvider || fallback.activeProvider,
            geminiApiKey: res.geminiApiKey || fallback.geminiApiKey,
            grokApiKey: res.grokApiKey || fallback.grokApiKey,
            openrouterKey: res.openrouterKey || fallback.openrouterKey,
            groqKey: res.groqKey || fallback.groqKey,
            cerebrasKey: res.cerebrasKey || fallback.cerebrasKey,
            openaiKey: res.openaiKey || fallback.openaiKey,
            customModel: res.customModel || fallback.customModel,
            videoLanguage: res.videoLanguage || fallback.videoLanguage,
            videoDuration: res.videoDuration || fallback.videoDuration,
            videoTone: res.videoTone || fallback.videoTone,
            videoPlatform: res.videoPlatform || fallback.videoPlatform,

            tavilyApiKey: res.tavilyApiKey || fallback.tavilyApiKey,
            serperApiKey: res.serperApiKey || fallback.serperApiKey,
            braveApiKey: res.braveApiKey || fallback.braveApiKey,
            exaApiKey: res.exaApiKey || fallback.exaApiKey,
            firecrawlApiKey: res.firecrawlApiKey || fallback.firecrawlApiKey,

            searchProviderOrder: res.searchProviderOrder || fallback.searchProviderOrder,
            aiProviderOrder: res.aiProviderOrder || fallback.aiProviderOrder,
            autoFailoverEnabled: res.autoFailoverEnabled !== undefined ? res.autoFailoverEnabled : fallback.autoFailoverEnabled,
          });
        });
      } else {
        resolve(readLocalFallback());
      }
    });
  }

  static saveConfig(updates) {
    return new Promise((resolve) => {
      Object.entries(updates).forEach(([k, v]) => {
        try {
          const val = typeof v === 'object' ? JSON.stringify(v) : String(v);
          localStorage.setItem(`ext_${k}`, val);
          localStorage.setItem(`sc_${k}`, val);
        } catch {
          // ignore
        }
      });

      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set(updates, () => resolve(true));
      } else {
        resolve(true);
      }
    });
  }

  static isRateLimitError(errOrMsg) {
    const str = typeof errOrMsg === 'string' ? errOrMsg : (errOrMsg?.message || JSON.stringify(errOrMsg) || '');
    const lower = str.toLowerCase();
    return (
      lower.includes('429') ||
      lower.includes('rate limit') ||
      lower.includes('quota') ||
      lower.includes('resource_exhausted') ||
      lower.includes('exceeded your current quota') ||
      lower.includes('too many requests') ||
      lower.includes('insufficient_quota') ||
      lower.includes('credit') ||
      lower.includes('billing')
    );
  }

  /**
   * AUTOMATIC MODEL DISCOVERY FOR GEMINI
   */
  static async discoverBestGeminiModel(apiKey) {
    if (cachedBestGeminiModel) return cachedBestGeminiModel;

    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey.trim()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.models && Array.isArray(json.models)) {
          const validModels = json.models
            .filter((m) => m.supportedGenerationMethods?.includes('generateContent'))
            .map((m) => m.name.replace(/^models\//, ''));

          const flashModels = validModels.filter((m) => m.includes('flash') && !m.includes('lite'));
          if (flashModels.length > 0) {
            flashModels.sort((a, b) => b.localeCompare(a));
            cachedBestGeminiModel = flashModels[0];
            return cachedBestGeminiModel;
          }

          if (validModels.length > 0) {
            cachedBestGeminiModel = validModels[0];
            return cachedBestGeminiModel;
          }
        }
      }
    } catch (e) {
      console.warn('[AutonomousAIService] Failed to query models list from Google, falling back to ladder:', e);
    }

    return 'gemini-3.8-flash';
  }

  /**
   * Smart Gemini caller with automatic failover between available models
   */
  static async callGeminiAdaptive(apiKey, customModel, requestBody) {
    const candidateList = [];

    if (customModel && customModel.trim()) {
      candidateList.push(customModel.trim());
    }

    const discovered = await this.discoverBestGeminiModel(apiKey);
    if (!candidateList.includes(discovered)) {
      candidateList.push(discovered);
    }

    const fallbacks = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.5-flash', 'gemini-2.5-flash'];
    fallbacks.forEach((m) => {
      if (!candidateList.includes(m)) candidateList.push(m);
    });

    let lastError = null;
    for (const model of candidateList) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        });

        const data = await res.json();
        if (data.error) {
          const errMsg = data.error.message || '';
          if (
            data.error.code === 404 ||
            data.error.code === 503 ||
            errMsg.includes('no longer available') ||
            errMsg.includes('high demand') ||
            errMsg.includes('NOT_FOUND')
          ) {
            lastError = new Error(errMsg);
            continue;
          }
          throw new Error(errMsg || 'Gemini API call failed');
        }

        cachedBestGeminiModel = model;
        return { data, modelUsed: model };
      } catch (err) {
        lastError = err;
        if (
          err.message &&
          (err.message.includes('no longer available') ||
            err.message.includes('high demand') ||
            err.message.includes('NOT_FOUND') ||
            err.message.includes('404') ||
            err.message.includes('503'))
        ) {
          continue;
        }
        throw err;
      }
    }

    throw lastError || new Error('All model candidates failed. Please verify your Gemini API key.');
  }

  // =========================================================================
  // SEARCH PROVIDERS IMPLEMENTATION
  // =========================================================================

  static async searchTavily(apiKey, query) {
    const res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: apiKey.trim(),
        query,
        search_depth: 'basic',
        max_results: 8,
        include_answer: true,
      }),
    });
    const data = await res.json();
    if (data.error || !res.ok) throw new Error(data.error || data.detail || `Tavily HTTP ${res.status}`);
    return (data.results || []).map((r) => ({
      title: r.title || 'News Story',
      url: r.url || 'https://news.google.com',
      snippet: r.content || r.snippet || '',
    }));
  }

  static async searchSerper(apiKey, query) {
    const res = await fetch('https://google.serper.dev/news', {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey.trim(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ q: query, num: 8 }),
    });
    const data = await res.json();
    if (data.message || !res.ok) throw new Error(data.message || `Serper HTTP ${res.status}`);
    return (data.news || data.organic || []).map((r) => ({
      title: r.title || 'News Story',
      url: r.link || r.url || 'https://news.google.com',
      snippet: r.snippet || '',
    }));
  }

  static async searchBrave(apiKey, query) {
    const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=8`;
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Subscription-Token': apiKey.trim(),
      },
    });
    const data = await res.json();
    if (data.error || !res.ok) throw new Error(data.error?.message || `Brave HTTP ${res.status}`);
    return (data.web?.results || []).map((r) => ({
      title: r.title || 'News Story',
      url: r.url || 'https://news.google.com',
      snippet: r.description || '',
    }));
  }

  static async searchExa(apiKey, query) {
    const res = await fetch('https://api.exa.ai/search', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey.trim(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, numResults: 8, contents: { text: { maxCharacters: 500 } } }),
    });
    const data = await res.json();
    if (data.error || !res.ok) throw new Error(data.error || `Exa HTTP ${res.status}`);
    return (data.results || []).map((r) => ({
      title: r.title || 'News Story',
      url: r.url || 'https://news.google.com',
      snippet: r.text || '',
    }));
  }

  static async searchFirecrawl(apiKey, query) {
    const res = await fetch('https://api.firecrawl.dev/v1/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, limit: 8 }),
    });
    const data = await res.json();
    if (data.error || !res.ok) throw new Error(data.error || `Firecrawl HTTP ${res.status}`);
    return (data.data || []).map((r) => ({
      title: r.title || 'News Story',
      url: r.url || 'https://news.google.com',
      snippet: r.description || r.markdown?.slice(0, 300) || '',
    }));
  }

  /**
   * MULTI-ENGINE SEARCH CASCADE:
   * Cascades through user's search order (1st, 2nd, 3rd...).
   * If Provider #1 hits 429 / quota limit, auto-switches to Provider #2, #3...
   */
  static async executeSearchCascade(query, timeWindow = '72h') {
    const config = await this.getStoredConfig();
    const order = config.searchProviderOrder || ['tavily', 'serper', 'brave', 'exa', 'firecrawl', 'gemini_grounding'];
    const failoverLog = [];

    const searchQuery = `${query || 'global supply chain maritime freight tariff port disruption'} past ${timeWindow}`;

    for (const provId of order) {
      let key = '';
      switch (provId) {
        case 'tavily': key = config.tavilyApiKey; break;
        case 'serper': key = config.serperApiKey; break;
        case 'brave': key = config.braveApiKey; break;
        case 'exa': key = config.exaApiKey; break;
        case 'firecrawl': key = config.firecrawlApiKey; break;
        case 'gemini_grounding': key = config.geminiApiKey; break;
      }

      if (!key || !key.trim()) continue;

      try {
        let results = [];
        if (provId === 'tavily') results = await this.searchTavily(key, searchQuery);
        else if (provId === 'serper') results = await this.searchSerper(key, searchQuery);
        else if (provId === 'brave') results = await this.searchBrave(key, searchQuery);
        else if (provId === 'exa') results = await this.searchExa(key, searchQuery);
        else if (provId === 'firecrawl') results = await this.searchFirecrawl(key, searchQuery);
        else if (provId === 'gemini_grounding') return { results: [], providerUsed: 'gemini_grounding', failoverLog };

        if (results && results.length > 0) {
          return { results, providerUsed: provId, failoverLog };
        }
      } catch (err) {
        const isQuota = this.isRateLimitError(err);
        const reason = isQuota ? 'Quota Exceeded' : (err.message || 'Failed');
        const logMsg = `Auto-switched from ${provId.toUpperCase()} (${reason}) to next search engine`;
        console.warn(logMsg);
        failoverLog.push(logMsg);
      }
    }

    return { results: [], providerUsed: 'none', failoverLog };
  }

  // =========================================================================
  // CROSS-PROVIDER AI CASCADE ON 429 / QUOTA EXHAUSTION
  // =========================================================================

  /**
   * Executes AI across user's serial order.
   * If Provider #1 (e.g. Gemini) hits 429 / quota limit, auto-switches to Provider #2 (e.g. Groq -> OpenRouter -> etc.)!
   */
  static async executeAiCascade(prompt, options = {}) {
    const config = await this.getStoredConfig();
    const primaryProv = config.activeProvider || 'gemini';
    const failoverLog = [];

    const candidateProviders = [primaryProv];
    (config.aiProviderOrder || ['gemini', 'groq', 'openrouter', 'cerebras', 'grok', 'openai']).forEach((p) => {
      if (!candidateProviders.includes(p)) candidateProviders.push(p);
    });

    let lastError = null;

    for (const provId of candidateProviders) {
      let apiKey = '';
      switch (provId) {
        case 'gemini': apiKey = config.geminiApiKey; break;
        case 'groq': apiKey = config.groqKey; break;
        case 'openrouter': apiKey = config.openrouterKey; break;
        case 'cerebras': apiKey = config.cerebrasKey; break;
        case 'grok': apiKey = config.grokApiKey; break;
        case 'openai': apiKey = config.openaiKey; break;
      }

      if (!apiKey || !apiKey.trim()) continue;

      const provDef = SUPPORTED_PROVIDERS[provId];
      if (!provDef) continue;

      try {
        let enrichedPrompt = prompt;
        if (options.searchGroundingData && options.searchGroundingData.length > 0) {
          const groundingText = options.searchGroundingData
            .map((r, i) => `[Source ${i + 1}]: ${r.title}\nURL: ${r.url}\nSummary: ${r.snippet}`)
            .join('\n\n');
          enrichedPrompt = `CURRENT VERIFIED LIVE WEB WIRE DATA:\n${groundingText}\n\nTASK:\n${prompt}`;
        }

        if (provId === 'gemini') {
          const reqBody = {
            contents: [{ parts: [{ text: enrichedPrompt }] }],
            generationConfig: { temperature: options.temperature || 0.2 },
          };
          if (!options.searchGroundingData || options.searchGroundingData.length === 0) {
            reqBody.tools = [{ googleSearch: {} }];
          }

          const { data, modelUsed } = await this.callGeminiAdaptive(apiKey, options.customModel || config.customModel, reqBody);
          const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          const parsed = this.extractJson(rawText);
          return { data: parsed, rawText, providerUsed: 'gemini', modelUsed, failoverLog };
        }

        // OpenAI-compatible providers: Groq, OpenRouter, Cerebras, Grok, OpenAI
        const endpoint = provDef.endpoint;
        const model = options.customModel || provDef.defaultModel;
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey.trim()}`,
          },
          body: JSON.stringify({
            model,
            messages: [
              {
                role: 'system',
                content: options.systemInstruction || 'You are an autonomous supply chain intelligence engine. Output strictly raw JSON.',
              },
              { role: 'user', content: enrichedPrompt },
            ],
            temperature: options.temperature || 0.2,
          }),
        });

        const resData = await res.json();
        if (resData.error || !res.ok) {
          const errMsg = typeof resData.error === 'string' ? resData.error : (resData.error?.message || `HTTP ${res.status}`);
          throw new Error(errMsg);
        }

        const rawText = resData.choices?.[0]?.message?.content || '';
        const parsed = this.extractJson(rawText);
        return { data: parsed, rawText, providerUsed: provId, modelUsed: model, failoverLog };
      } catch (err) {
        lastError = err;
        const isQuota = this.isRateLimitError(err);
        const reason = isQuota ? 'Rate Limit / Quota Exceeded' : (err.message || 'Error');
        const logMsg = `Switched from ${provDef.name} (${reason}) to next configured AI provider`;
        console.warn(logMsg);
        failoverLog.push(logMsg);

        if (!config.autoFailoverEnabled) {
          throw err;
        }
      }
    }

    throw lastError || new Error('All configured AI providers failed or have exceeded their quota.');
  }

  /**
   * Test connection across any provider (AI or Search)
   */
  static async testConnection(provider, apiKey, customModel) {
    if (!apiKey || !apiKey.trim()) {
      return { success: false, latencyMs: 0, message: 'Please enter an API key to test.' };
    }

    const start = Date.now();

    if (SEARCH_PROVIDERS[provider]) {
      try {
        let count = 0;
        if (provider === 'tavily') count = (await this.searchTavily(apiKey, 'supply chain test')).length;
        else if (provider === 'serper') count = (await this.searchSerper(apiKey, 'supply chain test')).length;
        else if (provider === 'brave') count = (await this.searchBrave(apiKey, 'supply chain test')).length;
        else if (provider === 'exa') count = (await this.searchExa(apiKey, 'supply chain test')).length;
        else if (provider === 'firecrawl') count = (await this.searchFirecrawl(apiKey, 'supply chain test')).length;
        else if (provider === 'gemini_grounding') return { success: true, latencyMs: Date.now() - start, message: 'Uses your Gemini API key for Google Grounding.' };

        return {
          success: true,
          latencyMs: Date.now() - start,
          message: `Connected to ${SEARCH_PROVIDERS[provider].name}! (${count} test results retrieved)`,
        };
      } catch (err) {
        return { success: false, latencyMs: Date.now() - start, message: err.message || 'Search test failed' };
      }
    }

    const prov = SUPPORTED_PROVIDERS[provider];
    if (!prov) return { success: false, latencyMs: 0, message: 'Unknown provider.' };

    try {
      if (provider === 'gemini') {
        const { modelUsed } = await this.callGeminiAdaptive(apiKey, customModel, {
          contents: [{ parts: [{ text: 'Respond strictly with the word: READY' }] }],
        });
        return {
          success: true,
          latencyMs: Date.now() - start,
          message: `Connected to Google Gemini (${modelUsed})!`,
          modelUsed,
        };
      }

      const endpoint = prov.endpoint;
      const model = customModel || prov.defaultModel;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey.trim()}`,
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: 'Respond strictly with the word: READY' }],
          max_tokens: 10,
        }),
      });

      const data = await res.json();
      if (data.error) {
        const errMsg = typeof data.error === 'string' ? data.error : (data.error.message || 'Authentication error');
        throw new Error(errMsg);
      }

      return {
        success: true,
        latencyMs: Date.now() - start,
        message: `Connected to ${prov.name} (${model})!`,
        modelUsed: model,
      };
    } catch (err) {
      return {
        success: false,
        latencyMs: Date.now() - start,
        message: err.message || 'Connection failed',
      };
    }
  }

  static extractJson(rawText) {
    if (!rawText) throw new Error('Received empty response from AI provider.');
    const cleaned = rawText
      .replace(/^```json\s*/im, '')
      .replace(/^```\s*/im, '')
      .replace(/\s*```$/im, '')
      .trim();

    try {
      return JSON.parse(cleaned);
    } catch {
      const firstBrace = cleaned.indexOf('{');
      const lastBrace = cleaned.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        return JSON.parse(cleaned.substring(firstBrace, lastBrace + 1));
      }
      throw new Error('Failed to parse valid JSON from AI response.');
    }
  }

  static async searchNews(apiKey, timeWindow = '72h', customQuery = '', customModel) {
    // Execute search cascade first (Tavily, Serper, Brave, Exa, Firecrawl, etc.)
    const searchRes = await this.executeSearchCascade(customQuery, timeWindow);

    const prompt = `You are a Global Chief Procurement Officer (CPO) and Trade Intelligence Director.
Search and synthesize breaking, real-time supply chain, maritime, tariff, trade restriction, and port disruption news from the last ${timeWindow}.
${customQuery ? `Specific focus topic: "${customQuery}".` : ''}

Output strictly valid JSON with this exact structure:
{
  "totalAnalyzed": 284,
  "lastUpdated": "${new Date().toISOString()}",
  "confidenceMetric": 98.4,
  "top10Things": [
    {
      "rank": 1,
      "headline": "Short punchy headline",
      "whyItMatters": "Actionable directive for buyers and sourcing managers",
      "priorityScore": 95,
      "source": "Reuters / Bloomberg / FreightWaves"
    }
  ],
  "items": [
    {
      "id": "live-news-1",
      "headline": "Detailed headline specifying trade corridors or materials",
      "oneLineSummary": "Clear summary of the event with numbers and freight/tariff consequences",
      "executiveSummary": "2-3 sentences explaining procurement impact, delays, and cost variance",
      "source": "Bloomberg / Reuters / FreightWaves / JOC",
      "sourceUrl": "https://news.google.com",
      "publishedAt": "${new Date().toISOString()}",
      "category": "Shipping",
      "priorityScore": 95,
      "priorityLevel": "CRITICAL",
      "regions": ["Red Sea", "Europe"],
      "countries": ["Egypt", "Yemen", "Germany"],
      "industries": ["Maritime Shipping", "Retail"],
      "credibilityType": "Established news organization",
      "keyFacts": ["Key verified fact 1", "Key verified fact 2", "Key verified fact 3"],
      "supplyChainImpact": {
        "procurement": "Review supplier delivery buffers",
        "sourcing": "Assess alternate corridors",
        "logistics": "Container transit time extended by 12-14 days",
        "inventory": "Maintain 45 days forward safety stock",
        "cost": "+15-25% freight surcharge",
        "leadTime": "+10 to +18 days"
      },
      "bangladeshImpact": {
        "level": "High",
        "rationale": "Feeder vessel turnaround delay impacts RMG export shipments"
      },
      "whatToWatch": ["Carrier GRI notices", "Chittagong port dwell time"],
      "scoreBreakdown": {
        "supplyChainRelevance": 25,
        "procurementImpact": 15,
        "businessEconomicImpact": 14,
        "urgency": 9,
        "geographicImpact": 9,
        "industryImpact": 9,
        "sourceAuthority": 5,
        "crossSourceConfirmation": 5,
        "duration": 4,
        "total": 95
      }
    }
  ]
}
Return raw JSON with no Markdown wrapping.`;

    // Execute AI cascade with automatic cross-provider failover
    const aiRes = await this.executeAiCascade(prompt, {
      temperature: 0.2,
      customModel,
      searchGroundingData: searchRes.results,
    });

    const parsed = aiRes.data;

    if (parsed.items && Array.isArray(parsed.items)) {
      parsed.items.forEach((item, idx) => {
        if (!item.sourceUrl || item.sourceUrl.includes('example.com')) {
          if (searchRes.results[idx % searchRes.results.length]) {
            item.sourceUrl = searchRes.results[idx % searchRes.results.length].url;
          } else {
            item.sourceUrl = `https://news.google.com/search?q=${encodeURIComponent(item.headline)}`;
          }
        }
        item.discoveredAt = new Date().toISOString();
        if (!item.id) item.id = `live-ext-${idx + 1}-${Date.now()}`;
      });
    }

    const failoverNotes = [...searchRes.failoverLog, ...aiRes.failoverLog];
    return {
      ...parsed,
      modelUsed: aiRes.modelUsed,
      providerUsed: aiRes.providerUsed,
      searchProviderUsed: searchRes.providerUsed,
      failoverNotes,
    };
  }

  static async generateVideoBrief(apiKey, item, options = {}, customModel) {
    const {
      duration = '60s',
      language = 'Bangla',
      tone = 'Professional News Documentary',
      platform = 'YouTube Shorts',
      aspectRatio = '9:16',
      modifier = '',
    } = options;

    const prompt = `You are a Senior Video Producer & Supply Chain Intelligence Anchor.
Create a FACT-LOCKED news video brief script.
Headline: "${item.headline}"
Summary: "${item.oneLineSummary || item.summary || ''}"
Key Facts: ${JSON.stringify(item.keyFacts || [])}
Category: ${item.category}
Source: ${item.source}
Duration: ${duration}
Platform: ${platform} (${aspectRatio})
Language: ${language} (CRITICAL: If Bangla, write spoken voiceover in fluent, high-impact Bengali script!)
Tone: ${tone}
${modifier ? `Adjustment: "${modifier}"` : ''}

Output strictly valid JSON:
{
  "titles": ["5 engaging, fact-accurate video titles"],
  "hooks": ["5 opening hooks (0-3s) in ${language}"],
  "thumbnailTexts": ["5 short punchy thumbnail texts (2-4 words)"],
  "description": "2-3 sentences platform description with hashtags",
  "hashtags": ["#SupplyChain", "#Procurement", "#TradeNews"],
  "seoKeywords": ["supply chain news", "logistics", "freight rates"],
  "script": {
    "hook": "Spoken opening hook in ${language}",
    "context": "Source context and verified event in ${language}",
    "mainDevelopment": "Key development and impacted trade routes in ${language}",
    "supplyChainImpact": "Procurement and cost consequences in ${language}",
    "whatToWatch": "Upcoming indicators in ${language}",
    "ending": "Closing actionable directive in ${language}",
    "fullNarration": "Full timeline-stamped spoken transcript with [0:00 - 0:10], [0:10 - 0:25], etc. in ${language}"
  },
  "scenePlan": [
    {
      "sceneNumber": 1,
      "timestamp": "0:00 - 0:10",
      "narration": "Exact spoken narration in ${language}",
      "visualDirection": "Detailed visual cue: container map, carrier graphics",
      "visualType": "Illustrative Map/Chart",
      "onScreenText": "Headline alert"
    },
    {
      "sceneNumber": 2,
      "timestamp": "0:10 - 0:25",
      "narration": "Exact spoken narration in ${language}",
      "visualDirection": "Data chart of transit delay days",
      "visualType": "Chart Graphics",
      "onScreenText": "Transit Delay Days"
    }
  ],
  "whatWeKnow": ["3-5 verified facts"],
  "whatIsNotConfirmed": ["1-2 items pending confirmation"]
}
Return raw JSON only.`;

    const aiRes = await this.executeAiCascade(prompt, {
      temperature: 0.25,
      customModel,
    });

    const parsed = aiRes.data;

    return {
      id: `brief-${item.id}-${Date.now()}`,
      newsItemId: item.id,
      headline: item.headline,
      sourceName: item.source,
      sourceUrl: item.sourceUrl,
      publishedAt: item.publishedAt,
      priorityScore: item.priorityScore,
      category: item.category,
      platform,
      duration,
      aspectRatio,
      language,
      tone,
      createdAt: new Date().toISOString(),
      script: parsed.script || {
        hook: parsed.hooks?.[0] || 'Critical supply chain alert.',
        fullNarration: item.oneLineSummary || item.headline,
      },
      titles: parsed.titles || [item.headline],
      hooks: parsed.hooks || ['Supply chain update'],
      thumbnailTexts: parsed.thumbnailTexts || ['CRITICAL ALERT'],
      description: parsed.description || item.headline,
      hashtags: parsed.hashtags || ['#SupplyChain'],
      seoKeywords: parsed.seoKeywords || ['supply chain'],
      scenePlan: parsed.scenePlan || [],
      whatWeKnow: parsed.whatWeKnow || item.keyFacts || [item.headline],
      whatIsNotConfirmed: parsed.whatIsNotConfirmed || ['Disruption timeline subject to ongoing carrier notices.'],
      modelUsed: aiRes.modelUsed,
      providerUsed: aiRes.providerUsed,
      failoverNotes: aiRes.failoverLog,
    };
  }

  static async generateExecutiveBrief(apiKey, dataset, customModel) {
    const prompt = `You are the Chief Intelligence Officer for Global Supply Chains.
Generate an Executive Daily Briefing JSON based on these top stories:
${JSON.stringify((dataset.top10Things || []).slice(0, 5), null, 2)}

Provide concise C-suite briefing JSON:
{
  "date": "${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}",
  "executiveSummary": "2-3 sentences synthesis",
  "top5Events": [
    {"rank": 1, "headline": "string", "whyItMatters": "string", "source": "string"}
  ],
  "keySupplyChainRisks": ["string"],
  "procurementRisks": ["string"],
  "logisticsRisks": ["string"],
  "whatToWatchNext72Hours": ["string"],
  "actionableChecklist": ["string"]
}
Return raw JSON only.`;

    const aiRes = await this.executeAiCascade(prompt, {
      temperature: 0.2,
      customModel,
    });
    return aiRes.data;
  }

  static async deepAnalyzeStory(apiKey, headline, summary, customModel) {
    const prompt = `You are a Chief Procurement Officer & Global Supply Chain Risk Consultant.
Perform an in-depth strategic procurement assessment for this news event:
Headline: "${headline}"
Context: "${summary}"

Analyze:
1. Strategic procurement considerations.
2. Estimated lead time variance.
3. Estimated cost variance on landed cost.
4. Recommended inventory buffer policy (in days).
5. 3-phase action matrix (Immediate 0-7 days, Tactical 7-30 days, Strategic 30-90 days).

Return a JSON object:
{
  "strategicProcurementConsiderations": ["string"],
  "leadTimeVarianceEstimate": "string",
  "costVarianceEstimate": "string",
  "inventoryBufferRecommendation": "string",
  "recommendedActionMatrix": [
    {"phase": "string", "action": "string"}
  ]
}
Return raw JSON only.`;

    const aiRes = await this.executeAiCascade(prompt, {
      temperature: 0.2,
      customModel,
    });
    return aiRes.data;
  }
}
