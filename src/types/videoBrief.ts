import { CredibilityType } from './news';

export type VideoPlatform = 
  | 'YouTube'
  | 'YouTube Shorts'
  | 'Facebook'
  | 'Facebook Reels'
  | 'Instagram Reels'
  | 'TikTok'
  | 'LinkedIn';

export type VideoDuration = '30s' | '45s' | '60s' | '1m' | '2m' | '3m' | '5m' | '10m';

export type VideoAspectRatio = '9:16' | '16:9' | '1:1';

export type VideoLanguage = 'Bangla' | 'English' | 'Bangla + English';

export type VideoTone = 
  | 'Professional News Documentary'
  | 'Hard-Hitting Financial'
  | 'Casual Summary'
  | 'Urgent'
  | 'Cinematic'
  | 'Explainer'
  | 'Business Intelligence'
  | 'Calm'
  | 'Investigative'
  | string;

export interface CustomScriptTemplate {
  id: string;
  name: string;
  tone: string;
  description: string;
  hookStyle: string;
  styleGuidance: string;
  pacing: string;
  ctaTemplate?: string;
  preferredPlatform?: VideoPlatform;
  preferredLanguage?: VideoLanguage;
  isBuiltIn?: boolean;
  createdAt?: string;
}

export type ClaimVerificationStatus = 'SUPPORTED' | 'PARTIALLY SUPPORTED' | 'UNSUPPORTED' | 'CONTRADICTED';

export interface ClaimVerificationItem {
  claim: string;
  sourceEvidence: string;
  status: ClaimVerificationStatus;
  actionTaken: 'Retained' | 'Attributed with uncertainty' | 'Removed / Rewritten';
}

export interface FactCheckReport {
  isFactLocked: boolean;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  confidenceReason: string;
  sourcesCheckedCount: number;
  claimsCheckedCount: number;
  unsupportedClaimsRemovedCount: number;
  verifiedTimestamp: string;
  checks: {
    eventVerified: boolean;
    dateVerified: boolean;
    locationVerified: boolean;
    organizationVerified: boolean;
    numericalDataVerified: boolean;
    quotesVerified: boolean;
    noFabricatedFacts: boolean;
    noUnsupportedCertainty: boolean;
    sourceAttributionIncluded: boolean;
    illustrativeVisualsIdentified: boolean;
  };
  claimsAudit: ClaimVerificationItem[];
}

export interface ScenePlanItem {
  sceneNumber: number;
  timestamp: string; // e.g. "0:00 - 0:05"
  narration: string;
  visualDirection: string;
  visualType: 'Actual Source Photo/Graphic' | 'Illustrative Map/Chart' | 'AI-Generated Illustrative Visualization (Not actual footage)';
  onScreenText?: string;
}

export interface VideoScriptSections {
  hook: string;
  context: string;
  mainDevelopment: string;
  supplyChainImpact: string;
  whatToWatch: string;
  ending: string;
  fullNarration: string;
}

export interface VideoBrief {
  id: string;
  newsItemId: string;
  headline: string;
  sourceName: string;
  sourceUrl: string;
  publishedAt: string;
  priorityScore: number;
  category: string;
  platform: VideoPlatform;
  duration: VideoDuration;
  aspectRatio: VideoAspectRatio;
  language: VideoLanguage;
  tone: VideoTone;
  version: number;
  createdAt: string;
  script: VideoScriptSections;
  titles: string[];
  hooks: string[];
  thumbnailTexts: string[];
  description: string;
  hashtags: string[];
  seoKeywords: string[];
  scenePlan: ScenePlanItem[];
  whatWeKnow: string[];
  whatIsNotConfirmed: string[];
  factCheck: FactCheckReport;
  sourcesUsed: {
    name: string;
    url: string;
    sourceType?: CredibilityType | string;
    isPrimary: boolean;
  }[];
  sourcesDisagree?: {
    hasDisagreement: boolean;
    details?: string;
  };
  isUserEdited?: boolean;
}
