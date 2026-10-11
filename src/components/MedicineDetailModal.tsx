import React, { useState } from 'react';
import { MedicationMonograph } from '../types/medication';
import { X, AlertCircle, ShieldAlert, Plus, Sparkles, Send, RefreshCw, Check, Clock, Utensils, AlertTriangle, Cpu } from 'lucide-react';
import { queryLocalMedGemma, getLocalEngineSettings, MedGemmaTierId } from '../services/localModelEngine';

interface MedicineDetailModalProps {
  monograph: MedicationMonograph | null;
  onClose: () => void;
  onAddToCabinet: (drugName: string, dosage: string, directions: string) => void;
  isAirGapMode: boolean;
  activeEngineTierId?: MedGemmaTierId;
}

export const MedicineDetailModal: React.FC<MedicineDetailModalProps> = ({
  monograph,
  onClose,
  onAddToCabinet,
  isAirGapMode,
  activeEngineTierId: propTierId,
}) => {
  const [activeTab, setActiveTab] = useState<'whatItDoes' | 'howToTake' | 'sideEffects' | 'interactions' | 'askMedGemma'>('whatItDoes');
  const [userQuestion, setUserQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isAskingAi, setIsAskingAi] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [isAdded, setIsAdded] = useState(false);

  if (!monograph) return null;

  const handleAskMedGemma = async (questionText?: string) => {
    const q = questionText || userQuestion;
    if (!q.trim()) return;

    setIsAskingAi(true);
    setAiError(null);
    setAiAnswer(null);

    const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;
    const settings = getLocalEngineSettings();
    const effectiveTier = propTierId || settings.activeTierId;

    // If offline, in air-gap mode, or local model is active: use on-device MedGemma!
    if (isAirGapMode || isOffline || effectiveTier !== 'offline_db') {
      try {
        const localAnswer = await queryLocalMedGemma(q, monograph.genericName, effectiveTier);
        setAiAnswer(localAnswer);
      } catch (err: any) {
        setAiError(err.message || 'Local MedGemma could not process query.');
      } finally {
        setIsAskingAi(false);
      }
      return;
    }

    try {
      const res = await fetch('/api/medgemma/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medicationName: monograph.genericName,
          userContext: q,
        }),
      });

      if (!res.ok) {
        throw new Error('MedGemma service returned an error.');
      }

      const json = await res.json();
      if (json.data) {
        const text = json.data.clinicalTakeaway || json.data.whatItDoes || JSON.stringify(json.data, null, 2);
        setAiAnswer(text);
      } else {
        setAiAnswer('Analysis complete.');
      }
    } catch (err: any) {
      console.warn('Network MedGemma call failed, switching to on-device model:', err);
      try {
        const localAnswer = await queryLocalMedGemma(q, monograph.genericName, settings.activeTierId);
        setAiAnswer(localAnswer);
      } catch {
        setAiError('Unable to connect to service. Local engine fallback active.');
      }
    } finally {
      setIsAskingAi(false);
    }
  };

  const handleQuickAdd = () => {
    onAddToCabinet(monograph.genericName, monograph.standardDosage, monograph.howToTake.instructions);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="p-7 sm:p-8 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white dark:bg-slate-700 hover:bg-slate-100 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer touch-press shadow-xs"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mb-2 flex-wrap">
            <span className="font-bold text-teal-700 dark:text-teal-300 px-2.5 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/70 border border-teal-200/60 dark:border-teal-800/60">
              {monograph.therapeuticClass}
            </span>
            <span aria-hidden="true">·</span>
            <span>Brands: {monograph.brandNames.join(', ')}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">{monograph.standardDosage}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {monograph.genericName}
          </h2>

          <div className="mt-2 text-xs text-teal-700 dark:text-teal-300 font-semibold flex items-center gap-1.5 flex-wrap">
            <span>Primary indications:</span>
            {monograph.primaryUses.map((use, i) => (
              <span key={i} className="text-slate-600 dark:text-slate-300">
                {use}{i < monograph.primaryUses.length - 1 ? ' · ' : ''}
              </span>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="p-2.5 bg-slate-100/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex items-center gap-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('whatItDoes')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer touch-press ${
              activeTab === 'whatItDoes'
                ? 'bg-white dark:bg-slate-900 text-teal-800 dark:text-teal-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            What It Does
          </button>
          <button
            onClick={() => setActiveTab('howToTake')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer touch-press ${
              activeTab === 'howToTake'
                ? 'bg-white dark:bg-slate-900 text-teal-800 dark:text-teal-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            How To Take
          </button>
          <button
            onClick={() => setActiveTab('sideEffects')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer touch-press ${
              activeTab === 'sideEffects'
                ? 'bg-white dark:bg-slate-900 text-teal-800 dark:text-teal-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Side Effects Tiers
          </button>
          <button
            onClick={() => setActiveTab('interactions')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer touch-press ${
              activeTab === 'interactions'
                ? 'bg-white dark:bg-slate-900 text-teal-800 dark:text-teal-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Interactions & Warnings
          </button>
          <button
            onClick={() => setActiveTab('askMedGemma')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 touch-press ${
              activeTab === 'askMedGemma'
                ? 'bg-white dark:bg-slate-900 text-teal-800 dark:text-teal-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Ask MedGemma</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-7 max-h-[60vh] overflow-y-auto space-y-5">
          {/* Tab 1: What It Does */}
          {activeTab === 'whatItDoes' && (
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                  Mechanism of Action (Biological Effect)
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {monograph.mechanismOfAction}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2.5">
                  Clinical Indications
                </h4>
                <div className="space-y-2">
                  {monograph.primaryUses.map((use, i) => (
                    <div key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-teal-600" />
                      <span>{use}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: How To Take */}
          {activeTab === 'howToTake' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-1.5 text-slate-500 dark:text-slate-400 text-xs font-semibold">
                    <Utensils className="w-4 h-4 text-teal-600" />
                    <span>Food Relationship</span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {monograph.howToTake.foodRequirement === 'with_food'
                      ? 'Always take with food or milk'
                      : monograph.howToTake.foodRequirement === 'empty_stomach'
                      ? 'Take on an empty stomach'
                      : 'Take with or without food'}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-1.5 text-slate-500 dark:text-slate-400 text-xs font-semibold">
                    <Clock className="w-4 h-4 text-teal-600" />
                    <span>Recommended Timing</span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {monograph.howToTake.bestTimeOfDay}
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Administration Instructions
                </span>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {monograph.howToTake.instructions}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-950 dark:text-amber-200 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider block">
                  If You Miss a Dose
                </span>
                <p className="text-xs leading-relaxed font-medium">
                  {monograph.howToTake.missedDoseAdvice}
                </p>
              </div>
            </div>
          )}

          {/* Tab 3: Side Effects Tiers */}
          {activeTab === 'sideEffects' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-300">
                MedPocket stratifies adverse effects into three distinct clinical tiers to help you monitor symptoms safely:
              </p>

              {/* Tier 1: Mild */}
              <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-950 dark:text-emerald-200 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  <h4 className="text-xs font-bold">
                    Tier 1: Common & Mild (Usually Resolves Over Time)
                  </h4>
                </div>
                <ul className="text-xs space-y-1 list-disc list-inside">
                  {monograph.sideEffects.mild.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              </div>

              {/* Tier 2: Moderate */}
              <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-950 dark:text-amber-200 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                  <h4 className="text-xs font-bold">
                    Tier 2: Moderate (Monitor Closely & Inform Prescriber)
                  </h4>
                </div>
                <ul className="text-xs space-y-1 list-disc list-inside">
                  {monograph.sideEffects.moderate.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              </div>

              {/* Tier 3: Urgent */}
              <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-950 dark:text-rose-200 space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <h4 className="text-xs font-bold">
                    Tier 3: Critical Red-Flag (Seek Immediate Emergency Care)
                  </h4>
                </div>
                <ul className="text-xs space-y-1 list-disc list-inside font-semibold">
                  {monograph.sideEffects.urgent.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Tab 4: Interactions & Warnings */}
          {activeTab === 'interactions' && (
            <div className="space-y-4">
              {monograph.warnings.blackBox && (
                <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-100 space-y-1.5">
                  <div className="flex items-center gap-2 font-extrabold text-xs uppercase tracking-wider text-rose-700 dark:text-rose-300">
                    <AlertCircle className="w-4 h-4" />
                    <span>FDA Boxed Warning</span>
                  </div>
                  <p className="text-xs leading-relaxed font-bold">
                    {monograph.warnings.blackBox}
                  </p>
                </div>
              )}

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Substance & Alcohol Alerts
                </h4>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  {monograph.warnings.alcoholWarning}
                </p>
                {monograph.warnings.foodWarnings.length > 0 && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
                    <strong className="text-slate-900 dark:text-white">Dietary notes: </strong>
                    {monograph.warnings.foodWarnings.join(' · ')}
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2.5">
                  Notable Drug-Drug Interactions
                </h4>
                <div className="space-y-2.5">
                  {monograph.knownInteractions.map((inter, i) => (
                    <div
                      key={i}
                      className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          with {inter.interactingDrug}
                        </span>
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                            inter.severity === 'Contraindicated'
                              ? 'bg-rose-100 text-rose-800 border-rose-300'
                              : inter.severity === 'Severe'
                              ? 'bg-rose-50 text-rose-800 border-rose-200'
                              : 'bg-amber-100 text-amber-900 border-amber-300'
                          }`}
                        >
                          {inter.severity} Risk
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        {inter.effect}
                      </p>
                      <p className="text-xs text-teal-800 dark:text-teal-300 font-semibold">
                        Advice: {inter.recommendation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Ask MedGemma */}
          {activeTab === 'askMedGemma' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800">
                <h4 className="text-xs font-bold text-teal-900 dark:text-teal-200 mb-1">
                  Open-Source MedGemma Clinical Consultation
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Have a specific question about {monograph.genericName} (e.g. coffee, workout timing, dizziness)? Ask MedGemma for instant clinical clarity.
                </p>
              </div>

              {/* Quick Prompt Suggestions */}
              <div className="flex items-center gap-2 flex-wrap text-[11px]">
                <span className="text-slate-500 font-medium">Ask:</span>
                <button
                  type="button"
                  onClick={() => handleAskMedGemma(`Can I take ${monograph.genericName} with coffee?`)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
                >
                  Can I drink coffee?
                </button>
                <button
                  type="button"
                  onClick={() => handleAskMedGemma(`What happens if I miss a dose of ${monograph.genericName}?`)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
                >
                  What if I miss a dose?
                </button>
                <button
                  type="button"
                  onClick={() => handleAskMedGemma(`Are there long term risks with ${monograph.genericName}?`)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
                >
                  Long term effects?
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleAskMedGemma(); }} className="flex items-center gap-2">
                <input
                  type="text"
                  value={userQuestion}
                  onChange={(e) => setUserQuestion(e.target.value)}
                  placeholder={`e.g. Can I take ${monograph.brandNames[0] || monograph.genericName} before exercising?`}
                  className="flex-1 px-4 h-12 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  type="submit"
                  disabled={isAskingAi || !userQuestion.trim()}
                  className="px-5 h-12 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white cursor-pointer transition-colors flex items-center justify-center touch-press shadow-xs shrink-0 font-bold text-xs"
                >
                  {isAskingAi ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </form>

              {aiError && (
                <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 text-xs border border-rose-200">
                  {aiError}
                </div>
              )}

              {aiAnswer && (
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 space-y-2 shadow-xs">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-teal-600" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      MedGemma Clinical Insight
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line font-medium">
                    {aiAnswer}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Clinical reference data stored locally on-device.
          </div>
          <button
            onClick={handleQuickAdd}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer touch-press ${
              isAdded ? 'bg-emerald-600 text-white' : 'bg-teal-700 hover:bg-teal-800 text-white'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added to Cabinet!</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Add to My Cabinet</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
