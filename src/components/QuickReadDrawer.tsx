import React from 'react';
import {
  X,
  Zap,
  Trash2,
  ExternalLink,
  ChevronRight,
  Clapperboard,
  Sparkles,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { NewsItem, VideoCreatedRecord } from '../types/news';
import { formatTimeAgo } from '../utils/formatters';

interface QuickReadDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  stackIds: string[];
  items: NewsItem[];
  onRemoveFromStack: (id: string) => void;
  onClearStack: () => void;
  onOpenAnalysis: (item: NewsItem) => void;
  onCreateVideoBrief: (item: NewsItem) => void;
  onOpenMasterPrompt: (item: NewsItem) => void;
  videoCreatedMap: Record<string, VideoCreatedRecord>;
  onToggleVideoCreated: (item: NewsItem) => void;
  isDark: boolean;
}

export const QuickReadDrawer: React.FC<QuickReadDrawerProps> = ({
  isOpen,
  onClose,
  stackIds,
  items,
  onRemoveFromStack,
  onClearStack,
  onOpenAnalysis,
  onCreateVideoBrief,
  onOpenMasterPrompt,
  videoCreatedMap,
  onToggleVideoCreated,
  isDark,
}) => {
  if (!isOpen) return null;

  // Resolve items in the stack in preserved order
  const stackedItems: NewsItem[] = stackIds
    .map((id) => items.find((item) => item.id === id))
    .filter((item): item is NewsItem => Boolean(item));

  const handleReadFirst = () => {
    if (stackedItems.length > 0) {
      onOpenAnalysis(stackedItems[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div
        className={`w-full max-w-xl h-full flex flex-col shadow-2xl transition-all border-l ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight">Quick Read Stack</h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                  {stackedItems.length} {stackedItems.length === 1 ? 'item' : 'items'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Temporary session queue for rapid follow-up and video production
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {stackedItems.length > 0 && (
              <button
                onClick={onClearStack}
                className={`p-2 rounded-lg border text-xs text-slate-400 hover:text-rose-500 hover:border-rose-300 dark:hover:border-rose-900/60 transition-colors flex items-center gap-1`}
                title="Clear all items from Quick Read stack"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Close Quick Read stack"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
          {stackedItems.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center mx-auto mb-4 border border-amber-200/60 dark:border-amber-900/60">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="text-sm font-bold mb-1">Your Quick Read Stack is Empty</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-5 leading-relaxed">
                Click <span className="font-semibold text-amber-600 dark:text-amber-400">+ Quick Read</span> on any news card in the stream to move stories here for immediate follow-up during your current session.
              </p>
              <button
                onClick={onClose}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Browse News Stream</span>
              </button>
            </div>
          ) : (
            stackedItems.map((item, idx) => {
              const videoRecord = videoCreatedMap[item.id];
              const isVideoCreated = Boolean(videoRecord);

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isDark
                      ? 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                      : 'bg-white border-slate-200/90 shadow-xs hover:border-slate-300'
                  }`}
                >
                  {/* Top Bar of Card */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/60">
                        #{idx + 1}
                      </span>
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {item.source}
                      </span>
                      <span className="text-slate-300 dark:text-slate-700">·</span>
                      <span className="text-xs text-slate-400">
                        {formatTimeAgo(item.publishedAt)}
                      </span>
                      <span className="text-slate-300 dark:text-slate-700">·</span>
                      <span className="text-xs font-mono font-semibold text-rose-600 dark:text-rose-400">
                        Priority {item.priorityScore}
                      </span>
                    </div>

                    <button
                      onClick={() => onRemoveFromStack(item.id)}
                      className="p-1 rounded text-slate-400 hover:text-rose-500 transition-colors"
                      title="Remove from Quick Read stack"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Video Created Badge if marked */}
                  {isVideoCreated && (
                    <div className="mb-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        <span>Video Created · {videoRecord.formattedDate}</span>
                      </span>
                    </div>
                  )}

                  {/* Headline */}
                  <h3
                    onClick={() => onOpenAnalysis(item)}
                    className="text-sm font-bold leading-snug cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-2"
                  >
                    {item.headline}
                  </h3>

                  {/* Summary */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3 line-clamp-2">
                    {item.oneLineSummary}
                  </p>

                  {/* Quick Action Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        onClick={() => onOpenAnalysis(item)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-medium transition-colors ${
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
                        onClick={() => onCreateVideoBrief(item)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                          isDark
                            ? 'border-rose-900/60 text-rose-300 hover:bg-rose-950/40'
                            : 'border-rose-200 text-rose-700 hover:bg-rose-50'
                        }`}
                        title="Generate video brief script"
                      >
                        <Clapperboard className="w-3 h-3 text-rose-500" />
                        <span>Brief</span>
                      </button>

                      <button
                        onClick={() => onOpenMasterPrompt(item)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                          isDark
                            ? 'border-purple-900/60 text-purple-300 hover:bg-purple-950/40'
                            : 'border-purple-200 text-purple-700 hover:bg-purple-50'
                        }`}
                        title="Master video prompt"
                      >
                        <Sparkles className="w-3 h-3 text-purple-500" />
                        <span>Prompt</span>
                      </button>
                    </div>

                    {/* Mark as Video Created Toggle */}
                    <button
                      onClick={() => onToggleVideoCreated(item)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium text-[11px] border transition-colors ${
                        isVideoCreated
                          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30'
                          : isDark
                            ? 'border-slate-700 text-slate-400 hover:text-emerald-300 hover:border-emerald-800'
                            : 'border-slate-300 text-slate-600 hover:text-emerald-700 hover:border-emerald-300'
                      }`}
                      title={isVideoCreated ? 'Click to unmark video created' : 'Mark as video created today'}
                    >
                      <CheckCircle2 className={`w-3 h-3 ${isVideoCreated ? 'text-emerald-500' : 'text-slate-400'}`} />
                      <span>{isVideoCreated ? 'Created' : 'Mark Created'}</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {stackedItems.length > 0 && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">
              {stackedItems.length} {stackedItems.length === 1 ? 'story' : 'stories'} ready for action
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handleReadFirst}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold transition-all shadow-xs"
              >
                <span>Read First Item</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onClose}
                className={`flex items-center gap-1 px-3.5 py-2 rounded-xl border transition-colors cursor-pointer ${
                  isDark ? 'border-slate-800 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <X className="w-3.5 h-3.5" />
                <span>Close</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
