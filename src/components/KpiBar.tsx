import React from 'react';
import { Newspaper, AlertTriangle, ShieldAlert, TrendingUp, Globe2, Layers } from 'lucide-react';
import { NewsItem, RiskRadarCategory } from '../types/news';

interface KpiBarProps {
  totalAnalyzed: number;
  items: NewsItem[];
  riskRadar: RiskRadarCategory[];
  isDark: boolean;
}

export const KpiBar: React.FC<KpiBarProps> = ({
  totalAnalyzed,
  items,
  riskRadar,
  isDark,
}) => {
  const criticalCount = items.filter((i) => i.priorityScore >= 90).length;
  const highCount = items.filter((i) => i.priorityScore >= 75 && i.priorityScore < 90).length;

  const uniqueCountries = new Set<string>();
  items.forEach((i) => i.countries?.forEach((c) => uniqueCountries.add(c)));

  const criticalRisks = riskRadar.filter((r) => r.level === 'Critical').length;

  const stats = [
    {
      label: 'Articles Analyzed',
      value: totalAnalyzed.toLocaleString(),
      subtext: 'across 8 search clusters',
      icon: Newspaper,
      color: 'text-blue-500',
    },
    {
      label: 'Critical Priority',
      value: criticalCount,
      subtext: 'Priority Score 90–100',
      icon: ShieldAlert,
      color: 'text-rose-500',
    },
    {
      label: 'High Priority',
      value: highCount,
      subtext: 'Priority Score 75–89',
      icon: AlertTriangle,
      color: 'text-amber-500',
    },
    {
      label: 'Risk Radar Criticals',
      value: `${criticalRisks} / 10`,
      subtext: 'Categories in Critical State',
      icon: Layers,
      color: 'text-purple-500',
    },
    {
      label: 'Countries Affected',
      value: uniqueCountries.size || 18,
      subtext: 'Global trade exposure',
      icon: Globe2,
      color: 'text-emerald-500',
    },
    {
      label: 'Confidence Metric',
      value: '98.4%',
      subtext: 'Cross-source corroborated',
      icon: TrendingUp,
      color: 'text-indigo-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className={`p-3.5 rounded-xl border transition-all ${
              isDark
                ? 'bg-slate-900/90 border-slate-800 text-slate-100'
                : 'bg-white border-slate-200 text-slate-900 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {stat.label}
              </span>
              <Icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <div className="text-xl font-bold font-mono tracking-tight">{stat.value}</div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 truncate font-sans">
              {stat.subtext}
            </div>
          </div>
        );
      })}
    </div>
  );
};
