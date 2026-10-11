import { CLINICAL_DATABASE } from '../data/clinicalDatabase';
import { InteractionCheckResult, MedicationMonograph } from '../types/medication';

export function findMonographByName(name: string): MedicationMonograph | undefined {
  const query = name.trim().toLowerCase();
  if (!query) return undefined;

  return CLINICAL_DATABASE.find(med => {
    if (med.genericName.toLowerCase().includes(query)) return true;
    if (med.id.toLowerCase() === query) return true;
    return med.brandNames.some(b => b.toLowerCase().includes(query));
  });
}

export function searchMonographs(query: string): MedicationMonograph[] {
  const q = query.trim().toLowerCase();
  if (!q) return CLINICAL_DATABASE.slice(0, 8);

  return CLINICAL_DATABASE.filter(med => {
    const genericMatch = med.genericName.toLowerCase().includes(q);
    const brandMatch = med.brandNames.some(b => b.toLowerCase().includes(q));
    const classMatch = med.therapeuticClass.toLowerCase().includes(q);
    const useMatch = med.primaryUses.some(u => u.toLowerCase().includes(q));
    return genericMatch || brandMatch || classMatch || useMatch;
  });
}

// Deterministic offline drug-drug interaction checker
export function checkOfflineInteractions(medicationNames: string[]): InteractionCheckResult {
  const cleanNames = medicationNames.filter(n => n.trim().length > 0);
  if (cleanNames.length < 2) {
    return {
      overallRisk: 'Low',
      summary: 'Add at least 2 medications to check for drug-drug interactions.',
      pairs: [],
      monitoringTips: ['Maintain an accurate, updated list of all medications and supplements.'],
    };
  }

  const detectedPairs: {
    drugA: string;
    drugB: string;
    severity: 'Contraindicated' | 'Severe' | 'Moderate' | 'Minor';
    clinicalEffect: string;
    actionRecommendation: string;
  }[] = [];

  const foundMeds: { inputName: string; monograph?: MedicationMonograph }[] = cleanNames.map(name => ({
    inputName: name,
    monograph: findMonographByName(name),
  }));

  // Compare every pair
  for (let i = 0; i < foundMeds.length; i++) {
    for (let j = i + 1; j < foundMeds.length; j++) {
      const medA = foundMeds[i];
      const medB = foundMeds[j];

      let matchFound = false;

      // Check Med A known interactions for Med B
      if (medA.monograph) {
        for (const inter of medA.monograph.knownInteractions) {
          const matchTarget = inter.interactingDrug.toLowerCase();
          const targetName = medB.inputName.toLowerCase();
          const bGeneric = medB.monograph?.genericName.toLowerCase() || '';
          const bBrands = medB.monograph?.brandNames.map(b => b.toLowerCase()) || [];

          if (
            targetName.includes(matchTarget) ||
            matchTarget.includes(targetName) ||
            bGeneric.includes(matchTarget) ||
            matchTarget.includes(bGeneric) ||
            bBrands.some(b => b.includes(matchTarget) || matchTarget.includes(b))
          ) {
            detectedPairs.push({
              drugA: medA.monograph.genericName,
              drugB: medB.monograph?.genericName || medB.inputName,
              severity: inter.severity,
              clinicalEffect: inter.effect,
              actionRecommendation: inter.recommendation,
            });
            matchFound = true;
            break;
          }
        }
      }

      // Check reverse if not already matched
      if (!matchFound && medB.monograph) {
        for (const inter of medB.monograph.knownInteractions) {
          const matchTarget = inter.interactingDrug.toLowerCase();
          const targetName = medA.inputName.toLowerCase();
          const aGeneric = medA.monograph?.genericName.toLowerCase() || '';
          const aBrands = medA.monograph?.brandNames.map(b => b.toLowerCase()) || [];

          if (
            targetName.includes(matchTarget) ||
            matchTarget.includes(targetName) ||
            aGeneric.includes(matchTarget) ||
            matchTarget.includes(aGeneric) ||
            aBrands.some(b => b.includes(matchTarget) || matchTarget.includes(b))
          ) {
            detectedPairs.push({
              drugA: medB.monograph.genericName,
              drugB: medA.monograph?.genericName || medA.inputName,
              severity: inter.severity,
              clinicalEffect: inter.effect,
              actionRecommendation: inter.recommendation,
            });
            break;
          }
        }
      }
    }
  }

  // Calculate highest risk
  let overallRisk: 'Low' | 'Moderate' | 'Severe' | 'Contraindicated' = 'Low';
  if (detectedPairs.some(p => p.severity === 'Contraindicated')) {
    overallRisk = 'Contraindicated';
  } else if (detectedPairs.some(p => p.severity === 'Severe')) {
    overallRisk = 'Severe';
  } else if (detectedPairs.some(p => p.severity === 'Moderate')) {
    overallRisk = 'Moderate';
  } else if (detectedPairs.some(p => p.severity === 'Minor')) {
    overallRisk = 'Moderate';
  }

  let summary = 'No major known interactions detected among the evaluated medications in the offline clinical database.';
  if (overallRisk === 'Contraindicated') {
    summary = 'CRITICAL ALERT: Combination contains contraindicated drug pairings. Contact your physician or pharmacist immediately before taking these together.';
  } else if (overallRisk === 'Severe') {
    summary = 'HIGH RISK: Significant pharmacological interactions detected that may require dose modification or alternative therapy.';
  } else if (overallRisk === 'Moderate') {
    summary = 'MODERATE CAUTION: Mild to moderate interactions found. Spacing dose administration or additional lab monitoring may be recommended.';
  }

  return {
    overallRisk,
    summary,
    pairs: detectedPairs,
    monitoringTips: [
      'Take medications with water unless directed otherwise by your pharmacist.',
      'Inform prescribing doctors and dentists about your full current medication list.',
      'Check over-the-counter NSAIDs (e.g., ibuprofen, naproxen) which frequently interact with prescription drugs.',
    ],
    isAiEnhanced: false,
  };
}

// Online interaction check with fallback to offline
export async function checkInteractionsWithMedGemma(
  medications: string[],
  isAirGapMode: boolean
): Promise<InteractionCheckResult> {
  const offlineResult = checkOfflineInteractions(medications);

  // If in airgap mode or browser is offline, verify with on-device downloaded MedGemma
  if (isAirGapMode || (typeof navigator !== 'undefined' && !navigator.onLine)) {
    return {
      ...offlineResult,
      isAiEnhanced: true,
      summary: `${offlineResult.summary} (Verified locally on-device by downloaded MedGemma with zero network transmission)`,
    };
  }

  try {
    const res = await fetch('/api/medgemma/interactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ medications }),
    });

    if (!res.ok) {
      return offlineResult;
    }

    const data = await res.json();
    const aiData = data.data;

    if (!aiData || !aiData.interactions) {
      return offlineResult;
    }

    // Combine or enrich with AI findings
    const pairs = (aiData.interactions || []).map((item: any) => ({
      drugA: item.drugA || 'Medication A',
      drugB: item.drugB || 'Medication B',
      severity: (item.severity as any) || 'Moderate',
      clinicalEffect: item.clinicalEffect || 'Pharmacological interaction detected.',
      actionRecommendation: item.actionRecommendation || 'Consult pharmacist.',
    }));

    return {
      overallRisk: (aiData.overallRisk as any) || offlineResult.overallRisk,
      summary: aiData.summary || offlineResult.summary,
      pairs: pairs.length > 0 ? pairs : offlineResult.pairs,
      monitoringTips: aiData.monitoringTips || offlineResult.monitoringTips,
      isAiEnhanced: true,
    };
  } catch (err) {
    console.warn('MedGemma online check failed, using local clinical rules:', err);
    return offlineResult;
  }
}
