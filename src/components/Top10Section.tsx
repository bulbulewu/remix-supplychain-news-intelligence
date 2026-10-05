import React, { useState } from 'react';
import {
  Zap,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Clapperboard,
  Sparkles,
  Check,
  FileText,
  Info,
  Layers,
  Building,
  Gauge,
} from 'lucide-react';
import { Top10Thing, NewsItem, VideoCreatedRecord } from '../types/news';

interface Top10SectionProps {
  top10: Top10Thing[];
  items: NewsItem[];
  onSelectStory: (item: NewsItem) => void;
  onCreateVideoBrief?: (item: NewsItem) => void;
  onOpenMasterPrompt?: (item: NewsItem) => void;
  videoCreatedMap?: Record<string, VideoCreatedRecord>;
  quickReadStack?: string[];
  onToggleQuickRead?: (item: NewsItem) => void;
  onToggleVideoCreated?: (item: NewsItem, duration?: string) => void;
  isDark: boolean;
}

export const Top10Section: React.FC<Top10SectionProps> = ({
  top10,
  items,
  onSelectStory,
  onCreateVideoBrief,
  onOpenMasterPrompt,
  videoCreatedMap = {},
  quickReadStack = [],
  onToggleQuickRead,
  onToggleVideoCreated,
  isDark,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'pending' | 'created'>('all');

  // Compute how many top 10 stories have had videos created
  const createdTop10Count = top10.filter((t) => {
    const matched = items.find((i) => i.id === t.newsItemId || i.headline === t.headline);
    return matched && videoCreatedMap[matched.id];
  }).length;

  const pendingTop10Count = top10.length - createdTop10Count;

  // Filter items if user selects Pending or Created filter
  const displayedTop10 = top10.filter((item) => {
    if (filterMode === 'all') return true;
    const matchingItem = items.find((i) => i.id === item.newsItemId || i.headline === item.headline);
    const isCreated = matchingItem ? Boolean(videoCreatedMap[matchingItem.id]) : false;
    if (filterMode === 'pending') return !isCreated;
    if (filterMode === 'created') return isCreated;
    return true;
  });

  const DURATIONS_AVAILABLE = ['30s', '1m', '3m', '5m'];

  return (
    <div
      className={`p-5 rounded-2xl border mb-6 transition-all ${
        isDark
          ? 'bg-slate-900/90 border-slate-800 text-slate-100'
          : 'bg-white border-slate-200 text-slate-900 shadow-xs'
      }`}
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold shrink-0">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-bold tracking-tight">Top 10 Things to Know Today</h2>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                  isDark ? 'bg-amber-950/80 text-amber-300 border border-amber-800/60' : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}
              >
                Executive Video Priority
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Top daily news topics to produce videos for across 30s, 1m, 3m & 5m formats
            </p>
          </div>
        </div>

        {/* Video Production Tracker Controls for Top 10 */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Progress Indicator */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">Production Progress:</span>
            <span
              className={`px-2.5 py-0.5 rounded-full font-bold text-xs border ${
                createdTop10Count === 10
                  ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/40'
                  : createdTop10Count > 0
                    ? 'bg-blue-500/20 text-blue-500 border-blue-500/40'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-300 dark:border-slate-700'
              }`}
            >
              {createdTop10Count} / {top10.length} Produced
            </span>
          </div>

          {/* Quick Filter: All vs Pending vs Created */}
          <div className="flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 ${
                filterMode === 'all'
                  ? isDark
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>All 10</span>
            </button>
            <button
              onClick={() => setFilterMode('pending')}
              className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 ${
                filterMode === 'pending'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title="Show only topics remaining for video creation"
            >
              <Clock className="w-3 h-3" />
              <span>Pending ({pendingTop10Count})</span>
            </button>
            <button
              onClick={() => setFilterMode('created')}
              className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 ${
                filterMode === 'created'
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title="Show topics where you have already created videos"
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>Created ({createdTop10Count})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Top 10 items */}
      {displayedTop10.length === 0 ? (
        <div className="text-center py-10 text-xs text-slate-500">
          No topics in this view.{' '}
          <button
            onClick={() => setFilterMode('all')}
            className="text-blue-500 font-semibold hover:underline ml-1"
          >
            Show All 10 Topics
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-4">
          {displayedTop10.map((item) => {
            const matchingItem = items.find(
              (i) => i.id === item.newsItemId || i.headline === item.headline
            );
            const videoRecord = matchingItem ? videoCreatedMap[matchingItem.id] : undefined;
            const isVideoCreated = Boolean(videoRecord);
            const isInQuickRead = matchingItem ? quickReadStack.includes(matchingItem.id) : false;

            // Determine which durations were marked for this topic
            const activeDurations = videoRecord?.durations || (videoRecord?.duration ? [videoRecord.duration] : []);

            return (
              <div
                key={item.rank}
                onClick={() => matchingItem && onSelectStory(matchingItem)}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between cursor-pointer group ${
                  isVideoCreated
                    ? isDark
                      ? 'bg-emerald-950/20 border-emerald-800/80 hover:border-emerald-500 shadow-xs ring-1 ring-emerald-500/20'
                      : 'bg-emerald-50/50 border-emerald-300 hover:border-emerald-500 shadow-xs ring-1 ring-emerald-500/20'
                    : isDark
                      ? 'bg-slate-950/50 border-slate-800/80 hover:border-blue-500/60 hover:bg-slate-800/40'
                      : 'bg-slate-50/60 border-slate-200/80 hover:border-blue-400 hover:bg-blue-50/20'
                }`}
              >
                <div>
                  {/* Top Bar of Card: Rank + Source + Video Created Badge + Priority Score */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Rank Index */}
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                          isVideoCreated
                            ? 'bg-emerald-500 text-slate-950 font-black'
                            : 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60'
                        }`}
                      >
                        #{String(item.rank).padStart(2, '0')}
                      </div>

                      <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Building className="w-3 h-3 opacity-60" />
                        <span>{item.source}</span>
                      </span>

                      {/* Prominent Video Created Badge with Date & Duration */}
                      {isVideoCreated ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 shadow-xs">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500 fill-emerald-500/20 shrink-0" />
                          <span>Video Created · {videoRecord?.formattedDate}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-slate-800/90 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/80">
                          <Clock className="w-2.5 h-2.5 text-amber-500" />
                          <span>Video Pending</span>
                        </span>
                      )}
                    </div>

                    {/* Score Badge */}
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded shrink-0 flex items-center gap-1 ${
                        item.priorityScore >= 90
                          ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60'
                          : 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60'
                      }`}
                    >
                      <Gauge className="w-2.5 h-2.5" />
                      <span>SCORE {item.priorityScore}</span>
                    </span>
                  </div>

                  {/* Headline */}
                  <h3 className="text-sm font-bold leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-1.5">
                    {item.headline}
                  </h3>

                  {/* Why it matters */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2 mb-3">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 inline-flex items-center gap-1">
                      <Info className="w-3 h-3 text-amber-500 shrink-0" />
                      <span>Why it matters:</span>
                    </span>{' '}
                    {item.whyItMatters}
                  </p>
                </div>

                {/* Card Action Footer with Duration Selection & Tools */}
                <div className="pt-2.5 border-t border-slate-200/70 dark:border-slate-800 flex flex-col gap-2 text-xs">
                  {/* Row 1: Duration Selectors: 30s, 1m, 3m, 5m */}
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex flex-wrap items-center justify-between gap-1.5 p-1.5 rounded-lg bg-slate-100/80 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-purple-500" />
                      <span>Produced Durations:</span>
                    </span>

                    <div className="flex items-center gap-1">
                      {DURATIONS_AVAILABLE.map((dur) => {
                        const isDurActive = activeDurations.includes(dur);
                        return (
                          <button
                            key={dur}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (matchingItem && onToggleVideoCreated) {
                                onToggleVideoCreated(matchingItem, dur);
                              }
                            }}
                            className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono transition-all flex items-center gap-1 ${
                              isDurActive
                                ? 'bg-emerald-600 text-white shadow-xs ring-1 ring-emerald-400'
                                : isDark
                                  ? 'bg-slate-900 border border-slate-700 text-slate-400 hover:text-emerald-400 hover:border-emerald-600'
                                  : 'bg-white border border-slate-300 text-slate-600 hover:text-emerald-600 hover:border-emerald-400 shadow-2xs'
                            }`}
                            title={
                              isDurActive
                                ? `Click to unmark ${dur} video`
                                : `Click to mark ${dur} video as created today`
                            }
                          >
                            {isDurActive && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            <span>{dur}</span>
                          </button>
                        );
                      })}

                      {/* General Toggle Button */}
                      {matchingItem && onToggleVideoCreated && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleVideoCreated(matchingItem);
                          }}
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors border ml-0.5 ${
                            isVideoCreated
                              ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/40'
                              : isDark
                                ? 'border-slate-700 text-slate-400 hover:text-emerald-300'
                                : 'border-slate-300 text-slate-600 hover:text-emerald-700'
                          }`}
                          title={
                            isVideoCreated
                              ? `All videos marked created on ${videoRecord?.formattedDate}`
                              : 'Mark as video created today'
                          }
                        >
                          {isVideoCreated ? 'Created ✓' : 'Mark All'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Analysis, Video Brief, Master Prompt & Quick Read */}
                  <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1">
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold text-[11px]">
                        <FileText className="w-3 h-3" />
                        <span>Analysis</span>
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </div>

                      {matchingItem && onCreateVideoBrief && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onCreateVideoBrief(matchingItem);
                          }}
                          className={`flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[11px] font-medium transition-colors ${
                            isDark
                              ? 'border-rose-900/60 text-rose-300 hover:bg-rose-950/40'
                              : 'border-rose-200 text-rose-700 hover:bg-rose-50'
                          }`}
                          title="Generate fact-checked video brief script"
                        >
                          <Clapperboard className="w-3 h-3 text-rose-500" />
                          <span>Brief</span>
                        </button>
                      )}

                      {matchingItem && onOpenMasterPrompt && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenMasterPrompt(matchingItem);
                          }}
                          className={`flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[11px] font-medium transition-colors ${
                            isDark
                              ? 'border-purple-900/60 text-purple-300 hover:bg-purple-950/40'
                              : 'border-purple-200 text-purple-700 hover:bg-purple-50'
                          }`}
                          title="Generate single detailed master video prompt (30s, 1m, 3m, 5m)"
                        >
                          <Sparkles className="w-3 h-3 text-purple-500" />
                          <span>Prompt</span>
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 ml-auto">
                      {matchingItem && onToggleQuickRead && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleQuickRead(matchingItem);
                          }}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-medium border transition-colors ${
                            isInQuickRead
                              ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/40'
                              : isDark
                                ? 'border-slate-800 text-slate-400 hover:text-amber-300'
                                : 'border-slate-300 text-slate-600 hover:text-amber-700'
                          }`}
                          title={isInQuickRead ? 'In Quick Read stack (click to remove)' : 'Add to Quick Read stack'}
                        >
                          <Zap className={`w-3 h-3 inline mr-0.5 ${isInQuickRead ? 'fill-current text-amber-500' : ''}`} />
                          <span>{isInQuickRead ? 'In Stack' : '+ Quick Read'}</span>
                        </button>
                      )}

                      {matchingItem?.sourceUrl && (
                        <a
                          href={matchingItem.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-[10px] ml-1"
                        >
                          <span>Source</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
