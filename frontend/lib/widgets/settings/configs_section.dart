import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../providers/configs_provider.dart';
import '../../services/configs_api.dart';
import '../../theme/tokens.dart';
import '../../widgets/icons.dart';
import '../node_drawer/payload_editor.dart';

/// Settings section: project-scoped configuration objects (named Elixir
/// literals stored server-side in configs/*.yaml). Each card expands to a
/// PayloadEditor bound to its source. Nodes opt in via config.config_key.
class ConfigsSection extends ConsumerWidget {
  const ConfigsSection({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final configsAsync = ref.watch(configsProvider);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        _header(context, ref),
        const SizedBox(height: 14),
        configsAsync.when(
          loading: () => Padding(
            padding: const EdgeInsets.symmetric(vertical: 24),
            child: Center(
              child: SizedBox(
                width: 16,
                height: 16,
                child:
                    CircularProgressIndicator(strokeWidth: 2, color: AppColors.fg2),
              ),
            ),
          ),
          error: (e, _) =>
              _errorRow('Failed to load configuration objects: $e'),
          data: (items) {
            if (items.isEmpty) {
              return Padding(
                padding: const EdgeInsets.symmetric(vertical: 16),
                child: Text(
                  'No configuration objects yet. Click + New to create one, '
                  'then reference it from a node via config.config_key.',
                  style: TextStyle(
                      fontFamily: 'monospace',
                      fontSize: 12,
                      color: AppColors.fg2,
                      height: 1.5),
                ),
              );
            }
            return Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                _subHeader('CONFIGS (${items.length})'),
                ...items.map((c) => _ConfigCard(config: c)),
              ],
            );
          },
        ),
      ],
    );
  }

  Widget _header(BuildContext context, WidgetRef ref) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('CONFIGURATION OBJECTS',
                  style: TextStyle(
                      fontFamily: 'monospace',
                      fontSize: 11,
                      letterSpacing: 0.08 * 11,
                      color: AppColors.fg3,
                      fontWeight: FontWeight.w600)),
              const SizedBox(height: 6),
              Text(
                'Named Elixir literals stored server-side (configs/*.yaml). '
                'Reference one from a node via config.config_key; its term is '
                "deep-merged over the node's inline config at deploy.",
                style: TextStyle(
                    fontFamily: 'monospace',
                    fontSize: 12,
                    color: AppColors.fg2,
                    height: 1.5),
              ),
            ],
          ),
        ),
        const SizedBox(width: 10),
        MouseRegion(
          cursor: SystemMouseCursors.click,
          child: GestureDetector(
            onTap: () => _promptNewKey(context, ref),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              decoration: BoxDecoration(
                color: AppColors.accent,
                borderRadius: BorderRadius.circular(6),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  CartaIcon(icon: CartaIconData.plus, size: 11, color: AppColors.accentInk),
                  const SizedBox(width: 5),
                  Text('New',
                      style: TextStyle(
                          fontFamily: 'monospace',
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                          color: AppColors.accentInk)),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }

  Future<void> _promptNewKey(BuildContext context, WidgetRef ref) async {
    final ctrl = TextEditingController();
    final key = await showDialog<String>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppColors.bg2,
        shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppRadius.md),
            side: BorderSide(color: AppColors.border2)),
        title: Text('New configuration object',
            style: TextStyle(
                fontFamily: 'monospace',
                fontSize: 15,
                fontWeight: FontWeight.w600,
                color: AppColors.fg0)),
        content: TextField(
          controller: ctrl,
          autofocus: true,
          style: TextStyle(fontFamily: 'monospace', fontSize: 13, color: AppColors.fg0),
          decoration: InputDecoration(
            hintText: 'key name (e.g. db_settings)',
            hintStyle: TextStyle(fontFamily: 'monospace', fontSize: 12, color: AppColors.fg3),
            enabledBorder: UnderlineInputBorder(borderSide: BorderSide(color: AppColors.border2)),
            focusedBorder: UnderlineInputBorder(borderSide: BorderSide(color: AppColors.accent)),
          ),
          onSubmitted: (v) => Navigator.of(ctx).pop(v.trim()),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: Text('Cancel',
                style: TextStyle(fontFamily: 'monospace', color: AppColors.fg2)),
          ),
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(ctrl.text.trim()),
            child: Text('Create',
                style: TextStyle(fontFamily: 'monospace', fontWeight: FontWeight.w600)),
          ),
        ],
      ),
    );

    if (key == null || key.isEmpty) return;
    try {
      await ref.read(configsApiProvider).create(key, '%{}');
      ref.invalidate(configsProvider);
    } on ConfigsApiException catch (e) {
      if (!context.mounted) return;
      _snack(context,
          e.statusCode == 409 ? "Key '$key' already exists." : 'Create failed: $e',
          danger: true);
    } catch (e) {
      if (!context.mounted) return;
      _snack(context, 'Create failed: $e', danger: true);
    }
  }

  void _snack(BuildContext context, String msg, {bool danger = false}) {
    if (!context.mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: SelectableText(msg, style: const TextStyle(fontFamily: 'monospace')),
        backgroundColor: danger ? AppColors.danger : AppColors.accent,
      ),
    );
  }

  Widget _subHeader(String label) {
    return Padding(
      padding: const EdgeInsets.only(top: 6, bottom: 8),
      child: Text(label,
          style: TextStyle(
              fontFamily: 'monospace',
              fontSize: 10,
              letterSpacing: 0.06 * 10,
              color: AppColors.fg3,
              fontWeight: FontWeight.w600)),
    );
  }

  Widget _errorRow(String msg) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 16),
      child: SelectableText(msg,
          style: TextStyle(fontFamily: 'monospace', fontSize: 12, color: AppColors.danger)),
    );
  }
}

class _ConfigCard extends ConsumerStatefulWidget {
  final ConfigDto config;
  const _ConfigCard({required this.config});

  @override
  ConsumerState<_ConfigCard> createState() => _ConfigCardState();
}

class _ConfigCardState extends ConsumerState<_ConfigCard> {
  bool _expanded = false;
  bool _inFlight = false;
  String? _lastSaved;

  @override
  Widget build(BuildContext context) {
    final cfg = widget.config;
    return Container(
      margin: const EdgeInsets.only(bottom: 6),
      decoration: BoxDecoration(
        color: AppColors.bg2,
        border: Border.all(color: AppColors.border1, width: 0.5),
        borderRadius: BorderRadius.circular(6),
      ),
      child: Column(
        children: [
          InkWell(
            onTap: () => setState(() => _expanded = !_expanded),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 9),
              child: Row(
                children: [
                  Transform.rotate(
                    angle: _expanded ? math.pi / 2 : 0.0,
                    child: CartaIcon(icon: CartaIconData.chevRight, size: 12, color: AppColors.fg2),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(cfg.key,
                        style: TextStyle(
                            fontFamily: 'monospace',
                            fontSize: 12.5,
                            fontWeight: FontWeight.w600,
                            color: AppColors.fg0)),
                  ),
                  if (cfg.updatedAt != null)
                    Text(_shortDate(cfg.updatedAt!),
                        style: TextStyle(
                            fontFamily: 'monospace', fontSize: 10, color: AppColors.fg3)),
                  const SizedBox(width: 8),
                  MouseRegion(
                    cursor: SystemMouseCursors.click,
                    child: GestureDetector(
                      onTap: _delete,
                      child: Padding(
                        padding: const EdgeInsets.all(4),
                        child: CartaIcon(icon: CartaIconData.trash, size: 13, color: AppColors.fg2),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          if (_expanded)
            Padding(
              padding: const EdgeInsets.fromLTRB(12, 0, 12, 12),
              child: PayloadEditor(
                key: ValueKey('cfg-${cfg.key}'),
                initialCode: cfg.source,
                isExpr: false,
                onChanged: (source) => _replace(cfg.key, source),
              ),
            ),
        ],
      ),
    );
  }

  // Coalesce saves: drop keystrokes while a PUT is in flight and skip when
  // unchanged. PayloadEditor fires onChanged per controller change; this
  // prevents a PUT per keystroke.
  Future<void> _replace(String key, String source) async {
    if (source.trim().isEmpty || _inFlight || source == _lastSaved) return;
    _inFlight = true;
    try {
      await ref.read(configsApiProvider).replace(key, source);
      _lastSaved = source;
    } on ConfigsApiException catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(
          content: SelectableText('Save failed: $e',
              style: const TextStyle(fontFamily: 'monospace')),
          backgroundColor: AppColors.danger,
        ));
      }
    } finally {
      _inFlight = false;
    }
  }

  Future<void> _delete() async {
    try {
      await ref.read(configsApiProvider).delete(widget.config.key);
      ref.invalidate(configsProvider);
    } on ConfigsApiException catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(
          content: SelectableText('Delete failed: $e',
              style: const TextStyle(fontFamily: 'monospace')),
          backgroundColor: AppColors.danger,
        ));
      }
    }
  }

  String _shortDate(String iso) {
    final dt = DateTime.tryParse(iso);
    if (dt == null) return iso;
    final local = dt.toLocal();
    return '${local.year}-${local.month.toString().padLeft(2, '0')}-${local.day.toString().padLeft(2, '0')}';
  }
}
