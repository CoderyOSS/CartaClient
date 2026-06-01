import 'dart:math' show Random;
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../models/workflow_edge.dart';
import '../../models/workflow_node.dart';
import '../../providers/canvas_controller.dart';
import '../../providers/mode_provider.dart';
import '../../providers/operator_picker_provider.dart';
import '../../theme/tokens.dart';
import 'connection_painter.dart';
import 'dot_grid_painter.dart';
import 'operator_picker.dart';
import 'worker_node.dart';

class GraphCanvas extends ConsumerWidget {
  const GraphCanvas({super.key});

  static const double _snapGrid = 24.0;
  static const Duration _snapDuration = Duration(milliseconds: 200);

  double _snap(double value) => (value / _snapGrid).round() * _snapGrid;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final viewport = ref.watch(canvasControllerProvider);
    final controller = ref.read(canvasControllerProvider.notifier);
    final workflow = ref.watch(workflowProvider);
    final selectedNodeId = ref.watch(selectedNodeProvider);
    final hoveredNodeId = ref.watch(hoveredNodeProvider);
    final draggingNodeId = ref.watch(draggingNodeIdProvider);
    final dragOffset = ref.watch(dragOffsetProvider);
    final pickerAnchor = ref.watch(operatorPickerProvider);

    void showPicker(Offset worldPos, String sourceId) {
      final screenX = worldPos.dx * viewport.zoom + viewport.pan.dx;
      final screenY = worldPos.dy * viewport.zoom + viewport.pan.dy;
      ref.read(operatorPickerProvider.notifier).state = PickerAnchor(
        screenPos: Offset(screenX, screenY),
        sourceNodeId: sourceId,
      );
    }

    void addNode(OperatorType type) {
      final sourceId = pickerAnchor?.sourceNodeId;
      if (sourceId == null) return;

      final source = workflow.nodes.firstWhere(
        (n) => n.id == sourceId,
        orElse: () => workflow.nodes.first,
      );

      final id = 'node_${DateTime.now().millisecondsSinceEpoch}_${Random().nextInt(9999)}';
      final newNode = WorkflowNode(
        id: id,
        kind: type == OperatorType.switch_ ? 'switch' : type.label,
        label: type.label,
        x: source.x + 220,
        y: source.y,
      );

      final edge = WorkflowEdge(
        id: 'edge_${DateTime.now().millisecondsSinceEpoch}_${Random().nextInt(9999)}',
        sourceId: sourceId,
        targetId: id,
      );

      ref.read(workflowProvider.notifier).state = workflow.copyWith(
        nodes: [...workflow.nodes, newNode],
        edges: [...workflow.edges, edge],
      );
      ref.read(selectedNodeProvider.notifier).state = id;
      ref.read(operatorPickerProvider.notifier).state = null;
    }

    void deleteNode(String nodeId) {
      final newNodes = workflow.nodes.where((n) => n.id != nodeId).toList();
      final newEdges = workflow.edges
          .where((e) => e.sourceId != nodeId && e.targetId != nodeId)
          .toList();
      ref.read(workflowProvider.notifier).state = workflow.copyWith(
        nodes: newNodes,
        edges: newEdges,
      );
      if (selectedNodeId == nodeId) {
        ref.read(selectedNodeProvider.notifier).state = null;
      }
      if (hoveredNodeId == nodeId) {
        ref.read(hoveredNodeProvider.notifier).state = null;
      }
    }

    return Focus(
      autofocus: true,
      onKeyEvent: (node, event) {
        if (event is KeyDownEvent) {
          if (event.logicalKey == LogicalKeyboardKey.delete ||
              event.logicalKey == LogicalKeyboardKey.backspace) {
            if (selectedNodeId != null) {
              deleteNode(selectedNodeId);
              return KeyEventResult.handled;
            }
          }
        }
        return KeyEventResult.ignored;
      },
      child: GestureDetector(
        behavior: HitTestBehavior.translucent,
        onPanUpdate: (details) {
          // Only pan canvas if not dragging a node
          if (draggingNodeId == null) {
            controller.pan(details.delta);
          }
        },
        onTap: () {
          // Deselect when tapping empty canvas
          ref.read(selectedNodeProvider.notifier).state = null;
          ref.read(operatorPickerProvider.notifier).state = null;
        },
        child: Container(
          decoration: const BoxDecoration(
            gradient: AppColors.hearthGradient,
          ),
          child: ClipRect(
            child: Stack(
              children: [
                // Dot grid
                Positioned.fill(
                  child: CustomPaint(
                    painter: DotGridPainter(
                      zoom: viewport.zoom,
                      pan: viewport.pan,
                    ),
                  ),
                ),
                // World transform
                Transform.translate(
                  offset: viewport.pan,
                  child: Transform.scale(
                    scale: viewport.zoom,
                    alignment: Alignment.topLeft,
                    child: Stack(
                      clipBehavior: Clip.none,
                      children: [
                        // Connection edges (behind nodes)
                        Positioned.fill(
                          child: CustomPaint(
                            painter: ConnectionPainter(
                              nodes: workflow.nodes,
                              edges: workflow.edges,
                              draggingNodeId: draggingNodeId,
                              dragOffset: dragOffset,
                            ),
                            size: Size.infinite,
                          ),
                        ),
                        // Nodes
                        ...workflow.nodes.map((node) {
                          final isSelected = selectedNodeId == node.id;
                          final isDragging = draggingNodeId == node.id;
                          final displayX = isDragging ? node.x + dragOffset.dx : node.x;
                          final displayY = isDragging ? node.y + dragOffset.dy : node.y;

                          final nodeWidget = WorkerNode(
                            node: node,
                            selected: isSelected,
                            onEnter: () {
                              ref.read(hoveredNodeProvider.notifier).state = node.id;
                            },
                            onExit: () {
                              ref.read(hoveredNodeProvider.notifier).state =
                                  (hoveredNodeId == node.id) ? null : hoveredNodeId;
                            },
                            onDelete: () => deleteNode(node.id),
                          );

                          return AnimatedPositioned(
                            key: ValueKey(node.id),
                            left: displayX,
                            top: displayY,
                            duration: isDragging ? Duration.zero : _snapDuration,
                            curve: Curves.easeOutCubic,
                            child: Stack(
                              clipBehavior: Clip.none,
                              children: [
                                GestureDetector(
                                  behavior: HitTestBehavior.translucent,
                                  onTap: () {
                                    ref.read(selectedNodeProvider.notifier).state =
                                        isSelected ? null : node.id;
                                    // close picker when selecting another node
                                    if (!isSelected) {
                                      ref.read(operatorPickerProvider.notifier).state = null;
                                    }
                                  },
                                  onPanStart: (_) {
                                    ref.read(draggingNodeIdProvider.notifier).state = node.id;
                                    ref.read(dragOffsetProvider.notifier).state = Offset.zero;
                                  },
                                  onPanUpdate: (details) {
                                    if (draggingNodeId == node.id) {
                                      final worldDelta = Offset(
                                        details.delta.dx / viewport.zoom,
                                        details.delta.dy / viewport.zoom,
                                      );
                                      ref.read(dragOffsetProvider.notifier).state += worldDelta;
                                    }
                                  },
                                  onPanEnd: (_) {
                                    if (draggingNodeId == node.id) {
                                      final offset = ref.read(dragOffsetProvider);
                                      final snappedX = _snap(node.x + offset.dx);
                                      final snappedY = _snap(node.y + offset.dy);
                                      final newNodes = workflow.nodes.map((n) {
                                        if (n.id == node.id) {
                                          return n.copyWith(x: snappedX, y: snappedY);
                                        }
                                        return n;
                                      }).toList();
                                      ref.read(workflowProvider.notifier).state =
                                          workflow.copyWith(nodes: newNodes);
                                      ref.read(draggingNodeIdProvider.notifier).state = null;
                                      ref.read(dragOffsetProvider.notifier).state = Offset.zero;
                                    }
                                  },
                                  onPanCancel: () {
                                    ref.read(draggingNodeIdProvider.notifier).state = null;
                                    ref.read(dragOffsetProvider.notifier).state = Offset.zero;
                                  },
                                  child: nodeWidget,
                                ),
                                if (isSelected)
                                  Positioned(
                                    left: 192.0 - 22.0 / viewport.zoom,
                                    top: 40.0 - 22.0 / viewport.zoom,
                                    child: _OutputHandle(
                                      inverseZoom: 1.0 / viewport.zoom,
                                      onTap: () => showPicker(
                                        Offset(displayX + 192.0, displayY + 40.0),
                                        node.id,
                                      ),
                                    ),
                                  ),
                              ],
                            ),
                          );
                        }),

                      ],
                    ),
                  ),
                ),
                // Screen-space operator picker
                if (pickerAnchor != null)
                  OperatorPicker(
                    anchor: pickerAnchor.screenPos,
                    onSelect: addNode,
                    onClose: () {
                      ref.read(operatorPickerProvider.notifier).state = null;
                    },
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _OutputHandle extends StatelessWidget {
  final double inverseZoom;
  final VoidCallback onTap;

  const _OutputHandle({
    required this.inverseZoom,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    // Direct world-space sizing so hit area exactly matches visual area.
    // 44 screen-px hit area = 44 * inverseZoom world units.
    final size = 44.0 * inverseZoom;
    final dotSize = 12.0 * inverseZoom;
    final borderWidth = 2.0 * inverseZoom;
    final ringSpread = 1.0 * inverseZoom;
    final glowBlur = 8.0 * inverseZoom;

    return GestureDetector(
      behavior: HitTestBehavior.translucent,
      onTap: onTap,
      child: Container(
        width: size,
        height: size,
        color: Colors.transparent,
        alignment: Alignment.center,
        child: Container(
          width: dotSize,
          height: dotSize,
          decoration: BoxDecoration(
            color: AppColors.accent,
            shape: BoxShape.circle,
            border: Border.all(color: AppColors.bg1, width: borderWidth),
            boxShadow: [
              // crisp accent ring
              BoxShadow(
                color: AppColors.accent,
                blurRadius: 0,
                spreadRadius: ringSpread,
              ),
              // soft glow
              BoxShadow(
                color: AppColors.accent.withValues(alpha: 0.5),
                blurRadius: glowBlur,
                spreadRadius: 0,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
