import 'package:flutter/material.dart';
import '../../core/services/medication_service.dart';
import '../../core/models/medication.dart';
import '../../shared/utils/app_localizations.dart';
import '../../shared/widgets/medication_card.dart';
import '../medication_detail/medication_detail_screen.dart';
import '../search/search_screen.dart';

class CabinetScreen extends StatefulWidget {
  const CabinetScreen({super.key});

  @override
  State<CabinetScreen> createState() => _CabinetScreenState();
}

class _CabinetScreenState extends State<CabinetScreen> {
  final CabinetService _cabinetService = CabinetService();
  final MedicationService _medService = MedicationService();
  
  List<UserCabinetItem> _cabinetItems = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadCabinet();
  }

  Future<void> _loadCabinet() async {
    await _cabinetService.load();
    setState(() {
      _cabinetItems = _cabinetService.cabinet;
      _isLoading = false;
    });
  }

  Future<void> _addMedicine() async {
    final result = await Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => const AddMedicineScreen()),
    );
    if (result == true) {
      _loadCabinet();
    }
  }

  Future<void> _removeItem(String id) async {
    final l10n = AppLocalizations.of(context)!;
    final confirm = await showDialog<bool>(
      context: context,
      builder: (_) => AlertDialog(
        title: Text(l10n.removeConfirmation),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: Text(l10n.cancel)),
          TextButton(onPressed: () => Navigator.pop(context, true), child: Text(l10n.delete)),
        ],
      ),
    );
    
    if (confirm == true) {
      await _cabinetService.remove(id);
      _loadCabinet();
    }
  }

  Future<void> _toggleTaken(String id) async {
    await _cabinetService.toggleTaken(id);
    _loadCabinet();
  }

  void _navigateToDetail(MedicationMonograph medication) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => MedicationDetailScreen(medication: medication)),
    );
  }

  Future<void> _checkInteractions() async {
    if (_cabinetItems.length < 2) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(AppLocalizations.of(context)!.interactionCheck)),
      );
      return;
    }
    
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => InteractionsScreen(
          initialMedicationIds: _cabinetItems.map((i) => i.medicationId).toList(),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final theme = Theme.of(context);
    
    return Scaffold(
      appBar: AppBar(
        title: Text(l10n.myCabinet),
        actions: [
          if (_cabinetItems.isNotEmpty)
            IconButton(
              icon: const Icon(Icons.shield),
              onPressed: _checkInteractions,
              tooltip: l10n.interactionCheck,
            ),
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: _addMedicine,
            tooltip: l10n.addMedicine,
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _cabinetItems.isEmpty
              ? _emptyState()
              : _cabinetList(),
      floatingActionButton: _cabinetItems.isNotEmpty
          ? FloatingActionButton.extended(
              onPressed: _checkInteractions,
              icon: const Icon(Icons.shield),
              label: Text(l10n.checkInteractions),
            )
          : null,
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
            Icon(Icons.medication_outlined, size: 80, color: theme.colorScheme.onSurface.withOpacity(0.2)),
            const SizedBox(height: 24),
            Text(
              l10n.emptyCabinet,
              style: theme.textTheme.headlineSmall?.copyWith(color: theme.colorScheme.onSurface.withOpacity(0.6)),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 12),
            Text(
              l10n.emptyCabinetSubtitle,
              style: theme.textTheme.bodyMedium?.copyWith(color: theme.colorScheme.onSurface.withOpacity(0.4)),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: _addMedicine,
              icon: const Icon(Icons.add),
              label: Text(l10n.addMedicine),
            ),
          ],
        ),
      ),
    );
  }

  Widget _cabinetList() {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _cabinetItems.length,
      itemBuilder: (_, index) {
        final item = _cabinetItems[index];
        return _CabinetItemTile(
          item: item,
          onTap: () => _loadMedicationAndNavigate(item.medicationId),
          onToggleTaken: () => _toggleTaken(item.id),
          onRemove: () => _removeItem(item.id),
        );
      },
    );
  }

  Future<void> _loadMedicationAndNavigate(String medicationId) async {
    final medication = await _medService.getById(medicationId);
    if (medication != null && mounted) {
      _navigateToDetail(medication);
    }
  }
}

class _CabinetItemTile extends StatelessWidget {
  final UserCabinetItem item;
  final VoidCallback onTap;
  final VoidCallback onToggleTaken;
  final VoidCallback onRemove;

  const _CabinetItemTile({
    required this.item,
    required this.onTap,
    required this.onToggleTaken,
    required this.onRemove,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isTaken = item.takenToday;
    
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              // Taken checkbox
              Checkbox(
                value: isTaken,
                onChanged: (_) => onToggleTaken(),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
              ),
              const SizedBox(width: 12),
              
              // Info
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      item.drugName,
                      style: theme.textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w700,
                        decoration: isTaken ? TextDecoration.lineThrough : null,
                        color: isTaken ? theme.colorScheme.onSurface.withOpacity(0.5) : null,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '${item.dosage} • ${item.frequency}',
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: theme.colorScheme.onSurface.withOpacity(0.6),
                      ),
                    ),
                    if (item.timing.isNotEmpty) ...[
                      const SizedBox(height: 2),
                      Text(
                        item.timing,
                        style: theme.textTheme.labelSmall?.copyWith(
                          color: theme.colorScheme.onSurface.withOpacity(0.5),
                        ),
                      ),
                    ],
                  ],
                ),
              ),
              
              // Actions
              PopupMenuButton<String>(
                onSelected: (value) {
                  if (value == 'remove') onRemove();
                },
                itemBuilder: (_) => [
                  PopupMenuItem(value: 'remove', child: Text(AppLocalizations.of(context)!.delete)),
                ],
                child: Icon(Icons.more_vert, color: theme.colorScheme.onSurface.withOpacity(0.4)),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class AddMedicineScreen extends StatefulWidget {
  const AddMedicineScreen({super.key});

  @override
  State<AddMedicineScreen> createState() => _AddMedicineScreenState();
}

class _AddMedicineScreenState extends State<AddMedicineScreen> {
  final MedicationService _medService = MedicationService();
  final CabinetService _cabinetService = CabinetService();
  
  final TextEditingController _searchController = TextEditingController();
  List<MedicationMonograph> _searchResults = [];
  bool _isSearching = false;
  String _selectedMedicationId = '';
  final TextEditingController _dosageController = TextEditingController();
  final TextEditingController _frequencyController = TextEditingController();
  final TextEditingController _timingController = TextEditingController();
  final TextEditingController _notesController = TextEditingController();

  @override
  void dispose() {
    _searchController.dispose();
    _dosageController.dispose();
    _frequencyController.dispose();
    _timingController.dispose()
    _notesController.dispose();
    super.dispose();
  }

  Future<void> _search(String query) async {
    if (query.trim().isEmpty) {
      setState(() => _searchResults = []);
      return;
    }
    setState(() => _isSearching = true);
    try {
      final results = await _medService.search(query);
      setState(() => _searchResults = results);
    } finally {
      setState(() => _isSearching = false);
    }
  }

  Future<void> _save() async {
    if (_selectedMedicationId.isEmpty) return;
    
    final medication = await _medService.getById(_selectedMedicationId);
    if (medication == null) return;
    
    await _cabinetService.add(UserCabinetItem(
      id: 'item_${DateTime.now().millisecondsSinceEpoch}',
      medicationId: _selectedMedicationId,
      drugName: medication.genericName,
      dosage: _dosageController.text.isEmpty ? medication.standardDosage : _dosageController.text,
      frequency: _frequencyController.text.isEmpty ? 'As prescribed' : _frequencyController.text,
      timing: _timingController.text,
      notes: _notesController.text.isEmpty ? null : _notesController.text,
      dateAdded: DateTime.now().toIso8601String().split('T')[0],
    ));
    
    if (mounted) Navigator.pop(context, true);
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final theme = Theme.of(context);
    
    return Scaffold(
      appBar: AppBar(title: Text(l10n.addMedicine)),
      body: Column(
        children: [
          // Search
          Padding(
            padding: const EdgeInsets.all(16),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: l10n.searchHint,
                prefixIcon: const Icon(Icons.search),
              ),
              onChanged: _search,
            ),
          ),
          
          // Results
          Expanded(
            child: _isSearching
                ? const Center(child: CircularProgressIndicator())
                : _searchResults.isEmpty
                    ? Center(child: Text(l10n.searchPlaceholder))
                    : ListView.builder(
                        itemCount: _searchResults.length,
                        itemBuilder: (_, index) {
                          final med = _searchResults[index];
                          return ListTile(
                            title: Text(med.genericName),
                            subtitle: Text(med.brandNames.take(2).join(', ')),
                            trailing: _selectedMedicationId == med.id
                                ? Icon(Icons.check_circle, color: theme.colorScheme.primary)
                                : null,
                            onTap: () => setState(() => _selectedMedicationId = med.id),
                          );
                        },
                      ),
          ),
          
          // Details form
          if (_selectedMedicationId.isNotEmpty) ...[
            const Divider(),
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  TextField(
                    controller: _dosageController,
                    decoration: InputDecoration(labelText: l10n.dosage),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: _frequencyController,
                    decoration: InputDecoration(labelText: l10n.frequency),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: _timingController,
                    decoration: InputDecoration(labelText: l10n.timing),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: _notesController,
                    decoration: InputDecoration(labelText: l10n.notes),
                    maxLines: 2,
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(16),
              child: SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _save,
                  child: Text(l10n.save),
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}