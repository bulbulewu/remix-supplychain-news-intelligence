import React, { useState, useMemo } from 'react';
import {
  X,
  ExternalLink,
  ShieldAlert,
  Clock,
  MapPin,
  Building,
  CheckCircle2,
  Sparkles,
  FileText,
  AlertTriangle,
  Bookmark,
  Share2,
  Loader2,
  Clapperboard,
  Zap,
  Layers,
  Globe,
  Compass,
  ArrowRight,
  RefreshCw,
  Search,
  ShieldCheck,
  DollarSign
} from 'lucide-react';
import { NewsItem } from '../types/news';
import { formatLocalDateTime, getImpactBadge, getCredibilityBadge } from '../utils/formatters';
import { AdaptiveAiService } from '../services/adaptiveAiService';

export interface ClusteredRelatedEvent {
  item: NewsItem;
  similarityScore: number;
  matchReasons: string[];
  sharedCorridor?: string;
  sharedIndustry?: string;
  sharedCategory?: string;
}

interface ArticleDetailModalProps {
  item: NewsItem | null;
  allItems?: NewsItem[];
  onSelectItem?: (item: NewsItem) => void;
  onClose: () => void;
  onToggleBookmark: (id: string) => void;
  onCreateVideoBrief?: (item: NewsItem) => void;
  onOpenMasterPrompt?: (item: NewsItem) => void;
  isBookmarked: boolean;
  isVideoCreated?: boolean;
  videoCreatedDate?: string;
  onToggleVideoCreated?: (item: NewsItem) => void;
  isInQuickRead?: boolean;
  onToggleQuickRead?: (item: NewsItem) => void;
  isDark: boolean;
}

export const ArticleDetailModal: React.FC<ArticleDetailModalProps> = ({
  item,
  allItems = [],
  onSelectItem,
  onClose,
  onToggleBookmark,
  onCreateVideoBrief,
  onOpenMasterPrompt,
  isBookmarked,
  isVideoCreated = false,
  videoCreatedDate,
  onToggleVideoCreated,
  isInQuickRead = false,
  onToggleQuickRead,
  isDark,
}) => {
  const [deepAnalysis, setDeepAnalysis] = useState<any>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'related' | 'procurement' | 'verification' | 'deepAI'>('overview');

  // Live Dynamic Search Cascade State for Related Events
  const [isFetchingLiveRelated, setIsFetchingLiveRelated] = useState(false);
  const [liveRelatedStories, setLiveRelatedStories] = useState<any[]>([]);
  const [liveFetchNotice, setLiveFetchNotice] = useState<string | null>(null);

  // Dynamic Clustering of Related Events based on Geographic Corridors & Disruption Vectors
  const relatedEvents = useMemo<ClusteredRelatedEvent[]>(() => {
    if (!item || !allItems || allItems.length === 0) return [];

    const currentRegions = item.regions || [];
    const currentCountries = item.countries || [];
    const currentIndustries = item.industries || [];
    const currentCategory = item.category || '';
    const currentSubcategory = (item.subcategory || '').toLowerCase();
    const currentHeadlineWords = item.headline.toLowerCase().split(/\W+/).filter(w => w.length > 3);

    const candidates: ClusteredRelatedEvent[] = [];

    allItems.forEach((candidate) => {
      if (candidate.id === item.id) return;

      let score = 0;
      const reasons: string[] = [];

      // 1. Geographic Corridor overlap
      const sharedRegions = (candidate.regions || []).filter(r => currentRegions.includes(r));
      const sharedCountries = (candidate.countries || []).filter(c => currentCountries.includes(c));

      if (sharedCountries.length > 0) {
        score += 35;
        reasons.push(`Geographic Focus: ${sharedCountries.slice(0, 2).join(', ')}`);
      } else if (sharedRegions.length > 0) {
        score += 25;
        reasons.push(`Shared Trade Corridor: ${sharedRegions.slice(0, 2).join(', ')}`);
      }

      // 2. Disruption Category & Event Cluster overlap
      if (candidate.subcategory && currentSubcategory && candidate.subcategory.toLowerCase() === currentSubcategory) {
        score += 30;
        reasons.push(`Event Cluster: ${candidate.subcategory}`);
      } else if (candidate.category === currentCategory) {
        score += 20;
        reasons.push(`Domain: ${candidate.category}`);
      }

      // 3. Affected Industry / Commodity overlap
      const sharedIndustries = (candidate.industries || []).filter(i => currentIndustries.includes(i));
      if (sharedIndustries.length > 0) {
        score += 20;
        reasons.push(`Industry Exposure: ${sharedIndustries.slice(0, 2).join(', ')}`);
      }

      // 4. Keyword & Disruption Entity Match
      const candidateWords = candidate.headline.toLowerCase().split(/\W+/);
      const matchingKeywords = currentHeadlineWords.filter(w => candidateWords.includes(w));
      if (matchingKeywords.length >= 2) {
        score += 20;
        reasons.push(`Disruption Keyword Match`);
      }

      // High disruption priority affinity
      if (Math.abs(candidate.priorityScore - item.priorityScore) <= 10) {
        score += 5;
      }

      if (score >= 25) {
        candidates.push({
          item: candidate,
          similarityScore: Math.min(score, 99),
          matchReasons: reasons,
          sharedCorridor: sharedRegions[0] || sharedCountries[0],
          sharedIndustry: sharedIndustries[0],
          sharedCategory: candidate.category,
        });
      }
    });

    // Sort by highest similarity score first, then by priority score
    candidates.sort((a, b) => b.similarityScore - a.similarityScore || b.item.priorityScore - a.item.priorityScore);
    return candidates.slice(0, 6);
  }, [item, allItems]);

  const handleFetchLiveRelated = async () => {
    if (!item) return;
    setIsFetchingLiveRelated(true);
    setLiveFetchNotice(null);

    const corridor = item.regions?.[0] || item.countries?.[0] || 'Global';
    const query = `${item.headline.slice(0, 60)} ${corridor} disruption supply chain`;

    try {
      // Execute Multi-Engine Search Cascade directly through client
      const searchRes = await AdaptiveAiService.executeSearchCascade(query, '72h');
      if (searchRes.results && searchRes.results.length > 0) {
        setLiveRelatedStories(searchRes.results.slice(0, 4));
        setLiveFetchNotice(`Found ${searchRes.results.length} live clustered wire stories via ${searchRes.providerUsed.toUpperCase()}`);
      } else {
        // Fallback to server search
        const serverRes = await fetch('/api/news/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ customQuery: query, timeWindow: '72h' }),
        });
        if (serverRes.ok) {
          const sJson = await serverRes.json();
          if (sJson.data?.items) {
            setLiveRelatedStories(
              sJson.data.items.slice(0, 4).map((it: any) => ({
                title: it.headline,
                url: it.sourceUrl || 'https://news.google.com',
                snippet: it.oneLineSummary || it.summary,
              }))
            );
            setLiveFetchNotice(`Fetched live corroborating updates for ${corridor}`);
          }
        }
      }
    } catch (err: any) {
      console.warn('Live related fetch error:', err);
      setLiveFetchNotice('Could not reach search cascade. Showing locally clustered historical events.');
    } finally {
      setIsFetchingLiveRelated(false);
    }
  };

  if (!item) return null;

  const handleRunDeepAnalysis = async () => {
    setIsLoadingAnalysis(true);
    setActiveTab('deepAI');
    try {
      const res = await fetch('/api/news/deep-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          headline: item.headline,
          summary: item.executiveSummary || item.oneLineSummary,
          useThinking: true,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setDeepAnalysis(data.data);
      }
    } catch (err) {
      console.error('Error fetching deep analysis:', err);
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div
        className={`w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden transition-all ${
          isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5 text-xs">
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                SCORE {item.priorityScore}/100
              </span>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-slate-500 font-mono">{item.source}</span>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-slate-500">{formatLocalDateTime(item.publishedAt)}</span>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-slate-500 font-medium">{getCredibilityBadge(item.credibilityType)}</span>

              {isVideoCreated && (
                <>
                  <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    <span>Video Created · {videoCreatedDate}</span>
                  </span>
                </>
              )}
            </div>

            <h2 className="text-lg sm:text-xl font-bold tracking-tight leading-snug">
              {item.headline}
            </h2>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => onToggleBookmark(item.id)}
              className={`p-2 rounded-lg border transition-colors ${
                isBookmarked
                  ? 'bg-amber-500 text-white border-amber-600'
                  : isDark
                    ? 'border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title={isBookmarked ? 'Saved' : 'Save story'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs inside modal */}
        <div className="flex items-center gap-2 px-5 py-2.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 text-xs overflow-x-auto scrollbar-none font-medium">
          {[
            { id: 'overview', label: 'Executive Synthesis', icon: FileText },
            { id: 'related', label: `Related Events & Corridors (${relatedEvents.length})`, count: relatedEvents.length, icon: Compass },
            { id: 'procurement', label: 'Procurement Impact Matrix', icon: Layers },
            { id: 'verification', label: 'Fact vs Analysis & Sources', icon: ShieldCheck },
            { id: 'deepAI', label: 'AI Strategic Diagnosis', icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? isDark
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-slate-900 text-white font-semibold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.id === 'related' && relatedEvents.length > 0 && activeTab !== 'related' && (
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {/* Executive Summary */}
              <div className={`p-4 rounded-xl border ${
                isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-500" />
                  <span>Executive Summary</span>
                </h4>
                <p className="text-slate-700 dark:text-slate-200 leading-relaxed font-sans">
                  {item.executiveSummary || item.oneLineSummary}
                </p>
              </div>

              {/* Key Facts */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Verified Key Facts</span>
                </h4>
                <ul className="space-y-2">
                  {item.keyFacts?.map((fact, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Why Important */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                  <span>Why This Ranked Top News</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {item.whyImportant?.map((why, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border ${
                        isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-blue-50/40 border-blue-100'
                      }`}
                    >
                      <span className="font-semibold text-blue-600 dark:text-blue-400 mr-1.5">•</span>
                      <span className="text-slate-700 dark:text-slate-300">{why}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bangladesh Relevance */}
              {item.bangladeshImpact && (
                <div className={`p-4 rounded-xl border ${
                  item.bangladeshImpact.level === 'Critical' || item.bangladeshImpact.level === 'High'
                    ? isDark
                      ? 'bg-amber-950/20 border-amber-800 text-amber-200'
                      : 'bg-amber-50 border-amber-200 text-amber-900'
                    : isDark
                      ? 'bg-slate-950/40 border-slate-800 text-slate-300'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <MapPin className="w-4 h-4 text-amber-500" />
                    <span className="font-bold text-xs uppercase tracking-wider">
                      Bangladesh Sourcing & Logistics Relevance ({item.bangladeshImpact.level})
                    </span>
                  </div>
                  <p className="leading-relaxed mb-2">{item.bangladeshImpact.rationale}</p>
                  {item.bangladeshImpact.sectorsAffected?.length > 0 && (
                    <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                      Sectors: {item.bangladeshImpact.sectorsAffected.join(' · ')}
                    </div>
                  )}
                </div>
              )}

              {/* Event Timeline if present */}
              {item.timeline && item.timeline.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Event Progression Timeline
                  </h4>
                  <div className="relative pl-4 border-l-2 border-slate-200 dark:border-slate-800 space-y-3">
                    {item.timeline.map((tl, idx) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-white dark:border-slate-900" />
                        <div className="text-[11px] font-mono text-slate-400">{tl.timestamp} · {tl.source}</div>
                        <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">{tl.headline}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: RELATED EVENTS & GEOGRAPHIC CORRIDORS */}
          {activeTab === 'related' && (
            <div className="space-y-5">
              {/* Corridor & Disruption Cluster Banner */}
              <div className={`p-4 rounded-xl border ${
                isDark ? 'bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/30 border-blue-800/50' : 'bg-gradient-to-r from-blue-50 via-white to-indigo-50 border-blue-200'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Compass className="w-4 h-4 text-blue-500" />
                      <span className="font-bold text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        Disruption Cluster & Corridor Radar
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Corridor: <span className="text-blue-500">{item.regions?.join(', ') || 'Global'}</span>
                      {item.countries?.length ? <span className="text-slate-400 ml-1">({item.countries.join(', ')})</span> : null}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-2">
                      <span>Vector: <strong>{item.category}</strong> {item.subcategory ? `· ${item.subcategory}` : ''}</span>
                      <span>•</span>
                      <span>Sectors: <strong>{item.industries?.join(', ') || 'Global Sourcing'}</strong></span>
                    </div>
                  </div>

                  <button
                    onClick={handleFetchLiveRelated}
                    disabled={isFetchingLiveRelated}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-all disabled:opacity-50 shrink-0 self-start sm:self-auto cursor-pointer"
                  >
                    {isFetchingLiveRelated ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Querying Live Wire...</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Scan Live Wire for Clustered Events</span>
                      </>
                    )}
                  </button>
                </div>

                {liveFetchNotice && (
                  <div className="mt-2.5 pt-2 border-t border-blue-500/20 text-xs font-mono text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>{liveFetchNotice}</span>
                  </div>
                )}
              </div>

              {/* Dynamically Fetched Live Stories if present */}
              {liveRelatedStories.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-emerald-500">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      Live Breaking Wire Corroborations
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">Real-time Grounded Updates</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {liveRelatedStories.map((story, sIdx) => (
                      <div
                        key={sIdx}
                        className={`p-3 rounded-xl border flex flex-col justify-between gap-2 ${
                          isDark ? 'bg-slate-950/70 border-emerald-500/30' : 'bg-emerald-50/40 border-emerald-200'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-xs text-slate-900 dark:text-slate-100 leading-snug">
                            {story.title}
                          </div>
                          {story.snippet && (
                            <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                              {story.snippet}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/80 text-[10px]">
                          <span className="text-emerald-500 font-semibold font-mono">Live Grounding Result</span>
                          {story.url && (
                            <a
                              href={story.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-500 hover:underline flex items-center gap-1 font-medium"
                            >
                              Source <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Clustered News Stories List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                  <span>Clustered Disruption Events in This Trade Corridor ({relatedEvents.length})</span>
                  <span className="text-[10px] font-normal normal-case text-slate-500">
                    Ranked by multi-factor corridor correlation score
                  </span>
                </div>

                {relatedEvents.length === 0 ? (
                  <div className={`p-8 text-center rounded-xl border ${
                    isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <p className="text-xs text-slate-500">
                      No other stored stories match this exact corridor or commodity. Click <strong>"Scan Live Wire for Clustered Events"</strong> above to search the live web!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {relatedEvents.map((rel) => {
                      const relItem = rel.item;
                      const scoreColor =
                        rel.similarityScore >= 80
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : rel.similarityScore >= 50
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30';

                      return (
                        <div
                          key={relItem.id}
                          className={`p-4 rounded-xl border transition-all hover:border-blue-500/60 flex flex-col gap-3 ${
                            isDark ? 'bg-slate-950/50 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                          }`}
                        >
                          {/* Top Row: Affinity & Priority */}
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${scoreColor}`}>
                                🎯 {rel.similarityScore}% Disruption Match
                              </span>
                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                SCORE {relItem.priorityScore}/100
                              </span>
                              <span className="text-[10px] text-slate-400">· {relItem.source}</span>
                              <span className="text-[10px] text-slate-400">· {formatLocalDateTime(relItem.publishedAt)}</span>
                            </div>

                            {/* Match Reason Badges */}
                            <div className="flex flex-wrap items-center gap-1">
                              {rel.matchReasons.slice(0, 2).map((reason, rIdx) => (
                                <span
                                  key={rIdx}
                                  className="text-[9px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-medium"
                                >
                                  {reason}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Headline & Summary */}
                          <div>
                            <h4
                              onClick={() => onSelectItem && onSelectItem(relItem)}
                              className="font-bold text-sm text-slate-900 dark:text-slate-100 hover:text-blue-500 cursor-pointer transition-colors leading-snug"
                            >
                              {relItem.headline}
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                              {relItem.oneLineSummary || relItem.executiveSummary}
                            </p>
                          </div>

                          {/* Disruption Metric Comparison & Corridors */}
                          <div className={`p-2.5 rounded-lg flex flex-wrap items-center justify-between gap-3 text-xs font-mono ${
                            isDark ? 'bg-slate-900 border border-slate-800/80' : 'bg-slate-50 border border-slate-200'
                          }`}>
                            <div className="flex items-center gap-3">
                              {relItem.metrics?.transitDelayDays ? (
                                <span className="text-amber-500 font-bold">
                                  Delay: +{relItem.metrics.transitDelayDays}d
                                </span>
                              ) : null}
                              {relItem.metrics?.costIncreasePct ? (
                                <span className="text-rose-500 font-bold">
                                  Landed Cost: +{relItem.metrics.costIncreasePct}%
                                </span>
                              ) : null}
                              <span className="text-slate-400 font-sans">
                                Corridor: {relItem.regions?.join(', ') || 'Global'}
                              </span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2">
                              {onCreateVideoBrief && (
                                <button
                                  onClick={() => onCreateVideoBrief(relItem)}
                                  className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-semibold bg-rose-600 text-white hover:bg-rose-700 transition-colors"
                                  title="Generate fact-locked video brief script"
                                >
                                  <Clapperboard className="w-2.5 h-2.5" />
                                  <span>Brief</span>
                                </button>
                              )}

                              {onSelectItem && (
                                <button
                                  onClick={() => onSelectItem(relItem)}
                                  className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                >
                                  <span>Inspect Dossier</span>
                                  <ArrowRight className="w-2.5 h-2.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: PROCUREMENT IMPACT MATRIX */}
          {activeTab === 'procurement' && (
            <div className="space-y-5">
              {/* Departmental Impact Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(item.supplyChainImpact || {}).map(([key, val]) => (
                  <div
                    key={key}
                    className={`p-3.5 rounded-xl border ${
                      isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50/60 border-slate-200'
                    }`}
                  >
                    <div className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </div>
                    <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {val as string}
                    </div>
                  </div>
                ))}
              </div>

              {/* What Procurement Teams Should Watch */}
              <div className={`p-4 rounded-xl border ${
                isDark ? 'bg-amber-950/20 border-amber-800/60' : 'bg-amber-50/60 border-amber-200'
              }`}>
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4" />
                  <span>What Procurement Teams Should Watch</span>
                </div>
                <ul className="space-y-2">
                  {item.whatToWatch?.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-700 dark:text-slate-300 text-xs">
                      <span className="font-bold text-amber-500 mt-0.5">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-[10px] text-slate-400 mt-3 italic">
                  Note: Presented as informational considerations for enterprise risk teams, not statutory guarantees.
                </div>
              </div>

              {/* Button to run Deep Gemini Analysis */}
              <div className="pt-2 flex justify-center">
                <button
                  onClick={handleRunDeepAnalysis}
                  disabled={isLoadingAnalysis}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-md active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate AI Strategic Procurement Diagnosis</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: FACT VS ANALYSIS & SOURCE COVERAGE */}
          {activeTab === 'verification' && (
            <div className="space-y-5">
              {/* Fact vs Analysis separation (Requirement #21) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-xl border ${
                  isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-emerald-50/40 border-emerald-200'
                }`}>
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Verified Reported Facts</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                    {item.factVsAnalysis?.reportedFacts?.map((rf, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{rf}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`p-4 rounded-xl border ${
                  isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-blue-50/40 border-blue-200'
                }`}>
                  <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                    <span>AI Supply Chain Analysis</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                    {item.factVsAnalysis?.aiAnalysis?.map((ai, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-blue-500 font-bold">•</span>
                        <span>{ai}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Source Claims */}
              {item.factVsAnalysis?.sourceClaims?.length > 0 && (
                <div className={`p-3.5 rounded-xl border ${
                  isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Attributed Source Claims
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 italic">
                    {item.factVsAnalysis.sourceClaims.map((claim, idx) => (
                      <li key={idx}>"{claim}"</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Source Comparison Checklist (Requirement #61) */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Cross-Source Reporting Verification
                </h4>
                <div className={`p-4 rounded-xl border ${
                  isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center justify-between mb-3 text-xs font-mono text-slate-500">
                    <span>Primary Publisher: <strong className="text-slate-900 dark:text-slate-100">{item.source}</strong></span>
                    <span>Confidence: <strong className="text-emerald-600 font-bold">{item.confidence}</strong></span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { name: item.source, verified: true, primary: true },
                      ...(item.alsoReportedBy || []).map(s => ({ name: s.name, verified: true, primary: false }))
                    ].map((outlet, idx) => (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-lg border flex items-center justify-between ${
                          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                        }`}
                      >
                        <span className="text-xs font-medium truncate">{outlet.name}</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ml-1" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DEEP AI STRATEGIC DIAGNOSIS */}
          {activeTab === 'deepAI' && (
            <div className="space-y-4">
              {isLoadingAnalysis && (
                <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-500">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  <p className="text-xs font-mono">Running Gemini Strategic Procurement Diagnosis...</p>
                </div>
              )}

              {!isLoadingAnalysis && !deepAnalysis && (
                <div className="py-8 text-center">
                  <p className="text-xs text-slate-500 mb-4">
                    Trigger an advanced scenario assessment modeling lead-time drift, cost variance, safety stock, and a 3-phase action roadmap.
                  </p>
                  <button
                    onClick={handleRunDeepAnalysis}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs shadow-md"
                  >
                    Run Deep Analysis Now
                  </button>
                </div>
              )}

              {!isLoadingAnalysis && deepAnalysis && (
                <div className="space-y-4">
                  {/* Variance Estimates */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className={`p-3.5 rounded-xl border ${
                      isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-500" />
                        <span>Est. Lead Time Variance</span>
                      </div>
                      <div className="text-sm font-mono font-bold text-amber-500 mt-1">
                        {deepAnalysis.leadTimeVarianceEstimate}
                      </div>
                    </div>
                    <div className={`p-3.5 rounded-xl border ${
                      isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-rose-500" />
                        <span>Est. Landed Cost Variance</span>
                      </div>
                      <div className="text-sm font-mono font-bold text-rose-500 mt-1">
                        {deepAnalysis.costVarianceEstimate}
                      </div>
                    </div>
                    <div className={`p-3.5 rounded-xl border ${
                      isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-blue-500" />
                        <span>Inventory Safety Buffer</span>
                      </div>
                      <div className="text-sm font-mono font-bold text-blue-500 mt-1">
                        {deepAnalysis.inventoryBufferRecommendation}
                      </div>
                    </div>
                  </div>

                  {/* 3-Phase Action Roadmap */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      3-Phase CPO Action Matrix
                    </h4>
                    <div className="space-y-2">
                      {deepAnalysis.recommendedActionMatrix?.map((act: any, idx: number) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-xl border flex items-start gap-3 ${
                            isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 shrink-0">
                            {act.phase}
                          </span>
                          <span className="text-xs text-slate-700 dark:text-slate-300">{act.action}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Strategic Considerations */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Strategic Purchasing Directives
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                      {deepAnalysis.strategicProcurementConsiderations?.map((item: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-blue-500 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-950/60 text-xs">
          <div className="text-slate-500">
            Source URL: <span className="font-mono text-slate-400 truncate inline-block max-w-[280px] align-bottom">{item.sourceUrl}</span>
          </div>

          <div className="flex items-center gap-2">
            {onToggleQuickRead && (
              <button
                onClick={() => onToggleQuickRead(item)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-medium border transition-colors ${
                  isInQuickRead
                    ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/40 hover:bg-amber-500/30'
                    : isDark
                      ? 'border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-amber-300'
                      : 'border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-amber-700'
                }`}
                title={isInQuickRead ? 'In Quick Read stack (click to remove)' : 'Add to Quick Read stack for this session'}
              >
                <Zap className={`w-3.5 h-3.5 ${isInQuickRead ? 'fill-current text-amber-500' : 'text-slate-400'}`} />
                <span>{isInQuickRead ? 'In Stack' : '+ Quick Read'}</span>
              </button>
            )}

            {onToggleVideoCreated && (
              <button
                onClick={() => onToggleVideoCreated(item)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-medium border transition-colors ${
                  isVideoCreated
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30 font-semibold'
                    : isDark
                      ? 'border-slate-800 text-slate-300 hover:text-emerald-300 hover:border-emerald-800'
                      : 'border-slate-300 text-slate-700 hover:text-emerald-700 hover:border-emerald-300'
                }`}
                title={isVideoCreated ? `Video created on ${videoCreatedDate} (click to toggle)` : 'Mark as video created today'}
              >
                <CheckCircle2 className={`w-3.5 h-3.5 ${isVideoCreated ? 'text-emerald-500 fill-emerald-500/20' : 'text-slate-400'}`} />
                <span>{isVideoCreated ? `Created (${videoCreatedDate})` : 'Mark Created'}</span>
              </button>
            )}

            {onCreateVideoBrief && (
              <button
                onClick={() => {
                  onCreateVideoBrief(item);
                  onClose();
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-medium border transition-colors ${
                  isDark
                    ? 'border-rose-900/60 text-rose-300 hover:bg-rose-950/40 hover:border-rose-700'
                    : 'border-rose-200 text-rose-700 hover:bg-rose-50 hover:border-rose-300'
                }`}
              >
                <Clapperboard className="w-3.5 h-3.5 text-rose-500" />
                <span>Create Video Brief</span>
              </button>
            )}

            {onOpenMasterPrompt && (
              <button
                onClick={() => {
                  onOpenMasterPrompt(item);
                  onClose();
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-medium border transition-colors ${
                  isDark
                    ? 'border-purple-900/60 text-purple-300 hover:bg-purple-950/40 hover:border-purple-700'
                    : 'border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300'
                }`}
                title="Create a master detailed prompt for AI video generators (Sora, Runway, Kling, InVideo)"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                <span>Master Video Prompt</span>
              </button>
            )}

            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
            >
              <span>Read Original Article</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={onClose}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border transition-colors cursor-pointer ${
                isDark ? 'border-slate-800 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <X className="w-3.5 h-3.5" />
              <span>Close</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
