import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:intl/intl.dart';
import 'src/core/services/medication_service.dart';
import 'src/features/home/home_screen.dart';
import 'src/shared/utils/app_theme.dart';
import 'src/shared/utils/app_localizations.dart';
import 'src/core/services/ocr_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize services
  await MedicationService().initialize();
  await CabinetService().load();
  
  // Set up Intl
  Intl.defaultLocale = 'en';
  
  runApp(const MedPocketApp());
}

class MedPocketApp extends StatefulWidget {
  const MedPocketApp({super.key});

  @override
  State<MedPocketApp> createState() => _MedPocketAppState();
}

class _MedPocketAppState extends State<MedPocketApp> {
  Locale _locale = const Locale('en');
  ThemeMode _themeMode = ThemeMode.system;

  void setLocale(Locale locale) {
    setState(() => _locale = locale);
    CabinetService().updateSettings(
      CabinetService().settings.copyWith(languageCode: locale.languageCode),
    );
  }

  void setThemeMode(ThemeMode mode) {
    setState(() => _themeMode = mode);
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'MedPocket',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: _themeMode,
      locale: _locale,
      supportedLocales: const [
        Locale('en', ''),
        Locale('hi', ''),
      ],
      localizationsDelegates: const [
        AppLocalizations.delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      localeResolutionCallback: (locale, supportedLocales) {
        for (final supported in supportedLocales) {
          if (supported.languageCode == locale?.languageCode) {
            return supported;
          }
        }
        return supportedLocales.first;
      },
      home: HomeScreen(
        onLocaleChange: setLocale,
        onThemeChange: setThemeMode,
      ),
    );
  }
}