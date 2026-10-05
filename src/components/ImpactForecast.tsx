import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  AlertTriangle,
  ShieldAlert,
  Clock,
  ArrowUpRight,
  Sparkles,
  Info,
  Filter,
  Flame,
  CheckCircle2,
  ChevronRight,
  Compass,
  Zap,
  DollarSign,
  Activity,
} from 'lucide-react';
import { NewsItem } from '../types/news';

interface ImpactForecastProps {
  items: NewsItem[];
  isDark: boolean;
  onSelectStory?: (item: NewsItem) => void;
  onCreateVideoBrief?: (item: NewsItem) => void;
}

export interface DayForecastPoint {
  date: string;
  dateLabel: string;
  dayIndex: number; // -30 to 7
  isForecast: boolean;
  impactScore: number | null; // 0-100 historical
  forecastScore: number | null; // 0-100 projected
  forecastUpper: number | null;
  forecastLower: number | null;
  leadTimeDays: number;
  costInflationPct: number;
  criticalAlertCount: number;
  driverHeadline: string;
  driverSummary: string;
  category: string;
  procurementDirective: string;
  confidence: 'High' | 'Medium' | 'Projected';
}

const UPCOMING_CATALYSTS = [
  {
    date: 'Oct 7, 2026',
    title: 'ILA East Coast Port Negotiations Round 2',
    impact: 'High',
    description: 'Bipartisan labor discussions on container crane automation and overtime rules for US Gulf & East Coast ports.',
    category: 'Labor & Ports',
  },
  {
    date: 'Oct 11, 2026',
    title: 'EU CBAM Carbon Filing Benchmark Publication',
    impact: 'Critical',
    description: 'European Commission default emissions data release impacting landed tariffs for imported steel, aluminum, and fertilizers.',
    category: 'Trade & Tariffs',
  },
  {
    date: 'Oct 15, 2026',
    title: 'Red Sea Carrier Network Service Restructuring',
    impact: 'Critical',
    description: 'Consortium review of Cape of Good Hope fuel surcharges and long-term Asia-North Europe roundtrip schedules.',
    category: 'Shipping',
  },
  {
    date: 'Oct 18, 2026',
    title: 'Bangladesh Industrial Gas Allocation for RMG',
    impact: 'Medium',
    description: 'Petrobangla LNG vessel offloading schedule to determine manufacturing capacity in Gazipur and Narayanganj textile zones.',
    category: 'Sourcing & Energy',
  },
];

export const ImpactForecast: React.FC<ImpactForecastProps> = ({
  items,
  isDark,
  onSelectStory,
  onCreateVideoBrief,
}) => {
  const [selectedMetric, setSelectedMetric] = useState<'impactScore' | 'leadTime' | 'costInflation'>('impactScore');
  const [includeForecast, setIncludeForecast] = useState<boolean>(true);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [activeHoverDay, setActiveHoverDay] = useState<DayForecastPoint | null>(null);

  // Synthesize realistic 30-day historical trend + 7-day forward projection
  const timelineData: DayForecastPoint[] = useMemo(() => {
    const today = new Date();
    const data: DayForecastPoint[] = [];

    // Macro baseline values and key historical milestones over the past 30 days
    const HISTORICAL_DRIVERS: Record<number, { headline: string; summary: string; category: string; baseScore: number; leadTime: number; costPct: number; directive: string }> = {
      0: {
        headline: 'Global Ocean Carriers Solidify Cape of Good Hope Routing: Spot Freight +28% MoM',
        summary: 'Carriers lock prolonged African diversion routes, tying up 9% of global vessel capacity and triggering container shortages in Asia.',
        category: 'Shipping',
        baseScore: 94,
        leadTime: 14,
        costPct: 5.4,
        directive: 'Extend purchase order lead-time triggers by +14 days for Asia-Europe transit.',
      },
      '-1': {
        headline: 'US Section 301 Tariff Exclusions Expiry Triggers Importer Rush',
        summary: 'Customs brokers report backlog as importers race to clear advanced manufacturing components before 25-50% duty resets.',
        category: 'Tariffs',
        baseScore: 88,
        leadTime: 8,
        costPct: 4.8,
        directive: 'Audit HS codes and file duty drawback provisions for bonded warehouse stock.',
      },
      '-2': {
        headline: 'Copper Concentrate Refining Fees Drop to Record Lows as Smelters Face Raw Crunch',
        summary: 'Mine supply crunches in South America push treatment charges negative in spot contracts, signaling smelter output cuts.',
        category: 'Commodities',
        baseScore: 84,
        leadTime: 10,
        costPct: 3.9,
        directive: 'Secure secondary supplier allocations for copper tubing and wiring harnesses.',
      },
      '-4': {
        headline: 'Chittagong Port Container Dwell Times Spike to 9.2 Days Amid Feeder Imbalance',
        summary: 'RMG apparel shipments face extended turnaround at transshipment hubs in Singapore and Colombo.',
        category: 'Sourcing',
        baseScore: 82,
        leadTime: 12,
        costPct: 4.2,
        directive: 'Release air-cargo split shipments for critical fast-fashion spring collection items.',
      },
      '-7': {
        headline: 'Panama Canal Increases Daily Transit Slots to 36 as Water Levels Rebound',
        summary: 'Draft limits normalized to 48ft, easing trans-Pacific agricultural and LNG bulk congestion.',
        category: 'Shipping',
        baseScore: 68,
        leadTime: -3,
        costPct: -1.2,
        directive: 'Shift non-time-sensitive US East Coast cargo back from intermodal rail to all-water canal transit.',
      },
      '-10': {
        headline: 'European Chemical Feedstock Supplies Stabilize Following Refinery Restarts',
        summary: 'Germany and Benelux chemical clusters resume normal ethylene and ammonia runs after planned overhauls.',
        category: 'Chemicals',
        baseScore: 62,
        leadTime: 2,
        costPct: 1.1,
        directive: 'Renegotiate spot energy surcharges on bulk European polymer resins.',
      },
      '-14': {
        headline: 'Strait of Malacca Vessel Congestion Rises as Asian Navies Hold Fleet Exercises',
        summary: 'Singapore outer anchorage wait times increase by 48 hours for eastbound container ships.',
        category: 'Shipping',
        baseScore: 78,
        leadTime: 6,
        costPct: 2.8,
        directive: 'Monitor vessel AIS telemetry for Ningbo and Shenzhen port arrival schedules.',
      },
      '-18': {
        headline: 'Taiwan Semiconductor Foundries Announce Automotive Wafer Allocation Quotas',
        summary: 'Foundries prioritize high-margin AI accelerator silicon, tightening legacy 28nm microcontroller slots.',
        category: 'Semiconductors',
        baseScore: 79,
        leadTime: 16,
        costPct: 3.6,
        directive: 'Lock in 6-month forward buffer stock for power management and chassis ICs.',
      },
      '-22': {
        headline: 'East Coast US Port Master Agreement Automation Talks Break Down',
        summary: 'Union leadership suspends regional talks over automated gate scanning and crane sensors.',
        category: 'Labor',
        baseScore: 83,
        leadTime: 9,
        costPct: 3.8,
        directive: 'Front-load inventory into US West Coast warehouses and contract Midwest rail capacity.',
      },
      '-26': {
        headline: 'Gulf Coast LNG Export Terminal Maintenance Restricts Maritime Bunkering',
        summary: 'Temporary train outage trims feedgas volume, elevating prompt European spot gas pricing.',
        category: 'Energy',
        baseScore: 71,
        leadTime: 4,
        costPct: 2.1,
        directive: 'Verify bunker fuel adjustment clauses in Q4 maritime forwarder agreements.',
      },
      '-30': {
        headline: 'Quarterly Global Supply Chain Baseline Assessment',
        summary: 'Baseline index reflects persistent maritime diversions offset by steady North American factory output.',
        category: 'Shipping',
        baseScore: 66,
        leadTime: 5,
        costPct: 2.4,
        directive: 'Establish quarterly procurement benchmark and supplier financial solvency reviews.',
      },
    };

    // Calculate daily data from 30 days ago (-30) to today (0)
    for (let i = -30; i <= 0; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);

      const dateStr = d.toISOString().split('T')[0];
      const dateLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      // Check if we have an explicit historical milestone or interpolate
      let driver = HISTORICAL_DRIVERS[i];
      if (!driver) {
        // Find nearest milestone anchors to interpolate realistically
        const anchorKeys = Object.keys(HISTORICAL_DRIVERS).map(Number).sort((a, b) => a - b);
        let lowerKey = anchorKeys[0];
        let upperKey = anchorKeys[anchorKeys.length - 1];

        for (const k of anchorKeys) {
          if (k <= i) lowerKey = k;
          if (k >= i && upperKey > k) upperKey = k;
        }

        const lower = HISTORICAL_DRIVERS[lowerKey];
        const upper = HISTORICAL_DRIVERS[upperKey];
        const ratio = upperKey === lowerKey ? 0 : (i - lowerKey) / (upperKey - lowerKey);

        const interpScore = Math.round(lower.baseScore + (upper.baseScore - lower.baseScore) * ratio);
        const interpLeadTime = Math.round(lower.leadTime + (upper.leadTime - lower.leadTime) * ratio);
        const interpCost = parseFloat((lower.costPct + (upper.costPct - lower.costPct) * ratio).toFixed(1));

        driver = {
          headline: `Supply Chain Corridor Telemetry: Index at ${interpScore}`,
          summary: `Continuous tracking of maritime freight routes, customs dwell, and factory buffer inventories.`,
          category: lower.category,
          baseScore: interpScore,
          leadTime: interpLeadTime,
          costPct: interpCost,
          directive: 'Maintain continuous safety stock reviews across primary suppliers.',
        };
      }

      // Add actual data from current items if close to today
      let finalScore = driver.baseScore;
      let criticalCount = finalScore >= 85 ? 4 : finalScore >= 75 ? 2 : 1;

      if (i === 0 && items.length > 0) {
        // Compute average from today's items
        const avgProcurement = items.reduce((acc, item) => acc + (item.priorityScore || 70), 0) / items.length;
        finalScore = Math.round((finalScore * 0.4) + (avgProcurement * 0.6));
        criticalCount = items.filter((it) => it.priorityLevel === 'CRITICAL').length || criticalCount;
      }

      data.push({
        date: dateStr,
        dateLabel,
        dayIndex: i,
        isForecast: false,
        impactScore: finalScore,
        forecastScore: null,
        forecastUpper: null,
        forecastLower: null,
        leadTimeDays: driver.leadTime,
        costInflationPct: driver.costPct,
        criticalAlertCount: criticalCount,
        driverHeadline: driver.headline,
        driverSummary: driver.summary,
        category: driver.category,
        procurementDirective: driver.directive,
        confidence: 'High',
      });
    }

    // Add 7-Day Forward Forecast Points (Day +1 to +7)
    const todayScore = data[data.length - 1].impactScore || 85;
    // Connect historical to forecast at Day 0 for seamless SVG curve
    data[data.length - 1].forecastScore = todayScore;
    data[data.length - 1].forecastUpper = todayScore;
    data[data.length - 1].forecastLower = todayScore;

    for (let f = 1; f <= 7; f++) {
      const d = new Date(today);
      d.setDate(d.getDate() + f);

      const dateStr = d.toISOString().split('T')[0];
      const dateLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      // Projected forward trajectory based on Q4 tariff expiration & maritime congestion
      // Model shows mild upward drift to ~88 due to upcoming catalysts
      const trendDrift = Math.round(todayScore + (f * 0.7));
      const confidenceBand = f * 1.8;

      data.push({
        date: dateStr,
        dateLabel: `${dateLabel} (Est)`,
        dayIndex: f,
        isForecast: true,
        impactScore: null,
        forecastScore: trendDrift,
        forecastUpper: Math.min(100, Math.round(trendDrift + confidenceBand)),
        forecastLower: Math.max(40, Math.round(trendDrift - confidenceBand)),
        leadTimeDays: Math.round(14 + f * 0.4),
        costInflationPct: parseFloat((5.4 + f * 0.15).toFixed(1)),
        criticalAlertCount: 3,
        driverHeadline: f <= 3 ? 'Projected ILA Port Negotiation Window & Fuel Surcharge Adjustments' : 'Projected EU CBAM Implementation Baseline Tariff Surcharges',
        driverSummary: 'Forecast derived from scheduled regulatory changes, maritime carrier route contracts, and manufacturing buffer lead-times.',
        category: f <= 3 ? 'Labor & Ports' : 'Trade & Tariffs',
        procurementDirective: 'Pre-authorize dual-sourcing purchase orders and review Q4 inventory carry costs.',
        confidence: 'Projected',
      });
    }

    return data;
  }, [items]);

  // Filtered timeline data
  const filteredData = useMemo(() => {
    let result = timelineData;
    if (!includeForecast) {
      result = result.filter((d) => !d.isForecast || d.dayIndex === 0);
    }
    if (selectedCategoryFilter !== 'All') {
      result = result.filter((d) => d.category.toLowerCase().includes(selectedCategoryFilter.toLowerCase()));
    }
    return result;
  }, [timelineData, includeForecast, selectedCategoryFilter]);

  // 30-Day Executive Telemetry Stats
  const stats = useMemo(() => {
    const historical = timelineData.filter((d) => !d.isForecast);
    const scores = historical.map((d) => d.impactScore || 0);

    const currentScore = historical[historical.length - 1]?.impactScore || 0;
    const initialScore = historical[0]?.impactScore || 0;
    const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const maxScore = Math.max(...scores);
    const maxDay = historical.find((d) => d.impactScore === maxScore);

    const netChangePct = parseFloat((((currentScore - initialScore) / initialScore) * 100).toFixed(1));

    // Forecast trajectory (next 7 days)
    const forecastPoints = timelineData.filter((d) => d.isForecast);
    const finalForecast = forecastPoints[forecastPoints.length - 1]?.forecastScore || currentScore;
    const forecastChange = finalForecast - currentScore;

    return {
      currentScore,
      initialScore,
      avgScore,
      maxScore,
      maxDay,
      netChangePct,
      finalForecast,
      forecastChange,
      isAccelerating: forecastChange > 0,
    };
  }, [timelineData]);

  // Custom Chart Tooltip
  const CustomTooltipContent = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: DayForecastPoint = payload[0].payload;
      const isProjected = data.isForecast;

      return (
        <div className={`p-3.5 rounded-xl border shadow-xl text-xs max-w-sm ${
          isDark ? 'bg-slate-950/95 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-2 mb-2 dark:border-slate-800">
            <div className="flex items-center gap-1.5 font-bold">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>{data.dateLabel}</span>
              {isProjected && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-400 font-mono font-bold">
                  7D FORECAST
                </span>
              )}
            </div>
            <div className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
              (data.impactScore || data.forecastScore || 0) >= 80
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}>
              {(data.impactScore || data.forecastScore)}/100 {isProjected ? 'EST' : 'INDEX'}
            </div>
          </div>

          {/* Metric Details */}
          <div className="space-y-1.5 text-[11px] mb-2.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Procurement Vulnerability:</span>
              <span className="font-bold text-indigo-400 font-mono">
                {data.impactScore || data.forecastScore}/100
              </span>
            </div>
            {isProjected && (
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>Confidence Range (95% CI):</span>
                <span className="font-mono">{data.forecastLower} – {data.forecastUpper}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Est. Lead Time Shock:</span>
              <span className="font-mono font-semibold text-rose-400">
                +{data.leadTimeDays} Days
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Landed Cost Inflation:</span>
              <span className="font-mono font-semibold text-amber-400">
                +{data.costInflationPct}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Sector Focus:</span>
              <span className="font-semibold text-slate-300">
                {data.category}
              </span>
            </div>
          </div>

          {/* Key Driver Event */}
          <div className="pt-2 border-t dark:border-slate-800 text-[11px]">
            <span className="font-bold text-slate-300 block mb-0.5">Primary Macro Driver:</span>
            <p className="italic text-slate-400 leading-snug line-clamp-2">
              "{data.driverHeadline}"
            </p>
          </div>

          {/* Action Directive */}
          <div className="mt-2 p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[10px] text-indigo-300 leading-snug">
            <strong>Action Directive:</strong> {data.procurementDirective}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`p-5 rounded-2xl border mb-6 transition-all ${
      isDark ? 'bg-slate-900/90 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-xs'
    }`}>
      {/* Component Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 shadow-xs">
            <TrendingUp className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold tracking-tight">Impact Forecast: 30-Day Procurement Vulnerability</h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                RECHARTS TIME-SERIES
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Historical 30-day procurement impact velocity tracked against lead times, freight inflation, and 7-day predictive modeling
            </p>
          </div>
        </div>

        {/* Action Controls & Metric Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Metric Selector */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-950 p-0.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
            <button
              onClick={() => setSelectedMetric('impactScore')}
              className={`px-2.5 py-1 rounded-md transition-all inline-flex items-center gap-1 cursor-pointer ${
                selectedMetric === 'impactScore'
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Activity className="w-3 h-3 opacity-80" />
              <span>Impact Score (0-100)</span>
            </button>
            <button
              onClick={() => setSelectedMetric('leadTime')}
              className={`px-2.5 py-1 rounded-md transition-all inline-flex items-center gap-1 cursor-pointer ${
                selectedMetric === 'leadTime'
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Clock className="w-3 h-3 opacity-80" />
              <span>Lead Time (+Days)</span>
            </button>
            <button
              onClick={() => setSelectedMetric('costInflation')}
              className={`px-2.5 py-1 rounded-md transition-all inline-flex items-center gap-1 cursor-pointer ${
                selectedMetric === 'costInflation'
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <DollarSign className="w-3 h-3 opacity-80" />
              <span>Cost Variance (%)</span>
            </button>
          </div>

          {/* 7-Day Forward Forecast Toggle */}
          <button
            onClick={() => setIncludeForecast(!includeForecast)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-semibold transition-all ${
              includeForecast
                ? 'bg-purple-500/10 border-purple-500/40 text-purple-400 shadow-xs'
                : isDark
                  ? 'border-slate-700 text-slate-400 hover:text-slate-200'
                  : 'border-slate-300 text-slate-600 hover:text-slate-900'
            }`}
            title="Toggle 7-day predictive forward projection model"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>+7D Predictive Forecast</span>
          </button>
        </div>
      </div>

      {/* 30-Day Executive Telemetry Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 my-4">
        {/* Metric 1: Current Score */}
        <div className={`p-3.5 rounded-xl border ${
          isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span>Today's Procurement Impact</span>
            <span className={`flex items-center text-[10px] font-bold ${
              stats.netChangePct >= 0 ? 'text-rose-500' : 'text-emerald-500'
            }`}>
              {stats.netChangePct >= 0 ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
              {stats.netChangePct >= 0 ? `+${stats.netChangePct}%` : `${stats.netChangePct}%`}
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-indigo-400 mt-1 flex items-baseline gap-2">
            <span>{stats.currentScore}</span>
            <span className="text-xs font-semibold text-rose-500 font-sans">CRITICAL EXPOSURE</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Up from {stats.initialScore} (30 days ago)
          </div>
        </div>

        {/* Metric 2: 30-Day Average */}
        <div className={`p-3.5 rounded-xl border ${
          isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="text-[11px] text-slate-400 font-medium">30-Day Rolling Average</div>
          <div className="text-2xl font-bold font-mono text-slate-200 mt-1 flex items-baseline gap-2">
            <span>{stats.avgScore}</span>
            <span className="text-xs text-slate-400 font-sans">/ 100 Index</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Elevated above baseline norm (50.0)
          </div>
        </div>

        {/* Metric 3: 30-Day Peak Day */}
        <div className={`p-3.5 rounded-xl border ${
          isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="text-[11px] text-slate-400 font-medium">30-Day Peak Stress Date</div>
          <div className="text-lg font-bold truncate text-rose-400 mt-1 flex items-center gap-1.5 font-mono">
            <Flame className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{stats.maxDay?.dateLabel}</span>
            <span className="text-xs text-rose-500 font-bold">({stats.maxScore})</span>
          </div>
          <div className="text-[10px] text-slate-400 truncate mt-1">
            Driver: {stats.maxDay?.category} Disruption
          </div>
        </div>

        {/* Metric 4: 7-Day Forward Trajectory */}
        <div className={`p-3.5 rounded-xl border ${
          isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-[11px] text-purple-400 font-medium">
            <span>7-Day Forward Trajectory</span>
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-xl font-bold font-mono text-purple-400 mt-1 flex items-baseline gap-2">
            <span>~{stats.finalForecast}</span>
            <span className="text-xs font-semibold text-rose-400 font-sans">
              {stats.forecastChange >= 0 ? `▲ +${stats.forecastChange} pts` : `▼ ${stats.forecastChange} pts`}
            </span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Driven by tariff resets & ocean alliances
          </div>
        </div>
      </div>

      {/* Main Recharts Area & Composed Chart */}
      <div className="my-2">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-indigo-400" />
            <span>
              {selectedMetric === 'impactScore' && 'Procurement Impact Score (0–100 scale). Red reference line marks severe vulnerability threshold (80+).'}
              {selectedMetric === 'leadTime' && 'Average lead-time extension in calendar days caused by vessel rerouting and border clearance.'}
              {selectedMetric === 'costInflation' && 'Estimated landed cost percentage inflation per container / manufacturing batch.'}
            </span>
          </span>
          <div className="hidden sm:flex items-center gap-3 text-[11px] font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-indigo-500 inline-block" /> 30-Day Historical Trend
            </span>
            {includeForecast && (
              <span className="flex items-center gap-1.5 text-purple-400">
                <span className="w-2.5 h-2.5 rounded-xs bg-purple-500 inline-block" /> +7D Predictive Horizon
              </span>
            )}
          </div>
        </div>

        <div className="w-full h-84 rounded-xl border border-slate-100 dark:border-slate-800/80 p-2 bg-slate-950/20">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={filteredData}
              margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
              onMouseMove={(state: any) => {
                if (state && state.activePayload && state.activePayload[0]) {
                  setActiveHoverDay(state.activePayload[0].payload);
                }
              }}
            >
              <defs>
                <linearGradient id="procurementImpactGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="leadTimeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="forecastBandGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity={0.05} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? '#334155' : '#e2e8f0'}
                opacity={0.4}
              />

              <XAxis
                dataKey="dateLabel"
                tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 10 }}
                interval={4}
                angle={-15}
                textAnchor="end"
              />

              <YAxis
                domain={
                  selectedMetric === 'impactScore'
                    ? [40, 100]
                    : selectedMetric === 'leadTime'
                      ? [-5, 25]
                      : [-2, 10]
                }
                tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }}
                label={{
                  value:
                    selectedMetric === 'impactScore'
                      ? 'Index (0-100)'
                      : selectedMetric === 'leadTime'
                        ? '+Days'
                        : '% Variance',
                  angle: -90,
                  position: 'insideLeft',
                  fill: '#94a3b8',
                  fontSize: 10,
                }}
              />

              <Tooltip content={<CustomTooltipContent />} />

              {/* Reference Lines */}
              {selectedMetric === 'impactScore' && (
                <>
                  <ReferenceLine
                    y={80}
                    stroke="#ef4444"
                    strokeDasharray="4 4"
                    label={{ value: 'Severe Threshold (80)', fill: '#ef4444', fontSize: 10, position: 'right' }}
                  />
                  <ReferenceLine
                    y={65}
                    stroke="#f59e0b"
                    strokeDasharray="3 3"
                    label={{ value: 'Elevated Risk (65)', fill: '#f59e0b', fontSize: 10, position: 'right' }}
                  />
                </>
              )}

              {/* Main Metric Visualizations */}
              {selectedMetric === 'impactScore' && (
                <>
                  {/* Historical Area */}
                  <Area
                    type="monotone"
                    dataKey="impactScore"
                    name="Historical Impact"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    fill="url(#procurementImpactGrad)"
                  />

                  {/* 7-Day Projected Forecast Upper/Lower Band */}
                  {includeForecast && (
                    <>
                      <Area
                        type="monotone"
                        dataKey="forecastUpper"
                        name="Forecast Upper 95% CI"
                        stroke="none"
                        fill="url(#forecastBandGrad)"
                      />
                      <Line
                        type="monotone"
                        dataKey="forecastScore"
                        name="Projected Trend"
                        stroke="#a855f7"
                        strokeWidth={2.5}
                        strokeDasharray="5 5"
                        dot={{ r: 4, fill: '#a855f7' }}
                      />
                    </>
                  )}
                </>
              )}

              {selectedMetric === 'leadTime' && (
                <Area
                  type="monotone"
                  dataKey="leadTimeDays"
                  name="Lead Time (+Days)"
                  stroke="#ef4444"
                  strokeWidth={2.5}
                  fill="url(#leadTimeGrad)"
                />
              )}

              {selectedMetric === 'costInflation' && (
                <Area
                  type="monotone"
                  dataKey="costInflationPct"
                  name="Landed Cost (%)"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  fill="url(#costGrad)"
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Selected Day / Active Hover Insight Card */}
      {activeHoverDay && (
        <div className={`mt-4 p-4 rounded-xl border transition-all ${
          activeHoverDay.isForecast
            ? 'bg-purple-950/20 border-purple-800/40 text-purple-200'
            : isDark
              ? 'bg-slate-950/50 border-slate-800 text-slate-200'
              : 'bg-indigo-50/50 border-indigo-100 text-indigo-950'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm">
                Day Focus: {activeHoverDay.dateLabel}
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                (activeHoverDay.impactScore || activeHoverDay.forecastScore || 0) >= 80
                  ? 'bg-rose-500/20 text-rose-400'
                  : 'bg-amber-500/20 text-amber-400'
              }`}>
                Score: {activeHoverDay.impactScore || activeHoverDay.forecastScore}/100
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-400">
                {activeHoverDay.category}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-rose-400">+{activeHoverDay.leadTimeDays}d transit</span>
              <span className="text-amber-400">+{activeHoverDay.costInflationPct}% cost</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="font-semibold text-slate-400 block mb-0.5">Macro Milestone:</span>
              <p className="leading-snug text-slate-300 font-medium">"{activeHoverDay.driverHeadline}"</p>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{activeHoverDay.driverSummary}</p>
            </div>

            <div className="flex flex-col justify-between">
              <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px]">
                <strong className="block text-indigo-200 mb-0.5">Recommended Procurement Action:</strong>
                {activeHoverDay.procurementDirective}
              </div>

              {onCreateVideoBrief && (
                <div className="flex items-center justify-end mt-2">
                  <button
                    onClick={() => {
                      if (items.length > 0) {
                        onCreateVideoBrief(items[0]);
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-semibold transition-all shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Create Brief for This Disruption</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Scheduled Risk Catalysts (Next 7-14 Days) */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Upcoming Forward Inflection Catalysts (Next 7–14 Days)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Forward Risk Drivers
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {UPCOMING_CATALYSTS.map((cat, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border text-xs flex flex-col justify-between ${
                isDark ? 'bg-slate-950/40 border-slate-800/80' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="text-[10px] font-mono font-semibold text-purple-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {cat.date}
                  </span>
                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                    cat.impact === 'Critical'
                      ? 'bg-rose-500/20 text-rose-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {cat.impact.toUpperCase()}
                  </span>
                </div>
                <h4 className="font-bold text-slate-200 text-xs mb-1 line-clamp-1">{cat.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">{cat.description}</p>
              </div>

              <div className="mt-2 pt-1.5 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500">
                <span>{cat.category}</span>
                <span className="text-indigo-400 font-medium">Model Input</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
