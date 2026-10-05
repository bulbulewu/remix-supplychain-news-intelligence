import React from 'react';
import {
  History,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  MapPin,
  Building2,
  Flame,
  CheckCircle2,
  Zap,
  Globe,
  Briefcase,
} from 'lucide-react';
import { WhatChanged } from '../types/news';

interface WhatChangedSectionProps {
  whatChanged: WhatChanged;
  isDark: boolean;
}

export const WhatChangedSection: React.FC<WhatChangedSectionProps> = ({
  whatChanged,
  isDark,
}) => {
  return (
    <div className={`p-5 rounded-2xl border mb-6 transition-all ${
      isDark ? 'bg-slate-900/90 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-xs'
    }`}>
      <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
          <History className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold tracking-tight">What Changed in the Last 24 Hours?</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Delta analysis highlighting escalating risks, new trade measures, and newly impacted industrial corridors
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        {/* New Major Events */}
        <div className={`p-4 rounded-xl border ${
          isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50/60 border-slate-200'
        }`}>
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>New Major Developments</span>
          </div>
          <ul className="space-y-2">
            {whatChanged.newMajorEvents.map((evt, idx) => (
              <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                <Zap className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                <span>{evt}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Escalated vs Weakened */}
        <div className={`p-4 rounded-xl border ${
          isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50/60 border-slate-200'
        }`}>
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Escalated Situations</span>
          </div>
          <ul className="space-y-2 mb-4">
            {whatChanged.escalatedEvents.map((evt, idx) => (
              <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                <Flame className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                <span>{evt}</span>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider pt-2 border-t border-slate-200 dark:border-slate-800">
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>Easing / Stabilizing Conditions</span>
          </div>
          <ul className="space-y-2">
            {whatChanged.weakenedEvents.map((evt, idx) => (
              <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>{evt}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Newly Impacted Countries & Industries */}
        <div className={`p-4 rounded-xl border ${
          isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50/60 border-slate-200'
        }`}>
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5" />
            <span>New Geographic Exposure</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {whatChanged.newCountriesAffected.map((country, idx) => (
              <span
                key={idx}
                className={`text-[11px] font-mono px-2 py-0.5 rounded border inline-flex items-center gap-1 ${
                  isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                <Globe className="w-3 h-3 text-purple-400" />
                <span>{country}</span>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider pt-2 border-t border-slate-200 dark:border-slate-800">
            <Building2 className="w-3.5 h-3.5" />
            <span>New Sector Exposure</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {whatChanged.newIndustriesAffected.map((ind, idx) => (
              <span
                key={idx}
                className={`text-[11px] font-mono px-2 py-0.5 rounded border inline-flex items-center gap-1 ${
                  isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                <Briefcase className="w-3 h-3 text-amber-500" />
                <span>{ind}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
