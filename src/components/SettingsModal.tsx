import React, { useState, useEffect } from 'react';
import {
  X,
  Settings,
  Cpu,
  Clapperboard,
  Sliders,
  CheckCircle2,
  RefreshCw,
  Globe,
  ShieldCheck,
  Zap,
  Info,
  Check,
  Sun,
  Moon,
  AlertCircle,
  Radio,
  ExternalLink,
  Layers,
  Sparkles,
  Search,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { VideoDuration, VideoAspectRatio, VideoLanguage, VideoTone, VideoPlatform } from '../types/videoBrief';
import { TimeWindow } from '../types/news';
import { testProviderConnection, getSavedProviderStatuses, ConnectionTestResult } from '../services/aiConnectionService';
import { AdaptiveAiService, SEARCH_PROVIDERS, SUPPORTED_PROVIDERS } from '../services/adaptiveAiService';
import { APP_VERSION } from '../data/versionInfo';

export interface AppSettings {
  // Theme
  themeMode: 'light' | 'dark';

  // Primary Provider
  activeProvider: 'gemini' | 'groq' | 'openrouter' | 'cerebras';

  // Video Brief Defaults
  defaultPlatform: VideoPlatform;
  defaultDuration: VideoDuration;
  defaultRatio: VideoAspectRatio;
  defaultLanguage: VideoLanguage;
  defaultTone: VideoTone;
  autoCopyScript: boolean;

  // Intelligence Defaults
  defaultTimeWindow: TimeWindow;
  minPriorityThreshold: number;

  // AI Engine Preferences
  modelPreference: 'gemini-3.5-flash' | 'gemini-3.8-flash';
  thinkingAnalysisEnabled: boolean;
  factLockStrictness: 'strict-zero-hallucination' | 'standard';
}

const DEFAULT_SETTINGS: AppSettings = {
  themeMode: 'dark',
  activeProvider: 'gemini',
  defaultPlatform: 'YouTube Shorts',
  defaultDuration: '60s',
  defaultRatio: '9:16',
  defaultLanguage: 'Bangla',
  defaultTone: 'Professional News Documentary',
  autoCopyScript: false,
  defaultTimeWindow: '72h',
  minPriorityThreshold: 60,
  modelPreference: 'gemini-3.8-flash',
  thinkingAnalysisEnabled: true,
  factLockStrictness: 'strict-zero-hallucination',
};

interface ProviderStatus {
  success: boolean;
  status: string;
  latencyMs?: number;
  details: string;
  testedAt?: string;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsSaved?: (newSettings: AppSettings) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onSettingsSaved,
  isDark,
  onToggleTheme,
}) => {
  const [activeTab, setActiveTab] = useState<'search' | 'ai' | 'appearance' | 'video' | 'dashboard'>('search');
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('sc_app_settings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Search providers keys and waterfall ordering
  const [searchOrder, setSearchOrder] = useState<string[]>(() => {
    try {
      const s = localStorage.getItem('sc_search_order');
      return s ? JSON.parse(s) : ['tavily', 'serper', 'brave', 'exa', 'firecrawl', 'gemini_grounding'];
    } catch {
      return ['tavily', 'serper', 'brave', 'exa', 'firecrawl', 'gemini_grounding'];
    }
  });

  const [aiOrder, setAiOrder] = useState<string[]>(() => {
    try {
      const s = localStorage.getItem('sc_ai_order');
      return s ? JSON.parse(s) : ['gemini', 'groq', 'openrouter', 'cerebras', 'grok', 'openai'];
    } catch {
      return ['gemini', 'groq', 'openrouter', 'cerebras', 'grok', 'openai'];
    }
  });

  const [tavilyKey, setTavilyKey] = useState(() => localStorage.getItem('sc_tavily_key') || '');
  const [serperKey, setSerperKey] = useState(() => localStorage.getItem('sc_serper_key') || '');
  const [braveKey, setBraveKey] = useState(() => localStorage.getItem('sc_brave_key') || '');
  const [exaKey, setExaKey] = useState(() => localStorage.getItem('sc_exa_key') || '');
  const [firecrawlKey, setFirecrawlKey] = useState(() => localStorage.getItem('sc_firecrawl_key') || '');
  const [autoFailover, setAutoFailover] = useState(() => localStorage.getItem('sc_auto_failover') !== 'false');

  const [searchTestStatuses, setSearchTestStatuses] = useState<Record<string, { testing: boolean; message: string; success?: boolean }>>({});

  const testSearchProvider = async (provId: string, key: string) => {
    if (!key || !key.trim()) {
      setSearchTestStatuses((prev) => ({
        ...prev,
        [provId]: { testing: false, success: false, message: 'Please enter an API key first' },
      }));
      return;
    }

    setSearchTestStatuses((prev) => ({
      ...prev,
      [provId]: { testing: true, message: 'Testing connection...' },
    }));

    try {
      const res = await AdaptiveAiService.testConnection(provId, key);
      setSearchTestStatuses((prev) => ({
        ...prev,
        [provId]: {
          testing: false,
          success: res.success,
          message: res.success ? `Connected (${res.latencyMs}ms)` : res.message,
        },
      }));
    } catch (err: any) {
      setSearchTestStatuses((prev) => ({
        ...prev,
        [provId]: { testing: false, success: false, message: err.message || 'Test failed' },
      }));
    }
  };

  const moveSearchOrder = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...searchOrder];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newOrder.length) return;
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIdx];
    newOrder[targetIdx] = temp;
    setSearchOrder(newOrder);
  };

  const moveAiOrder = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...aiOrder];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newOrder.length) return;
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIdx];
    newOrder[targetIdx] = temp;
    setAiOrder(newOrder);
  };

  const [providerStatuses, setProviderStatuses] = useState<Record<string, ConnectionTestResult>>(() => {
    return getSavedProviderStatuses();
  });

  const [testingProvider, setTestingProvider] = useState<string | null>(null);
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  // Sync theme with prop
  useEffect(() => {
    setSettings((prev) => ({
      ...prev,
      themeMode: isDark ? 'dark' : 'light',
    }));
  }, [isDark]);

  // Initial check on open
  useEffect(() => {
    if (isOpen) {
      if (!providerStatuses['gemini']) {
        testSingleProvider('gemini');
      }
    }
  }, [isOpen]);

  const testSingleProvider = async (providerKey: any) => {
    setTestingProvider(providerKey);
    try {
      const result = await testProviderConnection(providerKey);
      setProviderStatuses((prev) => ({
        ...prev,
        [providerKey]: result,
      }));
    } catch (err: any) {
      setProviderStatuses((prev) => ({
        ...prev,
        [providerKey]: {
          success: false,
          provider: providerKey,
          status: 'Connection Error',
          latencyMs: 0,
          details: err?.message || 'Failed to ping provider',
          testedAt: new Date().toLocaleTimeString(),
        },
      }));
    } finally {
      setTestingProvider(null);
    }
  };

  const handleSave = () => {
    localStorage.setItem('sc_app_settings', JSON.stringify(settings));
    localStorage.setItem('sc_tavily_key', tavilyKey.trim());
    localStorage.setItem('sc_serper_key', serperKey.trim());
    localStorage.setItem('sc_brave_key', braveKey.trim());
    localStorage.setItem('sc_exa_key', exaKey.trim());
    localStorage.setItem('sc_firecrawl_key', firecrawlKey.trim());
    localStorage.setItem('sc_search_order', JSON.stringify(searchOrder));
    localStorage.setItem('sc_ai_order', JSON.stringify(aiOrder));
    localStorage.setItem('sc_auto_failover', String(autoFailover));

    if (onSettingsSaved) onSettingsSaved(settings);
    setIsSavedNotice(true);
    setTimeout(() => {
      setIsSavedNotice(false);
      onClose();
    }, 900);
  };

  const PROVIDERS = [
    {
      id: 'gemini',
      name: 'Google Gemini',
      tag: 'Built-in & Search Grounded',
      badgeColor: 'bg-blue-600 text-white',
      freeTier: 'Free via Google AI Studio',
      models: 'gemini-3.5-flash (Web Search) · gemini-3.8-flash (Scripting)',
      description: 'Official multimodal model with Google Search Grounding for verified supply chain news retrieval and zero-hallucination verification.',
      envVar: 'GEMINI_API_KEY',
    },
    {
      id: 'groq',
      name: 'Groq Cloud LPU',
      tag: 'Ultra-Fast Inference',
      badgeColor: 'bg-amber-600 text-white',
      freeTier: 'Free tier available (console.groq.com)',
      models: 'Llama-3.3-70B-Versatile · Mixtral-8x7B',
      description: 'Ultra-low latency Language Processing Units (LPU) for instantaneous video script narration drafting and deep structural parsing.',
      envVar: 'GROQ_API_KEY',
    },
    {
      id: 'openrouter',
      name: 'OpenRouter Free AI Hub',
      tag: 'Open-Weights Free Routing',
      badgeColor: 'bg-purple-600 text-white',
      freeTier: 'Free models available (openrouter.ai)',
      models: 'DeepSeek-R1-Free · Qwen-2.5-Coder · Meta-Llama-3-Free',
      description: 'Unified gateway offering free-tier access to leading open reasoning models with zero platform lock-in.',
      envVar: 'OPENROUTER_API_KEY',
    },
    {
      id: 'cerebras',
      name: 'Cerebras Inference',
      tag: 'Wafer-Scale Engine',
      badgeColor: 'bg-emerald-600 text-white',
      freeTier: 'Free developer tier (cloud.cerebras.ai)',
      models: 'Llama-3.3-70B (2000+ tokens/sec)',
      description: 'World-record token generation throughput for real-time multilingual voiceover script rendering.',
      envVar: 'CEREBRAS_API_KEY',
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs">
      <div
        className={`w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden transition-all flex flex-col max-h-[90vh] ${
          isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600 text-white">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold">App & AI Provider Settings</h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {APP_VERSION}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage AI provider connections, auto-adaptive models, theme preferences, and video defaults
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-4 sm:px-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-xs font-medium overflow-x-auto">
          {[
            { id: 'search', label: 'Free Search APIs & Waterfall', icon: Search },
            { id: 'ai', label: 'AI Models & Failover', icon: Cpu },
            { id: 'appearance', label: 'Theme & Display', icon: Sun },
            { id: 'video', label: 'Video Brief Defaults', icon: Clapperboard },
            { id: 'dashboard', label: 'Thresholds', icon: Sliders },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 py-2.5 px-3 border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? isDark
                      ? 'border-blue-500 text-blue-400 font-semibold'
                      : 'border-blue-600 text-blue-700 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* TAB 0: FREE SEARCH APIS & WATERFALL SERIAL */}
          {activeTab === 'search' && (
            <div className="space-y-4">
              {/* Architecture guidance */}
              <div className={`p-3.5 rounded-xl border leading-relaxed ${
                isDark ? 'bg-blue-950/20 border-blue-800/60 text-slate-300' : 'bg-blue-50/50 border-blue-200 text-slate-700'
              }`}>
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100 mb-1">
                  <Globe className="w-4 h-4 text-blue-500" />
                  <span>Multi-Engine Search Waterfall Cascade</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  Configure your free API keys for Tavily, Serper.dev, Brave Search, Exa, and Firecrawl. Reorder the <strong>Serial Waterfall Order (1st, 2nd, 3rd...)</strong> below. If your primary provider exhausts its monthly free quota or hits HTTP 429, the engine automatically cascades to the next provider with <strong>zero downtime</strong>.
                </p>
              </div>

              {/* Priority Waterfall List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                  <span>Search Priority Waterfall Order</span>
                  <span className="text-[10px] font-normal normal-case text-slate-500">
                    Use ▲ and ▼ to reorder 1st, 2nd, 3rd...
                  </span>
                </div>

                <div className="space-y-1.5">
                  {searchOrder.map((provId, idx) => {
                    const prov = SEARCH_PROVIDERS[provId] || { name: provId, tag: 'Search Engine', freeAllowance: '' };
                    let key = '';
                    if (provId === 'tavily') key = tavilyKey;
                    else if (provId === 'serper') key = serperKey;
                    else if (provId === 'brave') key = braveKey;
                    else if (provId === 'exa') key = exaKey;
                    else if (provId === 'firecrawl') key = firecrawlKey;
                    else if (provId === 'gemini_grounding') key = 'Active via Gemini';

                    const hasKey = !!key;
                    const rankLabels = ['1st (Primary)', '2nd (Fallback)', '3rd (Fallback)', '4th (Fallback)', '5th (Fallback)', '6th (Fallback)'];

                    return (
                      <div
                        key={provId}
                        className={`flex items-center justify-between p-2.5 rounded-xl border ${
                          isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            #0{idx + 1} · {rankLabels[idx] || `${idx + 1}th`}
                          </span>
                          <div>
                            <span className="font-semibold text-slate-900 dark:text-slate-100">{prov.name}</span>
                            <span className="text-[10px] text-slate-500 ml-1.5">({prov.freeAllowance})</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {hasKey ? (
                            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                              Configured
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500 bg-slate-500/10 px-2 py-0.5 rounded border border-slate-500/20">
                              No Key (Skips)
                            </span>
                          )}

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => moveSearchOrder(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-30 hover:bg-slate-300 dark:hover:bg-slate-700"
                              title="Move Up in Priority Serial"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => moveSearchOrder(idx, 'down')}
                              disabled={idx === searchOrder.length - 1}
                              className="p-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-30 hover:bg-slate-300 dark:hover:bg-slate-700"
                              title="Move Down in Priority Serial"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Free Search Keys Entry */}
              <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Configure Free Search API Keys
                </div>

                {/* Tavily */}
                <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold">Tavily Search API (1,000 Free Credits / Month)</span>
                    <a href="https://app.tavily.com/sign-in" target="_blank" rel="noreferrer" className="text-[11px] text-blue-500 hover:underline flex items-center gap-1">
                      Get Free Key <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="password"
                      value={tavilyKey}
                      onChange={(e) => setTavilyKey(e.target.value)}
                      placeholder="tvly-..."
                      className={`flex-1 px-3 py-1.5 rounded-lg border font-mono text-xs ${
                        isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                    <button
                      onClick={() => testSearchProvider('tavily', tavilyKey)}
                      disabled={searchTestStatuses['tavily']?.testing}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 disabled:opacity-50"
                    >
                      {searchTestStatuses['tavily']?.testing ? 'Testing...' : 'Test Key'}
                    </button>
                  </div>
                  {searchTestStatuses['tavily'] && (
                    <div className={`mt-1 font-mono text-[10px] ${searchTestStatuses['tavily'].success ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {searchTestStatuses['tavily'].message}
                    </div>
                  )}
                </div>

                {/* Serper.dev */}
                <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold">Serper.dev Google News (2,500 Free Queries)</span>
                    <a href="https://serper.dev/signup" target="_blank" rel="noreferrer" className="text-[11px] text-blue-500 hover:underline flex items-center gap-1">
                      Get Free Key <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="password"
                      value={serperKey}
                      onChange={(e) => setSerperKey(e.target.value)}
                      placeholder="Enter Serper API key..."
                      className={`flex-1 px-3 py-1.5 rounded-lg border font-mono text-xs ${
                        isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                    <button
                      onClick={() => testSearchProvider('serper', serperKey)}
                      disabled={searchTestStatuses['serper']?.testing}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 disabled:opacity-50"
                    >
                      {searchTestStatuses['serper']?.testing ? 'Testing...' : 'Test Key'}
                    </button>
                  </div>
                  {searchTestStatuses['serper'] && (
                    <div className={`mt-1 font-mono text-[10px] ${searchTestStatuses['serper'].success ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {searchTestStatuses['serper'].message}
                    </div>
                  )}
                </div>

                {/* Brave Search */}
                <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold">Brave Search API (2,000 Free Queries / Month)</span>
                    <a href="https://brave.com/search/api/" target="_blank" rel="noreferrer" className="text-[11px] text-blue-500 hover:underline flex items-center gap-1">
                      Get Free Key <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="password"
                      value={braveKey}
                      onChange={(e) => setBraveKey(e.target.value)}
                      placeholder="BSA-..."
                      className={`flex-1 px-3 py-1.5 rounded-lg border font-mono text-xs ${
                        isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                    <button
                      onClick={() => testSearchProvider('brave', braveKey)}
                      disabled={searchTestStatuses['brave']?.testing}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 disabled:opacity-50"
                    >
                      {searchTestStatuses['brave']?.testing ? 'Testing...' : 'Test Key'}
                    </button>
                  </div>
                  {searchTestStatuses['brave'] && (
                    <div className={`mt-1 font-mono text-[10px] ${searchTestStatuses['brave'].success ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {searchTestStatuses['brave'].message}
                    </div>
                  )}
                </div>

                {/* Exa Neural Search */}
                <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold">Exa Neural Search (1,000 Free Searches)</span>
                    <a href="https://dashboard.exa.ai/" target="_blank" rel="noreferrer" className="text-[11px] text-blue-500 hover:underline flex items-center gap-1">
                      Get Free Key <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="password"
                      value={exaKey}
                      onChange={(e) => setExaKey(e.target.value)}
                      placeholder="Enter Exa API key..."
                      className={`flex-1 px-3 py-1.5 rounded-lg border font-mono text-xs ${
                        isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                    <button
                      onClick={() => testSearchProvider('exa', exaKey)}
                      disabled={searchTestStatuses['exa']?.testing}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 disabled:opacity-50"
                    >
                      {searchTestStatuses['exa']?.testing ? 'Testing...' : 'Test Key'}
                    </button>
                  </div>
                  {searchTestStatuses['exa'] && (
                    <div className={`mt-1 font-mono text-[10px] ${searchTestStatuses['exa'].success ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {searchTestStatuses['exa'].message}
                    </div>
                  )}
                </div>

                {/* Firecrawl */}
                <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold">Firecrawl Web Scraper (500 Free Credits)</span>
                    <a href="https://www.firecrawl.dev/app/api-keys" target="_blank" rel="noreferrer" className="text-[11px] text-blue-500 hover:underline flex items-center gap-1">
                      Get Free Key <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="password"
                      value={firecrawlKey}
                      onChange={(e) => setFirecrawlKey(e.target.value)}
                      placeholder="fc-..."
                      className={`flex-1 px-3 py-1.5 rounded-lg border font-mono text-xs ${
                        isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                    <button
                      onClick={() => testSearchProvider('firecrawl', firecrawlKey)}
                      disabled={searchTestStatuses['firecrawl']?.testing}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 disabled:opacity-50"
                    >
                      {searchTestStatuses['firecrawl']?.testing ? 'Testing...' : 'Test Key'}
                    </button>
                  </div>
                  {searchTestStatuses['firecrawl'] && (
                    <div className={`mt-1 font-mono text-[10px] ${searchTestStatuses['firecrawl'].success ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {searchTestStatuses['firecrawl'].message}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: AI Providers & Connection Testing */}
          {activeTab === 'ai' && (
            <div className="space-y-4">
              {/* Architecture guidance */}
              <div className={`p-3.5 rounded-xl border leading-relaxed ${
                isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-blue-50/50 border-blue-200 text-slate-700'
              }`}>
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100 mb-1">
                  <ShieldCheck className="w-4 h-4 text-blue-500" />
                  <span>Secure Multi-Provider Architecture</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  In Google AI Studio, API keys are securely managed via the <strong>Settings &gt; Secrets</strong> environment panel on the server. Below you can ping each AI provider endpoint, verify latency, and select your active model pipeline.
                </p>
              </div>

              {/* Provider List with Test Connection Buttons */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Available Free & Cloud AI Providers</span>
                  <span className="text-[10px] font-normal normal-case text-slate-500">
                    Click "Test Connection" to ping
                  </span>
                </div>

                {PROVIDERS.map((provider) => {
                  const isSelected = settings.activeProvider === provider.id;
                  const status = providerStatuses[provider.id];
                  const isTestingThis = testingProvider === provider.id;

                  return (
                    <div
                      key={provider.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isSelected
                          ? isDark
                            ? 'bg-blue-950/20 border-blue-500/70 shadow-sm'
                            : 'bg-blue-50/70 border-blue-300 shadow-sm'
                          : isDark
                            ? 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <div className="flex items-start gap-3">
                          <label className="flex items-center gap-2 cursor-pointer mt-0.5">
                            <input
                              type="radio"
                              name="activeProvider"
                              checked={isSelected}
                              onChange={() =>
                                setSettings({ ...settings, activeProvider: provider.id as any })
                              }
                              className="accent-blue-600 w-4 h-4 cursor-pointer"
                            />
                          </label>

                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                                {provider.name}
                              </span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${provider.badgeColor}`}>
                                {provider.tag}
                              </span>
                              {isSelected && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-500 text-white">
                                  Active Primary
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                              Models: {provider.models}
                            </div>
                            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 max-w-lg">
                              {provider.description}
                            </p>
                          </div>
                        </div>

                        {/* Test Connection Button */}
                        <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-1.5 shrink-0 pl-7 sm:pl-0">
                          <button
                            onClick={() => testSingleProvider(provider.id)}
                            disabled={isTestingThis}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                              isTestingThis
                                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed border-slate-300 dark:border-slate-700'
                                : isDark
                                  ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 shadow-xs'
                            }`}
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${isTestingThis ? 'animate-spin' : ''}`} />
                            <span>{isTestingThis ? 'Pinging...' : 'Test Connection'}</span>
                          </button>

                          {status?.latencyMs !== undefined && (
                            <span className="text-[10px] font-mono text-slate-400">
                              Latency: {status.latencyMs}ms
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Status Feedback Row */}
                      {status && (
                        <div className={`mt-2.5 pt-2 border-t flex flex-wrap items-center justify-between gap-1.5 text-[11px] ${
                          isDark ? 'border-slate-800/80' : 'border-slate-100'
                        }`}>
                          <div className="flex items-center gap-1.5">
                            {status.success ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            ) : (
                              <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            )}
                            <span className={status.success ? 'text-emerald-500 font-semibold' : 'text-amber-500 font-semibold'}>
                              {status.status}
                            </span>
                            <span className="text-slate-400">· {status.details}</span>
                          </div>
                          {status.testedAt && (
                            <span className="text-[10px] text-slate-400 font-mono">
                              Tested at {status.testedAt}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Gemini Model Preference Selection */}
              <div className="pt-2">
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Gemini Model Flavor for Video Brief Generation
                </label>
                <select
                  value={settings.modelPreference}
                  onChange={(e) =>
                    setSettings({ ...settings, modelPreference: e.target.value as any })
                  }
                  className={`w-full p-2.5 rounded-xl border text-xs font-medium ${
                    isDark ? 'bg-slate-950 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-800'
                  }`}
                >
                  <option value="gemini-3.8-flash">Google Gemini 3.8 Flash (Recommended: Ultra-fast script drafting & audit)</option>
                  <option value="gemini-flash-latest">Google Gemini Flash Latest (Dynamic Alias — Auto-Accepts Newest Model)</option>
                  <option value="gemini-3.5-flash">Google Gemini 3.5 Flash (Google Search Grounding Specialist)</option>
                </select>
              </div>

              {/* Fact Check Strictness */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Fact-Checking Strictness Engine
                </label>
                <div className="space-y-2">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="radio"
                      name="factLockStrictness"
                      checked={settings.factLockStrictness === 'strict-zero-hallucination'}
                      onChange={() =>
                        setSettings({ ...settings, factLockStrictness: 'strict-zero-hallucination' })
                      }
                      className="mt-0.5 accent-blue-600"
                    />
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        Strict Zero-Hallucination Mode (Two-Pass Fact Lock)
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Extracts verified news claims, writes the script, then automatically cross-checks every single claim against source reporting.
                      </div>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="radio"
                      name="factLockStrictness"
                      checked={settings.factLockStrictness === 'standard'}
                      onChange={() => setSettings({ ...settings, factLockStrictness: 'standard' })}
                      className="mt-0.5 accent-blue-600"
                    />
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        Standard Sourced Mode
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Source-grounded summary with standard citation attribution.
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Auto Failover on Quota Limit */}
              <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
                isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">
                    Automatic 429 Rate-Limit / Quota Failover
                  </div>
                  <div className="text-[11px] text-slate-500">
                    When your active provider exhausts its quota or returns HTTP 429, automatically switch to the next configured provider in the serial below.
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoFailover}
                    onChange={(e) => setAutoFailover(e.target.checked)}
                    className="w-4 h-4 accent-blue-600 rounded"
                  />
                  <span className="text-xs font-bold text-emerald-500">Enabled</span>
                </label>
              </div>

              {/* AI Priority Waterfall Serial */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                  <span>AI Fallback Priority Serial (1st, 2nd, 3rd...)</span>
                  <span className="text-[10px] font-normal normal-case text-slate-500">
                    Cascades when primary provider runs out of quota
                  </span>
                </div>

                <div className="space-y-1.5">
                  {aiOrder.map((provId, idx) => {
                    const prov = SUPPORTED_PROVIDERS[provId] || { name: provId, defaultModel: 'Universal', tag: 'AI Model' };
                    const rankLabels = ['1st (Primary)', '2nd (Fallback)', '3rd (Fallback)', '4th (Fallback)', '5th (Fallback)', '6th (Fallback)'];

                    return (
                      <div
                        key={provId}
                        className={`flex items-center justify-between p-2.5 rounded-xl border ${
                          isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                            #0{idx + 1} · {rankLabels[idx] || `${idx + 1}th`}
                          </span>
                          <div>
                            <span className="font-semibold text-slate-900 dark:text-slate-100">{prov.name}</span>
                            <span className="text-[10px] text-slate-500 ml-1.5">({prov.defaultModel})</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => moveAiOrder(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-30 hover:bg-slate-300 dark:hover:bg-slate-700"
                            title="Move Up in Priority Serial"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => moveAiOrder(idx, 'down')}
                            disabled={idx === aiOrder.length - 1}
                            className="p-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-30 hover:bg-slate-300 dark:hover:bg-slate-700"
                            title="Move Down in Priority Serial"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Appearance & Theme Settings */}
          {activeTab === 'appearance' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-1">
                  Color Theme Selection
                </h4>
                <p className="text-[11px] text-slate-500 mb-4">
                  Select your preferred interface appearance for the Supply Chain Intelligence Terminal.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {/* Dark Mode Card */}
                  <button
                    onClick={() => {
                      if (!isDark) onToggleTheme();
                      setSettings({ ...settings, themeMode: 'dark' });
                    }}
                    className={`p-4 rounded-xl border text-left transition-all flex flex-col gap-2 ${
                      isDark
                        ? 'bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/30'
                        : 'bg-slate-100 border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-lg bg-slate-900 text-amber-400">
                        <Moon className="w-4 h-4" />
                      </div>
                      {isDark && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-600 text-white font-semibold">
                          Active
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900 dark:text-slate-100">
                        Dark Terminal
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Optimized for low-light trading desks and prolonged monitoring.
                      </div>
                    </div>
                  </button>

                  {/* Light Mode Card */}
                  <button
                    onClick={() => {
                      if (isDark) onToggleTheme();
                      setSettings({ ...settings, themeMode: 'light' });
                    }}
                    className={`p-4 rounded-xl border text-left transition-all flex flex-col gap-2 ${
                      !isDark
                        ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/30'
                        : 'bg-slate-950 border-slate-800 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
                        <Sun className="w-4 h-4" />
                      </div>
                      {!isDark && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-600 text-white font-semibold">
                          Active
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900 dark:text-slate-100">
                        Light Mode
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Clean white contrast designed for day-time executive briefing.
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Video Brief Defaults */}
          {activeTab === 'video' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Default Language */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Default Script Language
                  </label>
                  <select
                    value={settings.defaultLanguage}
                    onChange={(e) =>
                      setSettings({ ...settings, defaultLanguage: e.target.value as any })
                    }
                    className={`w-full p-2.5 rounded-xl border text-xs font-medium ${
                      isDark ? 'bg-slate-950 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-800'
                    }`}
                  >
                    <option value="Bangla">Bangla (Natural Spoken Voiceover)</option>
                    <option value="English">English (Broadcast Spoken Voiceover)</option>
                    <option value="Bangla + English">Bangla + English (Bilingual Media Style)</option>
                  </select>
                </div>

                {/* Default Duration */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Default Video Length
                  </label>
                  <select
                    value={settings.defaultDuration}
                    onChange={(e) =>
                      setSettings({ ...settings, defaultDuration: e.target.value as any })
                    }
                    className={`w-full p-2.5 rounded-xl border text-xs font-medium ${
                      isDark ? 'bg-slate-950 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-800'
                    }`}
                  >
                    <option value="30s">30 Seconds</option>
                    <option value="45s">45 Seconds</option>
                    <option value="60s">60 Seconds (Default)</option>
                    <option value="90s">90 Seconds</option>
                    <option value="2m">2 Minutes</option>
                    <option value="3m">3 Minutes</option>
                    <option value="5m">5 Minutes</option>
                  </select>
                </div>

                {/* Default Platform */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Default Platform
                  </label>
                  <select
                    value={settings.defaultPlatform}
                    onChange={(e) =>
                      setSettings({ ...settings, defaultPlatform: e.target.value as any })
                    }
                    className={`w-full p-2.5 rounded-xl border text-xs font-medium ${
                      isDark ? 'bg-slate-950 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-800'
                    }`}
                  >
                    <option value="YouTube Shorts">YouTube Shorts</option>
                    <option value="YouTube">YouTube (Long form)</option>
                    <option value="Facebook Reels">Facebook Reels</option>
                    <option value="Facebook">Facebook Video</option>
                    <option value="Instagram Reels">Instagram Reels</option>
                    <option value="TikTok">TikTok</option>
                    <option value="LinkedIn">LinkedIn Video</option>
                  </select>
                </div>

                {/* Default Aspect Ratio */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Default Aspect Ratio
                  </label>
                  <select
                    value={settings.defaultRatio}
                    onChange={(e) =>
                      setSettings({ ...settings, defaultRatio: e.target.value as any })
                    }
                    className={`w-full p-2.5 rounded-xl border text-xs font-medium ${
                      isDark ? 'bg-slate-950 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-800'
                    }`}
                  >
                    <option value="9:16">9:16 (Vertical Reel / Shorts)</option>
                    <option value="16:9">16:9 (Horizontal Widescreen)</option>
                    <option value="1:1">1:1 (Square Feed)</option>
                  </select>
                </div>
              </div>

              {/* Default Tone */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Default Presentation Tone
                </label>
                <select
                  value={settings.defaultTone}
                  onChange={(e) =>
                    setSettings({ ...settings, defaultTone: e.target.value as any })
                  }
                  className={`w-full p-2.5 rounded-xl border text-xs font-medium ${
                    isDark ? 'bg-slate-950 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-800'
                  }`}
                >
                  <option value="Professional News Documentary">Professional News Documentary</option>
                  <option value="Business Intelligence">Business Intelligence</option>
                  <option value="Explainer">Explainer</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Cinematic">Cinematic</option>
                  <option value="Investigative">Investigative</option>
                  <option value="Calm">Calm</option>
                </select>
              </div>

              {/* Auto copy */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoCopyScript}
                    onChange={(e) =>
                      setSettings({ ...settings, autoCopyScript: e.target.checked })
                    }
                    className="rounded accent-blue-600"
                  />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Automatically copy script narration when generated
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* TAB 4: Intelligence Dashboard Thresholds */}
          {activeTab === 'dashboard' && (
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Default News Window
                </label>
                <select
                  value={settings.defaultTimeWindow}
                  onChange={(e) =>
                    setSettings({ ...settings, defaultTimeWindow: e.target.value as any })
                  }
                  className={`w-full p-2.5 rounded-xl border text-xs font-medium ${
                    isDark ? 'bg-slate-950 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-800'
                  }`}
                >
                  <option value="24h">Past 24 Hours</option>
                  <option value="48h">Past 48 Hours</option>
                  <option value="72h">Past 72 Hours (Default)</option>
                  <option value="7d">Past 7 Days</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Minimum Priority Score Threshold ({settings.minPriorityThreshold}/100)
                </label>
                <input
                  type="range"
                  min="30"
                  max="90"
                  step="5"
                  value={settings.minPriorityThreshold}
                  onChange={(e) =>
                    setSettings({ ...settings, minPriorityThreshold: parseInt(e.target.value) })
                  }
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-1">
                  <span>30 (All Stories)</span>
                  <span>60 (Moderate Priority)</span>
                  <span>90 (Severe Critical Only)</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60 text-xs">
          <div>
            {isSavedNotice && (
              <span className="text-emerald-500 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Settings and provider states saved!</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className={`flex items-center gap-1 px-4 py-2 rounded-xl border font-medium transition-colors cursor-pointer ${
                isDark ? 'border-slate-800 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <X className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors shadow-xs cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
