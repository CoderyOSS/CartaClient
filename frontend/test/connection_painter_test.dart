import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:frontend/models/workflow_edge.dart';
import 'package:frontend/models/workflow_node.dart';
import 'package:frontend/widgets/canvas/connection_painter.dart';

void main() {
  test('shouldRepaint when renderedPositions changes', () {
    final p1 = ConnectionPainter(
      nodes: const [],
      connections: const [],
      renderedPositions: const {'A': Offset(0, 0)},
    );
    final p2 = ConnectionPainter(
      nodes: const [],
      connections: const [],
      renderedPositions: const {'A': Offset(10, 10)},
    );
    expect(p1.shouldRepaint(p2), isTrue);
  });

  test('rendered positions drive node geometry', () {
    final nodes = [
      WorkflowNode(id: 'A', kind: 'worker', label: 'A', x: 0, y: 0),
      WorkflowNode(id: 'B', kind: 'worker', label: 'B', x: 200, y: 100),
    ];
    final connections = [
      WorkflowConnection(id: 'e1', from: 'A', to: 'B'),
    ];

    // Mid-glide: canvas folds drag/snap offsets into renderedPositions.
    final painter = ConnectionPainter(
      nodes: nodes,
      connections: connections,
      renderedPositions: const {
        'A': Offset(50, 30),
        'B': Offset(250, 130),
      },
    );
    expect(painter.renderedPositions['A'], const Offset(50, 30));
    expect(painter.renderedPositions['B'], const Offset(250, 130));

    // Repaint triggers when rendered positions change.
    final painter2 = ConnectionPainter(
      nodes: nodes,
      connections: connections,
      renderedPositions: const {
        'A': Offset(60, 40),
        'B': Offset(250, 130),
      },
    );
    expect(painter.shouldRepaint(painter2), isTrue);
  });
}
