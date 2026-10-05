import React, { useEffect, useState } from 'react';
import { Loader2, Check, Search, Filter, Layers, ShieldCheck } from 'lucide-react';

interface SearchProgressIndicatorProps {
  isOpen: boolean;
  isDark: boolean;
}

export const SearchProgressIndicator: React.FC<SearchProgressIndicatorProps> = ({
  isOpen,
  isDark,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      return;
    }

    const t1 = setTimeout(() => setCurrentStep(1), 800);
    const t2 = setTimeout(() => setCurrentStep(2), 2200);
    const t3 = setTimeout(() => setCurrentStep(3), 3600);
    const t4 = setTimeout(() => setCurrentStep(4), 5000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const steps = [
    {
      label: 'Searching Global News Media & Industry Feeds',
      sub: 'Querying clusters: Supply Chain, Procurement, Logistics, Shipping, Trade, Commodities, Geopolitics',
      icon: Search,
    },
    {
      label: 'Extracting Grounding Chunks & Deduplicating Coverage',
      sub: 'Removing duplicate wire stories and resolving publisher canonical sources',
      icon: Filter,
    },
    {
      label: 'Clustering Related Events & Aligning Timelines',
      sub: 'Grouping multiple publisher articles into unified multi-source event clusters',
      icon: Layers,
    },
    {
      label: 'Executing 9-Factor Priority Scoring & Risk Radar Evaluation',
      sub: 'Assessing supply disruption scale, lead-time variance, and Bangladesh trade relevance',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className={`w-full max-w-lg p-6 rounded-2xl border shadow-2xl transition-all ${
          isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-blue-600 text-white animate-pulse">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
          <div>
            <h3 className="text-base font-bold tracking-tight">AI News Intelligence Discovery</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Broad English-language discovery across available reputable sources
            </p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          {steps.map((st, idx) => {
            const isDone = currentStep > idx;
            const isCurrent = currentStep === idx;
            const Icon = st.icon;

            return (
              <div
                key={idx}
                className={`p-3 rounded-xl border transition-all flex items-start gap-3 ${
                  isCurrent
                    ? isDark
                      ? 'bg-blue-950/40 border-blue-500/60'
                      : 'bg-blue-50/70 border-blue-300'
                    : isDone
                      ? isDark
                        ? 'bg-slate-950/40 border-slate-800 opacity-80'
                        : 'bg-slate-50/50 border-slate-200 opacity-80'
                      : isDark
                        ? 'bg-slate-950/20 border-slate-900 opacity-40'
                        : 'bg-slate-50/30 border-slate-100 opacity-40'
                }`}
              >
                <div className="shrink-0 mt-0.5">
                  {isDone ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </div>
                  ) : isCurrent ? (
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                      <Loader2 className="w-3 h-3 animate-spin" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center text-[10px] text-slate-400">
                      {idx + 1}
                    </div>
                  )}
                </div>

                <div>
                  <div className={`text-xs font-semibold ${isCurrent ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                    {st.label}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                    {st.sub}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-[11px] text-center text-slate-400 font-mono">
          Using Google Search Grounding with Gemini Intelligence
        </div>
      </div>
    </div>
  );
};
