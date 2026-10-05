import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Search,
  Clapperboard,
  Sparkles,
  Zap,
  CheckCircle2,
  Clock,
  MapPin,
  SlidersHorizontal,
  Download,
  Copy,
  Check,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  FileText,
  RefreshCw
} from 'lucide-react';

interface BanglaReadmeModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

export const BanglaReadmeModal: React.FC<BanglaReadmeModalProps> = ({
  isOpen,
  onClose,
  isDark,
}) => {
  const [activeSection, setActiveSection] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleDownloadReadme = () => {
    fetch('/README_BANGLA.md')
      .then((res) => res.text())
      .then((text) => {
        const element = document.createElement('a');
        const file = new Blob([text], { type: 'text/markdown;charset=utf-8' });
        element.href = URL.createObjectURL(file);
        element.download = 'README_BANGLA.md';
        document.body.appendChild(element);
        element.click();
        element.remove();
      })
      .catch((err) => console.error('Download error:', err));
  };

  const SECTIONS = [
    {
      id: 'dashboard',
      icon: <FileText className="w-4 h-4 text-blue-500" />,
      title: '১. ড্যাশবোর্ড ও শীর্ষ ১০ সংবাদ',
      content: `
### ড্যাশবোর্ড পরিচিতি (Dashboard Overview)
- **লাইভ নিউজ উইন্ডো (News Window)**: স্ক্রিনের একেবারে উপরে লাইভ বার দেখতে পাবেন। '6h', '12h', '24h', '48h', '72h', '7d' বোতামে ক্লিক করে নির্দিষ্ট সময়ের সংবাদের ডেটাসেট রিফ্রেশ করতে পারেন।
- **টপ ১০ থিংস টু নো (Top 10 Things to Know Today)**:
  - দিনের সবচেয়ে গুরুত্বপূর্ণ ১০টি বাণিজ্যিক ও লজিস্টিকস ঘটনা সরাসরি র‍্যাংক (#01 থেকে #10) অনুযায়ী সাজানো থাকে।
  - প্রতিটি কার্ডে সংবাদ শিরোনাম, প্রকাশক (WSJ, Bloomberg, Reuters ইত্যাদি), কেন গুরুত্বপূর্ণ (Why it matters), এবং স্কোর (Score 0-100) প্রদর্শিত হয়।
  - কার্ডে ভিডিও তৈরি হয়েছে কিনা তা সরাসরি সবুজ ব্যাজে দেখা যায়: '✓ Video Created · তারিখ'।
  - তৈরি বাকি থাকলে '⏳ Video Pending' ব্যাজ থাকবে।

### আঞ্চলিক ঝুঁকি হিটম্যাপ (Regional Risk Heatmap)
- **Recharts ভিত্তিক হিটম্যাপ ভিজ্যুয়ালাইজেশন**: উচ্চ-ঝুঁকিপূর্ণ প্রকিউরমেন্ট অ্যালার্টের ঘনত্ব অনুযায়ী দেশগুলোকে রিয়েল-টাইমে হাইলাইট করে।
- **ট্রি-ম্যাপ ভিউ (Heatmap Tiles)**: দেশগুলোর আয়তন অ্যালার্ট ভলিউম এবং রঙ প্রকিউরমেন্ট ঝুঁকির তীব্রতা (লাল = ক্রিটিক্যাল, অ্যাম্বার = হাই, নীল = মডারেট) নির্দেশ করে।
- **র‍্যাংকিং ও কার্ভ চার্ট**: টপ ১২টি দেশের ক্রিটিক্যাল বনাম হাই ইমপ্যাক্ট অ্যালার্টের স্ট্যাকড বার এবং রিস্ক ইনডেক্স কার্ভ।
- **১-ক্লিক দেশ ড্রিল-ডাউন**: যেকোনো দেশের ওপর ক্লিক করলে সেই দেশের সব প্রকিউরমেন্ট ডিজরাপশন স্টোরি ভেসে ওঠে এবং সেখান থেকে সরাসরি 'Read Analysis', 'Video Brief' বা 'Master Prompt' তৈরি করা যায়।

### ইমপ্যাক্ট ফোরকাস্ট (Impact Forecast: ৩০ দিনের প্রকিউরমেন্ট ট্রেন্ড)
- **বিগত ৩০ দিনের হিস্টোরিক্যাল ট্রেন্ড**: Recharts এরিয়া চার্ট দিয়ে প্রকিউরমেন্ট ইমপ্যাক্ট স্কোর, লিড টাইম ডিলে (+দিন) এবং ল্যান্ডেড কস্ট বৃদ্ধির শতাংশের ধারাবাহিক চিত্র।
- **+৭ দিনের প্রেডিক্টিভ মডেলিং**: আগামী ৭ দিনের প্রকিউরমেন্ট ঝুঁকির পূর্বাভাস (৯৫% কনফিডেন্স করিডোরসহ)।
- **দৈনিক ড্রিল-ডাউন ও ডিরেক্টিভ**: নির্দিষ্ট দিনে ক্লিক করে ম্যাক্রো ইভেন্ট ও প্রস্তাবিত প্রকিউরমেন্ট অ্যাকশন দেখা এবং ১-ক্লিকে ভিডিও ব্রিফ তৈরি করা যায়।
- **ফরওয়ার্ড ক্যাটালিস্ট ক্যালেন্ডার**: আগামী ৭–১৪ দিনের গুরুত্বপূর্ণ অর্থনৈতিক ও বন্দর ইভেন্টের আগাম ট্র্যাকিং।

### ব্রাউজার এক্সটেনশন ডাউনলোড ও অটো-আপডেট (Browser Extension)
- **অবস্থান**: স্ক্রিনের উপরে ডানপাশে **Refresh News** বোতামের ঠিক উপরে **[Download Extension]** বোতাম রয়েছে।
- **অল-ব্রাউজার কম্প্যাটিবিলিটি**: Chrome, Edge, Brave, Opera, Firefox, Safari সবার জন্য ফুল ফাংশনাল Manifest V3 এক্সটেনশন জিপ।
- **স্বয়ংক্রিয় ক্লাউড সিঙ্ক**: আপনি যখনই এই ওয়েব অ্যাপে কোনো নতুন আপডেট বা পরিবর্তন আনবেন, এক্সটেনশনটি স্বয়ংক্রিয়ভাবে সেই আপডেটগুলো দেখাবে, পুনরায় রি-ইনস্টল করতে হবে না।
- **টুলবার পপআপ ও সাইড প্যানেল**: পপআপে পুরো টার্মিনাল চালানো যায় কিংবা ব্রাউজারের সাইড প্যানেলে ডক করে সার্বক্ষণিক ঝুঁকি পর্যবেক্ষণ করা যায়।
      `,
    },
    {
      id: 'templates',
      icon: <Clapperboard className="w-4 h-4 text-rose-500" />,
      title: '২. ভিডিও ব্রিফ ও কাস্টম স্ক্রিপ্ট টেমপ্লেট',
      content: `
### ভিডিও ব্রিফ স্টুডিও (Fact-Locked Video Brief Studio)
যেকোনো সংবাদের কার্ডে **[Create Video Brief]** বা **[Brief]** বোতামে ক্লিক করলে এই স্টুডিও ওপেন হবে।

### কাস্টম স্ক্রিপ্ট টেমপ্লেট (Custom Script Templates)
আপনার পছন্দসই উপস্থাপনা শৈলী (Tone) অনুযায়ী একাধিক টেমপ্লেট রয়েছে:

1. **Hard-Hitting Financial (আর্থিক ক্ষতি ও মার্জিন কেন্দ্রিক)**:
   - এটি ব্লুমবার্গ বা ওয়াল স্ট্রিট জার্নাল স্টাইলে তৈরি।
   - সরাসরি আর্থিক ক্ষতি, ডলারের সংখ্যা, কন্টেইনার ফ্রেইট রেটের শতকরা বৃদ্ধি, শুল্কের হার এবং গ্রস মার্জিন সংকোচনের ওপর জোর দেয়।
   - সি-স্যুট (C-Suite), ফাইন্যান্স ডিরেক্টর ও প্রকিউরমেন্ট ম্যানেজারদের জন্য উপযোগী।

2. **Casual Summary (সহজ ও সাবলীল উপস্থাপনা)**:
   - অত্যন্ত সাধারণ, প্রাণবন্ত ও সহজবোধ্য কথোপকথনের ভঙ্গিতে লেখা।
   - কোনো জটিল টেকনিক্যাল শব্দ থাকে না। সাধারণ দর্শকের বোঝার সুবিধার্থে বাস্তব জীবনের সহজ উপমা ব্যবহার করা হয়।
   - ইউটিউব সাধারণ দর্শক, টিকটক ও ফেসবুক রিলসের জন্য চমৎকার।

3. **Investigative Logistics (অনুসন্ধানী লজিস্টিকস)**:
   - সমুদ্রপথের জাহাজ জট, বন্দরগুলোর কন্টেইনার ডুয়েলিং টাইম, খালি কন্টেইনার সংকট ও বিকল্প রুটের গভীরে গিয়ে অনুসন্ধানী বিশ্লেষণ।

4. **Fast-Paced Viral (শর্টস ও রিলসের জন্য)**:
   - ৩ সেকেন্ডের আকর্ষণীয় হুক দিয়ে শুরু হয়। প্রতি লাইনে নতুন তথ্য থাকে, কোনো বাড়তি কথা ছাড়া দ্রুতগতির দৃশ্যপট।

5. **Bangladesh RMG & Sourcing Focus**:
   - চট্টগ্রাম বন্দরের ডুয়েলিং টাইম, পোশাক কারখানার কাঁচামাল (তুলা/সুতা) আমদানি খরচ এবং ইউরোপ-আমেরিকার বায়ারদের অর্ডার পরিস্থিতিকে প্রাধান্য দেয়।

### কাস্টম টেমপ্লেট সেভ ও লোড করার নিয়ম:
- **টেমপ্লেট লোড করা**: ড্রপডাউন থেকে পছন্দের টেমপ্লেট নির্বাচন করুন। নিয়মাবলি স্বয়ংক্রিয়ভাবে লোড হবে এবং **[Regenerate]** চাপলে সেই টোনে স্ক্রিপ্ট তৈরি হবে।
- **নতুন টেমপ্লেট সেভ করা**: **[+ Save as New Template]** বোতামে ক্লিক করে নিজের পছন্দমতো নাম, টোন ও স্টাইল গাইড লিখে সেভ করে রাখুন। এটি ব্রাউজারে স্থায়ীভাবে সংরক্ষিত থাকবে।
      `,
    },
    {
      id: 'durations',
      icon: <Clock className="w-4 h-4 text-purple-500" />,
      title: '৩. ভিডিও সময়সীমা (30s, 1m, 3m, 5m)',
      content: `
### ভিডিও সময়সীমা ও শব্দের লক্ষ্যমাত্রা:

- **৩০ সেকেন্ড (30 Seconds / 30s)**:
  - লক্ষ্যমাত্রা: ~৮০টি কথিত শব্দ (Spoken Words)।
  - প্ল্যাটফর্ম: YouTube Shorts, Instagram Reels, TikTok।
  - বৈশিষ্ট্য: ৩ সেকেন্ডের চোখ ধাঁধানো হুক, মূল ১টি ফ্যাক্ট ও দ্রুত কল-টু-অ্যাকশন।

- **১ মিনিট (1 Minute / 1m / 60s)**:
  - লক্ষ্যমাত্রা: ~১৬০টি শব্দ।
  - প্ল্যাটফর্ম: Shorts, Reels, LinkedIn, Facebook।
  - বৈশিষ্ট্য: ৪টি সুস্পষ্ট ধাপ—হুক, ব্যাকগ্রাউন্ড, প্রকিউরমেন্ট প্রভাব ও অ্যাকশন।

- **৩ মিনিট (3 Minutes / 3m)**:
  - লক্ষ্যমাত্রা: ~৪৬০টি শব্দ।
  - প্ল্যাটফর্ম: YouTube Main Video, Facebook Video।
  - বৈশিষ্ট্য: বিস্তারিত ইন-ডেপথ ব্রডকাস্ট ডাইজেস্ট, ডাটা কলআউট ও সম্পূর্ণ টাইমলাইন।

- **৫ মিনিট (5 Minutes / 5m)**:
  - লক্ষ্যমাত্রা: ~৭৮০টি শব্দ।
  - প্ল্যাটফর্ম: Full Documentary Video, LinkedIn Pulse।
  - বৈশিষ্ট্য: ৫টি বিশদ অধ্যায় সংবলিত অনুসন্ধানী তথ্যচিত্র।

*ব্রিফ মডালে Duration ড্রপডাউন থেকে ৩০ সে., ১ মি., ৩ মি. বা ৫ মি. ক্লিক করলেই পুরো স্ক্রিপ্ট স্বয়ংক্রিয়ভাবে সেই সময়ের টাইমকোড অনুযায়ী রি-জেনারেট হয়।*
      `,
    },
    {
      id: 'masterPrompt',
      icon: <Sparkles className="w-4 h-4 text-amber-500" />,
      title: '৪. মাস্টার ভিডিও প্রম্পট (Sora, Runway, Kling)',
      content: `
### মাস্টার ভিডিও প্রম্পট (Master Video Prompt)
AI ভিডিও জেনারেটর (OpenAI Sora, Runway Gen-3, Kling AI, Luma Dream Machine, InVideo) ব্যবহারকারীদের জন্য এই ফিচারটি তৈরি।

- **একক বিস্তারিত প্রম্পট (Single Monolithic Prompt)**: খণ্ড খণ্ড দৃশ্য নয়, সম্পূর্ণ ভিডিওর জন্য একটি একক শক্তিশালী সমন্বিত প্রম্পট।
- **সর্বোচ্চ ৪,৯০০ অক্ষরের নিয়ম (Strict 4,900 Chars Limit)**: AI ভিডিও জেনারেটরের গ্রহণযোগ্য সীমা মেনে ৪,৯০০ অক্ষরের নিচে কঠোরভাবে সীমাবদ্ধ রাখা হয়েছে যাতে কোনো তথ্য কাটছাঁট না হয়।
- **সিনেমাটোগ্রাফি ও ভিজ্যুয়াল স্টাইল**: Cinematic Documentary (ARRI 4K), Hyper-Realistic Broadcast, Drone Aerial Logistics ইত্যাদি স্টাইল বেছে নেওয়া যায়।
- **টাইমলাইন স্ক্রিপ্ট সংযুক্ত**: নির্বাচিত সময় (30s, 1m, 3m, 5m) অনুযায়ী টাইমকোডসহ সম্পূর্ণ ভয়েসওভার স্ক্রিপ্ট প্রম্পটের ভেতরেই সাজানো থাকে।
- **১-ক্লিক কপি**: [Copy Master Prompt] বোতামে ক্লিক করে সরাসরি আপনার প্রিয় AI টুলে পেস্ট করুন।
      `,
    },
    {
      id: 'quickread',
      icon: <Zap className="w-4 h-4 text-amber-500" />,
      title: '৫. কুইক রিড সেশন স্ট্যাক (Quick Read Stack)',
      content: `
### কুইক রিড সেশন স্ট্যাক (Quick Read Stack)
কাজের সুবিধার জন্য আপনি মূল ফিড থেকে বাছাই করা খবরগুলো আলাদা একটি অস্থায়ী তালিকায় জমা করে রাখতে পারেন:

- **সংবাদ যোগ করার নিয়ম**: প্রতিটি নিউজ কার্ডে **[+ Quick Read]** বোতাম রয়েছে। ক্লিক করলেই খবরটি আপনার বর্তমান সেশনের রিডিং স্ট্যাকে চলে যাবে।
- **তাত্ক্ষণিক দৃশ্যমান পরিবর্তন**: কার্ডে সঙ্গে সঙ্গে **[In Stack]** (হলুদ অ্যাম্বার রঙে) দেখা যাবে।
- **ভাসমান বোতাম (Floating Button)**: স্ক্রিনের নিচের ডান কোনায় **Quick Read Stack (N)** পিল দেখা যাবে, যেখানে ক্লিক করে যেকোনো সময় সাইড-ড্রয়ার ওপেন করে সব জমানো খবর পড়া যায়।
- **স্ট্রীম ফিল্টার**: মূল ফিডের ওপরের ব্যানারে **[Filter Stream to Stack]** বোতামে চাপ দিলে শুধু আপনার বাছাই করা খবরগুলোই স্ক্রিনে থাকবে।
- **সেশন শেষে ক্লিয়ার**: সেশন শেষ হলে বা কাজ সম্পন্ন হলে ড্রয়ার থেকে **[Clear Stack]** দিয়ে তালিকা খালি করা যায়।
      `,
    },
    {
      id: 'tracking',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
      title: '৬. ভিডিও তৈরি ট্র্যাকিং ও তারিখ সংরক্ষণ',
      content: `
### ভিডিও তৈরি ট্র্যাকিং (Video Creation Tracker)
প্রতিদিন খবর পরিবর্তিত হলেও আপনি কোন খবরের ওপর ভিডিও তৈরি করেছেন তা মনে রাখার নির্ভরযোগ্য ব্যবস্থা:

1. **কার্ডে সরাসরি দেখা যায়**:
   - কোনো খবরের ভিডিও তৈরি করা হলে কার্ডের উপরে স্পষ্ট সবুজ ব্যাজ থাকে: '✓ Video Created · Oct 4, 2026'।
   - কার্ডে কোন কোন ফরম্যাটের ভিডিও তৈরি হয়েছে তার পিল দেখা যায় (যেমন: '✓ 30s', '✓ 1m')।
   - যেগুলোর ভিডিও এখনও হয়নি সেগুলোতে '⏳ Video Pending' ব্যাজ থাকে।
2. **১-ক্লিকে মার্ক করার নিয়ম**:
   - প্রতিটি কার্ডের নিচের বারে [30s], [1m], [3m], [5m] পিল রয়েছে। যেকোনো একটিতে ক্লিক করলেই আজকের তারিখে সেই ফরম্যাটটি তৈরি হিসেবে মার্ক হয়ে যাবে।
   - অথবা ভিডিও ব্রিফ বা মাস্টার প্রম্পট উইন্ডো থেকেও **[Mark as Video Created]** বোতাম চেপে মার্ক করা যায়।
3. **পেন্ডিং ও ক্রিয়েটেড ফিল্টার**:
   - টপ ১০ সেকশনে ও ফিল্টার বারে **[Pending Video]** এবং **[Created]** ফিল্টার রয়েছে। **[Pending Video]**-তে ক্লিক করলে শুধুমাত্র যেগুলোর ভিডিও এখনও বানাননি সেগুলো স্ক্রিনে ভেসে উঠবে।
4. **ভিডিও হিস্ট্রি মোডাল**:
   - উপরের মেনুবারে **[Videos Created]** বোতামে ক্লিক করে অতীত ও বর্তমানের সকল তৈরি করা ভিডিওর তালিকা ও তারিখ একসাথে দেখা যাবে।
      `,
    },
    {
      id: 'bangladesh',
      icon: <MapPin className="w-4 h-4 text-emerald-600" />,
      title: '৭. বাংলাদেশ সোর্সিং ও পোশাক খাত মনিটরিং',
      content: `
### বাংলাদেশ ইন্টেলিজেন্স সেন্টার (Bangladesh Sourcing Focus)
টার্মিনালের **Bangladesh Impact** ট্যাবে ক্লিক করলে বাংলাদেশের আমদানি-রপ্তানি সংক্রান্ত বিশেষায়িত তথ্য পাওয়া যায়:

- **তৈরি পোশাক খাত (RMG)**: নিটওয়্যার ও ওভেন পোশাকের বৈশ্বিক চাহিদা, পশ্চিমা রিটেইলারদের অর্ডার ফ্লো।
- **কাঁচামাল সরবরাহ**: কাঁচা তুলা (Raw Cotton) ও সুতার আন্তর্জাতিক বাজারদর এবং সরবরাহ অবস্থা।
- **চট্টগ্রাম বন্দর পরিস্থিতি**: চট্টগ্রাম বন্দরের কনটেইনার টার্নঅ্যারাউন্ড ও কন্টেইনার ডুয়েলিং টাইম (Dwell Time)।
- **জ্বালানি ও বিদ্যুৎ সরবরাহ**: শিল্পাঞ্চলের গ্যাস-বিদ্যুৎ ও উৎপাদন সক্ষমতা।
      `,
    },
    {
      id: 'search',
      icon: <SlidersHorizontal className="w-4 h-4 text-blue-500" />,
      title: '৮. সার্চ, ফিল্টার ও সেটিংস',
      content: `
### সার্চ ও ফিল্টারিং ব্যবস্থা:
- **টপিক সার্চ**: উপরের সার্চ বারে যেকোনো শব্দ (যেমন: *Red Sea*, *Copper*, *Bangladesh RMG*, *Tariffs*) লিখে সার্চ দিলে মুহূর্তেই প্রাসঙ্গিক খবরগুলো চলে আসে।
- **ক্যাটাগরি ও রিজিয়ন ফিল্টার**: Shipping, Tariffs, Logistics, Commodities, Energy ইত্যাদি ক্যাটাগরি এবং South Asia, North America, Europe ইত্যাদি অঞ্চল অনুযায়ী ফিল্টার করুন।
- **প্রায়োরিটি স্লাইডার**: ০ থেকে ৮৫ পর্যন্ত সর্বনিম্ন স্কোর নির্বাচন করে শুধুমাত্র অতীব গুরুত্বপূর্ণ খবরগুলো দেখতে পারবেন।
- **থিম পরিবর্তন**: উপরের ডানদিকের সূর্য ☀️ বা চাঁদ 🌙 আইকনে ক্লিক করে ডার্ক মোড ও লাইট মোডের মধ্যে পরিবর্তন করুন।
      `,
    },
    {
      id: 'failover',
      icon: <RefreshCw className="w-4 h-4 text-emerald-500" />,
      title: '৯. লিমিট শেষ হলে অটো-সুইচ (Auto-Failover) ও ফ্রি এপিআই সিরিয়াল সাজানো',
      content: `
### এক প্রোভাইডারের লিমিট শেষ হলে কি অন্য প্রোভাইডারে স্বয়ংক্রিয়ভাবে সুইচ করবে?
**হ্যাঁ, শতভাগ স্বয়ংক্রিয়ভাবে!**
যখন কোনো সার্চ প্রোভাইডার বা এআই মডেল তার ফ্রি লিমিট বা কোটা অতিক্রম করে (HTTP 429 Too Many Requests, Quota Exceeded, Credits Exhausted), তখন সিস্টেমটি সাথে সাথে আপনার সাজানো সিরিয়াল অনুযায়ী পরবর্তী প্রোভাইডারে (১ম ➔ ২য় ➔ ৩য়) স্বয়ংক্রিয়ভাবে সুইচ করে ডেটা নিয়ে আসে। কোনো কাজ আটকে থাকবে না!

### কোন কোন ফ্রি সার্চ এপিআই যোগ করা যাবে?
এক্সটেনশনের **⚙️ Settings > Free Search APIs** ট্যাবে নিচের ফ্রি এপিআইগুলো যুক্ত করতে পারবেন:
1. **Tavily Search API**: মাসে ১,০০০ ফ্রি রিকোয়েস্ট (তৈরি করুন: app.tavily.com)
2. **Serper.dev Google News**: ২,৫০০ ফ্রি গুগল সার্চ কোয়েরি (তৈরি করুন: serper.dev)
3. **Brave Search API**: মাসে ২,০০০ ফ্রি প্রাইভেট সার্চ (তৈরি করুন: brave.com/search/api)
4. **Exa Neural Search**: ১,০০০ ফ্রি সার্চ ($১০ ক্রেডিট, তৈরি করুন: dashboard.exa.ai)
5. **Firecrawl API**: ৫০০ ফ্রি ওয়েবসাইট স্ক্র্যাপ ক্রেডিট (তৈরি করুন: firecrawl.dev)
6. **Google Gemini Search Grounding**: জেমিনির ফ্রি টিয়ারে স্বয়ংক্রিয়ভাবে অন্তর্ভুক্ত।

### কীভাবে ১ম, ২য়, ৩য় সিরিয়াল সাজাবেন?
১. এক্সটেনশনের উপরে ডানদিকের **⚙️ Settings** বোতামে ক্লিক করুন।
২. **🔍 Free Search APIs & Serial Waterfall** ট্যাবে যান।
৩. প্রতিটি সার্চ ইঞ্জিনের পাশে থাকা **▲ (উপরে)** এবং **▼ (নিচে)** বোতাম ব্যবহার করে আপনার পছন্দমতো সিরিয়াল সাজান (যেমন: ১ম Tavily ➔ ২য় Serper ➔ ৩য় Brave ➔ ৪র্থ Exa ➔ ৫ম Firecrawl ➔ ৬ষ্ঠ Gemini)।
৪. কোনো কারণে ১ নম্বর ইঞ্জিনের ফ্রি কোটা শেষ হয়ে গেলে এটি সাথে সাথে ২ নম্বর এবং এরপর ৩ নম্বরে সুইচ করবে।
৫. একইভাবে **🤖 AI Models & 429 Failover** ট্যাবে গিয়ে এআই মডেলের সিরিয়ালও সাজাতে পারবেন (Gemini ➔ Groq ➔ OpenRouter ➔ Cerebras ➔ Grok ➔ OpenAI)।
৬. শেষে **Save All Settings** এ ক্লিক করলেই পুরো সিস্টেম সক্রিয় হয়ে যাবে!
      `,
    },
  ];

  const filteredSections = SECTIONS.filter((sec) => {
    if (activeSection !== 'all' && sec.id !== activeSection) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      sec.title.toLowerCase().includes(q) ||
      sec.content.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div
        className={`w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden my-auto transition-all ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4 bg-slate-50/50 dark:bg-slate-950/40">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-sm shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  🇧🇩 ব্যবহার নির্দেশিকা (USER GUIDE)
                </span>
                <span className="text-xs text-slate-500 font-mono">বাংলা সংস্করণ</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight">
                সাপ্লাই চেইন ইন্টেলিজেন্স টার্মিনাল — প্রতিটি অপশন ব্যবহারের নিয়ম
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                কীভাবে সংবাদ বিশ্লেষণ করবেন, কাস্টম স্ক্রিপ্ট টেমপ্লেট ব্যবহার করবেন এবং প্রতিদিন ভিডিও তৈরি ট্র্যাক করবেন
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadReadme}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                isDark
                  ? 'border-slate-700 hover:bg-slate-800 text-slate-300'
                  : 'border-slate-300 hover:bg-slate-100 text-slate-700'
              }`}
              title="README_BANGLA.md ফাইলটি ডাউনলোড করুন"
            >
              <Download className="w-3.5 h-3.5 text-blue-500" />
              <span className="hidden sm:inline">ডাউনলোড README</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar & Search */}
        <div className={`p-3 sm:px-5 border-b flex flex-wrap items-center justify-between gap-3 text-xs ${
          isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50/80 border-slate-200'
        }`}>
          {/* Quick Search */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="নির্দেশিকায় খুঁজুন (যেমন: 'টেমপ্লেট', '30s', 'মাস্টার প্রম্পট', 'কুইক রিড')..."
              className={`w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors ${
                isDark
                  ? 'bg-slate-900 border-slate-700 text-slate-200 placeholder-slate-500'
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>

          {/* Quick Topic Filter Pills */}
          <div className="flex flex-wrap items-center gap-1">
            <button
              onClick={() => setActiveSection('all')}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                activeSection === 'all'
                  ? 'bg-emerald-600 text-white font-bold'
                  : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              সব অধ্যায়
            </button>
            {SECTIONS.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                  activeSection === sec.id
                    ? 'bg-emerald-600 text-white font-bold'
                    : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {sec.title.split('.')[1]?.trim().split(' ')[0] || sec.title}
              </button>
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {filteredSections.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              '{searchQuery}' সম্পর্কিত কোনো নির্দেশনা পাওয়া যায়নি।{' '}
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveSection('all');
                }}
                className="text-emerald-500 font-bold hover:underline ml-1"
              >
                সব অধ্যায় দেখুন
              </button>
            </div>
          ) : (
            filteredSections.map((sec) => (
              <div
                key={sec.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  isDark
                    ? 'bg-slate-950/40 border-slate-800'
                    : 'bg-slate-50/50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-3 pb-2 border-b border-slate-200/60 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 shrink-0">
                      {sec.icon}
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-emerald-700 dark:text-emerald-400">
                      {sec.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => handleCopy(sec.content, sec.id)}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    title="এই অধ্যায় কপি করুন"
                  >
                    {copiedSection === sec.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-500">কপি হয়েছে!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>কপি</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-2 whitespace-pre-line font-sans">
                  {sec.content.trim()}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400">
            সম্পূর্ণ ম্যানুয়াল README_BANGLA.md ফাইলে সংরক্ষিত রয়েছে।
          </span>
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors shadow-xs cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>বুঝেছি / বন্ধ করুন</span>
          </button>
        </div>
      </div>
    </div>
  );
};
