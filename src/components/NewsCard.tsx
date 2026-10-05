import React from 'react';
import {
  ExternalLink,
  Bookmark,
  Share2,
  ChevronRight,
  ShieldAlert,
  Info,
  Building,
  MapPin,
  TrendingUp,
  AlertTriangle,
  Clapperboard,
  Sparkles,
  CheckCircle2,
  Zap,
  Clock,
  Briefcase,
  DollarSign,
  Truck,
  FileText,
  Globe,
  Tag,
  Gauge,
  Newspaper,
} from 'lucide-react';
import { NewsItem, VideoCreatedRecord } from '../types/news';
import {
  formatTimeAgo,
  getPriorityColor,
  getImpactBadge,
  getCredibilityBadge
} from '../utils/formatters';

interface NewsCardProps {
  item: NewsItem;
  rank: number;
  onOpenAnalysis: (item: NewsItem) => void;
  onOpenScoreBreakdown: (item: NewsItem) => void;
  onCreateVideoBrief?: (item: NewsItem) => void;
  onOpenMasterPrompt?: (item: NewsItem) => void;
  onToggleBookmark: (id: string) => void;
  isBookmarked: boolean;
  isVideoCreated?: boolean;
  videoCreatedDate?: string;
  videoRecord?: VideoCreatedRecord;
  onToggleVideoCreated?: (item: NewsItem, duration?: string) => void;
  isInQuickRead?: boolean;
  onToggleQuickRead?: (item: NewsItem) => void;
  isDark: boolean;
}

export const NewsCard: React.FC<NewsCardProps> = ({
  item,
  rank,
  onOpenAnalysis,
  onOpenScoreBreakdown,
  onCreateVideoBrief,
  onOpenMasterPrompt,
  onToggleBookmark,
  isBookmarked,
  isVideoCreated = false,
  videoCreatedDate,
  videoRecord,
  onToggleVideoCreated,
  isInQuickRead = false,
  onToggleQuickRead,
  isDark,
}) => {
  const priorityStyle = getPriorityColor(item.priorityLevel, isDark);
  const activeDurations = videoRecord?.durations || (videoRecord?.duration ? [videoRecord.duration] : []);

  return (
    <article
      className={`p-5 rounded-2xl border transition-all ${
        isDark
          ? 'bg-slate-900/90 border-slate-800 text-slate-100 hover:border-slate-700'
          : 'bg-white border-slate-200 text-slate-900 shadow-xs hover:border-slate-300'
      }`}
    >
      {/* Top Kicker: Editorial Rank & Metadata (NO static pill boxes, clean typographic separators) */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100 dark:border-slate-800/80 text-xs">
        <div className="flex items-center gap-2">
          {/* Editorial Index Number */}
          <span className="font-mono font-bold text-sm text-slate-400 dark:text-slate-500">
            #{String(rank).padStart(2, '0')}
          </span>

          {/* Priority Level text indicator */}
          <span className={`font-mono text-xs font-semibold ${priorityStyle.text}`}>
            {item.priorityLevel}
          </span>

          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>

          {/* Priority Score with clickable trigger */}
          <button
            onClick={() => onOpenScoreBreakdown(item)}
            className="flex items-center gap-1 font-mono font-semibold text-xs hover:underline cursor-pointer text-slate-700 dark:text-slate-300"
            title="Click to view 9-factor transparent scoring breakdown"
          >
            <Gauge className="w-3 h-3 text-blue-500" />
            <span>Priority {item.priorityScore}/100</span>
            <Info className="w-3 h-3 text-slate-400" />
          </button>

          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>

          {/* Category & Region text */}
          <span className="text-slate-500 dark:text-slate-400 inline-flex items-center gap-1">
            <Tag className="w-3 h-3 opacity-60" />
            <span>{item.category}</span>
          </span>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
          <span className="text-slate-500 dark:text-slate-400 inline-flex items-center gap-1">
            <Globe className="w-3 h-3 opacity-60" />
            <span>{item.regions?.join(', ')}</span>
          </span>
        </div>

        {/* Source and Time */}
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
          <span className="font-medium text-slate-700 dark:text-slate-300 inline-flex items-center gap-1">
            <Building className="w-3 h-3 opacity-60" />
            <span>{item.source}</span>
          </span>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3 h-3 opacity-60" />
            <span>{formatTimeAgo(item.publishedAt)}</span>
          </span>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
          <span className="text-[11px] italic hidden sm:inline">{getCredibilityBadge(item.credibilityType)}</span>
        </div>
      </div>

      {/* Video Created Alert Badge if marked */}
      {isVideoCreated ? (
        <div className="flex flex-wrap items-center gap-2 mb-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500/20" />
            <span>Video Created · {videoCreatedDate}</span>
          </span>
          {activeDurations.map((dur: string) => (
            <span
              key={dur}
              className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-600 text-white shadow-2xs"
            >
              ✓ {dur}
            </span>
          ))}
          <span className="text-[11px] text-slate-400">Worked on this topic</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 mb-2.5">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            <Clock className="w-3 h-3 text-amber-500" />
            <span>Video Pending</span>
          </span>
        </div>
      )}

      {/* Main Headline (CLICKABLE directly to original source!) */}
      <h3 className="text-base sm:text-lg font-bold tracking-tight leading-snug mb-2.5">
        <a
          href={item.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors inline-flex items-baseline gap-1.5 group"
        >
          <span>{item.headline}</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400 opacity-60 group-hover:opacity-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 shrink-0 self-center" />
        </a>
      </h3>

      {/* 1-Line AI Summary (approx 25 words) */}
      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
        {item.oneLineSummary}
      </p>

      {/* Why This Ranked High (2-4 concise bullets) */}
      <div className={`p-3.5 rounded-xl border mb-4 ${
        isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50/80 border-slate-200/80'
      }`}>
        <div className="flex items-center justify-between mb-1.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-blue-500" />
            <span>Why This Ranked Top News</span>
          </div>
          <button
            onClick={() => onOpenScoreBreakdown(item)}
            className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline font-mono inline-flex items-center gap-1"
          >
            <span>Score Breakdown</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
          {item.whyImportant?.slice(0, 4).map((bullet, idx) => (
            <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
              <span className="text-blue-500 font-bold shrink-0">•</span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Supply Chain Impact Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-4 pt-1">
        {[
          { label: 'Procurement', level: item.impactRatings?.procurementImpact || 'High', icon: Briefcase },
          { label: 'Supply Risk', level: item.impactRatings?.supplyRisk || 'Critical', icon: AlertTriangle },
          { label: 'Lead Time', level: item.impactRatings?.leadTimeRisk || 'High', icon: Clock },
          { label: 'Cost Impact', level: item.impactRatings?.costImpact || 'Medium', icon: DollarSign },
          { label: 'Logistics', level: item.impactRatings?.logisticsImpact || 'Critical', icon: Truck },
          { label: 'Supplier Risk', level: item.impactRatings?.supplierImpact || 'Medium', icon: ShieldAlert },
        ].map((impact, idx) => {
          const badge = getImpactBadge(impact.level, isDark);
          const ImpactIcon = impact.icon;
          return (
            <div
              key={idx}
              className={`p-2 rounded-lg border text-center ${
                isDark ? 'bg-slate-950/40 border-slate-800/80' : 'bg-slate-50/50 border-slate-200/60'
              }`}
            >
              <div className="text-[10px] text-slate-400 font-medium mb-0.5 flex items-center justify-center gap-1">
                <ImpactIcon className="w-2.5 h-2.5 opacity-75" />
                <span>{impact.label}</span>
              </div>
              <div className={`text-[10px] font-mono font-bold ${badge.text}`}>
                {impact.level.toUpperCase()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bangladesh Sourcing Impact Callout if applicable */}
      {item.bangladeshImpact && (
        <div className={`p-2.5 rounded-lg border mb-4 flex items-start gap-2.5 ${
          item.bangladeshImpact.level === 'Critical' || item.bangladeshImpact.level === 'High'
            ? isDark
              ? 'bg-amber-950/20 border-amber-800/50 text-amber-200'
              : 'bg-amber-50/70 border-amber-200 text-amber-900'
            : isDark
              ? 'bg-slate-950/30 border-slate-800 text-slate-300'
              : 'bg-slate-50 border-slate-200 text-slate-700'
        }`}>
          <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold">Bangladesh Relevance ({item.bangladeshImpact.level.toUpperCase()}): </span>
            <span>{item.bangladeshImpact.rationale}</span>
            {item.bangladeshImpact.sectorsAffected?.length > 0 && (
              <span className="block mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                Key sectors: {item.bangladeshImpact.sectorsAffected.join(' · ')}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Story Deduplication & Additional Reporting (Also reported by:) */}
      {item.alsoReportedBy && item.alsoReportedBy.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-4 font-sans">
          <span className="font-semibold text-slate-600 dark:text-slate-300 inline-flex items-center gap-1">
            <Newspaper className="w-3.5 h-3.5 text-blue-500" />
            <span>Also reported by:</span>
          </span>
          {item.alsoReportedBy.map((src, sIdx) => (
            <React.Fragment key={sIdx}>
              {sIdx > 0 && <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>}
              <a
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline"
              >
                {src.name}
              </a>
            </React.Fragment>
          ))}
          <span className="text-[10px] text-slate-400">({item.alsoReportedBy.length + 1} independent outlets)</span>
        </div>
      )}

      {/* Bottom Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          {/* Read Original Article Button */}
          <a
            href={item.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 rounded-lg transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Read Original Article</span>
          </a>

          {/* View Full Analysis Modal Button */}
          <button
            onClick={() => onOpenAnalysis(item)}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-lg border transition-colors cursor-pointer ${
              isDark
                ? 'border-slate-700 text-slate-200 hover:bg-slate-800'
                : 'border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-blue-500" />
            <span>View Full Analysis</span>
            <ChevronRight className="w-3 h-3 opacity-60" />
          </button>

          {/* Create Video Brief Button */}
          <button
            onClick={() => onCreateVideoBrief && onCreateVideoBrief(item)}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-lg border transition-colors ${
              isDark
                ? 'border-rose-900/60 text-rose-300 hover:bg-rose-950/40 hover:border-rose-800'
                : 'border-rose-200 text-rose-700 hover:bg-rose-50 hover:border-rose-300'
            }`}
            title="Generate fact-checked, source-grounded video summary and script"
          >
            <Clapperboard className="w-3.5 h-3.5 text-rose-500" />
            <span>Create Video Brief</span>
          </button>

          {/* Master Video Prompt Button */}
          {onOpenMasterPrompt && (
            <button
              onClick={() => onOpenMasterPrompt(item)}
              className={`flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-lg border transition-colors ${
                isDark
                  ? 'border-purple-900/60 text-purple-300 hover:bg-purple-950/40 hover:border-purple-800'
                  : 'border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300'
              }`}
              title="Create a master detailed prompt for AI video generators (Sora, Runway, Kling, InVideo)"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              <span>Master Video Prompt</span>
            </button>
          )}

          {/* Quick Read Stack Button */}
          {onToggleQuickRead && (
            <button
              onClick={() => onToggleQuickRead(item)}
              className={`flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-lg border transition-colors ${
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

          {/* Mark as Video Created & Duration Quick Selectors */}
          {onToggleVideoCreated && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onToggleVideoCreated(item)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 font-medium rounded-lg border transition-colors ${
                  isVideoCreated
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30 font-semibold'
                    : isDark
                      ? 'border-slate-800 text-slate-400 hover:text-emerald-300 hover:border-emerald-800'
                      : 'border-slate-300 text-slate-600 hover:text-emerald-700 hover:border-emerald-300'
                }`}
                title={isVideoCreated ? `Video created on ${videoCreatedDate} (click to unmark)` : 'Mark as video created with today\'s date'}
              >
                <CheckCircle2 className={`w-3.5 h-3.5 ${isVideoCreated ? 'text-emerald-500 fill-emerald-500/20' : 'text-slate-400'}`} />
                <span>{isVideoCreated ? `Created` : 'Mark Created'}</span>
              </button>

              {/* Quick Duration Buttons: 30s, 1m, 3m, 5m */}
              {['30s', '1m', '3m', '5m'].map((dur) => {
                const isDurActive = activeDurations.includes(dur);
                return (
                  <button
                    key={dur}
                    onClick={() => onToggleVideoCreated(item, dur)}
                    className={`px-1.5 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                      isDurActive
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : isDark
                          ? 'border border-slate-800 text-slate-400 hover:text-emerald-300 hover:border-emerald-800'
                          : 'border border-slate-300 text-slate-600 hover:text-emerald-700 hover:border-emerald-300'
                    }`}
                    title={isDurActive ? `Unmark ${dur} video` : `Mark ${dur} video as created`}
                  >
                    {isDurActive ? `✓${dur}` : dur}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Save / Bookmark Button */}
          <button
            onClick={() => onToggleBookmark(item.id)}
            className={`p-2 rounded-lg border transition-colors flex items-center gap-1 ${
              isBookmarked
                ? 'bg-amber-500 text-white border-amber-600'
                : isDark
                  ? 'border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title={isBookmarked ? 'Saved to bookmarks' : 'Save article'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
            <span className="hidden sm:inline">{isBookmarked ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>
    </article>
  );
};
