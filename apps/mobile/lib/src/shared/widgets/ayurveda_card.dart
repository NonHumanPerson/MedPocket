import 'package:flutter/material.dart';
import '../../core/models/ayurveda.dart';
import '../../shared/utils/app_localizations.dart';

class AyurvedaCard extends StatelessWidget {
  final AyurvedicMapping mapping;

  const AyurvedaCard({super.key, required this.mapping});

  Color _gradeColor(String grade) {
    switch (grade.toUpperCase()) {
      case 'A': return Colors.green;
      case 'B': return Colors.blue;
      case 'C': return Colors.orange;
      case 'D': return Colors.red;
      default: return Colors.grey;
    }
  }

  String _gradeLabel(String grade) {
    switch (grade.toUpperCase()) {
      case 'A': return 'A - Systematic Review / RCT';
      case 'B': return 'B - Small Clinical Studies';
      case 'C': return 'C - Classical Texts / Preclinical Only';
      case 'D': return 'D - Anecdotal / Traditional Use Only';
      default: return grade;
    }
  }

  String _interactionSeverityColor(String severity) {
    switch (severity.toLowerCase()) {
      case 'severe': return '🔴';
      case 'moderate': return '🟠';
      case 'minor': return '🟡';
      case 'none': return '🟢';
      default: return '⚪';
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final theme = Theme.of(context);
    final gradeColor = _gradeColor(mapping.evidence.grade);
    
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: ExpansionTile(
        tilePadding: const EdgeInsets.all(16),
        childrenPadding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
        leading: Container(
          width: 48,
          height: 48,
          decoration: BoxDecoration(
            color: theme.colorScheme.primaryContainer,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Icon(Icons.spa, color: theme.colorScheme.onPrimaryContainer, size: 24),
        ),
        title: Text(
          mapping.formulation.nameCommon,
          style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 4),
            Text(
              mapping.formulation.nameSanskrit,
              style: theme.textTheme.bodySmall?.copyWith(
                color: theme.colorScheme.onSurface.withOpacity(0.6),
                fontStyle: FontStyle.italic,
              ),
            ),
            const SizedBox(height: 4),
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                  decoration: BoxDecoration(
                    color: gradeColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: gradeColor),
                  ),
                  child: Text(
                    _gradeLabel(mapping.evidence.grade),
                    style: theme.textTheme.labelSmall?.copyWith(
                      color: gradeColor,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Text(
                  '${_interactionSeverityColor(mapping.safety.interactionSeverity)} ${mapping.safety.interactionSeverity.capitalize()}',
                  style: theme.textTheme.labelSmall?.copyWith(
                    color: theme.colorScheme.onSurface.withOpacity(0.7),
                  ),
                ),
              ],
            ),
          ],
        ),
        children: [
          // Disclaimer banner
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: theme.colorScheme.errorContainer.withOpacity(0.3),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: theme.colorScheme.error.withOpacity(0.5)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Icon(Icons.warning_amber, color: theme.colorScheme.error, size: 20),
                    const SizedBox(width: 8),
                    Text(
                      l10n.notVerified,
                      style: theme.textTheme.labelLarge?.copyWith(
                        color: theme.colorScheme.error,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  l10n.pendingReview,
                  style: theme.textTheme.bodySmall?.copyWith(color: theme.colorScheme.onSurface.withOpacity(0.8)),
                ),
              ],
            ),
          ),
          
          const SizedBox(height: 16),
          
          // Formulation
          _SectionTitle(l10n.formulation),
          const SizedBox(height: 8),
          _InfoRow(l10n.ingredients, mapping.formulation.ingredients
              .map((i) => '${i.botanical} (${i.part})${i.dose != null ? ' - ${i.dose}' : ''}')
              .join('\n')),
          if (mapping.formulation.classicalSource != null) ...[
            const SizedBox(height: 8),
            _InfoRow(l10n.classicalSource ?? 'Classical Source', mapping.formulation.classicalSource!),
          ],
          if (mapping.formulation.pharmacopoeiaRef != null) ...[
            const SizedBox(height: 8),
            _InfoRow('Pharmacopoeia Ref', mapping.formulation.pharmacopoeiaRef!),
          ],
          
          const SizedBox(height: 16),
          
          // Traditional use
          _SectionTitle(l10n.traditionalUse),
          const SizedBox(height: 8),
          Text(mapping.traditionalUse, style: theme.textTheme.bodyMedium),
          
          const SizedBox(height: 16),
          
          // Preparation
          _SectionTitle(l10n.preparation),
          const SizedBox(height: 8),
          Text(mapping.preparationAndDose, style: theme.textTheme.bodyMedium),
          
          const SizedBox(height: 16),
          
          // Evidence
          _SectionTitle(l10n.evidenceGrade),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: gradeColor.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: gradeColor.withOpacity(0.3)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: gradeColor,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        mapping.evidence.grade,
                        style: theme.textTheme.labelLarge?.copyWith(color: Colors.white, fontWeight: FontWeight.w700),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Text(_gradeLabel(mapping.evidence.grade), style: theme.textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.w600)),
                  ],
                ),
                const SizedBox(height: 12),
                Text(mapping.evidence.summary, style: theme.textTheme.bodyMedium),
                if (mapping.evidence.citations.isNotEmpty) ...[
                  const SizedBox(height: 12),
                  Text(l10n.citations, style: theme.textTheme.labelMedium?.copyWith(fontWeight: FontWeight.w600)),
                  const SizedBox(height: 8),
                  ...mapping.evidence.citations.map((c) => Padding(
                    padding: const EdgeInsets.only(bottom: 4),
                    child: Text('• ${c.type.toUpperCase()}: ${c.ref}', style: theme.textTheme.bodySmall),
                  )).toList(),
                ],
              ],
            ),
          ),
          
          const SizedBox(height: 16),
          
          // Safety
          _SectionTitle(l10n.safetyProfile),
          const SizedBox(height: 8),
          _InfoRow(l10n.interactionRisk, mapping.safety.interactionSeverity.capitalize()),
          if (mapping.safety.interactionNotes.isNotEmpty) ...[
            const SizedBox(height: 8),
            _InfoRow(l10n.interactionNotes ?? 'Notes', mapping.safety.interactionNotes.join('; ')),
          ],
          if (mapping.safety.contraindications.isNotEmpty) ...[
            const SizedBox(height: 8),
            _InfoRow(l10n.contraindications, mapping.safety.contraindications.join(', ')),
          ],
          const SizedBox(height: 8),
          _InfoRow(l10n.pregnancy, mapping.safety.pregnancy.capitalize()),
          if (mapping.safety.narrowTherapeuticIndex) ...[
            const SizedBox(height: 8),
            Row(
              children: [
                Icon(Icons.warning, color: theme.colorScheme.error, size: 20),
                const SizedBox(width: 8),
                Text(
                  'Narrow Therapeutic Index Drug - High Risk',
                  style: theme.textTheme.bodyMedium?.copyWith(
                    color: theme.colorScheme.error,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ],
            ),
          ],
          
          const SizedBox(height: 16),
          
          // Disclaimer
          _SectionTitle(l10n.disclaimer),
          const SizedBox(height: 8),
          Text(mapping.disclaimer, style: theme.textTheme.bodySmall?.copyWith(color: theme.colorScheme.onSurface.withOpacity(0.7))),
          
          const SizedBox(height: 16),
          
          // Verification status
          if (mapping.verification.status != 'published') ...[
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: theme.colorScheme.surfaceContainerHighest,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                children: [
                  Icon(Icons.info_outline, color: theme.colorScheme.onSurface.withOpacity(0.5), size: 20),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      'Status: ${mapping.verification.status.replaceAll('_', ' ').capitalize()} • v${mapping.verification.version} • Updated ${mapping.verification.lastUpdated}',
                      style: theme.textTheme.bodySmall?.copyWith(color: theme.colorScheme.onSurface.withOpacity(0.6)),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }
}

class _SectionTitle extends StatelessWidget {
  final String title;

  const _SectionTitle(this.title);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Text(
      title,
      style: theme.textTheme.titleSmall?.copyWith(
        fontWeight: FontWeight.w700,
        color: theme.colorScheme.primary,
      ),
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
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 120,
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

extension StringExtension on String {
  String capitalize() {
    if (isEmpty) return this;
    return '${this[0].toUpperCase()}${substring(1)}';
  }
}