import React from 'react';
import { Camera, Cpu, Pill, Search, ShieldAlert, Lock, Sparkles, CheckCircle2 } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { MedGemmaTierId } from '../services/localModelEngine';

export type ActiveTab = 'search' | 'cabinet' | 'interactions' | 'models' | 'privacy';

interface TopBarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenScanner: () => void;
  cabinetCount: number;
  activeEngineTierId: MedGemmaTierId;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  onTabChange,
  onOpenScanner,
  cabinetCount,
  activeEngineTierId,
}) => {
  const getEngineBadge = () => {
    switch (activeEngineTierId) {
      case 'tier1_2b':
        return { label: 'Local 2B (WebGPU)', color: 'text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 border-teal-200 dark:border-teal-800' };
      case 'tier2_4b':
        return { label: 'Local 4B (WebGPU)', color: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800' };
      case 'tier3_9b_ollama':
        return { label: 'Ollama 9B/27B', color: 'text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 border-sky-200 dark:border-sky-800' };
      default:
        return { label: 'Instant DB (0ms)', color: 'text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700' };
    }
  };

  const engine = getEngineBadge();

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-6 px-4 sm:px-6 py-2.5">
        {/* Brand & Engine Indicator */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onTabChange('search')}
            className="flex items-center gap-2.5 text-left cursor-pointer group touch-press"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-700 flex items-center justify-center text-white shadow-sm shadow-teal-700/20 group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M19 10.5h-5.5V5a1.5 1.5 0 0 0-3 0v5.5H5a1.5 1.5 0 0 0 0 3h5.5V19a1.5 1.5 0 0 0 3 0v-5.5H19a1.5 1.5 0 0 0 0-3z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                  MedPocket
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                  Gemma
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Clinical Medication Intelligence
              </p>
            </div>
          </button>

          {/* Quick Engine Indicator Button */}
          <button
            onClick={() => onTabChange('models')}
            className={`hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium border transition-all cursor-pointer hover:opacity-90 touch-press ${engine.color}`}
            title="Configure on-device MedGemma models"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
            <Cpu className="w-3 h-3" />
            <span>{engine.label}</span>
          </button>
        </div>

        {/* Navigation Tabs (Desktop & Tablet) */}
        <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-100/80 dark:bg-slate-800/80 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
          <button
            onClick={() => onTabChange('search')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer touch-press ${
              activeTab === 'search'
                ? 'bg-white dark:bg-slate-900 text-teal-800 dark:text-teal-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Drug Search</span>
          </button>

          <button
            onClick={() => onTabChange('cabinet')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer touch-press ${
              activeTab === 'cabinet'
                ? 'bg-white dark:bg-slate-900 text-teal-800 dark:text-teal-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Pill className="w-3.5 h-3.5" />
            <span>My Cabinet</span>
            {cabinetCount > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-teal-600 text-white rounded-full font-bold">
                {cabinetCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onTabChange('interactions')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer touch-press ${
              activeTab === 'interactions'
                ? 'bg-white dark:bg-slate-900 text-teal-800 dark:text-teal-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Safety Matrix</span>
          </button>

          <button
            onClick={() => onTabChange('models')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer touch-press ${
              activeTab === 'models'
                ? 'bg-white dark:bg-slate-900 text-teal-800 dark:text-teal-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Models & Offline</span>
          </button>

          <button
            onClick={() => onTabChange('privacy')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer touch-press ${
              activeTab === 'privacy'
                ? 'bg-white dark:bg-slate-900 text-teal-800 dark:text-teal-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Privacy Vault</span>
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <PWAInstallButton />

          <button
            onClick={onOpenScanner}
            className="flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs font-bold text-white rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 shadow-sm shadow-teal-700/20 hover:shadow-md hover:shadow-teal-700/30 transition-all cursor-pointer whitespace-nowrap touch-press h-9 sm:h-10"
          >
            <Camera className="w-4 h-4" />
            <span className="hidden sm:inline">Scan Rx / Bottle</span>
            <span className="sm:hidden">Scan</span>
          </button>
        </div>
      </div>
    </header>
  );
};
