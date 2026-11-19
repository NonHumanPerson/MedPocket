import 'package:freezed_annotation/freezed_annotation.dart';

part 'medication.freezed.dart';

@freezed
class MedicationMonograph with _$MedicationMonograph {
  const factory MedicationMonograph({
    required String id,
    required String genericName,
    required List<String> brandNames,
    required String therapeuticClass,
    required List<String> primaryUses,
    required String mechanismOfAction,
    required String standardDosage,
    required HowToTakeInfo howToTake,
    required SideEffectsGroup sideEffects,
    required Warnings warnings,
    required List<DrugInteraction> knownInteractions,
    required List<String> atcCodes,
    required String source,
    required String lastUpdated,
    required int version,
  }) = _MedicationMonograph;

  factory MedicationMonograph.fromJson(Map<String, dynamic> json) =>
      _$MedicationMonographFromJson(json);
}

@freezed
class HowToTakeInfo with _$HowToTakeInfo {
  const factory HowToTakeInfo({
    required String foodRequirement,
    required String instructions,
    required String bestTimeOfDay,
    required String missedDoseAdvice,
  }) = _HowToTakeInfo;

  factory HowToTakeInfo.fromJson(Map<String, dynamic> json) =>
      _$HowToTakeInfoFromJson(json);
}

@freezed
class SideEffectsGroup with _$SideEffectsGroup {
  const factory SideEffectsGroup({
    required List<String> mild,
    required List<String> moderate,
    required List<String> urgent,
  }) = _SideEffectsGroup;

  factory SideEffectsGroup.fromJson(Map<String, dynamic> json) =>
      _$SideEffectsGroupFromJson(json);
}

@freezed
class Warnings with _$Warnings {
  const factory Warnings({
    String? blackBox,
    required String alcoholWarning,
    required List<String> foodWarnings,
    required String pregnancyCaution,
  }) = _Warnings;

  factory Warnings.fromJson(Map<String, dynamic> json) =>
      _$WarningsFromJson(json);
}

@freezed
class DrugInteraction with _$DrugInteraction {
  const factory DrugInteraction({
    required String interactingDrug,
    required String severity,
    required String effect,
    required String recommendation,
  }) = _DrugInteraction;

  factory DrugInteraction.fromJson(Map<String, dynamic> json) =>
      _$DrugInteractionFromJson(json);
}

@freezed
class UserCabinetItem with _$UserCabinetItem {
  const factory UserCabinetItem({
    required String id,
    required String medicationId,
    required String drugName,
    required String dosage,
    required String frequency,
    required String timing,
    String? notes,
    required String dateAdded,
    @Default(false) bool takenToday,
  }) = _UserCabinetItem;

  factory UserCabinetItem.fromJson(Map<String, dynamic> json) =>
      _$UserCabinetItemFromJson(json);
}

@freezed
class InteractionCheckResult with _$InteractionCheckResult {
  const factory InteractionCheckResult({
    required String overallRisk,
    required String summary,
    required List<InteractionPair> pairs,
    required List<String> monitoringTips,
    @Default(false) bool isAiEnhanced,
  }) = _InteractionCheckResult;

  factory InteractionCheckResult.fromJson(Map<String, dynamic> json) =>
      _$InteractionCheckResultFromJson(json);
}

@freezed
class InteractionPair with _$InteractionPair {
  const factory InteractionPair({
    required String drugA,
    required String drugB,
    required String severity,
    required String clinicalEffect,
    required String actionRecommendation,
  }) = _InteractionPair;

  factory InteractionPair.fromJson(Map<String, dynamic> json) =>
      _$InteractionPairFromJson(json);
}

@freezed
class OcrResult with _$OcrResult {
  const factory OcrResult({
    required String text,
    required double confidence,
    required List<String> detectedDrugNames,
  }) = _OcrResult;

  factory OcrResult.fromJson(Map<String, dynamic> json) =>
      _$OcrResultFromJson(json);
}
