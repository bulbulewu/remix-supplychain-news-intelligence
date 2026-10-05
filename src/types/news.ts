export type TimeWindow = '6h' | '12h' | '24h' | '48h' | '72h' | '7d';

export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'IMPORTANT' | 'WATCH' | 'LOW';

export type ImpactLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export type CredibilityType = 
  | 'Established news organization'
  | 'Specialist industry publication'
  | 'Government/official source'
  | 'Corporate announcement'
  | 'Trade organization'
  | 'Secondary publication';

export interface ScoreBreakdown {
  supplyChainRelevance: number; // 0-25
  procurementImpact: number;    // 0-15
  businessEconomicImpact: number; // 0-15
  urgency: number;              // 0-10
  geographicImpact: number;     // 0-10
  industryImpact: number;       // 0-10
  sourceAuthority: number;      // 0-5
  crossSourceConfirmation: number; // 0-5
  duration: number;             // 0-5
  total: number;                // 0-100
}

export interface SourceItem {
  name: string;
  url: string;
  publishedAt: string;
  sourceType: CredibilityType;
  domain: string;
}

export interface TimelineEvent {
  timestamp: string;
  headline: string;
  source: string;
}

export interface BangladeshRelevance {
  level: ImpactLevel;
  rationale: string;
  sectorsAffected: string[];
}

export interface FactVsAnalysis {
  reportedFacts: string[];
  aiAnalysis: string[];
  sourceClaims: string[];
}

export interface ConflictingReport {
  hasConflict: boolean;
  details?: string;
  sourceA?: string;
  sourceB?: string;
}

export interface NewsItem {
  id: string;
  headline: string;
  source: string;
  sourceUrl: string;
  publishedAt: string;
  discoveredAt: string;
  category: string;
  subcategory: string;
  regions: string[];
  countries: string[];
  industries: string[];
  oneLineSummary: string;
  executiveSummary: string;
  keyFacts: string[];
  supplyChainImpact: {
    procurement?: string;
    sourcing?: string;
    logistics?: string;
    manufacturing?: string;
    inventory?: string;
    cost?: string;
    supplierRisk?: string;
    leadTime?: string;
  };
  impactRatings: {
    costImpact: ImpactLevel;
    supplyRisk: ImpactLevel;
    leadTimeRisk: ImpactLevel;
    procurementImpact: ImpactLevel;
    logisticsImpact: ImpactLevel;
    supplierImpact: ImpactLevel;
  };
  priorityScore: number;
  priorityLevel: PriorityLevel;
  scoreBreakdown: ScoreBreakdown;
  whyImportant: string[];
  whatToWatch: string[];
  credibilityType: CredibilityType;
  confidence: 'High' | 'Medium' | 'Low';
  confidenceReason: string;
  isDeveloping: boolean;
  isBreaking: boolean;
  timeline: TimelineEvent[];
  alsoReportedBy: SourceItem[];
  bangladeshImpact: BangladeshRelevance;
  factVsAnalysis: FactVsAnalysis;
  conflictingReports?: ConflictingReport;
  metrics?: {
    transitDelayDays?: number;
    costIncreasePct?: number;
  };
}

export interface RiskRadarCategory {
  id: string;
  name: string;
  level: ImpactLevel;
  score: number;
  driverEvent: string;
  keyIndicator: string;
}

export interface EmergingTrend {
  id: string;
  name: string;
  storyCount: number;
  countriesAffected: string[];
  industriesAffected: string[];
  priority: PriorityLevel;
  firstDetected: string;
  latestUpdate: string;
  summary: string;
  topSources: string[];
}

export interface WhatChanged {
  newMajorEvents: string[];
  escalatedEvents: string[];
  weakenedEvents: string[];
  newCountriesAffected: string[];
  newIndustriesAffected: string[];
}

export interface WatchNextItem {
  id: string;
  title: string;
  expectedEvent: string;
  timeframe: string;
  affectedSectors: string[];
  supportingSource: string;
}

export interface Top10Thing {
  rank: number;
  headline: string;
  whyItMatters: string;
  newsItemId: string;
  priorityScore: number;
  source: string;
}

export interface IntelligenceDataset {
  newsWindow: {
    start: string;
    end: string;
    windowKey: TimeWindow;
  };
  lastUpdated: string;
  totalAnalyzed: number;
  items: NewsItem[];
  riskRadar: RiskRadarCategory[];
  trends: EmergingTrend[];
  whatChanged: WhatChanged;
  watchNext: WatchNextItem[];
  top10Things: Top10Thing[];
  isDemoFallback?: boolean;
}

export interface UserAlertRule {
  id: string;
  name: string;
  minScore: number;
  category?: string;
  country?: string;
  industry?: string;
  active: boolean;
}

export interface SavedBookmark {
  newsItemId: string;
  savedAt: string;
  folder: string;
  note?: string;
}

export interface VideoCreatedRecord {
  newsItemId: string;
  headline: string;
  createdAt: string; // ISO date string
  formattedDate: string; // e.g. "Oct 4, 2026"
  source?: string;
  category?: string;
  priorityScore?: number;
  duration?: string; // e.g. "30s", "1m", "3m", "5m" or summary string
  durations?: string[]; // e.g. ["30s", "1m"]
  notes?: string;
}

export interface QuickReadItem {
  newsItemId: string;
  addedAt: string;
}
