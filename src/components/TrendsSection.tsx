import React from 'react';
import { TrendingUp, Globe, Building2, Calendar, ShieldAlert, Newspaper, Clock, FileText } from 'lucide-react';
import { EmergingTrend } from '../types/news';
import { formatTimeAgo, getPriorityColor } from '../utils/formatters';

interface TrendsSectionProps {
  trends: EmergingTrend[];
  onSelectTrend?: (t: EmergingTrend) => void;
  isDark: boolean;
}

export const TrendsSection: React.FC<TrendsSectionProps> = ({
  trends,
  onSelectTrend,
  isDark,
}) => {
  return (
    <div className={`p-5 rounded-2xl border mb-6 transition-all ${
      isDark ? 'bg-slate-900/90 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-xs'
    }`}>
      <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold tracking-tight">Emerging Macro Supply Chain Trends</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            AI pattern detection clustering multi-story themes across international reporting
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        {trends.map((t) => {
          const priorityStyle = getPriorityColor(t.priority, isDark);
          return (
            <div
              key={t.id}
              onClick={() => onSelectTrend && onSelectTrend(t)}
              className={`p-4 rounded-xl border flex flex-col justify-between transition-all cursor-pointer group ${
                isDark
                  ? 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                  : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${priorityStyle.bg} ${priorityStyle.text}`}>
                    {t.priority}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 inline-flex items-center gap-1">
                    <FileText className="w-3 h-3 opacity-60" />
                    <span>{t.storyCount} related stories</span>
                  </span>
                </div>

                <h3 className="text-xs sm:text-sm font-bold leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                  {t.name}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  {t.summary}
                </p>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{t.countriesAffected.join(' · ')}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{t.industriesAffected.join(' · ')}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                  <span className="inline-flex items-center gap-1">
                    <Newspaper className="w-3 h-3 opacity-60" />
                    <span>{t.topSources.slice(0, 2).join(', ')}</span>
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3 h-3 opacity-60" />
                    <span>{formatTimeAgo(t.latestUpdate)}</span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
