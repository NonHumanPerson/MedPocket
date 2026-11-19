import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/services/medication_service.dart';
import '../../shared/utils/app_localizations.dart';
import '../../shared/utils/app_theme.dart';
import '../search/search_screen.dart';
import '../cabinet/cabinet_screen.dart';
import '../interactions/interactions_screen.dart';
import '../ayurveda/ayurveda_screen.dart';
import '../settings/settings_screen.dart';
import '../../shared/widgets/bottom_nav_bar.dart';

class HomeScreen extends StatefulWidget {
  final Function(Locale) onLocaleChange;
  final Function(ThemeMode) onThemeChange;

  const HomeScreen({
    super.key,
    required this.onLocaleChange,
    required this.onThemeChange,
  });

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;
  late final List<Widget> _screens;

  @override
  void initState() {
    super.initState();
    _screens = [
      const SearchScreen(),
      const CabinetScreen(),
      const InteractionsScreen(),
      const AyurvedaScreen(),
      SettingsScreen(
        onLocaleChange: widget.onLocaleChange,
        onThemeChange: widget.onThemeChange,
      ),
    ];
  }

  void _onTabTapped(int index) {
    setState(() => _currentIndex = index);
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: BottomNavBar(
        currentIndex: _currentIndex,
        onTap: _onTabTapped,
        items: [
          BottomNavItem(
            icon: Icons.search,
            label: l10n.tabSearch,
          ),
          BottomNavItem(
            icon: Icons.medication,
            label: l10n.tabCabinet,
          ),
          BottomNavItem(
            icon: Icons.shield,
            label: l10n.tabInteractions,
          ),
          BottomNavItem(
            icon: Icons.spa,
            label: l10n.tabAyurveda,
          ),
          BottomNavItem(
            icon: Icons.settings,
            label: l10n.tabSettings,
          ),
        ],
      ),
    );
  }
}