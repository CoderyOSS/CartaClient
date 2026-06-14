import '../models/workflow_edge.dart';
import '../models/workflow_node.dart';
import '../providers/mock_data.dart';

String workflowToYaml(WorkflowSummary workflow) {
  final buf = StringBuffer();
  buf.writeln('name: ${workflow.name}');
  buf.writeln('version: ${workflow.version}');
  if (workflow.draft != null && workflow.draft != workflow.version) {
    buf.writeln('draft: ${workflow.draft}');
  }
  buf.writeln('');

  if (workflow.nodes.isNotEmpty) {
    buf.writeln('stages:');
    for (final node in workflow.nodes) {
      buf.writeln('  - name: ${node.id}');
      buf.writeln('    kind: ${node.kind}');
      buf.writeln('    label: ${node.label}');
      if (node.sub != null) buf.writeln('    sub: "${node.sub}"');
      if (node.model != null) buf.writeln('    model: ${node.model}');
      if (node.skills.isNotEmpty) {
        buf.writeln('    skills: [${node.skills.map((s) => '"$s"').join(', ')}]');
      }
      buf.writeln('    pos: {x: ${node.x.toStringAsFixed(0)}, y: ${node.y.toStringAsFixed(0)}}');
    }
    buf.writeln('');
  }

  if (workflow.edges.isNotEmpty) {
    buf.writeln('edges:');
    for (final edge in workflow.edges) {
      buf.writeln('  - from: ${edge.sourceId}');
      buf.writeln('    to: ${edge.targetId}');
    }
  }

  return buf.toString();
}
