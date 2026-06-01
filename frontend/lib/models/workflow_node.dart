class WorkflowNode {
  final String id;
  final String kind;
  final String label;
  final String? sub;
  final String? model;
  final List<String> skills;
  final double x;
  final double y;

  const WorkflowNode({
    required this.id,
    required this.kind,
    required this.label,
    this.sub,
    this.model,
    this.skills = const [],
    required this.x,
    required this.y,
  });

  WorkflowNode copyWith({
    String? id,
    String? kind,
    String? label,
    String? sub,
    String? model,
    List<String>? skills,
    double? x,
    double? y,
  }) {
    return WorkflowNode(
      id: id ?? this.id,
      kind: kind ?? this.kind,
      label: label ?? this.label,
      sub: sub ?? this.sub,
      model: model ?? this.model,
      skills: skills ?? this.skills,
      x: x ?? this.x,
      y: y ?? this.y,
    );
  }
}
