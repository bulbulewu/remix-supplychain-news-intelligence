import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  CartesianGrid,
  Treemap,
  ComposedChart,
  Line,
  ReferenceLine,
} from 'recharts';
import {
  Globe2,
  AlertTriangle,
  Flame,
  ShieldAlert,
  ChevronRight,
  TrendingUp,
  MapPin,
  ExternalLink,
  Clapperboard,
  Sparkles,
  Layers,
  BarChart2,
  LayoutGrid,
  Info,
  X,
  Filter,
  Compass,
} from 'lucide-react';
import { NewsItem, PriorityLevel, ImpactLevel } from '../types/news';

interface RegionalRiskHeatmapProps {
  items: NewsItem[];
  isDark: boolean;
  onSelectCountry?: (country: string) => void;
  onSelectStory?: (item: NewsItem) => void;
  onCreateVideoBrief?: (item: NewsItem) => void;
  onOpenMasterPrompt?: (item: NewsItem) => void;
}

export interface CountryRiskMetric {
  country: string;
  region: string;
  totalAlerts: number;
  criticalAlerts: number;
  highAlerts: number;
  mediumAlerts: number;
  highImpactAlerts: number; // critical + high
  highImpactRatio: number; // %
  avgPriorityScore: number;
  compositeRiskScore: number; // 0-100 weighted index
  primaryIndustries: string[];
  topCategories: string[];
  criticalStoryHeadlines: string[];
  items: NewsItem[];
}

const REGION_MAP: Record<string, string> = {
  China: 'Asia-Pacific',
  Taiwan: 'Asia-Pacific',
  Japan: 'Asia-Pacific',
  'South Korea': 'Asia-Pacific',
  Singapore: 'Asia-Pacific',
  Vietnam: 'Asia-Pacific',
  Indonesia: 'Asia-Pacific',
  Malaysia: 'Asia-Pacific',
  Philippines: 'Asia-Pacific',
  Thailand: 'Asia-Pacific',
  Australia: 'Asia-Pacific',
  India: 'South Asia',
  Bangladesh: 'South Asia',
  Pakistan: 'South Asia',
  'United States': 'North America',
  Canada: 'North America',
  Mexico: 'North America',
  Germany: 'Europe',
  Netherlands: 'Europe',
  Belgium: 'Europe',
  France: 'Europe',
  'United Kingdom': 'Europe',
  Italy: 'Europe',
  Spain: 'Europe',
  Poland: 'Europe',
  Egypt: 'Middle East & Africa',
  Qatar: 'Middle East & Africa',
  'Saudi Arabia': 'Middle East & Africa',
  UAE: 'Middle East & Africa',
  Israel: 'Middle East & Africa',
  Panama: 'Latin America',
  Chile: 'Latin America',
  Peru: 'Latin America',
  Brazil: 'Latin America',
  Colombia: 'Latin America',
};

const COUNTRY_FLAGS: Record<string, string> = {
  China: '🇨🇳',
  Taiwan: '🇹🇼',
  'United States': '🇺🇸',
  Bangladesh: '🇧🇩',
  India: '🇮🇳',
  Germany: '🇩🇪',
  Netherlands: '🇳🇱',
  Egypt: '🇪🇬',
  Panama: '🇵🇦',
  Chile: '🇨🇱',
  Vietnam: '🇻🇳',
  Japan: '🇯🇵',
  'South Korea': '🇰🇷',
  Singapore: '🇸🇬',
  Mexico: '🇲🇽',
  Qatar: '🇶🇦',
  Canada: '🇨🇦',
  Belgium: '🇧🇪',
  France: '🇫🇷',
  'United Kingdom': '🇬🇧',
  Peru: '🇵🇪',
  Brazil: '🇧🇷',
  Australia: '🇦🇺',
};

export const RegionalRiskHeatmap: React.FC<RegionalRiskHeatmapProps> = ({
  items,
  isDark,
  onSelectCountry,
  onSelectStory,
  onCreateVideoBrief,
  onOpenMasterPrompt,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'treemap' | 'ranking' | 'matrix'>('treemap');
  const [minImpactFilter, setMinImpactFilter] = useState<'all' | 'highAndCritical'>('highAndCritical');
  const [selectedCountryDetail, setSelectedCountryDetail] = useState<CountryRiskMetric | null>(null);

  // Aggregation of country metrics
  const countryMetrics = useMemo(() => {
    const map = new Map<string, {
      items: NewsItem[];
      critical: number;
      high: number;
      medium: number;
      totalPriorityScore: number;
      industries: Set<string>;
      categories: Set<string>;
      criticalHeadlines: string[];
    }>();

    items.forEach((item) => {
      const countryList = item.countries && item.countries.length > 0
        ? item.countries
        : ['Global/Unspecified'];

      const isCritical = item.impactRatings?.procurementImpact === 'Critical' ||
        item.impactRatings?.supplyRisk === 'Critical' ||
        item.priorityLevel === 'CRITICAL' ||
        item.priorityScore >= 85;

      const isHigh = !isCritical && (
        item.impactRatings?.procurementImpact === 'High' ||
        item.impactRatings?.supplyRisk === 'High' ||
        item.priorityLevel === 'HIGH' ||
        item.priorityScore >= 70
      );

      countryList.forEach((c) => {
        if (!map.has(c)) {
          map.set(c, {
            items: [],
            critical: 0,
            high: 0,
            medium: 0,
            totalPriorityScore: 0,
            industries: new Set<string>(),
            categories: new Set<string>(),
            criticalHeadlines: [],
          });
        }
        const record = map.get(c)!;
        record.items.push(item);
        record.totalPriorityScore += item.priorityScore || 50;

        if (isCritical) {
          record.critical++;
          if (record.criticalHeadlines.length < 3) {
            record.criticalHeadlines.push(item.headline);
          }
        } else if (isHigh) {
          record.high++;
        } else {
          record.medium++;
        }

        (item.industries || []).forEach((ind) => record.industries.add(ind));
        if (item.category) record.categories.add(item.category);
      });
    });

    const metrics: CountryRiskMetric[] = [];
    map.forEach((data, country) => {
      if (country === 'Global/Unspecified') return;
      const totalAlerts = data.items.length;
      const highImpactAlerts = data.critical + data.high;
      const highImpactRatio = Math.round((highImpactAlerts / totalAlerts) * 100);
      const avgPriorityScore = Math.round(data.totalPriorityScore / totalAlerts);

      // Composite Procurement Risk Index: 0 to 100
      // Weighs severity: critical (weight 12), high (weight 7), and average priority score (40%)
      const severityScore = (data.critical * 12) + (data.high * 7);
      const compositeRiskScore = Math.min(
        100,
        Math.round((avgPriorityScore * 0.45) + (Math.min(severityScore, 55)))
      );

      const region = REGION_MAP[country] || 'Other';

      metrics.push({
        country,
        region,
        totalAlerts,
        criticalAlerts: data.critical,
        highAlerts: data.high,
        mediumAlerts: data.medium,
        highImpactAlerts,
        highImpactRatio,
        avgPriorityScore,
        compositeRiskScore,
        primaryIndustries: Array.from(data.industries).slice(0, 4),
        topCategories: Array.from(data.categories).slice(0, 3),
        criticalStoryHeadlines: data.criticalHeadlines,
        items: data.items,
      });
    });

    // Sort by concentration of high-impact procurement alerts, then composite risk
    return metrics.sort((a, b) => {
      if (b.criticalAlerts !== a.criticalAlerts) {
        return b.criticalAlerts - a.criticalAlerts;
      }
      if (b.highImpactAlerts !== a.highImpactAlerts) {
        return b.highImpactAlerts - a.highImpactAlerts;
      }
      return b.compositeRiskScore - a.compositeRiskScore;
    });
  }, [items]);

  // Unique regions
  const availableRegions = useMemo(() => {
    const set = new Set<string>();
    countryMetrics.forEach((c) => set.add(c.region));
    return ['All', ...Array.from(set).sort()];
  }, [countryMetrics]);

  // Filtered dataset for charts
  const filteredCountries = useMemo(() => {
    return countryMetrics.filter((c) => {
      if (selectedRegion !== 'All' && c.region !== selectedRegion) return false;
      if (minImpactFilter === 'highAndCritical' && c.highImpactAlerts === 0) return false;
      return true;
    });
  }, [countryMetrics, selectedRegion, minImpactFilter]);

  // Top metrics summary
  const summary = useMemo(() => {
    const totalHighImpact = countryMetrics.reduce((acc, c) => acc + c.highImpactAlerts, 0);
    const totalCritical = countryMetrics.reduce((acc, c) => acc + c.criticalAlerts, 0);
    const topCountry = countryMetrics[0] || null;
    const countriesWithCritical = countryMetrics.filter((c) => c.criticalAlerts > 0).length;

    return {
      totalHighImpact,
      totalCritical,
      topCountry,
      countriesWithCritical,
      totalMonitoredCountries: countryMetrics.length,
    };
  }, [countryMetrics]);

  // Treemap data format for Recharts
  const treemapData = useMemo(() => {
    return filteredCountries.slice(0, 16).map((c) => ({
      name: c.country,
      flag: COUNTRY_FLAGS[c.country] || '🌐',
      size: Math.max(c.highImpactAlerts * 10 + c.totalAlerts * 4, 15),
      riskScore: c.compositeRiskScore,
      critical: c.criticalAlerts,
      high: c.highAlerts,
      total: c.totalAlerts,
      highImpact: c.highImpactAlerts,
      region: c.region,
      raw: c,
    }));
  }, [filteredCountries]);

  // Custom Treemap Tile Content
  const renderCustomTreemapNode = (props: any): React.ReactElement => {
    const { x, y, width, height, name, flag, riskScore, critical, high, total, raw } = props;
    if (width < 38 || height < 28) return <g />;

    // Heatmap color interpolation
    let bgColor = '#10b981'; // low
    let textColor = '#ffffff';

    if (riskScore >= 85 || critical >= 3) {
      bgColor = '#dc2626'; // Red / Critical
    } else if (riskScore >= 75 || critical >= 1) {
      bgColor = '#e11d48'; // Rose / Severe
    } else if (riskScore >= 65 || high >= 2) {
      bgColor = '#f59e0b'; // Amber / High
    } else if (riskScore >= 50) {
      bgColor = '#3b82f6'; // Blue / Moderate
    }

    return (
      <g
        onClick={() => raw && setSelectedCountryDetail(raw)}
        style={{ cursor: 'pointer' }}
      >
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          rx={6}
          ry={6}
          fill={bgColor}
          fillOpacity={isDark ? 0.9 : 0.88}
          stroke={isDark ? '#0f172a' : '#ffffff'}
          strokeWidth={2}
          className="transition-all hover:opacity-100 hover:brightness-110"
        />

        {/* Flag & Name */}
        {width > 60 && height > 35 && (
          <text
            x={x + 8}
            y={y + 18}
            fill={textColor}
            fontSize={width > 100 ? 12 : 11}
            fontWeight="bold"
            className="select-none"
          >
            {flag} {name}
          </text>
        )}

        {/* Details in Tile */}
        {width > 80 && height > 55 && (
          <>
            <text
              x={x + 8}
              y={y + 35}
              fill="rgba(255,255,255,0.92)"
              fontSize={10}
              fontWeight="600"
              className="select-none font-mono"
            >
              Risk: {riskScore}/100
            </text>
            <text
              x={x + 8}
              y={y + 49}
              fill="rgba(255,255,255,0.85)"
              fontSize={9}
              className="select-none"
            >
              🚨 {critical} Crit · ⚠️ {high} High
            </text>
          </>
        )}
      </g>
    );
  };

  // Custom Tooltip for Ranked BarChart
  const CustomBarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: CountryRiskMetric = payload[0].payload;
      return (
        <div className={`p-3 rounded-xl border shadow-xl text-xs max-w-xs ${
          isDark ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <div className="flex items-center justify-between gap-2 border-b pb-1.5 mb-2 dark:border-slate-800">
            <span className="font-bold flex items-center gap-1.5">
              <span>{COUNTRY_FLAGS[data.country] || '🌐'}</span>
              <span>{data.country}</span>
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-500 font-bold">
              Risk {data.compositeRiskScore}/100
            </span>
          </div>

          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between text-rose-500 font-semibold">
              <span>Critical Procurement Alerts:</span>
              <span>{data.criticalAlerts}</span>
            </div>
            <div className="flex justify-between text-amber-500 font-semibold">
              <span>High Impact Alerts:</span>
              <span>{data.highAlerts}</span>
            </div>
            <div className="flex justify-between text-blue-500 font-semibold">
              <span>Moderate / Watch Alerts:</span>
              <span>{data.mediumAlerts}</span>
            </div>
            <div className="flex justify-between font-bold pt-1 border-t dark:border-slate-800">
              <span>Total Sourcing Impact Ratio:</span>
              <span>{data.highImpactRatio}%</span>
            </div>
          </div>

          {data.criticalStoryHeadlines.length > 0 && (
            <div className="mt-2 pt-2 border-t text-[10px] text-slate-400 dark:border-slate-800">
              <span className="font-semibold block text-slate-300">Top Driver:</span>
              <p className="italic line-clamp-2 mt-0.5">"{data.criticalStoryHeadlines[0]}"</p>
            </div>
          )}

          <div className="mt-2 pt-1 text-[10px] text-blue-400 text-right">
            Click bar to inspect alerts →
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
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 shadow-xs">
              <Flame className="w-5 h-5 text-rose-500 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight">Regional Risk Heatmap</h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20">
                  RECHARTS HEATMAP
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Visualizing countries with the highest concentration of high-impact procurement alerts & logistics shocks
              </p>
            </div>
          </div>
        </div>

        {/* View Mode & Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Region selector */}
          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className={`px-2.5 py-1 rounded-lg border text-xs font-semibold ${
                isDark ? 'bg-slate-950 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-800'
              }`}
            >
              {availableRegions.map((reg) => (
                <option key={reg} value={reg}>Region: {reg}</option>
              ))}
            </select>
          </div>

          {/* Impact threshold */}
          <button
            onClick={() => setMinImpactFilter(minImpactFilter === 'all' ? 'highAndCritical' : 'all')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
              minImpactFilter === 'highAndCritical'
                ? 'bg-rose-500/10 border-rose-500/40 text-rose-500 shadow-xs'
                : isDark
                  ? 'border-slate-700 text-slate-400 hover:text-slate-200'
                  : 'border-slate-300 text-slate-600 hover:text-slate-900'
            }`}
            title="Toggle whether to display only High & Critical procurement alerts"
          >
            {minImpactFilter === 'highAndCritical' ? (
              <>
                <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                <span>High & Critical Only</span>
              </>
            ) : (
              <>
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                <span>All Alerts</span>
              </>
            )}
          </button>

          {/* Chart View Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-950 p-0.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('treemap')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                activeTab === 'treemap'
                  ? 'bg-rose-600 text-white font-semibold shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Heatmap Tiles</span>
            </button>
            <button
              onClick={() => setActiveTab('ranking')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                activeTab === 'ranking'
                  ? 'bg-rose-600 text-white font-semibold shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Alert Ranking</span>
            </button>
            <button
              onClick={() => setActiveTab('matrix')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                activeTab === 'matrix'
                  ? 'bg-rose-600 text-white font-semibold shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Risk Curve</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Concentration Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className={`p-3 rounded-xl border ${
          isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
            <span>Critical Procurement Alerts</span>
          </div>
          <div className="text-xl font-bold font-mono text-rose-500 mt-1 flex items-baseline gap-1.5">
            <span>{summary.totalCritical}</span>
            <span className="text-[11px] font-normal text-slate-400">across {summary.countriesWithCritical} nations</span>
          </div>
        </div>

        <div className={`p-3 rounded-xl border ${
          isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>High-Impact Concentration</span>
          </div>
          <div className="text-xl font-bold font-mono text-amber-500 mt-1 flex items-baseline gap-1.5">
            <span>{summary.totalHighImpact}</span>
            <span className="text-[11px] font-normal text-slate-400">events flagged</span>
          </div>
        </div>

        <div className={`p-3 rounded-xl border ${
          isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
            <Globe2 className="w-3.5 h-3.5 text-red-500" />
            <span>Highest Risk Country</span>
          </div>
          <div className="text-sm font-bold truncate mt-1 flex items-center gap-1.5 text-slate-100">
            <span>{summary.topCountry ? COUNTRY_FLAGS[summary.topCountry.country] : '🌐'}</span>
            <span className="truncate">{summary.topCountry?.country || 'N/A'}</span>
            {summary.topCountry && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-400 font-bold">
                {summary.topCountry.compositeRiskScore}/100
              </span>
            )}
          </div>
        </div>

        <div className={`p-3 rounded-xl border ${
          isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-blue-500" />
            <span>Primary Exposure Corridor</span>
          </div>
          <div className="text-sm font-bold truncate mt-1 text-slate-100 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span className="truncate">Asia-Pacific → EU/US</span>
          </div>
        </div>
      </div>

      {/* Main Visualization View */}
      <div className="mt-2">
        {filteredCountries.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No countries found matching the selected region or impact filter.
          </div>
        ) : (
          <>
            {/* VIEW 1: Recharts Treemap Heatmap */}
            {activeTab === 'treemap' && (
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-rose-500" />
                    <span>Tile size corresponds to alert volume; color intensity reflects procurement risk score. Click any tile for full alert details.</span>
                  </span>
                  <div className="flex items-center gap-3 font-mono text-[10px]">
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-xs bg-red-600 inline-block" /> Critical (85+)
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-xs bg-rose-600 inline-block" /> Severe (75-84)
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-xs bg-amber-500 inline-block" /> High (65-74)
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-xs bg-blue-500 inline-block" /> Moderate (&lt;65)
                    </span>
                  </div>
                </div>

                <div className="w-full h-80 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800/80 p-1 bg-slate-950/20">
                  <ResponsiveContainer width="100%" height="100%">
                    <Treemap
                      data={treemapData}
                      dataKey="size"
                      aspectRatio={4 / 3}
                      stroke={isDark ? '#0f172a' : '#ffffff'}
                      content={renderCustomTreemapNode}
                    />
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* VIEW 2: Ranked BarChart by Alert Concentration */}
            {activeTab === 'ranking' && (
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>Countries ranked by concentration of Critical and High procurement alerts. Click any bar to drilldown.</span>
                  <span className="text-[11px] font-mono text-slate-500">Top 12 Monitored Sourcing Hubs</span>
                </div>

                <div className="w-full h-84">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={filteredCountries.slice(0, 12)}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                      onClick={(state: any) => {
                        if (state && state.activePayload && state.activePayload[0]) {
                          setSelectedCountryDetail(state.activePayload[0].payload);
                        }
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        horizontal={false}
                        stroke={isDark ? '#334155' : '#e2e8f0'}
                        opacity={0.5}
                      />
                      <XAxis
                        type="number"
                        tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }}
                      />
                      <YAxis
                        dataKey="country"
                        type="category"
                        tick={({ x, y, payload }) => (
                          <g transform={`translate(${x},${y})`}>
                            <text
                              x={-10}
                              y={4}
                              textAnchor="end"
                              fill={isDark ? '#e2e8f0' : '#1e293b'}
                              fontSize={11}
                              fontWeight="600"
                            >
                              {COUNTRY_FLAGS[payload.value] || ''} {payload.value}
                            </text>
                          </g>
                        )}
                        width={90}
                      />
                      <Tooltip content={<CustomBarTooltip />} />
                      <Legend
                        verticalAlign="top"
                        align="right"
                        wrapperStyle={{ fontSize: 11, paddingBottom: 10 }}
                      />
                      <Bar
                        dataKey="criticalAlerts"
                        name="Critical Alerts"
                        stackId="a"
                        fill="#ef4444"
                        radius={[0, 0, 0, 0]}
                        cursor="pointer"
                      />
                      <Bar
                        dataKey="highAlerts"
                        name="High-Impact Alerts"
                        stackId="a"
                        fill="#f59e0b"
                        radius={[0, 0, 0, 0]}
                        cursor="pointer"
                      />
                      <Bar
                        dataKey="mediumAlerts"
                        name="Moderate Alerts"
                        stackId="a"
                        fill="#3b82f6"
                        radius={[0, 4, 4, 0]}
                        cursor="pointer"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* VIEW 3: Risk Curve ComposedChart */}
            {activeTab === 'matrix' && (
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>Procurement Alert Volume vs. Composite Risk Score (0–100 Scale).</span>
                  <span className="text-[11px] font-mono text-rose-500">Threshold: 80+ Severe Risk</span>
                </div>

                <div className="w-full h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={filteredCountries.slice(0, 12)}
                      margin={{ top: 15, right: 30, left: 10, bottom: 25 }}
                      onClick={(state: any) => {
                        if (state && state.activePayload && state.activePayload[0]) {
                          setSelectedCountryDetail(state.activePayload[0].payload);
                        }
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={isDark ? '#334155' : '#e2e8f0'}
                        opacity={0.4}
                      />
                      <XAxis
                        dataKey="country"
                        tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 10 }}
                        interval={0}
                        angle={-25}
                        textAnchor="end"
                      />
                      <YAxis
                        yAxisId="left"
                        tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }}
                        label={{ value: 'Alert Count', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10 }}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        domain={[40, 100]}
                        tick={{ fill: '#ef4444', fontSize: 11 }}
                        label={{ value: 'Risk Index (0-100)', angle: 90, position: 'insideRight', fill: '#ef4444', fontSize: 10 }}
                      />
                      <Tooltip content={<CustomBarTooltip />} />
                      <Legend verticalAlign="top" wrapperStyle={{ fontSize: 11, paddingBottom: 10 }} />
                      <ReferenceLine yAxisId="right" y={80} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Severe Line', fill: '#ef4444', fontSize: 10 }} />
                      <Bar
                        yAxisId="left"
                        dataKey="highImpactAlerts"
                        name="High-Impact Alerts"
                        fill="#f43f5e"
                        radius={[4, 4, 0, 0]}
                        cursor="pointer"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="compositeRiskScore"
                        name="Composite Risk Index"
                        stroke="#f59e0b"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: '#f59e0b' }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Country Drilldown Modal */}
      {selectedCountryDetail && (
        <div className="fixed inset-0 z-60 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[85vh] ${
            isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{COUNTRY_FLAGS[selectedCountryDetail.country] || '🌐'}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold">{selectedCountryDetail.country}</h3>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
                      {selectedCountryDetail.region}
                    </span>
                    <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      selectedCountryDetail.compositeRiskScore >= 80
                        ? 'bg-rose-500 text-white'
                        : selectedCountryDetail.compositeRiskScore >= 65
                          ? 'bg-amber-500 text-white'
                          : 'bg-blue-500 text-white'
                    }`}>
                      Risk Score: {selectedCountryDetail.compositeRiskScore}/100
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {selectedCountryDetail.totalAlerts} total alert{selectedCountryDetail.totalAlerts === 1 ? '' : 's'} · {selectedCountryDetail.criticalAlerts} critical · {selectedCountryDetail.highAlerts} high impact
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCountryDetail(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Badges */}
            <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-xs flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-slate-400">Key Exposed Sectors:</span>
                {selectedCountryDetail.primaryIndustries.map((ind) => (
                  <span
                    key={ind}
                    className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-[11px] font-medium"
                  >
                    {ind}
                  </span>
                ))}
              </div>

              {onSelectCountry && (
                <button
                  onClick={() => {
                    onSelectCountry(selectedCountryDetail.country);
                    setSelectedCountryDetail(null);
                  }}
                  className="text-xs text-blue-500 hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Filter Main Feed for {selectedCountryDetail.country}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Stories List */}
            <div className="p-5 overflow-y-auto space-y-3 flex-1 text-xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Procurement Disruption Stories ({selectedCountryDetail.items.length})
              </div>

              {selectedCountryDetail.items.map((story) => (
                <div
                  key={story.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    story.priorityLevel === 'CRITICAL'
                      ? 'border-rose-500/50 bg-rose-500/5'
                      : isDark
                        ? 'border-slate-800 bg-slate-950/40'
                        : 'border-slate-200 bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded ${
                      story.priorityLevel === 'CRITICAL'
                        ? 'bg-rose-500 text-white'
                        : story.priorityLevel === 'HIGH'
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-blue-500 text-white'
                    }`}>
                      {story.priorityLevel} · Score {story.priorityScore}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {story.source} · {story.category}
                    </span>
                  </div>

                  <h4 className="font-semibold text-sm leading-snug mb-1 text-slate-900 dark:text-slate-100">
                    {story.headline}
                  </h4>

                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed mb-2.5">
                    {story.oneLineSummary}
                  </p>

                  {/* Impact pill */}
                  {story.supplyChainImpact?.procurement && (
                    <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-[11px] mb-2.5">
                      <strong>Procurement Directive:</strong> {story.supplyChainImpact.procurement}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                    {onSelectStory && (
                      <button
                        onClick={() => {
                          onSelectStory(story);
                          setSelectedCountryDetail(null);
                        }}
                        className="px-2.5 py-1 rounded-lg border text-[11px] font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        Read Analysis
                      </button>
                    )}
                    {onCreateVideoBrief && (
                      <button
                        onClick={() => {
                          onCreateVideoBrief(story);
                          setSelectedCountryDetail(null);
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-semibold shadow-xs"
                      >
                        <Clapperboard className="w-3 h-3" />
                        <span>Video Brief</span>
                      </button>
                    )}
                    {onOpenMasterPrompt && (
                      <button
                        onClick={() => {
                          onOpenMasterPrompt(story);
                          setSelectedCountryDetail(null);
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-purple-500/40 text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 text-[11px] font-semibold"
                      >
                        <Sparkles className="w-3 h-3 text-purple-500" />
                        <span>Prompt</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end bg-slate-50/50 dark:bg-slate-950/40">
              <button
                onClick={() => setSelectedCountryDetail(null)}
                className="px-4 py-1.5 rounded-lg border text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
