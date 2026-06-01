class WorkflowEdge {
  final String id;
  final String sourceId;
  final String targetId;
  final String? label;

  const WorkflowEdge({
    required this.id,
    required this.sourceId,
    required this.targetId,
    this.label,
  });

  WorkflowEdge copyWith({
    String? id,
    String? sourceId,
    String? targetId,
    String? label,
  }) {
    return WorkflowEdge(
      id: id ?? this.id,
      sourceId: sourceId ?? this.sourceId,
      targetId: targetId ?? this.targetId,
      label: label ?? this.label,
    );
  }
}
