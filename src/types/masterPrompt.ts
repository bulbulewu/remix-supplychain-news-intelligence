export type VideoAiEngine =
  | 'universal'
  | 'runway-gen3'
  | 'openai-sora'
  | 'kling-ai'
  | 'luma-dream-machine'
  | 'invideo-ai'
  | 'midjourney-haiper';

export type PromptVisualAesthetic =
  | 'cinematic-documentary'
  | 'hyper-realistic-broadcast'
  | 'drone-aerial-logistics'
  | 'tactical-cyber-intelligence'
  | 'minimalist-corporate-data';

export interface ScenePromptItem {
  sceneNumber: number;
  timecode: string;
  sceneTitle: string;
  visualPrompt: string;
  negativePrompt: string;
  cameraMovement: string;
  lightingAndAtmosphere: string;
  audioAndFoley: string;
  voiceoverLine: string;
  onScreenText: string;
}

export interface MasterVideoPromptBlueprint {
  id: string;
  newsItemId: string;
  headline: string;
  source: string;
  topic: string;
  createdAt: string;
  engine: VideoAiEngine;
  aesthetic: PromptVisualAesthetic;
  aspectRatio: '16:9' | '9:16' | '1:1';
  targetDuration: string;

  // Master Directorial Overview
  logline: string;
  visualHook: string;
  directorTreatment: string;
  colorPalette: string[];
  recommendedPacing: string;

  // Scene-by-scene prompts for AI Video Generators (Sora / Runway / Kling / Luma)
  scenes: ScenePromptItem[];

  // Master Voiceover script
  masterVoiceoverScript: string;

  // Complete monolithic prompt for conversational video bots (InVideo AI / Sora / Claude / ChatGPT)
  monolithicPrompt: string;

  // Sound & Audio direction
  musicPrompt: string;
  soundEffectsPrompt: string;
}
