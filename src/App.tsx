import React, { useState, useEffect, useMemo } from 'react';
import {
  INITIAL_DATASET,
  DEFAULT_NEWS_ITEMS
} from './data/defaultIntelligence';
import {
  IntelligenceDataset,
  NewsItem,
  TimeWindow,
  SavedBookmark,
  UserAlertRule,
  VideoCreatedRecord
} from './types/news';
import { Navbar } from './components/Navbar';
import { KpiBar } from './components/KpiBar';
import { RiskRadar } from './components/RiskRadar';
import { RegionalRiskHeatmap } from './components/RegionalRiskHeatmap';
import { ImpactForecast } from './components/ImpactForecast';
import { Top10Section } from './components/Top10Section';
import { WhatChangedSection } from './components/WhatChangedSection';
import { WatchNextSection } from './components/WatchNextSection';
import { NewsFilterBar } from './components/NewsFilterBar';
import { NewsCard } from './components/NewsCard';
import { TrendsSection } from './components/TrendsSection';
import { ScoreBreakdownModal } from './components/ScoreBreakdownModal';
import { ArticleDetailModal } from './components/ArticleDetailModal';
import { ExecutiveBriefModal } from './components/ExecutiveBriefModal';
import { WatchlistAlertsModal } from './components/WatchlistAlertsModal';
import { SavedArticlesModal } from './components/SavedArticlesModal';
import { SearchProgressIndicator } from './components/SearchProgressIndicator';
import { VideoBriefModal } from './components/VideoBriefModal';
import { AiStatusModal } from './components/AiStatusModal';
import { SettingsModal } from './components/SettingsModal';
import { MasterVideoPromptModal } from './components/MasterVideoPromptModal';
import { QuickReadDrawer } from './components/QuickReadDrawer';
import { VideoCreatedTrackerModal } from './components/VideoCreatedTrackerModal';
import { BanglaReadmeModal } from './components/BanglaReadmeModal';
import { ExtensionModal } from './components/ExtensionModal';
import { VideoBrief } from './types/videoBrief';
import { searchNewsWithAdaptiveAi } from './services/clientIntelligenceService';
import { APP_VERSION } from './services/adaptiveAiService';
import {
  MapPin,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Search,
  ExternalLink,
  ShieldCheck,
  Compass,
  Clapperboard,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { formatLocalDateTime, formatTimeAgo } from './utils/formatters';

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sc_theme');
      return saved ? saved === 'dark' : true;
    }
    return true;
  });

  useEffect(() => {
    localStorage.setItem('sc_theme', isDark ? 'dark' : 'light');
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Main intelligence dataset
  const [dataset, setDataset] = useState<IntelligenceDataset>(INITIAL_DATASET);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timeWindow, setTimeWindow] = useState<TimeWindow>('72h');

  // Navigation tab
  const [currentTab, setCurrentTab] = useState('dashboard');

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [selectedIndustry, setSelectedIndustry] = useState('All Industries');
  const [minRelevance, setMinRelevance] = useState(45);
  const [sortBy, setSortBy] = useState('priority');
  const [displayLimit, setDisplayLimit] = useState(20);

  // Bookmarks & Saved News
  const [bookmarks, setBookmarks] = useState<SavedBookmark[]>(() => {
    try {
      const saved = localStorage.getItem('sc_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('sc_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Watchlist & Alerts
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sc_watchlist');
      return saved
        ? JSON.parse(saved)
        : ['Bangladesh', 'China', 'Red Sea', 'Semiconductors', 'Shipping', 'RMG'];
    } catch {
      return ['Bangladesh', 'China', 'Red Sea', 'Semiconductors', 'Shipping', 'RMG'];
    }
  });

  const [alertRules, setAlertRules] = useState<UserAlertRule[]>(() => {
    try {
      const saved = localStorage.getItem('sc_alert_rules');
      return saved
        ? JSON.parse(saved)
        : [
            { id: 'rule-1', name: 'Critical Shipping Disruptions', minScore: 85, category: 'Shipping', active: true },
            { id: 'rule-2', name: 'High Semiconductor Export Restrictions', minScore: 85, category: 'Tariffs', active: true },
          ];
    } catch {
      return [
        { id: 'rule-1', name: 'Critical Shipping Disruptions', minScore: 85, category: 'Shipping', active: true },
      ];
    }
  });

  useEffect(() => {
    localStorage.setItem('sc_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem('sc_alert_rules', JSON.stringify(alertRules));
  }, [alertRules]);

  // Modals state
  const [selectedItemForScore, setSelectedItemForScore] = useState<NewsItem | null>(null);
  const [selectedItemForDetail, setSelectedItemForDetail] = useState<NewsItem | null>(null);
  const [selectedItemForVideoBrief, setSelectedItemForVideoBrief] = useState<NewsItem | null>(null);
  const [selectedItemForMasterPrompt, setSelectedItemForMasterPrompt] = useState<NewsItem | null>(null);
  const [isExecutiveBriefOpen, setIsExecutiveBriefOpen] = useState(false);
  const [isWatchlistAlertsOpen, setIsWatchlistAlertsOpen] = useState(false);
  const [isSavedOpen, setIsSavedOpen] = useState(false);
  const [isAiStatusOpen, setIsAiStatusOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isBanglaReadmeOpen, setIsBanglaReadmeOpen] = useState(false);
  const [isExtensionModalOpen, setIsExtensionModalOpen] = useState(false);
  const [activeTopicSearch, setActiveTopicSearch] = useState<string>('');
  const [searchErrorMessage, setSearchErrorMessage] = useState<string | null>(null);

  // Quick Read Stack (session-based temporary list for rapid follow-up)
  const [quickReadIds, setQuickReadIds] = useState<string[]>(() => {
    try {
      const saved = sessionStorage.getItem('sc_quick_read_stack');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem('sc_quick_read_stack', JSON.stringify(quickReadIds));
    } catch {
      // ignore
    }
  }, [quickReadIds]);

  const [isQuickReadOpen, setIsQuickReadOpen] = useState(false);
  const [quickReadFilterOnly, setQuickReadFilterOnly] = useState(false);

  const handleToggleQuickRead = (item: NewsItem) => {
    setQuickReadIds((prev) => {
      if (prev.includes(item.id)) {
        return prev.filter((id) => id !== item.id);
      } else {
        return [...prev, item.id];
      }
    });
  };

  const handleRemoveFromQuickRead = (id: string) => {
    setQuickReadIds((prev) => prev.filter((itemId) => itemId !== id));
  };

  const handleClearQuickRead = () => {
    setQuickReadIds([]);
  };

  // Video Created Tracker state (persists across days so creator knows what's worked on)
  const [videoCreatedMap, setVideoCreatedMap] = useState<Record<string, VideoCreatedRecord>>(() => {
    try {
      const saved = localStorage.getItem('sc_video_created_map');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('sc_video_created_map', JSON.stringify(videoCreatedMap));
    } catch {
      // ignore
    }
  }, [videoCreatedMap]);

  const [isVideoCreatedTrackerOpen, setIsVideoCreatedTrackerOpen] = useState(false);
  const [videoStatusFilter, setVideoStatusFilter] = useState<'all' | 'pending' | 'created'>('all');

  const handleToggleVideoCreated = (item: NewsItem, durationOpt?: string) => {
    setVideoCreatedMap((prev) => {
      const next = { ...prev };
      const existing = next[item.id];
      const now = new Date();
      const formattedDate = now.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

      if (!existing) {
        const dur = durationOpt || '1m';
        next[item.id] = {
          newsItemId: item.id,
          headline: item.headline,
          createdAt: now.toISOString(),
          formattedDate,
          source: item.source,
          category: item.category,
          priorityScore: item.priorityScore,
          duration: dur,
          durations: [dur],
        };
      } else {
        if (durationOpt) {
          const currentDurations = existing.durations && existing.durations.length > 0
            ? [...existing.durations]
            : (existing.duration ? [existing.duration] : []);

          let updatedDurations: string[];
          if (currentDurations.includes(durationOpt)) {
            updatedDurations = currentDurations.filter((d) => d !== durationOpt);
          } else {
            updatedDurations = [...currentDurations, durationOpt];
          }

          if (updatedDurations.length === 0) {
            delete next[item.id];
          } else {
            next[item.id] = {
              ...existing,
              durations: updatedDurations,
              duration: updatedDurations.join(', '),
              formattedDate,
            };
          }
        } else {
          delete next[item.id];
        }
      }
      return next;
    });
  };

  const handleRemoveVideoRecord = (newsItemId: string) => {
    setVideoCreatedMap((prev) => {
      const next = { ...prev };
      delete next[newsItemId];
      return next;
    });
  };

  const createdVideoCount = useMemo(() => {
    return Object.keys(videoCreatedMap).length;
  }, [videoCreatedMap]);

  const pendingVideoCount = useMemo(() => {
    return dataset.items.filter((item) => !videoCreatedMap[item.id]).length;
  }, [dataset.items, videoCreatedMap]);

  // Toggle bookmark helper
  const handleToggleBookmark = (newsItemId: string) => {
    if (bookmarks.some((b) => b.newsItemId === newsItemId)) {
      setBookmarks(bookmarks.filter((b) => b.newsItemId !== newsItemId));
    } else {
      setBookmarks([
        ...bookmarks,
        {
          newsItemId,
          savedAt: new Date().toISOString(),
          folder: 'Supplier Risk',
        },
      ]);
    }
  };

  const handleUpdateBookmark = (updated: SavedBookmark) => {
    setBookmarks(bookmarks.map((b) => (b.newsItemId === updated.newsItemId ? updated : b)));
  };

  const handleRemoveBookmark = (newsItemId: string) => {
    setBookmarks(bookmarks.filter((b) => b.newsItemId !== newsItemId));
  };

  // Live Refresh handler with topic and time window overrides
  const handleRefreshNews = async (customQuery?: string, windowOverride?: TimeWindow) => {
    setIsRefreshing(true);
    setSearchErrorMessage(null);
    const win = windowOverride || timeWindow;
    const effectiveQuery = customQuery !== undefined
      ? (customQuery.trim() ? customQuery.trim() : undefined)
      : (activeTopicSearch.trim() ? activeTopicSearch.trim() : undefined);

    try {
      const result = await searchNewsWithAdaptiveAi(win, effectiveQuery);
      if (result.success && result.data) {
        setDataset(result.data);
        if (result.message) {
          setSearchErrorMessage(result.message);
        }
      } else {
        setSearchErrorMessage('News search returned fallback intelligence. Showing verified recent developments.');
      }
    } catch (e: any) {
      console.error('Error refreshing news:', e);
      setSearchErrorMessage('News search temporarily unavailable. Displaying cached verified reporting.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSearchTopic = (topic: string) => {
    setActiveTopicSearch(topic);
    handleRefreshNews(topic, timeWindow);
  };

  const handleClearTopicSearch = () => {
    setActiveTopicSearch('');
    handleRefreshNews('', timeWindow);
  };

  // Change Time Window handler
  const handleChangeTimeWindow = (w: TimeWindow) => {
    setTimeWindow(w);
    // Refresh news for selected window, preserving active topic search if present
    handleRefreshNews(activeTopicSearch || undefined, w);
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All Categories');
    setSelectedRegion('All Regions');
    setSelectedIndustry('All Industries');
    setMinRelevance(45);
    setSortBy('priority');
    setDisplayLimit(20);
    setVideoStatusFilter('all');
    setQuickReadFilterOnly(false);
  };

  // Filtered & Sorted stories
  const filteredStories = useMemo(() => {
    let list = [...dataset.items];

    // Dedicated Bangladesh tab filter
    if (currentTab === 'bangladesh') {
      list = list.filter(
        (item) =>
          item.bangladeshImpact &&
          (item.bangladeshImpact.level === 'Critical' ||
            item.bangladeshImpact.level === 'High' ||
            item.bangladeshImpact.level === 'Medium' ||
            item.countries?.includes('Bangladesh') ||
            item.headline.toLowerCase().includes('bangladesh') ||
            item.headline.toLowerCase().includes('chittagong'))
      );
    }

    // Quick Read Stack Only filter
    if (quickReadFilterOnly) {
      list = list.filter((item) => quickReadIds.includes(item.id));
    }

    // Video created status filter
    if (videoStatusFilter === 'pending') {
      list = list.filter((item) => !videoCreatedMap[item.id]);
    } else if (videoStatusFilter === 'created') {
      list = list.filter((item) => Boolean(videoCreatedMap[item.id]));
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (item) =>
          item.headline.toLowerCase().includes(q) ||
          item.oneLineSummary?.toLowerCase().includes(q) ||
          item.executiveSummary?.toLowerCase().includes(q) ||
          item.source.toLowerCase().includes(q) ||
          item.countries?.some((c) => c.toLowerCase().includes(q)) ||
          item.industries?.some((ind) => ind.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (selectedCategory !== 'All Categories') {
      list = list.filter(
        (item) =>
          item.category.toLowerCase() === selectedCategory.toLowerCase() ||
          item.subcategory.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    // Region filter
    if (selectedRegion !== 'All Regions') {
      list = list.filter(
        (item) =>
          item.regions?.some((r) => r.toLowerCase().includes(selectedRegion.toLowerCase())) ||
          (selectedRegion === 'South Asia' && item.countries?.includes('Bangladesh'))
      );
    }

    // Industry filter
    if (selectedIndustry !== 'All Industries') {
      list = list.filter((item) =>
        item.industries?.some((ind) => ind.toLowerCase().includes(selectedIndustry.toLowerCase()))
      );
    }

    // Min Priority / Relevance filter
    list = list.filter((item) => item.priorityScore >= minRelevance);

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'latest') {
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      }
      if (sortBy === 'procurement') {
        const pOrder: Record<string, number> = { Critical: 4, High: 3, Medium: 2, Low: 1 };
        const pA = pOrder[a.impactRatings?.procurementImpact || 'Low'] || 1;
        const pB = pOrder[b.impactRatings?.procurementImpact || 'Low'] || 1;
        return pB - pA;
      }
      if (sortBy === 'relevance') {
        return (b.scoreBreakdown?.supplyChainRelevance || 0) - (a.scoreBreakdown?.supplyChainRelevance || 0);
      }
      // default: priority
      return b.priorityScore - a.priorityScore;
    });

    return list;
  }, [
    dataset.items,
    currentTab,
    quickReadFilterOnly,
    quickReadIds,
    videoStatusFilter,
    videoCreatedMap,
    searchQuery,
    selectedCategory,
    selectedRegion,
    selectedIndustry,
    minRelevance,
    sortBy,
  ]);

  const displayedStories = filteredStories.slice(0, displayLimit);

  return (
    <div className={`min-h-screen transition-colors font-sans ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50/50 text-slate-900'
    }`}>
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        timeWindow={timeWindow}
        onChangeTimeWindow={handleChangeTimeWindow}
        windowStart={dataset.newsWindow.start}
        windowEnd={dataset.newsWindow.end}
        onRefresh={() => handleRefreshNews()}
        isRefreshing={isRefreshing}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        onOpenExecutiveBrief={() => setIsExecutiveBriefOpen(true)}
        onOpenWatchlistAlerts={() => setIsWatchlistAlertsOpen(true)}
        onOpenSaved={() => setIsSavedOpen(true)}
        onOpenAiStatus={() => setIsAiStatusOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        savedCount={bookmarks.length}
        quickReadCount={quickReadIds.length}
        onOpenQuickRead={() => setIsQuickReadOpen(true)}
        videoCreatedCount={createdVideoCount}
        onOpenVideoCreatedTracker={() => setIsVideoCreatedTrackerOpen(true)}
        onOpenBanglaReadme={() => setIsBanglaReadmeOpen(true)}
        onOpenExtensionModal={() => setIsExtensionModalOpen(true)}
        activeTopicSearch={activeTopicSearch}
        onSearchTopic={handleSearchTopic}
        onClearTopicSearch={handleClearTopicSearch}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Error notification if any */}
        {searchErrorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
              <span>{searchErrorMessage}</span>
            </div>
            <button
              onClick={() => setSearchErrorMessage(null)}
              className="text-amber-600 hover:text-amber-900 font-bold ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* Dashboard View */}
        {currentTab === 'dashboard' && (
          <>
            {/* Top KPI Metrics Bar */}
            <KpiBar
              totalAnalyzed={dataset.totalAnalyzed}
              items={dataset.items}
              riskRadar={dataset.riskRadar}
              isDark={isDark}
            />

            {/* Top 10 Executive View */}
            <Top10Section
              top10={dataset.top10Things}
              items={dataset.items}
              onSelectStory={(item) => setSelectedItemForDetail(item)}
              onCreateVideoBrief={(item) => setSelectedItemForVideoBrief(item)}
              onOpenMasterPrompt={(item) => setSelectedItemForMasterPrompt(item)}
              videoCreatedMap={videoCreatedMap}
              quickReadStack={quickReadIds}
              onToggleQuickRead={handleToggleQuickRead}
              onToggleVideoCreated={handleToggleVideoCreated}
              isDark={isDark}
            />

            {/* Global Supply Chain Risk Radar */}
            <RiskRadar
              categories={dataset.riskRadar}
              onSelectCategory={(catName) => {
                setSelectedCategory(catName.split(' ')[0]);
              }}
              isDark={isDark}
            />

            {/* Regional Risk Heatmap Visualization */}
            <RegionalRiskHeatmap
              items={dataset.items}
              isDark={isDark}
              onSelectCountry={(country) => {
                setSearchQuery(country);
              }}
              onSelectStory={(item) => setSelectedItemForDetail(item)}
              onCreateVideoBrief={(item) => setSelectedItemForVideoBrief(item)}
              onOpenMasterPrompt={(item) => setSelectedItemForMasterPrompt(item)}
            />

            {/* Impact Forecast: 30-Day Procurement Vulnerability Trend & 7D Forward Model */}
            <ImpactForecast
              items={dataset.items}
              isDark={isDark}
              onSelectStory={(item) => setSelectedItemForDetail(item)}
              onCreateVideoBrief={(item) => setSelectedItemForVideoBrief(item)}
            />

            {/* What Changed in the Last 24 Hours */}
            <WhatChangedSection
              whatChanged={dataset.whatChanged}
              isDark={isDark}
            />

            {/* Watch Next 24-72 Hours */}
            <WatchNextSection
              watchNext={dataset.watchNext}
              isDark={isDark}
            />

            {/* Emerging Macro Trends */}
            <TrendsSection
              trends={dataset.trends}
              onSelectTrend={(t) => {
                setSearchQuery(t.name.split(' ')[0]);
              }}
              isDark={isDark}
            />

            {/* Filter Bar */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-base font-bold tracking-tight">
                  Top Global Supply Chain & Trade Intelligence
                </h2>
                <span className="text-xs font-mono text-slate-500">
                  Updated {formatTimeAgo(dataset.lastUpdated)}
                </span>
              </div>

              <NewsFilterBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                selectedRegion={selectedRegion}
                onRegionChange={setSelectedRegion}
                selectedIndustry={selectedIndustry}
                onIndustryChange={setSelectedIndustry}
                minRelevance={minRelevance}
                onMinRelevanceChange={setMinRelevance}
                sortBy={sortBy}
                onSortByChange={setSortBy}
                displayLimit={displayLimit}
                onDisplayLimitChange={setDisplayLimit}
                totalFilteredCount={filteredStories.length}
                onResetFilters={handleResetFilters}
                videoStatusFilter={videoStatusFilter}
                onVideoStatusFilterChange={setVideoStatusFilter}
                pendingVideoCount={pendingVideoCount}
                createdVideoCount={createdVideoCount}
                isDark={isDark}
              />
            </div>

            {/* Quick Read Stack Alert / Filter Banner */}
            {quickReadIds.length > 0 && (
              <div className={`p-3.5 rounded-2xl border mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                isDark
                  ? 'bg-amber-950/25 border-amber-800/60 text-amber-200'
                  : 'bg-amber-50 border-amber-300 text-amber-900 shadow-xs'
              }`}>
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold shrink-0">
                    <Zap className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <span className="font-bold">Quick Read Session Stack:</span>{' '}
                    <span>{quickReadIds.length} {quickReadIds.length === 1 ? 'story' : 'stories'} moved for immediate follow-up.</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => setQuickReadFilterOnly(!quickReadFilterOnly)}
                    className={`px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                      quickReadFilterOnly
                        ? 'bg-amber-500 text-slate-950 font-bold border-amber-600 shadow-xs'
                        : isDark
                          ? 'border-amber-700/60 text-amber-200 hover:bg-amber-900/40'
                          : 'border-amber-300 text-amber-900 hover:bg-amber-100'
                    }`}
                  >
                    {quickReadFilterOnly ? 'Show All Stories' : 'Filter Stream to Stack'}
                  </button>
                  <button
                    onClick={() => setIsQuickReadOpen(true)}
                    className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold transition-all shadow-xs flex items-center gap-1.5"
                  >
                    <span>Open Stack Queue</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            )}

            {/* Main News Intelligence Stream */}
            {displayedStories.length === 0 ? (
              <div className="py-16 text-center border rounded-2xl p-8 bg-slate-50/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800">
                <Search className="w-10 h-10 mx-auto mb-3 text-slate-400 opacity-60" />
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  No high-priority supply chain stories were identified matching your criteria.
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Try expanding the time window (e.g. Last 72 hours / 7 days) or lowering the minimum priority threshold.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-4 px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors inline-flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {displayedStories.map((item, idx) => (
                  <NewsCard
                    key={item.id}
                    item={item}
                    rank={idx + 1}
                    onOpenAnalysis={(item) => setSelectedItemForDetail(item)}
                    onOpenScoreBreakdown={(item) => setSelectedItemForScore(item)}
                    onCreateVideoBrief={(item) => setSelectedItemForVideoBrief(item)}
                    onOpenMasterPrompt={(item) => setSelectedItemForMasterPrompt(item)}
                    onToggleBookmark={handleToggleBookmark}
                    isBookmarked={bookmarks.some((b) => b.newsItemId === item.id)}
                    isInQuickRead={quickReadIds.includes(item.id)}
                    onToggleQuickRead={handleToggleQuickRead}
                    isVideoCreated={Boolean(videoCreatedMap[item.id])}
                    videoCreatedDate={videoCreatedMap[item.id]?.formattedDate}
                    videoRecord={videoCreatedMap[item.id]}
                    onToggleVideoCreated={handleToggleVideoCreated}
                    isDark={isDark}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Top 10 Standalone Tab */}
        {currentTab === 'top10' && (
          <div className="space-y-6">
            <Top10Section
              top10={dataset.top10Things}
              items={dataset.items}
              onSelectStory={(item) => setSelectedItemForDetail(item)}
              onCreateVideoBrief={(item) => setSelectedItemForVideoBrief(item)}
              onOpenMasterPrompt={(item) => setSelectedItemForMasterPrompt(item)}
              videoCreatedMap={videoCreatedMap}
              quickReadStack={quickReadIds}
              onToggleQuickRead={handleToggleQuickRead}
              onToggleVideoCreated={handleToggleVideoCreated}
              isDark={isDark}
            />

            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-mono">
                Full Ranked Articles
              </h3>
              {dataset.items.slice(0, 10).map((item, idx) => (
                <NewsCard
                  key={item.id}
                  item={item}
                  rank={idx + 1}
                  onOpenAnalysis={(item) => setSelectedItemForDetail(item)}
                  onOpenScoreBreakdown={(item) => setSelectedItemForScore(item)}
                  onCreateVideoBrief={(item) => setSelectedItemForVideoBrief(item)}
                  onOpenMasterPrompt={(item) => setSelectedItemForMasterPrompt(item)}
                  onToggleBookmark={handleToggleBookmark}
                  isBookmarked={bookmarks.some((b) => b.newsItemId === item.id)}
                  isInQuickRead={quickReadIds.includes(item.id)}
                  onToggleQuickRead={handleToggleQuickRead}
                  isVideoCreated={Boolean(videoCreatedMap[item.id])}
                  videoCreatedDate={videoCreatedMap[item.id]?.formattedDate}
                  videoRecord={videoCreatedMap[item.id]}
                  onToggleVideoCreated={handleToggleVideoCreated}
                  isDark={isDark}
                />
              ))}
            </div>
          </div>
        )}

        {/* Risk Radar Standalone Tab */}
        {currentTab === 'radar' && (
          <div className="space-y-6">
            <RiskRadar
              categories={dataset.riskRadar}
              onSelectCategory={(catName) => {
                setSelectedCategory(catName.split(' ')[0]);
                setCurrentTab('dashboard');
              }}
              isDark={isDark}
            />

            <RegionalRiskHeatmap
              items={dataset.items}
              isDark={isDark}
              onSelectCountry={(country) => {
                setSearchQuery(country);
                setCurrentTab('dashboard');
              }}
              onSelectStory={(item) => setSelectedItemForDetail(item)}
              onCreateVideoBrief={(item) => setSelectedItemForVideoBrief(item)}
              onOpenMasterPrompt={(item) => setSelectedItemForMasterPrompt(item)}
            />

            <ImpactForecast
              items={dataset.items}
              isDark={isDark}
              onSelectStory={(item) => setSelectedItemForDetail(item)}
              onCreateVideoBrief={(item) => setSelectedItemForVideoBrief(item)}
            />

            <WhatChangedSection
              whatChanged={dataset.whatChanged}
              isDark={isDark}
            />

            <WatchNextSection
              watchNext={dataset.watchNext}
              isDark={isDark}
            />
          </div>
        )}

        {/* Trends Standalone Tab */}
        {currentTab === 'trends' && (
          <div className="space-y-6">
            <TrendsSection
              trends={dataset.trends}
              isDark={isDark}
            />

            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <h3 className="text-sm font-bold mb-2">Thematic Cluster Analysis</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                The intelligence engine identifies recurring event patterns across diverse trade corridors. Multiple individual publisher stories are merged to represent the broader systemic shift, preventing dashboard clutter and redundant alerts.
              </p>
            </div>
          </div>
        )}

        {/* Bangladesh Focus Tab */}
        {currentTab === 'bangladesh' && (
          <div className="space-y-6">
            {/* Header banner */}
            <div className={`p-5 rounded-2xl border ${
              isDark ? 'bg-amber-950/20 border-amber-800/60 text-slate-100' : 'bg-amber-50/70 border-amber-200 text-slate-900'
            }`}>
              <div className="flex items-center gap-2.5 mb-2">
                <MapPin className="w-5 h-5 text-amber-500" />
                <h2 className="text-base font-bold tracking-tight">
                  Bangladesh Sourcing & Procurement Intelligence Center
                </h2>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
                Specialized monitoring for Ready-Made Garments (RMG), knitwear, woven apparel, raw cotton imports, Chittagong/Chattogram port container turnaround dwell times, energy power allocations, and Western buyer export demand.
              </p>
            </div>

            {/* Bangladesh Stories Stream */}
            <div className="space-y-4">
              {filteredStories.map((item, idx) => (
                <NewsCard
                  key={item.id}
                  item={item}
                  rank={idx + 1}
                  onOpenAnalysis={(item) => setSelectedItemForDetail(item)}
                  onOpenScoreBreakdown={(item) => setSelectedItemForScore(item)}
                  onCreateVideoBrief={(item) => setSelectedItemForVideoBrief(item)}
                  onOpenMasterPrompt={(item) => setSelectedItemForMasterPrompt(item)}
                  onToggleBookmark={handleToggleBookmark}
                  isBookmarked={bookmarks.some((b) => b.newsItemId === item.id)}
                  isInQuickRead={quickReadIds.includes(item.id)}
                  onToggleQuickRead={handleToggleQuickRead}
                  isVideoCreated={Boolean(videoCreatedMap[item.id])}
                  videoCreatedDate={videoCreatedMap[item.id]?.formattedDate}
                  videoRecord={videoCreatedMap[item.id]}
                  onToggleVideoCreated={handleToggleVideoCreated}
                  isDark={isDark}
                />
              ))}
            </div>
          </div>
        )}

        {/* Video Briefs Studio Tab */}
        {currentTab === 'videoBriefs' && (
          <div className="space-y-6">
            {/* Header banner */}
            <div className={`p-5 rounded-2xl border ${
              isDark ? 'bg-rose-950/20 border-rose-900/60 text-slate-100' : 'bg-rose-50/70 border-rose-200 text-slate-900'
            }`}>
              <div className="flex items-center gap-2.5 mb-2">
                <Clapperboard className="w-5 h-5 text-rose-500" />
                <h2 className="text-base font-bold tracking-tight">
                  Fact-Locked News → Video Brief Studio
                </h2>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
                Generate fact-checked, source-grounded video summaries, scripts, titles, hooks, and scene visual plans based ONLY on verified news reporting. Optimized for YouTube Shorts, Reels, TikTok, and long-form video production in natural spoken Bangla or English.
              </p>
            </div>

            {/* Stories Stream with Video Brief generation triggers */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>Select any verified story to generate a fact-locked video brief</span>
                <span>{filteredStories.length} stories available</span>
              </div>
              {filteredStories.map((item, idx) => (
                <NewsCard
                  key={item.id}
                  item={item}
                  rank={idx + 1}
                  onOpenAnalysis={(item) => setSelectedItemForDetail(item)}
                  onOpenScoreBreakdown={(item) => setSelectedItemForScore(item)}
                  onCreateVideoBrief={(item) => setSelectedItemForVideoBrief(item)}
                  onOpenMasterPrompt={(item) => setSelectedItemForMasterPrompt(item)}
                  onToggleBookmark={handleToggleBookmark}
                  isBookmarked={bookmarks.some((b) => b.newsItemId === item.id)}
                  isInQuickRead={quickReadIds.includes(item.id)}
                  onToggleQuickRead={handleToggleQuickRead}
                  isVideoCreated={Boolean(videoCreatedMap[item.id])}
                  videoCreatedDate={videoCreatedMap[item.id]?.formattedDate}
                  videoRecord={videoCreatedMap[item.id]}
                  onToggleVideoCreated={handleToggleVideoCreated}
                  isDark={isDark}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className={`border-t py-8 mt-12 transition-colors text-xs ${
        isDark ? 'bg-slate-950 border-slate-800/80 text-slate-500' : 'bg-white border-slate-200 text-slate-500'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-bold text-slate-700 dark:text-slate-300">
              SupplyChain News Intelligence Terminal
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Broad English-language news discovery across available reputable global sources. Real-time deduplication, event clustering, and priority scoring.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <button
              onClick={() => setIsExecutiveBriefOpen(true)}
              className="hover:underline text-blue-600 dark:text-blue-400"
            >
              Executive Brief
            </button>
            <button
              onClick={() => setIsWatchlistAlertsOpen(true)}
              className="hover:underline text-blue-600 dark:text-blue-400"
            >
              Alerts
            </button>
            <a
              href="#top"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:underline text-slate-400"
            >
              Back to Top ↑
            </a>
          </div>
        </div>
      </footer>

      {/* Modals & Dialogs */}
      <ScoreBreakdownModal
        item={selectedItemForScore}
        onClose={() => setSelectedItemForScore(null)}
        isDark={isDark}
      />

      <ArticleDetailModal
        item={selectedItemForDetail}
        allItems={dataset.items}
        onSelectItem={(item) => setSelectedItemForDetail(item)}
        onClose={() => setSelectedItemForDetail(null)}
        onToggleBookmark={handleToggleBookmark}
        onCreateVideoBrief={(item) => setSelectedItemForVideoBrief(item)}
        onOpenMasterPrompt={(item) => setSelectedItemForMasterPrompt(item)}
        isBookmarked={selectedItemForDetail ? bookmarks.some((b) => b.newsItemId === selectedItemForDetail.id) : false}
        isInQuickRead={selectedItemForDetail ? quickReadIds.includes(selectedItemForDetail.id) : false}
        onToggleQuickRead={handleToggleQuickRead}
        isVideoCreated={selectedItemForDetail ? Boolean(videoCreatedMap[selectedItemForDetail.id]) : false}
        videoCreatedDate={selectedItemForDetail ? videoCreatedMap[selectedItemForDetail.id]?.formattedDate : undefined}
        onToggleVideoCreated={handleToggleVideoCreated}
        isDark={isDark}
      />

      <QuickReadDrawer
        isOpen={isQuickReadOpen}
        onClose={() => setIsQuickReadOpen(false)}
        stackIds={quickReadIds}
        items={dataset.items}
        onRemoveFromStack={handleRemoveFromQuickRead}
        onClearStack={handleClearQuickRead}
        onOpenAnalysis={(item) => setSelectedItemForDetail(item)}
        onCreateVideoBrief={(item) => setSelectedItemForVideoBrief(item)}
        onOpenMasterPrompt={(item) => setSelectedItemForMasterPrompt(item)}
        videoCreatedMap={videoCreatedMap}
        onToggleVideoCreated={handleToggleVideoCreated}
        isDark={isDark}
      />

      <VideoCreatedTrackerModal
        isOpen={isVideoCreatedTrackerOpen}
        onClose={() => setIsVideoCreatedTrackerOpen(false)}
        videoCreatedMap={videoCreatedMap}
        onRemoveRecord={handleRemoveVideoRecord}
        items={dataset.items}
        onOpenAnalysis={(item) => setSelectedItemForDetail(item)}
        onCreateVideoBrief={(item) => setSelectedItemForVideoBrief(item)}
        onOpenMasterPrompt={(item) => setSelectedItemForMasterPrompt(item)}
        onFilterRemainingOnly={() => setVideoStatusFilter('pending')}
        isDark={isDark}
      />

      {/* Floating Quick Read Pill button */}
      {quickReadIds.length > 0 && !isQuickReadOpen && (
        <button
          onClick={() => setIsQuickReadOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer border border-amber-400"
          title="Open Quick Read stack for this session"
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>Quick Read Stack</span>
          <span className="px-1.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-950 text-amber-400">
            {quickReadIds.length}
          </span>
        </button>
      )}

      <VideoBriefModal
        item={selectedItemForVideoBrief}
        onClose={() => setSelectedItemForVideoBrief(null)}
        isVideoCreated={selectedItemForVideoBrief ? Boolean(videoCreatedMap[selectedItemForVideoBrief.id]) : false}
        videoCreatedDate={selectedItemForVideoBrief ? videoCreatedMap[selectedItemForVideoBrief.id]?.formattedDate : undefined}
        onToggleVideoCreated={handleToggleVideoCreated}
        isDark={isDark}
      />

      <MasterVideoPromptModal
        isOpen={!!selectedItemForMasterPrompt}
        onClose={() => setSelectedItemForMasterPrompt(null)}
        item={selectedItemForMasterPrompt}
        isDark={isDark}
        onOpenVideoBrief={(item) => {
          setSelectedItemForMasterPrompt(null);
          setSelectedItemForVideoBrief(item);
        }}
        isVideoCreated={selectedItemForMasterPrompt ? Boolean(videoCreatedMap[selectedItemForMasterPrompt.id]) : false}
        videoCreatedDate={selectedItemForMasterPrompt ? videoCreatedMap[selectedItemForMasterPrompt.id]?.formattedDate : undefined}
        onToggleVideoCreated={handleToggleVideoCreated}
      />

      {isExecutiveBriefOpen && (
        <ExecutiveBriefModal
          dataset={dataset}
          onClose={() => setIsExecutiveBriefOpen(false)}
          isDark={isDark}
        />
      )}

      {isWatchlistAlertsOpen && (
        <WatchlistAlertsModal
          watchlist={watchlist}
          onUpdateWatchlist={setWatchlist}
          alertRules={alertRules}
          onUpdateAlertRules={setAlertRules}
          onClose={() => setIsWatchlistAlertsOpen(false)}
          isDark={isDark}
        />
      )}

      {isSavedOpen && (
        <SavedArticlesModal
          bookmarks={bookmarks}
          items={dataset.items}
          onRemoveBookmark={handleRemoveBookmark}
          onUpdateBookmark={handleUpdateBookmark}
          onOpenAnalysis={(item) => {
            setIsSavedOpen(false);
            setSelectedItemForDetail(item);
          }}
          onClose={() => setIsSavedOpen(false)}
          isDark={isDark}
        />
      )}

      <SearchProgressIndicator
        isOpen={isRefreshing}
        isDark={isDark}
      />

      <AiStatusModal
        isOpen={isAiStatusOpen}
        onClose={() => setIsAiStatusOpen(false)}
        isDark={isDark}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
      />

      <BanglaReadmeModal
        isOpen={isBanglaReadmeOpen}
        onClose={() => setIsBanglaReadmeOpen(false)}
        isDark={isDark}
      />

      <ExtensionModal
        isOpen={isExtensionModalOpen}
        onClose={() => setIsExtensionModalOpen(false)}
        isDark={isDark}
      />
    </div>
  );
}
