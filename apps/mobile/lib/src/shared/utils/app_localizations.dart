import 'package:flutter/material.dart';

class AppLocalizations {
  AppLocalizations(this.locale);

  final Locale locale;

  static AppLocalizations? of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations);
  }

  static const LocalizationsDelegate<AppLocalizations> delegate = _AppLocalizationsDelegate();

  // English translations
  static const Map<String, String> _en = {
    // App
    'appName': 'MedPocket',
    'appTagline': 'Clinical Medication Intelligence',
    
    // Tabs
    'tabSearch': 'Search',
    'tabCabinet': 'Cabinet',
    'tabInteractions': 'Safety',
    'tabAyurveda': 'Ayurveda',
    'tabSettings': 'Settings',
    
    // Search
    'searchHint': 'Search medications...',
    'searchPlaceholder': 'Type a medicine name',
    'scanButton': 'Scan Label',
    'noResults': 'No medications found',
    'recentSearches': 'Recent Searches',
    'popularMedicines': 'Popular Medicines',
    
    // Cabinet
    'myCabinet': 'My Cabinet',
    'addMedicine': 'Add Medicine',
    'emptyCabinet': 'Your cabinet is empty',
    'emptyCabinetSubtitle': 'Add medicines to track doses and check interactions',
    'takenToday': 'Taken Today',
    'notTaken': 'Not Taken',
    'removeConfirmation': 'Remove this medicine from your cabinet?',
    
    // Interactions
    'interactionCheck': 'Interaction Check',
    'addMedicinesToCheck': 'Add medicines to check interactions',
    'checkInteractions': 'Check Interactions',
    'noInteractions': 'No known interactions found',
    'overallRisk': 'Overall Risk',
    'monitoringTips': 'Monitoring Tips',
    
    // Risk levels
    'riskLow': 'Low',
    'riskModerate': 'Moderate',
    'riskSevere': 'Severe',
    'riskContraindicated': 'Contraindicated',
    
    // Medication Detail
    'genericName': 'Generic Name',
    'brandNames': 'Brand Names',
    'therapeuticClass': 'Therapeutic Class',
    'uses': 'Uses',
    'mechanism': 'How It Works',
    'dosage': 'Standard Dosage',
    'howToTake': 'How to Take',
    'sideEffects': 'Side Effects',
    'warnings': 'Warnings',
    'interactions': 'Drug Interactions',
    'ayurvedicPerspective': 'Ayurvedic Perspective',
    'mild': 'Mild',
    'moderate': 'Moderate',
    'urgent': 'Urgent / Emergency',
    'addToCabinet': 'Add to Cabinet',
    
    // Ayurveda
    'ayurvedicInfo': 'Traditional Ayurvedic Information',
    'formulation': 'Formulation',
    'ingredients': 'Ingredients',
    'traditionalUse': 'Traditional Use',
    'preparation': 'Preparation & Dose',
    'evidenceGrade': 'Evidence Grade',
    'evidenceSummary': 'Evidence Summary',
    'citations': 'References',
    'safetyProfile': 'Safety Profile',
    'interactionRisk': 'Interaction Risk',
    'contraindications': 'Contraindications',
    'pregnancy': 'Pregnancy',
    'disclaimer': 'Disclaimer',
    'pendingReview': 'Literature-sourced, pending expert review',
    'notVerified': 'NOT VERIFIED - For informational purposes only',
    
    // Evidence grades
    'gradeA': 'A - Systematic Review / RCT',
    'gradeB': 'B - Small Clinical Studies',
    'gradeC': 'C - Classical Texts / Preclinical Only',
    'gradeD': 'D - Anecdotal / Traditional Use Only',
    
    // Settings
    'settings': 'Settings',
    'language': 'Language',
    'theme': 'Theme',
    'light': 'Light',
    'dark': 'Dark',
    'system': 'System',
    'airGapMode': 'Air Gap Mode (Offline Only)',
    'airGapDescription': 'Disable all network requests. App works completely offline.',
    'autoCheckInteractions': 'Auto-check Interactions',
    'allowCamera': 'Allow Camera Access',
    'offlineFirst': 'Offline-First Mode',
    'privacyPolicy': 'Privacy Policy',
    'termsOfService': 'Terms of Service',
    'medicalDisclaimer': 'Medical Disclaimer',
    'about': 'About MedPocket',
    'version': 'Version',
    'dataVersion': 'Data Version',
    'clearData': 'Clear All Data',
    'clearDataConfirm': 'This will remove all your cabinet items and settings. Continue?',
    
    // OCR/Scanner
    'scanLabel': 'Scan Medicine Label',
    'scanInstructions': 'Point camera at medicine label or prescription',
    'processing': 'Processing...',
    'noTextDetected': 'No text detected. Try again with better lighting.',
    'detectedMedicines': 'Detected Medicines',
    'confirmMedicine': 'Is this your medicine?',
    
    // Common
    'ok': 'OK',
    'cancel': 'Cancel',
    'save': 'Save',
    'delete': 'Delete',
    'edit': 'Edit',
    'close': 'Close',
    'back': 'Back',
    'next': 'Next',
    'done': 'Done',
    'loading': 'Loading...',
    'error': 'Error',
    'retry': 'Retry',
    'yes': 'Yes',
    'no': 'No',
  };

  // Hindi translations (Devanagari)
  static const Map<String, String> _hi = {
    'appName': 'मेडपॉकेट',
    'appTagline': 'क्लिनिकल दवा जानकारी',
    'tabSearch': 'खोजें',
    'tabCabinet': 'कैबिनेट',
    'tabInteractions': 'सुरक्षा',
    'tabAyurveda': 'आयुर्वेद',
    'tabSettings': 'सेटिंग्स',
    'searchHint': 'दवाएं खोजें...',
    'searchPlaceholder': 'दवा का नाम लिखें',
    'scanButton': 'लेबल स्कैन करें',
    'noResults': 'कोई दवा नहीं मिली',
    'recentSearches': 'हाल की खोजें',
    'popularMedicines': 'लोकप्रिय दवाएं',
    'myCabinet': 'मेरा कैबिनेट',
    'addMedicine': 'दवा जोड़ें',
    'emptyCabinet': 'आपका कैबिनेट खाली है',
    'emptyCabinetSubtitle': 'खुराक ट्रैक करने और इंटरैक्शन जांचने के लिए दवाएं जोड़ें',
    'takenToday': 'आज ली गई',
    'notTaken': 'नहीं ली गई',
    'removeConfirmation': 'क्या आप इस दवा को कैबिनेट से हटाना चाहते हैं?',
    'interactionCheck': 'इंटरैक्शन जांच',
    'addMedicinesToCheck': 'इंटरैक्शन जांचने के लिए दवाएं जोड़ें',
    'checkInteractions': 'इंटरैक्शन जांचें',
    'noInteractions': 'कोई ज्ञात इंटरैक्शन नहीं मिला',
    'overallRisk': 'कुल जोखिम',
    'monitoringTips': 'निगरानी सुझाव',
    'riskLow': 'कम',
    'riskModerate': 'मध्यम',
    'riskSevere': 'गंभीर',
    'riskContraindicated': 'निषिद्ध',
    'genericName': 'सामान्य नाम',
    'brandNames': 'ब्रांड नाम',
    'therapeuticClass': 'चिकित्सीय वर्ग',
    'uses': 'उपयोग',
    'mechanism': 'यह कैसे काम करता है',
    'dosage': 'मानक खुराक',
    'howToTake': 'कैसे लें',
    'sideEffects': 'दुष्प्रभाव',
    'warnings': 'चेतावनियां',
    'interactions': 'दवा इंटरैक्शन',
    'ayurvedicPerspective': 'आयुर्वेदिक दृष्टिकोण',
    'mild': 'हल्का',
    'moderate': 'मध्यम',
    'urgent': 'आपातकालीन',
    'addToCabinet': 'कैबिनेट में जोड़ें',
    'ayurvedicInfo': 'पारंपरिक आयुर्वेदिक जानकारी',
    'formulation': 'फॉर्मूलेशन',
    'ingredients': 'घटक',
    'traditionalUse': 'पारंपरिक उपयोग',
    'preparation': 'तैयारी और खुराक',
    'evidenceGrade': 'सबूत ग्रेड',
    'evidenceSummary': 'सबूत सारांश',
    'citations': 'संदर्भ',
    'safetyProfile': 'सुरक्षा प्रोफ़ाइल',
    'interactionRisk': 'इंटरैक्शन जोखिम',
    'contraindications': 'विरोधाभास',
    'pregnancy': 'गर्भावस्था',
    'disclaimer': 'अस्वीकरण',
    'pendingReview': 'साहित्य-आधारित, विशेषज्ञ समीक्षा लंबित',
    'notVerified': 'सत्यापित नहीं - केवल सूचनात्मक उद्देश्यों के लिए',
    'gradeA': 'A - व्यवस्थित समीक्षा / RCT',
    'gradeB': 'B - छोटे नैदानिक अध्ययन',
    'gradeC': 'C - शास्त्रीय ग्रंथ / केवल प्रीक्लिनिकल',
    'gradeD': 'D - उपाख्यानात्मक / केवल पारंपरिक उपयोग',
    'settings': 'सेटिंग्स',
    'language': 'भाषा',
    'theme': 'थीम',
    'light': 'हल्का',
    'dark': 'गहरा',
    'system': 'सिस्टम',
    'airGapMode': 'एयर गैप मोड (केवल ऑफलाइन)',
    'airGapDescription': 'सभी नेटवर्क अनुरोध अक्षम करें। ऐप पूरी तरह ऑफलाइन काम करता है।',
    'autoCheckInteractions': 'स्वचालित इंटरैक्शन जांच',
    'allowCamera': 'कैमरा एक्सेस की अनुमति दें',
    'offlineFirst': 'ऑफलाइन-फर्स्ट मोड',
    'privacyPolicy': 'गोपनीयता नीति',
    'termsOfService': 'सेवा की शर्तें',
    'medicalDisclaimer': 'चिकित्सा अस्वीकरण',
    'about': 'मेडपॉकेट के बारे में',
    'version': 'संस्करण',
    'dataVersion': 'डेटा संस्करण',
    'clearData': 'सभी डेटा साफ़ करें',
    'clearDataConfirm': 'यह आपके सभी कैबिनेट आइटम और सेटिंग्स को हटा देगा। जारी रखें?',
    'scanLabel': 'दवा लेबल स्कैन करें',
    'scanInstructions': 'कैमरे को दवा लेबल या प्रिस्क्रिप्शन पर इंगित करें',
    'processing': 'प्रोसेसिंग...',
    'noTextDetected': 'कोई टेक्स्ट नहीं मिला। बेहतर रोशनी में फिर से कोशिश करें।',
    'detectedMedicines': 'पता चली दवाएं',
    'confirmMedicine': 'क्या यह आपकी दवा है?',
    'ok': 'ठीक है',
    'cancel': 'रद्द करें',
    'save': 'सहेजें',
    'delete': 'हटाएं',
    'edit': 'संपादित करें',
    'close': 'बंद करें',
    'back': 'वापस',
    'next': 'अगला',
    'done': 'हो गया',
    'loading': 'लोड हो रहा है...',
    'error': 'त्रुटि',
    'retry': 'पुनः प्रयास करें',
    'yes': 'हाँ',
    'no': 'नहीं',
  };

  String t(String key) {
    final translations = locale.languageCode == 'hi' ? _hi : _en;
    return translations[key] ?? key;
  }

  // Helper getters for common strings
  String get appName => t('appName');
  String get appTagline => t('appTagline');
  String get tabSearch => t('tabSearch');
  String get tabCabinet => t('tabCabinet');
  String get tabInteractions => t('tabInteractions');
  String get tabAyurveda => t('tabAyurveda');
  String get tabSettings => t('tabSettings');
  String get searchHint => t('searchHint');
  String get scanButton => t('scanButton');
  String get myCabinet => t('myCabinet');
  String get addMedicine => t('addMedicine');
  String get interactionCheck => t('interactionCheck');
  String get checkInteractions => t('checkInteractions');
  String get overallRisk => t('overallRisk');
  String get pendingReview => t('pendingReview');
  String get notVerified => t('notVerified');
  String get ok => t('ok');
  String get cancel => t('cancel');
  String get loading => t('loading');
  String get error => t('error');
}

class _AppLocalizationsDelegate extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  bool isSupported(Locale locale) => ['en', 'hi'].contains(locale.languageCode);

  @override
  Future<AppLocalizations> load(Locale locale) async => AppLocalizations(locale);

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}