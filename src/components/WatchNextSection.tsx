import React from 'react';
import { Eye, Clock, ArrowRight, ShieldAlert, Building2, Factory } from 'lucide-react';
import { WatchNextItem } from '../types/news';

interface WatchNextSectionProps {
  watchNext: WatchNextItem[];
  isDark: boolean;
}

export const WatchNextSection: React.FC<WatchNextSectionProps> = ({
  watchNext,
  isDark,
}) => {
  return (
    <div className={`p-5 rounded-2xl border mb-6 transition-all ${
      isDark ? 'bg-slate-900/90 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-xs'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight">Watch Next 24–72 Hours</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              High-impact inflection points, scheduled regulatory rulings, and negotiation milestones based strictly on reported evidence
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
          <Clock className="w-3.5 h-3.5" />
          <span>Forward Horizon Watch</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-4">
        {watchNext.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
              isDark
                ? 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 inline-flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5 text-teal-500" />
                  <span>{item.timeframe}</span>
                </span>
                <span className="text-[10px] text-slate-400 truncate max-w-[120px] inline-flex items-center gap-1">
                  <Building2 className="w-2.5 h-2.5 opacity-60" />
                  <span>{item.supportingSource}</span>
                </span>
              </div>

              <h3 className="text-xs font-bold leading-snug mb-1.5 text-slate-900 dark:text-slate-100">
                {item.title}
              </h3>

              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                {item.expectedEvent}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Factory className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="font-semibold text-slate-600 dark:text-slate-300">Sectors: </span>
              <span className="truncate">{item.affectedSectors.join(' · ')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
