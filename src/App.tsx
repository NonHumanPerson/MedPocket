/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TopBar, ActiveTab } from './components/TopBar';
import { OfflineIndicator } from './components/OfflineIndicator';
import { SearchLookupView } from './components/SearchLookupView';
import { CabinetView } from './components/CabinetView';
import { InteractionMatrixView } from './components/InteractionMatrixView';
import { LocalModelStudioView } from './components/LocalModelStudioView';
import { PrivacyVaultView } from './components/PrivacyVaultView';
import { MedicineDetailModal } from './components/MedicineDetailModal';
import { CameraScannerModal } from './components/CameraScannerModal';
import { MedicationMonograph, UserCabinetItem } from './types/medication';
import {
  getLocalCabinet,
  addToCabinet,
  removeFromCabinet,
  toggleTakenToday,
  getPrivacySettings,
  savePrivacySettings,
  PrivacySettings,
} from './services/storageService';
import { MedGemmaTierId, getLocalEngineSettings } from './services/localModelEngine';
import { Search, Pill, ShieldAlert, Lock, Cpu, Sparkles, Shield } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('search');
  const [cabinet, setCabinet] = useState<UserCabinetItem[]>([]);
  const [selectedMonograph, setSelectedMonograph] = useState<MedicationMonograph | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>(getPrivacySettings());
  const [activeEngineTierId, setActiveEngineTierId] = useState<MedGemmaTierId>('offline_db');

  // Load cabinet and engine settings on mount
  useEffect(() => {
    setCabinet(getLocalCabinet());
    const engineSettings = getLocalEngineSettings();
    setActiveEngineTierId(engineSettings.activeTierId);
  }, []);

  const handleAddToCabinet = (drugName: string, dosage: string, directions: string) => {
    addToCabinet({
      medicationId: drugName.toLowerCase().replace(/\s+/g, '-'),
      drugName,
      dosage,
      frequency: 'As prescribed',
      timing: directions,
      notes: 'Added from MedPocket scan/search',
    });
    setCabinet(getLocalCabinet());
  };

  const handleAddNewCustom = (
    drugName: string,
    dosage: string,
    frequency: string,
    timing: string,
    notes: string
  ) => {
    addToCabinet({
      medicationId: drugName.toLowerCase().replace(/\s+/g, '-'),
      drugName,
      dosage,
      frequency,
      timing,
      notes,
    });
    setCabinet(getLocalCabinet());
  };

  const handleRemoveCabinetItem = (id: string) => {
    removeFromCabinet(id);
    setCabinet(getLocalCabinet());
  };

  const handleToggleTaken = (id: string) => {
    toggleTakenToday(id);
    setCabinet(getLocalCabinet());
  };

  const handleDataPurged = () => {
    setCabinet([]);
  };

  const handleSettingsChanged = (newSettings: PrivacySettings) => {
    setPrivacySettings(newSettings);
  };

  const handleEngineChanged = (tierId: MedGemmaTierId) => {
    setActiveEngineTierId(tierId);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-teal-500 selection:text-white">
      {/* Top Bar Contract (1-line Brand, Nav Links, Active Engine, 1 Primary Action) */}
      <TopBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenScanner={() => setIsScannerOpen(true)}
        cabinetCount={cabinet.length}
        activeEngineTierId={activeEngineTierId}
      />

      {/* Connectivity & Privacy Status Bar */}
      <div className="border-b border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-1.5 flex items-center justify-between text-xs flex-wrap gap-2">
          <OfflineIndicator isAirGapMode={privacySettings.airGapMode} />
          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2.5 font-medium flex-wrap">
            <button
              onClick={() => setActiveTab('models')}
              className="hover:text-teal-700 dark:hover:text-teal-300 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Cpu className="w-3 h-3 text-teal-600" />
              <span>
                Engine: {activeEngineTierId === 'tier1_2b' ? 'Local 2B' : activeEngineTierId === 'tier2_4b' ? 'Local 4B' : activeEngineTierId === 'tier3_9b_ollama' ? 'Ollama 9B/27B' : 'Instant DB (0ms)'}
              </span>
            </button>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
            <button
              onClick={() => setActiveTab('cabinet')}
              className="hover:text-teal-700 dark:hover:text-teal-300 transition-colors cursor-pointer"
            >
              Cabinet: {cabinet.length} items
            </button>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-emerald-700 dark:text-emerald-400">Zero-Cloud Retention</span>
          </div>
        </div>
      </div>

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12">
        {activeTab === 'search' && (
          <SearchLookupView
            onSelectMonograph={setSelectedMonograph}
            onAddToCabinet={handleAddToCabinet}
            onOpenScanner={() => setIsScannerOpen(true)}
          />
        )}

        {activeTab === 'cabinet' && (
          <CabinetView
            cabinet={cabinet}
            onRemoveItem={handleRemoveCabinetItem}
            onToggleTaken={handleToggleTaken}
            onAddNewItem={handleAddNewCustom}
            onSelectMonograph={setSelectedMonograph}
            onCheckInteractions={() => setActiveTab('interactions')}
            onOpenScanner={() => setIsScannerOpen(true)}
          />
        )}

        {activeTab === 'interactions' && (
          <InteractionMatrixView
            cabinet={cabinet}
            isAirGapMode={privacySettings.airGapMode}
          />
        )}

        {activeTab === 'models' && (
          <LocalModelStudioView
            onEngineChanged={handleEngineChanged}
          />
        )}

        {activeTab === 'privacy' && (
          <PrivacyVaultView
            onDataPurged={handleDataPurged}
            onSettingsChanged={handleSettingsChanged}
          />
        )}
      </main>

      {/* Mobile Ergonomic Bottom Tab Bar (Visible on mobile viewports) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 grid grid-cols-5 items-center h-16 px-1 shadow-lg">
        <button
          onClick={() => setActiveTab('search')}
          className={`flex flex-col items-center justify-center py-1 cursor-pointer transition-colors touch-press ${
            activeTab === 'search' ? 'text-teal-700 dark:text-teal-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Search className="w-4 h-4" />
          <span className="text-[10px] tracking-tight mt-1">Search</span>
        </button>

        <button
          onClick={() => setActiveTab('cabinet')}
          className={`flex flex-col items-center justify-center py-1 cursor-pointer transition-colors relative touch-press ${
            activeTab === 'cabinet' ? 'text-teal-700 dark:text-teal-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Pill className="w-4 h-4" />
          <span className="text-[10px] tracking-tight mt-1">Cabinet</span>
          {cabinet.length > 0 && (
            <span className="absolute top-1 right-4 w-4 h-4 bg-teal-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center font-mono">
              {cabinet.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('interactions')}
          className={`flex flex-col items-center justify-center py-1 cursor-pointer transition-colors touch-press ${
            activeTab === 'interactions' ? 'text-teal-700 dark:text-teal-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span className="text-[10px] tracking-tight mt-1">Safety</span>
        </button>

        <button
          onClick={() => setActiveTab('models')}
          className={`flex flex-col items-center justify-center py-1 cursor-pointer transition-colors touch-press ${
            activeTab === 'models' ? 'text-teal-700 dark:text-teal-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span className="text-[10px] tracking-tight mt-1">Models</span>
        </button>

        <button
          onClick={() => setActiveTab('privacy')}
          className={`flex flex-col items-center justify-center py-1 cursor-pointer transition-colors touch-press ${
            activeTab === 'privacy' ? 'text-teal-700 dark:text-teal-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span className="text-[10px] tracking-tight mt-1">Vault</span>
        </button>
      </nav>

      {/* Desktop & Tablet Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-teal-700 text-white flex items-center justify-center text-[10px] font-bold">
              M
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200">MedPocket</span>
            <span>· Open-source MedGemma clinical medication intelligence</span>
          </div>

          <p className="text-center sm:text-right text-[11px] max-w-md opacity-85">
            Clinical decision support tool. Does not substitute professional medical advice from a licensed physician or pharmacist.
          </p>
        </div>
      </footer>

      {/* Full Clinical Monograph Detail Modal */}
      <MedicineDetailModal
        monograph={selectedMonograph}
        onClose={() => setSelectedMonograph(null)}
        onAddToCabinet={handleAddToCabinet}
        isAirGapMode={privacySettings.airGapMode}
        activeEngineTierId={activeEngineTierId}
      />

      {/* Camera & Prescription Scanner Modal */}
      <CameraScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onAddToCabinet={handleAddToCabinet}
        onViewMonograph={(mono) => setSelectedMonograph(mono)}
        isAirGapMode={privacySettings.airGapMode}
        activeEngineTierId={activeEngineTierId}
        cabinetItems={cabinet}
      />
    </div>
  );
}
