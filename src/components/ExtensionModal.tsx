import React, { useState } from 'react';
import {
  Download,
  X,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  RefreshCw,
  Copy,
  Check,
  Globe,
  Layers,
  Monitor,
  Sidebar,
  Zap,
  ShieldCheck,
  Folder,
  FolderCheck,
  Tag,
  CheckCheck,
} from 'lucide-react';
import { downloadExtensionZip } from '../utils/extensionZip';
import {
  APP_VERSION,
  EXTENSION_VERSION,
  EXTENSION_ZIP_FILENAME,
  EXTENSION_FOLDER_NAME,
} from '../data/versionInfo';

interface ExtensionModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

export const ExtensionModal: React.FC<ExtensionModalProps> = ({
  isOpen,
  onClose,
  isDark,
}) => {
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);
  const [copiedFolder, setCopiedFolder] = useState<boolean>(false);
  const [activeBrowserTab, setActiveBrowserTab] = useState<'chrome' | 'edge' | 'firefox' | 'brave'>('chrome');
  const [enclosedFolderMode, setEnclosedFolderMode] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://ais-dev-r3glata6oz3rwzvgoumdmj-117353919783.asia-southeast1.run.app';

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      await downloadExtensionZip({ folder: enclosedFolderMode });
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 6000);
    } catch (err) {
      console.error('Failed to generate extension zip:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(currentOrigin);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  const handleCopyFolder = () => {
    navigator.clipboard.writeText(EXTENSION_FOLDER_NAME);
    setCopiedFolder(true);
    setTimeout(() => setCopiedFolder(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-70 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className={`w-full max-w-3xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[92vh] ${
        isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-xs">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold tracking-tight">Full Functional Browser Extension</h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  {APP_VERSION} · MANIFEST V3
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hidden sm:inline-flex items-center gap-1">
                  <CheckCheck className="w-3 h-3" />
                  SYNCED
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Download and install the native browser extension copy ({APP_VERSION}) of this intelligence terminal
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* Zero Server Load & Bring-Your-Own-Key Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-teal-950/40 to-blue-950/40 border border-emerald-500/30">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-emerald-200">
                    100% Serverless & Safe to Share — Zero Server Load for You
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    PRIVATE & INDEPENDENT
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  When you share this extension with your friends, <strong>it will NOT use your server or consume your quotas</strong>. The extension runs directly inside each user&apos;s browser. Friends can simply upload and use it out-of-the-box, and enter their own free Google Gemini API key in Settings (⚙️) to fetch live breaking news and generate scripts independently.
                </p>
              </div>
            </div>
          </div>

          {/* Synchronized Version & Download Action Section */}
          <div className={`p-4 rounded-xl border space-y-3.5 ${
            isDark ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center flex-wrap gap-2">
                  <span className="font-mono font-bold text-sm text-slate-100 flex items-center gap-1.5">
                    <Folder className="w-4 h-4 text-purple-400" />
                    <span>{EXTENSION_ZIP_FILENAME}</span>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 font-bold border border-purple-500/30">
                    {APP_VERSION}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Dynamic Sync Active
                  </span>
                </div>

                <div className="flex items-center flex-wrap gap-2 text-[11px] text-slate-400">
                  <span>Extracts to folder:</span>
                  <code className="font-mono text-xs text-emerald-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800 flex items-center gap-1">
                    <FolderCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{EXTENSION_FOLDER_NAME}</span>
                  </code>
                  <button
                    onClick={handleCopyFolder}
                    className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer"
                    title="Copy folder name to clipboard"
                  >
                    {copiedFolder ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedFolder ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {isDownloading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Packaging Extension ({APP_VERSION})...</span>
                    </>
                  ) : downloadSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      <span>Downloaded ({APP_VERSION})!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Download Extension ({APP_VERSION} .ZIP)</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Packaging Format Selection */}
            <div className="pt-2.5 border-t border-slate-200/50 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px]">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-medium">ZIP Archive Format:</span>
                <div className="inline-flex rounded-lg p-0.5 bg-slate-900 border border-slate-800">
                  <button
                    onClick={() => setEnclosedFolderMode(false)}
                    className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                      !enclosedFolderMode
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Direct Unpack (Recommended)
                  </button>
                  <button
                    onClick={() => setEnclosedFolderMode(true)}
                    className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                      enclosedFolderMode
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Enclosed Root Folder ({EXTENSION_FOLDER_NAME}/)
                  </button>
                </div>
              </div>

              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                {!enclosedFolderMode
                  ? 'Extracts standard folder with manifest.json at root'
                  : `Includes top-level ${EXTENSION_FOLDER_NAME} folder inside zip`}
              </span>
            </div>
          </div>

          {/* Browser Selection Tabs for Instructions */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Installation Instructions by Browser
              </span>
              <div className="flex items-center gap-1">
                {[
                  { id: 'chrome', label: 'Chrome' },
                  { id: 'edge', label: 'Edge' },
                  { id: 'brave', label: 'Brave' },
                  { id: 'firefox', label: 'Firefox' },
                ].map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setActiveBrowserTab(b.id as any)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                      activeBrowserTab === b.id
                        ? 'bg-purple-600 text-white shadow-xs'
                        : isDark
                          ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Instruction Steps */}
            <div className={`p-4 rounded-xl border space-y-3 ${
              isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              {/* Step 1 */}
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 font-mono font-bold flex items-center justify-center shrink-0">
                  1
                </span>
                <div>
                  <h5 className="font-bold text-xs text-slate-200">
                    Unzip the downloaded file
                  </h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Extract <code className="font-mono text-purple-400">{EXTENSION_ZIP_FILENAME}</code> to a permanent folder on your computer. It creates the versioned directory <code className="font-mono text-emerald-400 font-semibold">{EXTENSION_FOLDER_NAME}</code>.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 font-mono font-bold flex items-center justify-center shrink-0">
                  2
                </span>
                <div>
                  <h5 className="font-bold text-xs text-slate-200">
                    {activeBrowserTab === 'chrome' && 'Open chrome://extensions and enable Developer mode'}
                    {activeBrowserTab === 'edge' && 'Open edge://extensions and enable Developer mode'}
                    {activeBrowserTab === 'brave' && 'Open brave://extensions and enable Developer mode'}
                    {activeBrowserTab === 'firefox' && 'Open about:debugging#/runtime/this-firefox'}
                  </h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {activeBrowserTab === 'chrome' && 'In Google Chrome, navigate to chrome://extensions in your address bar and toggle the "Developer mode" switch in the top-right.'}
                    {activeBrowserTab === 'edge' && 'In Microsoft Edge, go to edge://extensions and toggle the "Developer mode" switch on the left sidebar.'}
                    {activeBrowserTab === 'brave' && 'In Brave Browser, go to brave://extensions and toggle "Developer mode" in the top-right.'}
                    {activeBrowserTab === 'firefox' && 'In Firefox, go to about:debugging#/runtime/this-firefox and click "Load Temporary Add-on...".'}
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 font-mono font-bold flex items-center justify-center shrink-0">
                  3
                </span>
                <div>
                  <h5 className="font-bold text-xs text-slate-200">
                    Click "Load unpacked" and select the folder
                  </h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Click the <strong>Load unpacked</strong> button in the top-left and select the unzipped directory <code className="font-mono text-emerald-400 font-semibold">{EXTENSION_FOLDER_NAME}</code> (which contains <code className="font-mono text-purple-400">manifest.json</code>). The Supply Chain Intelligence extension will appear in your toolbar with version <span className="font-mono font-semibold text-purple-400">{APP_VERSION}</span>!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Extension Modes Grid */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Integrated Display Modes
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className={`p-3 rounded-xl border ${
                isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center gap-2 mb-1 text-indigo-400 font-bold">
                  <Monitor className="w-4 h-4" />
                  <span>Toolbar Popup</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Click the toolbar icon anytime for a high-density 760px view of top alerts and live risk scores.
                </p>
              </div>

              <div className={`p-3 rounded-xl border ${
                isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center gap-2 mb-1 text-purple-400 font-bold">
                  <Sidebar className="w-4 h-4" />
                  <span>Browser Side Panel</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Dock the full applet on the right side of Chrome/Edge while working in your ERP or supplier portal.
                </p>
              </div>

              <div className={`p-3 rounded-xl border ${
                isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center gap-2 mb-1 text-blue-400 font-bold">
                  <ExternalLink className="w-4 h-4" />
                  <span>1-Click Full Tab</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Instantly open the dedicated wide-screen terminal view in a new browser tab with one click.
                </p>
              </div>
            </div>
          </div>

          {/* Target Host Endpoint Verification */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] flex flex-wrap items-center justify-between gap-2 text-slate-400">
            <div className="flex items-center gap-1.5 truncate">
              <span>Target Cloud URL:</span>
              <code className="font-mono text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded truncate max-w-sm">
                {currentOrigin}
              </code>
            </div>

            <button
              onClick={handleCopyUrl}
              className="flex items-center gap-1 text-slate-300 hover:text-white px-2 py-1 rounded border border-slate-700 hover:bg-slate-800 transition-colors"
            >
              {copiedUrl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedUrl ? 'Copied' : 'Copy URL'}</span>
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Manifest V3 Verified · Safe & Sandboxed</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .ZIP</span>
            </button>
            <button
              onClick={onClose}
              className="flex items-center gap-1 px-4 py-1.5 rounded-lg border text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Close</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
