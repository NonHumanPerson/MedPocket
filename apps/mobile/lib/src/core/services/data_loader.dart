import 'dart:convert';
import 'package:flutter/services.dart';
import '../models/medication.dart';
import '../models/ayurveda.dart';

class DataLoader {
  static const String _medicationsPath = 'assets/data/medications.json';
  static const String _ayurvedaPath = 'assets/data/ayurveda.json';

  static List<MedicationMonograph>? _medicationsCache;
  static List<AyurvedicMapping>? _ayurvedaCache;
  static Map<String, dynamic>? _metadataCache;

  /// Load medications from bundled JSON asset
  static Future<List<MedicationMonograph>> loadMedications() async {
    if (_medicationsCache != null) return _medicationsCache!;

    try {
      final String jsonString = await rootBundle.loadString(_medicationsPath);
      final Map<String, dynamic> jsonMap = json.decode(jsonString);
      _metadataCache = jsonMap;
      final List<dynamic> dataList = jsonMap['data'] as List<dynamic>;
      _medicationsCache = dataList
          .map((item) => MedicationMonograph.fromJson(item as Map<String, dynamic>))
          .toList();
      return _medicationsCache!;
    } catch (e) {
      throw DataLoadException('Failed to load medications: $e');
    }
  }

  /// Load Ayurvedic mappings from bundled JSON asset
  static Future<List<AyurvedicMapping>> loadAyurveda() async {
    if (_ayurvedaCache != null) return _ayurvedaCache!;

    try {
      final String jsonString = await rootBundle.loadString(_ayurvedaPath);
      final Map<String, dynamic> jsonMap = json.decode(jsonString);
      final List<dynamic> dataList = jsonMap['data'] as List<dynamic>;
      _ayurvedaCache = dataList
          .map((item) => AyurvedicMapping.fromJson(item as Map<String, dynamic>))
          .toList();
      return _ayurvedaCache!;
    } catch (e) {
      throw DataLoadException('Failed to load Ayurvedic mappings: $e');
    }
  }

  /// Get metadata (version, generatedAt, sources, disclaimer)
  static Future<Map<String, dynamic>> getMetadata() async {
    if (_metadataCache != null) return _metadataCache!;
    await loadMedications(); // This will populate _metadataCache
    return _metadataCache!;
  }

  /// Find medication by ID (exact match)
  static Future<MedicationMonograph?> findById(String id) async {
    final medications = await loadMedications();
    try {
      return medications.firstWhere((m) => m.id == id);
    } catch (_) {
      return null;
    }
  }

  /// Search medications by name (generic, brand, class, uses)
  static Future<List<MedicationMonograph>> search(String query) async {
    if (query.trim().isEmpty) return [];
    final medications = await loadMedications();
    final lowerQuery = query.toLowerCase().trim();
    
    return medications.where((med) {
      if (med.id.toLowerCase().contains(lowerQuery)) return true;
      if (med.genericName.toLowerCase().contains(lowerQuery)) return true;
      if (med.brandNames.any((b) => b.toLowerCase().contains(lowerQuery))) return true;
      if (med.therapeuticClass.toLowerCase().contains(lowerQuery)) return true;
      if (med.primaryUses.any((u) => u.toLowerCase().contains(lowerQuery))) return true;
      return false;
    }).toList();
  }

  /// Get Ayurvedic mappings for a modern drug ID
  static Future<List<AyurvedicMapping>> getAyurvedaForDrug(String modernDrugId) async {
    final ayurveda = await loadAyurveda();
    return ayurveda.where((mapping) => mapping.modernDrugIds.contains(modernDrugId)).toList();
  }

  /// Get all Ayurvedic mappings
  static Future<List<AyurvedicMapping>> getAllAyurveda() async {
    return await loadAyurveda();
  }

  /// Clear cache (for testing or data refresh)
  static void clearCache() {
    _medicationsCache = null;
    _ayurvedaCache = null;
    _metadataCache = null;
  }
}

class DataLoadException implements Exception {
  final String message;
  const DataLoadException(this.message);
  @override
  String toString() => 'DataLoadException: $message';
}