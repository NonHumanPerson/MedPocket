import 'package:flutter/material.dart';
import '../../core/services/medication_service.dart';
import '../../core/services/data_loader.dart';
import '../../shared/utils/app_localizations.dart';
import '../../shared/utils/app_theme.dart';

class SettingsScreen extends StatefulWidget {
  final Function(Locale) onLocaleChange;
  final Function(ThemeMode) onThemeChange;

  const SettingsScreen({
    super.key,
    required this.onLocaleChange,
    required this.onThemeChange,
  });

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  final CabinetService _cabinetService = CabinetService();
  
  Locale _currentLocale = const Locale('en');
  ThemeMode _currentTheme = ThemeMode.system;
  PrivacySettings _settings = const PrivacySettings();
  Map<String, dynamic>? _metadata;

  @override
  void initState() {
    super.initState();
    _loadSettings();
    _loadMetadata();
  }

  Future<void> _loadSettings() async {
    await _cabinetService.load();
    setState(() {
      _settings = _cabinetService.settings;
      _currentLocale = Locale(_settings.languageCode);
      // Theme would be loaded from preferences in real implementation
    });
  }

  Future<void> _loadMetadata() async {
    try {
      _metadata = await DataLoader.getMetadata();
      setState(() {});
    } catch (_) {}
  }

  Future<void> _changeLocale(Locale locale) async {
    setState(() => _currentLocale = locale);
    widget.onLocaleChange(locale);
    await _cabinetService.updateSettings(_settings.copyWith(languageCode: locale.languageCode));
  }

  Future<void> _changeTheme(ThemeMode mode) async {
    setState(() => _currentTheme = mode);
    widget.onThemeChange(mode);
  }

  Future<void> _toggleAirGap(bool value) async {
    setState(() => _settings = _settings.copyWith(airGapMode: value));
    await _cabinetService.updateSettings(_settings);
  }

  Future<void> _toggleAutoCheck(bool value) async {
    setState(() => _settings = _settings.copyWith(autoCheckInteractions: value));
    await _cabinetService.updateSettings(_settings);
  }

  Future<void> _toggleCamera(bool value) async {
    setState(() => _settings = _settings.copyWith(allowCameraScan: value));
    await _cabinetService.updateSettings(_settings);
  }

  Future<void> _toggleOfflineFirst(bool value) async {
    setState(() => _settings = _settings.copyWith(offlineFirstMode: value));
    await _cabinetService.updateSettings(_settings);
  }

  Future<void> _clearData() async {
    final l10n = AppLocalizations.of(context)!;
    final confirm = await showDialog<bool>(
      context: context,
      builder: (_) => AlertDialog(
        title: Text(l10n.clearData),
        content: Text(l10n.clearDataConfirm),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: Text(l10n.cancel)),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: Text(l10n.delete, style: TextStyle(color: Theme.of(context).colorScheme.error)),
          ),
        ],
      ),
    );
    
    if (confirm == true) {
      await _cabinetService.purgeAll();
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Data cleared')));
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final theme = Theme.of(context);
    
    return Scaffold(
      appBar: AppBar(title: Text(l10n.settings)),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Language
          _SectionCard(
            title: l10n.language,
            children: [
              _LocaleTile(
                locale: const Locale('en'),
                label: 'English',
                isSelected: _currentLocale.languageCode == 'en',
                onTap: () => _changeLocale(const Locale('en')),
              ),
              _LocaleTile(
                locale: const Locale('hi'),
                label: 'हिन्दी (Hindi)',
                isSelected: _currentLocale.languageCode == 'hi',
                onTap: () => _changeLocale(const Locale('hi')),
              ),
            ],
          ),
          
          const SizedBox(height: 16),
          
          // Theme
          _SectionCard(
            title: l10n.theme,
            children: [
              _ThemeTile(
                mode: ThemeMode.light,
                label: l10n.light,
                icon: Icons.light_mode,
                isSelected: _currentTheme == ThemeMode.light,
                onTap: () => _changeTheme(ThemeMode.light),
              ),
              _ThemeTile(
                mode: ThemeMode.dark,
                label: l10n.dark,
                icon: Icons.dark_mode,
                isSelected: _currentTheme == ThemeMode.dark,
                onTap: () => _changeTheme(ThemeMode.dark),
              ),
              _ThemeTile(
                mode: ThemeMode.system,
                label: l10n.system,
                icon: Icons.settings_system_daydream,
                isSelected: _currentTheme == ThemeMode.system,
                onTap: () => _changeTheme(ThemeMode.system),
              ),
            ],
          ),
          
          const SizedBox(height: 16),
          
          // Privacy & Data
          _SectionCard(
            title: 'Privacy & Data',
            children: [
              SwitchListTile(
                title: Text(l10n.airGapMode),
                subtitle: Text(l10n.airGapDescription),
                value: _settings.airGapMode,
                onChanged: _toggleAirGap,
              ),
              SwitchListTile(
                title: Text(l10n.autoCheckInteractions),
                subtitle: Text('Automatically check interactions when adding medicines to cabinet'),
                value: _settings.autoCheckInteractions,
                onChanged: _toggleAutoCheck,
              ),
              SwitchListTile(
                title: Text(l10n.allowCamera),
                subtitle: Text('Allow camera access for scanning medicine labels'),
                value: _settings.allowCameraScan,
                onChanged: _toggleCamera,
              ),
              SwitchListTile(
                title: Text(l10n.offlineFirst),
                subtitle: Text('Prioritize offline data; only use network when explicitly requested'),
                value: _settings.offlineFirstMode,
                onChanged: _toggleOfflineFirst,
              ),
            ],
          ),
          
          const SizedBox(height: 16),
          
          // Legal
          _SectionCard(
            title: 'Legal & Info',
            children: [
              ListTile(
                leading: const Icon(Icons.privacy_tip),
                title: Text(l10n.privacyPolicy),
                trailing: const Icon(Icons.chevron_right),
                onTap: () => _showLegal('Privacy Policy', _privacyPolicyText()),
              ),
              ListTile(
                leading: const Icon(Icons.description),
                title: Text(l10n.termsOfService),
                trailing: const Icon(Icons.chevron_right),
                onTap: () => _showLegal(l10n.termsOfService, _termsText()),
              ),
              ListTile(
                leading: const Icon(Icons.medical_services),
                title: Text(l10n.medicalDisclaimer),
                trailing: const Icon(Icons.chevron_right),
                onTap: () => _showLegal(l10n.medicalDisclaimer, _disclaimerText()),
              ),
            ],
          ),
          
          const SizedBox(height: 16),
          
          // About
          _SectionCard(
            title: l10n.about,
            children: [
              ListTile(
                leading: const Icon(Icons.info_outline),
                title: Text(l10n.version),
                subtitle: Text('1.0.0'),
              ),
              if (_metadata != null) ...[
                ListTile(
                  leading: const Icon(Icons.database),
                  title: Text(l10n.dataVersion),
                  subtitle: Text('v${_metadata!['version']} (${_metadata!['generatedAt']?.toString().split('T')[0] ?? 'unknown'})'),
                ),
              ],
              ListTile(
                leading: const Icon(Icons.source),
                title: Text('Data Sources'),
                subtitle: Text('NLEM 2022, WHO EML 2023, Indian Pharmacopoeia, Ayurvedic Pharmacopoeia of India, PubMed'),
                onTap: () => _showLegal('Data Sources', _sourcesText()),
              ),
            ],
          ),
          
          const SizedBox(height: 16),
          
          // Danger zone
          _SectionCard(
            title: 'Danger Zone',
            children: [
              ListTile(
                leading: Icon(Icons.delete_forever, color: theme.colorScheme.error),
                title: Text(l10n.clearData, style: TextStyle(color: theme.colorScheme.error)),
                subtitle: Text(l10n.clearDataConfirm),
                onTap: _clearData,
              ),
            ],
          ),
        ],
      ),
    );
  }

  void _showLegal(String title, String content) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: Text(title),
        content: SingleChildScrollView(
          child: Text(content, style: const TextStyle(fontSize: 14)),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: Text(AppLocalizations.of(context)!.ok)),
        ],
      ),
    );
  }

  String _privacyPolicyText() => '''
MedPocket Privacy Policy

Last updated: 2024

1. Data Collection
MedPocket is an offline-first application. We do not collect, transmit, or store any personal health data on external servers. All your medication cabinet data, settings, and preferences are stored locally on your device only.

2. Camera Access
Camera access is used solely for scanning medicine labels via OCR. Images are processed on-device and are not uploaded anywhere.

3. Network Requests
When not in Air Gap Mode, the app may make optional network requests for:
- Checking for app updates
- Fetching enhanced drug information (with explicit user consent)
No health data is sent in these requests.

4. Your Rights
You have full control over your data. You can delete all local data at any time from Settings > Danger Zone.

5. Children's Privacy
This app is not directed at children under 13.

6. Changes
We may update this policy. Continued use constitutes acceptance.

Contact: Report via GitHub Issues at github.com/NonHumanPerson/MedPocket/issues
''';

  String _termsText() => '''
MedPocket Terms of Service

Last updated: 2024

By using MedPocket, you agree to these terms:

1. Information Only
MedPocket provides general medication information from public authoritative sources (NLEM, WHO EML, Indian Pharmacopoeia, Ayurvedic Pharmacopoeia of India, PubMed). It is NOT a substitute for professional medical advice, diagnosis, or treatment.

2. No Medical Advice
Never disregard professional medical advice or delay seeking it because of something you read in this app. Always consult your physician or pharmacist before starting, stopping, or changing any medication.

3. Ayurvedic Information
Ayurvedic mappings are literature-sourced and PENDING EXPERT REVIEW. They are NOT verified medical recommendations. The "pending_expert_review" status means no qualified Ayurvedic physician or pharmacologist has reviewed these entries.

4. No Warranty
Information is provided "as is" without warranty of any kind. Drug information may be incomplete, outdated, or contain errors.

5. Liability
The developers are not liable for any harm resulting from use of this app.

6. Free Use
This app is free for personal, non-commercial use.

7. Governing Law
These terms are governed by the laws of India.
''';

  String _disclaimerText() => '''
MEDICAL DISCLAIMER

IMPORTANT: READ CAREFULLY

MedPocket is an INFORMATIONAL TOOL ONLY. It does not provide medical advice, diagnosis, or treatment recommendations.

• The medication information is sourced from public databases (NLEM, WHO EML, DailyMed, MedlinePlus) and may not be complete or current.
• Ayurvedic information is COMPILED FROM PUBLISHED LITERATURE and has NOT been reviewed by qualified healthcare professionals. It is marked as "pending_expert_review".
• Drug interactions are checked against known databases but may not capture all possible interactions.
• Individual responses to medications vary. What is safe for one person may be dangerous for another.

ALWAYS:
✓ Consult your physician or pharmacist before making any medication changes
✓ Never stop prescribed medication without medical supervision
✓ Carry your complete medication list to all healthcare appointments
✓ In a medical emergency, contact emergency services immediately

This app is a student project for educational purposes. It is not a certified medical device.
''';

  String _sourcesText() => '''
Data Sources & Attribution

Modern Medications:
• National List of Essential Medicines (NLEM) 2022, Ministry of Health & Family Welfare, Government of India
• WHO Model List of Essential Medicines, 23rd List (2023)
• Indian Pharmacopoeia 2018, Indian Pharmacopoeia Commission
• DailyMed, U.S. National Library of Medicine (Public Domain)
• MedlinePlus, U.S. National Library of Medicine (Public Domain)
• ATC/DDD Index, WHO Collaborating Centre for Drug Statistics Methodology
• RxNorm, U.S. National Library of Medicine (Public Domain)

Ayurvedic Information:
• Ayurvedic Pharmacopoeia of India, Part I & II, Ministry of AYUSH
• Ayurvedic Formulary of India, Part I & II, Ministry of AYUSH
• Central Council for Research in Ayurvedic Sciences (CCRAS) Publications
• PubMed/MEDLINE Indexed Literature

All Ayurvedic entries are marked with evidence grades (A-D) and verification status "pending_expert_review".
No entry has been reviewed by a qualified Ayurvedic physician or pharmacologist.

Licenses: Public domain / Government works / Open access where applicable.
''';
}

class _SectionCard extends StatelessWidget {
  final String title;
  final List<Widget> children;

  const _SectionCard({required this.title, required this.children});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Card(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
            child: Text(title, style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700, color: theme.colorScheme.primary)),
          ),
          ...children,
        ],
      ),
    );
  }
}

class _LocaleTile extends StatelessWidget {
  final Locale locale;
  final String label;
  final bool isSelected;
  final VoidCallback onTap;

  const _LocaleTile({
    required this.locale,
    required this.label,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return ListTile(
      title: Text(label),
      trailing: isSelected ? Icon(Icons.check, color: theme.colorScheme.primary) : null,
      onTap: onTap,
    );
  }
}

class _ThemeTile extends StatelessWidget {
  final ThemeMode mode;
  final String label;
  final IconData icon;
  final bool isSelected;
  final VoidCallback onTap;

  const _ThemeTile({
    required this.mode,
    required this.label,
    required this.icon,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return ListTile(
      leading: Icon(icon),
      title: Text(label),
      trailing: isSelected ? Icon(Icons.check, color: theme.colorScheme.primary) : null,
      onTap: onTap,
    );
  }
}