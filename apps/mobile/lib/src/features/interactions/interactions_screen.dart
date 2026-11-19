import 'package:flutter/material.dart';
import '../../core/services/medication_service.dart';
import '../../core/services/interaction_checker.dart';
import '../../core/models/medication.dart';
import '../../shared/utils/app_localizations.dart';
import '../../shared/widgets/interaction_result_card.dart';
import '../../shared/widgets/medication_chip.dart';

class InteractionsScreen extends StatefulWidget {
  final List<String> initialMedicationIds;

  const InteractionsScreen({
    super.key,
    this.initialMedicationIds = const [],
  });

  @override
  State<InteractionsScreen> createState() => _InteractionsScreenState();
}

class _InteractionsScreenState extends State<InteractionsScreen> {
  final MedicationService _medService = MedicationService();
  final TextEditingController _searchController = TextEditingController();
  
  List<String> _selectedMedicationIds = [];
  List<MedicationMonograph> _selectedMedications = [];
  List<MedicationMonograph> _searchResults = [];
  InteractionCheckResult? _result;
  bool _isChecking = false;
  bool _isSearching = false;

  @override
  void initState() {
    super.initState();
    _selectedMedicationIds = List.from(widget.initialMedicationIds);
    _loadSelectedMedications();
  }

  Future<void> _loadSelectedMedications() async {
    final medications = <MedicationMonograph>[];
    for (final id in _selectedMedicationIds) {
      final med = await _medService.getById(id);
      if (med != null) medications.add(med);
    }
    setState(() => _selectedMedications = medications);
  }

  Future<void> _search(String query) async {
    if (query.trim().isEmpty) {
      setState(() => _searchResults = []);
      return;
    }
    setState(() => _isSearching = true);
    try {
      final results = await _medService.search(query);
      // Filter out already selected
      final filtered = results.where((m) => !_selectedMedicationIds.contains(m.id)).toList();
      setState(() => _searchResults = filtered);
    } finally {
      setState(() => _isSearching = false);
    }
  }

  void _addMedication(MedicationMonograph medication) {
    if (!_selectedMedicationIds.contains(medication.id)) {
      setState(() {
        _selectedMedicationIds.add(medication.id);
        _selectedMedications.add(medication);
        _searchController.clear();
        _searchResults = [];
      });
    }
  }

  void _removeMedication(String id) {
    setState(() {
      _selectedMedicationIds.remove(id);
      _selectedMedications.removeWhere((m) => m.id == id);
      _result = null;
    });
  }

  Future<void> _checkInteractions() async {
    if (_selectedMedicationIds.length < 2) return;
    
    setState(() => _isChecking = true);
    try {
      final result = await checkInteractionsWithDatabase(
        _selectedMedicationIds,
        await _medService.getAll(),
      );
      setState(() => _result = result);
    } finally {
      setState(() => _isChecking = false);
    }
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final theme = Theme.of(context);
    
    return Scaffold(
      appBar: AppBar(title: Text(l10n.interactionCheck)),
      body: Column(
        children: [
          // Selected medications
          if (_selectedMedications.isNotEmpty) ...[
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: theme.colorScheme.surface,
                border: Border(bottom: BorderSide(color: theme.dividerTheme.color!)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '${l10n.checkInteractions} (${_selectedMedications.length})',
                    style: theme.textTheme.titleMedium,
                  ),
                  const SizedBox(height: 12),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: _selectedMedications.map((med) => MedicationChip(
                      label: med.genericName,
                      onDeleted: () => _removeMedication(med.id),
                    )).toList(),
                  ),
                ],
              ),
            ),
          ],
          
          // Search
          Padding(
            padding: const EdgeInsets.all(16),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: l10n.searchHint,
                prefixIcon: const Icon(Icons.search),
                suffixIcon: _searchController.text.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear),
                        onPressed: () {
                          _searchController.clear();
                          _search('');
                        },
                      )
                    : null,
              ),
              onChanged: _search,
            ),
          ),
          
          // Search results
          if (_searchResults.isNotEmpty) ...[
            const Divider(),
            Expanded(
              child: ListView.builder(
                itemCount: _searchResults.length,
                itemBuilder: (_, index) {
                  final med = _searchResults[index];
                  return ListTile(
                    title: Text(med.genericName),
                    subtitle: Text(med.brandNames.take(2).join(', ')),
                    trailing: Icon(Icons.add_circle_outline, color: theme.colorScheme.primary),
                    onTap: () => _addMedication(med),
                  );
                },
              ),
            ),
          ] else if (_selectedMedications.length < 2) ...[
            // Empty state
            Expanded(
              child: Center(
                child: Padding(
                  padding: const EdgeInsets.all(32),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.shield_outlined, size: 80, color: theme.colorScheme.onSurface.withOpacity(0.2)),
                      const SizedBox(height: 24),
                      Text(l10n.addMedicinesToCheck, style: theme.textTheme.headlineSmall?.copyWith(color: theme.colorScheme.onSurface.withOpacity(0.6))),
                    ],
                  ),
                ),
              ),
            ),
          ],
          
          // Check button
          if (_selectedMedications.length >= 2 && _result == null)
            Padding(
              padding: const EdgeInsets.all(16),
              child: SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: _isChecking ? null : _checkInteractions,
                  icon: _isChecking
                      ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2))
                      : const Icon(Icons.shield),
                  label: Text(_isChecking ? l10n.loading : l10n.checkInteractions),
                ),
              ),
            ),
          
          // Result
          if (_result != null) ...[
            const Divider(),
            Expanded(
              child: InteractionResultCard(result: _result!),
            ),
          ],
        ],
      ),
    );
  }
}