import 'package:flutter/material.dart';
import '../../core/services/medication_service.dart';
import '../../core/services/ocr_service.dart';
import '../../core/models/medication.dart';
import '../../shared/utils/app_localizations.dart';
import '../../shared/widgets/medication_card.dart';
import '../../shared/widgets/search_bar.dart';
import '../medication_detail/medication_detail_screen.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final TextEditingController _searchController = TextEditingController();
  final MedicationService _medService = MedicationService();
  final OcrService _ocrService = OcrService();
  
  List<MedicationMonograph> _results = [];
  List<MedicationMonograph> _popular = [];
  bool _isSearching = false;
  String _query = '';

  @override
  void initState() {
    super.initState();
    _loadPopular();
  }

  Future<void> _loadPopular() async {
    try {
      final all = await _medService.getAll();
      setState(() => _popular = all.take(8).toList());
    } catch (_) {}
  }

  Future<void> _search(String query) async {
    if (query.trim().isEmpty) {
      setState(() {
        _results = [];
        _query = '';
      });
      return;
    }
    
    setState(() {
      _isSearching = true;
      _query = query.trim();
    });
    
    try {
      final results = await _medService.search(_query);
      setState(() => _results = results);
    } catch (e) {
      setState(() => _results = []);
    } finally {
      setState(() => _isSearching = false);
    }
  }

  Future<void> _scanLabel() async {
    final l10n = AppLocalizations.of(context)!;
    
    try {
      final image = await _ocrService.pickImage(fromCamera: true);
      if (image == null) return;
      
      // Show processing dialog
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (_) => AlertDialog(
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const CircularProgressIndicator(),
              const SizedBox(height: 16),
              Text(l10n.processing),
            ],
          ),
        ),
      );
      
      final database = await _medService.getAll();
      final detected = await _ocrService.scanForMedications(image, database);
      
      if (!mounted) return;
      Navigator.pop(context); // Close processing dialog
      
      if (detected.isEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(l10n.noTextDetected)),
        );
        return;
      }
      
      // If only one detected, go directly to detail
      if (detected.length == 1) {
        _navigateToDetail(detected.first);
      } else {
        // Show selection dialog
        _showDetectedDialog(detected);
      }
    } catch (e) {
      if (mounted) {
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('${l10n.error}: $e')),
        );
      }
    }
  }

  void _showDetectedDialog(List<MedicationMonograph> detected) {
    final l10n = AppLocalizations.of(context)!;
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: Text(l10n.detectedMedicines),
        content: SizedBox(
          width: double.maxFinite,
          child: ListView.builder(
            shrinkWrap: true,
            itemCount: detected.length,
            itemBuilder: (_, index) {
              final med = detected[index];
              return ListTile(
                title: Text(med.genericName),
                subtitle: Text(med.brandNames.firstOrNull ?? ''),
                onTap: () {
                  Navigator.pop(context);
                  _navigateToDetail(med);
                },
              );
            },
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text(l10n.cancel),
          ),
        ],
      ),
    );
  }

  void _navigateToDetail(MedicationMonograph medication) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => MedicationDetailScreen(medication: medication),
      ),
    );
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
      appBar: AppBar(
        title: Text(l10n.appName),
        actions: [
          IconButton(
            icon: const Icon(Icons.camera_alt),
            onPressed: _scanLabel,
            tooltip: l10n.scanButton,
          ),
        ],
      ),
      body: Column(
        children: [
          // Search bar
          SearchBarWidget(
            controller: _searchController,
            hintText: l10n.searchHint,
            onChanged: _search,
            onClear: () {
              _searchController.clear();
              _search('');
            },
          ),
          
          // Results
          Expanded(
            child: _isSearching
                ? const Center(child: CircularProgressIndicator())
                : _query.isNotEmpty
                    ? _results.isEmpty
                        ? _emptyState(l10n.noResults, Icons.search_off)
                        : _resultsList()
                    : _popularList(),
          ),
        ],
      ),
    );
  }

  Widget _emptyState(String message, IconData icon) {
    final l10n = AppLocalizations.of(context)!;
    final theme = Theme.of(context);
    
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, size: 64, color: theme.colorScheme.onSurface.withOpacity(0.3)),
          const SizedBox(height: 16),
          Text(message, style: theme.textTheme.headlineSmall?.copyWith(color: theme.colorScheme.onSurface.withOpacity(0.6))),
          const SizedBox(height: 8),
          Text(l10n.searchPlaceholder, style: theme.textTheme.bodyMedium?.copyWith(color: theme.colorScheme.onSurface.withOpacity(0.4))),
        ],
      ),
    );
  }

  Widget _resultsList() {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _results.length,
      itemBuilder: (_, index) {
        final med = _results[index];
        return MedicationCard(
          medication: med,
          onTap: () => _navigateToDetail(med),
        );
      },
    );
  }

  Widget _popularList() {
    if (_popular.isEmpty) {
      return const Center(child: CircularProgressIndicator());
    }
    
    final l10n = AppLocalizations.of(context)!;
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
          child: Text(
            l10n.popularMedicines,
            style: Theme.of(context).textTheme.titleLarge,
          ),
        ),
        Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: _popular.length,
            itemBuilder: (_, index) {
              final med = _popular[index];
              return MedicationCard(
                medication: med,
                onTap: () => _navigateToDetail(med),
              );
            },
          ),
        ),
      ],
    );
  }
}