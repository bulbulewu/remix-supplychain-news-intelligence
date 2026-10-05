import React from 'react';
import {
  X,
  ShieldCheck,
  HelpCircle,
  Layers,
  Briefcase,
  DollarSign,
  Zap,
  Globe,
  Building2,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { NewsItem } from '../types/news';

interface ScoreBreakdownModalProps {
  item: NewsItem | null;
  onClose: () => void;
  isDark: boolean;
}

export const ScoreBreakdownModal: React.FC<ScoreBreakdownModalProps> = ({
  item,
  onClose,
  isDark,
}) => {
  if (!item) return null;

  const b = item.scoreBreakdown || {
    supplyChainRelevance: 23,
    procurementImpact: 14,
    businessEconomicImpact: 13,
    urgency: 8,
    geographicImpact: 9,
    industryImpact: 9,
    sourceAuthority: 5,
    crossSourceConfirmation: 4,
    duration: 4,
    total: item.priorityScore || 89,
  };

  const factors = [
    {
      label: 'Supply Chain Relevance',
      score: b.supplyChainRelevance,
      max: 25,
      icon: Layers,
      color: 'text-blue-500',
      barColor: 'bg-blue-600',
      description: 'Measures direct disruption to production lines, shipping corridors, or warehouse inventory.',
    },
    {
      label: 'Procurement & Sourcing Impact',
      score: b.procurementImpact,
      max: 15,
      icon: Briefcase,
      color: 'text-indigo-500',
      barColor: 'bg-indigo-600',
      description: 'Evaluates direct price inflation, contractual force majeure risk, and BOM supplier qualification.',
    },
    {
      label: 'Business / Economic Impact',
      score: b.businessEconomicImpact,
      max: 15,
      icon: DollarSign,
      color: 'text-emerald-500',
      barColor: 'bg-emerald-600',
      description: 'Estimated financial magnitude, corporate EBITDA exposure, and macro trade flow disruption.',
    },
    {
      label: 'Urgency / Operational Immediacy',
      score: b.urgency,
      max: 10,
      icon: Zap,
      color: 'text-rose-500',
      barColor: 'bg-rose-600',
      description: 'Speed of propagation: requires immediate intervention (0-7 days) vs. long-term monitoring.',
    },
    {
      label: 'Geographic Impact Scale',
      score: b.geographicImpact,
      max: 10,
      icon: Globe,
      color: 'text-cyan-500',
      barColor: 'bg-cyan-600',
      description: 'Multi-corridor trade lane exposure across Asia, North America, Europe, and key transit straits.',
    },
    {
      label: 'Industry Cross-Exposure',
      score: b.industryImpact,
      max: 10,
      icon: Building2,
      color: 'text-purple-500',
      barColor: 'bg-purple-600',
      description: 'Number of critical verticals affected (Automotive, Semiconductors, Retail, Energy, Pharma).',
    },
    {
      label: 'Source Authority & Verification',
      score: b.sourceAuthority,
      max: 5,
      icon: ShieldCheck,
      color: 'text-teal-500',
      barColor: 'bg-teal-600',
      description: 'Credibility rating of primary reporting publisher, regulatory register, or maritime authority.',
    },
    {
      label: 'Cross-Source Independent Confirmation',
      score: b.crossSourceConfirmation,
      max: 5,
      icon: CheckCircle2,
      color: 'text-green-500',
      barColor: 'bg-green-600',
      description: 'Multiple tier-1 news bureaus independently confirming factual claims and operational data.',
    },
    {
      label: 'Potential Duration of Impact',
      score: b.duration,
      max: 5,
      icon: Clock,
      color: 'text-amber-500',
      barColor: 'bg-amber-600',
      description: 'Anticipated persistence of disruption (prolonged structural shift vs. transient 48h blip).',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className={`w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden transition-all ${
          isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold">Priority Score Breakdown</h3>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-bold">
                  {b.total} / 100 POINTS
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Transparent 9-factor multi-attribute ranking model
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 max-h-[75vh] overflow-y-auto space-y-4">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
            <div className="font-semibold text-slate-800 dark:text-slate-200 mb-0.5">Evaluating:</div>
            <div className="text-slate-600 dark:text-slate-400 font-medium">{item.headline}</div>
          </div>

          <div className="space-y-3">
            {factors.map((f, idx) => {
              const pct = (f.score / f.max) * 100;
              const FactorIcon = f.icon;
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border ${
                    isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50/50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold flex items-center gap-1.5">
                      <FactorIcon className={`w-3.5 h-3.5 ${f.color}`} />
                      <span>{f.label}</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                      {f.score} / {f.max} pts
                    </span>
                  </div>

                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-1.5">
                    <div
                      className={`h-full ${f.barColor} rounded-full transition-all duration-300`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                    {f.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60 text-xs">
          <span className="text-slate-500 font-mono flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
            <span>Weighted Total:</span>
            <strong className="text-slate-900 dark:text-slate-100">{b.total}/100</strong> ({item.priorityLevel})
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-medium flex items-center gap-1 hover:opacity-90 transition-opacity"
          >
            <X className="w-3.5 h-3.5" />
            <span>Close</span>
          </button>
        </div>
      </div>
    </div>
  );
};
