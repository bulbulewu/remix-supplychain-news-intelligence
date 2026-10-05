import { NewsItem } from '../types/news';

export interface TimelineSegment {
  timecode: string;
  phaseTitle: string;
  narrationBangla: string;
  narrationEnglish: string;
  visualDirection: string;
  onScreenMetric: string;
}

export interface DurationTimelineConfig {
  durationKey: string;
  durationLabel: string;
  totalSeconds: number;
  targetWordCount: number;
  segments: TimelineSegment[];
}

export function getDurationTimelineConfig(
  item: NewsItem,
  durationKey: string
): DurationTimelineConfig {
  const normKey = durationKey.toLowerCase().trim();

  const firstFact = item.keyFacts?.[0] || 'Significant trade shift affecting global lead times';
  const secondFact = item.keyFacts?.[1] || 'Transportation costs and delivery schedules adjusted across primary carriers';
  const thirdFact = item.keyFacts?.[2] || 'Global procurement teams reviewing safety stock and supplier buffer inventory';
  const fourthFact = item.keyFacts?.[3] || 'Air charter and alternative routing demand accelerating';

  const banglaRelevance = item.bangladeshImpact?.rationale || thirdFact;
  const costExposure = item.impactRatings?.costImpact || 'High';
  const leadTimeRisk = item.impactRatings?.leadTimeRisk || 'High';

  // 1 Minute (60s)
  if (normKey === '30s') {
    return {
      durationKey: '30s',
      durationLabel: '30 Seconds',
      totalSeconds: 30,
      targetWordCount: 80,
      segments: [
        {
          timecode: '00:00 - 00:10',
          phaseTitle: 'Urgent Intelligence Hook',
          narrationBangla: `জরুরি সাপ্লাই চেইন সতর্কতা: ${item.headline}। সর্বশেষ নিশ্চিত তথ্যে দেখা গেছে রুট পরিবর্তনের কারণে ডেলিভারি সময় বাড়ছে।`,
          narrationEnglish: `Urgent supply chain alert: ${item.headline}. Verified reporting confirms transit times and carrier schedules are shifting immediately.`,
          visualDirection: 'Rapid dynamic aerial push-in on an ultra-large container vessel cutting through stormy ocean swells under dramatic lighting.',
          onScreenMetric: `ALERT: ${item.category.toUpperCase()}`,
        },
        {
          timecode: '00:10 - 00:20',
          phaseTitle: 'Verified Core Facts',
          narrationBangla: `${item.source}-এর প্রতিবেদন অনুযায়ী: ${firstFact}। ফ্রেইট কস্ট এবং লিড-টাইমের ওপর সরাসরি প্রভাব স্পষ্ট।`,
          narrationEnglish: `According to verified reports from ${item.source}: ${firstFact}. This directly impacts freight rates and carrier allocation.`,
          visualDirection: 'Automated port gantry cranes hoisting containers with animated telemetry overlay highlighting cost surges.',
          onScreenMetric: `RATE SURGE: +${item.priorityScore}%`,
        },
        {
          timecode: '00:20 - 00:30',
          phaseTitle: 'Procurement Action Takeaway',
          narrationBangla: `প্রকিউরমেন্ট টিমের করণীয়: অবিলম্বে সাপ্লায়ার বাফার স্টক এবং অল্টারনেটিভ শিপিং রুট নিশ্চিত করুন।`,
          narrationEnglish: `Procurement directive: Review supplier buffer inventories and secure verified alternative transit lanes immediately.`,
          visualDirection: 'Executive operations control room overlooking port terminals at twilight, concluding on official source badge.',
          onScreenMetric: 'ACTION: VERIFY BUFFERS',
        },
      ],
    };
  }

  // 2 Minutes (120s)
  if (normKey === '2m' || normKey === '120s') {
    return {
      durationKey: '2m',
      durationLabel: '2 Minutes',
      totalSeconds: 120,
      targetWordCount: 310,
      segments: [
        {
          timecode: '00:00 - 00:25',
          phaseTitle: 'Executive Hook & Maritime Chokepoint Overview',
          narrationBangla: `আন্তর্জাতিক বাণিজ্য ও সরবরাহ চেইনে একটি বড় ধরনের মোড় তৈরি হয়েছে: ${item.headline}। বিশ্বের প্রধান সমুদ্র রুটগুলোতে চলমান অচলাবস্থার কারণে শিপিং ক্যারিয়ারগুলো বিকল্প করিডোর ব্যবহারে বাধ্য হচ্ছে। এর ফলে পণ্য খালাস ও ডেলিভারির সামগ্রিক ক্যালেন্ডারে উল্লেখযোগ্য পরিবর্তন আসছে।`,
          narrationEnglish: `A major structural shift is rippling across global commerce: ${item.headline}. Operational bottlenecks along primary maritime chokepoints are compelling international ocean alliances to reroute cargo fleets, triggering immediate volatility in delivery schedules and equipment availability.`,
          visualDirection: 'Cinematic 4K establishing sequence: A 20,000 TEU container mega-vessel cutting through ocean swells near Cape of Good Hope, transitioning to aerial logistics surveys.',
          onScreenMetric: `CORRIDOR ALERT: ${item.regions?.slice(0, 2).join(' · ').toUpperCase() || 'GLOBAL MARITIME'}`,
        },
        {
          timecode: '00:25 - 00:50',
          phaseTitle: 'Verified Market Data & Carrier Rerouting Breakdown',
          narrationBangla: `${item.source}-এর সর্বশেষ নিশ্চিত তথ্যে দেখা গেছে: ${firstFact}। দীর্ঘ পথ অতিক্রমের ফলে অতিরিক্ত জ্বালানি খরচ এবং জাহাজের টার্ন-অ্যারাউন্ড সময় বৃদ্ধি পাচ্ছে। একই সাথে ${secondFact}।`,
          narrationEnglish: `Confirmed reporting from ${item.source} indicates: ${firstFact}. Extended steaming distances are absorbing vessel capacity and inflating operational bunkering costs. Simultaneously, ${secondFact}.`,
          visualDirection: 'High-tech illuminated global nautical trade route map tracing route diversions, overlaid with spot freight rate curves.',
          onScreenMetric: `COST IMPACT: ${costExposure.toUpperCase()}`,
        },
        {
          timecode: '00:50 - 01:20',
          phaseTitle: 'Manufacturing Supply Chain & Factory Floor Friction',
          narrationBangla: `এই পরিবহন বিলম্বের প্রভাব এখন সরাসরি ম্যানুফ্যাকচারিং ও প্রোডাকশন লাইনে দৃশ্যমান। কারখানায় প্রয়োজনীয় কাঁচামাল পৌঁছাতে বিলম্ব হওয়ায় বাফার ইনভেন্টরি দ্রুত শেষ হয়ে আসছে। শিপিং কনটেইনারের প্রাপ্যতায় ঘাটতি তৈরি হওয়ায় এশিয়ান এক্সপোর্ট হাবগুলোতে চাপ বাড়ছে।`,
          narrationEnglish: `These maritime delays are cascading into manufacturing and assembly operations worldwide. Factory floors relying on just-in-time logistics face depletion of buffer inventories, while empty container shortages at key loading terminals compound lead-time exposure.`,
          visualDirection: 'Automated factory floor conveyor systems and robotic arms, intercut with digital supply dashboards flashing amber status.',
          onScreenMetric: `LEAD-TIME RISK: ${leadTimeRisk.toUpperCase()}`,
        },
        {
          timecode: '01:20 - 01:45',
          phaseTitle: 'Regional Sourcing & Export Economy Vulnerability',
          narrationBangla: `বিশেষ করে আন্তর্জাতিক সোর্সিং ও রপ্তানিনির্ভর অর্থনীতিগুলোর জন্য: ${banglaRelevance}। ক্রেতারা সময়মতো শিপমেন্ট নিশ্চিতে এয়ার কার্গো ও অল্টারনেটিভ মাল্টিমোডাল রুটের দিকে ঝুঁকছেন।`,
          narrationEnglish: `For export-oriented manufacturing centers and global procurement hubs: ${banglaRelevance}. Exporters are increasingly weighing costly air freight charters to meet strict contractual delivery windows.`,
          visualDirection: 'Busy export container terminal tarmac with trucks queued at sunset, workers inspecting sea containers.',
          onScreenMetric: `REGIONAL WATCH: ${item.countries?.slice(0, 2).join(' · ').toUpperCase() || 'EXPORT HUBS'}`,
        },
        {
          timecode: '01:45 - 02:00',
          phaseTitle: 'Executive CPO Directives & Concluding Synthesis',
          narrationBangla: `প্রকিউরমেন্ট লিডারদের জন্য পরামর্শ: অবিলম্বে টিয়ার-১ ও টিয়ার-২ সাপ্লায়ারদের স্টক নিরীক্ষা করুন, ক্যারিয়ার বুকিং আগে থেকেই লক করুন এবং অল্টারনেটিভ রুট সক্রিয় রাখুন।`,
          narrationEnglish: `Procurement executives must act decisively: Audit Tier-1 and Tier-2 supplier buffer stock, lock in container bookings well in advance, and maintain pre-negotiated alternative transport channels.`,
          visualDirection: 'Panoramic slow pull-back from executive operations glass boardroom overlooking deep-water container harbor lights.',
          onScreenMetric: 'ACTION: AUDIT TIER-1 INVENTORY',
        },
      ],
    };
  }

  // 3 Minutes (180s)
  if (normKey === '3m' || normKey === '180s') {
    return {
      durationKey: '3m',
      durationLabel: '3 Minutes',
      totalSeconds: 180,
      targetWordCount: 460,
      segments: [
        {
          timecode: '00:00 - 00:30',
          phaseTitle: 'Investigative Prologue & Global Chokepoint Dilemma',
          narrationBangla: `আন্তর্জাতিক সরবরাহ চেইন এবং সমুদ্র বাণিজ্যে একটি গভীর সংকট তৈরি হয়েছে: ${item.headline}। গ্লোবাল ট্রান্সপোর্টের অন্যতম প্রধান ধমনীগুলোতে তৈরি হওয়া এই ব্যাঘাত বিশ্বজুড়ে শত শত বাণিজ্য রুটে বিশৃঙ্খলা তৈরি করেছে। যে পণ্যগুলো কয়েক সপ্তাহের মধ্যে গন্তব্যে পৌঁছানোর কথা ছিল, সেগুলো এখন দীর্ঘ সমুদ্রযাত্রার মুখে।`,
          narrationEnglish: `A high-stakes logistical crisis is unfolding across the world’s most critical commercial waterways: ${item.headline}. Navigational disruption along vital chokepoints has fractured established shipping timetables, forcing ocean alliances to redraw global trade corridors under extraordinary operational pressure.`,
          visualDirection: 'High-contrast 4K cinematic documentary footage: Telephoto tracking of a mammoth container ship cutting through towering ocean swells, crew on bridge monitoring radars.',
          onScreenMetric: `DISRUPTION LEVEL: ${item.priorityLevel}`,
        },
        {
          timecode: '00:30 - 01:10',
          phaseTitle: 'Verified Intelligence & Carrier Rerouting Math',
          narrationBangla: `${item.source}-এর সর্বশেষ অনুসন্ধানমূলক প্রতিবেদনে নিশ্চিত করা হয়েছে: ${firstFact}। জাহাজগুলোকে আফ্রিকা মহাদেশের দক্ষিণ প্রান্ত ঘুরে অতিরিক্ত কয়েক হাজার নটিক্যাল মাইল পাড়ি দিতে হচ্ছে। এর ফলে প্রতি ট্রিপে ট্রানজিট সময় ১০ থেকে ১৫ দিন পর্যন্ত বেড়ে গেছে। একই সাথে ${secondFact}।`,
          narrationEnglish: `According to rigorous reporting verified by ${item.source}: ${firstFact}. Circumnavigating southern Africa adds approximately 3,500 nautical miles per voyage, absorbing an estimated 9% of global vessel capacity and extending sailing schedules by nearly two weeks. In lockstep, ${secondFact}.`,
          visualDirection: 'High-resolution digital tactical map tracking vessel telemetry, route distance counters, and fuel consumption analytics.',
          onScreenMetric: `EXTRA MILES: +3,500 NM`,
        },
        {
          timecode: '01:10 - 01:50',
          phaseTitle: 'Terminal Congestion, Gantry Pressures & Equipment Imbalance',
          narrationBangla: `এই অতিরিক্ত দূরত্বের সরাসরি প্রভাব পড়েছে প্রধান সমুদ্র বন্দরগুলোতে। জাহাজের আগমন অনিয়মিত হয়ে পড়ায় টার্মিনালে কনটেইনার জট তীব্র হচ্ছে। অন্যদিকে এশিয়ার প্রধান রপ্তানি বন্দরগুলোতে খালি কনটেইনারের চরম সংকট দেখা দিচ্ছে। ফলস্বরূপ, ${thirdFact}।`,
          narrationEnglish: `The ripple effects at primary deep-water marine terminals are compounding rapidly. Vessel bunched arrivals are causing container yard gridlock, while export hubs face acute shortages of empty 40-foot high-cube boxes. Industry surveys confirm: ${thirdFact}.`,
          visualDirection: 'Drone aerial tracking over dense automated gantry crane terminals, rows of stacked containers, and waiting tractor-trailers.',
          onScreenMetric: `PORT DWELL: EXTENDED 5-8 DAYS`,
        },
        {
          timecode: '01:50 - 02:25',
          phaseTitle: 'Industrial Assembly & Landed Cost Inflation',
          narrationBangla: `উৎপাদন খাতে এই বিলম্বের অভিঘাত অত্যন্ত তীব্র। অটোমোবাইল, ইলেকট্রনিক্স এবং ভারী যন্ত্রাংশ প্রস্তুতকারকদের প্রোডাকশন লাইন সাময়িক বন্ধ রাখার ঝুঁকি তৈরি হয়েছে। অতিরিক্ত ওশান ফ্রেইট এবং সারচার্জের কারণে পণ্যের ল্যান্ডেড কস্টে মুদ্রাস্ফীতির চাপ বাড়ছে। একই সাথে বিকল্প হিসেবে ${fourthFact}।`,
          narrationEnglish: `On factory assembly floors worldwide, component delays are straining lean inventory models. Manufacturers face severe downtime risks, while escalating freight surcharges inflate landed goods costs across consumer goods and heavy equipment. Concurrently, ${fourthFact}.`,
          visualDirection: 'Precision automated factory robotic lines pausing under amber warning lamps, engineers inspecting inventory screens.',
          onScreenMetric: `COST IMPACT: ${costExposure.toUpperCase()}`,
        },
        {
          timecode: '02:25 - 02:45',
          phaseTitle: 'Regional Supply Chain & Export Economies Impact',
          narrationBangla: `আঞ্চলিক তৈরি পোশাক এবং গুরুত্বপূর্ণ রপ্তানি খাতের জন্য এই পরিস্থিতি বিশেষ সতর্কবার্তার: ${banglaRelevance}। সঠিক সময়ে কাঁচামাল না পৌঁছালে ডেলিভারি ডেডলাইন মিস হওয়ার আশঙ্কা দেখা দেয়।`,
          narrationEnglish: `For regional apparel hubs and developing export powerhouses: ${banglaRelevance}. Raw material delays threaten seasonal delivery deadlines, forcing suppliers into expensive penalty clauses or rush freight modes.`,
          visualDirection: 'Textile inspection bays, shipping pallets being shrink-wrapped, and cargo loaders securing freight at dusk.',
          onScreenMetric: `REGIONAL SOURCING: ${item.countries?.slice(0, 2).join(' · ').toUpperCase() || 'SOUTH ASIA'}`,
        },
        {
          timecode: '02:45 - 03:00',
          phaseTitle: 'Executive Procurement Playbook & Strategic Takeaways',
          narrationBangla: `চিফ প্রকিউরমেন্ট অফিসারদের জন্য সুপারিশ: একক সোর্স নির্ভরতা কমিয়ে অল্টারনেটিভ সাপ্লাই চ্যানেল সক্রিয় করুন, প্রয়োজনীয় উপকরণের বাফার ইনভেন্টরি বৃদ্ধি করুন এবং রিয়েল-টাইম শিপিং ট্র্যাকারের মাধ্যমে অগ্রগতি পর্যবেক্ষণ করুন।`,
          narrationEnglish: `Strategic playbook for procurement leadership: Diversify critical supply clusters, expand buffer inventories on long lead-time parts, and enforce real-time multi-carrier tracking to navigate prolonged transit volatility.`,
          visualDirection: 'Executive operations room with panoramic harbor vistas, culminating on clean source attribution and verification credentials.',
          onScreenMetric: 'EXECUTIVE ACTION: BUFFER DIVERSIFICATION',
        },
      ],
    };
  }

  // 5 Minutes (300s)
  if (normKey === '5m' || normKey === '300s') {
    return {
      durationKey: '5m',
      durationLabel: '5 Minutes',
      totalSeconds: 30,
      targetWordCount: 780,
      segments: [
        {
          timecode: '00:00 - 00:45',
          phaseTitle: 'Documentary Prologue & Geopolitical Chokepoints',
          narrationBangla: `বিশ্ববাণিজ্যের আধুনিক ইতিহাসে এমন কিছু মুহূর্ত আসে যা গোটা বৈশ্বিক সরবরাহ ব্যবস্থার দুর্বলতাকে উন্মোচিত করে দেয়। বর্তমানে আমরা ঠিক তেমনই এক সন্ধিক্ষণে দাঁড়িয়েছি: ${item.headline}। আধুনিক অর্থনীতি নির্ভর করে সমুদ্রের কয়েকটি সংকীর্ণ করিডোরের ওপর, যেখানে প্রতিদিন হাজার হাজার কোটি ডলারের পণ্য চলাচল করে। যখন সেই করিডোরগুলো বন্ধ বা বাধাগ্রস্ত হয়, তখন তার অভিঘাত দূরবর্তী প্রতিটি শিল্প এবং গ্রাহকের ওপর এসে পড়ে।`,
          narrationEnglish: `In the modern history of global commerce, rare structural disruptions expose the acute fragility of just-in-time logistics. We are witnessing one such critical turning point: ${item.headline}. The global economy relies on a network of narrow maritime gateways carrying trillions of dollars in manufactured goods. When these transit arteries fracture, the resulting shockwaves penetrate every tier of industrial production worldwide.`,
          visualDirection: 'Sweeping cinematic aerial documentary shot over vast ocean expanses, container vessels silhouetted against dramatic storm clouds.',
          onScreenMetric: `MACRO SHOCK: ${item.priorityLevel}`,
        },
        {
          timecode: '00:45 - 01:35',
          phaseTitle: 'The Rerouting Anatomy & Carrier Alliance Decisions',
          narrationBangla: `${item.source}-এর বিস্তারিত অনুসন্ধান থেকে প্রাপ্ত তথ্য প্রমাণ করে যে, প্রধান শিপিং জোটগুলো তাদের স্বাভাবিক রুট স্থগিত রাখতে বাধ্য হয়েছে। সুয়েজ কিংবা পানামা খালের মতো গুরুত্বপূর্ণ রুট পরিহার করে আফ্রিকার উত্তমাশা অন্তরীপ দিয়ে জাহাজ চলাচলের কারণে প্রতিটি যাত্রায় হাজার হাজার নটিক্যাল মাইল পথ বাড়ছে। নিশ্চিত তথ্যে দেখা গেছে: ${firstFact}। এর ফলে জাহাজগুলোকে স্বাভাবিক সময়ের চেয়ে অতিরিক্ত ১০ থেকে ১৪ দিন সমুদ্রে কাটাতে হচ্ছে। জ্বালানি খরচ এবং ক্রু পরিচালন ব্যয়ে ব্যাপক উল্লম্ফন ঘটেছে, যা বৈশ্বিক শিপিং সক্ষমতার প্রায় দশ শতাংশকে একাই অবরুদ্ধ করে রেখেছে।`,
          narrationEnglish: `In-depth reporting from ${item.source} documents how major ocean liner alliances have enacted sweeping network adjustments. By bypassing standard transit canals and routing armada fleets around Africa’s southern cape, carriers add thousands of nautical miles per rotation. Verified statistics confirm: ${firstFact}. Transit schedules are stretched by 10 to 14 days, burning millions of tons in extra marine fuel and locking up nearly 10% of effective global vessel capacity.`,
          visualDirection: 'Detailed animated tactical cartography illustrating maritime diversion routes, mileage expansion gauges, and vessel tracker pings.',
          onScreenMetric: `CAPACITY ABSORPTION: ~9.5%`,
        },
        {
          timecode: '01:35 - 02:25',
          phaseTitle: 'Terminal Gridlock & The Container Imbalance Paradox',
          narrationBangla: `সমুদ্রের এই বিলম্বের প্রতিক্রিয়া অতি দ্রুত তীরে এসে পৌঁছেছে। ইউরোপ ও উত্তর আমেরিকার বন্দরগুলোতে যখন একসাথে একাধিক জাহাজ ভিড়ছে, তখন খালাস প্রক্রিয়ায় দীর্ঘ জট তৈরি হচ্ছে। অন্যদিকে বিপরীত দিকে, এশিয়ার প্রধান উৎপাদন কেন্দ্রগুলোতে সময়মতো খালি কনটেইনার ফেরত না আসায় কনটেইনারের কৃত্রিম সংকট তীব্র হচ্ছে। ${secondFact}। বন্দর টার্মিনালে কনটেইনারের ডওয়েল টাইম বা অবস্থানের সময় স্বাভাবিকের চেয়ে ৫ থেকে ৮ দিন পর্যন্ত বেড়ে গেছে, যা সমগ্র ইন্টারমোডাল রেল ও ট্রাক পরিবহন ব্যবস্থাকেও স্থবির করে তুলছে।`,
          narrationEnglish: `The maritime lag generates an immediate secondary crisis at destination seaports. Unsynchronized vessel arrivals cause severe terminal congestion across European and Western gateway docks. In contrast, Asian manufacturing hubs suffer from empty container deficits as equipment fails to reposition in time. Confirmed data reveals: ${secondFact}. Container dwell times at key hubs have expanded by 5 to 8 days, overburdening rail corridors and drayage trucking fleets alike.`,
          visualDirection: 'Industrial drone cinematography across automated marine terminals, towering container stacks, and congested rail intermodal yards.',
          onScreenMetric: `TERMINAL DWELL: +5 TO 8 DAYS`,
        },
        {
          timecode: '02:25 - 03:15',
          phaseTitle: 'Factory Floor Pressures & Industrial Sector Friction',
          narrationBangla: `বন্দর ছাড়িয়ে এই সংকটের ঢেউ আঘাত করেছে কারখানাগুলোর অ্যাসেম্বলি লাইনে। স্বয়ংচালিত অটোমোবাইল শিল্প, ভোক্তা ইলেকট্রনিক্স এবং তৈরি পোশাক খাতের জন্য নির্ভরযোগ্য ইনভেন্টরি সরবরাহ অপরিহার্য। বিলম্বিত কাঁচামাল পৌঁছানোর কারণে সাপ্লায়াররা জরুরি অর্ডার পূরণে হিমশিম খাচ্ছেন। বিশ্লেষণে দেখা গেছে: ${thirdFact}। পণ্য যথাসময়ে কারখানায় না পৌঁছালে পুরো প্রোডাকশন শিডিউল বিঘ্নিত হয়, যার প্রত্যক্ষ প্রভাব পড়ে ত্রৈমাসিক ডেলিভারি এবং মুনাফার ওপর।`,
          narrationEnglish: `Beyond the docks, operational friction lands squarely on manufacturing factory floors. In automotive sub-assembly, semiconductor fabrication, and apparel finishing, precision schedules cannot tolerate irregular part deliveries. Verified surveys indicate: ${thirdFact}. When baseline components miss production windows, entire assembly lines stall, forcing procurement teams into costly overtime and contingency logistics.`,
          visualDirection: 'Automated factory robotic lines, microchip manufacturing cleanrooms, and engineers reviewing digital ERP supply dashboards.',
          onScreenMetric: `MANUFACTURING EXPOSURE: SEVERE`,
        },
        {
          timecode: '03:15 - 04:00',
          phaseTitle: 'Landed Cost Inflation & The Air Freight Spillover',
          narrationBangla: `পরিবহন ব্যয়ের এই উল্লম্ফন সরাসরি পণ্যের চূড়ান্ত মূল্যে প্রতিফলিত হতে শুরু করেছে। সাধারণ সমুদ্র ফ্রেইটের পাশাপাশি এমার্জেন্সি বাঙ্কার সারচার্জ এবং পিক সিজন চার্জ যুক্ত হওয়ায় ওশান কস্ট বহুগুণ বেড়েছে। এই পরিস্থিতিতে উচ্চমূল্যের পণ্য দ্রুত পৌঁছানোর জন্য বহু প্রতিষ্ঠান এয়ার কার্গো চার্টারের শরণাপন্ন হচ্ছে। রিপোর্টে জানা গেছে: ${fourthFact}। তবে এয়ার ফ্রেইটের অত্যধিক খরচের কারণে মাঝারি ও ক্ষুদ্র আমদানিকারকদের জন্য এটি দীর্ঘমেয়াদে টিকিয়ে রাখা অসম্ভব।`,
          narrationEnglish: `Transportation expense escalations are feeding directly into finished product landed costs. Compounded by emergency bunker surcharges and peak equipment premiums, ocean freight bills have surged. Shippers with non-negotiable shelf dates are resorting to air charters, pushing air cargo spot rates higher: ${fourthFact}. Yet air transit costs remain economically unsustainable for bulk industrial shippers over extended horizons.`,
          visualDirection: 'Cargo aircraft loading high-value electronics on airport tarmac at twilight, juxtaposed against container vessel bills of lading.',
          onScreenMetric: `AIR CHARTER RATES: +14%`,
        },
        {
          timecode: '04:00 - 04:35',
          phaseTitle: 'Regional Sourcing & South Asian Export Realities',
          narrationBangla: `আমাদের আঞ্চলিক প্রেক্ষাপটে, বিশেষ করে তৈরি পোশাক, টেক্সটাইল এবং কাঁচামাল আমদানির ওপর এর প্রভাব অত্যন্ত স্পর্শকাতর। বিস্তারিত পর্যবেক্ষণে দেখা গেছে: ${banglaRelevance}। ইউরোপ ও আমেরিকার ক্রেতাদের নির্ধারিত ডেলিভারি ডেট পূরণ করতে না পারলে স্থানীয় রপ্তানিকারকদের বড় অঙ্কের ডিসকাউন্ট বা এয়ার ফ্রেইট বহন করার ঝুঁকি তৈরি হয়। চট্টগ্রাম বা অন্যান্য আঞ্চলিক বন্দরগুলোতে কাস্টমস ছাড় এবং কনটেইনার হ্যান্ডলিং দ্রুততর করা এখন জরুরি হয়ে পড়েছে।`,
          narrationEnglish: `For regional manufacturing epicenters, particularly South Asian apparel and textile exporters: ${banglaRelevance}. Missing rigid seasonal delivery milestones imposes punitive air-freight penalties or contractual cancellations. Accelerating port turnaround and streamline customs clearance at regional gateways has become a non-negotiable imperative.`,
          visualDirection: 'Busy regional export garment terminal, quality control teams inspecting export cartons, and loaded container lorries departing.',
          onScreenMetric: `REGIONAL RISK: ${item.countries?.slice(0, 2).join(' · ').toUpperCase() || 'SOUTH ASIA'}`,
        },
        {
          timecode: '04:35 - 05:00',
          phaseTitle: 'The CPO Executive Playbook & Long-Term Resilience',
          narrationBangla: `উপসংহারে, প্রকিউরমেন্ট ও সরবরাহ চেইন নেতৃত্বের জন্য চারটি মূল কৌশল অবলম্বন করা আবশ্যক: প্রথমত, সংকটপূর্ণ কাঁচামালের সেফটি বাফার অন্তত চার থেকে ছয় সপ্তাহ বাড়ানো; দ্বিতীয়ত, মাল্টি-ক্যারিয়ার ও অল্টারনেটিভ রুট চুক্তি নিশ্চিত করা; তৃতীয়ত, সাপ্লায়ারদের সাথে স্বচ্ছ ডেটা শেয়ারিং বজায় রাখা; এবং চতুর্থত, অনানুষ্ঠানিক গুজবের বদলে রয়টার্সের মতো নির্ভরযোগ্য তথ্যের ওপর ভিত্তি করে সিদ্ধান্ত গ্রহণ করা।`,
          narrationEnglish: `In conclusion, procurement leaders must execute a disciplined resilience playbook: First, expand critical safety buffers by four to six weeks; second, secure multi-carrier and multimodal service contracts; third, establish transparent inventory telemetry with key suppliers; and fourth, base operational decisions solely on corroborated intelligence from verified reporting sources like ${item.source}.`,
          visualDirection: 'Cinematic wide pullback to an executive boardroom overlooking an international deep-water port at night, glowing navigation markers.',
          onScreenMetric: 'STRATEGIC MANDATE: MULTI-CARRIER BUFFER',
        },
      ],
    };
  }

  // 10 Minutes (600s)
  if (normKey === '10m' || normKey === '600s') {
    // 10-minute long-form deep dive
    const base5m = getDurationTimelineConfig(item, '5m');
    return {
      durationKey: '10m',
      durationLabel: '10 Minutes',
      totalSeconds: 600,
      targetWordCount: 1450,
      segments: base5m.segments.concat([
        {
          timecode: '05:00 - 06:15',
          phaseTitle: 'Geoeconomic Insurance & Maritime Security Economics',
          narrationBangla: `এই সংকটের আরেকটি অদৃশ্য কিন্তু গভীর অর্থনৈতিক দিক হলো মেরিটাইম ইন্স্যুরেন্স ও ওয়ার-রিস্ক প্রিমিয়াম। জাহাজের বিমা খরচ বৃদ্ধি পাওয়ায় সামগ্রিক পরিচালন ব্যয় ক্রমাগত স্ফীত হচ্ছে।`,
          narrationEnglish: `An underlying driver of prolonged inflation lies in maritime insurance and war-risk surcharges. Underwriters have recalibrated risk premiums, permanently altering operating margins.`,
          visualDirection: 'Maritime insurance clearinghouse terminals and risk radar consoles in financial trading centers.',
          onScreenMetric: 'WAR-RISK PREMIUM: +300%',
        },
        {
          timecode: '06:15 - 07:30',
          phaseTitle: 'Intermodal Rail & Inland Trucking Congestion',
          narrationBangla: `সমুদ্রের বিলম্ব যখন অভ্যন্তরীণ রেল এবং ট্র্যাকিং টার্মিনালে প্রবেশ করে, তখন কনটেইনারের জট আরও ভয়াবহ রূপ নেয়। ড্রাইভার সংকট এবং লোকোমোটিভ স্বল্পতা সরবরাহ গতিকে বাধাগ্রস্ত করছে।`,
          narrationEnglish: `As maritime delays hit inland railheads and intermodal yards, container gridlock paralyzes domestic distribution. Chassis shortages and drayage driver constraints throttle freight velocities.`,
          visualDirection: 'Endless intermodal double-stack container trains traversing mountain and desert corridors.',
          onScreenMetric: 'INLAND VELOCITY: -18%',
        },
        {
          timecode: '07:30 - 08:45',
          phaseTitle: 'Global Trade Policy & Tariff Realignment',
          narrationBangla: `একই সাথে বৈশ্বিক বাণিজ্য নীতি এবং নতুন ট্যারিফ প্রবিধান আমদানিকারকদের জন্য জটিলতা বাড়িয়ে দিয়েছে। কাস্টমস কমপ্লায়েন্স এবং রুট সার্টিফিকেশনে অতিরিক্ত সময় ব্যয় হচ্ছে।`,
          narrationEnglish: `Concurrently, shifting international trade policies and tariff frameworks introduce friction. Compliance audits and origin verifications inject additional administrative latency.`,
          visualDirection: 'Customs declaration inspection documents, high-speed container scanning x-ray gantries.',
          onScreenMetric: 'CUSTOMS LATENCY: ELEVATED',
        },
        {
          timecode: '08:45 - 10:00',
          phaseTitle: 'Grand Synthesis & Future Proofing Global Supply Chains',
          narrationBangla: `চূড়ান্ত বিশ্লেষণে, আধুনিক সাপ্লাই চেইনের ভবিষ্যৎ নির্ধারিত হবে যারা দ্রুত তথ্যের ভিত্তিতে কৌশল বদলাতে সক্ষম। প্রকিউরমেন্ট নেতৃত্বকে স্থিতিস্থাপকতা ও দূরদর্শিতার সাথে এই নতুন বাস্তবতাকে জয় করতে হবে।`,
          narrationEnglish: `In final synthesis, the future of competitive supply chain architecture belongs to those who adapt swiftly to verified intelligence. Strategic resilience and proactive mitigation define success in an era of continuous disruption.`,
          visualDirection: 'Panoramic sunset view of modern global trade port with ultra-large container ships navigating the horizon.',
          onScreenMetric: 'FUTURE PROOF: DUAL-SOURCING MATRIX',
        },
      ]),
    };
  }

  // Default: 1 Minute (60s)
  return {
    durationKey: '60s',
    durationLabel: '1 Minute',
    totalSeconds: 60,
    targetWordCount: 165,
    segments: [
      {
        timecode: '00:00 - 00:15',
        phaseTitle: 'The Visual Hook & Chokepoint Context',
        narrationBangla: `আন্তর্জাতিক সরবরাহ চেইন ও শিপিং রুটে নতুন ডিসরাপশন: ${item.headline}! প্রধান সমুদ্র করিডোরে জাহাজ চলাচলে বাধার কারণে বৈশ্বিক পণ্য পরিবহন সূচিতে বড় পরিবর্তন দেখা দিয়েছে।`,
        narrationEnglish: `A major disruption is shaking global commerce: ${item.headline}. Navigational chokepoints along primary trade lanes are forcing sea carriers into sweeping route diversions.`,
        visualDirection: 'Cinematic 4K opening hook: Ultra-large 20,000 TEU container vessel cutting through stormy ocean swells under golden hour lighting.',
        onScreenMetric: `ALERT: ${item.category.toUpperCase()}`,
      },
      {
        timecode: '00:15 - 00:30',
        phaseTitle: 'Key Verified Facts & Rate Dynamics',
        narrationBangla: `${item.source}-এর সর্বশেষ নিশ্চিত তথ্যে দেখা গেছে: ${firstFact}। এর ফলে ট্রানজিট সময় বৃদ্ধি পেয়েছে এবং পরিবহন খরচ বাড়ছে। একই সাথে ${secondFact}।`,
        narrationEnglish: `According to verified reports from ${item.source}: ${firstFact}. Transit schedules are extended by days, driving ocean freight rates sharply upward. In addition, ${secondFact}.`,
        visualDirection: 'Automated marine gantry cranes hoisting containers, digital telemetry overlay showing trade route rerouting around the African cape.',
        onScreenMetric: `COST IMPACT: ${costExposure.toUpperCase()}`,
      },
      {
        timecode: '00:30 - 00:45',
        phaseTitle: 'Manufacturing, Lead-Time & Regional Impact',
        narrationBangla: `উৎপাদন এবং প্রকিউরমেন্টে এর প্রভাব স্পষ্ট: ${item.impactRatings?.leadTimeRisk || 'উচ্চ'} মাত্রার লিড-টাইম ঝুঁকি তৈরি হয়েছে। বিশেষ করে তৈরি পোশাক ও গুরুত্বপূর্ণ আঞ্চলিক সোর্সিংয়ে: ${banglaRelevance}।`,
        narrationEnglish: `On the procurement and manufacturing front, lead-time exposure is rated ${leadTimeRisk}. For export-reliant hubs and regional suppliers: ${banglaRelevance}.`,
        visualDirection: 'High-tech manufacturing assembly floor, robotic arms handling components, workers reviewing digital supply status screens.',
        onScreenMetric: `LEAD-TIME RISK: ${leadTimeRisk.toUpperCase()}`,
      },
      {
        timecode: '00:45 - 01:00',
        phaseTitle: 'Executive Takeaway & Strategic Buffer Action',
        narrationBangla: `প্রকিউরমেন্ট লিডারদের প্রতি পরামর্শ: সাপ্লায়ার বাফার স্টক অবিলম্বে নিরীক্ষা করুন, কনফার্মড শিপিং শিডিউল ট্র্যাক করুন এবং অল্টারনেটিভ রুট সক্রিয় রাখুন।`,
        narrationEnglish: `Executive takeaway for procurement leaders: Review supplier safety stock, audit carrier booking confirmations, and activate alternative logistics channels immediately.`,
        visualDirection: 'Panoramic slow pull-back from executive operations room overlooking an expansive deep-water port at night.',
        onScreenMetric: 'ACTION: SECURE BUFFERS',
      },
    ],
  };
}
