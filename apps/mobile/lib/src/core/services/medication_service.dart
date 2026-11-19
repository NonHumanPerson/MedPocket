import 'dart:async';
import '../models/medication.dart';
import 'data_loader.dart';
import 'interaction_checker.dart';

class MedicationService {
  static final MedicationService _instance = MedicationService._internal();
  factory MedicationService() => _instance;
  MedicationService._internal();

  List<MedicationMonograph>? _database;
  bool _isLoading = false;
  final _databaseController = StreamController<List<MedicationMonograph>>.broadcast();

  Stream<List<MedicationMonograph>> get databaseStream => _databaseController.stream;
  bool get isLoading => _isLoading;
  List<MedicationMonograph>? get database => _database;

  /// Initialize the service and load the medication database
  Future<void> initialize() async {
    if (_database != null) return;
    if (_isLoading) return;
    
    _isLoading = true;
    try {
      _database = await DataLoader.loadMedications();
      _databaseController.add(_database!);
    } finally {
      _isLoading = false;
    }
  }

  /// Search medications by query
  Future<List<MedicationMonograph>> search(String query) async {
    await initialize();
    return DataLoader.search(query);
  }

  /// Get medication by ID
  Future<MedicationMonograph?> getById(String id) async {
    await initialize();
    return DataLoader.findById(id);
  }

  /// Get all medications
  Future<List<MedicationMonograph>> getAll() async {
    await initialize();
    return _database ?? [];
  }

  /// Check interactions for a list of medication names
  Future<InteractionCheckResult> checkInteractions(List<String> medicationNames) async {
    await initialize();
    return checkInteractionsWithDatabase(medicationNames, _database!);
  }

  /// Check if a drug is narrow therapeutic index
  bool isNarrowTherapeuticIndex(String drugId) {
    return isNarrowTherapeuticIndexStatic(drugId);
  }

  /// Get Ayurvedic mappings for a drug
  Future<List<AyurvedicMapping>> getAyurvedicMappings(String drugId) async {
    return DataLoader.getAyurvedaForDrug(drugId);
  }

  /// Get all Ayurvedic mappings
  Future<List<AyurvedicMapping>> getAllAyurvedicMappings() async {
    return DataLoader.getAllAyurveda();
  }

  void dispose() {
    _databaseController.close();
  }
}

/// Cabinet service for managing user's personal medication list
class CabinetService {
  static final CabinetService _instance = CabinetService._internal();
  factory CabinetService() => _instance;
  CabinetService._internal();

  static const String _cabinetKey = 'medpocket_cabinet_v1';
  static const String _settingsKey = 'medpocket_settings_v1';
  
  List<UserCabinetItem> _cabinet = [];
  PrivacySettings _settings = const PrivacySettings();
  bool _isLoaded = false;
  
  List<UserCabinetItem> get cabinet => List.unmodifiable(_cabinet);
  PrivacySettings get settings => _settings;
  bool get isLoaded => _isLoaded;

  Future<void> load() async {
    if (_isLoaded) return;
    // In a real implementation, this would use SharedPreferences or Hive
    // For now, we'll use a simple in-memory store with default data
    _cabinet = [
      UserCabinetItem(
        id: 'seed-1',
        medicationId: 'metformin',
        drugName: 'Metformin 500mg',
        dosage: '500 mg',
        frequency: 'Twice daily',
        timing: 'With breakfast and dinner',
        notes: 'Prescribed for glucose management',
        dateAdded: '2024-01-15',
        takenToday: true,
      ),
      UserCabinetItem(
        id: 'seed-2',
        medicationId: 'lisinopril',
        drugName: 'Lisinopril 10mg',
        dosage: '10 mg',
        frequency: 'Once daily',
        timing: 'Morning',
        notes: 'Blood pressure control',
        dateAdded: '2024-01-15',
        takenToday: false,
      ),
    ];
    _settings = const PrivacySettings();
    _isLoaded = true;
  }

  Future<void> add(UserCabinetItem item) async {
    await load();
    _cabinet.insert(0, item);
    await _save();
  }

  Future<void> remove(String id) async {
    await load();
    _cabinet.removeWhere((item) => item.id == id);
    await _save();
  }

  Future<void> toggleTaken(String id) async {
    await load();
    final index = _cabinet.indexWhere((item) => item.id == id);
    if (index != -1) {
      _cabinet[index] = _cabinet[index].copyWith(takenToday: !_cabinet[index].takenToday);
      await _save();
    }
  }

  Future<void> updateSettings(PrivacySettings newSettings) async {
    await load();
    _settings = newSettings;
    await _saveSettings();
  }

  Future<void> _save() async {
    // In real implementation: await SharedPreferences.setString(_cabinetKey, jsonEncode(_cabinet));
  }

  Future<void> _saveSettings() async {
    // In real implementation: await SharedPreferences.setString(_settingsKey, jsonEncode(_settings.toJson()));
  }

  Future<void> purgeAll() async {
    _cabinet = [];
    _settings = const PrivacySettings();
    await _save();
    await _saveSettings();
  }

  List<String> getMedicationIds() {
    return _cabinet.map((item) => item.medicationId).toList();
  }

  List<String> getDrugNames() {
    return _cabinet.map((item) => item.drugName).toList();
  }
}

/// Privacy settings for the app
class PrivacySettings {
  final bool airGapMode;
  final bool autoCheckInteractions;
  final bool allowCameraScan;
  final bool offlineFirstMode;
  final String languageCode;

  const PrivacySettings({
    this.airGapMode = false,
    this.autoCheckInteractions = true,
    this.allowCameraScan = true,
    this.offlineFirstMode = true,
    this.languageCode = 'en',
  });

  PrivacySettings copyWith({
    bool? airGapMode,
    bool? autoCheckInteractions,
    bool? allowCameraScan,
    bool? offlineFirstMode,
    String? languageCode,
  }) {
    return PrivacySettings(
      airGapMode: airGapMode ?? this.airGapMode,
      autoCheckInteractions: autoCheckInteractions ?? this.autoCheckInteractions,
      allowCameraScan: allowCameraScan ?? this.allowCameraScan,
      offlineFirstMode: offlineFirstMode ?? this.offlineFirstMode,
      languageCode: languageCode ?? this.languageCode,
    );
  }

  Map<String, dynamic> toJson() => {
    'airGapMode': airGapMode,
    'autoCheckInteractions': autoCheckInteractions,
    'allowCameraScan': allowCameraScan,
    'offlineFirstMode': offlineFirstMode,
    'languageCode': languageCode,
  };

  factory PrivacySettings.fromJson(Map<String, dynamic> json) => PrivacySettings(
    airGapMode: json['airGapMode'] ?? false,
    autoCheckInteractions: json['autoCheckInteractions'] ?? true,
    allowCameraScan: json['allowCameraScan'] ?? true,
    offlineFirstMode: json['offlineFirstMode'] ?? true,
    languageCode: json['languageCode'] ?? 'en',
  );
}