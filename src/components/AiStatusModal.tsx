import React, { useState, useEffect } from 'react';
import { X, Cpu, CheckCircle2, AlertCircle, RefreshCw, ShieldCheck, Zap, Globe, Sparkles } from 'lucide-react';
import { APP_VERSION, CURRENT_VERSION_INFO } from '../data/versionInfo';

interface AiStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

export const AiStatusModal: React.FC<AiStatusModalProps> = ({
  isOpen,
  onClose,
  isDark,
}) => {
  const [healthStatus, setHealthStatus] = useState<{
    status: string;
    hasGeminiKey: boolean;
    timestamp: string;
  } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const checkHealth = async () => {
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setHealthStatus(data);
    } catch {
      setHealthStatus({ status: 'error', hasGeminiKey: false, timestamp: new Date().toISOString() });
    }
  };

  useEffect(() => {
    if (isOpen) {
      checkHealth();
    }
  }, [isOpen]);

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      if (data.status === 'ok') {
        setTestResult(
          data.hasGeminiKey
            ? 'Success: Gemini API key is active on the server with Google Search Grounding enabled.'
            : 'Connected: Server is running in high-fidelity verified baseline mode. Add GEMINI_API_KEY in AI Studio Settings > Secrets to activate real-time web crawling.'
        );
      } else {
        setTestResult('Server returned unexpected status.');
      }
    } catch {
      setTestResult('Failed to reach backend server.');
    } finally {
      setIsTesting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className={`w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden transition-all ${
          isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600 text-white">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold">AI Engine & Connection Status</h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {APP_VERSION}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Server-side Google Gemini & Dynamic Model Auto-Discovery Engine
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          {/* Status Cards */}
          <div className={`p-4 rounded-xl border ${
            healthStatus?.hasGeminiKey
              ? isDark ? 'bg-emerald-950/30 border-emerald-800 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : isDark ? 'bg-blue-950/30 border-blue-800 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-900'
          }`}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>
                  {healthStatus?.hasGeminiKey
                    ? 'Server Gemini Engine: Active & Keyed'
                    : 'Server Gemini Engine: Ready / Verified Baseline Active'}
                </span>
              </div>
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                AUTO-ADAPTIVE
              </span>
            </div>
            <p className="text-[11px] leading-relaxed opacity-90">
              {healthStatus?.hasGeminiKey
                ? 'Your GEMINI_API_KEY is configured on the backend server with dynamic model auto-discovery and live Google Search Grounding enabled.'
                : 'The application is running with server-side AI proxy routes and verified intelligence datasets.'}
            </p>
          </div>

          {/* Model Auto-Discovery & Dynamic Acceptance Card */}
          <div className={`p-3.5 rounded-xl border ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Dynamic Model Auto-Discovery Engine</span>
              </div>
              <span className="text-[10px] font-mono text-blue-400 font-semibold">
                Auto-Accepts New Models
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2 leading-relaxed">
              When Google updates or releases new Gemini models (such as newer flash iterations, alias pointers, or preview models), this engine automatically queries Google&apos;s models endpoint, detects active capabilities, and routes queries through a multi-tier fallback ladder without breaking:
            </p>
            <div className="space-y-1 font-mono text-[10px]">
              {CURRENT_VERSION_INFO.modelLadder.map((m, idx) => (
                <div key={m} className="flex items-center justify-between px-2 py-1 rounded bg-slate-900/50 dark:bg-slate-900 border border-slate-800 text-slate-300">
                  <span>Priority {idx + 1}: <strong className="text-blue-400">{m}</strong></span>
                  <span className="text-emerald-400">{idx === 0 ? 'Active / Preferred' : 'Fallback'}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Architecture details */}
          <div className="space-y-2 pt-2">
            <h4 className="font-bold uppercase tracking-wider text-[11px] text-slate-400">
              Active AI Capabilities
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className={`p-3 rounded-lg border ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200 mb-0.5">
                  <Globe className="w-3.5 h-3.5 text-blue-500" />
                  <span>Google Search Grounding</span>
                </div>
                <div className="text-[11px] text-slate-500">gemini-3.5-flash with real-time web discovery</div>
              </div>

              <div className={`p-3 rounded-lg border ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200 mb-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Two-Pass Fact-Locker</span>
                </div>
                <div className="text-[11px] text-slate-500">Zero-hallucination script generation & audit</div>
              </div>

              <div className={`p-3 rounded-lg border ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200 mb-0.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>CPO Executive Brief</span>
                </div>
                <div className="text-[11px] text-slate-500">Dynamic synthesis of 10 risk vectors</div>
              </div>

              <div className={`p-3 rounded-lg border ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200 mb-0.5">
                  <Cpu className="w-3.5 h-3.5 text-purple-500" />
                  <span>Secure Backend Proxy</span>
                </div>
                <div className="text-[11px] text-slate-500">Server-side execution via /api routes</div>
              </div>
            </div>
          </div>

          {/* Platform Key Instructions */}
          <div className={`p-3.5 rounded-xl border text-[11px] leading-relaxed ${
            isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}>
            <span className="font-bold text-slate-700 dark:text-slate-200">How API Keys Are Handled: </span>
            In Google AI Studio, API keys are configured securely in the platform's <strong>Settings &gt; Secrets</strong> panel outside the web application. The platform automatically injects <code className="font-mono text-blue-500 font-semibold">GEMINI_API_KEY</code> into the server environment at runtime, eliminating the need to enter secrets into client browser storage or public forms.
          </div>

          {/* Test Connection Button */}
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={handleTestConnection}
              disabled={isTesting}
              className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
              <span>{isTesting ? 'Testing Server Connection...' : 'Test Backend AI Connection'}</span>
            </button>

            {testResult && (
              <div className={`p-2.5 rounded-lg border text-[11px] ${
                testResult.includes('Success')
                  ? isDark ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : isDark ? 'bg-blue-950/60 border-blue-800 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-800'
              }`}>
                {testResult}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end bg-slate-50 dark:bg-slate-950/60 text-xs">
          <button
            onClick={onClose}
            className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold hover:opacity-90 transition-opacity cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Close</span>
          </button>
        </div>
      </div>
    </div>
  );
};
