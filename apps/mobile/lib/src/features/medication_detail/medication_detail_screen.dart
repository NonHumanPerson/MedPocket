import 'package:flutter/material.dart';
import '../../core/services/medication_service.dart';
import '../../core/services/medication_service.dart'; // CabinetService is in same file
import '../../core/models/medication.dart';
import '../../core/models/ayurveda.dart';
import '../../shared/utils/app_localizations.dart';
import '../../shared/widgets/ayurveda_card.dart';

class MedicationDetailScreen extends StatefulWidget {
  final MedicationMonograph medication;

  const MedicationDetailScreen({super.key, required this.medication});

  @override
  State<MedicationDetailScreen> createState() => _MedicationDetailScreenState();
}

class _MedicationDetailScreenState extends State<MedicationDetailScreen> {
  final MedicationService _medService = MedicationService();
  final CabinetService _cabinetService = CabinetService();
  
  List<AyurvedicMapping> _ayurvedaMappings = [];
  bool _isLoadingAyurveda = true;
  bool _isInCabinet = false;

  @override
  void initState() {
    super.initState();
    _loadAyurveda();
    _checkCabinet();
  }

  Future<void> _loadAyurveda() async {
    try {
      final mappings = await _medService.getAyurvedicMappings(widget.medication.id);
      setState(() {
        _ayurvedaMappings = mappings;
        _isLoadingAyurveda = false;
      });
    } catch (_) {
      setState(() => _isLoadingAyurveda = false);
    }
  }

  Future<void> _checkCabinet() async {
    await _cabinetService.load();
    setState(() => _isInCabinet = _cabinetService.cabinet.any((item) => item.medicationId == widget.medication.id));
  }

  Future<void> _addToCabinet() async {
    await _cabinetService.add(UserCabinetItem(
      id: 'item_${DateTime.now().millisecondsSinceEpoch}',
      medicationId: widget.medication.id,
      drugName: widget.medication.genericName,
      dosage: widget.medication.standardDosage,
      frequency: 'As prescribed',
      timing: widget.medication.howToTake.bestTimeOfDay,
      notes: 'Added from MedPocket',
      dateAdded: DateTime.now().toIso8601String().split('T')[0],
    ));
    setState(() => _isInCabinet = true);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(AppLocalizations.of(context)!.addToCabinet)),
    );
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final theme = Theme.of(context);
    final med = widget.medication;
    
    return Scaffold(
      appBar: AppBar(
        title: Text(med.genericName),
        actions: [
          IconButton(
            icon: Icon(_isInCabinet ? Icons.check : Icons.add),
            onPressed: _isInCabinet ? null : _addToCabinet,
            tooltip: l10n.addToCabinet,
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            _HeaderCard(medication: med),
            const SizedBox(height: 24),
            
            // What it does
            _Section(
              title: l10n.mechanism,
              child: Text(med.mechanismOfAction, style: theme.textTheme.bodyMedium),
            ),
            const SizedBox(height: 16),
            
            // Uses
            _Section(
              title: l10n.uses,
              child: Wrap(
                spacing: 8,
                runSpacing: 8,
                children: med.primaryUses.map((use) => Chip(
                  label: Text(use),
                  backgroundColor: theme.colorScheme.primaryContainer,
                )).toList(),
              ),
            ),
            const SizedBox(height: 16),
            
            // Dosage
            _Section(
              title: l10n.dosage,
              child: Text(med.standardDosage, style: theme.textTheme.bodyMedium),
            ),
            const SizedBox(height: 16),
            
            // How to take
            _Section(
              title: l10n.howToTake,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _InfoRow(l10n.foodRequirement ?? 'Food', _foodRequirementLabel(med.howToTake.foodRequirement, l10n)),
                  _InfoRow(l10n.instructions, med.howToTake.instructions),
                  _InfoRow(l10n.bestTimeOfDay ?? 'Best Time', med.howToTake.bestTimeOfDay),
                  _InfoRow(l10n.missedDoseAdvice ?? 'Missed Dose', med.howToTake.missedDoseAdvice),
                ],
              ),
            ),
            const SizedBox(height: 16),
            
            // Side Effects
            _Section(
              title: l10n.sideEffects,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _SideEffectGroup(l10n.mild, med.sideEffects.mild, Colors.green),
                  _SideEffectGroup(l10n.moderate, med.sideEffects.moderate, Colors.orange),
                  _SideEffectGroup(l10n.urgent, med.sideEffects.urgent, Colors.red),
                ],
              ),
            ),
            const SizedBox(height: 16),
            
            // Warnings
            if (med.warnings.blackBox != null && med.warnings.blackBox!.isNotEmpty) ...[
              _Section(
                title: '⚠️ Black Box Warning',
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: theme.colorScheme.errorContainer,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: theme.colorScheme.error),
                  ),
                  child: Text(med.warnings.blackBox!, style: theme.textTheme.bodyMedium?.copyWith(color: theme.colorScheme.onErrorContainer)),
                ),
              ),
              const SizedBox(height: 16),
            ],
            _Section(
              title: l10n.warnings,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _InfoRow(l10n.alcoholWarning ?? 'Alcohol', med.warnings.alcoholWarning),
                  if (med.warnings.foodWarnings.isNotEmpty)
                    _InfoRow(l10n.foodWarnings ?? 'Food', med.warnings.foodWarnings.join('\n')),
                  _InfoRow(l10n.pregnancy, med.warnings.pregnancyCaution),
                ],
              ),
            ),
            const SizedBox(height: 16),
            
            // Interactions
            if (med.knownInteractions.isNotEmpty) ...[
              _Section(
                title: l10n.interactions,
                child: Column(
                  children: med.knownInteractions.map((inter) => _InteractionTile(interaction: inter)).toList(),
                ),
              ),
              const SizedBox(height: 16),
            ],
            
            // Ayurvedic Perspective
            if (_ayurvedaMappings.isNotEmpty) ...[
              _Section(
                title: l10n.ayurvedicPerspective,
                child: Column(
                  children: _ayurvedaMappings.map((mapping) => AyurvedaCard(mapping: mapping)).toList(),
                ),
              ),
              const SizedBox(height: 16),
            ],
            
            // Source info
            _Section(
              title: 'Source Information',
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _InfoRow('Source', med.source),
                  _InfoRow('Last Updated', med.lastUpdated),
                  _InfoRow('Version', 'v${med.version}'),
                  _InfoRow('ATC Codes', med.atcCodes.join(', ')),
                ],
              ),
            ),
            
            const SizedBox(height: 24),
            
            // Disclaimer
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: theme.colorScheme.surfaceContainerHighest,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Medical Disclaimer',
                    style: theme.textTheme.labelLarge?.copyWith(fontWeight: FontWeight.w700, color: theme.colorScheme.primary),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'This information is for educational purposes only and does not constitute medical advice. '
                    'Always consult a qualified healthcare professional before making any decisions about your medication. '
                    'Do not stop or change prescribed medications without medical supervision.',
                    style: theme.textTheme.bodySmall?.copyWith(color: theme.colorScheme.onSurface.withOpacity(0.8)),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _foodRequirementLabel(String requirement, AppLocalizations l10n) {
    switch (requirement) {
      case 'with_food': return 'With food';
      case 'empty_stomach': return 'Empty stomach';
      default: return 'With or without food';
    }
  }
}

class _HeaderCard extends StatelessWidget {
  final MedicationMonograph medication;

  const _HeaderCard({required this.medication});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  width: 64,
                  height: 64,
                  decoration: BoxDecoration(
                    color: theme.colorScheme.primaryContainer,
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Icon(Icons.medication, color: theme.colorScheme.onPrimaryContainer, size: 32),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        medication.genericName,
                        style: theme.textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w800),
                      ),
                      if (medication.brandNames.isNotEmpty) ...[
                        const SizedBox(height: 4),
                        Text(
                          medication.brandNames.take(3).join(', '),
                          style: theme.textTheme.bodyMedium?.copyWith(color: theme.colorScheme.onSurface.withOpacity(0.7)),
                        ),
                      ],
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: theme.colorScheme.primary.withOpacity(0.1),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text(
                medication.therapeuticClass,
                style: theme.textTheme.labelMedium?.copyWith(
                  color: theme.colorScheme.primary,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _Section extends StatelessWidget {
  final String title;
  final Widget child;

  const _Section({required this.title, required this.child});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(title, style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w700)),
        const SizedBox(height: 12),
        child,
      ],
    );
  }
}

class _InfoRow extends StatelessWidget {
  final String label;
  final String value;

  const _InfoRow(this.label, this.value);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 110,
            child: Text(
              label,
              style: theme.textTheme.labelMedium?.copyWith(
                color: theme.colorScheme.onSurface.withOpacity(0.6),
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          Expanded(child: Text(value, style: theme.textTheme.bodyMedium)),
        ],
      ),
    );
  }
}

class _SideEffectGroup extends StatelessWidget {
  final String label;
  final List<String> effects;
  final Color color;

  const _SideEffectGroup(this.label, this.effects, this.color);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    if (effects.isEmpty) return const SizedBox.shrink();
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Container(
              width: 10,
              height: 10,
              decoration: BoxDecoration(color: color, shape: BoxShape.circle),
            ),
            const SizedBox(width: 8),
            Text(label, style: theme.textTheme.labelLarge?.copyWith(fontWeight: FontWeight.w700, color: color)),
          ],
        ),
        const SizedBox(height: 8),
        ...effects.map((effect) => Padding(
          padding: const EdgeInsets.only(left: 18, bottom: 4),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(width: 6, height: 6, margin: const EdgeInsets.only(top: 6, right: 8), decoration: BoxDecoration(color: color, shape: BoxShape.circle)),
              Expanded(child: Text(effect, style: theme.textTheme.bodyMedium)),
            ],
          ),
        )).toList(),
        const SizedBox(height: 12),
      ],
    );
  }
}

class _InteractionTile extends StatelessWidget {
  final DrugInteraction interaction;

  const _InteractionTile({required this.interaction});

  Color _severityColor(String severity) {
    switch (severity.toLowerCase()) {
      case 'contraindicated': return Colors.red;
      case 'severe': return Colors.deepOrange;
      case 'moderate': return Colors.orange;
      default: return Colors.blue;
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final severityColor = _severityColor(interaction.severity);
    
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(
                    interaction.interactingDrug,
                    style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: severityColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: severityColor),
                  ),
                  child: Text(
                    interaction.severity,
                    style: theme.textTheme.labelSmall?.copyWith(color: severityColor, fontWeight: FontWeight.w700),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(interaction.effect, style: theme.textTheme.bodyMedium),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: theme.colorScheme.surfaceContainerHighest.withOpacity(0.5),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Icon(Icons.lightbulb_outline, size: 20, color: theme.colorScheme.primary),
                  const SizedBox(width: 12),
                  Expanded(child: Text(interaction.recommendation, style: theme.textTheme.bodyMedium)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}