import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:hive/hive.dart';

part 'ayurveda.freezed.dart';
part 'ayurveda.g.dart';

@freezed
@HiveType(typeId: 10, adapterName: 'AyurvedicMappingAdapter')
class AyurvedicMapping with _$AyurvedicMapping {
  const factory AyurvedicMapping({
    @HiveField(0) required String id,
    @HiveField(1) required List<String> modernDrugIds,
    @HiveField(2) List<String>? atcCodes,
    @HiveField(3) required AyurvedicFormulation formulation,
    @HiveField(4) required String traditionalUse,
    @HiveField(5) required String preparationAndDose,
    @HiveField(6) required EvidenceGrade evidence,
    @HiveField(7) required SafetyProfile safety,
    @HiveField(8) required VerificationStatus verification,
    @HiveField(9) required String disclaimer,
  }) = _AyurvedicMapping;

  factory AyurvedicMapping.fromJson(Map<String, dynamic> json) =>
      _$AyurvedicMappingFromJson(json);
}

@freezed
@HiveType(typeId: 11, adapterName: 'AyurvedicFormulationAdapter')
class AyurvedicFormulation with _$AyurvedicFormulation {
  const factory AyurvedicFormulation({
    @HiveField(0) required String nameSanskrit,
    @HiveField(1) required String nameCommon,
    @HiveField(1) String? classicalSource,
    @HiveField(2) String? pharmacopoeiaRef,
    @HiveField(3) required List<Ingredient> ingredients,
  }) = _AyurvedicFormulation;

  factory AyurvedicFormulation.fromJson(Map<String, dynamic> json) =>
      _$AyurvedicFormulationFromJson(json);
}

@freezed
@HiveType(typeId: 12, adapterName: 'IngredientAdapter')
class Ingredient with _$Ingredient {
  const factory Ingredient({
    @HiveField(0) required String botanical,
    @HiveField(1) required String part,
    @HiveField(2) String? dose,
  }) = _Ingredient;

  factory Ingredient.fromJson(Map<String, dynamic> json) =>
      _$IngredientFromJson(json);
}

@freezed
@HiveType(typeId: 13, adapterName: 'EvidenceGradeAdapter')
class EvidenceGrade with _$EvidenceGrade {
  const factory EvidenceGrade({
    @HiveField(0) required String grade,
    @HiveField(1) required String summary,
    @HiveField(2) required List<Citation> citations,
  }) = _EvidenceGrade;

  factory EvidenceGrade.fromJson(Map<String, dynamic> json) =>
      _$EvidenceGradeFromJson(json);
}

@freezed
@HiveType(typeId: 14, adapterName: 'CitationAdapter')
class Citation with _$Citation {
  const factory Citation({
    @HiveField(0) required String type,
    @HiveField(1) required String ref,
    @HiveField(2) String? url,
  }) = _Citation;

  factory Citation.fromJson(Map<String, dynamic> json) =>
      _$CitationFromJson(json);
}

@freezed
@HiveType(typeId: 15, adapterName: 'SafetyProfileAdapter')
class SafetyProfile with _$SafetyProfile {
  const factory SafetyProfile({
    @HiveField(0) required String interactionSeverity,
    @HiveField(1) required List<String> interactionNotes,
    @HiveField(2) required List<String> contraindications,
    @HiveField(3) required String pregnancy,
    @HiveField(4) @Default(false) bool narrowTherapeuticIndex,
  }) = _SafetyProfile;

  factory SafetyProfile.fromJson(Map<String, dynamic> json) =>
      _$SafetyProfileFromJson(json);
}

@freezed
@HiveType(typeId: 16, adapterName: 'VerificationStatusAdapter')
class VerificationStatus with _$VerificationStatus {
  const factory VerificationStatus({
    @HiveField(0) required String status,
    @HiveField(1) String? reviewedBy,
    @HiveField(2) String? credentials,
    @HiveField(3) String? reviewedAt,
    @HiveField(4) required String lastUpdated,
    @HiveField(5) required int version,
  }) = _VerificationStatus;

  factory VerificationStatus.fromJson(Map<String, dynamic> json) =>
      _$VerificationStatusFromJson(json);
}