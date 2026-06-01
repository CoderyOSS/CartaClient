import 'dart:math' show atan2, cos, sin;
import 'package:flutter/material.dart';
import '../../models/workflow_edge.dart';
import '../../models/workflow_node.dart';
import '../../theme/tokens.dart';

class ConnectionPainter extends CustomPainter {
  final List<WorkflowNode> nodes;
  final List<WorkflowEdge> edges;
  final String? draggingNodeId;
  final Offset dragOffset;

  static const double _nodeWidth = 192.0;
  static const double _nodeHeight = 80.0;
  static const double _controlMin = 40.0;
  static const double _controlMax = 150.0;

  ConnectionPainter({
    required this.nodes,
    required this.edges,
    this.draggingNodeId,
    this.dragOffset = Offset.zero,
  });

  Offset _nodePos(WorkflowNode node) {
    if (draggingNodeId == node.id) {
      return Offset(node.x + dragOffset.dx, node.y + dragOffset.dy);
    }
    return Offset(node.x, node.y);
  }

  @override
  void paint(Canvas canvas, Size size) {
    final nodeMap = {for (final n in nodes) n.id: n};

    final linePaint = Paint()
      ..color = AppColors.border3
      ..strokeWidth = 1.5
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;

    final arrowPaint = Paint()
      ..color = AppColors.border3
      ..style = PaintingStyle.fill;

    final dotPaint = Paint()
      ..color = AppColors.accent
      ..style = PaintingStyle.fill;

    final dotBorderPaint = Paint()
      ..color = AppColors.bg1
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.0;

    for (final edge in edges) {
      final source = nodeMap[edge.sourceId];
      final target = nodeMap[edge.targetId];
      if (source == null || target == null) continue;

      final sPos = _nodePos(source);
      final tPos = _nodePos(target);

      final p0 = Offset(sPos.dx + _nodeWidth, sPos.dy + _nodeHeight / 2);
      final p3 = Offset(tPos.dx, tPos.dy + _nodeHeight / 2);

      final dx = (p3.dx - p0.dx).abs();
      final controlLen = dx.clamp(_controlMin, _controlMax);

      final p1 = Offset(p0.dx + controlLen, p0.dy);
      final p2 = Offset(p3.dx - controlLen, p3.dy);

      // Draw bezier curve
      final path = Path()
        ..moveTo(p0.dx, p0.dy)
        ..cubicTo(p1.dx, p1.dy, p2.dx, p2.dy, p3.dx, p3.dy);
      canvas.drawPath(path, linePaint);

      // Arrowhead at target end
      final tangent = Offset(p3.dx - p2.dx, p3.dy - p2.dy);
      _drawArrowhead(canvas, p3, tangent, arrowPaint);

      // Midpoint dot at t=0.5
      final mid = _bezierPoint(p0, p1, p2, p3, 0.5);
      canvas.drawCircle(mid, 4.0, dotBorderPaint);
      canvas.drawCircle(mid, 3.0, dotPaint);

      // Midpoint pill label if present
      if (edge.label != null && edge.label!.isNotEmpty) {
        _drawMidpointLabel(canvas, mid, edge.label!);
      }
    }
  }

  void _drawArrowhead(Canvas canvas, Offset tip, Offset tangent, Paint paint) {
    final angle = atan2(tangent.dy, tangent.dx);
    const headLen = 7.0;
    const headAngle = 0.45;

    final p1 = Offset(
      tip.dx - headLen * cos(angle - headAngle),
      tip.dy - headLen * sin(angle - headAngle),
    );
    final p2 = Offset(
      tip.dx - headLen * cos(angle + headAngle),
      tip.dy - headLen * sin(angle + headAngle),
    );

    final path = Path()
      ..moveTo(tip.dx, tip.dy)
      ..lineTo(p1.dx, p1.dy)
      ..lineTo(p2.dx, p2.dy)
      ..close();

    canvas.drawPath(path, paint);
  }

  Offset _bezierPoint(Offset p0, Offset p1, Offset p2, Offset p3, double t) {
    final u = 1.0 - t;
    final tt = t * t;
    final uu = u * u;
    final uuu = uu * u;
    final ttt = tt * t;

    final x = uuu * p0.dx + 3 * uu * t * p1.dx + 3 * u * tt * p2.dx + ttt * p3.dx;
    final y = uuu * p0.dy + 3 * uu * t * p1.dy + 3 * u * tt * p2.dy + ttt * p3.dy;
    return Offset(x, y);
  }

  void _drawMidpointLabel(Canvas canvas, Offset mid, String label) {
    const style = TextStyle(
      fontFamily: 'monospace',
      fontSize: 9,
      color: AppColors.fg0,
      fontWeight: FontWeight.w500,
    );
    final span = TextSpan(text: label, style: style);
    final painter = TextPainter(
      text: span,
      textDirection: TextDirection.ltr,
    )..layout();

    final padX = 6.0;
    final padY = 2.0;
    final rect = RRect.fromRectAndRadius(
      Rect.fromCenter(
        center: mid,
        width: painter.width + padX * 2,
        height: painter.height + padY * 2,
      ),
      const Radius.circular(4),
    );

    canvas.drawRRect(
      rect,
      Paint()..color = AppColors.bg2,
    );
    canvas.drawRRect(
      rect,
      Paint()
        ..color = AppColors.border2
        ..style = PaintingStyle.stroke
        ..strokeWidth = 1.0,
    );

    painter.paint(
      canvas,
      Offset(mid.dx - painter.width / 2, mid.dy - painter.height / 2),
    );
  }

  @override
  bool shouldRepaint(covariant ConnectionPainter old) {
    return old.nodes != nodes ||
        old.edges != edges ||
        old.draggingNodeId != draggingNodeId ||
        old.dragOffset != dragOffset;
  }
}
