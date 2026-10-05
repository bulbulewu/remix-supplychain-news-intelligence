// Adaptive Multi-Provider AI & Search Service
// Version: 3.5.0
// Features: Cross-Provider Rate-Limit Auto-Failover, Multi-Engine Search Cascade
// Providers: Gemini, Grok, OpenRouter, Groq, Cerebras, OpenAI
// Search Engines: Tavily, Serper.dev, Brave Search, Exa, Firecrawl, Google Grounding

import { APP_VERSION, AI_ENGINE_VERSION, CURRENT_VERSION_INFO } from '../data/versionInfo';

declare const chrome: any;

export { APP_VERSION, AI_ENGINE_VERSION };

export interface ProviderDefinition {
  id: string;
  name: string;
  tag: string;
  defaultModel: string;
  endpoint?: string;
  keyPlaceholder: string;
  keyUrl: string;
  urlText: string;
}

export const SUPPORTED_PROVIDERS: Record<string, ProviderDefinition> = {
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

export interface SearchProviderDefinition {
  id: string;
  name: string;
  tag: string;
  freeAllowance: string;
  keyPlaceholder: string;
  keyUrl: string;
  urlText: string;
}

export const SEARCH_PROVIDERS: Record<string, SearchProviderDefinition> = {
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

export interface StoredAppConfig {
  activeProvider: string;
  geminiApiKey: string;
  grokApiKey: string;
  openrouterKey: string;
  groqKey: string;
  cerebrasKey: string;
  openaiKey: string;
  customModel: string;

  // Search API Keys
  tavilyApiKey: string;
  serperApiKey: string;
  braveApiKey: string;
  exaApiKey: string;
  firecrawlApiKey: string;

  // Priority Cascade Order
  searchProviderOrder: string[];
  aiProviderOrder: string[];
  autoFailoverEnabled: boolean;
}

let cachedBestGeminiModel: string | null = null;

export class AdaptiveAiService {
  static getStoredConfig(): StoredAppConfig {
    try {
      const savedSearchOrder = localStorage.getItem('sc_search_order') || localStorage.getItem('ext_search_order');
      const savedAiOrder = localStorage.getItem('sc_ai_order') || localStorage.getItem('ext_ai_order');

      return {
        activeProvider: localStorage.getItem('sc_active_provider') || 'gemini',
        geminiApiKey: localStorage.getItem('sc_gemini_key') || localStorage.getItem('ext_gemini_api_key') || '',
        grokApiKey: localStorage.getItem('sc_grok_key') || localStorage.getItem('ext_grok_key') || '',
        openrouterKey: localStorage.getItem('sc_openrouter_key') || localStorage.getItem('ext_openrouter_key') || '',
        groqKey: localStorage.getItem('sc_groq_key') || localStorage.getItem('ext_groq_key') || '',
        cerebrasKey: localStorage.getItem('sc_cerebras_key') || localStorage.getItem('ext_cerebras_key') || '',
        openaiKey: localStorage.getItem('sc_openai_key') || localStorage.getItem('ext_openai_key') || '',
        customModel: localStorage.getItem('sc_custom_model') || localStorage.getItem('ext_custom_model') || '',

        // Search Keys
        tavilyApiKey: localStorage.getItem('sc_tavily_key') || localStorage.getItem('ext_tavily_key') || '',
        serperApiKey: localStorage.getItem('sc_serper_key') || localStorage.getItem('ext_serper_key') || '',
        braveApiKey: localStorage.getItem('sc_brave_key') || localStorage.getItem('ext_brave_key') || '',
        exaApiKey: localStorage.getItem('sc_exa_key') || localStorage.getItem('ext_exa_key') || '',
        firecrawlApiKey: localStorage.getItem('sc_firecrawl_key') || localStorage.getItem('ext_firecrawl_key') || '',

        // Serial / Order Priorities
        searchProviderOrder: savedSearchOrder ? JSON.parse(savedSearchOrder) : ['tavily', 'serper', 'brave', 'exa', 'firecrawl', 'gemini_grounding'],
        aiProviderOrder: savedAiOrder ? JSON.parse(savedAiOrder) : ['gemini', 'groq', 'openrouter', 'cerebras', 'grok', 'openai'],
        autoFailoverEnabled: localStorage.getItem('sc_auto_failover') !== 'false',
      };
    } catch {
      return {
        activeProvider: 'gemini',
        geminiApiKey: '',
        grokApiKey: '',
        openrouterKey: '',
        groqKey: '',
        cerebrasKey: '',
        openaiKey: '',
        customModel: '',
        tavilyApiKey: '',
        serperApiKey: '',
        braveApiKey: '',
        exaApiKey: '',
        firecrawlApiKey: '',
        searchProviderOrder: ['tavily', 'serper', 'brave', 'exa', 'firecrawl', 'gemini_grounding'],
        aiProviderOrder: ['gemini', 'groq', 'openrouter', 'cerebras', 'grok', 'openai'],
        autoFailoverEnabled: true,
      };
    }
  }

  static saveConfig(updates: Record<string, any>): void {
    try {
      Object.entries(updates).forEach(([k, v]) => {
        const val = typeof v === 'object' ? JSON.stringify(v) : String(v);
        localStorage.setItem(`sc_${k}`, val);
        localStorage.setItem(`ext_${k}`, val);
      });
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set(updates);
      }
    } catch {
      // storage unavailable
    }
  }

  static getActiveKey(): { provider: string; apiKey: string; customModel: string } {
    const config = this.getStoredConfig();
    const provider = config.activeProvider || 'gemini';
    let apiKey = '';
    switch (provider) {
      case 'gemini': apiKey = config.geminiApiKey; break;
      case 'groq': apiKey = config.groqKey; break;
      case 'openrouter': apiKey = config.openrouterKey; break;
      case 'cerebras': apiKey = config.cerebrasKey; break;
      case 'grok': apiKey = config.grokApiKey; break;
      case 'openai': apiKey = config.openaiKey; break;
      default: apiKey = config.geminiApiKey; break;
    }
    return { provider, apiKey, customModel: config.customModel };
  }

  static isRateLimitError(errOrMsg: any): boolean {
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
   * AUTOMATIC MODEL DISCOVERY FOR GEMINI:
   * Dynamically queries Google's /v1beta/models endpoint to find which models are active for this key.
   */
  static async discoverBestGeminiModel(apiKey: string): Promise<string> {
    if (cachedBestGeminiModel) return cachedBestGeminiModel;

    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey.trim()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.models && Array.isArray(json.models)) {
          const validModels = json.models
            .filter((m: any) => m.supportedGenerationMethods?.includes('generateContent'))
            .map((m: any) => m.name.replace(/^models\//, ''));

          // Preferred order: newest flash models (not lite)
          const flashModels = validModels.filter((m: string) => m.includes('flash') && !m.includes('lite'));
          if (flashModels.length > 0) {
            flashModels.sort((a: string, b: string) => b.localeCompare(a));
            cachedBestGeminiModel = flashModels[0];
            return cachedBestGeminiModel || 'gemini-3.8-flash';
          }

          if (validModels.length > 0) {
            cachedBestGeminiModel = validModels[0];
            return cachedBestGeminiModel || 'gemini-3.8-flash';
          }
        }
      }
    } catch (e) {
      console.warn('Failed to query models list from Google, falling back to ladder:', e);
    }

    return 'gemini-3.8-flash';
  }

  /**
   * Smart Gemini caller with automatic failover between available models
   */
  static async callGeminiAdaptive(apiKey: string, customModel: string | undefined, requestBody: any): Promise<{ data: any; modelUsed: string }> {
    let candidateList: string[] = [];

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

    let lastError: any = null;
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
      } catch (err: any) {
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
  // SEARCH PROVIDERS IMPLEMENTATION & CASCADE
  // =========================================================================

  /**
   * Search Tavily API
   */
  static async searchTavily(apiKey: string, query: string): Promise<{ title: string; url: string; snippet: string }[]> {
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
    if (data.error || !res.ok) {
      throw new Error(data.error || data.detail || `Tavily HTTP ${res.status}`);
    }
    return (data.results || []).map((r: any) => ({
      title: r.title || 'News Story',
      url: r.url || 'https://news.google.com',
      snippet: r.content || r.snippet || '',
    }));
  }

  /**
   * Search Serper.dev Google News API
   */
  static async searchSerper(apiKey: string, query: string): Promise<{ title: string; url: string; snippet: string }[]> {
    const res = await fetch('https://google.serper.dev/news', {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey.trim(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: query,
        num: 8,
      }),
    });
    const data = await res.json();
    if (data.message || !res.ok) {
      throw new Error(data.message || `Serper HTTP ${res.status}`);
    }
    return (data.news || data.organic || []).map((r: any) => ({
      title: r.title || 'News Story',
      url: r.link || r.url || 'https://news.google.com',
      snippet: r.snippet || '',
    }));
  }

  /**
   * Search Brave Search API
   */
  static async searchBrave(apiKey: string, query: string): Promise<{ title: string; url: string; snippet: string }[]> {
    const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=8`;
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Subscription-Token': apiKey.trim(),
      },
    });
    const data = await res.json();
    if (data.error || !res.ok) {
      throw new Error(data.error?.message || `Brave HTTP ${res.status}`);
    }
    return (data.web?.results || []).map((r: any) => ({
      title: r.title || 'News Story',
      url: r.url || 'https://news.google.com',
      snippet: r.description || '',
    }));
  }

  /**
   * Search Exa AI Search API
   */
  static async searchExa(apiKey: string, query: string): Promise<{ title: string; url: string; snippet: string }[]> {
    const res = await fetch('https://api.exa.ai/search', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey.trim(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        numResults: 8,
        contents: { text: { maxCharacters: 500 } },
      }),
    });
    const data = await res.json();
    if (data.error || !res.ok) {
      throw new Error(data.error || `Exa HTTP ${res.status}`);
    }
    return (data.results || []).map((r: any) => ({
      title: r.title || 'News Story',
      url: r.url || 'https://news.google.com',
      snippet: r.text || '',
    }));
  }

  /**
   * Search Firecrawl API
   */
  static async searchFirecrawl(apiKey: string, query: string): Promise<{ title: string; url: string; snippet: string }[]> {
    const res = await fetch('https://api.firecrawl.dev/v1/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        limit: 8,
      }),
    });
    const data = await res.json();
    if (data.error || !res.ok) {
      throw new Error(data.error || `Firecrawl HTTP ${res.status}`);
    }
    return (data.data || []).map((r: any) => ({
      title: r.title || 'News Story',
      url: r.url || 'https://news.google.com',
      snippet: r.description || r.markdown?.slice(0, 300) || '',
    }));
  }

  /**
   * MULTI-ENGINE SEARCH CASCADE:
   * Attempts each search provider in the user's serial order (1st, 2nd, 3rd...).
   * If Provider #1 hits its rate limit, 429, or quota limit, it immediately cascades to Provider #2, #3, etc.!
   */
  static async executeSearchCascade(
    query: string,
    timeWindow: string = '72h'
  ): Promise<{ results: { title: string; url: string; snippet: string }[]; providerUsed: string; failoverLog: string[] }> {
    const config = this.getStoredConfig();
    const order = config.searchProviderOrder || ['tavily', 'serper', 'brave', 'exa', 'firecrawl', 'gemini_grounding'];
    const failoverLog: string[] = [];

    const searchQuery = `${query || 'global supply chain maritime freight tariff port disruption'} last ${timeWindow}`;

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

      // If user hasn't configured a key for this provider, skip to next in order
      if (!key || !key.trim()) {
        continue;
      }

      try {
        let results: { title: string; url: string; snippet: string }[] = [];

        if (provId === 'tavily') {
          results = await this.searchTavily(key, searchQuery);
        } else if (provId === 'serper') {
          results = await this.searchSerper(key, searchQuery);
        } else if (provId === 'brave') {
          results = await this.searchBrave(key, searchQuery);
        } else if (provId === 'exa') {
          results = await this.searchExa(key, searchQuery);
        } else if (provId === 'firecrawl') {
          results = await this.searchFirecrawl(key, searchQuery);
        } else if (provId === 'gemini_grounding') {
          // Native grounding will be handled directly in Gemini generateContent
          return { results: [], providerUsed: 'gemini_grounding', failoverLog };
        }

        if (results && results.length > 0) {
          return { results, providerUsed: provId, failoverLog };
        }
      } catch (err: any) {
        const isQuota = this.isRateLimitError(err);
        const reason = isQuota ? 'Quota / Rate Limit Exceeded' : (err.message || 'Failed');
        const logMsg = `Switched from ${provId.toUpperCase()} (${reason}) to next search engine`;
        console.warn(logMsg);
        failoverLog.push(logMsg);
        // Continue to next provider in user's priority order
      }
    }

    return { results: [], providerUsed: 'none', failoverLog };
  }

  // =========================================================================
  // CROSS-PROVIDER AI CASCADE ON 429 / QUOTA EXHAUSTION
  // =========================================================================

  /**
   * Executes AI generation across the user's priority serial order.
   * If Provider #1 (e.g. Gemini) hits 429 / Resource Exhausted / Quota Limit,
   * it immediately switches to Provider #2 (e.g. Groq), then #3 (OpenRouter), etc.!
   */
  static async executeAiCascade(
    prompt: string,
    options: {
      temperature?: number;
      systemInstruction?: string;
      customModel?: string;
      searchGroundingData?: { title: string; url: string; snippet: string }[];
    } = {}
  ): Promise<{ data: any; rawText: string; providerUsed: string; modelUsed: string; failoverLog: string[] }> {
    const config = this.getStoredConfig();
    const primaryProv = config.activeProvider || 'gemini';
    const failoverLog: string[] = [];

    // Build candidate AI order starting with active provider, followed by the rest
    const candidateProviders: string[] = [primaryProv];
    (config.aiProviderOrder || ['gemini', 'groq', 'openrouter', 'cerebras', 'grok', 'openai']).forEach((p) => {
      if (!candidateProviders.includes(p)) candidateProviders.push(p);
    });

    let lastError: any = null;

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

      if (!apiKey || !apiKey.trim()) {
        continue;
      }

      const provDef = SUPPORTED_PROVIDERS[provId];
      if (!provDef) continue;

      try {
        // Embed search grounding context if retrieved via Tavily/Serper/Brave/Exa
        let enrichedPrompt = prompt;
        if (options.searchGroundingData && options.searchGroundingData.length > 0) {
          const groundingText = options.searchGroundingData
            .map((r, i) => `[Source ${i + 1}]: ${r.title}\nURL: ${r.url}\nSummary: ${r.snippet}`)
            .join('\n\n');
          enrichedPrompt = `CURRENT VERIFIED LIVE WEB WIRE DATA:\n${groundingText}\n\nTASK:\n${prompt}`;
        }

        if (provId === 'gemini') {
          const reqBody: any = {
            contents: [{ parts: [{ text: enrichedPrompt }] }],
            generationConfig: {
              temperature: options.temperature || 0.2,
            },
          };
          // If no external search results were passed, enable Gemini's native Google Search tool
          if (!options.searchGroundingData || options.searchGroundingData.length === 0) {
            reqBody.tools = [{ googleSearch: {} }];
          }

          const { data, modelUsed } = await this.callGeminiAdaptive(apiKey, options.customModel || config.customModel, reqBody);
          const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          const parsed = this.extractJson(rawText);
          return { data: parsed, rawText, providerUsed: 'gemini', modelUsed, failoverLog };
        }

        // OpenAI-compatible providers: Groq, OpenRouter, Cerebras, Grok, OpenAI
        const endpoint = provDef.endpoint!;
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
      } catch (err: any) {
        lastError = err;
        const isQuota = this.isRateLimitError(err);
        const reason = isQuota ? 'Rate Limit / Quota Exceeded' : (err.message || 'Error');
        const logMsg = `Switched from ${provDef.name} (${reason}) to next configured AI provider`;
        console.warn(logMsg);
        failoverLog.push(logMsg);

        // If auto-failover is disabled and this was the active provider, stop and throw
        if (!config.autoFailoverEnabled) {
          throw err;
        }
      }
    }

    throw lastError || new Error('All configured AI providers failed or have exceeded their quota.');
  }

  /**
   * Test connection across any AI or Search provider
   */
  static async testConnection(provider: string, apiKey: string, customModel?: string): Promise<{ success: boolean; latencyMs: number; message: string; modelUsed?: string }> {
    if (!apiKey || !apiKey.trim()) {
      return { success: false, latencyMs: 0, message: 'Please enter an API key to test.' };
    }

    const start = Date.now();

    // Check if it's a Search Provider test
    if (SEARCH_PROVIDERS[provider]) {
      try {
        let count = 0;
        if (provider === 'tavily') {
          const r = await this.searchTavily(apiKey, 'supply chain test');
          count = r.length;
        } else if (provider === 'serper') {
          const r = await this.searchSerper(apiKey, 'supply chain test');
          count = r.length;
        } else if (provider === 'brave') {
          const r = await this.searchBrave(apiKey, 'supply chain test');
          count = r.length;
        } else if (provider === 'exa') {
          const r = await this.searchExa(apiKey, 'supply chain test');
          count = r.length;
        } else if (provider === 'firecrawl') {
          const r = await this.searchFirecrawl(apiKey, 'supply chain test');
          count = r.length;
        } else if (provider === 'gemini_grounding') {
          return { success: true, latencyMs: Date.now() - start, message: 'Uses your Gemini API key for Google Grounding.' };
        }
        return {
          success: true,
          latencyMs: Date.now() - start,
          message: `Connected to ${SEARCH_PROVIDERS[provider].name}! (${count} test results retrieved)`,
        };
      } catch (err: any) {
        return { success: false, latencyMs: Date.now() - start, message: err.message || 'Search test failed' };
      }
    }

    // AI Provider test
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

      // OpenAI-compatible providers: Groq, OpenRouter, Cerebras, Grok, OpenAI
      const endpoint = prov.endpoint!;
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
    } catch (err: any) {
      return {
        success: false,
        latencyMs: Date.now() - start,
        message: err.message || 'Connection failed',
      };
    }
  }

  /**
   * Robust JSON extractor that handles markdown backticks and preamble
   */
  static extractJson(rawText: string): any {
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
}
