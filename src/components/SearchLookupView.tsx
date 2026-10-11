import React, { useState, useMemo } from 'react';
import { Search, ChevronRight, Plus, Shield, Sparkles, BookOpen, Check, Pill, Zap, AlertTriangle } from 'lucide-react';
import { MedicationMonograph } from '../types/medication';
import { searchMonographs } from '../services/interactionEngine';
import { CLINICAL_DATABASE } from '../data/clinicalDatabase';

interface SearchLookupViewProps {
  onSelectMonograph: (monograph: MedicationMonograph) => void;
  onAddToCabinet: (drugName: string, dosage: string, directions: string) => void;
  onOpenScanner: () => void;
}

export const SearchLookupView: React.FC<SearchLookupViewProps> = ({
  onSelectMonograph,
  onAddToCabinet,
  onOpenScanner,
}) => {
  const [query, setQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  const classes = useMemo(() => {
    const list = Array.from(new Set(CLINICAL_DATABASE.map(m => m.therapeuticClass.split(' ')[0])));
    return ['all', ...list];
  }, []);

  const results = useMemo(() => {
    let list = searchMonographs(query);
    if (selectedClass !== 'all') {
      list = list.filter(m => m.therapeuticClass.toLowerCase().includes(selectedClass.toLowerCase()));
    }
    return list;
  }, [query, selectedClass]);

  const handleQuickAdd = (med: MedicationMonograph, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCabinet(med.genericName, med.standardDosage, med.howToTake.instructions);
    setRecentlyAddedId(med.id);
    setTimeout(() => {
      setRecentlyAddedId(null);
    }, 2000);
  };

  return (
    <div className="space-y-8">
      {/* Premium Clinical Hero Banner */}
      <section className="relative rounded-3xl bg-gradient-to-br from-teal-900 via-slate-900 to-slate-950 text-white p-7 sm:p-10 overflow-hidden shadow-xl border border-teal-800/40">
        {/* Subtle decorative glow circles */}
        <div
          aria-hidden="true"
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-teal-500/20 blur-3xl pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"
        />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/15 border border-teal-400/30 text-teal-300 text-xs font-semibold backdrop-blur-sm">
            <Shield className="w-3.5 h-3.5 text-teal-400" />
            <span>Open-Source MedGemma Intelligence · 100% On-Device Privacy</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Clear Medication Explanations & Clinical Safety at Your Fingertips
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Understand how your prescriptions work, recognize tiered side effect warnings, and calculate multi-drug interactions with zero remote tracking or cloud storage.
          </p>

          <div className="pt-2 flex items-center gap-3 flex-wrap">
            <button
              onClick={onOpenScanner}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white text-xs font-bold shadow-lg shadow-teal-500/20 transition-all cursor-pointer touch-press h-11"
            >
              <Sparkles className="w-4 h-4 text-teal-100" />
              <span>Scan Prescription / Bottle Label</span>
            </button>

            <span className="text-xs text-slate-400">
              or browse {CLINICAL_DATABASE.length} clinical monographs below
            </span>
          </div>
        </div>

        {/* Quick Diagnostic Pill Tickers */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Zap className="w-4 h-4 text-teal-400 shrink-0" />
            <span>Instant 0ms Local DB</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>100% Offline Capable</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Pill className="w-4 h-4 text-sky-400 shrink-0" />
            <span>50+ Monograph Profiles</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>3-Tier Side Effect Risks</span>
          </div>
        </div>
      </section>

      {/* High-Intent Search Bar & Category Chips */}
      <section className="space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4.5 top-4.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search generic names, brand names, or conditions (e.g. Metformin, Lipitor, blood pressure, cholesterol)..."
            className="w-full pl-12 pr-24 h-14 text-sm sm:text-base rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-xs transition-all"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-4 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800"
            >
              Clear
            </button>
          ) : (
            <div className="absolute right-4 top-4.5 hidden sm:flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
              <span>esc</span>
            </div>
          )}
        </div>

        {/* Filter Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {classes.map((cls) => {
            const isSelected = selectedClass === cls;
            return (
              <button
                key={cls}
                onClick={() => setSelectedClass(cls)}
                className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer touch-press ${
                  isSelected
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {cls === 'all' ? 'All Classes' : cls}
              </button>
            );
          })}
        </div>
      </section>

      {/* Drug Cards Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
          <span className="font-medium">
            Showing <strong className="text-slate-800 dark:text-slate-200">{results.length}</strong> clinical monographs
          </span>
          <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Offline Verified Database Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.map((med) => {
            const isJustAdded = recentlyAddedId === med.id;

            return (
              <div
                key={med.id}
                onClick={() => onSelectMonograph(med)}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-teal-500/50 dark:hover:border-teal-500/50 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between touch-press"
              >
                <div className="space-y-3">
                  {/* Top Metadata Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/60">
                          {med.therapeuticClass}
                        </span>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {med.brandNames[0]}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                        {med.genericName}
                      </h3>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-teal-600 group-hover:text-white text-slate-500 flex items-center justify-center shrink-0 transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Mechanism Preview */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                    {med.mechanismOfAction}
                  </p>

                  {/* Primary Uses Tags */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Indications:</span>
                    {med.primaryUses.slice(0, 3).map((use, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                      >
                        {use}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    {med.howToTake.foodRequirement === 'with_food' ? 'Take with food' : 'Flexible timing'} · {med.standardDosage.split(' ')[0]} {med.standardDosage.split(' ')[1] || ''}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleQuickAdd(med, e)}
                      className={`h-8 px-2.5 rounded-lg flex items-center gap-1 text-xs font-semibold transition-all cursor-pointer touch-press ${
                        isJustAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-950 hover:text-teal-700 dark:hover:text-teal-300'
                      }`}
                      title="Save to My Cabinet"
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Saved</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Cabinet</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => onSelectMonograph(med)}
                      className="h-8 px-3 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold hover:bg-teal-600 hover:text-white transition-colors cursor-pointer"
                    >
                      Explain Drug
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {results.length === 0 && (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
            <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No matching medication found in offline core
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              You can scan your physical bottle label using MedGemma OCR or add a custom medication directly to your private cabinet.
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={onOpenScanner}
                className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold transition-colors cursor-pointer touch-press shadow-sm"
              >
                Scan Pill Bottle
              </button>
              <button
                onClick={() => setQuery('')}
                className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 transition-colors cursor-pointer touch-press"
              >
                Reset Search
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
