import React, { useState } from 'react';
import { X, Bookmark, Folder, Trash2, ExternalLink, FileEdit, Check, FileText, ChevronRight } from 'lucide-react';
import { NewsItem, SavedBookmark } from '../types/news';
import { formatLocalDateTime } from '../utils/formatters';

interface SavedArticlesModalProps {
  bookmarks: SavedBookmark[];
  items: NewsItem[];
  onRemoveBookmark: (newsItemId: string) => void;
  onUpdateBookmark: (bookmark: SavedBookmark) => void;
  onOpenAnalysis: (item: NewsItem) => void;
  onClose: () => void;
  isDark: boolean;
}

const FOLDERS = ['All', 'Supplier Risk', 'Logistics', 'China & Trade', 'Procurement Strategy', 'Bangladesh'];

export const SavedArticlesModal: React.FC<SavedArticlesModalProps> = ({
  bookmarks,
  items,
  onRemoveBookmark,
  onUpdateBookmark,
  onOpenAnalysis,
  onClose,
  isDark,
}) => {
  const [selectedFolder, setSelectedFolder] = useState('All');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [tempNote, setTempNote] = useState('');

  const filteredBookmarks = bookmarks.filter((b) => {
    if (selectedFolder === 'All') return true;
    return b.folder === selectedFolder;
  });

  const handleStartEditNote = (b: SavedBookmark) => {
    setEditingNoteId(b.newsItemId);
    setTempNote(b.note || '');
  };

  const handleSaveNote = (b: SavedBookmark) => {
    onUpdateBookmark({ ...b, note: tempNote });
    setEditingNoteId(null);
  };

  const handleFolderChange = (b: SavedBookmark, folder: string) => {
    onUpdateBookmark({ ...b, folder });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div
        className={`w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden transition-all ${
          isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Bookmark className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-base font-bold">Saved Intelligence Dossier</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {bookmarks.length} bookmarked stories with notes and customized category folders
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Folder filter tabs */}
        <div className="flex items-center gap-1.5 px-5 py-2.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 text-xs overflow-x-auto scrollbar-none font-medium">
          <Folder className="w-3.5 h-3.5 text-slate-400 mr-1" />
          {FOLDERS.map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFolder(f)}
              className={`px-3 py-1 rounded-lg transition-colors whitespace-nowrap ${
                selectedFolder === f
                  ? isDark
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-slate-900 text-white font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Articles List */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1 text-xs">
          {filteredBookmarks.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Bookmark className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p>No bookmarked stories in this folder.</p>
              <p className="text-[11px] mt-1">Click the "Save" button on any intelligence card to file it here.</p>
            </div>
          ) : (
            filteredBookmarks.map((bm) => {
              const item = items.find((i) => i.id === bm.newsItemId);
              if (!item) return null;

              return (
                <div
                  key={bm.newsItemId}
                  className={`p-4 rounded-xl border transition-all ${
                    isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50/70 border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                        SCORE {item.priorityScore}
                      </span>
                      <span className="text-slate-400 font-mono text-[11px]">{item.source}</span>
                      <span className="text-slate-400 text-[11px]">
                        Saved {formatLocalDateTime(bm.savedAt)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <select
                        value={bm.folder}
                        onChange={(e) => handleFolderChange(bm, e.target.value)}
                        className={`text-[10px] px-2 py-0.5 rounded border ${
                          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                        }`}
                      >
                        {FOLDERS.filter((f) => f !== 'All').map((f) => (
                          <option key={f} value={f}>{f}</option>
                        ))}
                      </select>

                      <button
                        onClick={() => onRemoveBookmark(bm.newsItemId)}
                        className="text-slate-400 hover:text-rose-500 p-1"
                        title="Remove from saved"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h4
                    onClick={() => onOpenAnalysis(item)}
                    className="font-bold text-xs sm:text-sm cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 mb-2 leading-snug"
                  >
                    {item.headline}
                  </h4>

                  {/* Personal Note Editor */}
                  <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-800/80">
                    {editingNoteId === bm.newsItemId ? (
                      <div className="space-y-1.5">
                        <textarea
                          value={tempNote}
                          onChange={(e) => setTempNote(e.target.value)}
                          placeholder="Add procurement action note, supplier tag, or contingency plan..."
                          className={`w-full p-2 text-xs rounded-lg border resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                            isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-900'
                          }`}
                          rows={2}
                        />
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => setEditingNoteId(null)}
                            className="px-2 py-1 rounded text-[11px] text-slate-500"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveNote(bm)}
                            className="px-2.5 py-1 rounded bg-blue-600 text-white font-medium text-[11px] flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            <span>Save Note</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-slate-500 text-[11px]">
                        <span className="italic">
                          {bm.note ? `Note: "${bm.note}"` : 'No personal note attached.'}
                        </span>
                        <button
                          onClick={() => handleStartEditNote(bm)}
                          className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 text-[11px]"
                        >
                          <FileEdit className="w-3 h-3" />
                          <span>{bm.note ? 'Edit Note' : 'Add Note'}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mt-3 pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px]">
                    <button
                      onClick={() => onOpenAnalysis(item)}
                      className="font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View Analysis & Impact Matrix</span>
                      <ChevronRight className="w-3 h-3 opacity-60" />
                    </button>
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 ml-auto"
                    >
                      <span>Original Article</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end bg-slate-50 dark:bg-slate-950/60 text-xs">
          <button
            onClick={onClose}
            className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold hover:opacity-90 transition-opacity"
          >
            <X className="w-3.5 h-3.5" />
            <span>Close</span>
          </button>
        </div>
      </div>
    </div>
  );
};
