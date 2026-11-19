import 'package:flutter/material.dart';
import '../../core/services/medication_service.dart';
import '../../core/models/ayurveda.dart';
import '../../shared/utils/app_localizations.dart';
import '../../shared/widgets/ayurveda_card.dart';

class AyurvedaScreen extends StatefulWidget {
  const AyurvedaScreen({super.key});

  @override
  State<AyurvedaScreen> createState() => _AyurvedaScreenState();
}

class _AyurvedaScreenState extends State<AyurvedaScreen> {
  final MedicationService _medService = MedicationService();
  
  List<AyurvedicMapping> _ayurvedaMappings = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadAyurveda();
  }

  Future<void> _loadAyurveda() async {
    try {
      final mappings = await _medService.getAllAyurvedicMappings();
      setState(() {
        _ayurvedaMappings = mappings;
        _isLoading = false;
      });
    } catch (_) {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final theme = Theme.of(context);
    
    return Scaffold(
      appBar: AppBar(title: Text(l10n.tabAyurveda)),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _ayurvedaMappings.isEmpty
              ? _emptyState()
              : _ayurvedaList(),
    );
  }

  Widget _emptyState() {
    final l10n = AppLocalizations.of(context)!;
    final theme = Theme.of(context);
    
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.spa_outlined, size: 80, color: theme.colorScheme.onSurface.withOpacity(0.2)),
            const SizedBox(height: 24),
            Text(
              l10n.ayurvedicInfo,
              style: theme.textTheme.headlineSmall?.copyWith(color: theme.colorScheme.onSurface.withOpacity(0.6)),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 12),
            Text(
              'Ayurvedic mappings will appear here when you search for a medicine that has traditional alternatives.',
              style: theme.textTheme.bodyMedium?.copyWith(color: theme.colorScheme.onSurface.withOpacity(0.4)),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _ayurvedaList() {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _ayurvedaMappings.length,
      itemBuilder: (_, index) {
        final mapping = _ayurvedaMappings[index];
        return AyurvedaCard(mapping: mapping);
      },
    );
  }
}