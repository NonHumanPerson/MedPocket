import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:hive/hive.dart';

part 'medication.freezed.dart';
part 'medication.g.dart';

@freezed
@HiveType(typeId: 0, adapterName: 'MedicationMonographAdapter')
class MedicationMonograph with _$MedicationMonograph {
  const factory MedicationMonograph({
    @HiveField(0) required String id,
    @HiveField(1) required String genericName,
    @HiveField(2) required List<String> brandNames,
    @HiveField(3) required String therapeuticClass,
    @HiveField(4) required List<String> primaryUses,
    @HiveField(5) required String mechanismOfAction,
    @HiveField(6) required String standardDosage,
    @HiveField(7) required HowToTakeInfo howToTake,
    @HiveField(8) required SideEffectsGroup sideEffects,
    @HiveField(9) required Warnings warnings,
    @HiveField(10) required List<DrugInteraction> knownInteractions,
    @HiveField(11) required List<String> atcCodes,
    @HiveField(12) required String source,
    @HiveField(13) required String lastUpdated,
    @HiveField(14) required int version,
  }) = _MedicationMonograph;

  factory MedicationMonograph.fromJson(Map<String, dynamic> json) =>
      _$MedicationMonographFromJson(json);
}

@freezed
@HiveType(typeId: 1, adapterName: 'HowToTakeInfoAdapter')
class HowToTakeInfo with _$HowToTakeInfo {
  const factory HowToTakeInfo({
    @HiveField(0) required String foodRequirement,
    @HiveField(1) required String instructions,
    @HiveField(2) required String bestTimeOfDay,
    @HiveField(3) required String missedDoseAdvice,
  }) = _HowToTakeInfo;

  factory HowToTakeInfo.fromJson(Map<String, dynamic> json) =>
      _$HowToTakeInfoFromJson(json);
}

@freezed
@HiveType(typeId: 2, adapterName: 'SideEffectsGroupAdapter')
class SideEffectsGroup with _$SideEffectsGroup {
  const factory SideEffectsGroup({
    @HiveField(0) required List<String> mild,
    @HiveField(1) required List<String> moderate,
    @HiveField(2) required List<String> urgent,
  }) = _SideEffectsGroup;

  factory SideEffectsGroup.fromJson(Map<String, dynamic> json) =>
      _$SideEffectsGroupFromJson(json);
}

@freezed
@HiveType(typeId: 3, adapterName: 'WarningsAdapter')
class Warnings with _$Warnings {
  const factory Warnings({
    @HiveField(0) String? blackBox,
    @HiveField(1) required String alcoholWarning,
    @HiveField(2) required List<String> foodWarnings,
    @HiveField(3) required String pregnancyCaution,
  }) = _Warnings;

  factory Warnings.fromJson(Map<String, dynamic> json) =>
      _$WarningsFromJson(json);
}

@freezed
@HiveType(typeId: 4, adapterName: 'DrugInteractionAdapter')
class DrugInteraction with _$DrugInteraction {
  const factory DrugInteraction({
    @HiveField(0) required String interactingDrug,
    @HiveField(1) required String severity,
    @HiveField(2) required String effect,
    @HiveField(3) required String recommendation,
  }) = _DrugInteraction;

  factory DrugInteraction.fromJson(Map<String, dynamic> json) =>
      _$DrugInteractionFromJson(json);
}

@freezed
@HiveType(typeId: 5, adapterName: 'UserCabinetItemAdapter')
class UserCabinetItem with _$UserCabinetItem {
  const factory UserCabinetItem({
    @HiveField(0) required String id,
    @HiveField(1) required String medicationId,
    @HiveField(2) required String drugName,
    @HiveField(3) required String dosage,
    @HiveField(4) required String frequency,
    @HiveField(5) required String timing,
    @HiveField(6) String? notes,
    @HiveField(7) required String dateAdded,
    @HiveField(8) @Default(false) bool takenToday,
  }) = _UserCabinetItem;

  factory UserCabinetItem.fromJson(Map<String, dynamic> json) =>
      _$UserCabinetItemFromJson(json);
}

@freezed
@HiveType(typeId: 6, adapterName: 'InteractionCheckResultAdapter')
class InteractionCheckResult with _$InteractionCheckResult {
  const factory InteractionCheckResult({
    @HiveField(0) required String overallRisk,
    @HiveField(1) required String summary,
    @HiveField(2) required List<InteractionPair> pairs,
    @HiveField(3) required List<String> monitoringTips,
    @HiveField(4) @Default(false) bool isAiEnhanced,
  }) = _InteractionCheckResult;

  factory InteractionCheckResult.fromJson(Map<String, dynamic> json) =>
      _$InteractionCheckResultFromJson(json);
}

@freezed
@HiveType(typeId: 7, adapterName: 'InteractionPairAdapter')
class InteractionPair with _$InteractionPair {
  const factory InteractionPair({
    @HiveField(0) required String drugA,
    @HiveField(1) required String drugB,
    @HiveField(2) required String severity,
    @HiveField(3) required String clinicalEffect,
    @HiveField(4) required String actionRecommendation,
  }) = _InteractionPair;

  factory InteractionPair.fromJson(Map<String, dynamic> json) =>
      _$InteractionPairFromJson(json);
}

@freezed
@HiveType(typeId: 8, adapterName: 'OcrResultAdapter')
class OcrResult with _$OcrResult {
  const factory OcrResult({
    @HiveField(0) required String text,
    @HiveField(1) required double confidence,
    @HiveField(2) required List<String> detectedDrugNames,
  }) = _OcrResult;

  factory OcrResult.fromJson(Map<String, dynamic> json) =>
      _$OcrResultFromJson(json);
}