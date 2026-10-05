import { NewsItem } from '../types/news';
import {
  MasterVideoPromptBlueprint,
  VideoAiEngine,
  PromptVisualAesthetic,
  ScenePromptItem,
} from '../types/masterPrompt';
import { getDurationTimelineConfig } from '../utils/timelineScriptBuilder';

export interface GeneratePromptOptions {
  engine?: VideoAiEngine;
  aesthetic?: PromptVisualAesthetic;
  aspectRatio?: '16:9' | '9:16' | '1:1';
  targetDuration?: string;
  language?: 'English' | 'Bangla' | 'Bilingual';
}

export const MAX_MASTER_PROMPT_CHARS = 4900;

export function clampMasterPromptUnderLimit(
  prompt: string,
  maxChars: number = MAX_MASTER_PROMPT_CHARS
): string {
  if (prompt.length <= maxChars) {
    return prompt;
  }

  const footer = `\n\n[CALIBRATED FOR AI VIDEO GENERATORS · MAX ${maxChars} CHAR LIMIT ENFORCED]\n=================================================`;
  const allowedLength = maxChars - footer.length;

  if (allowedLength <= 100) {
    return prompt.slice(0, maxChars);
  }

  let truncated = prompt.slice(0, allowedLength);

  // Look for a clean section or line break near the end
  const lastDoubleBreak = truncated.lastIndexOf('\n\n');
  if (lastDoubleBreak > allowedLength * 0.8) {
    truncated = truncated.slice(0, lastDoubleBreak);
  } else {
    const lastSingleBreak = truncated.lastIndexOf('\n');
    if (lastSingleBreak > allowedLength * 0.8) {
      truncated = truncated.slice(0, lastSingleBreak);
    } else {
      const lastSentence = truncated.lastIndexOf('. ');
      if (lastSentence > allowedLength * 0.8) {
        truncated = truncated.slice(0, lastSentence + 1);
      }
    }
  }

  const finalPrompt = (truncated.trim() + footer).trim();
  return finalPrompt.length <= maxChars ? finalPrompt : finalPrompt.slice(0, maxChars);
}

export function generateMasterPromptBlueprint(
  item: NewsItem,
  options: GeneratePromptOptions = {}
): MasterVideoPromptBlueprint {
  const engine = options.engine || 'universal';
  const aesthetic = options.aesthetic || 'cinematic-documentary';
  const aspectRatio = options.aspectRatio || '16:9';
  const targetDuration = options.targetDuration || '60s';
  const language = options.language || 'English';

  const isBangla = language === 'Bangla';
  const isBilingual = language === 'Bilingual';

  // Aesthetic visual descriptor mapping
  const aestheticDescriptors: Record<PromptVisualAesthetic, { style: string; camera: string; lighting: string; color: string }> = {
    'cinematic-documentary': {
      style: 'Cinematic 4K documentary footage, shot on ARRI Alexa Mini LF, 35mm anamorphic lens, realistic depth of field, subtle film grain',
      camera: 'Slow controlled cinematic dolly, steady tracking shot with organic gimbal motion',
      lighting: 'Volumetric natural golden hour sunlight cutting through haze, moody practical lighting',
      color: 'Kodak 5219 color grade, deep maritime navy, slate grey, warm tungsten accents',
    },
    'hyper-realistic-broadcast': {
      style: 'Hyper-realistic 4K broadcast journalism newsreel, Bloomberg and Reuters documentary standard, crisp edge sharpness',
      camera: 'Telephoto compression shot, slow broadcast crane jib pan, smooth tripod pan',
      lighting: 'Clean high-CRI industrial lighting, daylight balanced 5600K, minimal shadow clipping',
      color: 'True-to-life broadcast color calibration, punchy corporate blues, high clarity',
    },
    'drone-aerial-logistics': {
      style: 'High-altitude 4K FPV drone cinematography, sweeping geographic survey perspective, epic scale and engineering grandeur',
      camera: 'Top-down 90-degree god-eye perspective transitioning to sweeping forward bird’s-eye orbit',
      lighting: 'Dramatic dawn twilight, long industrial shadows stretching across container yards and harbors',
      color: 'Steel grey, turquoise sea foam, vibrant shipping container primaries (red, blue, evergreen)',
    },
    'tactical-cyber-intelligence': {
      style: 'Dark tactical enterprise intelligence visualization, high-tech supply chain command center aesthetic, holographic telemetry',
      camera: 'Dynamic macro rack focus, slow lateral slider across glowing radar consoles',
      lighting: 'Low-key cyberpunk chiaroscuro, luminescent LED blue terminal glow, amber hazard indicators',
      color: 'Midnight obsidian, cobalt blue, neon cyan data traces, caution amber highlights',
    },
    'minimalist-corporate-data': {
      style: 'Clean minimalist corporate explainer visual, Apple-level product commercial sleekness, studio architectural composition',
      camera: 'Precision motorized linear slider, mathematically centered symmetry',
      lighting: 'Soft diffused cyclorama softbox illumination, zero harsh glares, studio pristine',
      color: 'Pure white, minimalist charcoal, cobalt enterprise blue, accent chart emerald',
    },
  };

  const currAesthetic = aestheticDescriptors[aesthetic] || aestheticDescriptors['cinematic-documentary'];

  // Engine token modifiers
  const getEngineTail = (eng: VideoAiEngine, ratio: string) => {
    switch (eng) {
      case 'kling-ai':
        return `--ar ${ratio} -v 1.5 -motion 5 -camera zoom-in`;
      case 'runway-gen3':
        return `[Camera: Steady Track, 24fps] photorealistic 4k, hyper-detailed textures, cinematic composition`;
      case 'openai-sora':
        return `Hyperrealistic physics, temporal consistency, smooth fluid motion, cinematic 4K resolution, aspect ratio ${ratio}`;
      case 'luma-dream-machine':
        return `Dream Machine 4K, realistic lighting refraction, coherent object geometry, 60fps cinematic`;
      case 'midjourney-haiper':
        return `--ar ${ratio} --style raw --v 6.1 --quality 2`;
      default:
        return `4K UHD, photorealistic, 24fps, --aspect ${ratio}`;
    }
  };

  const engineTail = getEngineTail(engine, aspectRatio);

  // Timeline configuration according to selected duration in minutes/seconds
  const timelineConfig = getDurationTimelineConfig(item, targetDuration);

  // Construct scenes according to timeline
  const scenes: ScenePromptItem[] = timelineConfig.segments.map((seg, idx) => {
    const narrationText = isBangla
      ? seg.narrationBangla
      : isBilingual
        ? `${seg.narrationBangla} (${seg.narrationEnglish})`
        : seg.narrationEnglish;

    return {
      sceneNumber: idx + 1,
      timecode: seg.timecode,
      sceneTitle: seg.phaseTitle,
      visualPrompt: `${currAesthetic.style}. ${seg.visualDirection}. ${currAesthetic.lighting}. ${currAesthetic.camera}. Highly authentic detail, cinematic textures. ${engineTail}`,
      negativePrompt: 'cartoonish, 3D CGI video game render, low resolution, warped textures, blurry faces, distorted hands, plastic water, watermark, text glitch',
      cameraMovement: currAesthetic.camera,
      lightingAndAtmosphere: currAesthetic.lighting,
      audioAndFoley: 'Atmospheric maritime ocean swell, container crane hydraulics, resonant synthesizer drone.',
      voiceoverLine: narrationText,
      onScreenText: seg.onScreenMetric,
    };
  });

  // Master Voiceover narration script formatted as per timeline
  const masterVoiceoverScript = timelineConfig.segments
    .map((seg) => {
      const line = isBangla
        ? seg.narrationBangla
        : isBilingual
          ? `${seg.narrationBangla}\n[EN Translation]: ${seg.narrationEnglish}`
          : seg.narrationEnglish;
      return `[${seg.timecode}] ${seg.phaseTitle.toUpperCase()}\n${line}`;
    })
    .join('\n\n');

  // Chronological Visual Flow section as per timeline
  const visualFlowTimeline = timelineConfig.segments
    .map(
      (seg, idx) =>
        `[${seg.timecode}] Phase ${idx + 1}: ${seg.phaseTitle}\n- Visual Action: ${currAesthetic.style}. ${seg.visualDirection}. ${currAesthetic.lighting}.\n- Camera Direction: ${currAesthetic.camera}\n- Motion Graphic Overlay: "${seg.onScreenMetric}"`
    )
    .join('\n\n');

  // Monolithic single detailed prompt for AI video creators, InVideo AI, Sora, Runway, ChatGPT, or Claude
  const rawMonolithicPrompt = `=== MASTER DETAILED AI VIDEO CREATION PROMPT ===
Create a high-impact, photorealistic 4K cinematic documentary video exploring: "${item.headline}".

[TOPIC & EXECUTIVE DIRECTIVE]
- Target Runtime: ${timelineConfig.durationLabel} (${timelineConfig.totalSeconds}s)
- Pacing Standard: Broadcast documentary paced as per timeline (~${timelineConfig.targetWordCount} words spoken narration)
- Primary Investigation: Produce an authoritative, visually compelling investigative intelligence video dissecting "${item.headline}". The video must chronicle the operational friction across global trade corridors, maritime chokepoints, and manufacturing supply chains, strictly grounded in reporting from ${item.source} (${new Date(item.publishedAt).toLocaleDateString()}).

[CINEMATOGRAPHY & VISUAL AESTHETIC]
- Core Visual Style: ${currAesthetic.style}.
- Lighting & Atmosphere: ${currAesthetic.lighting}.
- Camera Language: ${currAesthetic.camera}.
- Color Grading & Palette: ${currAesthetic.color}.
- Aspect Ratio: ${aspectRatio} | Frame Rate: 24fps high-bitrate cinematic rendering.
- Target AI Video Engine Tokens: ${engineTail}.
- Negative Prompts to Avoid: cartoonish, 3D CGI video game render, low resolution, warped textures, blurry faces, distorted hands, plastic water, watermarks, frame stutter, oversaturated artificial glow.

[CHRONOLOGICAL VISUAL FLOW & SEAMLESS TRANSITIONS AS PER TIMELINE (${timelineConfig.durationLabel.toUpperCase()})]
${visualFlowTimeline}

[FULL SPOKEN VOICEOVER NARRATION SCRIPT AS PER TIMELINE (${language.toUpperCase()} · ${timelineConfig.durationLabel.toUpperCase()} · ~${timelineConfig.targetWordCount} WORDS)]
${masterVoiceoverScript}

[ON-SCREEN MOTION GRAPHICS & DATA CALLOUTS TIMELINE]
${timelineConfig.segments
  .map((seg) => `• [${seg.timecode}]: Display lower-third "${seg.onScreenMetric}"`)
  .join('\n')}
- Source Attribution: Grounded in reporting by ${item.source} (${item.sourceUrl})
- Disruption Priority Score: ${item.priorityScore}/100 | Severity Level: ${item.priorityLevel}

[AUDIO & SOUND DESIGN SPECIFICATIONS]
- Background Music: Cinematic investigative documentary score, deep analog cello drone, pulsating sub-bass rhythm, rising orchestral percussion cadence calibrated to ${timelineConfig.durationLabel}.
- Foley & Sound Effects: Hyper-realistic oceanic wave spray, heavy container metal locking clanks, gantry crane hydraulics whine, distant harbor foghorn, and crisp telemetry interface clicks.
=================================================`;

  const monolithicPrompt = clampMasterPromptUnderLimit(rawMonolithicPrompt, MAX_MASTER_PROMPT_CHARS);

  return {
    id: `mvp-${item.id}-${Date.now()}`,
    newsItemId: item.id,
    headline: item.headline,
    source: item.source,
    topic: item.category,
    createdAt: new Date().toISOString(),
    engine,
    aesthetic,
    aspectRatio,
    targetDuration,
    logline: `A high-impact visual intelligence breakdown of "${item.headline}", spotlighting real-world container logistics and procurement risk over a ${timelineConfig.durationLabel} timeline.`,
    visualHook: `A 20,000 TEU container mega-vessel cutting through heavy oceanic swells near a strategic chokepoint under golden hour rim lighting.`,
    directorTreatment: `${currAesthetic.style}. Emphasis on authentic industrial scale, verified facts, and dramatic commercial friction paced for ${timelineConfig.durationLabel}.`,
    colorPalette: [
      currAesthetic.color.split(',')[0] || 'Maritime Navy',
      'Industrial Safety Amber',
      'Slate Grey',
      'Cold Seafoam Turquoise',
    ],
    recommendedPacing: `Dynamic 24fps documentary pacing across ${timelineConfig.durationLabel} with structured timeline beats.`,
    scenes,
    masterVoiceoverScript,
    monolithicPrompt,
    musicPrompt:
      'Cinematic documentary tension, deep cello drone, analog synthesizer sub-bass, organic percussion cadence building to an urgent crescendo.',
    soundEffectsPrompt:
      'Oceanic wave spray, heavy container metal locking mechanisms, automated gantry crane whine, distant foghorn, crisp telemetry clicks.',
  };
}
