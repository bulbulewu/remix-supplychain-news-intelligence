import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Clapperboard,
  ShieldCheck,
  ExternalLink,
  Copy,
  Check,
  Download,
  Bookmark,
  RotateCcw,
  Sparkles,
  Layers,
  FileText,
  AlertTriangle,
  History,
  Edit3,
  Globe,
  Film,
  ListChecks,
  Clock,
  Eye,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Hash,
  Plus,
  Trash2,
  Save,
  SlidersHorizontal,
  FolderOpen
} from 'lucide-react';
import { NewsItem } from '../types/news';
import {
  VideoBrief,
  VideoPlatform,
  VideoDuration,
  VideoAspectRatio,
  VideoLanguage,
  VideoTone,
  CustomScriptTemplate
} from '../types/videoBrief';
import { BUILT_IN_SCRIPT_TEMPLATES } from '../data/defaultScriptTemplates';
import { formatLocalDateTime } from '../utils/formatters';

interface VideoBriefModalProps {
  item: NewsItem | null;
  onClose: () => void;
  onSaveBrief?: (brief: VideoBrief) => void;
  isVideoCreated?: boolean;
  videoCreatedDate?: string;
  onToggleVideoCreated?: (item: NewsItem, duration?: string) => void;
  isDark: boolean;
}

const PLATFORMS: VideoPlatform[] = [
  'YouTube Shorts',
  'YouTube',
  'Facebook Reels',
  'Facebook',
  'Instagram Reels',
  'TikTok',
  'LinkedIn',
];

const DURATIONS: VideoDuration[] = ['30s', '45s', '60s', '1m', '2m', '3m', '5m', '10m'];

const DURATION_ITEMS: { value: VideoDuration; label: string; short: string }[] = [
  { value: '30s', label: '30 Seconds (Hook / Shorts / Reels)', short: '30s' },
  { value: '60s', label: '1 Minute (Short Explainer / Digest)', short: '1 Min' },
  { value: '3m', label: '3 Minutes (In-Depth Executive Brief)', short: '3 Min' },
  { value: '5m', label: '5 Minutes (Full Documentary Video)', short: '5 Min' },
  { value: '10m', label: '10 Minutes (Comprehensive Deep Dive)', short: '10 Min' },
];

const ASPECT_RATIOS: VideoAspectRatio[] = ['9:16', '16:9', '1:1'];

const LANGUAGES: VideoLanguage[] = ['Bangla', 'English', 'Bangla + English'];

const TONES: VideoTone[] = [
  'Hard-Hitting Financial',
  'Casual Summary',
  'Professional News Documentary',
  'Business Intelligence',
  'Explainer',
  'Urgent',
  'Cinematic',
  'Investigative',
  'Calm',
];

const REGEN_MODIFIERS = [
  'More concise & fast-paced',
  'More documentary style',
  'More engaging storytelling',
  'More executive / CPO focus',
  'More analytical with statistics',
  'More beginner-friendly',
];

export const VideoBriefModal: React.FC<VideoBriefModalProps> = ({
  item,
  onClose,
  onSaveBrief,
  isVideoCreated = false,
  videoCreatedDate,
  onToggleVideoCreated,
  isDark,
}) => {
  if (!item) return null;

  // Configuration state
  const [platform, setPlatform] = useState<VideoPlatform>('YouTube Shorts');
  const [duration, setDuration] = useState<VideoDuration>('60s');
  const [aspectRatio, setAspectRatio] = useState<VideoAspectRatio>('9:16');
  const [language, setLanguage] = useState<VideoLanguage>('Bangla');
  const [tone, setTone] = useState<VideoTone>('Hard-Hitting Financial');

  // Custom Script Templates state
  const [userTemplates, setUserTemplates] = useState<CustomScriptTemplate[]>(() => {
    try {
      const saved = localStorage.getItem('sc_custom_script_templates');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const allTemplates = useMemo(() => {
    return [...BUILT_IN_SCRIPT_TEMPLATES, ...userTemplates];
  }, [userTemplates]);

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('template-hard-hitting-financial');
  const [isSavingNewTemplate, setIsSavingNewTemplate] = useState(false);
  const [isManagingTemplates, setIsManagingTemplates] = useState(false);
  const [showTemplateDetails, setShowTemplateDetails] = useState(false);

  // New template form state
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateTone, setNewTemplateTone] = useState<string>('Hard-Hitting Financial');
  const [newTemplateDescription, setNewTemplateDescription] = useState('');
  const [newTemplateGuidance, setNewTemplateGuidance] = useState('');
  const [newTemplateHookStyle, setNewTemplateHookStyle] = useState('');
  const [newTemplateCta, setNewTemplateCta] = useState('');

  const activeTemplate = useMemo(() => {
    return allTemplates.find((t) => t.id === selectedTemplateId) || allTemplates[0];
  }, [allTemplates, selectedTemplateId]);

  const handleApplyTemplate = (templateId: string) => {
    const tmpl = allTemplates.find((t) => t.id === templateId);
    if (!tmpl) return;
    setSelectedTemplateId(tmpl.id);
    setTone(tmpl.tone as VideoTone);
    if (tmpl.preferredPlatform) setPlatform(tmpl.preferredPlatform);
    handleGenerateBrief(undefined, undefined, tmpl);
  };

  const handleSaveCustomTemplate = () => {
    if (!newTemplateName.trim()) return;
    const newTmpl: CustomScriptTemplate = {
      id: `custom-template-${Date.now()}`,
      name: newTemplateName.trim(),
      tone: newTemplateTone || 'Custom',
      description: newTemplateDescription.trim() || `Custom script style based on ${newTemplateTone}`,
      styleGuidance: newTemplateGuidance.trim() || `Format the voiceover script with a ${newTemplateTone} focus.`,
      hookStyle: newTemplateHookStyle.trim() || `Engaging ${newTemplateTone} opening hook.`,
      pacing: 'Dynamic, engaging',
      ctaTemplate: newTemplateCta.trim(),
      preferredPlatform: platform,
      isBuiltIn: false,
      createdAt: new Date().toISOString(),
    };

    const updated = [newTmpl, ...userTemplates];
    setUserTemplates(updated);
    localStorage.setItem('sc_custom_script_templates', JSON.stringify(updated));
    setSelectedTemplateId(newTmpl.id);
    setTone(newTmpl.tone as VideoTone);
    setIsSavingNewTemplate(false);

    // Reset form
    setNewTemplateName('');
    setNewTemplateDescription('');
    setNewTemplateGuidance('');
    setNewTemplateHookStyle('');
    setNewTemplateCta('');

    handleGenerateBrief(undefined, undefined, newTmpl);
  };

  const handleDeleteCustomTemplate = (id: string) => {
    const updated = userTemplates.filter((t) => t.id !== id);
    setUserTemplates(updated);
    localStorage.setItem('sc_custom_script_templates', JSON.stringify(updated));
    if (selectedTemplateId === id) {
      setSelectedTemplateId('template-hard-hitting-financial');
    }
  };

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentBrief, setCurrentBrief] = useState<VideoBrief | null>(null);
  const [versionHistory, setVersionHistory] = useState<VideoBrief[]>([]);
  const [activeTab, setActiveTab] = useState<'script' | 'metadata' | 'scenePlan' | 'factCheck'>('script');

  // Copy feedback
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // User editing state
  const [isEditingScript, setIsEditingScript] = useState(false);
  const [editableNarration, setEditableNarration] = useState('');
  const [isUserEdited, setIsUserEdited] = useState(false);

  // Initial load check in local cache or generate
  useEffect(() => {
    const cachedKey = `sc_brief_${item.id}_${language}_${duration}`;
    const cached = localStorage.getItem(cachedKey);
    if (cached) {
      try {
        const parsed: VideoBrief = JSON.parse(cached);
        setCurrentBrief(parsed);
        setEditableNarration(parsed.script.fullNarration);
        setVersionHistory([parsed]);
        return;
      } catch (e) {
        console.error('Failed to parse cached video brief:', e);
      }
    }

    // Otherwise generate initial brief
    handleGenerateBrief();
  }, [item.id]);

  const handleGenerateBrief = async (
    modifier?: string,
    overrideDuration?: VideoDuration,
    overrideTemplate?: CustomScriptTemplate
  ) => {
    const targetDuration = overrideDuration || duration;
    const targetTemplate = overrideTemplate || activeTemplate;
    const targetTone = targetTemplate ? targetTemplate.tone : tone;
    setIsGenerating(true);
    setIsUserEdited(false);
    setIsSaved(false);

    try {
      const nextVersion = (currentBrief?.version || 0) + 1;
      const res = await fetch('/api/video-brief/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item,
          options: {
            platform,
            duration: targetDuration,
            aspectRatio,
            language,
            tone: targetTone,
            version: nextVersion,
            modifier,
            templateGuidance: targetTemplate?.styleGuidance,
            hookStyle: targetTemplate?.hookStyle,
            ctaTemplate: targetTemplate?.ctaTemplate,
          },
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        const newBrief: VideoBrief = json.data;
        setCurrentBrief(newBrief);
        setEditableNarration(newBrief.script.fullNarration);
        setVersionHistory((prev) => [newBrief, ...prev.filter((v) => v.id !== newBrief.id)]);

        // Cache for fast re-opening
        localStorage.setItem(`sc_brief_${item.id}_${language}_${targetDuration}`, JSON.stringify(newBrief));
      }
    } catch (e) {
      console.error('Error in video brief generation:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDurationChange = (newDur: VideoDuration) => {
    setDuration(newDur);
    handleGenerateBrief(undefined, newDur);
  };

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback(label);
    setTimeout(() => setCopyFeedback(null), 2000);
  };

  const handleCopyEverything = () => {
    if (!currentBrief) return;
    const allText = `
${currentBrief.titles[0] || currentBrief.headline}
[Platform: ${currentBrief.platform} | Ratio: ${currentBrief.aspectRatio} | Duration: ${currentBrief.duration} | Language: ${currentBrief.language}]

HOOK:
${currentBrief.script.hook}

SCRIPT NARRATION:
${editableNarration || currentBrief.script.fullNarration}

WHAT WE KNOW:
${currentBrief.whatWeKnow.map((k) => `• ${k}`).join('\n')}

WHAT IS NOT YET CONFIRMED:
${currentBrief.whatIsNotConfirmed.map((u) => `• ${u}`).join('\n')}

5 VIDEO TITLES:
${currentBrief.titles.map((t, i) => `${i + 1}. ${t}`).join('\n')}

5 ALTERNATIVE HOOKS:
${currentBrief.hooks.map((h, i) => `${i + 1}. ${h}`).join('\n')}

5 THUMBNAIL TEXTS:
${currentBrief.thumbnailTexts.map((th, i) => `${i + 1}. ${th}`).join('\n')}

DESCRIPTION:
${currentBrief.description}

HASHTAGS:
${currentBrief.hashtags.join(' ')}

SEO KEYWORDS:
${currentBrief.seoKeywords.join(', ')}

SCENE PLAN:
${currentBrief.scenePlan
  .map(
    (s) =>
      `[Scene ${s.sceneNumber} (${s.timestamp})]
Narration: ${s.narration}
Visual: ${s.visualDirection} (${s.visualType})
Text on screen: ${s.onScreenText || 'N/A'}`
  )
  .join('\n\n')}

SOURCES GROUNDING:
${currentBrief.sourcesUsed.map((src) => `• ${src.name}: ${src.url}`).join('\n')}

FACT-LOCKED VERIFICATION:
Confidence: ${currentBrief.factCheck.confidence}
Sources Checked: ${currentBrief.factCheck.sourcesCheckedCount} | Claims Verified: ${currentBrief.factCheck.claimsCheckedCount}
Verified: ${currentBrief.factCheck.verifiedTimestamp}
    `.trim();

    handleCopyText(allText, 'Everything');
  };

  const handleDownloadTXT = () => {
    if (!currentBrief) return;
    const content = `
${currentBrief.titles[0] || currentBrief.headline}
Platform: ${currentBrief.platform} | Length: ${currentBrief.duration} | Language: ${currentBrief.language}
Fact-Locked: ${currentBrief.factCheck.isFactLocked ? 'YES' : 'NO'} (${currentBrief.factCheck.confidence} Confidence)

=== SCRIPT NARRATION ===
${editableNarration || currentBrief.script.fullNarration}

=== 5 TITLES ===
${currentBrief.titles.join('\n')}

=== 5 HOOKS ===
${currentBrief.hooks.join('\n')}

=== 5 THUMBNAIL TEXT OPTIONS ===
${currentBrief.thumbnailTexts.join('\n')}

=== DESCRIPTION ===
${currentBrief.description}

=== HASHTAGS & SEO ===
${currentBrief.hashtags.join(' ')}
Keywords: ${currentBrief.seoKeywords.join(', ')}

=== SCENE BREAKDOWN ===
${currentBrief.scenePlan.map((s) => `[Scene ${s.sceneNumber} | ${s.timestamp}]\nNarration: ${s.narration}\nVisual: ${s.visualDirection}\nVisual Type: ${s.visualType}`).join('\n\n')}

=== SOURCES ===
${currentBrief.sourcesUsed.map((s) => `${s.name}: ${s.url}`).join('\n')}
    `.trim();

    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `Video_Brief_${item.id}_${language}.txt`;
    document.body.appendChild(element);
    element.click();
    element.remove();
  };

  const handleDownloadJSON = () => {
    if (!currentBrief) return;
    const briefWithEdits = {
      ...currentBrief,
      script: {
        ...currentBrief.script,
        fullNarration: editableNarration,
      },
      isUserEdited,
    };
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(briefWithEdits, null, 2)], {
      type: 'application/json',
    });
    element.href = URL.createObjectURL(file);
    element.download = `Video_Brief_${item.id}.json`;
    document.body.appendChild(element);
    element.click();
    element.remove();
  };

  const handleSaveBrief = () => {
    if (!currentBrief) return;
    const toSave: VideoBrief = {
      ...currentBrief,
      script: {
        ...currentBrief.script,
        fullNarration: editableNarration,
      },
      isUserEdited,
    };
    if (onSaveBrief) onSaveBrief(toSave);

    // Save to user saved briefs list in localStorage
    const savedList = JSON.parse(localStorage.getItem('sc_saved_video_briefs') || '[]');
    const existingIndex = savedList.findIndex((b: VideoBrief) => b.id === toSave.id);
    if (existingIndex >= 0) {
      savedList[existingIndex] = toSave;
    } else {
      savedList.unshift(toSave);
    }
    localStorage.setItem('sc_saved_video_briefs', JSON.stringify(savedList));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs">
      <div
        className={`w-full max-w-5xl max-h-[92vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden transition-all ${
          isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-rose-600 text-white shadow-sm shrink-0">
              <Clapperboard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[11px] font-mono uppercase font-bold text-rose-600 dark:text-rose-400 tracking-wider">
                  Fact-Locked Video Brief Generator
                </span>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                <span className="text-xs font-mono text-slate-400">Score {item.priorityScore}/100</span>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                <span className="text-xs text-slate-500 font-medium">{item.category}</span>
                {currentBrief?.version && currentBrief.version > 1 && (
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                    Version {currentBrief.version}
                  </span>
                )}
              </div>

              <h2 className="text-sm sm:text-base font-bold tracking-tight leading-snug line-clamp-2">
                {item.headline}
              </h2>

              <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                <span>Source: <strong className="text-slate-700 dark:text-slate-300">{item.source}</strong></span>
                <span aria-hidden="true">·</span>
                <span>{formatLocalDateTime(item.publishedAt)}</span>
                <span aria-hidden="true">·</span>
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <span>Read Original Article</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Configuration Controls Bar */}
        <div className={`px-4 sm:px-5 py-3 border-b text-xs flex flex-wrap items-center justify-between gap-3 ${
          isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50/80 border-slate-200'
        }`}>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Language */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium text-[11px]">Language:</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as VideoLanguage)}
                className={`px-2 py-1 rounded-lg border text-xs font-medium ${
                  isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-800'
                }`}
              >
                {LANGUAGES.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            {/* Platform */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium text-[11px]">Platform:</span>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as VideoPlatform)}
                className={`px-2 py-1 rounded-lg border text-xs font-medium ${
                  isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-800'
                }`}
              >
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium text-[11px]">Duration:</span>
              <select
                value={duration}
                onChange={(e) => handleDurationChange(e.target.value as VideoDuration)}
                className={`px-2 py-1 rounded-lg border text-xs font-medium ${
                  isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-800'
                }`}
              >
                {DURATION_ITEMS.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>

            {/* Aspect Ratio */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium text-[11px]">Ratio:</span>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value as VideoAspectRatio)}
                className={`px-2 py-1 rounded-lg border text-xs font-medium font-mono ${
                  isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-800'
                }`}
              >
                {ASPECT_RATIOS.map((ar) => (
                  <option key={ar} value={ar}>{ar}</option>
                ))}
              </select>
            </div>

            {/* Tone */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium text-[11px]">Tone:</span>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as VideoTone)}
                className={`px-2 py-1 rounded-lg border text-xs font-medium ${
                  isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-800'
                }`}
              >
                {TONES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Regenerate with parameters */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => handleGenerateBrief()}
              disabled={isGenerating}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white font-semibold text-xs shadow-xs transition-all ${
                isGenerating ? 'bg-rose-400 cursor-not-allowed' : 'bg-rose-600 hover:bg-rose-700 active:scale-95'
              }`}
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Generating Script...' : 'Regenerate'}</span>
            </button>
          </div>
        </div>

        {/* Custom Script Templates Bar */}
        <div className={`px-4 sm:px-5 py-2.5 border-b flex flex-wrap items-center justify-between gap-2.5 ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-rose-50/50 border-rose-100'
        }`}>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Script Template:</span>
            </div>

            {/* Template Selector Dropdown */}
            <select
              value={selectedTemplateId}
              onChange={(e) => handleApplyTemplate(e.target.value)}
              className={`px-2.5 py-1 rounded-lg border text-xs font-semibold ${
                isDark ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-800 shadow-xs'
              }`}
            >
              <optgroup label="⭐ Built-in Studio Templates">
                {BUILT_IN_SCRIPT_TEMPLATES.map((tmpl) => (
                  <option key={tmpl.id} value={tmpl.id}>
                    {tmpl.name} ({tmpl.tone})
                  </option>
                ))}
              </optgroup>
              {userTemplates.length > 0 && (
                <optgroup label="📁 Your Custom Templates">
                  {userTemplates.map((tmpl) => (
                    <option key={tmpl.id} value={tmpl.id}>
                      {tmpl.name} ({tmpl.tone})
                    </option>
                  ))}
                </optgroup>
              )}
            </select>

            {/* Quick 1-Click Chips for user's requested tones */}
            <div className="hidden lg:flex items-center gap-1 ml-1">
              {[
                { id: 'template-hard-hitting-financial', label: 'Hard-Hitting Financial' },
                { id: 'template-casual-summary', label: 'Casual Summary' },
                { id: 'template-investigative-logistics', label: 'Investigative' },
                { id: 'template-fast-paced-viral', label: 'Viral (Shorts/Reels)' },
              ].map((chip) => (
                <button
                  key={chip.id}
                  onClick={() => handleApplyTemplate(chip.id)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                    selectedTemplateId === chip.id
                      ? 'bg-rose-600 text-white font-semibold shadow-xs'
                      : isDark
                        ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Template Directives Info Button */}
            <button
              onClick={() => setShowTemplateDetails(!showTemplateDetails)}
              className={`flex items-center gap-1 px-2 py-0.5 text-[11px] rounded transition-colors ${
                showTemplateDetails
                  ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-semibold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
              title="View active template tone guidelines"
            >
              <HelpCircle className="w-3 h-3 text-rose-500" />
              <span>{showTemplateDetails ? 'Hide Tone Rules' : 'Tone Rules'}</span>
            </button>
          </div>

          {/* Template Actions: Save New & Manage */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => {
                setNewTemplateName(`Custom ${activeTemplate?.name || 'Style'}`);
                setNewTemplateTone(activeTemplate?.tone || 'Hard-Hitting Financial');
                setNewTemplateDescription(activeTemplate?.description || '');
                setNewTemplateGuidance(activeTemplate?.styleGuidance || '');
                setNewTemplateHookStyle(activeTemplate?.hookStyle || '');
                setNewTemplateCta(activeTemplate?.ctaTemplate || '');
                setIsSavingNewTemplate(true);
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all ${
                isDark
                  ? 'bg-slate-800/90 border-slate-700 text-rose-400 hover:bg-slate-800'
                  : 'bg-white border-rose-200 text-rose-700 hover:bg-rose-50 shadow-xs'
              }`}
              title="Save custom script parameters as a reusable template"
            >
              <Plus className="w-3 h-3" />
              <span>Save as New Template</span>
            </button>

            {userTemplates.length > 0 && (
              <button
                onClick={() => setIsManagingTemplates(true)}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-xs transition-colors ${
                  isDark
                    ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
                title="Manage saved custom script templates"
              >
                <FolderOpen className="w-3 h-3 text-amber-500" />
                <span>Manage ({userTemplates.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* Expandable Template Rules Banner */}
        {showTemplateDetails && activeTemplate && (
          <div className={`px-5 py-2.5 text-xs border-b ${
            isDark ? 'bg-slate-950/90 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
          }`}>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-rose-600 dark:text-rose-400">{activeTemplate.name}</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-slate-200 dark:bg-slate-800 rounded font-mono">
                    Tone: {activeTemplate.tone}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Pacing: {activeTemplate.pacing}</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">{activeTemplate.styleGuidance}</p>
                {activeTemplate.hookStyle && (
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    <strong>Hook directive:</strong> {activeTemplate.hookStyle}
                  </p>
                )}
              </div>
              <button
                onClick={() => setShowTemplateDetails(false)}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Fact-Locked Safety Banner */}
        <div className={`px-4 sm:px-5 py-2 text-xs flex flex-wrap items-center justify-between gap-2 border-b ${
          currentBrief?.factCheck.isFactLocked
            ? isDark
              ? 'bg-emerald-950/40 border-emerald-900/60 text-emerald-300'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : isDark
              ? 'bg-amber-950/40 border-amber-900/60 text-amber-300'
              : 'bg-amber-50 border-amber-200 text-amber-800'
        }`}>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="font-bold">
              ✓ FACT-LOCKED MODE ACTIVE
            </span>
            <span aria-hidden="true" className="opacity-40">|</span>
            <span className="text-[11px]">
              Sources checked: {currentBrief?.factCheck.sourcesCheckedCount || 1} · Claims verified: {currentBrief?.factCheck.claimsCheckedCount || 6} · Confidence: <strong>{currentBrief?.factCheck.confidence || 'HIGH'}</strong>
            </span>
          </div>

          <div className="text-[11px] font-mono opacity-80 hidden sm:block">
            Zero-hallucination enforced · No invented quotes or numbers
          </div>
        </div>

        {/* User edited notification warning */}
        {isUserEdited && (
          <div className="px-5 py-1.5 text-[11px] bg-amber-500 text-white font-medium flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>User-edited content — no longer fully verified by the AI fact-checker.</span>
            </div>
            <button
              onClick={() => {
                if (currentBrief) {
                  setEditableNarration(currentBrief.script.fullNarration);
                  setIsUserEdited(false);
                }
              }}
              className="underline text-[10px] ml-2"
            >
              Reset to verified script
            </button>
          </div>
        )}

        {/* Main Content Area Tabs */}
        <div className="flex items-center gap-2 px-5 py-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-xs overflow-x-auto scrollbar-none font-medium">
          {[
            { id: 'script', label: 'Script & Narration', icon: FileText },
            { id: 'metadata', label: 'Titles, Hooks & Description', icon: Hash },
            { id: 'scenePlan', label: 'Scene Visual Plan', icon: Film },
            { id: 'factCheck', label: 'Fact-Check & Claim Audit', icon: ShieldCheck },
          ].map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? isDark
                      ? 'bg-rose-600 text-white font-semibold'
                      : 'bg-slate-900 text-white font-semibold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <TabIcon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}

          {/* Quick Modifier dropdown */}
          <div className="ml-auto hidden md:flex items-center gap-1.5 text-xs text-slate-400">
            <span>Refine tone:</span>
            <select
              onChange={(e) => {
                if (e.target.value) handleGenerateBrief(e.target.value);
              }}
              defaultValue=""
              className={`px-2 py-1 rounded border text-[11px] ${
                isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-700'
              }`}
            >
              <option value="" disabled>Select modifier...</option>
              {REGEN_MODIFIERS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          {/* TAB 1: SCRIPT & NARRATION */}
          {activeTab === 'script' && currentBrief && (
            <div className="space-y-5">
              {/* Primary Hook Display */}
              <div className={`p-4 rounded-xl border ${
                isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-rose-50/60 border-rose-200/80'
              }`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                    Opening Factual Hook (0–5 Seconds)
                  </span>
                  <button
                    onClick={() => handleCopyText(currentBrief.script.hook, 'Hook')}
                    className="text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy Hook</span>
                  </button>
                </div>
                <p className="text-slate-800 dark:text-slate-100 font-medium leading-relaxed">
                  "{currentBrief.script.hook}"
                </p>
              </div>

              {/* Full Narration Script Editor / Viewer */}
              <div className={`p-4 rounded-xl border ${
                isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
              }`}>
                {/* Minute Selection Control Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 mb-3 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-rose-500" />
                      <span>Script Runtime (Minutes):</span>
                    </span>
                    <div className="flex items-center gap-1 ml-1">
                      {DURATION_ITEMS.map((d) => (
                        <button
                          key={d.value}
                          onClick={() => handleDurationChange(d.value)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                            duration === d.value
                              ? 'bg-rose-600 text-white shadow-xs'
                              : isDark
                                ? 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                          }`}
                        >
                          {d.short}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                    <span className="font-semibold text-rose-600 dark:text-rose-400">
                      {(editableNarration || currentBrief.script.fullNarration).trim().split(/\s+/).filter(Boolean).length} words
                    </span>
                    <span>·</span>
                    <span>
                      ~{Math.round(((editableNarration || currentBrief.script.fullNarration).trim().split(/\s+/).filter(Boolean).length / 140) * 60)}s reading pace
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Full Voiceover Narration ({currentBrief.duration}) — As Per Timeline</span>
                    </span>
                    {isEditingScript && (
                      <span className="text-[10px] text-amber-500 font-mono">Editing Mode</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsEditingScript(!isEditingScript)}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{isEditingScript ? 'Done Editing' : 'Edit Script'}</span>
                    </button>
                    <button
                      onClick={() => handleCopyText(editableNarration || currentBrief.script.fullNarration, 'Script')}
                      className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Script</span>
                    </button>
                  </div>
                </div>

                {isEditingScript ? (
                  <textarea
                    value={editableNarration}
                    onChange={(e) => {
                      setEditableNarration(e.target.value);
                      setIsUserEdited(true);
                    }}
                    rows={8}
                    className={`w-full p-3 rounded-xl border text-xs sm:text-sm font-sans leading-relaxed focus:outline-none focus:ring-1 focus:ring-rose-500 ${
                      isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                ) : (
                  <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 text-slate-800 dark:text-slate-200 leading-relaxed font-sans whitespace-pre-line text-xs sm:text-sm">
                    {editableNarration || currentBrief.script.fullNarration}
                  </div>
                )}
              </div>

              {/* What We Know vs What Is Not Yet Confirmed (Requirement #17) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-xl border ${
                  isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-emerald-50/40 border-emerald-200'
                }`}>
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>What We Know (Verified Facts)</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {currentBrief.whatWeKnow.map((fact, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{fact}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`p-4 rounded-xl border ${
                  isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-amber-50/40 border-amber-200'
                }`}>
                  <div className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" />
                    <span>What Is Not Yet Confirmed</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {currentBrief.whatIsNotConfirmed.map((unconfirmed, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{unconfirmed}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2 text-[10px] text-slate-400 italic">
                    Prevents speculation: missing details are explicitly stated rather than filled creatively.
                  </div>
                </div>
              </div>

              {/* Sources Grounding List */}
              <div className={`p-4 rounded-xl border ${
                isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Underlying Sources Used
                </h4>
                <div className="space-y-2">
                  {currentBrief.sourcesUsed.map((src, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {src.name} {src.isPrimary && '(Primary Publisher)'}
                      </span>
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 truncate max-w-xs"
                      >
                        <span className="truncate">{src.url}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TITLES, HOOKS & DESCRIPTION */}
          {activeTab === 'metadata' && currentBrief && (
            <div className="space-y-5">
              {/* 5 Video Titles */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    5 Engaging, Factually Accurate Video Titles
                  </h4>
                  <button
                    onClick={() => handleCopyText(currentBrief.titles.join('\n'), 'Titles')}
                    className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy All Titles</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {currentBrief.titles.map((title, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                        isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-xs text-slate-800 dark:text-slate-100">{title}</span>
                      </div>
                      <button
                        onClick={() => handleCopyText(title, `Title #${idx + 1}`)}
                        className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1"
                        title="Copy this title"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5 Alternative Hooks */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    5 Alternative Opening Hooks (0–5s)
                  </h4>
                  <button
                    onClick={() => handleCopyText(currentBrief.hooks.join('\n'), 'Hooks')}
                    className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy All Hooks</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {currentBrief.hooks.map((hk, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                        isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-mono text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-snug">"{hk}"</p>
                      </div>
                      <button
                        onClick={() => handleCopyText(hk, `Hook #${idx + 1}`)}
                        className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 shrink-0"
                        title="Copy this hook"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5 Thumbnail Text Options */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  5 Short Thumbnail Texts (2–5 Words Max)
                </h4>
                <div className="flex flex-wrap gap-2">
                  {currentBrief.thumbnailTexts.map((th, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleCopyText(th, `Thumbnail "${th}"`)}
                      className={`px-3 py-1.5 rounded-lg border font-mono font-bold text-xs flex items-center gap-2 hover:border-blue-500 transition-colors ${
                        isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-800'
                      }`}
                    >
                      <span>{th}</span>
                      <Copy className="w-3 h-3 text-slate-400" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Platform-Ready Video Description
                  </h4>
                  <button
                    onClick={() => handleCopyText(currentBrief.description, 'Description')}
                    className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy Description</span>
                  </button>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 whitespace-pre-line text-xs font-sans text-slate-700 dark:text-slate-300">
                  {currentBrief.description}
                </div>
              </div>

              {/* Hashtags and SEO Keywords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
                    <Hash className="w-3.5 h-3.5 text-blue-500" />
                    <span>Relevant Hashtags</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {currentBrief.hashtags.map((tag, idx) => (
                      <span
                        key={idx}
                        className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                          isDark ? 'bg-slate-950 border-slate-800 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-700'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    SEO Keywords
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {currentBrief.seoKeywords.map((kw, idx) => (
                      <span
                        key={idx}
                        className={`text-[11px] px-2 py-0.5 rounded border ${
                          isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                        }`}
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SCENE VISUAL PLAN */}
          {activeTab === 'scenePlan' && currentBrief && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Scene-by-Scene Visual Plan
                  </h4>
                  <p className="text-xs text-slate-500">
                    Grounded visual directions clearly separating real source photos from illustrative graphics
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleCopyText(
                      currentBrief.scenePlan
                        .map(
                          (s) =>
                            `[Scene ${s.sceneNumber} (${s.timestamp})]\nNarration: ${s.narration}\nVisual: ${s.visualDirection} (${s.visualType})`
                        )
                        .join('\n\n'),
                      'Scene Plan'
                    )
                  }
                  className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy Scene Plan</span>
                </button>
              </div>

              <div className="space-y-3">
                {currentBrief.scenePlan.map((scene) => (
                  <div
                    key={scene.sceneNumber}
                    className={`p-4 rounded-xl border ${
                      isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono mb-2">
                      <span className="font-bold text-rose-600 dark:text-rose-400">
                        SCENE {scene.sceneNumber} · {scene.timestamp}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded border font-sans ${
                        scene.visualType.includes('Actual')
                          ? isDark
                            ? 'bg-emerald-950 border-emerald-800 text-emerald-300'
                            : 'bg-emerald-100 border-emerald-200 text-emerald-800'
                          : isDark
                            ? 'bg-slate-900 border-slate-800 text-slate-300'
                            : 'bg-slate-200 border-slate-300 text-slate-700'
                      }`}>
                        {scene.visualType}
                      </span>
                    </div>

                    <div className="mb-2">
                      <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Spoken Narration</div>
                      <p className="text-xs text-slate-800 dark:text-slate-200 font-medium">"{scene.narration}"</p>
                    </div>

                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Visual Direction</div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{scene.visualDirection}</p>
                    </div>

                    {scene.onScreenText && (
                      <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-800/80 text-[11px] text-slate-500 font-mono">
                        On-screen text: <span className="font-bold text-slate-700 dark:text-slate-300">"{scene.onScreenText}"</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: FACT-CHECK & CLAIM AUDIT */}
          {activeTab === 'factCheck' && currentBrief && (
            <div className="space-y-5">
              {/* Publishing Safety Checklist (Requirement #47) */}
              <div className={`p-4 rounded-xl border ${
                isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Publishing Safety Checklist
                  </h4>
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>READY FOR VIDEO PRODUCTION</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {Object.entries(currentBrief.factCheck.checks || {}).map(([key, val]) => (
                    <div key={key} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Claim-Level Validation Table (Requirement #21) */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Claim-Level Source Audit
                </h4>
                <div className="space-y-2">
                  {currentBrief.factCheck.claimsAudit?.map((audit, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border ${
                        isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          Claim #{idx + 1}: "{audit.claim}"
                        </span>
                        <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                          audit.status === 'SUPPORTED'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                            : audit.status === 'PARTIALLY SUPPORTED'
                              ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300'
                              : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                        }`}>
                          {audit.status}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        <strong className="text-slate-600 dark:text-slate-300">Evidence: </strong>
                        {audit.sourceEvidence}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 font-mono">
                        Action: {audit.actionTaken}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Version History (Requirement #37) */}
              {versionHistory.length > 1 && (
                <div className={`p-4 rounded-xl border ${
                  isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-blue-500" />
                    <span>Version History ({versionHistory.length} Versions)</span>
                  </h4>
                  <div className="space-y-1.5">
                    {versionHistory.map((ver, idx) => (
                      <div key={ver.id} className="flex items-center justify-between text-xs">
                        <span>Version {ver.version} ({ver.language} · {ver.duration} · {ver.tone})</span>
                        <button
                          onClick={() => {
                            setCurrentBrief(ver);
                            setEditableNarration(ver.script.fullNarration);
                          }}
                          className="text-blue-600 hover:underline text-[11px]"
                        >
                          Restore Version {ver.version}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Bottom Action Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-950/60 text-xs">
          <div className="flex items-center gap-2">
            {/* Copy Everything Button */}
            <button
              onClick={handleCopyEverything}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs transition-colors"
            >
              {copyFeedback === 'Everything' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copyFeedback === 'Everything' ? 'Copied Everything!' : 'Copy Everything'}</span>
            </button>

            {/* Copy Script Only */}
            <button
              onClick={() => handleCopyText(editableNarration || currentBrief?.script.fullNarration || '', 'Script')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-colors ${
                isDark ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {copyFeedback === 'Script' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copyFeedback === 'Script' ? 'Copied Script!' : 'Copy Script'}</span>
            </button>

            {/* Save Brief */}
            <button
              onClick={handleSaveBrief}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-colors ${
                isSaved
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : isDark
                    ? 'border-slate-700 text-slate-200 hover:bg-slate-800'
                    : 'border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
              <span>{isSaved ? 'Saved Brief!' : 'Save Video Brief'}</span>
            </button>

            {/* Mark as Video Created */}
            {onToggleVideoCreated && (
              <button
                onClick={() => onToggleVideoCreated(item, duration === '60s' ? '1m' : duration)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-colors ${
                  isVideoCreated
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : isDark
                      ? 'border-emerald-800 text-emerald-300 hover:bg-emerald-950/40'
                      : 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'
                }`}
                title={isVideoCreated ? `Video created on ${videoCreatedDate} (click to toggle)` : `Mark ${duration === '60s' ? '1m' : duration} video as created today`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isVideoCreated ? `Created (${videoCreatedDate})` : `Mark ${duration === '60s' ? '1m' : duration} Created`}</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadTXT}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium cursor-pointer"
              title="Download text brief"
            >
              <Download className="w-3.5 h-3.5 text-rose-500" />
              <span>Download TXT</span>
            </button>

            <button
              onClick={handleDownloadJSON}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium cursor-pointer"
              title="Download JSON data"
            >
              <Download className="w-3.5 h-3.5 text-blue-500" />
              <span>Download JSON</span>
            </button>

            <button
              onClick={onClose}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl border font-medium transition-colors cursor-pointer ${
                isDark ? 'border-slate-800 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <X className="w-3.5 h-3.5" />
              <span>Close</span>
            </button>
          </div>
        </div>

        {/* Modal: Save New Custom Script Template */}
        {isSavingNewTemplate && (
          <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className={`w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
              isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
            }`}>
              {/* Header */}
              <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">Save Custom Script Template</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Create a reusable script profile with your preferred tone and voiceover directives.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsSavingNewTemplate(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Body */}
              <div className="p-5 overflow-y-auto space-y-4 text-xs">
                {/* Template Name */}
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Template Name *
                  </label>
                  <input
                    type="text"
                    value={newTemplateName}
                    onChange={(e) => setNewTemplateName(e.target.value)}
                    placeholder="e.g. Aggressive Wall St Financial, Casual YouTube Summary..."
                    className={`w-full px-3 py-2 rounded-lg border text-xs ${
                      isDark ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                {/* Base Tone Selection */}
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Primary Voiceover Tone *
                  </label>
                  <select
                    value={newTemplateTone}
                    onChange={(e) => setNewTemplateTone(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border text-xs font-medium ${
                      isDark ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    {TONES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Select a baseline tone (e.g. 'Hard-Hitting Financial' or 'Casual Summary') to establish overall rhythm and vocabulary.
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Target Audience / Description
                  </label>
                  <input
                    type="text"
                    value={newTemplateDescription}
                    onChange={(e) => setNewTemplateDescription(e.target.value)}
                    placeholder="e.g. For procurement executives who care about immediate cost spikes"
                    className={`w-full px-3 py-2 rounded-lg border text-xs ${
                      isDark ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                {/* Style Guidance */}
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Voiceover Style & Vocabulary Guidance *
                  </label>
                  <textarea
                    rows={3}
                    value={newTemplateGuidance}
                    onChange={(e) => setNewTemplateGuidance(e.target.value)}
                    placeholder="e.g. Emphasize dollar losses, container rate surges, and margin erosion. Avoid conversational filler. Speak directly to CPOs."
                    className={`w-full px-3 py-2 rounded-lg border text-xs leading-relaxed ${
                      isDark ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Directives instructing how the AI scriptwriter structures sentences, numbers, and key supply chain facts.
                  </p>
                </div>

                {/* Hook Style Directive */}
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Opening Hook Directive (0–5 Seconds)
                  </label>
                  <input
                    type="text"
                    value={newTemplateHookStyle}
                    onChange={(e) => setNewTemplateHookStyle(e.target.value)}
                    placeholder="e.g. Start with the single highest dollar loss figure or tariff percentage."
                    className={`w-full px-3 py-2 rounded-lg border text-xs ${
                      isDark ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                {/* Call to Action */}
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Concluding Call-to-Action (CTA)
                  </label>
                  <input
                    type="text"
                    value={newTemplateCta}
                    onChange={(e) => setNewTemplateCta(e.target.value)}
                    placeholder="e.g. Track daily margin fluctuations on SupplyChain Intelligence."
                    className={`w-full px-3 py-2 rounded-lg border text-xs ${
                      isDark ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2 bg-slate-50/50 dark:bg-slate-950/40">
                <button
                  onClick={() => setIsSavingNewTemplate(false)}
                  className="px-3 py-1.5 rounded-lg border text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCustomTemplate}
                  disabled={!newTemplateName.trim()}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-white font-semibold text-xs transition-all ${
                    newTemplateName.trim()
                      ? 'bg-rose-600 hover:bg-rose-700 shadow-sm active:scale-95'
                      : 'bg-rose-300 dark:bg-rose-900 cursor-not-allowed'
                  }`}
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save & Apply Template</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Manage Custom Script Templates */}
        {isManagingTemplates && (
          <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className={`w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[85vh] ${
              isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
            }`}>
              <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                    <FolderOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">Manage Custom Script Templates</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {userTemplates.length} saved custom profile{userTemplates.length === 1 ? '' : 's'} stored in your browser
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsManagingTemplates(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 overflow-y-auto space-y-3 flex-1 text-xs">
                {userTemplates.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <p>No custom templates saved yet.</p>
                    <p className="text-[11px] mt-1">Click "Save as New Template" to create one.</p>
                  </div>
                ) : (
                  userTemplates.map((tmpl) => (
                    <div
                      key={tmpl.id}
                      className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 ${
                        selectedTemplateId === tmpl.id
                          ? isDark
                            ? 'bg-rose-950/30 border-rose-800'
                            : 'bg-rose-50/50 border-rose-200'
                          : isDark
                            ? 'bg-slate-950/40 border-slate-800'
                            : 'bg-slate-50/70 border-slate-200'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 dark:text-slate-100">{tmpl.name}</span>
                          <span className="text-[10px] px-1.5 py-0.2 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded font-semibold">
                            {tmpl.tone}
                          </span>
                          {selectedTemplateId === tmpl.id && (
                            <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-0.5">
                              <CheckCircle2 className="w-3 h-3" /> Active
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{tmpl.description}</p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          Saved: {tmpl.createdAt ? new Date(tmpl.createdAt).toLocaleDateString() : 'Custom Template'}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {selectedTemplateId !== tmpl.id && (
                          <button
                            onClick={() => {
                              handleApplyTemplate(tmpl.id);
                              setIsManagingTemplates(false);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs"
                          >
                            Apply
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteCustomTemplate(tmpl.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 transition-colors"
                          title="Delete template"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end bg-slate-50/50 dark:bg-slate-950/40">
                <button
                  onClick={() => setIsManagingTemplates(false)}
                  className="flex items-center gap-1 px-4 py-1.5 rounded-lg border text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Close</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
