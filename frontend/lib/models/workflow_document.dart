import '../providers/canvas_controller.dart';
import '../providers/mock_data.dart';

class WorkflowDocument {
  final WorkflowSummary workflow;
  final CanvasViewport viewport;

  const WorkflowDocument({
    required this.workflow,
    this.viewport = const CanvasViewport(),
  });

  WorkflowDocument copyWith({
    WorkflowSummary? workflow,
    CanvasViewport? viewport,
  }) {
    return WorkflowDocument(
      workflow: workflow ?? this.workflow,
      viewport: viewport ?? this.viewport,
    );
  }
}
