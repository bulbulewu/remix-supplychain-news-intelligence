import { IntelligenceDataset, NewsItem, RiskRadarCategory, EmergingTrend, WhatChanged, WatchNextItem, Top10Thing } from '../types/news';

const now = new Date();
const windowStart = new Date(now.getTime() - 72 * 60 * 60 * 1000);

export const DEFAULT_RISK_RADAR: RiskRadarCategory[] = [
  {
    id: 'shipping',
    name: 'Shipping & Freight',
    level: 'Critical',
    score: 92,
    driverEvent: 'Bab-el-Mandeb & Red Sea route diversions around Cape of Good Hope, +12-14 days transit',
    keyIndicator: 'Spot container rates up +28% MoM; Asia-North Europe equipment turnaround stretched.'
  },
  {
    id: 'trade',
    name: 'Trade & Tariffs',
    level: 'High',
    score: 84,
    driverEvent: 'US Section 301 tariff exclusions expiration & EU Anti-Subsidy duties on EV/battery inputs',
    keyIndicator: 'Customs classification audits tightening; +25-100% duty impact on critical sub-assemblies.'
  },
  {
    id: 'suppliers',
    name: 'Supplier Risk',
    level: 'High',
    score: 79,
    driverEvent: 'Tier-2 and Tier-3 semiconductor packaging and wafer foundry concentration in East Asia',
    keyIndicator: 'Single-source dependency warnings in automotive MCUs and power management ICs.'
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing & Plants',
    level: 'Medium',
    score: 64,
    driverEvent: 'European industrial gas and chemical plant capacity utilization normalization',
    keyIndicator: 'Germany & Benelux chemical feedstock output stabilized; energy surcharges tapering.'
  },
  {
    id: 'energy',
    name: 'Energy Supply',
    level: 'High',
    score: 76,
    driverEvent: 'LNG maritime shipping bottlenecks and refinery maintenance cycles in the Gulf Coast',
    keyIndicator: 'Diesel fuel bunkering surcharges volatile; industrial electricity tariffs elevated in EU.'
  },
  {
    id: 'commodities',
    name: 'Commodities & Raw Materials',
    level: 'Critical',
    score: 88,
    driverEvent: 'Copper concentrate refining treatment charges collapsing & bauxite/alumina export curbs',
    keyIndicator: 'Smelter processing charges negative in spot contracts; alumina supply tightness.'
  },
  {
    id: 'geopolitics',
    name: 'Geopolitics & Sanctions',
    level: 'Critical',
    score: 91,
    driverEvent: 'Strait of Malacca naval exercises & secondary sanctions targeting dual-use logistics hubs',
    keyIndicator: 'Freight insurance war-risk premia applied to eastern Mediterranean and southern Red Sea.'
  },
  {
    id: 'labor',
    name: 'Labor & Port Strikes',
    level: 'High',
    score: 81,
    driverEvent: 'ILA East Coast & Gulf Coast port master agreement automation negotiations monitoring',
    keyIndicator: 'Shippers frontloading inventory to US West Coast ports; rail intermodal dwell times up.'
  },
  {
    id: 'technology',
    name: 'Technology & Cyber',
    level: 'Medium',
    score: 58,
    driverEvent: 'Maritime EDI gateway vulnerabilities & cloud warehouse management system uptime checks',
    keyIndicator: 'Global freight forwarders enforcing API authentication and redundant booking gateways.'
  },
  {
    id: 'disasters',
    name: 'Natural Disasters & Weather',
    level: 'Medium',
    score: 62,
    driverEvent: 'Panama Canal draft restrictions easing to 48ft while typhoons disrupt South China ports',
    keyIndicator: 'Daily transit slots normalized to 36 vessels; monsoon squalls causing 48hr port delays in Ningbo.'
  }
];

export const DEFAULT_TRENDS: EmergingTrend[] = [
  {
    id: 'trend-red-sea',
    name: 'Prolonged Cape of Good Hope Routing & Container Imbalance',
    storyCount: 14,
    countriesAffected: ['Singapore', 'Egypt', 'Netherlands', 'Germany', 'United States', 'China', 'India', 'Bangladesh'],
    industriesAffected: ['Retail', 'Automotive', 'Apparel', 'Chemicals', 'Consumer Goods'],
    priority: 'CRITICAL',
    firstDetected: '2024-01-15T00:00:00Z',
    latestUpdate: new Date(now.getTime() - 4 * 3600 * 1000).toISOString(),
    summary: 'Carriers are permanently restructuring schedules around Africa, driving structural structural vessel shortages and empty container imbalances in South Asian and Chinese manufacturing hubs.',
    topSources: ['Reuters', 'Financial Times', 'FreightWaves', 'Lloyd\'s List']
  },
  {
    id: 'trend-critical-minerals',
    name: 'Resource Nationalism & Critical Mineral Export Licensing',
    storyCount: 9,
    countriesAffected: ['China', 'Indonesia', 'Democratic Republic of Congo', 'Australia', 'United States', 'European Union'],
    industriesAffected: ['Semiconductors', 'EV & Batteries', 'Renewable Energy', 'Aerospace'],
    priority: 'HIGH',
    firstDetected: '2024-03-10T00:00:00Z',
    latestUpdate: new Date(now.getTime() - 9 * 3600 * 1000).toISOString(),
    summary: 'Government controls over gallium, germanium, graphite, and rare earth processing are forcing procurement executives to audit Tier-3 material provenance and qualify dual-sourcing refineries.',
    topSources: ['Bloomberg', 'Nikkei Asia', 'The Wall Street Journal']
  },
  {
    id: 'trend-nearshore-mexico-vietnam',
    name: 'Accelerated Nearshoring to Mexico and Vietnam Friendshoring',
    storyCount: 8,
    countriesAffected: ['United States', 'Mexico', 'Vietnam', 'China', 'India'],
    industriesAffected: ['Electronics', 'Automotive', 'Industrial Machinery', 'Textiles'],
    priority: 'IMPORTANT',
    firstDetected: '2024-02-01T00:00:00Z',
    latestUpdate: new Date(now.getTime() - 14 * 3600 * 1000).toISOString(),
    summary: 'US and EU multinational buyers are executing contractual transitions to Mexico for industrial componentry and Vietnam/India for consumer electronics assembly to hedge trade tariff risks.',
    topSources: ['CNBC', 'The Wall Street Journal', 'Supply Chain Brain']
  }
];

export const DEFAULT_WHAT_CHANGED: WhatChanged = {
  newMajorEvents: [
    'US Trade Representative issues updated tariff guidelines on Chinese advanced robotics and battery anodes.',
    'Chittagong (Chattogram) Port Authority deploys 4 new gantry cranes, reducing container turnaround dwell times from 84 hours to 46 hours.',
    'Maersk and Hapag-Lloyd issue joint advisory confirming Gemini Cooperation network schedules to maintain Cape rerouting through Q4.'
  ],
  escalatedEvents: [
    'Copper smelting treatment & refining charges (TC/RCs) plunge to multi-year lows, threatening refined wire rod delivery schedules.',
    'Red Sea war-risk insurance surcharges renewed for another 30-day window across container vessels calling Djibouti and Jeddah.'
  ],
  weakenedEvents: [
    'Panama Canal draft restrictions eased further to 48.5 feet as Gatun Lake reservoir water levels recover to seasonal norms.',
    'European natural gas wholesale storage reaches 93% capacity, mitigating winter power rationing risks for industrial manufacturing.'
  ],
  newCountriesAffected: ['Bangladesh', 'South Korea', 'Mexico', 'Poland'],
  newIndustriesAffected: ['Industrial Wire & Cable', 'Apparel & Ready-Made Garments', 'Battery Anode Materials']
};

export const DEFAULT_WATCH_NEXT: WatchNextItem[] = [
  {
    id: 'wn-1',
    title: 'US East Coast ILA Automation Clause Review',
    expectedEvent: 'Joint maritime alliance meeting on port crane optical automation and wage supplements',
    timeframe: 'Next 24–48 Hours',
    affectedSectors: ['Container Shipping', 'Automotive Parts', 'Retail Import'],
    supportingSource: 'Journal of Commerce / Reuters'
  },
  {
    id: 'wn-2',
    title: 'EU CBAM (Carbon Border Adjustment) Transition Filing Audit',
    expectedEvent: 'European Commission publication of updated default emission benchmark values for imported steel, aluminum, and fertilizers',
    timeframe: 'Next 48 Hours',
    affectedSectors: ['Metals & Mining', 'Chemicals', 'Industrial Sourcing'],
    supportingSource: 'Financial Times / Euronews'
  },
  {
    id: 'wn-3',
    title: 'Bangladesh Energy & Gas Supply Allocation for RMG Factories',
    expectedEvent: 'Petrobangla LNG cargo offloading schedule and industrial gas pressure stabilization plan',
    timeframe: 'Next 24 Hours',
    affectedSectors: ['Textiles & Garments', 'Dyeing & Finishing', 'Logistics'],
    supportingSource: 'The Daily Star / Bangladesh Textile Today'
  },
  {
    id: 'wn-4',
    title: 'Taiwan Semiconductor Foundry Capacity Update',
    expectedEvent: 'Quarterly foundry wafer allocation announcements for high-voltage automotive and power semiconductor lines',
    timeframe: 'Next 72 Hours',
    affectedSectors: ['Semiconductors', 'Automotive', 'Consumer Electronics'],
    supportingSource: 'Nikkei Asia / Bloomberg'
  }
];

export const DEFAULT_NEWS_ITEMS: NewsItem[] = [
  {
    id: 'sc-news-001',
    headline: 'Global Container Shipping Diverts Around Cape of Good Hope: Spot Rates Surge 28% MoM',
    source: 'Reuters',
    sourceUrl: 'https://www.reuters.com/business/retail-consumer/global-shipping-freight-rates-red-sea-diversion-2024/',
    publishedAt: new Date(now.getTime() - 2.5 * 3600 * 1000).toISOString(),
    discoveredAt: new Date(now.getTime() - 2 * 3600 * 1000).toISOString(),
    category: 'Shipping',
    subcategory: 'Maritime Logistics & Freight Rates',
    regions: ['Middle East', 'Europe', 'Asia', 'North America'],
    countries: ['Egypt', 'Singapore', 'Netherlands', 'United States', 'China', 'India'],
    industries: ['Retail', 'Automotive', 'Electronics', 'Consumer Goods', 'Chemicals'],
    oneLineSummary: 'Major ocean carriers confirm prolonged Cape of Good Hope rerouting, driving container shortages across Asian export hubs and pushing freight rates higher.',
    executiveSummary: 'Major ocean alliances including Ocean Alliance, 2M, and THE Alliance have reiterated that commercial container traffic through the Suez Canal will remain suspended. The rerouting adds 10 to 14 days to Asia-Europe round trips and absorbs approximately 9% of effective global container vessel capacity.',
    keyFacts: [
      'Shanghai to Rotterdam spot rates climbed 28% month-over-month to $4,650/FEU.',
      'Transit times around Africa add 3,500 nautical miles, requiring 2-3 extra vessels per service string.',
      'Container turn-times at major Asian loading hubs (Ningbo, Port Klang) extended by 5-8 days.',
      'Air cargo charter rates on China-Europe lanes rose 14% as high-value shippers shift urgently needed inventory.'
    ],
    supplyChainImpact: {
      procurement: 'Contract ocean freight negotiations facing GRI (General Rate Increase) and Emergency Bunker Surcharges (EBS) of $350-$600 per container.',
      sourcing: 'European retail buyers moving purchase order release dates forward by 3 weeks to account for longer sailing schedules.',
      logistics: 'Intermodal container repositioning strained in Europe (Rotterdam, Hamburg) with stack-yard dwell times rising.',
      inventory: 'Buffer stock requirements increased from 30 days to 45 days for seasonal goods and critical automotive Tier-1 assemblies.',
      cost: 'Landed cost per unit for imported manufactured items projected to rise 3.2% to 5.8% based on freight proportion.',
      leadTime: 'Average sea freight lead time increased by 11 to 15 calendar days from East Asia to Northwest Europe.'
    },
    impactRatings: {
      costImpact: 'High',
      supplyRisk: 'High',
      leadTimeRisk: 'Critical',
      procurementImpact: 'Critical',
      logisticsImpact: 'Critical',
      supplierImpact: 'Medium'
    },
    priorityScore: 94,
    priorityLevel: 'CRITICAL',
    scoreBreakdown: {
      supplyChainRelevance: 25,
      procurementImpact: 15,
      businessEconomicImpact: 14,
      urgency: 10,
      geographicImpact: 9,
      industryImpact: 9,
      sourceAuthority: 5,
      crossSourceConfirmation: 4,
      duration: 3,
      total: 94
    },
    whyImportant: [
      'Directly affects ocean shipping routes connecting Asia, Europe, and the US East Coast',
      'Compounds global vessel capacity utilization, pushing freight and bunker surcharges higher',
      'Forces procurement and supply planning teams to extend procurement lead times by 2-3 weeks',
      'Corroborated across 5 Tier-1 international business news agencies and maritime authorities'
    ],
    whatToWatch: [
      'Review maritime carrier contracts for floating vs. fixed bunker fuel and security surcharges.',
      'Adjust ERP purchase order release triggers by +14 days for Asia-EU origin shipments.',
      'Verify container equipment availability with forwarders 21 days prior to origin cargo ready date (CRD).'
    ],
    credibilityType: 'Established news organization',
    confidence: 'High',
    confidenceReason: 'Verified by primary statements from major shipping liners (Maersk, MSC, CMA CGM) and freight index clearinghouses.',
    isDeveloping: true,
    isBreaking: false,
    timeline: [
      { timestamp: '06:00 UTC', headline: 'Carriers confirm extended Cape routing throughout coming fiscal quarters', source: 'Reuters' },
      { timestamp: '09:30 UTC', headline: 'Drewry World Container Index notes 28% MoM rate climb', source: 'Drewry Shipping Consultants' },
      { timestamp: '12:15 UTC', headline: 'European automotive manufacturers initiate rail-sea contingency routings', source: 'Financial Times' }
    ],
    alsoReportedBy: [
      { name: 'Financial Times', url: 'https://www.ft.com/content/shipping-red-sea-freight-impact', publishedAt: new Date(now.getTime() - 2.8 * 3600 * 1000).toISOString(), sourceType: 'Established news organization', domain: 'ft.com' },
      { name: 'Bloomberg', url: 'https://www.bloomberg.com/news/articles/global-trade-shipping-cape-diversion', publishedAt: new Date(now.getTime() - 3.1 * 3600 * 1000).toISOString(), sourceType: 'Established news organization', domain: 'bloomberg.com' },
      { name: 'FreightWaves', url: 'https://www.freightwaves.com/news/maritime-capacity-tightens-as-ships-divert', publishedAt: new Date(now.getTime() - 3.5 * 3600 * 1000).toISOString(), sourceType: 'Specialist industry publication', domain: 'freightwaves.com' }
    ],
    bangladeshImpact: {
      level: 'Critical',
      rationale: 'RMG apparel exporters in Bangladesh face export container dwell times and steep freight surcharges for shipments to EU and US buyers. Transit times from Chittagong transshipment ports (Singapore/Colombo) have expanded by 12-14 days, raising risk of delayed spring collection delivery.',
      sectorsAffected: ['Ready-Made Garments (RMG)', 'Knitwear & Woven Apparel', 'Chittagong Feeder Vessels', 'Cotton Fabric Inflow']
    },
    factVsAnalysis: {
      reportedFacts: [
        'Over 85% of standard container vessels on Far East-Europe lanes are navigating via the Cape of Good Hope.',
        'Average bunker fuel consumption per vessel is up ~35% due to higher navigation speeds to mitigate delays.',
        'Major ocean spot indices recorded composite weekly gains of 8.2%.'
      ],
      aiAnalysis: [
        'Equipment shortages at Colombo and Singapore will likely spill over into feeder ports like Chattogram within 10-14 days.',
        'Retailers with tight working capital may face cash-flow pressure as inventory sits in transit for an extra fortnight.'
      ],
      sourceClaims: [
        'Shipping line executives claim schedule reliability will normalize once extra ships in current orderbook enter service in late 2024.'
      ]
    }
  },
  {
    id: 'sc-news-002',
    headline: 'US Tightens Semiconductor Equipment Export Controls; ASML & Tokyo Electron Comply with Expanded Licensing',
    source: 'Financial Times',
    sourceUrl: 'https://www.ft.com/content/semiconductor-export-controls-asml-equipment-rules',
    publishedAt: new Date(now.getTime() - 6.2 * 3600 * 1000).toISOString(),
    discoveredAt: new Date(now.getTime() - 5.8 * 3600 * 1000).toISOString(),
    category: 'Tariffs',
    subcategory: 'Export Controls & Semiconductor Supply Chain',
    regions: ['North America', 'Europe', 'East Asia'],
    countries: ['United States', 'Netherlands', 'Japan', 'China', 'Taiwan', 'South Korea'],
    industries: ['Semiconductors', 'Electronics', 'Automotive', 'Industrial Manufacturing', 'Technology'],
    oneLineSummary: 'Expanded multilateral export controls limit advanced DUV lithography and wafer fab equipment exports, accelerating dual-track semiconductor supply chains.',
    executiveSummary: 'The US Department of Commerce Bureau of Industry and Security (BIS), coordinating with Dutch and Japanese trade ministries, has published revised export parameters for advanced wafer fabrication tools, including immersion lithography and atomic layer deposition. The rules impact non-leading edge tools capable of multi-patterning.',
    keyFacts: [
      'Restrictions lower technical thresholds for immersion DUV tools exported without explicit government license.',
      'Equipment makers ASML and Tokyo Electron reaffirmed compliance with Dutch and Japanese regulatory decrees.',
      'Chinese domestic wafer foundries have accelerated qualification of domestic chemical precursors and legacy tool spares.',
      'Automotive and industrial chip suppliers anticipate extended equipment delivery lead times for legacy 28nm/40nm fab expansions.'
    ],
    supplyChainImpact: {
      procurement: 'Procurement teams must audit Tier-2 IC suppliers for export licensing risks and fab location exposure.',
      sourcing: 'Multi-sourcing chip mandates accelerated; OEM purchasing contracts require geographical fab disclosure.',
      inventory: 'Buffer stock for specialized power management ICs and automotive microcontrollers recommended at 16 weeks.',
      cost: 'Foundry wafer pricing on non-China production lines trading at a 15-20% premium over domestic Chinese foundries.',
      supplierRisk: 'High risk of component redesign if sub-tier suppliers lose access to critical replacement parts.'
    },
    impactRatings: {
      costImpact: 'Medium',
      supplyRisk: 'Critical',
      leadTimeRisk: 'High',
      procurementImpact: 'Critical',
      logisticsImpact: 'Low',
      supplierImpact: 'Critical'
    },
    priorityScore: 91,
    priorityLevel: 'CRITICAL',
    scoreBreakdown: {
      supplyChainRelevance: 24,
      procurementImpact: 14,
      businessEconomicImpact: 14,
      urgency: 8,
      geographicImpact: 9,
      industryImpact: 10,
      sourceAuthority: 5,
      crossSourceConfirmation: 4,
      duration: 3,
      total: 91
    },
    whyImportant: [
      'Direct regulatory intervention into the global microelectronics supply chain',
      'Forces semiconductor manufacturers to segment production between China-domestic and global export lines',
      'Increases wafer manufacturing costs and creates potential component lead-time volatility for automotive and tech OEMs',
      'Supported by official government gazettes and corporate filings'
    ],
    whatToWatch: [
      'Request Bill of Materials (BOM) fab country-of-origin verification from electronic component distributors.',
      'Audit single-sourced microcontroller (MCU) and analog IC components for secondary packaging sources.',
      'Monitor lead times on 28nm legacy automotive semiconductor wafer starts.'
    ],
    credibilityType: 'Established news organization',
    confidence: 'High',
    confidenceReason: 'Official export control documentation cross-referenced with public statements from ASML and Dutch Foreign Trade Ministry.',
    isDeveloping: true,
    isBreaking: false,
    timeline: [
      { timestamp: '04:30 UTC', headline: 'Dutch government issues updated licensing decree on advanced DUV machinery', source: 'Government of Netherlands' },
      { timestamp: '08:00 UTC', headline: 'ASML issues customer advisory confirming export license application procedures', source: 'ASML Investor Relations' },
      { timestamp: '11:45 UTC', headline: 'Semiconductor industry associations assess wafer fab tool delivery impacts', source: 'Financial Times' }
    ],
    alsoReportedBy: [
      { name: 'Bloomberg', url: 'https://www.bloomberg.com/news/articles/asml-semiconductor-export-restrictions-dutch-us', publishedAt: new Date(now.getTime() - 6.8 * 3600 * 1000).toISOString(), sourceType: 'Established news organization', domain: 'bloomberg.com' },
      { name: 'Nikkei Asia', url: 'https://asia.nikkei.com/Business/Tech/Semiconductors/Tokyo-Electron-complies-with-export-rules', publishedAt: new Date(now.getTime() - 7.2 * 3600 * 1000).toISOString(), sourceType: 'Established news organization', domain: 'asia.nikkei.com' },
      { name: 'The Wall Street Journal', url: 'https://www.wsj.com/tech/chips-export-controls-global-impact', publishedAt: new Date(now.getTime() - 7.5 * 3600 * 1000).toISOString(), sourceType: 'Established news organization', domain: 'wsj.com' }
    ],
    bangladeshImpact: {
      level: 'Medium',
      rationale: 'Indirect impact on Bangladesh electronics assemblers (Walton, Singer, Samsung local assembly) that source printed circuit board assemblies (PCBAs) and microcontrollers from East Asia. Rising chip fabrication costs and supply segregation may elevate component purchase costs for local appliance and tech manufacturing.',
      sectorsAffected: ['Domestic Electronics Assembly', 'Telecom Infrastructure Spares', 'IoT & Smart Metering Hardware']
    },
    factVsAnalysis: {
      reportedFacts: [
        'The revised regulations require individual export authorization for twinscan immersion DUV systems.',
        'ASML stated the rules do not alter its published 2024-2025 financial outlook.',
        'Chinese fab utilization on mature nodes remains above 88%.'
      ],
      aiAnalysis: [
        'Expect chipmakers to build secondary fab capacity in Singapore, Malaysia, and Japan with non-restricted toolsets.',
        'Procurement costs for electronic assemblies with Chinese-fabricated microcontrollers may face verification challenges under US procurement rules.'
      ],
      sourceClaims: [
        'Industry analysts claim the gap between Chinese domestic toolsets and Western lithography will remain 3-5 years.'
      ]
    }
  },
  {
    id: 'sc-news-003',
    headline: 'Copper Treatment Charges Fall to Historic Lows: Smelter Curtailments Threaten Refined Metal & Wire Supply',
    source: 'Bloomberg',
    sourceUrl: 'https://www.bloomberg.com/news/articles/copper-smelters-face-treatment-charge-collapse',
    publishedAt: new Date(now.getTime() - 11.5 * 3600 * 1000).toISOString(),
    discoveredAt: new Date(now.getTime() - 10.8 * 3600 * 1000).toISOString(),
    category: 'Commodities',
    subcategory: 'Critical Minerals & Industrial Metals',
    regions: ['Asia', 'Latin America', 'Europe', 'North America'],
    countries: ['China', 'Chile', 'Peru', 'Indonesia', 'Germany', 'United States'],
    industries: ['Metals & Mining', 'Electrical Equipment', 'Automotive', 'Renewable Energy', 'Construction'],
    oneLineSummary: 'Severe mine-supply bottlenecks drive copper concentrate processing fees near zero, prompting smelters to plan output cuts that could tighten refined copper cathode availability.',
    executiveSummary: 'Spot treatment and refining charges (TC/RCs) paid by copper miners to smelters have dropped to single digits per ton due to acute concentrate shortages following mine halts in Panama and lowered production guidance in South America. Chinese and European smelters are evaluating coordinated maintenance shutdowns, raising refined cathode delivery risks for Q3/Q4.',
    keyFacts: [
      'Spot TC/RCs fell below $8/ton and 0.8 cents/lb, down from over $80/ton twelve months prior.',
      'Smelters operate at negative processing margins without acid credit offsets.',
      'Refined copper inventories on LME and SHFE remain tight relative to global demand expectations.',
      'Wire rod, electrical harness, and transformer manufacturers face rising cathode premia.'
    ],
    supplyChainImpact: {
      procurement: 'Commodity buyers should review index-linked copper purchase clauses and lock in physical delivery quotas.',
      sourcing: 'Ensure suppliers of copper rod and busbars have contracted cathode allocations with Tier-1 smelters.',
      cost: 'Raw material surcharge clauses in electrical cabling and motor winding contracts will likely trigger price increases.',
      leadTime: 'Delivery lead times for specialized high-purity oxygen-free copper rods could extend by 3-6 weeks.'
    },
    impactRatings: {
      costImpact: 'Critical',
      supplyRisk: 'High',
      leadTimeRisk: 'High',
      procurementImpact: 'High',
      logisticsImpact: 'Low',
      supplierImpact: 'High'
    },
    priorityScore: 88,
    priorityLevel: 'HIGH',
    scoreBreakdown: {
      supplyChainRelevance: 23,
      procurementImpact: 14,
      businessEconomicImpact: 13,
      urgency: 8,
      geographicImpact: 8,
      industryImpact: 9,
      sourceAuthority: 5,
      crossSourceConfirmation: 4,
      duration: 4,
      total: 88
    },
    whyImportant: [
      'Copper is the foundational conductor for electrification, power grids, EVs, and electronics',
      'Concentrate shortage directly constrains cathode refining, affecting downstream electrical wiring and components',
      'Negative smelter margins historically lead to capacity curtailments and spot price spikes',
      'Multiple commodity pricing bureaus (Fastmarkets, S&P Platts) report synchronized data'
    ],
    whatToWatch: [
      'Check supplier contract language for force majeure thresholds tied to smelter maintenance.',
      'Consider hedging or forward purchasing for Q3/Q4 baseline copper metal requirements.',
      'Monitor scrap copper availability as an alternative secondary feed.'
    ],
    credibilityType: 'Established news organization',
    confidence: 'High',
    confidenceReason: 'Verified by London Metal Exchange (LME) warehouse data and International Copper Study Group (ICSG) reports.',
    isDeveloping: true,
    isBreaking: false,
    timeline: [
      { timestamp: '07:15 UTC', headline: 'Smelter industry association convenes in Beijing on capacity coordination', source: 'Bloomberg' },
      { timestamp: '10:45 UTC', headline: 'Fastmarkets reports spot TC/RC transactions at historic lows', source: 'Fastmarkets' }
    ],
    alsoReportedBy: [
      { name: 'Reuters', url: 'https://www.reuters.com/markets/commodities/copper-treatment-charges-plunge-smelter-cuts', publishedAt: new Date(now.getTime() - 12.2 * 3600 * 1000).toISOString(), sourceType: 'Established news organization', domain: 'reuters.com' },
      { name: 'Mining.com', url: 'https://www.mining.com/copper-concentrate-crunch-smelter-margins', publishedAt: new Date(now.getTime() - 13.0 * 3600 * 1000).toISOString(), sourceType: 'Specialist industry publication', domain: 'mining.com' }
    ],
    bangladeshImpact: {
      level: 'High',
      rationale: 'Bangladesh electrical cable manufacturing (BRB Cables, BBS Cables, Paradise Cables) and rural electrification projects depend 100% on imported copper cathodes and wire rods. Escalating cathode premia and tighter smelter allocations directly impact transformer manufacturing and infrastructure project procurement costs.',
      sectorsAffected: ['Electrical Wire & Cable Manufacturing', 'Transformer & Power Grid Hardware', 'Industrial Construction']
    },
    factVsAnalysis: {
      reportedFacts: [
        'Cobre Panama mine remains idled, removing approximately 350,000 tons of annual copper concentrate.',
        'LME spot cash copper settled with a tight backwardation spread.',
        'Smelter capacity utilization in Asia reached 91% in Q1 prior to margin collapse.'
      ],
      aiAnalysis: [
        'Expect refined cathode producers to prioritize domestic long-term contract customers over spot export allocations.',
        'Cable manufacturers with floating price contracts will pass cost surges immediately to infrastructure projects.'
      ],
      sourceClaims: [
        'Analysts at Goldman Sachs predict a 450,000-ton refined copper deficit if smelter cuts exceed 5%.'
      ]
    }
  },
  {
    id: 'sc-news-004',
    headline: 'Chittagong Port Installs 4 New Quay Gantry Cranes; Container Dwell Time Drops from 84h to 46h',
    source: 'The Daily Star',
    sourceUrl: 'https://www.thedailystar.net/business/economy/news/chittagong-port-berth-efficiency-container-dwell-time',
    publishedAt: new Date(now.getTime() - 14.8 * 3600 * 1000).toISOString(),
    discoveredAt: new Date(now.getTime() - 14.2 * 3600 * 1000).toISOString(),
    category: 'Logistics',
    subcategory: 'Port Operations & Feeder Connectivity',
    regions: ['South Asia', 'Asia'],
    countries: ['Bangladesh', 'Singapore', 'Malaysia', 'Sri Lanka'],
    industries: ['Logistics', 'Apparel', 'Textiles', 'Retail', 'Shipping'],
    oneLineSummary: 'Chattogram Port Commission operationalizes new gantry cranes at New Mooring Container Terminal, easing export container congestion for Bangladesh RMG shipments.',
    executiveSummary: 'The Chittagong Port Authority (CPA) has commissioned four heavy-duty rail-mounted quay gantry cranes at Berth 4 and 5 of the New Mooring Container Terminal (NCT). The upgrade increases vessel turnaround speeds by 38%, reducing average container dwell times from 84 hours to under 46 hours and easing feeder ship queues waiting at the outer anchorage.',
    keyFacts: [
      'Four Chinese-built ZPMC quay gantry cranes are now fully integrated into terminal operating systems.',
      'Container moves per crane hour increased from 18 to 28 TEUs.',
      'Vessel waiting time at the outer anchorage dropped from 4-5 days to 1.5-2 days.',
      'Feeder vessels connecting to Singapore, Port Klang, and Colombo report reduced turnaround costs.'
    ],
    supplyChainImpact: {
      procurement: 'Apparel brands sourcing garments from Dhaka and Chittagong export zones can anticipate lower port demurrage surcharges.',
      sourcing: 'Improves reliability of cargo handover for European and North American seasonal fashion lines.',
      logistics: 'Feeder connectivity to transshipment hubs stabilized; reduced likelihood of rolled containers at transshipment points.',
      leadTime: 'Shortens total export transit time by 2.5 to 3 full calendar days.'
    },
    impactRatings: {
      costImpact: 'Medium',
      supplyRisk: 'Low',
      leadTimeRisk: 'Low',
      procurementImpact: 'High',
      logisticsImpact: 'High',
      supplierImpact: 'Medium'
    },
    priorityScore: 85,
    priorityLevel: 'HIGH',
    scoreBreakdown: {
      supplyChainRelevance: 23,
      procurementImpact: 13,
      businessEconomicImpact: 12,
      urgency: 7,
      geographicImpact: 9,
      industryImpact: 8,
      sourceAuthority: 4,
      crossSourceConfirmation: 4,
      duration: 5,
      total: 85
    },
    whyImportant: [
      'Chattogram handles over 92% of Bangladesh maritime international trade and RMG exports',
      'Directly alleviates long-standing port congestion that added demurrage penalties and lead-time delays',
      'Provides tangible capacity improvement during a period of global sea freight disruption',
      'Confirmed by port authority operational logs and shipping agents association'
    ],
    whatToWatch: [
      'Advise freight forwarders to book direct feeder calls on the upgraded NCT berths.',
      'Monitor inland container depot (ICD) road transport turn-times between Dhaka and Chattogram.',
      'Track monsoon weather impacts on crane operations during peak export months.'
    ],
    credibilityType: 'Specialist industry publication',
    confidence: 'High',
    confidenceReason: 'Direct operational bulletin from Chittagong Port Authority (CPA) and Bangladesh Shipping Agents Association (BSAA).',
    isDeveloping: false,
    isBreaking: false,
    timeline: [
      { timestamp: '08:00 UTC', headline: 'CPA Chairman inaugurates commercial crane operations at Berth 5', source: 'CPA Press Release' },
      { timestamp: '12:30 UTC', headline: 'Feeder vessel MV HR Hera completes loading in record 28 hours', source: 'The Daily Star' }
    ],
    alsoReportedBy: [
      { name: 'Dhaka Tribune', url: 'https://www.dhakatribune.com/business/chittagong-port-cranes-operational-logistics', publishedAt: new Date(now.getTime() - 15.5 * 3600 * 1000).toISOString(), sourceType: 'Established news organization', domain: 'dhakatribune.com' },
      { name: 'Apparel Resources', url: 'https://apparelresources.com/supply-chain/logistics/chittagong-port-enhances-handling-capacity', publishedAt: new Date(now.getTime() - 16.0 * 3600 * 1000).toISOString(), sourceType: 'Specialist industry publication', domain: 'apparelresources.com' }
    ],
    bangladeshImpact: {
      level: 'Critical',
      rationale: 'Direct positive operational transformation for Bangladesh economy. 84% of national export earnings come from RMG shipped through Chattogram. Faster container turnaround minimizes costly air-freight conversions for delayed buyer purchase orders.',
      sectorsAffected: ['Ready-Made Garments (RMG)', 'Knitwear & Wovens', 'Imported Raw Cotton & Chemicals', 'Port Terminal Operations']
    },
    factVsAnalysis: {
      reportedFacts: [
        'The NCT facility can now berth 3 container ships simultaneously with dedicated crane coverage.',
        'Average vessel turnaround time was reduced by 38 hours during the initial trial week.',
        'CPA plans to add 4 additional rubber-tyred gantry (RTG) yard cranes next month.'
      ],
      aiAnalysis: [
        'While waterside berth productivity is improved, landside off-dock container depot bottlenecks in Chittagong could become the new pacing factor during peak export surges.',
        'Exporters should negotiate lower demurrage caps with forwarders given the faster port clearing times.'
      ],
      sourceClaims: [
        'Port officials claim Chattogram is on track to handle over 3.2 million TEUs this calendar year.'
      ]
    }
  },
  {
    id: 'sc-news-005',
    headline: 'US Trade Representative Finalizes Section 301 Tariff Modifications on Chinese Batteries, Steel, and Solar Cells',
    source: 'The Wall Street Journal',
    sourceUrl: 'https://www.wsj.com/economy/trade/us-finalizes-tariffs-china-ev-batteries-solar',
    publishedAt: new Date(now.getTime() - 18.0 * 3600 * 1000).toISOString(),
    discoveredAt: new Date(now.getTime() - 17.5 * 3600 * 1000).toISOString(),
    category: 'Tariffs',
    subcategory: 'Trade Restrictions & Customs Compliance',
    regions: ['North America', 'East Asia', 'Global'],
    countries: ['United States', 'China', 'Mexico', 'Canada'],
    industries: ['EV & Batteries', 'Automotive', 'Renewable Energy', 'Metals & Mining', 'Industrial Manufacturing'],
    oneLineSummary: 'USTR formally implements increased tariff rates of 25% to 100% on specific Chinese clean-tech imports, accelerating supply chain origin audits and nearshoring.',
    executiveSummary: 'The Office of the United States Trade Representative (USTR) has concluded its statutory review of Section 301 tariffs, upholding tariff rate hikes on key industrial categories: 100% on electric vehicles, 25% on lithium-ion EV batteries, 50% on solar cells, and 25% on steel and aluminum products. Strict rules of origin are being enforced to deter transshipment.',
    keyFacts: [
      'Tariff rates take effect across multi-tier staged tranches throughout 2024–2026.',
      'A limited temporary exclusion window remains open for specific machinery used in domestic US manufacturing.',
      'Customs and Border Protection (CBP) increases enforcement of Country of Origin declarations.',
      'US battery pack assemblers accelerating supplier qualification in South Korea, Japan, and North America.'
    ],
    supplyChainImpact: {
      procurement: 'Procurement teams must audit customs classification codes (HTS) to calculate exact landed duty liability.',
      sourcing: 'Nearshoring to Mexico, Vietnam, and India accelerates for sub-assemblies to avoid direct Section 301 exposure.',
      cost: 'Direct price escalation for imported battery modules and solar inverters into the US market.',
      supplierRisk: 'Suppliers utilizing non-compliant transshipment hubs face severe CBP seizure risks and penalties.'
    },
    impactRatings: {
      costImpact: 'Critical',
      supplyRisk: 'High',
      leadTimeRisk: 'Medium',
      procurementImpact: 'Critical',
      logisticsImpact: 'Medium',
      supplierImpact: 'High'
    },
    priorityScore: 89,
    priorityLevel: 'HIGH',
    scoreBreakdown: {
      supplyChainRelevance: 24,
      procurementImpact: 14,
      businessEconomicImpact: 14,
      urgency: 8,
      geographicImpact: 8,
      industryImpact: 9,
      sourceAuthority: 5,
      crossSourceConfirmation: 4,
      duration: 3,
      total: 89
    },
    whyImportant: [
      'Substantial cost impact for clean technology, energy transition, and automotive supply chains',
      'Forces systemic reallocation of capital expenditure and supplier contracts toward North American and allied trade zones',
      'Enforces aggressive customs scrutiny across intermediate processing nations',
      'Official statutory rule issued by US federal regulatory register'
    ],
    whatToWatch: [
      'Audit your Bill of Materials (BOM) for 8-digit HTS codes affected by the 25%-100% tariff increases.',
      'Review contract terms with Chinese Tier-1 suppliers regarding DDP (Delivered Duty Paid) vs. FOB liability.',
      'Monitor US Customs rulings regarding substantial transformation tests in third-party countries like Mexico and Vietnam.'
    ],
    credibilityType: 'Government/official source',
    confidence: 'High',
    confidenceReason: 'Verified through official Federal Register notices and formal USTR policy statements.',
    isDeveloping: true,
    isBreaking: false,
    timeline: [
      { timestamp: '14:00 UTC', headline: 'USTR submits final Section 301 determination for Federal Register publication', source: 'USTR.gov' },
      { timestamp: '16:30 UTC', headline: 'National Association of Manufacturers issues statement on machinery exclusion requests', source: 'NAM' }
    ],
    alsoReportedBy: [
      { name: 'CNBC', url: 'https://www.cnbc.com/2024/ustr-finalizes-tariffs-on-chinese-evs-batteries', publishedAt: new Date(now.getTime() - 18.5 * 3600 * 1000).toISOString(), sourceType: 'Established news organization', domain: 'cnbc.com' },
      { name: 'Reuters', url: 'https://www.reuters.com/world/us/biden-administration-finalizes-hikes-tariffs-chinese-goods-2024', publishedAt: new Date(now.getTime() - 19.1 * 3600 * 1000).toISOString(), sourceType: 'Established news organization', domain: 'reuters.com' }
    ],
    bangladeshImpact: {
      level: 'Low',
      rationale: 'Direct tariff targets do not impact Bangladesh garment or textile exports directly. However, Bangladesh manufacturers importing solar panels or lithium backup storage batteries for factory rooftop green energy transitions will find non-US market supply more competitively priced as diverted Chinese inventories seek alternative markets.',
      sectorsAffected: ['Industrial Solar Installation', 'Factory Energy Storage', 'Textile Factory Sustainability']
    },
    factVsAnalysis: {
      reportedFacts: [
        'Electric vehicles tariff rises from 25% to 100%.',
        'Lithium-ion non-EV battery tariff increases to 25% by 2026.',
        'Targeted imports covered by the rule total approximately $18 billion in annual trade volume.'
      ],
      aiAnalysis: [
        'Expect Chinese manufacturers to establish joint-venture assembly hubs in Morocco, Hungary, and Mexico to service Western markets.',
        'Procurement teams should prepare for extensive CBP Form 28 (Request for Information) inquiries on third-country intermediate goods.'
      ],
      sourceClaims: [
        'USTR claims tariffs protect domestic green manufacturing investments against subsidized overcapacity.'
      ]
    }
  },
  {
    id: 'sc-news-006',
    headline: 'European Chemical Feedstock Prices Ease as Natural Gas Storage Crosses 93% Capacity Ahead of Winter',
    source: 'Euronews',
    sourceUrl: 'https://www.euronews.com/business/european-gas-storage-crosses-93-percent-chemical-industry-eases',
    publishedAt: new Date(now.getTime() - 22.0 * 3600 * 1000).toISOString(),
    discoveredAt: new Date(now.getTime() - 21.4 * 3600 * 1000).toISOString(),
    category: 'Energy',
    subcategory: 'Industrial Feedstocks & Power Resiliency',
    regions: ['Europe'],
    countries: ['Germany', 'Netherlands', 'Belgium', 'France', 'Poland'],
    industries: ['Chemicals', 'Industrial Manufacturing', 'Pharmaceuticals', 'Plastics & Packaging'],
    oneLineSummary: 'EU underground gas storage hits 93% well ahead of regulatory deadline, stabilizing industrial chemical production margins and easing plastics feedstock surcharges.',
    executiveSummary: 'Gas Infrastructure Europe data reveals that EU underground natural gas storage facilities have surpassed 93% fullness, two months ahead of the November 1 statutory mandate. The supply cushion has moderated Dutch TTF benchmark prices, providing operational relief to energy-intensive chemical clusters in Germany, Belgium, and the Netherlands.',
    keyFacts: [
      'EU storage facilities hold approximately 105 billion cubic meters (bcm) of gas.',
      'Dutch TTF day-ahead gas prices declined 6.4% on the week to €34.80/MWh.',
      'Basic chemical producers (BASF, Covestro) report operational stabilization across ammonia and polymer lines.',
      'Energy price surcharges on plastic resins and industrial adhesives have begun tapering.'
    ],
    supplyChainImpact: {
      procurement: 'Procurement managers should renegotiate quarterly energy surcharges on bulk resins (PE, PP) and packaging materials.',
      manufacturing: 'Chemical plant capacity curtailments in Western Europe are being gradually reversed.',
      cost: 'Downstream packaging and coating procurement costs expected to stabilize into Q4.',
      supplierRisk: 'Risk of sudden winter gas rationing for Tier-2 European chemical suppliers minimized.'
    },
    impactRatings: {
      costImpact: 'Medium',
      supplyRisk: 'Low',
      leadTimeRisk: 'Low',
      procurementImpact: 'Medium',
      logisticsImpact: 'Low',
      supplierImpact: 'Medium'
    },
    priorityScore: 78,
    priorityLevel: 'HIGH',
    scoreBreakdown: {
      supplyChainRelevance: 20,
      procurementImpact: 12,
      businessEconomicImpact: 12,
      urgency: 6,
      geographicImpact: 8,
      industryImpact: 8,
      sourceAuthority: 4,
      crossSourceConfirmation: 4,
      duration: 4,
      total: 78
    },
    whyImportant: [
      'European chemical synthesis supplies key precursors to global pharmaceuticals, coatings, and automotive parts',
      'Gas price stability directly influences raw material pricing across polymers, resins, and fertilizers',
      'Eliminates the threat of emergency industrial shutdown protocols for the upcoming winter season',
      'Independently confirmed by official EU energy regulatory registries'
    ],
    whatToWatch: [
      'Request updated chemical index surcharge schedules from European polymer suppliers.',
      'Evaluate whether to index resin purchases to spot TTF rather than fixed annual rates.',
      'Monitor global LNG shipping rates into European regasification terminals in Zeebrugge and Rotterdam.'
    ],
    credibilityType: 'Established news organization',
    confidence: 'High',
    confidenceReason: 'Aggregated from Gas Infrastructure Europe (GIE) transparency platform and ICIS chemical market intelligence.',
    isDeveloping: false,
    isBreaking: false,
    timeline: [
      { timestamp: '10:00 UTC', headline: 'GIE publishes storage report showing 93.1% regional inventory level', source: 'Gas Infrastructure Europe' },
      { timestamp: '14:20 UTC', headline: 'European Chemical Industry Council (Cefic) issues quarterly economic assessment', source: 'Cefic' }
    ],
    alsoReportedBy: [
      { name: 'Financial Times', url: 'https://www.ft.com/content/europe-gas-storage-winter-security', publishedAt: new Date(now.getTime() - 22.8 * 3600 * 1000).toISOString(), sourceType: 'Established news organization', domain: 'ft.com' },
      { name: 'ICIS Chemical News', url: 'https://www.icis.com/explore/resources/news/europe-petrochemical-feedstock-margins-firm', publishedAt: new Date(now.getTime() - 23.5 * 3600 * 1000).toISOString(), sourceType: 'Specialist industry publication', domain: 'icis.com' }
    ],
    bangladeshImpact: {
      level: 'Low',
      rationale: 'Indirect benefit for Bangladesh pharmaceutical industry, which imports active pharmaceutical ingredients (APIs) and chemical intermediates from European fine-chemical synthesis firms. Stabilized European production lowers risk of API delivery delays.',
      sectorsAffected: ['Pharmaceutical APIs', 'Textile Dyes & Auxiliaries', 'Specialty Packaging']
    },
    factVsAnalysis: {
      reportedFacts: [
        'Storage levels exceed the 90% target set by EU regulation 2022/1032.',
        'LNG imports accounted for 42% of total European gas supply intake this quarter.',
        'TTF volatility index dropped to its lowest point in 18 months.'
      ],
      aiAnalysis: [
        'Buyers should not assume structural price drops to pre-2021 levels; LNG transport costs keep a floor under European industrial gas costs.',
        'Procurement contracts should retain dual-source clauses for key polymer grades.'
      ],
      sourceClaims: [
        'EU Energy Commissioner stated Europe enters the heating season in the strongest supply position since the 2022 crisis.'
      ]
    }
  },
  {
    id: 'sc-news-007',
    headline: 'Automotive OEMs Accelerate Dual-Sourcing for High-Voltage Battery Anodes Amid Natural Graphite Licensing Review',
    source: 'Nikkei Asia',
    sourceUrl: 'https://asia.nikkei.com/Business/Automobiles/Automakers-dual-source-graphite-battery-materials',
    publishedAt: new Date(now.getTime() - 28.5 * 3600 * 1000).toISOString(),
    discoveredAt: new Date(now.getTime() - 28.0 * 3600 * 1000).toISOString(),
    category: 'Supplier Risk',
    subcategory: 'Critical Minerals & Battery Chemistry',
    regions: ['East Asia', 'North America', 'Europe'],
    countries: ['Japan', 'South Korea', 'China', 'United States', 'Canada', 'Australia'],
    industries: ['Automotive', 'EV & Batteries', 'Metals & Mining', 'Technology'],
    oneLineSummary: 'Automakers expand supply contracts with synthetic graphite producers in North America and Japan as export permits for natural graphite remain subject to individual regulatory review.',
    executiveSummary: 'Major automotive manufacturers including Toyota, Honda, GM, and BMW are finalizing multi-year procurement pacts with synthetic graphite suppliers in North America and Japan. The strategic shift follows extended administrative review periods for export permits on battery-grade spherical graphite out of East Asia.',
    keyFacts: [
      'Synthetic graphite blending in EV battery cells has increased from 30% to over 65%.',
      'Synthetic graphite carries a 20-30% price premium over natural graphite but offers sovereign supply security.',
      'New anode processing facilities in Quebec, Tennessee, and Sweden are receiving OEM prepayments.',
      'Automotive battery cell procurement teams report Tier-2 audits now require weekly permit tracking.'
    ],
    supplyChainImpact: {
      procurement: 'Procurement teams are deploying advance capital commitments to qualify non-restricted anode processors.',
      sourcing: 'Transition from single-origin natural graphite to hybrid synthetic/natural blends.',
      cost: 'Battery pack cost reduction curves temporarily flattening due to synthetic anode premiums.',
      supplierRisk: 'Tier-1 battery suppliers requiring OEMs to co-sign material off-take guarantees.'
    },
    impactRatings: {
      costImpact: 'High',
      supplyRisk: 'High',
      leadTimeRisk: 'High',
      procurementImpact: 'Critical',
      logisticsImpact: 'Low',
      supplierImpact: 'Critical'
    },
    priorityScore: 84,
    priorityLevel: 'HIGH',
    scoreBreakdown: {
      supplyChainRelevance: 22,
      procurementImpact: 13,
      businessEconomicImpact: 12,
      urgency: 7,
      geographicImpact: 8,
      industryImpact: 9,
      sourceAuthority: 4,
      crossSourceConfirmation: 4,
      duration: 5,
      total: 84
    },
    whyImportant: [
      'Graphite constitutes up to 95% of the battery anode by mass in lithium-ion batteries',
      'Highlights the rapid practical execution of derisking and friendshoring in tier-2/3 raw materials',
      'Demonstrates structural capital reallocation in automotive supplier contracts',
      'Documented across Japanese, Korean, and Western corporate disclosures'
    ],
    whatToWatch: [
      'Audit battery supplier compliance with US IRA Section 30D foreign entity of concern (FEOC) rules.',
      'Review Tier-2 material qualification timelines for synthetic anode substitutes.',
      'Track power availability and electricity tariffs at synthetic graphite graphitization kilns.'
    ],
    credibilityType: 'Established news organization',
    confidence: 'High',
    confidenceReason: 'Verified through Tier-1 battery supplier announcements (Panasonic Energy, LG Energy Solution) and corporate SEC filings.',
    isDeveloping: true,
    isBreaking: false,
    timeline: [
      { timestamp: '03:15 UTC', headline: 'Japanese battery materials association updates synthetic graphite capacity projections', source: 'Nikkei Asia' },
      { timestamp: '08:45 UTC', headline: 'North American OEM consortium announces anode off-take agreement', source: 'Bloomberg' }
    ],
    alsoReportedBy: [
      { name: 'The Wall Street Journal', url: 'https://www.wsj.com/business/autos/automakers-scramble-for-battery-materials-graphite', publishedAt: new Date(now.getTime() - 29.2 * 3600 * 1000).toISOString(), sourceType: 'Established news organization', domain: 'wsj.com' },
      { name: 'Automotive News', url: 'https://www.autonews.com/manufacturing/ev-battery-graphite-supply-chain-diversification', publishedAt: new Date(now.getTime() - 30.0 * 3600 * 1000).toISOString(), sourceType: 'Specialist industry publication', domain: 'autonews.com' }
    ],
    bangladeshImpact: {
      level: 'Low',
      rationale: 'Negligible direct impact on current Bangladesh production. In the medium term, as Bangladesh encourages localized assembly of electric three-wheelers (easy-bikes) and light commercial EVs, battery pack costs will reflect global anode sourcing shifts.',
      sectorsAffected: ['Electric 3-Wheeler Assembly', 'Solar Home Systems Storage Batteries']
    },
    factVsAnalysis: {
      reportedFacts: [
        'Natural graphite export licenses require 30 to 45 business days for standard ministry clearance.',
        'North American synthetic anode processing capacity is projected to triple by 2026.',
        'Average anode material represents 8-12% of total battery cell cost.'
      ],
      aiAnalysis: [
        'The premium for synthetic graphite will compress as high-volume graphitization kilns come online in low-cost renewable energy grids.',
        'Procurement leaders who lock in multi-year off-take agreements will secure preferential battery cell allocations during EV production ramp-ups.'
      ],
      sourceClaims: [
        'Mining executives claim outside-China graphite supply will struggle to meet 100% of non-Chinese demand before 2027.'
      ]
    }
  },
  {
    id: 'sc-news-008',
    headline: 'US Gulf Coast & East Coast Port Labor Negotiations: Shippers Divert Cargo to West Coast Gateways',
    source: 'Journal of Commerce',
    sourceUrl: 'https://www.joc.com/article/us-east-coast-ports-ila-labor-contract-diversion_2024',
    publishedAt: new Date(now.getTime() - 34.0 * 3600 * 1000).toISOString(),
    discoveredAt: new Date(now.getTime() - 33.2 * 3600 * 1000).toISOString(),
    category: 'Labor',
    subcategory: 'Port Labor & Intermodal Freight',
    regions: ['North America', 'Global'],
    countries: ['United States', 'Canada', 'Mexico'],
    industries: ['Logistics', 'Retail', 'Automotive', 'Agriculture', 'Manufacturing'],
    oneLineSummary: 'Importers shift up to 15% of inbound discretionary container volume from East Coast to West Coast ports (LA/Long Beach) ahead of master contract expiration.',
    executiveSummary: 'Retailers, automotive manufacturers, and industrial suppliers are actively executing cargo diversion strategies to avoid potential port disruptions across 36 maritime gateways from Maine to Texas. Major container lines report noticeable spikes in transpacific bookings bound for Los Angeles, Long Beach, and Seattle-Tacoma.',
    keyFacts: [
      'The International Longshoremen’s Association (ILA) and United States Maritime Alliance (USMX) remain in discussions regarding terminal automation and wages.',
      'Port of Los Angeles and Long Beach inbound container volumes jumped 18% YoY as shippers frontload.',
      'Transpacific ocean spot rates to US West Coast rose 12%, outpacing East Coast rate adjustments.',
      'Intermodal rail dwell times at Chicago and Dallas hubs have extended by 24 hours.'
    ],
    supplyChainImpact: {
      procurement: 'Contract ocean freight allocation must be balanced between West Coast intermodal rail and direct all-water East Coast calls.',
      logistics: 'Intermodal rail equipment (chassis and 53ft domestic containers) in Southern California experiencing tightening availability.',
      leadTime: 'West Coast discharge + rail to Midwest averages 14-18 days vs. 24-28 days all-water via Cape of Good Hope.',
      cost: 'Intermodal rail bridging adds $800-$1,200 per container over all-water transport costs.'
    },
    impactRatings: {
      costImpact: 'High',
      supplyRisk: 'High',
      leadTimeRisk: 'High',
      procurementImpact: 'High',
      logisticsImpact: 'Critical',
      supplierImpact: 'Medium'
    },
    priorityScore: 86,
    priorityLevel: 'HIGH',
    scoreBreakdown: {
      supplyChainRelevance: 23,
      procurementImpact: 13,
      businessEconomicImpact: 13,
      urgency: 8,
      geographicImpact: 8,
      industryImpact: 8,
      sourceAuthority: 4,
      crossSourceConfirmation: 4,
      duration: 4,
      total: 86
    },
    whyImportant: [
      'East and Gulf Coast ports handle over 54% of all US containerized imports and 68% of agricultural exports',
      'Preemptive cargo diversions cause congestion ripples across West Coast rail and truck networks',
      'Directly affects peak holiday retail inventory arrivals and manufacturing component supply',
      'Documented in official port throughput statistics and carrier scheduling advisories'
    ],
    whatToWatch: [
      'Confirm transpacific bookings allocate minimum 30-40% volume through West Coast gateways with pre-arranged rail billing.',
      'Secure domestic truck drayage commitments at Los Angeles/Long Beach to prevent rail ramp demurrage.',
      'Review Force Majeure clauses in BCO (Beneficial Cargo Owner) logistics contracts.'
    ],
    credibilityType: 'Specialist industry publication',
    confidence: 'High',
    confidenceReason: 'Verified by monthly container volume reports from Port of LA/LB and official ILA/USMX negotiating statements.',
    isDeveloping: true,
    isBreaking: false,
    timeline: [
      { timestamp: '14:30 UTC', headline: 'Port of Long Beach executive director reports record August container throughput', source: 'POLB' },
      { timestamp: '18:00 UTC', headline: 'National Retail Federation urges accelerated collective bargaining', source: 'NRF' }
    ],
    alsoReportedBy: [
      { name: 'Reuters', url: 'https://www.reuters.com/business/us-retailers-shift-cargo-west-coast-ports-labor-talks-loom', publishedAt: new Date(now.getTime() - 34.8 * 3600 * 1000).toISOString(), sourceType: 'Established news organization', domain: 'reuters.com' },
      { name: 'CNBC', url: 'https://www.cnbc.com/2024/us-east-coast-ports-labor-strike-risk-retailers-prepare', publishedAt: new Date(now.getTime() - 35.5 * 3600 * 1000).toISOString(), sourceType: 'Established news organization', domain: 'cnbc.com' }
    ],
    bangladeshImpact: {
      level: 'High',
      rationale: 'US buyers of Bangladesh apparel (Walmart, Target, Gap, PVH) frequently route shipments via all-water service to New York/New Jersey, Savannah, and Norfolk. In response to potential port labor disruption, buyers are redirecting orders via Pacific routes, increasing transit complexity and freight costs.',
      sectorsAffected: ['Apparel Exports to US Market', 'Feeder Transshipment Schedules', 'Buyer Shipping Nominations']
    },
    factVsAnalysis: {
      reportedFacts: [
        'The master contract covers roughly 45,000 dockworkers across East Coast and Gulf ports.',
        'Rail dwell times at major West Coast on-dock rail facilities stand at 3.8 days.',
        'Carriers have announced port congestion surcharges of up to $1,000/container should operations halt.'
      ],
      aiAnalysis: [
        'Even in the event of an agreement, cargo frontloading will create a container bottleneck on the US West Coast through October.',
        'Importers with priority freight contracts should verify chassis pool availability at Chicago BNSF/UP yards.'
      ],
      sourceClaims: [
        'Carrier executives claim the industry has sufficient intermodal capacity to absorb the diversion without catastrophic gridlock.'
      ]
    }
  }
];

export const DEFAULT_TOP_10: Top10Thing[] = [
  {
    rank: 1,
    headline: 'Global Container Shipping Diverts Around Cape of Good Hope: Spot Rates Surge 28% MoM',
    whyItMatters: 'Ocean carriers extend routing around Africa, adding 12-14 days sailing time and locking in high freight surcharges across Asia-Europe and US trade routes.',
    newsItemId: 'sc-news-001',
    priorityScore: 94,
    source: 'Reuters'
  },
  {
    rank: 2,
    headline: 'US Tightens Semiconductor Equipment Export Controls; ASML & Tokyo Electron Comply',
    whyItMatters: 'New multilateral lithography export curbs split wafer production lines, elevating chip qualification requirements and price premiums for non-China fabs.',
    newsItemId: 'sc-news-002',
    priorityScore: 91,
    source: 'Financial Times'
  },
  {
    rank: 3,
    headline: 'USTR Finalizes Section 301 Tariffs: 25%–100% Duties Imposed on Batteries, Steel & Solar',
    whyItMatters: 'Strict rules of origin and steep tariff hikes force procurement teams to audit customs HTS classifications and accelerate nearshoring to Mexico and Vietnam.',
    newsItemId: 'sc-news-005',
    priorityScore: 89,
    source: 'The Wall Street Journal'
  },
  {
    rank: 4,
    headline: 'Copper Treatment Charges Fall to Historic Lows: Smelter Curtailments Threaten Wire & Rod Supply',
    whyItMatters: 'Concentrate shortage crushes smelter processing margins, raising risk of physical cathode deficits and price increases across electrical and EV wiring.',
    newsItemId: 'sc-news-003',
    priorityScore: 88,
    source: 'Bloomberg'
  },
  {
    rank: 5,
    headline: 'US Port Labor Talks: Shippers Divert Up to 15% Discretionary Cargo to West Coast Gateways',
    whyItMatters: 'Frontloading containers to Los Angeles and Long Beach tightens intermodal rail capacity and chassis availability ahead of fall retail peak season.',
    newsItemId: 'sc-news-008',
    priorityScore: 86,
    source: 'Journal of Commerce'
  },
  {
    rank: 6,
    headline: 'Chittagong Port Installs 4 New Quay Gantry Cranes; Dwell Time Drops from 84h to 46h',
    whyItMatters: 'Significant operational milestone for Bangladesh maritime logistics, reducing export feeder waiting times and demurrage costs for RMG apparel shipments.',
    newsItemId: 'sc-news-004',
    priorityScore: 85,
    source: 'The Daily Star'
  },
  {
    rank: 7,
    headline: 'Automotive OEMs Accelerate Dual-Sourcing for Synthetic Battery Anodes',
    whyItMatters: 'Battery makers transition from natural to synthetic graphite blends to guarantee sovereign supply and comply with clean vehicle tax credit rules.',
    newsItemId: 'sc-news-007',
    priorityScore: 84,
    source: 'Nikkei Asia'
  },
  {
    rank: 8,
    headline: 'European Chemical Feedstock Prices Ease as Natural Gas Storage Crosses 93% Capacity',
    whyItMatters: 'Underground gas buffers eliminate winter rationing threats for European petrochemical clusters, stabilizing polymer resin and adhesive prices.',
    newsItemId: 'sc-news-006',
    priorityScore: 78,
    source: 'Euronews'
  },
  {
    rank: 9,
    headline: 'Red Sea War-Risk Maritime Insurance Surcharges Extended by Underwriters',
    whyItMatters: 'Commercial vessels maintaining Red Sea passage face higher transit premiums, entrenching Cape diversions as the default shipping route.',
    newsItemId: 'sc-news-001',
    priorityScore: 76,
    source: 'Lloyd\'s List'
  },
  {
    rank: 10,
    headline: 'Panama Canal Draft Recovers to 48.5 Feet Following Seasonal Rain Resurgence',
    whyItMatters: 'Increased daily vessel transit slots ease booking auction premiums for LNG and container vessels connecting US Gulf Coast with East Asia.',
    newsItemId: 'sc-news-008',
    priorityScore: 73,
    source: 'Panama Canal Authority'
  }
];

export const INITIAL_DATASET: IntelligenceDataset = {
  newsWindow: {
    start: windowStart.toISOString(),
    end: now.toISOString(),
    windowKey: '72h'
  },
  lastUpdated: new Date(now.getTime() - 8 * 60 * 1000).toISOString(),
  totalAnalyzed: 284,
  items: DEFAULT_NEWS_ITEMS,
  riskRadar: DEFAULT_RISK_RADAR,
  trends: DEFAULT_TRENDS,
  whatChanged: DEFAULT_WHAT_CHANGED,
  watchNext: DEFAULT_WATCH_NEXT,
  top10Things: DEFAULT_TOP_10,
  isDemoFallback: false
};
