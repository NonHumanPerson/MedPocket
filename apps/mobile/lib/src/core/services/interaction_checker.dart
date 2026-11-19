import '../models/medication.dart';

/// Narrow therapeutic index drugs that require special safety handling
const Set<String> _narrowTherapeuticIndexDrugs = {
  'warfarin',
  'insulin_glargine',
  'lithium', // Not in our DB but good to have
  'digoxin', // Not in our DB but good to have
  'phenytoin',
  'carbamazepine',
  'valproate',
  'theophylline',
  'cyclosporine',
  'tacrolimus',
  'sirolimus',
};

/// Check if a drug is narrow therapeutic index
bool isNarrowTherapeuticIndex(String drugId) {
  return _narrowTherapeuticIndexDrugs.contains(drugId.toLowerCase());
}

/// Check if any drug in the list is narrow therapeutic index
bool hasNarrowTherapeuticIndexDrug(List<String> drugIds) {
  return drugIds.any(isNarrowTherapeuticIndex);
}

/// Severity ordering for comparison
int _severityRank(String severity) {
  switch (severity.toLowerCase()) {
    case 'contraindicated': return 4;
    case 'severe': return 3;
    case 'moderate': return 2;
    case 'minor': return 1;
    default: return 0;
  }
}

/// Determine overall risk from a list of interaction pairs
String _calculateOverallRisk(List<InteractionPair> pairs) {
  if (pairs.isEmpty) return 'Low';
  
  final maxSeverity = pairs.map((p) => _severityRank(p.severity)).reduce((a, b) => a > b ? a : b);
  
  switch (maxSeverity) {
    case 4: return 'Contraindicated';
    case 3: return 'Severe';
    case 2: return 'Moderate';
    case 1: return 'Moderate'; // Even minor interactions warrant moderate caution
    default: return 'Low';
  }
}

/// Generate summary based on overall risk and pairs
String _generateSummary(String overallRisk, List<InteractionPair> pairs, List<String> drugNames) {
  if (pairs.isEmpty) {
    return 'No known interactions detected among ${drugNames.join(', ')} in the offline clinical database.';
  }
  
  switch (overallRisk) {
    case 'Contraindicated':
      return 'CRITICAL ALERT: Combination contains contraindicated drug pairings. '
          'Contact your physician or pharmacist immediately before taking these together. '
          'Pairs: ${pairs.where((p) => p.severity == 'Contraindicated').map((p) => '${p.drugA} + ${p.drugB}').join('; ')}';
    case 'Severe':
      return 'HIGH RISK: Significant pharmacological interactions detected that may require dose modification or alternative therapy. '
          'Consult your healthcare provider before combining. '
          'Pairs: ${pairs.where((p) => _severityRank(p.severity) >= 3).map((p) => '${p.drugA} + ${p.drugB}').join('; ')}';
    case 'Moderate':
      return 'MODERATE CAUTION: Mild to moderate interactions found. '
          'Spacing dose administration or additional lab monitoring may be recommended. '
          'Pairs: ${pairs.map((p) => '${p.drugA} + ${p.drugB} (${p.severity})').join('; ')}';
    default:
      return 'Low risk interaction profile detected.';
  }
}

/// Default monitoring tips
const List<String> _defaultMonitoringTips = [
  'Take medications with water unless directed otherwise by your pharmacist.',
  'Inform prescribing doctors and dentists about your full current medication list.',
  'Check over-the-counter NSAIDs (e.g., ibuprofen, naproxen) which frequently interact with prescription drugs.',
  'Report any unusual symptoms or persistent side effects to your physician.',
  'Maintain an updated list of all medications and supplements.',
];

/// Offline drug-drug interaction checker using local database
Future<InteractionCheckResult> checkOfflineInteractions(List<String> medicationNames) async {
  // Load medications from data loader
  // Note: In actual implementation, this would use DataLoader
  // For now, we'll use a simplified approach that can work with pre-loaded data
  
  final cleanNames = medicationNames
      .map((n) => n.trim())
      .where((n) => n.isNotEmpty)
      .toList();
  
  if (cleanNames.length < 2) {
    return InteractionCheckResult(
      overallRisk: 'Low',
      summary: 'Add at least 2 medications to check for drug-drug interactions.',
      pairs: [],
      monitoringTips: _defaultMonitoringTips,
      isAiEnhanced: false,
    );
  }

  // This is a placeholder - the actual implementation would use DataLoader
  // to find monographs and check their knownInteractions
  // For now, return a basic result that can be enhanced when DataLoader is integrated
  
  final pairs = <InteractionPair>[];
  
  // Check for known high-risk combinations (hardcoded for critical pairs)
  final lowerNames = cleanNames.map((n) => n.toLowerCase()).toSet();
  
  // Warfarin interactions
  if (lowerNames.contains('warfarin')) {
    for (final other in lowerNames) {
      if (other == 'warfarin') continue;
      if (['ibuprofen', 'amoxicillin', 'azithromycin', 'metronidazole'].contains(other)) {
        pairs.add(InteractionPair(
          drugA: 'Warfarin',
          drugB: other.capitalize(),
          severity: other == 'ibuprofen' ? 'Severe' : 'Moderate',
          clinicalEffect: other == 'ibuprofen' 
              ? 'Additive bleeding risk (antiplatelet + anticoagulant + GI irritation)'
              : 'Reduced vitamin K production by gut flora, increasing INR',
          actionRecommendation: other == 'ibuprofen'
              ? 'Avoid combination; use paracetamol for pain. If aspirin indicated, monitor INR closely.'
              : 'Monitor INR 3-5 days after starting/stopping antibiotics.',
        ));
      }
    }
  }
  
  // ACE inhibitor + potassium interactions
  if (lowerNames.contains('lisinopril')) {
    for (final other in lowerNames) {
      if (other == 'lisinopril') continue;
      if (['potassium', 'spironolactone', 'triamterene', 'amiloride'].contains(other)) {
        pairs.add(InteractionPair(
          drugA: 'Lisinopril',
          drugB: other.capitalize(),
          severity: 'Severe',
          clinicalEffect: 'Risk of life-threatening hyperkalemia',
          actionRecommendation: 'Monitor serum potassium closely; avoid combination if possible.',
        ));
      }
    }
  }
  
  // Statin + fibrate
  if (lowerNames.contains('atorvastatin')) {
    for (final other in lowerNames) {
      if (other == 'atorvastatin') continue;
      if (['gemfibrozil', 'fenofibrate'].contains(other)) {
        pairs.add(InteractionPair(
          drugA: 'Atorvastatin',
          drugB: other.capitalize(),
          severity: other == 'gemfibrozil' ? 'Severe' : 'Moderate',
          clinicalEffect: 'Markedly increased risk of rhabdomyolysis',
          actionRecommendation: other == 'gemfibrozil'
              ? 'Avoid combination; use fenofibrate if fibrate needed.'
              : 'Monitor for muscle symptoms; consider dose reduction.',
        ));
      }
    }
  }
  
  // Beta-blocker + verapamil/diltiazem
  if (lowerNames.contains('metoprolol')) {
    for (final other in lowerNames) {
      if (other == 'metoprolol') continue;
      if (['verapamil', 'diltiazem'].contains(other)) {
        pairs.add(InteractionPair(
          drugA: 'Metoprolol',
          drugB: other.capitalize(),
          severity: 'Severe',
          clinicalEffect: 'Additive negative chronotropic/ionotropic effects - severe bradycardia, heart block, hypotension',
          actionRecommendation: 'Avoid combination; if needed, monitor ECG and hemodynamics closely.',
        ));
      }
    }
  }
  
  // Methotrexate interactions
  if (lowerNames.contains('methotrexate')) {
    for (final other in lowerNames) {
      if (other == 'methotrexate') continue;
      if (['ibuprofen', 'amoxicillin', 'omeprazole'].contains(other)) {
        pairs.add(InteractionPair(
          drugA: 'Methotrexate',
          drugB: other.capitalize(),
          severity: 'Severe',
          clinicalEffect: 'Decreased methotrexate clearance, increasing toxicity',
          actionRecommendation: 'Avoid concurrent use; if unavoidable, monitor methotrexate levels closely.',
        ));
      }
    }
  }
  
  // Lithium interactions
  if (lowerNames.contains('lithium')) {
    for (final other in lowerNames) {
      if (other == 'lithium') continue;
      if (['lisinopril', 'hydrochlorothiazide', 'ibuprofen', 'metoprolol'].contains(other)) {
        pairs.add(InteractionPair(
          drugA: 'Lithium',
          drugB: other.capitalize(),
          severity: 'Severe',
          clinicalEffect: 'Increased lithium levels and toxicity risk',
          actionRecommendation: 'Avoid combination; if necessary, monitor lithium levels frequently.',
        ));
      }
    }
  }

  final overallRisk = _calculateOverallRisk(pairs);
  final summary = _generateSummary(overallRisk, pairs, cleanNames);
  
  return InteractionCheckResult(
    overallRisk: overallRisk,
    summary: summary,
    pairs: pairs,
    monitoringTips: _defaultMonitoringTips,
    isAiEnhanced: false,
  );
}

/// Enhanced interaction check with full database integration
/// This would be called when medications are loaded from DataLoader
Future<InteractionCheckResult> checkInteractionsWithDatabase(
  List<String> medicationNames,
  List<MedicationMonograph> database,
) async {
  final cleanNames = medicationNames
      .map((n) => n.trim())
      .where((n) => n.isNotEmpty)
      .toList();
  
  if (cleanNames.length < 2) {
    return InteractionCheckResult(
      overallRisk: 'Low',
      summary: 'Add at least 2 medications to check for drug-drug interactions.',
      pairs: [],
      monitoringTips: _defaultMonitoringTips,
      isAiEnhanced: false,
    );
  }

  // Find monographs for each input
  final foundMeds = <String, MedicationMonograph>{};
  for (final name in cleanNames) {
    final lowerName = name.toLowerCase();
    for (final med in database) {
      if (med.id.toLowerCase() == lowerName ||
          med.genericName.toLowerCase().contains(lowerName) ||
          med.brandNames.any((b) => b.toLowerCase().contains(lowerName))) {
        foundMeds[name] = med;
        break;
      }
    }
  }

  final pairs = <InteractionPair>[];
  final inputList = cleanNames.toList();
  
  // Compare every pair
  for (int i = 0; i < inputList.length; i++) {
    for (int j = i + 1; j < inputList.length; j++) {
      final nameA = inputList[i];
      final nameB = inputList[j];
      final medA = foundMeds[nameA];
      final medB = foundMeds[nameB];
      
      // Check medA's interactions for medB
      if (medA != null) {
        for (final inter in medA.knownInteractions) {
          if (_matchesInteraction(inter.interactingDrug, nameB, medB)) {
            pairs.add(InteractionPair(
              drugA: medA.genericName,
              drugB: medB?.genericName ?? nameB,
              severity: inter.severity,
              clinicalEffect: inter.effect,
              actionRecommendation: inter.recommendation,
            ));
            break; // One match per pair is enough
          }
        }
      }
      
      // Check reverse if not already matched
      final alreadyMatched = pairs.any((p) => 
          (p.drugA == (medA?.genericName ?? nameA) && p.drugB == (medB?.genericName ?? nameB)) ||
          (p.drugA == (medB?.genericName ?? nameB) && p.drugB == (medA?.genericName ?? nameA)));
      
      if (!alreadyMatched && medB != null) {
        for (final inter in medB.knownInteractions) {
          if (_matchesInteraction(inter.interactingDrug, nameA, medA)) {
            pairs.add(InteractionPair(
              drugA: medB.genericName,
              drugB: medA?.genericName ?? nameA,
              severity: inter.severity,
              clinicalEffect: inter.effect,
              actionRecommendation: inter.recommendation,
            ));
            break;
          }
        }
      }
    }
  }

  final overallRisk = _calculateOverallRisk(pairs);
  final summary = _generateSummary(overallRisk, pairs, cleanNames);
  
  return InteractionCheckResult(
    overallRisk: overallRisk,
    summary: summary,
    pairs: pairs,
    monitoringTips: _defaultMonitoringTips,
    isAiEnhanced: false,
  );
}

/// Check if an interaction target matches a drug name or its monograph
bool _matchesInteraction(String target, String inputName, MedicationMonograph? monograph) {
  final targetLower = target.toLowerCase();
  final inputLower = inputName.toLowerCase();
  
  if (inputLower.contains(targetLower) || targetLower.contains(inputLower)) {
    return true;
  }
  
  if (monograph != null) {
    final genericLower = monograph.genericName.toLowerCase();
    if (genericLower.contains(targetLower) || targetLower.contains(genericLower)) {
      return true;
    }
    
    for (final brand in monograph.brandNames) {
      final brandLower = brand.toLowerCase();
      if (brandLower.contains(targetLower) || targetLower.contains(brandLower)) {
        return true;
      }
    }
  }
  
  return false;
}

extension StringExtension on String {
  String capitalize() {
    if (isEmpty) return this;
    return '${this[0].toUpperCase()}${substring(1)}';
  }
}