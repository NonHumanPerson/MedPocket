import 'package:flutter/material.dart';
import '../../core/models/medication.dart';
import '../../shared/utils/app_localizations.dart';

class InteractionResultCard extends StatelessWidget {
  final InteractionCheckResult result;

  const InteractionResultCard({super.key, required this.result});

  Color _riskColor(BuildContext context, String risk) {
    final theme = Theme.of(context);
    switch (risk) {
      case 'Contraindicated':
        return theme.colorScheme.error;
      case 'Severe':
        return theme.colorScheme.error;
      case 'Moderate':
        return Colors.orange;
      default:
        return theme.colorScheme.primary;
    }
  }

  IconData _riskIcon(String risk) {
    switch (risk) {
      case 'Contraindicated':
        return Icons.dangerous;
      case 'Severe':
        return Icons.warning_amber;
      case 'Moderate':
        return Icons.warning;
      default:
        return Icons.check_circle;
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final theme = Theme.of(context);
    final riskColor = _riskColor(context, result.overallRisk);
    
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Overall risk banner
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: riskColor.withOpacity(0.1),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: riskColor, width: 2),
          ),
          child: Column(
            children: [
              Row(
                children: [
                  Icon(_riskIcon(result.overallRisk), color: riskColor, size: 32),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          l10n.overallRisk,
                          style: theme.textTheme.labelMedium?.copyWith(color: riskColor),
                        ),
                        Text(
                          result.overallRisk,
                          style: theme.textTheme.headlineMedium?.copyWith(
                            color: riskColor,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                      ],
                    ),
                  ),
                  if (result.isAiEnhanced)
                    Chip(
                      label: Text(l10n.aiEnhanced ?? 'AI Enhanced'),
                      backgroundColor: theme.colorScheme.secondaryContainer,
                    ),
                ],
              ),
              const SizedBox(height: 16),
              Text(
                result.summary,
                style: theme.textTheme.bodyMedium,
              ),
            ],
          ),
        ),
        
        const SizedBox(height: 24),
        
        // Interaction pairs
        if (result.pairs.isNotEmpty) ...[
          Text(l10n.interactions, style: theme.textTheme.titleLarge),
          const SizedBox(height: 12),
          ...result.pairs.map((pair) => _InteractionPairTile(pair: pair, riskColor: riskColor)).toList(),
        ] else ...[
          Center(
            child: Column(
              children: [
                Icon(Icons.check_circle, size: 64, color: theme.colorScheme.primary.withOpacity(0.5)),
                const SizedBox(height: 16),
                Text(l10n.noInteractions, style: theme.textTheme.headlineSmall?.copyWith(color: theme.colorScheme.onSurface.withOpacity(0.6))),
              ],
            ),
          ),
        ],
        
        const SizedBox(height: 24),
        
        // Monitoring tips
        if (result.monitoringTips.isNotEmpty) ...[
          Text(l10n.monitoringTips, style: theme.textTheme.titleLarge),
          const SizedBox(height: 12),
          ...result.monitoringTips.map((tip) => Padding(
            padding: const EdgeInsets.only(bottom: 8),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Icon(Icons.circle, size: 8, color: theme.colorScheme.primary, margin: const EdgeInsets.only(top: 6, right: 12)),
                Expanded(child: Text(tip, style: theme.textTheme.bodyMedium)),
              ],
            ),
          )).toList(),
        ],
      ],
    );
  }
}

class _InteractionPairTile extends StatelessWidget {
  final InteractionPair pair;
  final Color riskColor;

  const _InteractionPairTile({required this.pair, required this.riskColor});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final severityColor = _severityColor(pair.severity);
    
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(pair.drugA, style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700)),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          Icon(Icons.arrow_right_alt, size: 16, color: theme.colorScheme.onSurface.withOpacity(0.5)),
                          const SizedBox(width: 4),
                          Text(pair.drugB, style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700)),
                        ],
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: severityColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: severityColor),
                  ),
                  child: Text(
                    pair.severity,
                    style: theme.textTheme.labelMedium?.copyWith(
                      color: severityColor,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(pair.clinicalEffect, style: theme.textTheme.bodyMedium),
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
                  Expanded(child: Text(pair.actionRecommendation, style: theme.textTheme.bodyMedium)),
                ],
              ),
            ),
          ],
        ),
    );
  }

  Color _severityColor(String severity) {
    switch (severity.toLowerCase()) {
      case 'contraindicated':
        return Colors.red;
      case 'severe':
        return Colors.deepOrange;
      case 'moderate':
        return Colors.orange;
      default:
        return Colors.blue;
    }
  }
}