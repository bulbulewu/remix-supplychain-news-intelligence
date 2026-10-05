import React, { useState } from 'react';
import { X, SlidersHorizontal, Plus, Trash2, Bell, CheckCircle2, Tag, Check } from 'lucide-react';
import { UserAlertRule } from '../types/news';

interface WatchlistAlertsModalProps {
  watchlist: string[];
  onUpdateWatchlist: (tags: string[]) => void;
  alertRules: UserAlertRule[];
  onUpdateAlertRules: (rules: UserAlertRule[]) => void;
  onClose: () => void;
  isDark: boolean;
}

export const WatchlistAlertsModal: React.FC<WatchlistAlertsModalProps> = ({
  watchlist,
  onUpdateWatchlist,
  alertRules,
  onUpdateAlertRules,
  onClose,
  isDark,
}) => {
  const [newTag, setNewTag] = useState('');
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleScore, setNewRuleScore] = useState(85);
  const [newRuleCategory, setNewRuleCategory] = useState('Shipping');

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    if (!watchlist.includes(newTag.trim())) {
      onUpdateWatchlist([...watchlist, newTag.trim()]);
    }
    setNewTag('');
  };

  const handleRemoveTag = (tag: string) => {
    onUpdateWatchlist(watchlist.filter((t) => t !== tag));
  };

  const handleAddRule = () => {
    if (!newRuleName.trim()) return;
    const rule: UserAlertRule = {
      id: `rule-${Date.now()}`,
      name: newRuleName.trim(),
      minScore: newRuleScore,
      category: newRuleCategory,
      active: true,
    };
    onUpdateAlertRules([...alertRules, rule]);
    setNewRuleName('');
  };

  const handleToggleRule = (id: string) => {
    onUpdateAlertRules(
      alertRules.map((r) => (r.id === id ? { ...r, active: !r.active } : r))
    );
  };

  const handleDeleteRule = (id: string) => {
    onUpdateAlertRules(alertRules.filter((r) => r.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div
        className={`w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden transition-all ${
          isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Personalized Watchlist & Alerts</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Prioritize news matching your supply chain portfolio and set score thresholds
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

        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Section 1: Watchlist Tags */}
          <div>
            <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-blue-500" />
              <span>My Watchlist Keywords & Regions</span>
            </h4>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                placeholder="Add country, commodity, or industry (e.g. 'Bangladesh', 'Semiconductors')..."
                className={`flex-1 px-3 py-1.5 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
              <button
                onClick={handleAddTag}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {watchlist.map((tag) => (
                <span
                  key={tag}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium ${
                    isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-800'
                  }`}
                >
                  <span>{tag}</span>
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="text-slate-400 hover:text-rose-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Section 2: Alert Rules */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-amber-500" />
              <span>Automated Alert Rules</span>
            </h4>

            {/* Create new rule */}
            <div className={`p-3.5 rounded-xl border mb-3 space-y-2.5 ${
              isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="font-semibold text-slate-700 dark:text-slate-300">Create New Alert Condition</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  value={newRuleName}
                  onChange={(e) => setNewRuleName(e.target.value)}
                  placeholder="Rule label (e.g. Critical Port Shocks)..."
                  className={`px-2.5 py-1.5 rounded-lg border text-xs ${
                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  }`}
                />
                <select
                  value={newRuleCategory}
                  onChange={(e) => setNewRuleCategory(e.target.value)}
                  className={`px-2.5 py-1.5 rounded-lg border text-xs ${
                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  }`}
                >
                  <option value="Shipping">Category: Shipping</option>
                  <option value="Tariffs">Category: Tariffs</option>
                  <option value="Semiconductors">Category: Semiconductors</option>
                  <option value="Commodities">Category: Commodities</option>
                  <option value="Labor">Category: Labor</option>
                </select>
                <div className="flex items-center gap-1">
                  <span className="text-slate-400">Score ≥</span>
                  <input
                    type="number"
                    min={50}
                    max={99}
                    value={newRuleScore}
                    onChange={(e) => setNewRuleScore(Number(e.target.value))}
                    className={`w-14 px-2 py-1 rounded-lg border text-xs font-mono font-bold ${
                      isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                    }`}
                  />
                  <button
                    onClick={handleAddRule}
                    className="ml-auto px-2.5 py-1 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 text-xs flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Save</span>
                  </button>
                </div>
              </div>
            </div>

            {/* List existing rules */}
            <div className="space-y-2">
              {alertRules.map((rule) => (
                <div
                  key={rule.id}
                  className={`p-3 rounded-xl border flex items-center justify-between ${
                    isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={rule.active}
                      onChange={() => handleToggleRule(rule.id)}
                      className="rounded accent-blue-600"
                    />
                    <div>
                      <div className="font-semibold">{rule.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Alert when Priority ≥ {rule.minScore} & Category = {rule.category}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteRule(rule.id)}
                    className="text-slate-400 hover:text-rose-500 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end bg-slate-50 dark:bg-slate-950/60 text-xs">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold hover:opacity-90 transition-opacity"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply & Close</span>
          </button>
        </div>
      </div>
    </div>
  );
};
