import React, { useState } from 'react';
import { UserCabinetItem, MedicationMonograph } from '../types/medication';
import { Plus, Trash2, CheckCircle2, Circle, AlertTriangle, ShieldCheck, ChevronRight, BookOpen, Pill, CalendarCheck, Check } from 'lucide-react';
import { findMonographByName, checkOfflineInteractions } from '../services/interactionEngine';

interface CabinetViewProps {
  cabinet: UserCabinetItem[];
  onRemoveItem: (id: string) => void;
  onToggleTaken: (id: string) => void;
  onAddNewItem: (drugName: string, dosage: string, frequency: string, timing: string, notes: string) => void;
  onSelectMonograph: (monograph: MedicationMonograph) => void;
  onCheckInteractions: () => void;
  onOpenScanner: () => void;
}

export const CabinetView: React.FC<CabinetViewProps> = ({
  cabinet,
  onRemoveItem,
  onToggleTaken,
  onAddNewItem,
  onSelectMonograph,
  onCheckInteractions,
  onOpenScanner,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [drugName, setDrugName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('Once daily');
  const [timing, setTiming] = useState('With morning meal');
  const [notes, setNotes] = useState('');

  const medNames = cabinet.map(c => c.drugName);
  const interactionAudit = checkOfflineInteractions(medNames);

  const takenCount = cabinet.filter(c => c.takenToday).length;
  const adherencePercent = cabinet.length > 0 ? Math.round((takenCount / cabinet.length) * 100) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!drugName.trim()) return;
    onAddNewItem(drugName.trim(), dosage.trim() || 'Standard', frequency, timing, notes.trim());
    setDrugName('');
    setDosage('');
    setNotes('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Overview & Daily Adherence Tracker Header */}
      <div className="p-7 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-teal-500/10 blur-3xl pointer-events-none"
        />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/70 border border-teal-200/60 dark:border-teal-800/60 text-teal-800 dark:text-teal-300 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>On-Device Encrypted Cabinet · Zero Cloud Retention</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              My Medicine Cabinet
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {cabinet.length} active prescription & OTC therapies registered locally.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {cabinet.length >= 2 && (
              <button
                onClick={onCheckInteractions}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer touch-press shadow-xs ${
                  interactionAudit.overallRisk === 'Contraindicated' || interactionAudit.overallRisk === 'Severe'
                    ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-rose-600/20'
                    : 'bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800 hover:bg-amber-100'
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Interactions ({interactionAudit.pairs.length})</span>
              </button>
            )}

            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl bg-teal-700 hover:bg-teal-800 text-white shadow-sm shadow-teal-700/20 transition-all cursor-pointer touch-press"
            >
              <Plus className="w-4 h-4" />
              <span>Add Medication</span>
            </button>
          </div>
        </div>

        {/* Adherence Progress Bar */}
        {cabinet.length > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <CalendarCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                Daily Dose Adherence
              </span>
              <span className="font-mono text-slate-500 dark:text-slate-400">
                <strong className="text-slate-800 dark:text-slate-200">{takenCount}</strong> of {cabinet.length} taken today ({adherencePercent}%)
              </span>
            </div>

            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-teal-500 to-emerald-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${adherencePercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* High-Risk Interaction Alert Banner */}
      {cabinet.length >= 2 && interactionAudit.pairs.length > 0 && (
        <div
          onClick={onCheckInteractions}
          className={`p-5 rounded-2xl flex items-start justify-between gap-3 cursor-pointer transition-all touch-press shadow-xs border ${
            interactionAudit.overallRisk === 'Contraindicated' || interactionAudit.overallRisk === 'Severe'
              ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-rose-950 dark:text-rose-200'
              : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900 text-amber-950 dark:text-amber-200'
          }`}
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wide block">
                {interactionAudit.overallRisk} Drug-Drug Interaction Detected in Cabinet
              </span>
              <p className="text-xs mt-0.5 opacity-90 leading-relaxed font-medium">
                {interactionAudit.summary}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 shrink-0 opacity-70 mt-1" />
        </div>
      )}

      {/* Manual Entry Form */}
      {showAddForm && (
        <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Add Medication to Private Cabinet
            </h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white px-3 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Medication Name *
                </label>
                <input
                  type="text"
                  required
                  value={drugName}
                  onChange={(e) => setDrugName(e.target.value)}
                  placeholder="e.g. Atorvastatin or Lipitor"
                  className="w-full px-4 h-11 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Dosage / Strength
                </label>
                <input
                  type="text"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  placeholder="e.g. 20 mg tablet"
                  className="w-full px-4 h-11 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Dosing Frequency
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full px-4 h-11 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Once daily">Once daily</option>
                  <option value="Twice daily">Twice daily</option>
                  <option value="Three times daily">Three times daily</option>
                  <option value="Every 4-6 hours as needed">Every 4-6 hours as needed</option>
                  <option value="At bedtime">At bedtime</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Administration Routine
                </label>
                <input
                  type="text"
                  value={timing}
                  onChange={(e) => setTiming(e.target.value)}
                  placeholder="e.g. With breakfast, on empty stomach"
                  className="w-full px-4 h-11 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Prescriber Notes / Personal Instructions (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Prescribed by Dr. Rivera for cholesterol"
                className="w-full px-4 h-11 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={onOpenScanner}
                className="text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline cursor-pointer"
              >
                Or scan prescription label with camera →
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-colors cursor-pointer touch-press shadow-xs"
              >
                Save to Cabinet
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Medication List */}
      <div className="space-y-3">
        {cabinet.map((item) => {
          const matchedMonograph = findMonographByName(item.drugName);

          return (
            <div
              key={item.id}
              className={`p-6 rounded-2xl transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border ${
                item.takenToday
                  ? 'bg-slate-50/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-teal-400/50'
              }`}
            >
              <div className="flex items-start gap-4 flex-1">
                <button
                  onClick={() => onToggleTaken(item.id)}
                  className="mt-1 transition-transform cursor-pointer touch-press"
                  title={item.takenToday ? 'Mark as not taken today' : 'Mark as taken today'}
                >
                  {item.takenToday ? (
                    <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full border-2 border-slate-300 dark:border-slate-600 hover:border-teal-500 flex items-center justify-center transition-colors" />
                  )}
                </button>

                <div className="space-y-1">
                  <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 flex-wrap">
                    <span className="font-mono text-teal-700 dark:text-teal-300 font-bold">{item.dosage}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.frequency}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.timing}</span>
                  </div>

                  <h3 className={`text-base font-bold text-slate-900 dark:text-white ${item.takenToday ? 'opacity-85' : ''}`}>
                    {item.drugName}
                  </h3>

                  {item.notes && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                      "{item.notes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                {matchedMonograph && (
                  <button
                    onClick={() => onSelectMonograph(matchedMonograph)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-xs font-bold hover:bg-teal-100 dark:hover:bg-teal-900 transition-colors cursor-pointer touch-press"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Explain Drug</span>
                  </button>
                )}

                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer touch-press"
                  title="Remove from cabinet"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}

        {cabinet.length === 0 && (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
            <Pill className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Your Medicine Cabinet is empty
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Add your current medications to activate pairwise interaction audits and daily dosage tracking.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowAddForm(true)}
                className="px-5 py-2.5 rounded-xl bg-teal-700 text-white text-xs font-bold hover:bg-teal-800 transition-colors cursor-pointer touch-press shadow-xs"
              >
                Add Medication Manually
              </button>
              <button
                onClick={onOpenScanner}
                className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer touch-press"
              >
                Scan Bottle Label
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
