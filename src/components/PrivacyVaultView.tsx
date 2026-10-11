import React, { useState, useEffect } from 'react';
import { Shield, Download, Trash2, EyeOff, AlertTriangle, Cpu, CheckCircle2, Lock, HardDrive } from 'lucide-react';
import {
  getStorageStats,
  purgeAllLocalData,
  exportCabinetAsJSON,
  getPrivacySettings,
  savePrivacySettings,
  PrivacySettings,
} from '../services/storageService';

interface PrivacyVaultViewProps {
  onDataPurged: () => void;
  onSettingsChanged: (settings: PrivacySettings) => void;
}

export const PrivacyVaultView: React.FC<PrivacyVaultViewProps> = ({
  onDataPurged,
  onSettingsChanged,
}) => {
  const [stats, setStats] = useState({ bytesUsed: 0, itemCount: 0 });
  const [settings, setSettings] = useState<PrivacySettings>(getPrivacySettings());
  const [showConfirmPurge, setShowConfirmPurge] = useState(false);

  useEffect(() => {
    setStats(getStorageStats());
    setSettings(getPrivacySettings());
  }, []);

  const handleToggleAirGap = () => {
    const updated = { ...settings, airGapMode: !settings.airGapMode };
    setSettings(updated);
    savePrivacySettings(updated);
    onSettingsChanged(updated);
  };

  const handleExport = () => {
    const jsonStr = exportCabinetAsJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medpocket-private-cabinet-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePurge = () => {
    purgeAllLocalData();
    setShowConfirmPurge(false);
    setStats({ bytesUsed: 0, itemCount: 0 });
    onDataPurged();
  };

  return (
    <div className="space-y-6">
      {/* Privacy Guarantee Header */}
      <div className="p-7 sm:p-9 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3 relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-teal-500/10 blur-3xl pointer-events-none"
        />

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/70 border border-teal-200/60 dark:border-teal-800/60 text-teal-800 dark:text-teal-300 text-xs font-semibold">
            <Shield className="w-3.5 h-3.5" />
            <span>Cryptographic On-Device Sandbox · Zero-Cloud Retention</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Privacy Vault & Local Storage Controls
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
            MedPocket was architected from day one to respect personal health information (PHI). Your medications, dosage schedules, scans, and notes exist solely on this physical device.
          </p>
        </div>
      </div>

      {/* Air-Gap / 100% Offline Mode Card */}
      <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <EyeOff className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Air-Gap Mode (Strict Offline Isolation)
            </h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
            When Air-Gap mode is activated, MedPocket severs all outbound network calls. All drug searches, side effect analyses, and interaction evaluations execute 100% on-device via local weights or embedded clinical database.
          </p>
        </div>

        <button
          onClick={handleToggleAirGap}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 touch-press shadow-xs ${
            settings.airGapMode
              ? 'bg-amber-600 text-white hover:bg-amber-700 shadow-amber-600/20'
              : 'bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 hover:bg-teal-100'
          }`}
        >
          {settings.airGapMode ? 'Air-Gap Enabled' : 'Enable Air-Gap Mode'}
        </button>
      </div>

      {/* Storage Metrics & Transparency */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1.5 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            On-Device Footprint
          </span>
          <div className="text-2xl font-mono font-extrabold text-slate-900 dark:text-white">
            {(stats.bytesUsed / 1024).toFixed(2)} KB
          </div>
          <span className="text-xs text-teal-700 dark:text-teal-300 font-semibold">
            Stored in browser IndexedDB
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1.5 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Stored Medications
          </span>
          <div className="text-2xl font-mono font-extrabold text-slate-900 dark:text-white">
            {stats.itemCount}
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Cabinet entries in local storage
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1.5 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Cloud Retention Policy
          </span>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
            0 Bytes
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Zero remote telemetry collected
          </span>
        </div>
      </div>

      {/* Open-Source MedGemma Architecture Explainer */}
      <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-xs">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            About Open-Source MedGemma Intelligence
          </h3>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Google’s open-weight MedGemma model family specializes in medical literature, clinical pharmacology, and prescription OCR. In MedPocket:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 space-y-1.5 border border-slate-100 dark:border-slate-700">
            <span className="font-bold text-slate-900 dark:text-white block">
              1. Sovereign Local Inference
            </span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              When models execute via WebGPU or local Ollama, inference tensors compute directly in device memory. No network packets leave your computer.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 space-y-1.5 border border-slate-100 dark:border-slate-700">
            <span className="font-bold text-slate-900 dark:text-white block">
              2. Embedded Clinical Knowledge Core
            </span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Even with zero models downloaded, MedPocket falls back to the embedded 50+ drug pharmaceutical database stored directly in the offline bundle.
            </p>
          </div>
        </div>
      </div>

      {/* Data Management Actions */}
      <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Data Portability & Sanitization
        </h3>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleExport}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-xs font-bold border border-teal-200 dark:border-teal-800 hover:bg-teal-100 transition-colors cursor-pointer touch-press"
          >
            <Download className="w-4 h-4" />
            <span>Export Cabinet as JSON File</span>
          </button>

          <button
            onClick={() => setShowConfirmPurge(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 text-xs font-bold border border-rose-200 dark:border-rose-900 hover:bg-rose-100 transition-colors cursor-pointer touch-press"
          >
            <Trash2 className="w-4 h-4 text-rose-600" />
            <span>Purge All Local Data</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmPurge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 p-7 shadow-2xl space-y-4 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2.5 text-rose-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Permanently Clear All Local Data?
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              This will erase all registered medications, dosage records, and downloaded weights stored in your browser's private sandbox.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowConfirmPurge(false)}
                className="flex-1 py-2.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 cursor-pointer touch-press"
              >
                Cancel
              </button>
              <button
                onClick={handlePurge}
                className="flex-1 py-2.5 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white cursor-pointer touch-press shadow-xs"
              >
                Yes, Purge Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
