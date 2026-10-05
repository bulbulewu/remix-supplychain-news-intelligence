import React, { useState } from 'react';
import {
  X,
  Printer,
  Copy,
  Download,
  Check,
  FileText,
  Sparkles,
  Loader2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { IntelligenceDataset } from '../types/news';

interface ExecutiveBriefModalProps {
  dataset: IntelligenceDataset;
  onClose: () => void;
  isDark: boolean;
}

export const ExecutiveBriefModal: React.FC<ExecutiveBriefModalProps> = ({
  dataset,
  onClose,
  isDark,
}) => {
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [briefData, setBriefData] = useState<any>(null);

  React.useEffect(() => {
    // Generate or fetch brief
    const fetchBrief = async () => {
      setIsGenerating(true);
      try {
        const res = await fetch('/api/news/executive-brief', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dataset }),
        });
        const json = await res.json();
        if (json.success) {
          setBriefData(json.data);
        }
      } catch (e) {
        console.error('Error loading brief:', e);
      } finally {
        setIsGenerating(false);
      }
    };
    fetchBrief();
  }, [dataset]);

  const top5 = briefData?.top5Events || dataset.top10Things.slice(0, 5);

  const handleCopyClipboard = () => {
    const text = `
GLOBAL SUPPLY CHAIN & PROCUREMENT INTELLIGENCE
DAILY EXECUTIVE BRIEFING — ${new Date().toLocaleDateString()}

EXECUTIVE SYNTHESIS:
${briefData?.executiveSummary || 'Key supply chain shifts across ocean freight, tariffs, and critical minerals.'}

TOP 5 CONVENTIONAL DEVELOPMENTS:
${top5.map((t: any, idx: number) => `${idx + 1}. ${t.headline}\n   Why it matters: ${t.whyItMatters || t.summary}\n   Source: ${t.source}`).join('\n\n')}

KEY SUPPLY CHAIN RISKS:
${(briefData?.keySupplyChainRisks || []).map((r: string) => `• ${r}`).join('\n')}

PROCUREMENT & SOURCING RISKS:
${(briefData?.procurementRisks || []).map((r: string) => `• ${r}`).join('\n')}

WHAT TO WATCH (NEXT 24–72 HOURS):
${dataset.watchNext.map((w) => `• ${w.title}: ${w.expectedEvent} (${w.timeframe})`).join('\n')}

Synthesized by SupplyChain News Intelligence Terminal
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(briefData || dataset, null, 2));
    const a = document.createElement('a');
    a.setAttribute('href', dataStr);
    a.setAttribute('download', `SupplyChain_Executive_Brief_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleDownloadCSV = () => {
    const rows = [
      ['Rank', 'Headline', 'Why It Matters', 'Source', 'Priority Score'],
      ...top5.map((t: any, idx: number) => [
        idx + 1,
        `"${(t.headline || '').replace(/"/g, '""')}"`,
        `"${(t.whyItMatters || '').replace(/"/g, '""')}"`,
        `"${t.source || ''}"`,
        t.priorityScore || 90,
      ]),
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const a = document.createElement('a');
    a.setAttribute('href', encodeURI(csvContent));
    a.setAttribute('download', `SupplyChain_Top5_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div
        className={`w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden transition-all print:max-w-none print:max-h-none print:shadow-none print:border-none ${
          isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Daily Executive Briefing</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Printable C-suite supply chain & procurement risk report
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyClipboard}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                isDark ? 'border-slate-800 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={handlePrint}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                isDark ? 'border-slate-800 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-slate-800 dark:text-slate-200 text-xs sm:text-sm print:p-0">
          {/* Document Masthead */}
          <div className="pb-4 border-b-2 border-slate-900 dark:border-slate-100 flex flex-col sm:flex-row justify-between sm:items-end gap-2">
            <div>
              <div className="text-[10px] font-mono tracking-widest text-blue-600 dark:text-blue-400 uppercase font-bold">
                SupplyChain News Intelligence · CPO Briefing
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mt-1">
                Global Supply Chain Intelligence Brief
              </h1>
            </div>
            <div className="text-xs font-mono text-slate-500 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>

          {isGenerating && (
            <div className="py-8 flex items-center justify-center gap-2 text-slate-500 font-mono text-xs">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <span>Synthesizing latest CPO briefing...</span>
            </div>
          )}

          {/* Executive Summary */}
          <div>
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400 mb-2">
              01. Executive Synthesis
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
              {briefData?.executiveSummary || 'Commercial maritime diversions around the Cape of Good Hope and expanded semiconductor export licensing represent the primary operational headwinds this period, driving ocean rate premiums and requiring multi-tier supplier audit compliance.'}
            </p>
          </div>

          {/* Top 5 Events */}
          <div>
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400 mb-3">
              02. Top 5 Consequential Developments
            </h3>
            <div className="space-y-3">
              {top5.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1">
                    <span className="font-bold text-blue-600 dark:text-blue-400">EVENT #{idx + 1}</span>
                    <span>{item.source}</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
                    {item.headline}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.whyItMatters || item.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Vectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-2">
                Key Procurement & Cost Risks
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                {(briefData?.procurementRisks || [
                  'Ocean carrier General Rate Increases (GRI) and bunker surcharges.',
                  'Section 301 tariff duty escalation on battery and clean-tech components.',
                  'Refined copper wire rod premiums rising on smelter cuts.'
                ]).map((r: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2">
                Key Logistics & Transit Risks
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                {(briefData?.logisticsRisks || [
                  'US West Coast rail equipment availability tightening under diverted volumes.',
                  'South Asian feeder ship connections experiencing container turnaround delays.',
                  'European intermodal rail bottlenecks during autumn manufacturing peak.'
                ]).map((r: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* What to Watch */}
          <div>
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400 mb-2">
              03. Next 24–72 Hours Horizon Watch
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {dataset.watchNext.map((w, idx) => (
                <div key={idx} className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{w.title}: </span>
                  <span className="text-slate-600 dark:text-slate-300">{w.expectedEvent}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60 print:hidden text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium"
            >
              <Download className="w-3.5 h-3.5 text-blue-500" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handleDownloadJSON}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium"
            >
              <Download className="w-3.5 h-3.5 text-indigo-500" />
              <span>Export JSON</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold hover:opacity-90 transition-opacity"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Done</span>
          </button>
        </div>
      </div>
    </div>
  );
};
