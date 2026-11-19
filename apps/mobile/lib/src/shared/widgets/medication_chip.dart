import 'package:flutter/material.dart';

class MedicationChip extends StatelessWidget {
  final String label;
  final VoidCallback? onDeleted;
  final Color? backgroundColor;
  final Color? textColor;

  const MedicationChip({
    super.key,
    required this.label,
    this.onDeleted,
    this.backgroundColor,
    this.textColor,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Chip(
      label: Text(label, style: TextStyle(color: textColor ?? theme.colorScheme.onPrimaryContainer)),
      backgroundColor: backgroundColor ?? theme.colorScheme.primaryContainer,
      deleteIcon: onDeleted != null ? const Icon(Icons.close, size: 16) : null,
      onDeleted: onDeleted,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      side: BorderSide.none,
      padding: const EdgeInsets.symmetric(horizontal: 8),
    );
  }
}