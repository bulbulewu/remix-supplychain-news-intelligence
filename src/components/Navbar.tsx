import React from 'react';
import {
  Globe,
  RefreshCw,
  Sun,
  Moon,
  Bookmark,
  FileText,
  SlidersHorizontal,
  Compass,
  Zap,
  TrendingUp,
  MapPin,
  Clock,
  Clapperboard,
  Cpu,
  Settings,
  Search,
  X,
  CheckCircle2,
  BookOpen,
  Download,
  Anchor,
  Tag,
  AlertTriangle,
  Layers,
  Sparkles,
} from 'lucide-react';
import { TimeWindow } from '../types/news';
import { formatLocalDateTime } from '../utils/formatters';
import { APP_VERSION } from '../data/versionInfo';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  timeWindow: TimeWindow;
  onChangeTimeWindow: (w: TimeWindow) => void;
  windowStart: string;
  windowEnd: string;
  onRefresh: () => void;
  isRefreshing: boolean;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenExecutiveBrief: () => void;
  onOpenWatchlistAlerts: () => void;
  onOpenSaved: () => void;
  onOpenAiStatus?: () => void;
  onOpenSettings?: () => void;
  onOpenBanglaReadme?: () => void;
  savedCount: number;
  quickReadCount: number;
  onOpenQuickRead: () => void;
  videoCreatedCount: number;
  onOpenVideoCreatedTracker: () => void;
  activeTopicSearch?: string;
  onSearchTopic?: (topic: string) => void;
  onClearTopicSearch?: () => void;
  onOpenExtensionModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  timeWindow,
  onChangeTimeWindow,
  windowStart,
  windowEnd,
  onRefresh,
  isRefreshing,
  isDark,
  onToggleTheme,
  onOpenExecutiveBrief,
  onOpenWatchlistAlerts,
  onOpenSaved,
  onOpenAiStatus,
  onOpenSettings,
  onOpenBanglaReadme,
  onOpenExtensionModal,
  savedCount,
  quickReadCount,
  onOpenQuickRead,
  videoCreatedCount,
  onOpenVideoCreatedTracker,
  activeTopicSearch = '',
  onSearchTopic,
  onClearTopicSearch,
}) => {
  const [topicInput, setTopicInput] = React.useState(activeTopicSearch);

  React.useEffect(() => {
    setTopicInput(activeTopicSearch);
  }, [activeTopicSearch]);
  return (
    <header className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors ${
      isDark ? 'bg-slate-950/90 border-slate-800 text-slate-100' : 'bg-white/95 border-slate-200 text-slate-900'
    }`}>
      {/* Top Banner: News Window & Status */}
      <div className={`px-4 py-1.5 text-xs border-b flex flex-wrap items-center justify-between gap-2 font-mono ${
        isDark ? 'bg-slate-900/80 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
      }`}>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-sans">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold uppercase tracking-wider text-[11px] text-emerald-600 dark:text-emerald-400">Live Feed Active</span>
          </span>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">|</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>News window: {formatLocalDateTime(windowStart)} → {formatLocalDateTime(windowEnd)}</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[11px] hidden sm:inline text-slate-500 dark:text-slate-400 font-sans">
            Broad English-language discovery across reputable global media
          </span>
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-sans text-slate-500 mr-1">Window:</span>
            {(['6h', '12h', '24h', '48h', '72h', '7d'] as TimeWindow[]).map((w) => (
              <button
                key={w}
                onClick={() => onChangeTimeWindow(w)}
                className={`px-2 py-0.5 text-[11px] font-mono transition-all rounded ${
                  timeWindow === w
                    ? isDark
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-slate-900 text-white font-semibold'
                    : isDark
                      ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                {w}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-600 text-white shadow-sm flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight">SupplyChain News Intelligence</h1>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-medium ${
                isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
              }`}>
                ENTERPRISE RADAR
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {APP_VERSION}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Procurement, Sourcing & Logistics Decision Terminal
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* AI Engine Status Button */}
          {onOpenAiStatus && (
            <button
              onClick={onOpenAiStatus}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                isDark
                  ? 'bg-slate-900 border-slate-700 text-blue-400 hover:bg-slate-800'
                  : 'bg-white border-slate-300 text-blue-600 hover:bg-slate-50'
              }`}
              title="View AI Engine status, dynamic model discovery and connection"
            >
              <Cpu className="w-3.5 h-3.5 text-blue-500" />
              <span className="hidden sm:inline">AI Engine ({APP_VERSION})</span>
            </button>
          )}

          {/* Executive Brief Button */}
          <button
            onClick={onOpenExecutiveBrief}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              isDark
                ? 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-blue-500" />
            <span>Daily CPO Brief</span>
          </button>

          {/* Watchlist & Alerts */}
          <button
            onClick={onOpenWatchlistAlerts}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              isDark
                ? 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Watchlist & Alerts</span>
          </button>

          {/* Quick Read Stack */}
          <button
            onClick={onOpenQuickRead}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
              quickReadCount > 0
                ? isDark
                  ? 'bg-amber-950/70 border-amber-600 text-amber-300 hover:bg-amber-900/60 shadow-xs'
                  : 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100 shadow-xs'
                : isDark
                  ? 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
            title="Open temporary Quick Read stack for this session"
          >
            <Zap className={`w-3.5 h-3.5 ${quickReadCount > 0 ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
            <span>Quick Read</span>
            {quickReadCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 text-[10px] font-mono font-bold bg-amber-500 text-slate-950 rounded-full">
                {quickReadCount}
              </span>
            )}
          </button>

          {/* Videos Created Tracker */}
          <button
            onClick={onOpenVideoCreatedTracker}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              videoCreatedCount > 0
                ? isDark
                  ? 'bg-emerald-950/70 border-emerald-700 text-emerald-300 hover:bg-emerald-900/60 shadow-xs'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100 shadow-xs'
                : isDark
                  ? 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
            title="View topics you've created videos for and tracked dates"
          >
            <CheckCircle2 className={`w-3.5 h-3.5 ${videoCreatedCount > 0 ? 'text-emerald-500 fill-emerald-500/20' : 'text-slate-400'}`} />
            <span className="hidden xl:inline">Videos Created</span>
            <span className="xl:hidden">Created</span>
            {videoCreatedCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 text-[10px] font-mono font-bold bg-emerald-600 text-white rounded-full">
                {videoCreatedCount}
              </span>
            )}
          </button>

          {/* Saved Articles */}
          <button
            onClick={onOpenSaved}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              isDark
                ? 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden sm:inline">Saved</span>
            {savedCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 text-[10px] font-mono font-bold bg-indigo-600 text-white rounded-full">
                {savedCount}
              </span>
            )}
          </button>

          {/* Top Right: Browser Extension Download stacked above Refresh News */}
          <div className="flex flex-col items-end gap-1">
            {onOpenExtensionModal && (
              <button
                onClick={onOpenExtensionModal}
                className="flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold rounded-md bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-xs transition-all active:scale-95 cursor-pointer whitespace-nowrap group"
                title="Download full functional browser extension (Chrome, Edge, Brave, Firefox, Safari) that updates automatically with this web app"
              >
                <Download className="w-3 h-3 text-amber-300 group-hover:animate-bounce" />
                <span>Download Extension</span>
                <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-black/25 text-amber-200">
                  All Browsers
                </span>
              </button>
            )}

            {/* Refresh News Button */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className={`w-full flex items-center justify-center gap-1.5 px-3.5 py-1 text-xs font-semibold rounded-lg text-white shadow-sm transition-all ${
                isRefreshing
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Discovering News...' : 'Refresh News'}</span>
            </button>
          </div>

          {/* Bangla Readme Guide Button */}
          {onOpenBanglaReadme && (
            <button
              onClick={onOpenBanglaReadme}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                isDark
                  ? 'bg-emerald-950/70 border-emerald-700 text-emerald-300 hover:bg-emerald-900/60 shadow-xs'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100 shadow-xs'
              }`}
              title="ব্যবহার নির্দেশিকা ও অপশন পরিচিতি (Bangla Readme Guide)"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
              <span className="font-sans">Readme (বাংলা)</span>
            </button>
          )}

          {/* Settings Modal Button */}
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              aria-label="Application and AI Settings"
              className={`p-2 rounded-lg border transition-colors ${
                isDark
                  ? 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800'
                  : 'bg-white border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Settings & AI Configuration"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle dark mode"
            className={`p-2 rounded-lg border transition-colors ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
                : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>
      </div>

      {/* Topic Search Bar Strip */}
      <div className={`px-4 sm:px-6 lg:px-8 py-2 border-t flex flex-wrap items-center justify-between gap-3 ${
        isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50/80 border-slate-200'
      }`}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (topicInput.trim() && onSearchTopic) {
              onSearchTopic(topicInput.trim());
            }
          }}
          className="flex items-center gap-2 flex-1 max-w-xl"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              placeholder={`Search any topic across global news (past ${timeWindow})... e.g. Red Sea, Bangladesh RMG, Chips`}
              className={`w-full pl-9 pr-8 py-1.5 rounded-lg border text-xs transition-colors ${
                isDark
                  ? 'bg-slate-950 border-slate-700 text-slate-100 placeholder-slate-500 focus:border-blue-500'
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-600'
              }`}
            />
            {topicInput && (
              <button
                type="button"
                onClick={() => {
                  setTopicInput('');
                  if (onClearTopicSearch) onClearTopicSearch();
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                title="Clear topic search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={isRefreshing || !topicInput.trim()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 transition-all shadow-xs shrink-0 cursor-pointer active:scale-95"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
          </button>
        </form>

        {/* Quick Topic Suggestions */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 overflow-x-auto scrollbar-none py-0.5">
          <span className="font-medium whitespace-nowrap flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Suggested:</span>
          </span>
          {[
            { name: 'Red Sea', icon: Anchor },
            { name: 'Bangladesh RMG', icon: Tag },
            { name: 'Semiconductors', icon: Cpu },
            { name: 'Port Strike', icon: AlertTriangle },
            { name: 'Copper & Mining', icon: Layers },
          ].map((topicObj) => {
            const TopicIcon = topicObj.icon;
            const topic = topicObj.name;
            return (
              <button
                key={topic}
                type="button"
                onClick={() => {
                  setTopicInput(topic);
                  if (onSearchTopic) onSearchTopic(topic);
                }}
                className={`px-2 py-0.5 rounded text-[11px] border whitespace-nowrap transition-colors inline-flex items-center gap-1 cursor-pointer ${
                  activeTopicSearch.toLowerCase() === topic.toLowerCase()
                    ? isDark
                      ? 'bg-blue-900/60 border-blue-600 text-blue-300 font-semibold'
                      : 'bg-blue-50 border-blue-300 text-blue-700 font-semibold'
                    : isDark
                      ? 'border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                      : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <TopicIcon className="w-3 h-3 opacity-75" />
                <span>{topic}</span>
              </button>
            );
          })}
          {activeTopicSearch && (
            <button
              type="button"
              onClick={() => {
                setTopicInput('');
                if (onClearTopicSearch) onClearTopicSearch();
              }}
              className="px-2 py-0.5 rounded text-[11px] bg-rose-600 text-white font-medium hover:bg-rose-700 whitespace-nowrap inline-flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              <span>Reset to All News</span>
            </button>
          )}
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto scrollbar-none border-t border-slate-100 dark:border-slate-800/80">
        {[
          { id: 'dashboard', label: 'Intelligence Dashboard', icon: Globe },
          { id: 'top10', label: 'Top 10 Things to Know', icon: Zap },
          { id: 'radar', label: 'Risk Radar', icon: Compass },
          { id: 'trends', label: 'Emerging Trends', icon: TrendingUp },
          { id: 'bangladesh', label: 'Bangladesh Impact', icon: MapPin },
          { id: 'videoBriefs', label: 'Video Brief Studio', icon: Clapperboard },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-1.5 py-2.5 px-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                isActive
                  ? isDark
                    ? 'border-blue-500 text-blue-400'
                    : 'border-blue-600 text-blue-700 font-semibold'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
};
