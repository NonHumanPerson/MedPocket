import 'dart:io';
import 'package:image_picker/image_picker.dart';
import '../models/medication.dart';

/// OCR Service for extracting text from medication labels
/// In production, this would use tflite_flutter with a proper OCR model
/// For v1, we provide a stub that can be enhanced
class OcrService {
  static final OcrService _instance = OcrService._internal();
  factory OcrService() => _instance;
  OcrService._internal();

  final ImagePicker _picker = ImagePicker();

  /// Pick an image from camera or gallery
  Future<File?> pickImage({bool fromCamera = true}) async {
    final XFile? image = await _picker.pickImage(
      source: fromCamera ? ImageSource.camera : ImageSource.gallery,
      imageQuality: 85,
      maxWidth: 1920,
      maxHeight: 1080,
    );
    return image != null ? File(image.path) : null;
  }

  /// Extract text from image using on-device OCR
  /// This is a stub - real implementation would use Tesseract via tflite_flutter
  Future<OcrResult> extractText(File imageFile) async {
    // Simulate OCR processing delay
    await Future.delayed(const Duration(seconds: 2));
    
    // In real implementation:
    // 1. Load Tesseract model via tflite_flutter
    // 2. Preprocess image (resize, binarize, deskew)
    // 3. Run OCR inference
    // 4. Post-process text (clean up, detect drug names)
    
    // For now, return a mock result for testing
    return OcrResult(
      text: 'METFORMIN 500MG\nTAKE ONE TABLET\nTWICE DAILY WITH MEALS\nGLYCOMET',
      confidence: 0.85,
      detectedDrugNames: ['metformin'],
    );
  }

  /// Extract drug names from OCR text using simple pattern matching
  /// Real implementation would use NER or dictionary lookup
  List<String> extractDrugNames(String text, List<MedicationMonograph> database) {
    final lowerText = text.toLowerCase();
    final found = <String>[];
    
    for (final med in database) {
      if (lowerText.contains(med.id.toLowerCase()) ||
          lowerText.contains(med.genericName.toLowerCase()) ||
          med.brandNames.any((b) => lowerText.contains(b.toLowerCase()))) {
        found.add(med.id);
      }
    }
    
    return found;
  }

  /// Process image and return detected medications
  Future<List<MedicationMonograph>> scanForMedications(
    File imageFile,
    List<MedicationMonograph> database,
  ) async {
    final ocrResult = await extractText(imageFile);
    final drugIds = extractDrugNames(ocrResult.text, database);
    
    final results = <MedicationMonograph>[];
    for (final id in drugIds) {
      try {
        results.add(database.firstWhere((m) => m.id == id));
      } catch (_) {
        // Drug id not present in the offline database; skip it.
      }
    }
    
    return results;
  }
}