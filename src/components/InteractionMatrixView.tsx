import React, { useState, useEffect } from 'react';
import { UserCabinetItem, InteractionCheckResult } from '../types/medication';
import { checkInteractionsWithMedGemma, checkOfflineInteractions } from '../services/interactionEngine';
import { AlertTriangle, ShieldCheck, Sparkles, RefreshCw, Plus, Check, ShieldAlert, X } from 'lucide-react';

interface InteractionMatrixViewProps {
  cabinet: UserCabinetItem[];
  isAirGapMode: boolean;
}

export const InteractionMatrixView: React.FC<InteractionMatrixViewProps> = ({
  cabinet,
  isAirGapMode,
}) => {
  const [selectedDrugs, setSelectedDrugs] = useState<string[]>([]);
  const [adhocInput, setAdhocInput] = useState('');
  const [result, setResult] = useState<InteractionCheckResult | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  useEffect(() => {
    if (cabinet.length > 0 && selectedDrugs.length === 0) {
      setSelectedDrugs(cabinet.map(c => c.drugName));
    }
  }, [cabinet]);

  useEffect(() => {
    if (selectedDrugs.length >= 2) {
      const res = checkOfflineInteractions(selectedDrugs);
      setResult(res);
    } else {
      setResult(null);
    }
  }, [selectedDrugs]);

  const toggleDrug = (name: string) => {
    if (selectedDrugs.includes(name)) {
      setSelectedDrugs(selectedDrugs.filter(d => d !== name));
    } else {
      setSelectedDrugs([...selectedDrugs, name]);
    }
  };

  const removeDrug = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDrugs(selectedDrugs.filter(d => d !== name));
  };

  const addAdhocDrug = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = adhocInput.trim();
    if (!clean) return;
    if (!selectedDrugs.includes(clean)) {
      setSelectedDrugs([...selectedDrugs, clean]);
    }
    setAdhocInput('');
  };

  const handleRunAiAnalysis = async () => {
    if (selectedDrugs.length < 2) return;
    setIsLoadingAi(true);
    try {
      const aiResult = await checkInteractionsWithMedGemma(selectedDrugs, isAirGapMode);
      setResult(aiResult);
    } finally {
      setIsLoadingAi(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Container */}
      <div className="p-7 sm:p-9 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-teal-500/10 blur-3xl pointer-events-none"
        />

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/70 border border-teal-200/60 dark:border-teal-800/60 text-teal-800 dark:text-teal-300 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Multi-Drug Interaction Matrix · Deterministic + AI</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Drug-Drug Interaction Checker
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
            Evaluate pairwise pharmacological interactions across your current prescriptions and over-the-counter additions. Computed locally using clinical monographs with optional open-source MedGemma AI enhancement.
          </p>
        </div>
      </div>

      {/* Drug Selection Controls */}
      <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-5 shadow-xs">
        <div>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-2.5">
            Select Medications to Evaluate ({selectedDrugs.length} selected):
          </span>

          <div className="flex flex-wrap gap-2">
            {cabinet.map((item) => {
              const isSelected = selectedDrugs.includes(item.drugName);
              return (
                <button
                  key={item.id}
                  onClick={() => toggleDrug(item.drugName)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer touch-press ${
                    isSelected
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                  <span>{item.drugName}</span>
                </button>
              );
            })}

            {/* Custom ad-hoc drugs */}
            {selectedDrugs
              .filter(d => !cabinet.some(c => c.drugName === d))
              .map((name) => (
                <button
                  key={name}
                  onClick={() => toggleDrug(name)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-teal-700 text-white shadow-xs cursor-pointer touch-press"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{name}</span>
                  <span
                    onClick={(e) => removeDrug(name, e)}
                    className="ml-1 hover:opacity-75"
                    title="Remove"
                  >
                    <X className="w-3 h-3" />
                  </span>
                </button>
              ))}
          </div>
        </div>

        {/* Add custom / test drug input */}
        <form onSubmit={addAdhocDrug} className="flex items-center gap-3 pt-1">
          <input
            type="text"
            value={adhocInput}
            onChange={(e) => setAdhocInput(e.target.value)}
            placeholder="Add another prescription, OTC drug, or herb to test (e.g. Ibuprofen, Aspirin, St. John's Wort)..."
            className="flex-1 px-4 h-12 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button
            type="submit"
            className="px-5 h-12 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 touch-press shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add to Check</span>
          </button>
        </form>

        {/* Quick Test Pairs Presets */}
        <div className="pt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 flex-wrap">
          <span className="font-bold text-slate-700 dark:text-slate-300">Quick Test Pairs:</span>
          <button
            onClick={() => setSelectedDrugs(['Lisinopril', 'Ibuprofen'])}
            className="text-teal-700 dark:text-teal-400 font-semibold hover:underline cursor-pointer"
          >
            Lisinopril + Ibuprofen (Renal Risk)
          </button>
          <span>·</span>
          <button
            onClick={() => setSelectedDrugs(['Sertraline', 'Tramadol'])}
            className="text-teal-700 dark:text-teal-400 font-semibold hover:underline cursor-pointer"
          >
            Sertraline + Tramadol (Serotonin Syndrome)
          </button>
          <span>·</span>
          <button
            onClick={() => setSelectedDrugs(['Warfarin', 'Ciprofloxacin', 'Ibuprofen'])}
            className="text-teal-700 dark:text-teal-400 font-semibold hover:underline cursor-pointer"
          >
            Warfarin + Ciprofloxacin + Ibuprofen (Bleeding Risk)
          </button>
        </div>
      </div>

      {/* Results Section */}
      {selectedDrugs.length < 2 && (
        <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
          Please select at least 2 medications above to calculate pairwise pharmacokinetic and pharmacodynamic interactions.
        </div>
      )}

      {selectedDrugs.length >= 2 && result && (
        <div className="space-y-4">
          {/* Risk Level Banner */}
          <div
            className={`p-6 sm:p-7 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm border ${
              result.overallRisk === 'Contraindicated'
                ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-900 text-rose-950 dark:text-rose-100'
                : result.overallRisk === 'Severe'
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-100'
                : result.overallRisk === 'Moderate'
                ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-900 text-amber-950 dark:text-amber-100'
                : 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-900 text-emerald-950 dark:text-emerald-100'
            }`}
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <span className="text-sm font-extrabold uppercase tracking-wide">
                  Overall Risk: {result.overallRisk}
                </span>
                {result.isAiEnhanced && (
                  <span className="text-[10px] font-bold bg-white/80 dark:bg-black/40 px-2.5 py-0.5 rounded-full border border-current">
                    MedGemma Grounded
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm leading-relaxed max-w-2xl font-medium opacity-90">
                {result.summary}
              </p>
            </div>

            {/* MedGemma AI Button */}
            <button
              onClick={handleRunAiAnalysis}
              disabled={isLoadingAi}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold disabled:opacity-50 transition-all cursor-pointer whitespace-nowrap shadow-sm touch-press shrink-0"
            >
              {isLoadingAi ? (
                <RefreshCw className="w-4 h-4 animate-spin text-teal-200" />
              ) : (
                <Sparkles className="w-4 h-4 text-teal-200" />
              )}
              <span>
                {result.isAiEnhanced
                  ? (isAirGapMode ? 'Re-run On-Device MedGemma' : 'Refresh AI Review')
                  : (isAirGapMode ? 'Run On-Device MedGemma Review' : 'Deep MedGemma Analysis')}
              </span>
            </button>
          </div>

          {/* Interaction Pairs */}
          {result.pairs.length > 0 ? (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider px-1">
                Detected Pairwise Clinical Interventions ({result.pairs.length})
              </h3>

              <div className="grid grid-cols-1 gap-3">
                {result.pairs.map((pair, index) => (
                  <div
                    key={index}
                    className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-xs"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        {pair.drugA} <span className="text-slate-400 font-normal">interacts with</span> {pair.drugB}
                      </div>

                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full border ${
                          pair.severity === 'Contraindicated'
                            ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200 border-rose-300'
                            : pair.severity === 'Severe'
                            ? 'bg-rose-50 dark:bg-rose-950 text-rose-800 dark:text-rose-200 border-rose-200'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border-amber-300'
                        }`}
                      >
                        {pair.severity} Risk
                      </span>
                    </div>

                    <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                      <div>
                        <strong className="text-slate-900 dark:text-white">Clinical Effect: </strong>
                        {pair.clinicalEffect}
                      </div>
                      <div className="text-teal-800 dark:text-teal-300 font-medium">
                        <strong className="text-slate-900 dark:text-white">Action Recommendation: </strong>
                        {pair.actionRecommendation}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-2">
              <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                No Known Severe Interactions Found
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                No direct contraindications detected between {selectedDrugs.join(', ')} in the clinical database. Always inform your physician before adding new supplements or herbal remedies.
              </p>
            </div>
          )}

          {/* Monitoring Tips */}
          {result.monitoringTips.length > 0 && (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2.5 text-xs">
              <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                Clinical Precautions & Monitoring Checklist:
              </span>
              <ul className="space-y-1.5 text-slate-600 dark:text-slate-300 list-disc list-inside">
                {result.monitoringTips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
