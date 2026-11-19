import 'package:freezed_annotation/freezed_annotation.dart';

part 'ayurveda.freezed.dart';

@freezed
class AyurvedicMapping with _$AyurvedicMapping {
  const factory AyurvedicMapping({
    required String id,
    required List<String> modernDrugIds,
    List<String>? atcCodes,
    required AyurvedicFormulation formulation,
    required String traditionalUse,
    required String preparationAndDose,
    required EvidenceGrade evidence,
    required SafetyProfile safety,
    required VerificationStatus verification,
    required String disclaimer,
  }) = _AyurvedicMapping;

  factory AyurvedicMapping.fromJson(Map<String, dynamic> json) =>
      _$AyurvedicMappingFromJson(json);
}

@freezed
class AyurvedicFormulation with _$AyurvedicFormulation {
  const factory AyurvedicFormulation({
    required String nameSanskrit,
    required String nameCommon,
    String? classicalSource,
    String? pharmacopoeiaRef,
    required List<Ingredient> ingredients,
  }) = _AyurvedicFormulation;

  factory AyurvedicFormulation.fromJson(Map<String, dynamic> json) =>
      _$AyurvedicFormulationFromJson(json);
}

@freezed
class Ingredient with _$Ingredient {
  const factory Ingredient({
    required String botanical,
    required String part,
    String? dose,
  }) = _Ingredient;

  factory Ingredient.fromJson(Map<String, dynamic> json) =>
      _$IngredientFromJson(json);
}

@freezed
class EvidenceGrade with _$EvidenceGrade {
  const factory EvidenceGrade({
    required String grade,
    required String summary,
    required List<Citation> citations,
  }) = _EvidenceGrade;

  factory EvidenceGrade.fromJson(Map<String, dynamic> json) =>
      _$EvidenceGradeFromJson(json);
}

@freezed
class Citation with _$Citation {
  const factory Citation({
    required String type,
    required String ref,
    String? url,
  }) = _Citation;

  factory Citation.fromJson(Map<String, dynamic> json) =>
      _$CitationFromJson(json);
}

@freezed
class SafetyProfile with _$SafetyProfile {
  const factory SafetyProfile({
    required String interactionSeverity,
    required List<String> interactionNotes,
    required List<String> contraindications,
    required String pregnancy,
    @Default(false) bool narrowTherapeuticIndex,
  }) = _SafetyProfile;

  factory SafetyProfile.fromJson(Map<String, dynamic> json) =>
      _$SafetyProfileFromJson(json);
}

@freezed
class VerificationStatus with _$VerificationStatus {
  const factory VerificationStatus({
    required String status,
    String? reviewedBy,
    String? credentials,
    String? reviewedAt,
    required String lastUpdated,
    required int version,
  }) = _VerificationStatus;

  factory VerificationStatus.fromJson(Map<String, dynamic> json) =>
      _$VerificationStatusFromJson(json);
}
