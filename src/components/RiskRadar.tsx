import React from 'react';
import {
  Compass,
  AlertCircle,
  ArrowUpRight,
  Anchor,
  Building,
  Plane,
  Truck,
  Scale,
  Layers,
  Fuel,
  ShieldAlert,
  Users,
  AlertTriangle,
  Factory,
  Activity,
} from 'lucide-react';
import { RiskRadarCategory } from '../types/news';
import { getImpactBadge } from '../utils/formatters';

interface RiskRadarProps {
  categories: RiskRadarCategory[];
  onSelectCategory?: (categoryName: string) => void;
  isDark: boolean;
}

const getCategoryIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('maritime') || n.includes('shipping') || n.includes('ocean')) return Anchor;
  if (n.includes('port') || n.includes('terminal')) return Building;
  if (n.includes('air') || n.includes('aviation')) return Plane;
  if (n.includes('truck') || n.includes('land') || n.includes('logistics')) return Truck;
  if (n.includes('tariff') || n.includes('trade') || n.includes('policy')) return Scale;
  if (n.includes('material') || n.includes('mineral') || n.includes('commodity')) return Layers;
  if (n.includes('energy') || n.includes('fuel') || n.includes('oil')) return Fuel;
  if (n.includes('geopolitic') || n.includes('security') || n.includes('conflict')) return ShieldAlert;
  if (n.includes('labor') || n.includes('strike') || n.includes('union')) return Users;
  if (n.includes('supplier') || n.includes('insolvency') || n.includes('risk')) return AlertTriangle;
  if (n.includes('manufactur') || n.includes('plant')) return Factory;
  return Activity;
};

export const RiskRadar: React.FC<RiskRadarProps> = ({
  categories,
  onSelectCategory,
  isDark,
}) => {
  return (
    <div className={`p-5 rounded-2xl border mb-6 transition-all ${
      isDark ? 'bg-slate-900/90 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-xs'
    }`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight">Global Supply Chain Risk Radar</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              10-Vector systemic risk assessment synthesized from news frequency, impact scale, and carrier advisories
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Informational news-based indicator · Updated continuously</span>
        </div>
      </div>

      {/* Grid of 10 Risk Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 pt-4">
        {categories.map((cat) => {
          const badge = getImpactBadge(cat.level, isDark);
          const CatIcon = getCategoryIcon(cat.name);
          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory && onSelectCategory(cat.name)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer group ${
                isDark
                  ? 'bg-slate-950/60 border-slate-800/90 hover:border-blue-500/60 hover:bg-slate-800/40'
                  : 'bg-slate-50/70 border-slate-200/80 hover:border-blue-400 hover:bg-blue-50/30'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="text-xs font-semibold tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center gap-1.5">
                  <CatIcon className="w-3.5 h-3.5 text-blue-500 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="truncate">{cat.name}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </span>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold shrink-0 ${badge.bg} ${badge.text}`}>
                  {cat.level.toUpperCase()}
                </span>
              </div>

              {/* Score bar */}
              <div className="mb-2.5">
                <div className="flex items-center justify-between text-[11px] font-mono mb-1 text-slate-500 dark:text-slate-400">
                  <span>Risk Index</span>
                  <span className="font-bold">{cat.score}/100</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      cat.score >= 85
                        ? 'bg-rose-500'
                        : cat.score >= 70
                        ? 'bg-amber-500'
                        : cat.score >= 50
                        ? 'bg-blue-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${cat.score}%` }}
                  />
                </div>
              </div>

              {/* Driver & Key Indicator */}
              <div className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug line-clamp-2 mb-1.5 font-sans">
                {cat.driverEvent}
              </div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight italic truncate">
                {cat.keyIndicator}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
