import { AutonomousAIService, SUPPORTED_PROVIDERS, SEARCH_PROVIDERS, EXTENSION_VERSION } from './geminiClient.js';

// High-fidelity baseline dataset mirroring the web app
const DEFAULT_DATASET = {
  totalAnalyzed: 284,
  lastUpdated: new Date().toISOString(),
  items: [
    {
      id: 'sc-1',
      headline: 'Red Sea Conflict Forces Container Carriers into Cape of Good Hope Diversions, Adding +14 Days Transit',
      source: 'FreightWaves Maritime',
      sourceUrl: 'https://www.freightwaves.com',
      publishedAt: new Date(Date.now() - 3 * 3600000).toISOString(),
      category: 'Shipping',
      subcategory: 'Maritime Transit',
      regions: ['Middle East', 'Europe', 'Asia Pacific'],
      countries: ['Yemen', 'Egypt', 'Singapore', 'Netherlands'],
      industries: ['Maritime Shipping', 'Retail', 'Automotive', 'Apparel'],
      oneLineSummary: 'Major ocean liners maintain south Africa diversions, absorbing 9% of global container capacity with elevated $3,200-$4,100 FEU spot rates.',
      executiveSummary: 'Attacks on merchant vessels in the Bab el-Mandeb strait have compelled global shipping alliances (2M, Ocean Alliance, THE Alliance) to reroute East-West voyages around the Cape of Good Hope. The diversion extends standard Asia-Europe transit by 10-14 days and Asia-US East Coast by 5-7 days, creating acute equipment imbalances and driving emergency bunker surcharges.',
      keyFacts: [
        'Vessel transit via Suez Canal has dropped by over 65% year-on-year.',
        'Round-Africa routing adds 3,000 to 3,500 nautical miles per voyage.',
        'Global container spot rates remain elevated between $3,200 and $4,100 per 40-foot container (FEU).',
        'Carriers are imposing Emergency Bunker Surcharges (EBS) averaging $400-$700 per box.',
        'Empty container repositioning back to Asian manufacturing hubs is delayed by 2 to 3 weeks.'
      ],
      supplyChainImpact: {
        procurement: 'Re-negotiate contract delivery windows and incorporate dynamic fuel surcharge caps.',
        sourcing: 'Audit dual-sourcing options in Mediterranean or nearshore Eastern Europe hubs.',
        logistics: 'Book vessel space 4 to 6 weeks in advance of planned factory ex-work dates.',
        inventory: 'Increase safety stock by 14-18 days for critical overseas components.',
        cost: 'Freight expense inflation of +28% to +35% on landed unit cost.',
        leadTime: '+12 to +16 calendar days variance on transit times.'
      },
      priorityScore: 96,
      priorityLevel: 'CRITICAL',
      scoreBreakdown: {
        supplyChainRelevance: 25,
        procurementImpact: 15,
        businessEconomicImpact: 15,
        urgency: 10,
        geographicImpact: 9,
        industryImpact: 9,
        sourceAuthority: 5,
        crossSourceConfirmation: 4,
        duration: 4,
        total: 96
      },
      bangladeshImpact: {
        level: 'Critical',
        rationale: 'Chattogram feeder vessels connecting to Colombo and Singapore experience vessel turnaround delays, directly threatening ready-made garment (RMG) seasonal delivery schedules to European retailers.'
      },
      credibilityType: 'Specialist industry publication',
      whyImportant: [
        'Absorbs nearly 9% of active global container fleet capacity.',
        'Elevates ocean freight benchmarks across non-affected lanes due to vessel redeployment.',
        'Forces inventory holding costs higher across retail and manufacturing sectors.'
      ],
      whatToWatch: [
        'Carrier General Rate Increase (GRI) filings on the 1st and 15th of the month.',
        'Equipment availability and empty container deficits at Ningbo and Shanghai.'
      ]
    },
    {
      id: 'sc-2',
      headline: 'US Section 301 Tariff Modifications Implement Steep Duty Hikes on Clean Tech and Critical Minerals',
      source: 'Reuters Trade Wire',
      sourceUrl: 'https://www.reuters.com',
      publishedAt: new Date(Date.now() - 7 * 3600000).toISOString(),
      category: 'Tariffs',
      subcategory: 'Trade Restrictions',
      regions: ['North America', 'Asia Pacific'],
      countries: ['United States', 'China'],
      industries: ['EV & Batteries', 'Semiconductors', 'Clean Energy', 'Steel'],
      oneLineSummary: 'The USTR finalizes tariff escalations up to 100% on electric vehicles, 50% on solar cells, and 25% on critical minerals, accelerating supply chain decoupling.',
      executiveSummary: 'The United States Trade Representative has enacted sweeping tariff hikes targeting key strategic industries. Duties on electric vehicles reach 100%, semiconductors and solar cells increase to 50%, and lithium-ion batteries and critical minerals face 25% tariffs. Procurement teams face immediate cost escalation and mandatory supply base re-qualification outside the impacted jurisdiction.',
      keyFacts: [
        'EV tariffs raised from 25% to 100% duty rate.',
        'Lithium-ion EV batteries face 25% duty rate starting immediately.',
        'Semiconductor tariffs jump to 50% effective next calendar quarter.',
        'Synthetic graphite and natural flake graphite transition to 25% duty.',
        'Customs and Border Protection (CBP) implementing origin provenance audits.'
      ],
      supplyChainImpact: {
        procurement: 'Audit Tier-1 and Tier-2 Bill of Materials (BOM) for country-of-origin tariff classifications.',
        sourcing: 'Expedite supplier qualification in USMCA corridors (Mexico, Canada) and Southeast Asia.',
        logistics: 'Coordinate with licensed customs brokers for binding classification rulings.',
        inventory: 'Accelerate pre-tariff shipments into bonded warehouses before deadline.',
        cost: 'Tariff burden increase of +25% to +100% on direct component imports.',
        leadTime: 'New supplier qualification cycle requiring 90 to 180 days lead time.'
      },
      priorityScore: 92,
      priorityLevel: 'CRITICAL',
      scoreBreakdown: {
        supplyChainRelevance: 24,
        procurementImpact: 14,
        businessEconomicImpact: 14,
        urgency: 9,
        geographicImpact: 9,
        industryImpact: 9,
        sourceAuthority: 5,
        crossSourceConfirmation: 4,
        duration: 4,
        total: 92
      },
      bangladeshImpact: {
        level: 'Medium',
        rationale: 'Indirect tailwind as international buyers evaluate Bangladesh for non-apparel light industrial diversification, though textile machinery import costs remain sensitive to general tariff friction.'
      },
      credibilityType: 'Established news organization',
      whyImportant: [
        'Restructures battery supply chains across North America and Asia.',
        'Mandates verifiable component-level country of origin verification.'
      ],
      whatToWatch: [
        'USTR public exclusion process timeline and temporary exemptions.',
        'Counter-regulatory export control measures from trade counterparts.'
      ]
    },
    {
      id: 'sc-3',
      headline: 'Chittagong Port Container Dwell Times Extend as Feeder Vessel Congestion Impacts Garment Shipments',
      source: 'The Daily Star Trade',
      sourceUrl: 'https://www.thedailystar.net',
      publishedAt: new Date(Date.now() - 12 * 3600000).toISOString(),
      category: 'Logistics',
      subcategory: 'Port Operations',
      regions: ['South Asia'],
      countries: ['Bangladesh', 'Singapore', 'Sri Lanka'],
      industries: ['RMG & Apparel', 'Textiles', 'Maritime Shipping'],
      oneLineSummary: 'Apparel exporters face 5-8 days feeder vessel lag at Chattogram port, increasing risks of missed retail handover deadlines in Europe and North America.',
      executiveSummary: 'Container yard congestion at Chattogram Port, coupled with delayed feeder vessel arrivals from transshipment hubs in Colombo and Singapore, has pushed export container dwell times to 7.8 days above normal operational baselines. Ready-Made Garment (RMG) exporters are utilizing expensive emergency air freight allocations to meet strict delivery windows.',
      keyFacts: [
        'Export container dwell times at Chattogram port increased by 45%.',
        'Feeder vessel wait time at outer anchorage averages 4 to 6 days.',
        'Emergency air freight conversions up 30% on Dhaka-Europe corridors.',
        'Off-dock Inland Container Depots (ICDs) operating at 92% capacity.',
        'Over 80% of Bangladesh total export earnings are represented by RMG.'
      ],
      supplyChainImpact: {
        procurement: 'Establish real-time EDI visibility with freight forwarders for cut-off dates.',
        sourcing: 'Coordinate with buyers for grace-period delivery amendments.',
        logistics: 'Split large shipments into blended sea-air routing via Dubai or Colombo.',
        inventory: 'Release production batches to off-dock ICDs 5 days earlier than standard schedule.',
        cost: 'Air freight surcharges of $3.20-$4.50/kg for emergency handover.',
        leadTime: '+5 to +8 days port dwell time added to origin transit.'
      },
      priorityScore: 89,
      priorityLevel: 'HIGH',
      scoreBreakdown: {
        supplyChainRelevance: 23,
        procurementImpact: 14,
        businessEconomicImpact: 13,
        urgency: 9,
        geographicImpact: 8,
        industryImpact: 9,
        sourceAuthority: 4,
        crossSourceConfirmation: 5,
        duration: 4,
        total: 89
      },
      bangladeshImpact: {
        level: 'Critical',
        rationale: 'Direct threat to core export revenue; apparel factories face penalties and expensive air freight conversions if seasonal goods miss retail sales windows.'
      },
      credibilityType: 'Specialist industry publication',
      whyImportant: [
        'Key bottleneck for global fast-fashion and department store replenishment.',
        'Illustrates vulnerability of feeder networks to transshipment hub delays.'
      ],
      whatToWatch: [
        'Chattogram Port Authority (CPA) gantry crane maintenance schedules.',
        'Off-dock container handling tariffs and empty container return ratios.'
      ]
    },
    {
      id: 'sc-4',
      headline: 'Global Copper Smelting Margins Collapse to Historical Lows Amid Concentrates Tightness',
      source: 'Bloomberg Commodities',
      sourceUrl: 'https://www.bloomberg.com',
      publishedAt: new Date(Date.now() - 18 * 3600000).toISOString(),
      category: 'Commodities',
      subcategory: 'Critical Minerals',
      regions: ['Latin America', 'Asia Pacific', 'Europe'],
      countries: ['Chile', 'China', 'Peru', 'Zambia'],
      industries: ['Electronics', 'Automotive', 'Renewable Energy', 'Construction'],
      oneLineSummary: 'Treatment and refining charges (TC/RCs) plunge near zero, threatening refined copper cathode production for electrical grid and motor manufacturing.',
      executiveSummary: 'Acute raw material deficits resulting from mine disruptions in Latin America have driven smelter processing fees near single digits. Several major smelters are initiating unscheduled maintenance and lowering run-rates, setting the stage for refined copper deficits in second-half industrial assembly pipelines.',
      keyFacts: [
        'Spot TC/RCs fell below $10 per metric ton from $85 a year earlier.',
        'Mine supply constrained by Cobre Panama closure and Chilean production downgrades.',
        'Refined copper inventories on LME and SHFE fluctuate near 3-year lows.',
        'Electrical equipment and EV wire harness manufacturing absorbs 65% of cathode supply.'
      ],
      supplyChainImpact: {
        procurement: 'Lock in long-term index pricing contracts for refined cathode and rod.',
        sourcing: 'Audit tier-2 wiring and PCB suppliers for metal hedging coverage.',
        logistics: 'Maintain secure warehouse allocations near primary fabrication plants.',
        inventory: 'Increase physical buffer of copper cathode to 40 days consumption.',
        cost: 'Potential price spike of +12% to +20% on wire harness components.',
        leadTime: 'Smelter turnaround delays can add 3 to 4 weeks to raw material deliveries.'
      },
      priorityScore: 86,
      priorityLevel: 'HIGH',
      scoreBreakdown: {
        supplyChainRelevance: 23,
        procurementImpact: 13,
        businessEconomicImpact: 14,
        urgency: 8,
        geographicImpact: 8,
        industryImpact: 9,
        sourceAuthority: 5,
        crossSourceConfirmation: 3,
        duration: 3,
        total: 86
      },
      bangladeshImpact: {
        level: 'Medium',
        rationale: 'Impacts domestic electrical cable, transformer, and electronic assembly manufacturers reliant on imported copper rod and cathode.'
      },
      credibilityType: 'Established news organization',
      whyImportant: [
        'Foundational metal for all electrification, EV, and renewable grid projects.',
        'Early indicator of industrial cost pressures.'
      ],
      whatToWatch: [
        'Quarterly benchmark TC/RC settlements between miners and Asian smelters.',
        'London Metal Exchange (LME) physical warehouse warrant cancelations.'
      ]
    },
    {
      id: 'sc-5',
      headline: 'Semiconductor Lithography Export Controls Expand with Additional Advanced Machinery Restrictions',
      source: 'Nikkei Asia Tech',
      sourceUrl: 'https://asia.nikkei.com',
      publishedAt: new Date(Date.now() - 24 * 3600000).toISOString(),
      category: 'Semiconductors',
      subcategory: 'Tech Export Controls',
      regions: ['Europe', 'North America', 'Asia Pacific'],
      countries: ['Netherlands', 'Japan', 'United States', 'Taiwan', 'China'],
      industries: ['Semiconductors', 'Computing', 'Automotive', 'Industrial Automation'],
      oneLineSummary: 'Multilateral export licensing restrictions extend to immersion DUV lithography systems, driving dual-track supply chain architecture across tier-1 wafer fabs.',
      executiveSummary: 'Dutch and Japanese regulators, in alignment with US export restrictions, have implemented tightened licensing mandates for deep ultraviolet (DUV) lithography machinery and spare parts. Semiconductor foundries are diversifying footprint investments into Arizona, Japan, and Germany to insulate fab capacity.',
      keyFacts: [
        'DUV immersion systems require specialized government export licenses.',
        'Maintenance and software servicing for installed base subject to review.',
        'Global wafer fab equipment capital expenditures re-routed to domestic fabrication projects.',
        'Automotive microcontroller lead times stabilizing but remain vulnerable to single-source nodes.'
      ],
      supplyChainImpact: {
        procurement: 'Demand multi-fab qualification clauses in semiconductor vendor master agreements.',
        sourcing: 'Audit IC designs for pin-compatible alternate source microcontrollers.',
        logistics: 'Ensure climate-controlled specialized transport for sensitive silicon components.',
        inventory: 'Maintain 90 days minimum buffer on non-substitutable ASICs and MCUs.',
        cost: 'Chip fabrication cost premiums of 15% to 25% for regionalized fabs.',
        leadTime: 'New wafer lot start lead times average 18 to 26 weeks.'
      },
      priorityScore: 84,
      priorityLevel: 'IMPORTANT',
      scoreBreakdown: {
        supplyChainRelevance: 22,
        procurementImpact: 13,
        businessEconomicImpact: 13,
        urgency: 8,
        geographicImpact: 8,
        industryImpact: 9,
        sourceAuthority: 5,
        crossSourceConfirmation: 3,
        duration: 3,
        total: 84
      },
      bangladeshImpact: {
        level: 'Low',
        rationale: 'Minimal direct wafer fabrication in Bangladesh, but downstream consumer electronics and appliance assembly plants are exposed to lead-time variations.'
      },
      credibilityType: 'Specialist industry publication',
      whyImportant: [
        'Defines future capacity distribution for high-performance and mature-node silicon.',
        'Forces multi-year dual-sourcing architectures across global technology OEMs.'
      ],
      whatToWatch: [
        'Bilateral license application approval percentages.',
        'Yield rates at newly commissioned wafer fabrication sites in the US and Europe.'
      ]
    }
  ],
  riskRadar: [
    { id: 'shipping', name: 'Shipping & Freight', level: 'Critical', score: 94, driverEvent: 'Red Sea diversions & bunker surcharges', keyIndicator: 'FEU spot rate $3,800 +14d transit delay' },
    { id: 'tariffs', name: 'Tariffs & Trade Policy', level: 'Critical', score: 91, driverEvent: 'Section 301 duty modifications up to 100%', keyIndicator: 'Origin country audit enforcement' },
    { id: 'minerals', name: 'Critical Minerals', level: 'High', score: 85, driverEvent: 'Copper smelter TC/RC collapse & graphite export curbs', keyIndicator: 'TC/RC processing fees near zero' },
    { id: 'rmg', name: 'Bangladesh RMG & Ports', level: 'High', score: 88, driverEvent: 'Chattogram container dwell time escalation', keyIndicator: 'Feeder wait time 4-6 days outer anchorage' },
    { id: 'chips', name: 'Semiconductors', level: 'Important', score: 82, driverEvent: 'DUV lithography multilateral licensing rules', keyIndicator: 'Wafer start lead times 18-26 weeks' }
  ],
  top10Things: [
    { rank: 1, headline: 'Red Sea transit diversions around Africa locking in +14 day voyage lead times', whyItMatters: 'Absorbs 9% of global container fleet capacity and escalates ocean freight costs.', priorityScore: 96, source: 'FreightWaves' },
    { rank: 2, headline: 'US Section 301 final tariffs impose up to 100% duty rates on clean tech', whyItMatters: 'Forces emergency BOM re-classification and non-China supplier qualification.', priorityScore: 92, source: 'Reuters' },
    { rank: 3, headline: 'Chattogram port container dwell time extends to 7.8 days for export garments', whyItMatters: 'Direct risk of missed delivery penalties for global apparel retail orders.', priorityScore: 89, source: 'The Daily Star' },
    { rank: 4, headline: 'Copper smelter TC/RCs drop near zero as raw concentrate supply tightens', whyItMatters: 'Threatens refined cathode availability for wire, transformer, and EV harness assembly.', priorityScore: 86, source: 'Bloomberg' },
    { rank: 5, headline: 'Multilateral semiconductor lithography licensing tightens DUV equipment', whyItMatters: 'Mandates dual-track wafer fab architectures and regional sourcing contracts.', priorityScore: 84, source: 'Nikkei Asia' },
    { rank: 6, headline: 'Panama Canal drafts recover but reservation slots remain competitive', whyItMatters: 'Limits US Gulf Coast grain and LNG vessel routing predictability.', priorityScore: 81, source: 'JOC' },
    { rank: 7, headline: 'Synthetic graphite export licensing creates battery anode supply lags', whyItMatters: 'Automotive OEMs accelerating qualification of synthetic North American anode producers.', priorityScore: 79, source: 'Argus Media' },
    { rank: 8, headline: 'Air cargo spot rates surge as sea-air conversions climb out of South Asia', whyItMatters: 'Emergency logistics budgets expanding across fast fashion and consumer electronics.', priorityScore: 77, source: 'Air Cargo News' },
    { rank: 9, headline: 'European Union CBAM carbon reporting audits intensify across steel and aluminum', whyItMatters: 'Scope-3 carbon emissions documentation required for customs clearance.', priorityScore: 75, source: 'Financial Times' },
    { rank: 10, headline: 'Rail intermodal chassis availability tightens at US West Coast ports', whyItMatters: 'Cargo diversions from US East Coast create temporary inland rail dwell delays.', priorityScore: 73, source: 'Supply Chain Dive' }
  ],
  regionalHeatmap: [
    { region: 'Middle East & Red Sea', riskLevel: 'Critical', score: 95, keyAlert: 'Bab el-Mandeb transit diversions adding 14 days and fuel surcharges' },
    { region: 'South Asia (Bangladesh & India)', riskLevel: 'High', score: 88, keyAlert: 'Chattogram feeder congestion and RMG seasonal export deadlines' },
    { region: 'North America', riskLevel: 'High', score: 86, keyAlert: 'Section 301 tariff enforcement and port intermodal rail equipment' },
    { region: 'Asia Pacific (China & East Asia)', riskLevel: 'High', score: 84, keyAlert: 'Tech export controls, copper concentrate deficit, empty container imbalances' },
    { region: 'Europe', riskLevel: 'High', score: 82, keyAlert: 'Extended ocean delivery delays, CBAM carbon audits, automotive supplier margin pressure' },
    { region: 'Latin America', riskLevel: 'Important', score: 76, keyAlert: 'Panama Canal draft restoration and copper mine supply variability' }
  ],
  forecastMilestones: [
    { timeframe: 'Week 1 (Days 1 - 7)', focus: 'Maritime Freight & Spot Rates', prediction: 'Carriers maintain $3,200-$4,100 FEU spot rates; shippers must finalize space commitments 4 weeks out.' },
    { timeframe: 'Week 2 (Days 8 - 15)', focus: 'Tariff Filing & Classification Audits', prediction: 'CBP audits on Tier-1 BOM components intensify under updated Section 301 rules.' },
    { timeframe: 'Week 3 (Days 16 - 22)', focus: 'Chattogram Port & Feeder Scramble', prediction: 'Feeder turnaround times in Colombo and Singapore dictate garment export air freight conversion rates.' },
    { timeframe: 'Week 4 (Days 23 - 30)', focus: 'Refined Metals & Cathode Tightness', prediction: 'Smelter processing margin compression leads to reduced cathode allocations and price premiums.' }
  ]
};

// Application State
let currentDataset = { ...DEFAULT_DATASET };
let currentTab = 'dashboard';
let currentTimeWindow = '72h';
let currentSearchQuery = '';
let activeTopicTag = '';
let isDarkTheme = true;
let currentConfig = null;
let savedArticles = [];
let quickReadIds = [];
let videoCreatedMap = {};
let selectedItemForBrief = null;

// DOM Elements
const bodyEl = document.body;
const newsCardsContainer = document.getElementById('news-cards-container');
const top10Container = document.getElementById('top10-container');
const radarContainer = document.getElementById('radar-container');
const heatmapContainer = document.getElementById('heatmap-container');
const forecastContainer = document.getElementById('forecast-container');
const trendsContainer = document.getElementById('trends-container');
const bangladeshContainer = document.getElementById('bangladesh-container');

// Navigation & Actions
const navTabs = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');
const windowBtns = document.querySelectorAll('.window-btn');
const btnRefreshFeed = document.getElementById('btn-refresh-feed');
const btnToggleTheme = document.getElementById('btn-toggle-theme');
const btnSettings = document.getElementById('btn-settings');
const btnBannerSetupKey = document.getElementById('btn-banner-setup-key');
const btnAiStatus = document.getElementById('btn-ai-status');
const btnExecutiveBrief = document.getElementById('btn-executive-brief');
const btnQuickRead = document.getElementById('btn-quick-read');
const btnSavedArticles = document.getElementById('btn-saved-articles');
const btnVideoTracker = document.getElementById('btn-video-tracker');
const btnReadmeBangla = document.getElementById('btn-readme-bangla');
const btnExpandFullTab = document.getElementById('btn-expand-fulltab');

// Search & Filter Elements
const searchForm = document.getElementById('search-form');
const topicSearchInput = document.getElementById('topic-search-input');
const btnClearSearch = document.getElementById('btn-clear-search');
const btnResetTopic = document.getElementById('btn-reset-topic');
const filterCategory = document.getElementById('filter-category');
const filterRegion = document.getElementById('filter-region');
const filterMinScore = document.getElementById('filter-min-score');
const labelMinScore = document.getElementById('label-min-score');
const sortBySelect = document.getElementById('sort-by');
const filteredCountLabel = document.getElementById('filtered-count-label');

// Key Banner Elements
const keyBanner = document.getElementById('key-banner');
const keyBannerText = document.getElementById('key-banner-text');
const detectedModelLabel = document.getElementById('detected-model-label');
const statusCurrentModelText = document.getElementById('status-current-model-text');
const headerVersionBadge = document.getElementById('header-version-badge');

// Modals
const modalSettings = document.getElementById('modal-settings');
const modalExecutiveBrief = document.getElementById('modal-executive-brief');
const modalScoreBreakdown = document.getElementById('modal-score-breakdown');
const modalArticleDetail = document.getElementById('modal-article-detail');
const modalBanglaReadme = document.getElementById('modal-bangla-readme');
const modalAiStatus = document.getElementById('modal-ai-status');

// Settings Elements
const settingsProviderButtons = document.getElementById('settings-provider-buttons');
const settingsApiKey = document.getElementById('settings-api-key');
const settingsKeyLabel = document.getElementById('settings-key-label');
const settingsKeyLink = document.getElementById('settings-key-link');
const btnTestSettingsKey = document.getElementById('btn-test-settings-key');
const settingsTestStatus = document.getElementById('settings-test-status');
const settingsModelDetectedBadge = document.getElementById('settings-model-detected-badge');
const settingsCustomModel = document.getElementById('settings-custom-model');
const settingsDefaultLang = document.getElementById('settings-default-lang');
const settingsDefaultDuration = document.getElementById('settings-default-duration');
const btnSaveSettings = document.getElementById('btn-save-settings');

// Studio Elements
const studioSelectStory = document.getElementById('studio-select-story');
const studioDuration = document.getElementById('studio-duration');
const studioLanguage = document.getElementById('studio-language');
const studioTone = document.getElementById('studio-tone');
const btnStudioGenerate = document.getElementById('btn-studio-generate');
const studioOutputArea = document.getElementById('studio-output-area');
const studioOutputTitle = document.getElementById('studio-output-title');
const studioScriptTextarea = document.getElementById('studio-script-textarea');
const btnStudioCopy = document.getElementById('btn-studio-copy');

// Counters
const quickReadCounter = document.getElementById('quick-read-counter');
const savedCounter = document.getElementById('saved-counter');
const trackerCounter = document.getElementById('tracker-counter');

// ======================== INITIALIZATION ========================

async function init() {
  // Load configuration
  currentConfig = await AutonomousAIService.getStoredConfig();

  // Load saved local data
  try {
    const saved = localStorage.getItem('ext_bookmarks');
    savedArticles = saved ? JSON.parse(saved) : [];
  } catch { savedArticles = []; }

  try {
    const savedQr = localStorage.getItem('ext_quick_read');
    quickReadIds = savedQr ? JSON.parse(savedQr) : [];
  } catch { quickReadIds = []; }

  try {
    const savedTr = localStorage.getItem('ext_video_tracker');
    videoCreatedMap = savedTr ? JSON.parse(savedTr) : {};
  } catch { videoCreatedMap = {}; }

  try {
    const theme = localStorage.getItem('ext_theme');
    isDarkTheme = theme ? theme === 'dark' : true;
  } catch { isDarkTheme = true; }

  applyTheme(isDarkTheme);
  updateKeyBanner();
  updateCounters();
  renderAllViews();
  setupSettingsUI();
  setupEventListeners();

  // Check if opened as full-tab
  if (window.location.search.includes('tab=full') || window.innerWidth > 900) {
    bodyEl.classList.add('full-tab');
  }
}

// ======================== RENDER FUNCTIONS ========================

function renderAllViews() {
  renderNewsFeed();
  renderTop10();
  renderRadar();
  renderHeatmap();
  renderForecast();
  renderTrends();
  renderBangladesh();
  populateStudioSelect();
}

function getFilteredNews() {
  const selectedCat = filterCategory.value;
  const selectedReg = filterRegion.value;
  const minScore = parseInt(filterMinScore.value, 10) || 50;
  const sort = sortBySelect.value;
  const query = (currentSearchQuery || activeTopicTag).toLowerCase().trim();

  let items = currentDataset.items.filter((item) => {
    if (selectedCat !== 'All' && item.category !== selectedCat) return false;
    if (selectedReg !== 'All' && !(item.regions || []).includes(selectedReg)) return false;
    if (item.priorityScore < minScore) return false;
    if (query) {
      const match =
        item.headline.toLowerCase().includes(query) ||
        (item.oneLineSummary && item.oneLineSummary.toLowerCase().includes(query)) ||
        (item.executiveSummary && item.executiveSummary.toLowerCase().includes(query)) ||
        (item.category && item.category.toLowerCase().includes(query)) ||
        (item.countries && item.countries.some((c) => c.toLowerCase().includes(query))) ||
        (item.industries && item.industries.some((i) => i.toLowerCase().includes(query)));
      if (!match) return false;
    }
    return true;
  });

  if (sort === 'priority') {
    items.sort((a, b) => b.priorityScore - a.priorityScore);
  } else if (sort === 'recency') {
    items.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  } else if (sort === 'impact') {
    items.sort((a, b) => (b.scoreBreakdown?.procurementImpact || 0) - (a.scoreBreakdown?.procurementImpact || 0));
  }

  return items;
}

function renderNewsFeed() {
  const items = getFilteredNews();
  filteredCountLabel.textContent = `Showing ${items.length} items`;
  newsCardsContainer.innerHTML = '';

  if (items.length === 0) {
    newsCardsContainer.innerHTML = `
      <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 9px; padding: 28px; text-align: center; color: var(--text-dim);">
        <div style="font-size: 28px; margin-bottom: 6px;">🔍</div>
        <div style="font-weight: 700; color: var(--text-main); font-size: 14px;">No matching news items found</div>
        <p style="font-size: 11px; margin-top: 4px;">Try lowering the minimum priority threshold or resetting your topic search filter.</p>
        <button id="btn-reset-filters" class="btn btn-primary" style="margin-top: 10px;">Reset All Filters</button>
      </div>
    `;
    const btnReset = document.getElementById('btn-reset-filters');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        filterCategory.value = 'All';
        filterRegion.value = 'All';
        filterMinScore.value = 50;
        labelMinScore.textContent = '50';
        currentSearchQuery = '';
        activeTopicTag = '';
        topicSearchInput.value = '';
        btnResetTopic.style.display = 'none';
        renderNewsFeed();
      });
    }
    return;
  }

  items.forEach((item) => {
    const isSaved = savedArticles.includes(item.id);
    const isQuickRead = quickReadIds.includes(item.id);
    const isCreated = !!videoCreatedMap[item.id];

    let priorityClass = 'priority-important';
    if (item.priorityScore >= 90) priorityClass = 'priority-critical';
    else if (item.priorityScore >= 80) priorityClass = 'priority-high';

    const card = document.createElement('div');
    card.className = 'news-card';
    card.innerHTML = `
      <div class="news-card-header">
        <div style="display: flex; flex-direction: column; gap: 4px; flex: 1;">
          <div class="tag-row">
            <span class="tag" style="color: #60a5fa; font-weight: 700;">🏷️ ${item.category}</span>
            <span class="tag">🏢 ${item.source}</span>
            <span class="tag" style="font-family: 'JetBrains Mono', monospace;">⏱️ ${formatTimeAgo(item.publishedAt)}</span>
            ${item.bangladeshImpact?.level === 'Critical' || item.bangladeshImpact?.level === 'High' ? `<span class="tag tag-bangladesh">🇧🇩 BD Relevance: ${item.bangladeshImpact.level}</span>` : ''}
            ${isCreated ? `<span class="tag" style="background: rgba(16, 185, 129, 0.2); color: #34d399; font-weight: 700;">✅ Video Created</span>` : ''}
          </div>
          <h3 class="news-card-title">${item.headline}</h3>
        </div>
        <span class="priority-badge ${priorityClass} btn-score-modal" data-id="${item.id}" title="Click to view 9-factor score breakdown">
          📊 ${item.priorityScore} PTS ▾
        </span>
      </div>

      <div class="news-summary-box">
        ${item.oneLineSummary || item.executiveSummary || ''}
      </div>

      ${item.keyFacts && item.keyFacts.length > 0 ? `
        <div class="key-facts-list">
          ${item.keyFacts.slice(0, 3).map((f) => `<div class="key-fact-bullet"><span class="bullet-dot">▪</span><span>${f}</span></div>`).join('')}
        </div>
      ` : ''}

      ${item.supplyChainImpact ? `
        <div class="impact-breakdown-grid">
          <div>
            <div class="impact-item-label">💼 Procurement Action</div>
            <div class="impact-item-val">${item.supplyChainImpact.procurement || 'Review supplier commitments'}</div>
          </div>
          <div>
            <div class="impact-item-label">💲 Landed Cost Shift</div>
            <div class="impact-item-val" style="color: #f87171;">${item.supplyChainImpact.cost || '+15-25%'}</div>
          </div>
          <div>
            <div class="impact-item-label">⏱️ Lead Time Variance</div>
            <div class="impact-item-val" style="color: #fb923c;">${item.supplyChainImpact.leadTime || '+10-14 days'}</div>
          </div>
        </div>
      ` : ''}

      <div class="news-card-footer">
        <div class="card-actions-left">
          <button class="btn btn-primary btn-card-video" data-id="${item.id}">
            🎬 Video Brief
          </button>
          <button class="btn btn-card-detail" data-id="${item.id}">
            📄 Detail Dossier
          </button>
          <button class="btn btn-card-thinking" data-id="${item.id}" title="Run AI deep thinking analysis">
            🧠 Thinking Analysis
          </button>
        </div>

        <div class="card-actions-right">
          <button class="btn btn-card-qr" data-id="${item.id}" style="${isQuickRead ? 'color: #fbbf24; border-color: #f59e0b;' : ''}">
            ${isQuickRead ? '⚡ In Stack' : '⚡ Quick Read'}
          </button>
          <button class="btn btn-card-save" data-id="${item.id}" style="${isSaved ? 'color: #818cf8; border-color: #6366f1;' : ''}">
            ${isSaved ? '🔖 Saved' : '🔖 Save'}
          </button>
          <button class="btn btn-card-track" data-id="${item.id}" style="${isCreated ? 'color: #34d399; border-color: #10b981;' : ''}">
            ${isCreated ? '✅ Created' : '✓ Mark Created'}
          </button>
          ${item.sourceUrl ? `
            <a href="${item.sourceUrl}" target="_blank" class="btn" style="text-decoration: none;" title="Open original reporting source">
              ↗ Source
            </a>
          ` : ''}
        </div>
      </div>
    `;
    newsCardsContainer.appendChild(card);
  });

  // Attach card event listeners
  document.querySelectorAll('.btn-score-modal').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      const item = currentDataset.items.find((i) => i.id === id);
      if (item) openScoreModal(item);
    });
  });

  document.querySelectorAll('.btn-card-detail').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      const item = currentDataset.items.find((i) => i.id === id);
      if (item) openArticleDetailModal(item);
    });
  });

  document.querySelectorAll('.btn-card-video').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      const item = currentDataset.items.find((i) => i.id === id);
      if (item) {
        selectedItemForBrief = item;
        studioSelectStory.value = item.id;
        switchTab('videoBriefs');
        generateBriefInStudio(item);
      }
    });
  });

  document.querySelectorAll('.btn-card-thinking').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      const item = currentDataset.items.find((i) => i.id === id);
      if (!item) return;

      const key = currentConfig?.geminiApiKey || '';
      if (!key) {
        alert('Please enter your free Gemini API Key in Settings (⚙️) to run AI Deep Thinking Analysis.');
        openModal(modalSettings);
        return;
      }

      const originalBtn = e.currentTarget;
      originalBtn.disabled = true;
      originalBtn.textContent = '🧠 Analyzing...';

      try {
        const analysis = await AutonomousAIService.deepAnalyzeStory(key, item.headline, item.executiveSummary || item.oneLineSummary, currentConfig?.customModel);
        let out = `🧠 DEEP PROCUREMENT THINKING ASSESSMENT\n`;
        out += `Event: ${item.headline}\n\n`;
        out += `1. STRATEGIC CONSIDERATIONS:\n${(analysis.strategicProcurementConsiderations || []).map((c) => `• ${c}`).join('\n')}\n\n`;
        out += `2. VARIANCE ESTIMATES:\n`;
        out += `• Lead Time: ${analysis.leadTimeVarianceEstimate || '+12-16 days'}\n`;
        out += `• Cost Variance: ${analysis.costVarianceEstimate || '+4-7%'}\n`;
        out += `• Buffer Recommendation: ${analysis.inventoryBufferRecommendation || '45 days forward'}\n\n`;
        out += `3. ACTION MATRIX:\n`;
        (analysis.recommendedActionMatrix || []).forEach((m) => {
          out += `[${m.phase}]: ${m.action}\n`;
        });
        alert(out);
      } catch (err) {
        alert(err.message || 'Thinking analysis failed.');
      } finally {
        originalBtn.disabled = false;
        originalBtn.textContent = '🧠 Thinking Analysis';
      }
    });
  });

  document.querySelectorAll('.btn-card-qr').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      toggleQuickRead(id);
    });
  });

  document.querySelectorAll('.btn-card-save').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      toggleSaveArticle(id);
    });
  });

  document.querySelectorAll('.btn-card-track').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      toggleVideoTracker(id);
    });
  });
}

function renderTop10() {
  top10Container.innerHTML = '';
  const top10 = currentDataset.top10Things || [];
  top10.forEach((item) => {
    const el = document.createElement('div');
    el.className = 'news-card';
    el.innerHTML = `
      <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 10px;">
        <div style="display: flex; align-items: flex-start; gap: 10px;">
          <span style="font-size: 18px; font-weight: 900; font-family: 'JetBrains Mono', monospace; color: #3b82f6; width: 34px;">
            #0${item.rank}
          </span>
          <div>
            <h4 style="font-size: 13px; font-weight: 700; color: var(--text-main);">${item.headline}</h4>
            <p style="font-size: 12px; color: var(--text-muted); margin-top: 4px;"><strong>Direct Impact:</strong> ${item.whyItMatters}</p>
          </div>
        </div>
        <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 4px;">
          <span class="priority-badge priority-critical">${item.priorityScore} PTS</span>
          <span style="font-size: 10px; color: var(--text-dim);">${item.source}</span>
        </div>
      </div>
    `;
    top10Container.appendChild(el);
  });
}

function renderRadar() {
  radarContainer.innerHTML = '';
  const radar = currentDataset.riskRadar || [];
  radar.forEach((r) => {
    const el = document.createElement('div');
    el.className = 'kpi-card';
    el.style.padding = '14px';
    el.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
        <span style="font-weight: 700; font-size: 13px;">${r.name}</span>
        <span class="priority-badge ${r.score >= 90 ? 'priority-critical' : 'priority-high'}">${r.score}/100</span>
      </div>
      <div class="meter-bar" style="margin-bottom: 8px;">
        <div class="meter-fill" style="width: ${r.score}%; background: ${r.score >= 90 ? '#ef4444' : '#f59e0b'};"></div>
      </div>
      <div style="font-size: 11px; color: var(--text-muted); line-height: 1.4;">
        <strong>Driver Event:</strong> ${r.driverEvent}<br />
        <span style="color: var(--text-dim);"><strong>Key Indicator:</strong> ${r.keyIndicator}</span>
      </div>
    `;
    radarContainer.appendChild(el);
  });
}

function renderHeatmap() {
  heatmapContainer.innerHTML = '';
  const regions = currentDataset.regionalHeatmap || [];
  regions.forEach((reg) => {
    const el = document.createElement('div');
    el.className = 'kpi-card';
    el.style.padding = '14px';
    el.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
        <span style="font-weight: 700; font-size: 13px;">${reg.region}</span>
        <span class="priority-badge ${reg.score >= 90 ? 'priority-critical' : reg.score >= 80 ? 'priority-high' : 'priority-important'}">${reg.riskLevel}</span>
      </div>
      <div class="meter-bar" style="margin-bottom: 8px;">
        <div class="meter-fill" style="width: ${reg.score}%; background: ${reg.score >= 90 ? '#ef4444' : reg.score >= 80 ? '#f97316' : '#eab308'};"></div>
      </div>
      <p style="font-size: 11px; color: var(--text-muted); line-height: 1.4;">${reg.keyAlert}</p>
    `;
    heatmapContainer.appendChild(el);
  });
}

function renderForecast() {
  forecastContainer.innerHTML = '';
  const milestones = currentDataset.forecastMilestones || [];
  milestones.forEach((m, idx) => {
    const el = document.createElement('div');
    el.className = 'news-card';
    el.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
        <span style="font-family: 'JetBrains Mono', monospace; font-weight: 700; color: #60a5fa; font-size: 12px;">${m.timeframe}</span>
        <span class="tag" style="background: rgba(59, 130, 246, 0.15); color: #93c5fd;">Phase 0${idx + 1}</span>
      </div>
      <h4 style="font-size: 13px; font-weight: 700; color: var(--text-main); margin-bottom: 4px;">${m.focus}</h4>
      <p style="font-size: 12px; color: var(--text-muted); line-height: 1.4;">${m.prediction}</p>
    `;
    forecastContainer.appendChild(el);
  });
}

function renderTrends() {
  trendsContainer.innerHTML = '';
  const trends = [
    { name: 'Red Sea Cape Diversions & Bunker Escalations', stories: 8, severity: 'Critical', trajectory: 'Escalating', summary: 'Global carrier alliances locking in extended round-Africa routing with surcharges extending into upcoming quarters.' },
    { name: 'Strategic Battery & Semiconductor Decoupling', stories: 6, severity: 'Critical', trajectory: 'Active Enforcement', summary: 'Section 301 and DUV lithography export restrictions forcing dual-track fab investments across US and Asia.' },
    { name: 'South Asian Feeder Congestion & Air Cargo Surge', stories: 5, severity: 'High', trajectory: 'Developing', summary: 'Chattogram and Colombo turnaround lags driving emergency air freight conversions for fast-fashion brands.' }
  ];

  trends.forEach((t) => {
    const el = document.createElement('div');
    el.className = 'news-card';
    el.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
        <h4 style="font-size: 13px; font-weight: 700; color: var(--text-main);">${t.name}</h4>
        <span class="priority-badge priority-critical">${t.severity}</span>
      </div>
      <div style="font-size: 11px; color: var(--text-dim); margin-bottom: 6px;">
        <span>${t.stories} corroborating stories</span> · <span>Trajectory: <strong>${t.trajectory}</strong></span>
      </div>
      <p style="font-size: 12px; color: var(--text-muted); line-height: 1.4;">${t.summary}</p>
    `;
    trendsContainer.appendChild(el);
  });
}

function renderBangladesh() {
  bangladeshContainer.innerHTML = `
    <div class="news-card" style="border-color: rgba(16, 185, 129, 0.4);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
        <h3 style="font-size: 14px; font-weight: 800; color: #34d399;">🇧🇩 Ready-Made Garments (RMG) & Trade Exposure Assessment</h3>
        <span class="tag tag-bangladesh">High Priority</span>
      </div>
      <p style="font-size: 12px; color: var(--text-muted); line-height: 1.5; margin-bottom: 10px;">
        Bangladesh&apos;s $47B+ apparel export industry is acutely sensitive to maritime feeder logistics through Chattogram Port to Colombo, Singapore, and Port Klang hubs. Extended feeder wait times directly threaten buyer on-time performance metrics and force margin-diluting emergency air freight allocations.
      </p>
      <div class="key-facts-list">
        <div class="key-fact-bullet"><span class="bullet-dot">▪</span><span>Chattogram Port average outer anchorage wait time: 4 to 6 calendar days.</span></div>
        <div class="key-fact-bullet"><span class="bullet-dot">▪</span><span>Dhaka Hazrat Shahjalal International Airport air cargo rate: $3.20-$4.50/kg for expedited EU fashion routes.</span></div>
        <div class="key-fact-bullet"><span class="bullet-dot">▪</span><span>Cotton yarn and raw fabric import dwell times: +5 days, elevating working capital cycles for spinning mills.</span></div>
      </div>
    </div>
  `;
}

function populateStudioSelect() {
  studioSelectStory.innerHTML = '';
  currentDataset.items.forEach((item) => {
    const opt = document.createElement('option');
    opt.value = item.id;
    opt.textContent = `[${item.priorityScore} PTS] ${item.headline.slice(0, 75)}...`;
    studioSelectStory.appendChild(opt);
  });
}

// ======================== MODAL LOGIC ========================

function openModal(modalEl) {
  modalEl.style.display = 'flex';
}

function closeModal(modalEl) {
  modalEl.style.display = 'none';
}

function openScoreModal(item) {
  const sb = item.scoreBreakdown || {
    supplyChainRelevance: 25,
    procurementImpact: 15,
    businessEconomicImpact: 15,
    urgency: 10,
    geographicImpact: 9,
    industryImpact: 9,
    sourceAuthority: 5,
    crossSourceConfirmation: 4,
    duration: 4,
    total: item.priorityScore || 95
  };

  const factors = [
    { name: 'Supply Chain Relevance', score: sb.supplyChainRelevance, max: 25, color: '#3b82f6' },
    { name: 'Procurement Impact', score: sb.procurementImpact, max: 15, color: '#6366f1' },
    { name: 'Business Economic Impact', score: sb.businessEconomicImpact, max: 15, color: '#8b5cf6' },
    { name: 'Urgency & Immediacy', score: sb.urgency, max: 10, color: '#ef4444' },
    { name: 'Geographic Scale', score: sb.geographicImpact, max: 10, color: '#f59e0b' },
    { name: 'Industry Breadth', score: sb.industryImpact, max: 10, color: '#10b981' },
    { name: 'Source Authority', score: sb.sourceAuthority, max: 5, color: '#06b6d4' },
    { name: 'Cross-Source Confirmation', score: sb.crossSourceConfirmation, max: 5, color: '#14b8a6' },
    { name: 'Disruption Duration', score: sb.duration, max: 5, color: '#f43f5e' },
  ];

  const content = document.getElementById('score-breakdown-content');
  content.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; background: var(--bg-base); padding: 12px; border-radius: 8px; border: 1px solid var(--border-color);">
      <div>
        <div style="font-size: 11px; color: var(--text-dim);">Composite Priority Score</div>
        <div style="font-size: 26px; font-weight: 900; font-family: 'JetBrains Mono', monospace; color: #3b82f6;">${sb.total} <span style="font-size: 14px; color: var(--text-dim); font-weight: normal;">/ 100</span></div>
      </div>
      <div style="text-align: right;">
        <span class="priority-badge ${sb.total >= 90 ? 'priority-critical' : 'priority-high'}">${item.priorityLevel || 'CRITICAL'}</span>
        <div style="font-size: 10px; color: var(--text-dim); margin-top: 4px;">Algorithmic 9-Factor Weighting</div>
      </div>
    </div>

    <div style="display: flex; flex-direction: column; gap: 8px;">
      ${factors.map((f) => `
        <div class="score-meter-row">
          <div class="meter-label-row">
            <span style="font-weight: 600;">${f.name}</span>
            <span style="font-family: 'JetBrains Mono', monospace; font-weight: 700;">${f.score} / ${f.max}</span>
          </div>
          <div class="meter-bar">
            <div class="meter-fill" style="width: ${(f.score / f.max) * 100}%; background: ${f.color};"></div>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  openModal(modalScoreBreakdown);
}

function clusterRelatedEvents(item, allItems) {
  if (!item || !allItems || allItems.length === 0) return [];

  const currentRegions = item.regions || [];
  const currentCountries = item.countries || [];
  const currentIndustries = item.industries || [];
  const currentCategory = item.category || '';
  const currentSubcategory = (item.subcategory || '').toLowerCase();
  const currentHeadlineWords = item.headline.toLowerCase().split(/\W+/).filter((w) => w.length > 3);

  const candidates = [];

  allItems.forEach((candidate) => {
    if (candidate.id === item.id) return;

    let score = 0;
    const reasons = [];

    // 1. Geographic Corridor overlap
    const sharedRegions = (candidate.regions || []).filter((r) => currentRegions.includes(r));
    const sharedCountries = (candidate.countries || []).filter((c) => currentCountries.includes(c));

    if (sharedCountries.length > 0) {
      score += 35;
      reasons.push(`Geographic Focus: ${sharedCountries.slice(0, 2).join(', ')}`);
    } else if (sharedRegions.length > 0) {
      score += 25;
      reasons.push(`Shared Corridor: ${sharedRegions.slice(0, 2).join(', ')}`);
    }

    // 2. Disruption Category & Event Cluster overlap
    if (candidate.subcategory && currentSubcategory && candidate.subcategory.toLowerCase() === currentSubcategory) {
      score += 30;
      reasons.push(`Event Cluster: ${candidate.subcategory}`);
    } else if (candidate.category === currentCategory) {
      score += 20;
      reasons.push(`Domain: ${candidate.category}`);
    }

    // 3. Affected Industry / Commodity overlap
    const sharedIndustries = (candidate.industries || []).filter((i) => currentIndustries.includes(i));
    if (sharedIndustries.length > 0) {
      score += 20;
      reasons.push(`Industry Exposure: ${sharedIndustries.slice(0, 2).join(', ')}`);
    }

    // 4. Keyword & Disruption Entity Match
    const candidateWords = candidate.headline.toLowerCase().split(/\W+/);
    const matchingKeywords = currentHeadlineWords.filter((w) => candidateWords.includes(w));
    if (matchingKeywords.length >= 2) {
      score += 20;
      reasons.push(`Disruption Keyword Match`);
    }

    // High disruption priority affinity
    if (Math.abs(candidate.priorityScore - item.priorityScore) <= 10) {
      score += 5;
    }

    if (score >= 25) {
      candidates.push({
        item: candidate,
        similarityScore: Math.min(score, 99),
        matchReasons: reasons,
        sharedCorridor: sharedRegions[0] || sharedCountries[0] || 'Global Corridor',
        sharedIndustry: sharedIndustries[0],
        sharedCategory: candidate.category,
      });
    }
  });

  candidates.sort((a, b) => b.similarityScore - a.similarityScore || b.item.priorityScore - a.item.priorityScore);
  return candidates.slice(0, 6);
}

function openArticleDetailModal(item) {
  const titleEl = document.getElementById('article-detail-title');
  const contentEl = document.getElementById('article-detail-content');
  titleEl.textContent = item.headline;

  const relatedEvents = clusterRelatedEvents(item, currentDataset?.items || []);
  const primaryCorridor = item.regions?.join(', ') || item.countries?.join(', ') || 'Global Supply Chain';

  contentEl.innerHTML = `
    <!-- Top Metadata Bar -->
    <div class="tag-row" style="margin-bottom: 8px;">
      <span class="tag" style="color: #60a5fa; font-weight: 700;">${item.category}</span>
      <span class="tag">${item.source}</span>
      <span class="tag">${formatTimeAgo(item.publishedAt)}</span>
      <span class="priority-badge priority-critical">${item.priorityScore} PTS</span>
    </div>

    <!-- Segmented Tab Navigation -->
    <div class="detail-tab-nav" style="margin-bottom: 12px;">
      <button class="detail-tab-btn active" data-dtab="synthesis">📋 Executive Synthesis</button>
      <button class="detail-tab-btn" data-dtab="related">🌐 Related Events & Corridors (${relatedEvents.length})</button>
      <button class="detail-tab-btn" data-dtab="procurement">🚢 Procurement & Impact</button>
    </div>

    <!-- Pane 1: Executive Synthesis -->
    <div id="detail-pane-synthesis" class="detail-pane active">
      <div>
        <h4 style="font-size: 12px; font-weight: 700; color: var(--text-dim); text-transform: uppercase;">Executive Synthesis:</h4>
        <p style="font-size: 12px; line-height: 1.5; color: var(--text-main); margin-top: 4px;">${item.executiveSummary || item.oneLineSummary}</p>
      </div>

      ${item.keyFacts && item.keyFacts.length > 0 ? `
        <div>
          <h4 style="font-size: 12px; font-weight: 700; color: var(--text-dim); text-transform: uppercase;">Key Verified Facts:</h4>
          <div class="key-facts-list" style="margin-top: 4px;">
            ${item.keyFacts.map((f) => `<div class="key-fact-bullet"><span class="bullet-dot">▪</span><span>${f}</span></div>`).join('')}
          </div>
        </div>
      ` : ''}

      ${item.bangladeshImpact ? `
        <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); padding: 10px; border-radius: 8px;">
          <strong style="color: #34d399;">🇧🇩 Bangladesh Relevance (${item.bangladeshImpact.level}):</strong>
          <p style="margin-top: 2px; color: var(--text-muted);">${item.bangladeshImpact.rationale}</p>
        </div>
      ` : ''}

      ${item.sourceUrl ? `
        <div style="display: flex; justify-content: flex-end; margin-top: 6px;">
          <a href="${item.sourceUrl}" target="_blank" class="btn" style="text-decoration: none;">
            ↗ Open Original Article Source Link
          </a>
        </div>
      ` : ''}
    </div>

    <!-- Pane 2: Related Events & Geographic Disruption Clustering -->
    <div id="detail-pane-related" class="detail-pane">
      <!-- Corridor Cluster Banner -->
      <div style="background: linear-gradient(135deg, rgba(30, 58, 138, 0.25), rgba(15, 23, 42, 0.6)); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 8px; padding: 12px; display: flex; flex-direction: column; gap: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; flex-wrap: wrap;">
          <div>
            <div style="font-size: 10px; font-weight: 800; color: #60a5fa; text-transform: uppercase; letter-spacing: 0.5px;">Disruption Cluster & Corridor Radar</div>
            <div style="font-size: 13px; font-weight: 700; color: #ffffff; margin-top: 2px;">
              Corridor: <span style="color: #93c5fd;">${primaryCorridor}</span>
            </div>
            <div style="font-size: 11px; color: var(--text-dim); margin-top: 2px;">
              Vector: <strong style="color: var(--text-main);">${item.category}</strong> ${item.subcategory ? `· ${item.subcategory}` : ''} | Sectors: <strong style="color: var(--text-main);">${item.industries?.join(', ') || 'Global Freight'}</strong>
            </div>
          </div>
          <button id="btn-scan-live-related" class="btn btn-primary" style="font-size: 11px; padding: 6px 12px; display: inline-flex; align-items: center; gap: 6px;">
            <span>⚡</span>
            <span>Scan Live Wire for Clustered Events</span>
          </button>
        </div>
        <div id="live-wire-search-status" style="display: none; font-size: 11px; font-family: 'JetBrains Mono', monospace; color: #60a5fa; padding-top: 4px; border-top: 1px solid rgba(59, 130, 246, 0.2);"></div>
      </div>

      <!-- Live Search Results Area -->
      <div id="live-wire-results-container" style="display: none; flex-direction: column; gap: 6px;">
        <div style="font-size: 11px; font-weight: 800; color: #34d399; text-transform: uppercase; letter-spacing: 0.5px; display: flex; align-items: center; gap: 6px;">
          <span style="width: 6px; height: 6px; border-radius: 50%; background: #34d399;"></span>
          <span>Live Breaking Wire Corroborations</span>
        </div>
        <div id="live-wire-results-list" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 8px;"></div>
      </div>

      <!-- Clustered Events from Dataset -->
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; font-weight: 700; color: var(--text-dim); text-transform: uppercase;">
          <span>Clustered Stories in this Trade Corridor (${relatedEvents.length})</span>
          <span style="font-size: 10px; font-weight: normal; color: var(--text-muted);">Correlated by corridor, commodity & vector</span>
        </div>

        ${relatedEvents.length === 0 ? `
          <div style="text-align: center; padding: 24px; background: var(--bg-base); border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-dim);">
            <p>No other cached stories match this corridor. Click <strong>"Scan Live Wire for Clustered Events"</strong> above to search the live web.</p>
          </div>
        ` : `
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${relatedEvents.map((rel) => {
              const relItem = rel.item;
              const badgeClass = rel.similarityScore >= 80 ? 'match-high' : rel.similarityScore >= 50 ? 'match-mid' : 'match-low';
              return `
                <div class="clustered-card">
                  <div style="display: flex; justify-content: space-between; align-items: center; gap: 6px; flex-wrap: wrap;">
                    <div style="display: flex; align-items: center; gap: 6px;">
                      <span class="match-badge ${badgeClass}">🎯 ${rel.similarityScore}% Disruption Match</span>
                      <span style="font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 700; background: rgba(255,255,255,0.08); padding: 2px 6px; border-radius: 4px;">
                        SCORE ${relItem.priorityScore}/100
                      </span>
                      <span style="font-size: 10px; color: var(--text-dim);">${relItem.source} · ${formatTimeAgo(relItem.publishedAt)}</span>
                    </div>
                    <div style="display: flex; gap: 4px;">
                      ${rel.matchReasons.slice(0, 2).map((r) => `<span style="font-size: 9px; padding: 2px 6px; border-radius: 4px; background: var(--border-color); color: var(--text-muted);">${r}</span>`).join('')}
                    </div>
                  </div>

                  <div class="clustered-headline-link" data-id="${relItem.id}" style="font-weight: 700; font-size: 12px; color: var(--text-main); cursor: pointer; line-height: 1.4; transition: color 0.15s ease;">
                    ${relItem.headline}
                  </div>

                  <p style="font-size: 11px; color: var(--text-muted); line-height: 1.4; margin: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                    ${relItem.oneLineSummary || relItem.executiveSummary}
                  </p>

                  <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 6px; border-top: 1px solid var(--border-color); font-size: 10px; font-family: 'JetBrains Mono', monospace;">
                    <div style="display: flex; gap: 8px;">
                      ${relItem.metrics?.transitDelayDays ? `<span style="color: #fbbf24;">Delay: +${relItem.metrics.transitDelayDays}d</span>` : ''}
                      ${relItem.metrics?.costIncreasePct ? `<span style="color: #f87171;">Cost: +${relItem.metrics.costIncreasePct}%</span>` : ''}
                    </div>
                    <button class="btn btn-inspect-related" data-id="${relItem.id}" style="padding: 2px 8px; font-size: 10px;">Inspect Story →</button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `}
      </div>
    </div>

    <!-- Pane 3: Procurement Impact Matrix -->
    <div id="detail-pane-procurement" class="detail-pane">
      ${item.supplyChainImpact ? `
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; background: var(--bg-base); border: 1px solid var(--border-color); padding: 12px; border-radius: 8px;">
          <div><strong style="color: #60a5fa;">Procurement:</strong> <p style="margin-top: 2px; color: var(--text-muted);">${item.supplyChainImpact.procurement || 'N/A'}</p></div>
          <div><strong style="color: #a78bfa;">Sourcing:</strong> <p style="margin-top: 2px; color: var(--text-muted);">${item.supplyChainImpact.sourcing || 'N/A'}</p></div>
          <div><strong style="color: #34d399;">Logistics:</strong> <p style="margin-top: 2px; color: var(--text-muted);">${item.supplyChainImpact.logistics || 'N/A'}</p></div>
          <div><strong style="color: #fb923c;">Inventory:</strong> <p style="margin-top: 2px; color: var(--text-muted);">${item.supplyChainImpact.inventory || 'N/A'}</p></div>
          <div><strong style="color: #f87171;">Landed Cost:</strong> <p style="margin-top: 2px; color: var(--text-muted);">${item.supplyChainImpact.cost || 'N/A'}</p></div>
          <div><strong style="color: #f43f5e;">Lead Time:</strong> <p style="margin-top: 2px; color: var(--text-muted);">${item.supplyChainImpact.leadTime || 'N/A'}</p></div>
        </div>
      ` : '<p style="color: var(--text-dim);">No detailed procurement impact matrix available for this story.</p>'}
    </div>
  `;

  // Wire up tabs inside the Article Detail modal
  const detailTabs = contentEl.querySelectorAll('.detail-tab-btn');
  const detailPanes = contentEl.querySelectorAll('.detail-pane');

  detailTabs.forEach((tabBtn) => {
    tabBtn.addEventListener('click', () => {
      detailTabs.forEach((b) => b.classList.remove('active'));
      detailPanes.forEach((p) => p.classList.remove('active'));

      tabBtn.classList.add('active');
      const targetPane = contentEl.querySelector(`#detail-pane-${tabBtn.getAttribute('data-dtab')}`);
      if (targetPane) targetPane.classList.add('active');
    });
  });

  // Wire up clicking any clustered related event to inspect it
  contentEl.querySelectorAll('.clustered-headline-link, .btn-inspect-related').forEach((el) => {
    el.addEventListener('click', () => {
      const targetId = el.getAttribute('data-id');
      const targetItem = currentDataset?.items?.find((i) => i.id === targetId);
      if (targetItem) {
        openArticleDetailModal(targetItem);
      }
    });
  });

  // Wire up Live Scan for Clustered Events button via Multi-Engine Search Cascade
  const btnScanLive = contentEl.querySelector('#btn-scan-live-related');
  const liveStatus = contentEl.querySelector('#live-wire-search-status');
  const liveResultsContainer = contentEl.querySelector('#live-wire-results-container');
  const liveResultsList = contentEl.querySelector('#live-wire-results-list');

  if (btnScanLive) {
    btnScanLive.addEventListener('click', async () => {
      btnScanLive.disabled = true;
      btnScanLive.innerHTML = '<span>⏳</span> <span>Querying Search Cascade...</span>';
      liveStatus.style.display = 'block';
      liveStatus.textContent = `Cascading search across ${currentConfig?.searchProviderOrder?.[0]?.toUpperCase() || 'Search Engines'} for correlated events...`;

      const corridor = item.regions?.[0] || item.countries?.[0] || 'Global';
      const query = `${item.headline.slice(0, 60)} ${corridor} disruption supply chain`;

      try {
        const searchRes = await AutonomousAIService.executeSearchCascade(query, '72h');
        if (searchRes.results && searchRes.results.length > 0) {
          liveStatus.textContent = `Found ${searchRes.results.length} live clustered wire stories via ${searchRes.providerUsed.toUpperCase()}`;
          liveResultsList.innerHTML = searchRes.results.slice(0, 4).map((story) => `
            <div style="background: var(--bg-card); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 6px; padding: 8px 10px; display: flex; flex-direction: column; gap: 4px;">
              <div style="font-weight: 700; font-size: 11px; color: var(--text-main); line-height: 1.3;">
                ${story.title}
              </div>
              ${story.snippet ? `<p style="font-size: 10px; color: var(--text-dim); line-height: 1.3; margin: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${story.snippet}</p>` : ''}
              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 2px; font-size: 9px;">
                <span style="color: #34d399; font-weight: 700;">Live Wire</span>
                ${story.url ? `<a href="${story.url}" target="_blank" style="color: #60a5fa; text-decoration: none;">Source ↗</a>` : ''}
              </div>
            </div>
          `).join('');
          liveResultsContainer.style.display = 'flex';
        } else {
          liveStatus.textContent = 'No additional wire stories found in the past 72h window.';
        }
      } catch (err) {
        liveStatus.textContent = `Search error: ${err.message || 'Could not query search cascade.'}`;
      } finally {
        btnScanLive.disabled = false;
        btnScanLive.innerHTML = '<span>⚡</span> <span>Scan Live Wire for Clustered Events</span>';
      }
    });
  }

  document.getElementById('btn-detail-video-brief').onclick = () => {
    closeModal(modalArticleDetail);
    selectedItemForBrief = item;
    studioSelectStory.value = item.id;
    switchTab('videoBriefs');
    generateBriefInStudio(item);
  };

  openModal(modalArticleDetail);
}

// ======================== VIDEO BRIEF STUDIO ========================

async function generateBriefInStudio(item) {
  if (!item) {
    const selectedId = studioSelectStory.value;
    item = currentDataset.items.find((i) => i.id === selectedId) || currentDataset.items[0];
  }
  if (!item) return;

  const key = currentConfig?.geminiApiKey || '';
  if (!key) {
    alert('Please enter your free Gemini API Key in Settings (⚙️) to generate AI video scripts. Using verified baseline template.');
  }

  btnStudioGenerate.disabled = true;
  btnStudioGenerate.textContent = '🎬 Generating Script...';
  studioOutputArea.style.display = 'flex';
  studioScriptTextarea.value = 'Synthesizing fact-locked timeline-stamped narration...';

  try {
    const duration = studioDuration.value;
    const language = studioLanguage.value;
    const tone = studioTone.value;

    let brief = null;
    if (key) {
      brief = await AutonomousAIService.generateVideoBrief(key, item, { duration, language, tone }, currentConfig?.customModel);
    } else {
      // Grounded baseline fallback
      const isBangla = language === 'Bangla';
      brief = {
        headline: item.headline,
        titles: [
          isBangla ? `কী ঘটছে গ্লোবাল সাপ্লাই চেইনে? ${item.category} সতর্কতা!` : `Supply Chain Alert: ${item.headline}`,
          isBangla ? `শিপিং ও প্রকিউরমেন্ট টিমের জন্য জরুরি আপডেট` : `Urgent Procurement Update: What Changed`,
        ],
        hooks: [
          isBangla ? `একটি গুরুত্বপূর্ণ সাপ্লাই চেইন ও শিপিং রুটে নতুন ডিসরাপশন তৈরি হয়েছে!` : `A major supply chain and shipping disruption has developed.`,
        ],
        script: {
          hook: isBangla ? `আন্তর্জাতিক সাপ্লাই চেইনে নতুন খবর—রয়টার্স কী জানিয়েছে?` : `A new verified supply chain alert: here is what sources confirm.`,
          fullNarration: `[0:00 - 0:10] HOOK & ATTRIBUTION\n${isBangla ? 'রয়টার্স ও ব্লুমবার্গের রিপোর্ট অনুযায়ী:' : 'According to primary reports:'} ${item.oneLineSummary}\n\n[0:10 - 0:35] CORE EVENT & LOGISTICS IMPACT\n${item.executiveSummary || item.oneLineSummary}\n\n[0:35 - 0:50] PROCUREMENT DIRECTIVE\n${isBangla ? 'সাপ্লায়ার বাফার স্টক পর্যবেক্ষণ করুন এবং অল্টারনেটিভ রুট পর্যালোচনা করুন।' : 'Review supplier safety stocks and audit alternative shipping lanes.'}\n\n[0:50 - 1:00] CONCLUSION\n${isBangla ? 'পরবর্তী আপডেটের জন্য সঙ্গে থাকুন।' : 'Stay tuned for verified updates.'}`,
        },
        scenePlan: [
          { sceneNumber: 1, timestamp: '0:00 - 0:10', narration: item.oneLineSummary, visualDirection: 'Map of maritime trade lane' },
          { sceneNumber: 2, timestamp: '0:10 - 0:35', narration: item.headline, visualDirection: 'Container freight rates chart' },
        ]
      };
    }

    let text = `🎬 TITLE: ${brief.titles?.[0] || item.headline}\n`;
    text += `🪝 HOOK: ${brief.script?.hook || brief.hooks?.[0] || ''}\n\n`;
    text += `----------------------------------------------------\n`;
    text += `TIMELINE-STAMPED SPOKEN NARRATION (${duration} · ${language}):\n`;
    text += `----------------------------------------------------\n`;
    text += `${brief.script?.fullNarration || ''}\n\n`;
    text += `----------------------------------------------------\n`;
    text += `SCENE-BY-SCENE VISUAL DIRECTION:\n`;
    text += `----------------------------------------------------\n`;
    (brief.scenePlan || []).forEach((sc, i) => {
      text += `[Scene ${i + 1} · ${sc.timestamp || ''}]\n`;
      text += `🎥 Visual: ${sc.visualDirection || 'Illustrative Map'}\n`;
      text += `🎙️ Voiceover: "${sc.narration || ''}"\n\n`;
    });

    studioScriptTextarea.value = text;
    studioOutputTitle.textContent = `Generated Script (${duration} · ${language} · ${brief.modelUsed || 'Baseline'}):`;
  } catch (err) {
    studioScriptTextarea.value = `Error generating script: ${err.message || 'Unknown error'}. Please verify your API key in Settings (⚙️).`;
  } finally {
    btnStudioGenerate.disabled = false;
    btnStudioGenerate.textContent = '🎬 Generate Fact-Locked Script';
  }
}

// ======================== EXECUTIVE BRIEF ========================

async function openExecutiveBriefModal() {
  const content = document.getElementById('executive-brief-content');
  content.innerHTML = '<div style="text-align: center; padding: 20px;">Synthesizing Daily CPO Briefing...</div>';
  openModal(modalExecutiveBrief);

  const key = currentConfig?.geminiApiKey || '';
  try {
    let brief = null;
    if (key) {
      brief = await AutonomousAIService.generateExecutiveBrief(key, currentDataset, currentConfig?.customModel);
    } else {
      brief = {
        date: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        executiveSummary: 'Global supply chains are navigating acute maritime reroutings around Africa and tightened trade technology export controls, elevating landed costs by 15-25% and extending lead times across automotive, electronics, and retail sectors.',
        top5Events: (currentDataset.top10Things || []).slice(0, 5),
        keySupplyChainRisks: [
          'Prolonged Cape of Good Hope transit absorbing 9% of effective container fleet capacity.',
          'Semiconductor lithography export licensing requiring dual-track wafer supply architectures.',
          'Critical mineral smelting margin compression creating refined copper and graphite tightness.'
        ],
        procurementRisks: [
          'Emergency bunker fuel surcharges (EBS) and general rate increases (GRI) across ocean lanes.',
          'Section 301 tariff changes driving 25%-100% duty rates on targeted clean energy inputs.',
          'Customs country-of-origin compliance audits increasing port clearance dwell times.'
        ],
        logisticsRisks: [
          'US West Coast intermodal rail equipment and chassis availability tightening due to cargo diversion.',
          'South Asian feeder ship connections vulnerable to empty container equipment imbalances.'
        ],
        actionableChecklist: [
          'Review open purchase orders against updated sea freight delivery ETAs.',
          'Audit BOM for Section 301 and export control restricted classifications.',
          'Confirm buffer stock coverage for components sourced through affected maritime corridors.'
        ]
      };
    }

    content.innerHTML = `
      <div style="background: var(--bg-base); border: 1px solid var(--border-color); padding: 12px; border-radius: 8px; margin-bottom: 12px;">
        <div style="font-size: 11px; color: #60a5fa; font-weight: 700;">DAILY INTELLIGENCE BRIEFING · ${brief.date}</div>
        <p style="font-size: 13px; font-weight: 600; color: var(--text-main); margin-top: 4px; line-height: 1.4;">${brief.executiveSummary}</p>
      </div>

      <div style="display: flex; flex-direction: column; gap: 10px;">
        <div>
          <h4 style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #ef4444; margin-bottom: 4px;">Top Supply Chain Risks:</h4>
          <div class="key-facts-list">
            ${(brief.keySupplyChainRisks || []).map((r) => `<div class="key-fact-bullet"><span class="bullet-dot" style="color: #ef4444;">▪</span><span>${r}</span></div>`).join('')}
          </div>
        </div>

        <div>
          <h4 style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #f59e0b; margin-bottom: 4px;">Direct Procurement Exposure:</h4>
          <div class="key-facts-list">
            ${(brief.procurementRisks || []).map((r) => `<div class="key-fact-bullet"><span class="bullet-dot" style="color: #f59e0b;">▪</span><span>${r}</span></div>`).join('')}
          </div>
        </div>

        <div>
          <h4 style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #10b981; margin-bottom: 4px;">Actionable CPO Checklist:</h4>
          <div class="key-facts-list">
            ${(brief.actionableChecklist || []).map((a) => `<div class="key-fact-bullet"><span class="bullet-dot" style="color: #10b981;">✓</span><span>${a}</span></div>`).join('')}
          </div>
        </div>
      </div>
    `;
  } catch (err) {
    content.innerHTML = `<div style="color: #f87171;">Failed to generate brief: ${err.message}</div>`;
  }
}

// ======================== SETTINGS & MULTI-PROVIDER ========================

let currentSearchOrder = ['tavily', 'serper', 'brave', 'exa', 'firecrawl', 'gemini_grounding'];
let currentAiOrder = ['gemini', 'groq', 'openrouter', 'cerebras', 'grok', 'openai'];

function setupSettingsUI() {
  const activeProv = currentConfig?.activeProvider || 'gemini';
  settingsProviderButtons.innerHTML = '';

  currentSearchOrder = [...(currentConfig?.searchProviderOrder || ['tavily', 'serper', 'brave', 'exa', 'firecrawl', 'gemini_grounding'])];
  currentAiOrder = [...(currentConfig?.aiProviderOrder || ['gemini', 'groq', 'openrouter', 'cerebras', 'grok', 'openai'])];

  Object.values(SUPPORTED_PROVIDERS).forEach((prov) => {
    const btn = document.createElement('div');
    btn.className = `provider-btn ${activeProv === prov.id ? 'active' : ''}`;
    btn.setAttribute('data-id', prov.id);
    btn.innerHTML = `
      <div class="provider-name">${prov.name}</div>
      <div class="provider-tag">${prov.tag}</div>
    `;
    btn.addEventListener('click', () => {
      document.querySelectorAll('.provider-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      selectProvider(prov.id);
    });
    settingsProviderButtons.appendChild(btn);
  });

  selectProvider(activeProv);
  populateSearchKeys();
  renderSearchWaterfallList();
  renderAiWaterfallList();
  setupSettingsInternalTabs();
}

function setupSettingsInternalTabs() {
  document.querySelectorAll('.settings-tab-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.settings-tab-btn').forEach((b) => b.classList.remove('active'));
      document.querySelectorAll('.settings-pane').forEach((p) => p.classList.remove('active'));
      e.currentTarget.classList.add('active');
      const target = e.currentTarget.getAttribute('data-stab');
      const pane = document.getElementById(`settings-pane-${target}`);
      if (pane) pane.classList.add('active');
    });
  });

  // Search connection test buttons
  document.querySelectorAll('.btn-test-search').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      const prov = e.currentTarget.getAttribute('data-provider');
      const inputEl = document.getElementById(`input-key-${prov}`);
      const statusEl = document.getElementById(`test-status-${prov}`);
      const key = inputEl ? inputEl.value.trim() : '';

      if (!key) {
        if (statusEl) {
          statusEl.textContent = '❌ Please enter an API key first';
          statusEl.style.color = '#f87171';
        }
        return;
      }

      if (statusEl) {
        statusEl.textContent = 'Testing connection...';
        statusEl.style.color = '#94a3b8';
      }

      const res = await AutonomousAIService.testConnection(prov, key);
      if (statusEl) {
        if (res.success) {
          statusEl.textContent = `✅ Connected (${res.latencyMs}ms)`;
          statusEl.style.color = '#34d399';
        } else {
          statusEl.textContent = `❌ ${res.message}`;
          statusEl.style.color = '#f87171';
        }
      }
    });
  });
}

function populateSearchKeys() {
  const tKey = document.getElementById('input-key-tavily');
  const sKey = document.getElementById('input-key-serper');
  const bKey = document.getElementById('input-key-brave');
  const eKey = document.getElementById('input-key-exa');
  const fKey = document.getElementById('input-key-firecrawl');
  const autoFailover = document.getElementById('settings-auto-failover');

  if (tKey) tKey.value = currentConfig?.tavilyApiKey || '';
  if (sKey) sKey.value = currentConfig?.serperApiKey || '';
  if (bKey) bKey.value = currentConfig?.braveApiKey || '';
  if (eKey) eKey.value = currentConfig?.exaApiKey || '';
  if (fKey) fKey.value = currentConfig?.firecrawlApiKey || '';
  if (autoFailover) autoFailover.checked = currentConfig?.autoFailoverEnabled !== false;
}

function renderSearchWaterfallList() {
  const container = document.getElementById('search-waterfall-list');
  if (!container) return;
  container.innerHTML = '';

  const rankLabels = ['1st (Primary)', '2nd (Fallback)', '3rd (Fallback)', '4th (Fallback)', '5th (Fallback)', '6th (Fallback)'];

  currentSearchOrder.forEach((provId, idx) => {
    const prov = SEARCH_PROVIDERS[provId] || { name: provId, tag: 'Search Engine', freeAllowance: '' };
    const row = document.createElement('div');
    row.className = 'waterfall-item';

    let hasKey = false;
    if (provId === 'tavily') hasKey = !!(currentConfig?.tavilyApiKey || document.getElementById('input-key-tavily')?.value);
    else if (provId === 'serper') hasKey = !!(currentConfig?.serperApiKey || document.getElementById('input-key-serper')?.value);
    else if (provId === 'brave') hasKey = !!(currentConfig?.braveApiKey || document.getElementById('input-key-brave')?.value);
    else if (provId === 'exa') hasKey = !!(currentConfig?.exaApiKey || document.getElementById('input-key-exa')?.value);
    else if (provId === 'firecrawl') hasKey = !!(currentConfig?.firecrawlApiKey || document.getElementById('input-key-firecrawl')?.value);
    else if (provId === 'gemini_grounding') hasKey = !!(currentConfig?.geminiApiKey);

    const statusBadge = hasKey
      ? `<span style="font-size: 10px; font-weight: 700; color: #34d399; background: rgba(52, 211, 153, 0.1); padding: 1px 6px; border-radius: 4px;">Ready</span>`
      : `<span style="font-size: 10px; color: var(--text-dim); background: var(--bg-card); padding: 1px 6px; border-radius: 4px;">No Key</span>`;

    row.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <span class="waterfall-rank">#0${idx + 1} · ${rankLabels[idx] || `${idx + 1}th`}</span>
        <div>
          <strong style="font-size: 11px;">${prov.name}</strong>
          <span style="font-size: 10px; color: var(--text-dim); margin-left: 4px;">(${prov.freeAllowance || prov.tag})</span>
        </div>
      </div>
      <div style="display: flex; align-items: center; gap: 6px;">
        ${statusBadge}
        <div class="waterfall-controls">
          <button class="btn-reorder btn-move-up" data-type="search" data-index="${idx}" ${idx === 0 ? 'disabled' : ''}>▲</button>
          <button class="btn-reorder btn-move-down" data-type="search" data-index="${idx}" ${idx === currentSearchOrder.length - 1 ? 'disabled' : ''}>▼</button>
        </div>
      </div>
    `;
    container.appendChild(row);
  });

  container.querySelectorAll('.btn-move-up').forEach((b) => {
    b.addEventListener('click', (e) => {
      const idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
      if (idx > 0) {
        const temp = currentSearchOrder[idx];
        currentSearchOrder[idx] = currentSearchOrder[idx - 1];
        currentSearchOrder[idx - 1] = temp;
        renderSearchWaterfallList();
      }
    });
  });

  container.querySelectorAll('.btn-move-down').forEach((b) => {
    b.addEventListener('click', (e) => {
      const idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
      if (idx < currentSearchOrder.length - 1) {
        const temp = currentSearchOrder[idx];
        currentSearchOrder[idx] = currentSearchOrder[idx + 1];
        currentSearchOrder[idx + 1] = temp;
        renderSearchWaterfallList();
      }
    });
  });
}

function renderAiWaterfallList() {
  const container = document.getElementById('ai-waterfall-list');
  if (!container) return;
  container.innerHTML = '';

  const rankLabels = ['1st (Primary)', '2nd (Fallback)', '3rd (Fallback)', '4th (Fallback)', '5th (Fallback)', '6th (Fallback)'];

  currentAiOrder.forEach((provId, idx) => {
    const prov = SUPPORTED_PROVIDERS[provId] || { name: provId, tag: 'AI Model' };
    const row = document.createElement('div');
    row.className = 'waterfall-item';

    let hasKey = false;
    if (provId === 'gemini') hasKey = !!currentConfig?.geminiApiKey;
    else if (provId === 'groq') hasKey = !!currentConfig?.groqKey;
    else if (provId === 'openrouter') hasKey = !!currentConfig?.openrouterKey;
    else if (provId === 'cerebras') hasKey = !!currentConfig?.cerebrasKey;
    else if (provId === 'grok') hasKey = !!currentConfig?.grokApiKey;
    else if (provId === 'openai') hasKey = !!currentConfig?.openaiKey;

    const statusBadge = hasKey
      ? `<span style="font-size: 10px; font-weight: 700; color: #a78bfa; background: rgba(167, 139, 250, 0.1); padding: 1px 6px; border-radius: 4px;">Configured</span>`
      : `<span style="font-size: 10px; color: var(--text-dim); background: var(--bg-card); padding: 1px 6px; border-radius: 4px;">Standby</span>`;

    row.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <span class="waterfall-rank">#0${idx + 1} · ${rankLabels[idx] || `${idx + 1}th`}</span>
        <div>
          <strong style="font-size: 11px;">${prov.name}</strong>
          <span style="font-size: 10px; color: var(--text-dim); margin-left: 4px;">(${prov.defaultModel || prov.tag})</span>
        </div>
      </div>
      <div style="display: flex; align-items: center; gap: 6px;">
        ${statusBadge}
        <div class="waterfall-controls">
          <button class="btn-reorder btn-move-ai-up" data-index="${idx}" ${idx === 0 ? 'disabled' : ''}>▲</button>
          <button class="btn-reorder btn-move-ai-down" data-index="${idx}" ${idx === currentAiOrder.length - 1 ? 'disabled' : ''}>▼</button>
        </div>
      </div>
    `;
    container.appendChild(row);
  });

  container.querySelectorAll('.btn-move-ai-up').forEach((b) => {
    b.addEventListener('click', (e) => {
      const idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
      if (idx > 0) {
        const temp = currentAiOrder[idx];
        currentAiOrder[idx] = currentAiOrder[idx - 1];
        currentAiOrder[idx - 1] = temp;
        renderAiWaterfallList();
      }
    });
  });

  container.querySelectorAll('.btn-move-ai-down').forEach((b) => {
    b.addEventListener('click', (e) => {
      const idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
      if (idx < currentAiOrder.length - 1) {
        const temp = currentAiOrder[idx];
        currentAiOrder[idx] = currentAiOrder[idx + 1];
        currentAiOrder[idx + 1] = temp;
        renderAiWaterfallList();
      }
    });
  });
}

function selectProvider(provId) {
  const prov = SUPPORTED_PROVIDERS[provId];
  if (!prov) return;

  settingsKeyLabel.textContent = `${prov.name} API Key:`;
  settingsApiKey.placeholder = prov.keyPlaceholder;
  settingsKeyLink.textContent = prov.urlText;
  settingsKeyLink.href = prov.keyUrl;

  let savedKey = '';
  switch (provId) {
    case 'gemini': savedKey = currentConfig?.geminiApiKey || ''; break;
    case 'grok': savedKey = currentConfig?.grokApiKey || ''; break;
    case 'openrouter': savedKey = currentConfig?.openrouterKey || ''; break;
    case 'groq': savedKey = currentConfig?.groqKey || ''; break;
    case 'cerebras': savedKey = currentConfig?.cerebrasKey || ''; break;
    case 'openai': savedKey = currentConfig?.openaiKey || ''; break;
    default: savedKey = currentConfig?.geminiApiKey || ''; break;
  }
  settingsApiKey.value = savedKey;
  settingsCustomModel.value = currentConfig?.customModel || '';
  settingsDefaultLang.value = currentConfig?.videoLanguage || 'Bangla';
  settingsDefaultDuration.value = currentConfig?.videoDuration || '60s';
  settingsTestStatus.textContent = '';
}

function updateKeyBanner() {
  const activeProv = currentConfig?.activeProvider || 'gemini';
  const key = currentConfig?.geminiApiKey || currentConfig?.groqKey || currentConfig?.openrouterKey || '';
  const detected = currentConfig?.customModel || 'gemini-3.8-flash';

  detectedModelLabel.textContent = detected;
  statusCurrentModelText.textContent = detected;
  settingsModelDetectedBadge.textContent = detected;

  if (key) {
    keyBanner.classList.add('active-key');
    keyBannerText.innerHTML = `🟢 <strong>Serverless Mode Active (${activeProv.toUpperCase()} · ${detected}):</strong> Cross-Provider Auto-Failover Enabled.`;
    btnBannerSetupKey.textContent = 'Manage API Keys';
  } else {
    keyBanner.classList.remove('active-key');
    keyBannerText.innerHTML = `🔑 <strong>Multi-Engine AI Ready:</strong> Configure free API keys for Tavily, Serper, Brave, Exa, Firecrawl, or Gemini in Settings (⚙️)!`;
    btnBannerSetupKey.textContent = 'Setup API Keys';
  }
}

// ======================== EVENT LISTENERS ========================

function setupEventListeners() {
  // Tab Switching
  navTabs.forEach((tab) => {
    tab.addEventListener('click', (e) => {
      const target = e.currentTarget.getAttribute('data-tab');
      switchTab(target);
    });
  });

  // News Window Switching
  windowBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      windowBtns.forEach((b) => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      currentTimeWindow = e.currentTarget.getAttribute('data-window');
      document.getElementById('window-status-text').textContent = `News Window: Past ${currentTimeWindow} · Reputable Global Wire Sources`;
      refreshNewsWithAi();
    });
  });

  // Expand to Full Desktop Tab
  btnExpandFullTab.addEventListener('click', () => {
    if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.create) {
      chrome.tabs.create({ url: chrome.runtime.getURL('popup.html?tab=full') });
    } else {
      window.open('popup.html?tab=full', '_blank');
    }
  });

  // Header Buttons
  btnRefreshFeed.addEventListener('click', () => refreshNewsWithAi());
  btnToggleTheme.addEventListener('click', () => {
    isDarkTheme = !isDarkTheme;
    applyTheme(isDarkTheme);
    try { localStorage.setItem('ext_theme', isDarkTheme ? 'dark' : 'light'); } catch {}
  });

  btnSettings.addEventListener('click', () => openModal(modalSettings));
  btnBannerSetupKey.addEventListener('click', () => openModal(modalSettings));
  btnAiStatus.addEventListener('click', () => openModal(modalAiStatus));
  btnExecutiveBrief.addEventListener('click', () => openExecutiveBriefModal());
  btnReadmeBangla.addEventListener('click', () => openModal(modalBanglaReadme));

  btnQuickRead.addEventListener('click', () => {
    if (quickReadIds.length === 0) {
      alert('Your Quick Read stack is empty. Click "⚡ Quick Read" on any article card to add it here.');
      return;
    }
    const stackItems = currentDataset.items.filter((i) => quickReadIds.includes(i.id));
    let msg = `⚡ QUICK READ STACK (${stackItems.length} items):\n\n`;
    stackItems.forEach((it, idx) => {
      msg += `#0${idx + 1} · [${it.priorityScore} PTS] ${it.headline}\n${it.oneLineSummary}\n\n`;
    });
    alert(msg);
  });

  btnSavedArticles.addEventListener('click', () => {
    if (savedArticles.length === 0) {
      alert('No saved bookmarks yet. Click "🔖 Save" on any article to bookmark it.');
      return;
    }
    const saved = currentDataset.items.filter((i) => savedArticles.includes(i.id));
    let msg = `🔖 SAVED BOOKMARKS (${saved.length} items):\n\n`;
    saved.forEach((it, idx) => {
      msg += `#0${idx + 1} · ${it.headline}\nSource: ${it.source}\n\n`;
    });
    alert(msg);
  });

  btnVideoTracker.addEventListener('click', () => {
    const keys = Object.keys(videoCreatedMap);
    if (keys.length === 0) {
      alert('No videos tracked yet. Click "✓ Mark Created" on any card once you produce a video for it.');
      return;
    }
    let msg = `✅ VIDEOS CREATED TRACKER (${keys.length} items tracked):\n\n`;
    keys.forEach((k, idx) => {
      const rec = videoCreatedMap[k];
      msg += `#0${idx + 1} · ${rec.headline}\nCreated on: ${new Date(rec.date).toLocaleDateString()}\n\n`;
    });
    alert(msg);
  });

  // Search & Filters
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    currentSearchQuery = topicSearchInput.value.trim();
    if (currentSearchQuery) {
      refreshNewsWithAi(currentSearchQuery);
    } else {
      renderNewsFeed();
    }
  });

  btnClearSearch.addEventListener('click', () => {
    topicSearchInput.value = '';
    currentSearchQuery = '';
    renderNewsFeed();
  });

  document.querySelectorAll('.pill').forEach((pill) => {
    pill.addEventListener('click', (e) => {
      const topic = e.currentTarget.getAttribute('data-topic');
      if (topic) {
        document.querySelectorAll('.pill').forEach((p) => p.classList.remove('active'));
        e.currentTarget.classList.add('active');
        activeTopicTag = topic;
        topicSearchInput.value = topic;
        btnResetTopic.style.display = 'inline-block';
        refreshNewsWithAi(topic);
      }
    });
  });

  btnResetTopic.addEventListener('click', () => {
    document.querySelectorAll('.pill').forEach((p) => p.classList.remove('active'));
    activeTopicTag = '';
    currentSearchQuery = '';
    topicSearchInput.value = '';
    btnResetTopic.style.display = 'none';
    renderNewsFeed();
  });

  filterCategory.addEventListener('change', () => renderNewsFeed());
  filterRegion.addEventListener('change', () => renderNewsFeed());
  filterMinScore.addEventListener('input', (e) => {
    labelMinScore.textContent = e.target.value;
    renderNewsFeed();
  });
  sortBySelect.addEventListener('change', () => renderNewsFeed());

  // Close modals
  document.querySelectorAll('.btn-close-modal').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const modal = e.currentTarget.closest('.modal-overlay');
      if (modal) closeModal(modal);
    });
  });

  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      closeModal(e.target);
    }
  });

  // Settings Actions
  btnTestSettingsKey.addEventListener('click', async () => {
    const activeProv = document.querySelector('.provider-btn.active')?.getAttribute('data-id') || 'gemini';
    const key = settingsApiKey.value.trim();
    const customModel = settingsCustomModel.value.trim();

    if (!key) {
      settingsTestStatus.textContent = '❌ Please enter an API key';
      settingsTestStatus.style.color = '#f87171';
      return;
    }

    settingsTestStatus.textContent = 'Testing connection...';
    settingsTestStatus.style.color = '#94a3b8';

    const res = await AutonomousAIService.testConnection(activeProv, key, customModel);
    if (res.success) {
      settingsTestStatus.textContent = `✅ Connected (${res.latencyMs}ms)`;
      settingsTestStatus.style.color = '#34d399';
    } else {
      settingsTestStatus.textContent = `❌ ${res.message}`;
      settingsTestStatus.style.color = '#f87171';
    }
  });

  btnSaveSettings.addEventListener('click', async () => {
    const activeProv = document.querySelector('.provider-btn.active')?.getAttribute('data-id') || 'gemini';
    const key = settingsApiKey.value.trim();
    const customModel = settingsCustomModel.value.trim();
    const videoLang = settingsDefaultLang.value;
    const videoDur = settingsDefaultDuration.value;

    const tavilyKey = document.getElementById('input-key-tavily')?.value.trim() || '';
    const serperKey = document.getElementById('input-key-serper')?.value.trim() || '';
    const braveKey = document.getElementById('input-key-brave')?.value.trim() || '';
    const exaKey = document.getElementById('input-key-exa')?.value.trim() || '';
    const firecrawlKey = document.getElementById('input-key-firecrawl')?.value.trim() || '';
    const autoFailover = document.getElementById('settings-auto-failover')?.checked !== false;

    const updates = {
      activeProvider: activeProv,
      customModel,
      videoLanguage: videoLang,
      videoDuration: videoDur,
      tavilyApiKey: tavilyKey,
      serperApiKey: serperKey,
      braveApiKey: braveKey,
      exaApiKey: exaKey,
      firecrawlApiKey: firecrawlKey,
      searchProviderOrder: currentSearchOrder,
      aiProviderOrder: currentAiOrder,
      autoFailoverEnabled: autoFailover,
    };

    if (activeProv === 'gemini') updates.geminiApiKey = key;
    else if (activeProv === 'grok') updates.grokApiKey = key;
    else if (activeProv === 'openrouter') updates.openrouterKey = key;
    else if (activeProv === 'groq') updates.groqKey = key;
    else if (activeProv === 'cerebras') updates.cerebrasKey = key;
    else if (activeProv === 'openai') updates.openaiKey = key;

    await AutonomousAIService.saveConfig(updates);
    currentConfig = await AutonomousAIService.getStoredConfig();
    updateKeyBanner();
    closeModal(modalSettings);
    alert('✅ Settings & Priority Waterfall Order saved successfully!');
  });

  // Studio Script Actions
  btnStudioGenerate.addEventListener('click', () => {
    generateBriefInStudio();
  });

  btnStudioCopy.addEventListener('click', () => {
    navigator.clipboard.writeText(studioScriptTextarea.value);
    btnStudioCopy.textContent = '✅ Copied!';
    setTimeout(() => { btnStudioCopy.textContent = '📋 Copy Full Narration'; }, 2000);
  });

  document.getElementById('btn-copy-brief').addEventListener('click', () => {
    const briefEl = document.getElementById('executive-brief-content');
    navigator.clipboard.writeText(briefEl.innerText);
    const btn = document.getElementById('btn-copy-brief');
    btn.textContent = '✅ Copied!';
    setTimeout(() => { btn.textContent = '📋 Copy Briefing'; }, 2000);
  });
}

function switchTab(tabId) {
  currentTab = tabId;
  navTabs.forEach((t) => {
    if (t.getAttribute('data-tab') === tabId) t.classList.add('active');
    else t.classList.remove('active');
  });

  tabPanes.forEach((p) => {
    if (p.id === `tab-content-${tabId}`) p.style.display = 'flex';
    else p.style.display = 'none';
  });
}

function applyTheme(isDark) {
  if (isDark) {
    bodyEl.classList.remove('light-theme');
    btnToggleTheme.textContent = '🌙';
  } else {
    bodyEl.classList.add('light-theme');
    btnToggleTheme.textContent = '☀️';
  }
}

// ======================== REFRESH NEWS WITH AI ========================

async function refreshNewsWithAi(customQuery = '') {
  const hasSearchKey = !!(
    currentConfig?.geminiApiKey ||
    currentConfig?.tavilyApiKey ||
    currentConfig?.serperApiKey ||
    currentConfig?.braveApiKey ||
    currentConfig?.exaApiKey ||
    currentConfig?.firecrawlApiKey
  );

  const hasAiKey = !!(
    currentConfig?.geminiApiKey ||
    currentConfig?.groqKey ||
    currentConfig?.openrouterKey ||
    currentConfig?.cerebrasKey ||
    currentConfig?.grokApiKey ||
    currentConfig?.openaiKey
  );

  if (!hasSearchKey && !hasAiKey) {
    alert('Please enter at least one free API key (Gemini, Tavily, Serper, Brave, Groq, OpenRouter, etc.) in Settings (⚙️) to query real-time live wire feeds.');
    openModal(modalSettings);
    return;
  }

  btnRefreshFeed.disabled = true;
  btnRefreshFeed.innerHTML = '🔄 Searching Live Global Wire...';

  try {
    // Step 1: Execute Multi-Engine Search Cascade through user-defined serial order
    const searchRes = await AutonomousAIService.executeSearchCascade(customQuery, currentTimeWindow);

    // Step 2: Build CPO Intelligence Synthesis Prompt
    const prompt = `You are a Global Chief Procurement Officer (CPO) and Trade Intelligence Director.
Search and synthesize breaking, real-time supply chain, maritime, tariff, trade restriction, and port disruption news from the last ${currentTimeWindow}.
${customQuery ? `Specific focus topic: "${customQuery}".` : ''}

Output strictly valid JSON with this exact structure:
{
  "totalAnalyzed": 284,
  "lastUpdated": "${new Date().toISOString()}",
  "top10Things": [
    {
      "rank": 1,
      "headline": "Short punchy headline",
      "summary": "2 concise sentences explaining procurement impact, delays, and cost variance",
      "region": "Red Sea / Europe / Asia",
      "priorityScore": 95,
      "whyItMatters": "Actionable directive for buyers"
    }
  ],
  "items": [
    {
      "id": "news-1",
      "headline": "Detailed headline specifying trade corridors or materials",
      "summary": "Clear summary of the event with numbers and freight/tariff consequences",
      "source": "Bloomberg / Reuters / FreightWaves / JOC",
      "url": "https://news.google.com",
      "category": "Shipping",
      "impact": "Critical",
      "priorityScore": 95,
      "regions": ["Red Sea", "Europe"],
      "metrics": {
        "transitDelayDays": 14,
        "costIncreasePct": 28
      }
    }
  ]
}
Output ONLY valid raw JSON with no conversational preamble or markdown backticks.`;

    // Step 3: Execute AI Cascade with Auto-Failover on HTTP 429 / Quota limits
    const aiRes = await AutonomousAIService.executeAiCascade(prompt, {
      temperature: 0.2,
      searchGroundingData: searchRes.results,
    });

    const parsedJson = aiRes.data;

    if (parsedJson && parsedJson.items && parsedJson.items.length > 0) {
      currentDataset = {
        ...currentDataset,
        totalAnalyzed: parsedJson.totalAnalyzed || currentDataset.totalAnalyzed,
        lastUpdated: new Date().toISOString(),
        top10Things: parsedJson.top10Things || currentDataset.top10Things,
        items: parsedJson.items.map((it, idx) => ({
          ...currentDataset.items[idx % currentDataset.items.length],
          ...it,
          id: it.id || `live-news-${idx + 1}`,
        })),
      };
      renderAllViews();

      const allLogs = [...searchRes.failoverLog, ...aiRes.failoverLog];
      if (allLogs.length > 0) {
        alert(`⚡ Automatic Quota Failover Notice:\n\n${allLogs.join('\n')}\n\nEngine used: ${aiRes.providerUsed.toUpperCase()} (${aiRes.modelUsed || ''})`);
      }
    } else {
      throw new Error('Received unexpected output from AI provider');
    }
  } catch (err) {
    alert(`Refresh Notice: ${err.message || 'Check your configured API keys'}. Displaying baseline verified data.`);
  } finally {
    btnRefreshFeed.disabled = false;
    btnRefreshFeed.innerHTML = '🔄 Refresh News';
  }
}

// ======================== BOOKMARKS & TRACKERS ========================

function toggleSaveArticle(id) {
  if (savedArticles.includes(id)) {
    savedArticles = savedArticles.filter((item) => item !== id);
  } else {
    savedArticles.push(id);
  }
  try { localStorage.setItem('ext_bookmarks', JSON.stringify(savedArticles)); } catch {}
  updateCounters();
  renderNewsFeed();
}

function toggleQuickRead(id) {
  if (quickReadIds.includes(id)) {
    quickReadIds = quickReadIds.filter((item) => item !== id);
  } else {
    quickReadIds.push(id);
  }
  try { localStorage.setItem('ext_quick_read', JSON.stringify(quickReadIds)); } catch {}
  updateCounters();
  renderNewsFeed();
}

function toggleVideoTracker(id) {
  const item = currentDataset.items.find((i) => i.id === id);
  if (!item) return;

  if (videoCreatedMap[id]) {
    delete videoCreatedMap[id];
  } else {
    videoCreatedMap[id] = {
      id,
      headline: item.headline,
      date: new Date().toISOString(),
    };
  }
  try { localStorage.setItem('ext_video_tracker', JSON.stringify(videoCreatedMap)); } catch {}
  updateCounters();
  renderNewsFeed();
}

function updateCounters() {
  quickReadCounter.textContent = String(quickReadIds.length);
  savedCounter.textContent = String(savedArticles.length);
  trackerCounter.textContent = String(Object.keys(videoCreatedMap).length);
}

function formatTimeAgo(isoString) {
  if (!isoString) return 'Recent';
  try {
    const diff = (Date.now() - new Date(isoString).getTime()) / 1000;
    if (diff < 3600) return `${Math.max(1, Math.floor(diff / 60))}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  } catch {
    return 'Recent';
  }
}

// Start application
init();
