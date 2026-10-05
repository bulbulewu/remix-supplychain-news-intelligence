import React, { useState, useMemo } from 'react';
import {
  X,
  CheckCircle2,
  Calendar,
  Search,
  Clapperboard,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Filter,
  Trash2,
  Clock,
  FileText
} from 'lucide-react';
import { NewsItem, VideoCreatedRecord } from '../types/news';

interface VideoCreatedTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoCreatedMap: Record<string, VideoCreatedRecord>;
  onRemoveRecord: (newsItemId: string) => void;
  items: NewsItem[];
  onOpenAnalysis: (item: NewsItem) => void;
  onCreateVideoBrief: (item: NewsItem) => void;
  onOpenMasterPrompt: (item: NewsItem) => void;
  onFilterRemainingOnly?: () => void;
  isDark: boolean;
}

export const VideoCreatedTrackerModal: React.FC<VideoCreatedTrackerModalProps> = ({
  isOpen,
  onClose,
  videoCreatedMap,
  onRemoveRecord,
  items,
  onOpenAnalysis,
  onCreateVideoBrief,
  onOpenMasterPrompt,
  onFilterRemainingOnly,
  isDark,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const recordsList: VideoCreatedRecord[] = useMemo(() => {
    return Object.values(videoCreatedMap).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [videoCreatedMap]);

  const filteredRecords = useMemo(() => {
    if (!searchQuery.trim()) return recordsList;
    const q = searchQuery.toLowerCase();
    return recordsList.filter(
      (r) =>
        r.headline.toLowerCase().includes(q) ||
        r.formattedDate.toLowerCase().includes(q) ||
        (r.category && r.category.toLowerCase().includes(q)) ||
        (r.source && r.source.toLowerCase().includes(q))
    );
  }, [recordsList, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div
        className={`w-full max-w-3xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col my-auto max-h-[90vh] ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold tracking-tight">
                  Video Production History Tracker
                </h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  {recordsList.length} {recordsList.length === 1 ? 'Topic' : 'Topics'} Created
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Keep track of daily news topics where you've produced a video, with verified dates
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar & Search */}
        <div className={`p-3.5 sm:px-5 border-b text-xs flex flex-wrap items-center justify-between gap-3 ${
          isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50/70 border-slate-200'
        }`}>
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search created topics by headline, source, or date..."
              className={`w-full pl-8 pr-3 py-1.5 rounded-lg border text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                isDark
                  ? 'bg-slate-900 border-slate-700 text-slate-200'
                  : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
          </div>

          {onFilterRemainingOnly && (
            <button
              onClick={() => {
                onFilterRemainingOnly();
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Show Pending Topics in Stream</span>
            </button>
          )}
        </div>

        {/* List of Created Videos */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-3">
          {filteredRecords.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center mx-auto mb-3 border border-emerald-200/60 dark:border-emerald-900/60">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold mb-1">
                {searchQuery ? 'No matching topics found' : 'No Videos Marked as Created Yet'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed mb-4">
                After creating a video for a top news story, click <span className="font-semibold text-emerald-600 dark:text-emerald-400">Mark Created</span> on the news card, brief, or master prompt to log it here with today's date.
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
              >
                Back to Top News
              </button>
            </div>
          ) : (
            filteredRecords.map((record) => {
              const matchedNewsItem = items.find((i) => i.id === record.newsItemId);
              const createdDateFormatted = new Date(record.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={record.newsItemId}
                  className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
                    isDark
                      ? 'bg-slate-950/50 border-slate-800 hover:border-emerald-500/40'
                      : 'bg-white border-slate-200 hover:border-emerald-400 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {/* Date Badge */}
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                          <Calendar className="w-3 h-3 text-emerald-500" />
                          <span>Video Created on {createdDateFormatted}</span>
                        </span>

                        {record.durations && record.durations.length > 0 ? (
                          record.durations.map((dur: string) => (
                            <span key={dur} className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-600 text-white shadow-2xs">
                              ✓ {dur}
                            </span>
                          ))
                        ) : record.duration ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-600 text-white shadow-2xs">
                            ✓ {record.duration}
                          </span>
                        ) : null}

                        {record.source && (
                          <span className="text-xs text-slate-500 font-medium">
                            {record.source}
                          </span>
                        )}

                        {record.priorityScore && (
                          <span className="text-xs font-mono font-bold text-rose-500">
                            Score {record.priorityScore}
                          </span>
                        )}
                      </div>

                      {/* Headline */}
                      <h3
                        onClick={() => matchedNewsItem && onOpenAnalysis(matchedNewsItem)}
                        className={`text-sm font-bold leading-snug line-clamp-2 ${
                          matchedNewsItem ? 'cursor-pointer hover:text-blue-500 transition-colors' : ''
                        }`}
                      >
                        {record.headline}
                      </h3>
                    </div>

                    {/* Unmark Button */}
                    <button
                      onClick={() => onRemoveRecord(record.newsItemId)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors shrink-0"
                      title="Unmark / remove from video created history"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Action Bar */}
                  {matchedNewsItem && (
                    <div className="flex flex-wrap items-center gap-2 mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                      <button
                        onClick={() => onOpenAnalysis(matchedNewsItem)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                          isDark
                            ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                            : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <FileText className="w-3 h-3 text-blue-500" />
                        <span>Full Analysis</span>
                        <ChevronRight className="w-3 h-3 opacity-60" />
                      </button>

                      <button
                        onClick={() => onCreateVideoBrief(matchedNewsItem)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                          isDark
                            ? 'border-rose-900/60 text-rose-300 hover:bg-rose-950/40'
                            : 'border-rose-200 text-rose-700 hover:bg-rose-50'
                        }`}
                      >
                        <Clapperboard className="w-3 h-3 text-rose-500" />
                        <span>Video Brief</span>
                      </button>

                      <button
                        onClick={() => onOpenMasterPrompt(matchedNewsItem)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                          isDark
                            ? 'border-purple-900/60 text-purple-300 hover:bg-purple-950/40'
                            : 'border-purple-200 text-purple-700 hover:bg-purple-50'
                        }`}
                      >
                        <Sparkles className="w-3 h-3 text-purple-500" />
                        <span>Master Video Prompt</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400">
            {recordsList.length} total videos tracked across all daily cycles
          </span>
          <button
            onClick={onClose}
            className={`flex items-center gap-1 px-4 py-2 rounded-xl border transition-colors cursor-pointer ${
              isDark ? 'border-slate-800 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <X className="w-3.5 h-3.5" />
            <span>Close</span>
          </button>
        </div>
      </div>
    </div>
  );
};
