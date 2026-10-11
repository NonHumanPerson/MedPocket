export type SideEffectSeverityLevel = 'mild' | 'moderate' | 'urgent';

export interface SideEffectsGroup {
  mild: string[];
  moderate: string[];
  urgent: string[];
}

export interface HowToTakeInfo {
  foodRequirement: 'with_food' | 'empty_stomach' | 'either';
  instructions: string;
  bestTimeOfDay: string;
  missedDoseAdvice: string;
}

export interface DrugInteraction {
  interactingDrug: string;
  severity: 'Contraindicated' | 'Severe' | 'Moderate' | 'Minor';
  effect: string;
  recommendation: string;
}

export interface MedicationMonograph {
  id: string;
  genericName: string;
  brandNames: string[];
  therapeuticClass: string;
  primaryUses: string[];
  mechanismOfAction: string;
  standardDosage: string;
  howToTake: HowToTakeInfo;
  sideEffects: SideEffectsGroup;
  warnings: {
    blackBox?: string;
    alcoholWarning: string;
    foodWarnings: string[];
    pregnancyCaution: string;
  };
  knownInteractions: DrugInteraction[];
}

export interface UserCabinetItem {
  id: string;
  medicationId: string;
  drugName: string;
  dosage: string;
  frequency: string;
  timing: string;
  notes?: string;
  dateAdded: string;
  takenToday?: boolean;
}

export interface InteractionCheckResult {
  overallRisk: 'Low' | 'Moderate' | 'Severe' | 'Contraindicated';
  summary: string;
  pairs: {
    drugA: string;
    drugB: string;
    severity: 'Contraindicated' | 'Severe' | 'Moderate' | 'Minor';
    clinicalEffect: string;
    actionRecommendation: string;
  }[];
  monitoringTips: string[];
  isAiEnhanced?: boolean;
}

export interface MedGemmaAnalysisResult {
  detectedDrugName?: string;
  genericEquivalent?: string;
  strength?: string;
  dosageForm?: string;
  prescribedDirections?: string;
  warningsOnLabel?: string[];
  whatThisMedicineDoes?: string;
  sideEffects?: SideEffectsGroup;
  foodAndDrinkAlerts?: string[];
  confidence?: 'high' | 'medium' | 'low';
  safetyNotes?: string;
  rawText?: string;
  modelUsed?: string;
}
