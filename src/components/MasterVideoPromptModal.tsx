import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Copy,
  Check,
  Download,
  Film,
  RefreshCw,
  FileText,
  RotateCcw,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { NewsItem } from '../types/news';
import {
  MasterVideoPromptBlueprint,
  VideoAiEngine,
  PromptVisualAesthetic,
} from '../types/masterPrompt';
import {
  generateMasterPromptBlueprint,
  GeneratePromptOptions,
  MAX_MASTER_PROMPT_CHARS,
  clampMasterPromptUnderLimit
} from '../services/masterPromptGenerator';

interface MasterVideoPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: NewsItem | null;
  isDark: boolean;
  onOpenVideoBrief?: (item: NewsItem) => void;
  isVideoCreated?: boolean;
  videoCreatedDate?: string;
  onToggleVideoCreated?: (item: NewsItem, duration?: string) => void;
}

export const MasterVideoPromptModal: React.FC<MasterVideoPromptModalProps> = ({
  isOpen,
  onClose,
  item,
  isDark,
  onOpenVideoBrief,
  isVideoCreated = false,
  videoCreatedDate,
  onToggleVideoCreated,
}) => {
  const [engine, setEngine] = useState<VideoAiEngine>('runway-gen3');
  const [aesthetic, setAesthetic] = useState<PromptVisualAesthetic>('cinematic-documentary');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9');
  const [duration, setDuration] = useState<string>('60s');
  const [language, setLanguage] = useState<'English' | 'Bangla' | 'Bilingual'>('English');

  const [copied, setCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [blueprint, setBlueprint] = useState<MasterVideoPromptBlueprint | null>(null);
  const [customPromptText, setCustomPromptText] = useState<string>('');

  // Generate blueprint when item or options change
  useEffect(() => {
    if (item && isOpen) {
      const options: GeneratePromptOptions = {
        engine,
        aesthetic,
        aspectRatio,
        targetDuration: duration,
        language,
      };
      const result = generateMasterPromptBlueprint(item, options);
      setBlueprint(result);
      setCustomPromptText(result.monolithicPrompt);
    }
  }, [item, isOpen, engine, aesthetic, aspectRatio, duration, language]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleDownload = () => {
    const textToDownload = customPromptText || blueprint?.monolithicPrompt;
    if (!textToDownload || !blueprint) return;
    const blob = new Blob([textToDownload], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `master-detailed-video-prompt-${blueprint.newsItemId}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleRegenerate = () => {
    if (!item) return;
    setIsRegenerating(true);
    setTimeout(() => {
      const options: GeneratePromptOptions = {
        engine,
        aesthetic,
        aspectRatio,
        targetDuration: duration,
        language,
      };
      const result = generateMasterPromptBlueprint(item, options);
      setBlueprint(result);
      setCustomPromptText(result.monolithicPrompt);
      setIsRegenerating(false);
    }, 350);
  };

  const handleResetToGenerated = () => {
    if (blueprint) {
      setCustomPromptText(blueprint.monolithicPrompt);
    }
  };

  if (!isOpen || !item || !blueprint) return null;

  const currentPrompt = customPromptText || blueprint.monolithicPrompt;
  const wordCount = currentPrompt.trim().split(/\s+/).filter(Boolean).length;
  const charCount = currentPrompt.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
      <div
        className={`w-full max-w-4xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh] ${
          isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-600 text-white shadow-sm flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  Master Detailed Video Prompt
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                  isDark ? 'bg-purple-950/70 text-purple-300 border border-purple-800' : 'bg-purple-50 text-purple-700 border border-purple-200'
                }`}>
                  Single All-in-One Blueprint
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold ${
                  isDark ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  Max 4,900 Chars
                </span>
                {isVideoCreated && (
                  <span className="inline-flex items-center gap-1 text-[10px] px-2.5 py-0.5 rounded-full font-semibold bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/40">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    <span>Video Created · {videoCreatedDate}</span>
                  </span>
                )}
              </div>
              <h2 className="text-sm sm:text-base font-bold line-clamp-1 mt-0.5">
                {item.headline}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
              title="Download Prompt as .txt"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export .txt</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Configuration Bar */}
        <div className={`p-3 sm:px-5 border-b text-xs flex flex-wrap items-center justify-between gap-3 ${
          isDark ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          {/* Target Engine */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Target AI:</span>
            <select
              value={engine}
              onChange={(e) => setEngine(e.target.value as any)}
              className={`py-1 px-2 rounded-lg border text-xs font-semibold ${
                isDark ? 'bg-slate-900 border-slate-700 text-purple-300' : 'bg-white border-slate-300 text-purple-700'
              }`}
            >
              <option value="runway-gen3">Runway Gen-3 Alpha</option>
              <option value="openai-sora">OpenAI Sora</option>
              <option value="kling-ai">Kling AI 1.5</option>
              <option value="luma-dream-machine">Luma Dream Machine</option>
              <option value="invideo-ai">InVideo AI / HeyGen</option>
              <option value="midjourney-haiper">Midjourney + Haiper</option>
              <option value="universal">Universal Prompt</option>
            </select>
          </div>

          {/* Aesthetic Style */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Aesthetic:</span>
            <select
              value={aesthetic}
              onChange={(e) => setAesthetic(e.target.value as any)}
              className={`py-1 px-2 rounded-lg border text-xs font-semibold ${
                isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-800'
              }`}
            >
              <option value="cinematic-documentary">Cinematic Documentary (ARRI 4K)</option>
              <option value="hyper-realistic-broadcast">Hyper-Realistic Broadcast (Bloomberg/Reuters)</option>
              <option value="drone-aerial-logistics">Drone Aerial & Maritime Logistics</option>
              <option value="tactical-cyber-intelligence">Tactical Cyber Intelligence</option>
              <option value="minimalist-corporate-data">Minimalist Studio Explainer</option>
            </select>
          </div>

          {/* Duration in Minutes */}
          <div className="flex items-center gap-1">
            <span className="text-slate-500 font-medium mr-1 flex items-center gap-1">
              <Clock className="w-3 h-3 text-purple-500" />
              <span>Duration:</span>
            </span>
            {[
              { id: '30s', label: '30s' },
              { id: '60s', label: '1m' },
              { id: '3m', label: '3m' },
              { id: '5m', label: '5m' },
              { id: '10m', label: '10m' },
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => setDuration(d.id)}
                className={`px-2 py-0.5 rounded text-xs font-semibold transition-colors ${
                  duration === d.id
                    ? 'bg-purple-600 text-white shadow-xs font-bold'
                    : isDark
                      ? 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                      : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
                title={`Generate ${d.label} detailed prompt as per timeline`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* Aspect Ratio */}
          <div className="flex items-center gap-1">
            <span className="text-slate-500 font-medium mr-1">Ratio:</span>
            {(['16:9', '9:16', '1:1'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setAspectRatio(r)}
                className={`px-2 py-0.5 rounded text-xs font-mono font-medium transition-colors ${
                  aspectRatio === r
                    ? 'bg-purple-600 text-white'
                    : isDark
                      ? 'bg-slate-900 text-slate-400 hover:text-slate-200'
                      : 'bg-white text-slate-600 hover:bg-slate-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Language */}
          <div className="flex items-center gap-1">
            <span className="text-slate-500 font-medium mr-1">Voiceover:</span>
            {(['English', 'Bangla', 'Bilingual'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                  language === lang
                    ? 'bg-purple-600 text-white'
                    : isDark
                      ? 'bg-slate-900 text-slate-400 hover:text-slate-200'
                      : 'bg-white text-slate-600 hover:bg-slate-200'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          <button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all ${
              isRegenerating
                ? 'opacity-60 cursor-not-allowed'
                : isDark
                  ? 'border-purple-800 text-purple-300 hover:bg-purple-950/50'
                  : 'border-purple-300 text-purple-700 hover:bg-purple-50'
            }`}
          >
            <RefreshCw className={`w-3 h-3 ${isRegenerating ? 'animate-spin' : ''}`} />
            <span>Regenerate</span>
          </button>
        </div>

        {/* Prompt Information Bar */}
        <div className={`px-4 sm:px-5 py-2.5 border-b flex flex-wrap items-center justify-between gap-3 text-xs ${
          isDark ? 'bg-slate-950/30 border-slate-800' : 'bg-slate-50/50 border-slate-200'
        }`}>
          <div className="flex items-center gap-3 text-slate-500">
            <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
              <FileText className="w-3.5 h-3.5 text-purple-500" />
              <span>Complete Master Prompt</span>
            </div>
            <span className="text-slate-400">·</span>
            <span className="font-mono text-[11px]">{wordCount} words</span>
            <span className="text-slate-400">·</span>
            <span className={`font-mono text-[11px] px-2 py-0.5 rounded-md font-semibold transition-colors ${
              charCount >= 4900
                ? 'bg-amber-500/20 text-amber-500 border border-amber-500/40'
                : charCount >= 4500
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  : isDark
                    ? 'bg-slate-900 text-purple-300 border border-purple-900/50'
                    : 'bg-purple-50 text-purple-700 border border-purple-200'
            }`}>
              {charCount.toLocaleString()} / 4,900 max chars
            </span>
            <span className="text-[10px] text-slate-400 hidden md:inline">
              ({4900 - charCount >= 0 ? `${4900 - charCount} left` : 'Limit reached'})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetToGenerated}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] transition-colors ${
                isDark ? 'border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
              title="Reset prompt back to generated default"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>

            <button
              onClick={() => handleCopy(currentPrompt)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold text-xs transition-all shadow-xs ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Prompt!' : 'Copy Master Prompt'}</span>
            </button>
          </div>
        </div>

        {/* Single Detailed Prompt Content Area */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto">
          <div className="relative h-full flex flex-col">
            <textarea
              value={customPromptText}
              maxLength={MAX_MASTER_PROMPT_CHARS}
              onChange={(e) => {
                const val = e.target.value;
                setCustomPromptText(val.length > MAX_MASTER_PROMPT_CHARS ? val.slice(0, MAX_MASTER_PROMPT_CHARS) : val);
              }}
              placeholder="Detailed Master Video Prompt..."
              className={`w-full flex-1 min-h-[380px] p-4 rounded-xl font-mono text-xs leading-relaxed border select-all transition-colors focus:outline-hidden ${
                charCount >= 4900
                  ? 'border-amber-500/70 focus:border-amber-500'
                  : isDark
                    ? 'bg-slate-950 border-slate-800 text-slate-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50'
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-purple-600 focus:ring-1 focus:ring-purple-600/50'
              }`}
            />
            <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Strictly constrained to 4,900 characters maximum for reliable compatibility with AI video generators.</span>
              <span className="font-mono text-[11px] text-slate-500">
                {Math.max(0, 4900 - charCount)} chars remaining
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60 text-xs">
          <div className="flex items-center gap-2">
            {onToggleVideoCreated && (
              <button
                onClick={() => onToggleVideoCreated(item, duration === '60s' ? '1m' : duration)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold transition-colors ${
                  isVideoCreated
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : isDark
                      ? 'border-emerald-800 text-emerald-300 hover:bg-emerald-950/50'
                      : 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'
                }`}
                title={isVideoCreated ? `Video created on ${videoCreatedDate} (click to toggle)` : `Mark ${duration === '60s' ? '1m' : duration} video as created today`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isVideoCreated ? `Video Created (${videoCreatedDate})` : `Mark ${duration === '60s' ? '1m' : duration} Created`}</span>
              </button>
            )}

            {onOpenVideoBrief && (
              <button
                onClick={() => {
                  onClose();
                  onOpenVideoBrief(item);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold transition-colors ${
                  isDark ? 'border-rose-900/60 text-rose-300 hover:bg-rose-950/50' : 'border-rose-200 text-rose-700 hover:bg-rose-50'
                }`}
              >
                <Film className="w-3.5 h-3.5 text-rose-500" />
                <span>Switch to Video Brief Script</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy(currentPrompt)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold transition-all shadow-xs ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Master Prompt'}</span>
            </button>

            <button
              onClick={onClose}
              className={`flex items-center gap-1 px-4 py-2 rounded-xl border font-medium transition-colors cursor-pointer ${
                isDark ? 'border-slate-800 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <X className="w-3.5 h-3.5" />
              <span>Close</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
