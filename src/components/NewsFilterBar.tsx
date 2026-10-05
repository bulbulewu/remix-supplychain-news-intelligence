import React from 'react';
import {
  Search,
  Filter,
  RotateCcw,
  SlidersHorizontal,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  Tag,
  Globe,
  Briefcase,
  Gauge,
  FileText,
} from 'lucide-react';

interface NewsFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (c: string) => void;
  selectedRegion: string;
  onRegionChange: (r: string) => void;
  selectedIndustry: string;
  onIndustryChange: (ind: string) => void;
  minRelevance: number;
  onMinRelevanceChange: (val: number) => void;
  sortBy: string;
  onSortByChange: (s: string) => void;
  displayLimit: number;
  onDisplayLimitChange: (lim: number) => void;
  totalFilteredCount: number;
  onResetFilters: () => void;
  videoStatusFilter?: 'all' | 'pending' | 'created';
  onVideoStatusFilterChange?: (status: 'all' | 'pending' | 'created') => void;
  pendingVideoCount?: number;
  createdVideoCount?: number;
  isDark: boolean;
}

const CATEGORIES = [
  'All Categories',
  'Shipping',
  'Tariffs',
  'Procurement',
  'Sourcing',
  'Logistics',
  'Manufacturing',
  'Commodities',
  'Supplier Risk',
  'Energy',
  'Labor',
  'Technology',
  'Geopolitics',
];

const REGIONS = [
  'All Regions',
  'Global',
  'North America',
  'Europe',
  'Asia',
  'South Asia',
  'East Asia',
  'Southeast Asia',
  'Middle East',
  'Latin America',
];

const INDUSTRIES = [
  'All Industries',
  'Automotive',
  'Semiconductors',
  'Electronics',
  'Retail',
  'Apparel & Textiles',
  'Energy & Oil/Gas',
  'Chemicals',
  'Pharmaceuticals',
  'Metals & Mining',
  'Food & Agriculture',
  'Industrial Manufacturing',
];

export const NewsFilterBar: React.FC<NewsFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedRegion,
  onRegionChange,
  selectedIndustry,
  onIndustryChange,
  minRelevance,
  onMinRelevanceChange,
  sortBy,
  onSortByChange,
  displayLimit,
  onDisplayLimitChange,
  totalFilteredCount,
  onResetFilters,
  videoStatusFilter = 'all',
  onVideoStatusFilterChange,
  pendingVideoCount,
  createdVideoCount,
  isDark,
}) => {
  return (
    <div className={`p-4 rounded-2xl border mb-6 transition-all ${
      isDark ? 'bg-slate-900/90 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-xs'
    }`}>
      {/* Top Search & Count Row */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 mb-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search collected intelligence (e.g. 'Red Sea', 'China tariffs', 'copper smelter', 'Bangladesh RMG', 'port strike')..."
            className={`w-full pl-9 pr-4 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors ${
              isDark
                ? 'bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-500'
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>

        <div className="flex items-center gap-3 justify-between lg:justify-end">
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
            Showing <strong className="text-slate-900 dark:text-slate-100">{totalFilteredCount}</strong> stories
          </span>

          {/* Video Creation Status Filter Buttons */}
          {onVideoStatusFilterChange && (
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs font-medium">
              <button
                onClick={() => onVideoStatusFilterChange('all')}
                className={`px-2.5 py-1 rounded-md transition-colors inline-flex items-center gap-1 cursor-pointer ${
                  videoStatusFilter === 'all'
                    ? isDark
                      ? 'bg-blue-600 text-white font-semibold shadow-xs'
                      : 'bg-white text-slate-900 font-semibold shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <FileText className="w-3 h-3 opacity-75" />
                <span>All Stories</span>
              </button>
              <button
                onClick={() => onVideoStatusFilterChange('pending')}
                className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer ${
                  videoStatusFilter === 'pending'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
                title="Filter to stories remaining for video production"
              >
                <Clock className="w-3 h-3 text-amber-500" />
                <span>Pending Video</span>
                {pendingVideoCount !== undefined && (
                  <span className="text-[10px] font-mono opacity-85">({pendingVideoCount})</span>
                )}
              </button>
              <button
                onClick={() => onVideoStatusFilterChange('created')}
                className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer ${
                  videoStatusFilter === 'created'
                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
                title="Filter to stories where you have already created a video"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Created</span>
                {createdVideoCount !== undefined && (
                  <span className="text-[10px] font-mono opacity-85">({createdVideoCount})</span>
                )}
              </button>
            </div>
          )}

          {/* Display limit buttons */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-[11px] font-mono">
            {[10, 20, 50, 999].map((lim) => (
              <button
                key={lim}
                onClick={() => onDisplayLimitChange(lim)}
                className={`px-2 py-1 rounded transition-colors ${
                  displayLimit === lim
                    ? isDark
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-white text-slate-900 font-semibold shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {lim === 999 ? 'All' : `Top ${lim}`}
              </button>
            ))}
          </div>

          <button
            onClick={onResetFilters}
            title="Reset all filters"
            className={`p-2 rounded-lg border text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer ${
              isDark ? 'border-slate-800 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-100'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Filter Selectors Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
        {/* Category */}
        <div>
          <label className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            <Tag className="w-3 h-3 text-blue-500" />
            <span>Category</span>
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className={`w-full px-2.5 py-1.5 text-xs rounded-lg border focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans ${
              isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Region */}
        <div>
          <label className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            <Globe className="w-3 h-3 text-indigo-500" />
            <span>Region</span>
          </label>
          <select
            value={selectedRegion}
            onChange={(e) => onRegionChange(e.target.value)}
            className={`w-full px-2.5 py-1.5 text-xs rounded-lg border focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans ${
              isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            {REGIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* Industry */}
        <div>
          <label className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            <Briefcase className="w-3 h-3 text-emerald-500" />
            <span>Industry</span>
          </label>
          <select
            value={selectedIndustry}
            onChange={(e) => onIndustryChange(e.target.value)}
            className={`w-full px-2.5 py-1.5 text-xs rounded-lg border focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans ${
              isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            {INDUSTRIES.map((ind) => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            <ArrowUpDown className="w-3 h-3 text-amber-500" />
            <span>Sort By</span>
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className={`w-full px-2.5 py-1.5 text-xs rounded-lg border focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans ${
              isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            <option value="priority">Priority Score (Highest first)</option>
            <option value="latest">Latest Published Time</option>
            <option value="procurement">Procurement Impact</option>
            <option value="relevance">Relevance Score</option>
          </select>
        </div>

        {/* Min Relevance Slider */}
        <div className="col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            <span className="flex items-center gap-1">
              <Gauge className="w-3 h-3 text-rose-500" />
              <span>Min Priority</span>
            </span>
            <span className="font-mono text-slate-700 dark:text-slate-200 font-bold">{minRelevance}/100</span>
          </div>
          <input
            type="range"
            min={0}
            max={85}
            step={5}
            value={minRelevance}
            onChange={(e) => onMinRelevanceChange(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-2"
          />
        </div>
      </div>
    </div>
  );
};
