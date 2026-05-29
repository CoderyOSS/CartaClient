enum JobState { running, paused, passed, failed, cancelled, queued, retrying }

class WorkflowSummary {
  final String id;
  final String name;
  final int version;
  final int? draft;
  final String updated;
  final int runCount;
  final String last;
  final int active;

  const WorkflowSummary({
    required this.id,
    required this.name,
    required this.version,
    this.draft,
    required this.updated,
    this.runCount = 0,
    this.last = '',
    this.active = 0,
  });
}

class JobSummary {
  final String id;
  final String? workflow;
  final int? workflowVersion;
  final JobState state;
  final String? input;
  final int elapsedSec;
  final int tokens;
  final double costUsd;
  final String started;

  const JobSummary({
    required this.id,
    this.workflow,
    this.workflowVersion,
    required this.state,
    this.input,
    this.elapsedSec = 0,
    this.tokens = 0,
    this.costUsd = 0,
    this.started = '',
  });
}

final mockWorkflow = WorkflowSummary(
  id: 'wf_pr_reviewer',
  name: 'pr-reviewer',
  version: 14,
  draft: 15,
  updated: '2 min ago by jen.b',
  runCount: 1284,
  last: '2m',
  active: 2,
);

final mockWorkflows = <WorkflowSummary>[
  WorkflowSummary(
    id: 'wf_pr_reviewer',
    name: 'pr-reviewer',
    version: 14,
    draft: 15,
    updated: '2 min ago by jen.b',
    runCount: 1284,
    last: '2m',
    active: 2,
  ),
  WorkflowSummary(
    id: 'wf_eval_harness',
    name: 'eval-harness',
    version: 7,
    updated: '1h ago by ci-bot',
    runCount: 412,
    last: '11m',
    active: 0,
  ),
  WorkflowSummary(
    id: 'wf_release_notes',
    name: 'release-notes',
    version: 3,
    updated: '3h ago by alex.k',
    runCount: 38,
    last: '1h',
    active: 0,
  ),
  WorkflowSummary(
    id: 'wf_flake_tracker',
    name: 'flake-tracker',
    version: 2,
    updated: '1d ago by jen.b',
    runCount: 906,
    last: '8m',
    active: 1,
  ),
  WorkflowSummary(
    id: 'wf_changelog_summ',
    name: 'changelog-summary',
    version: 5,
    updated: '4h ago by ops',
    runCount: 142,
    last: '3h',
    active: 0,
  ),
  WorkflowSummary(
    id: 'wf_doc_indexer',
    name: 'doc-indexer',
    version: 1,
    updated: '1d ago by ops',
    runCount: 77,
    last: '1d',
    active: 0,
  ),
];

final mockJob = JobSummary(
  id: 'r_8f2a91c',
  workflow: 'pr-reviewer',
  workflowVersion: 14,
  state: JobState.running,
  input: 'PR #1428',
  elapsedSec: 247,
  tokens: 184233,
  costUsd: 0.42,
  started: '14:18',
);

final mockJobs = <JobSummary>[
  JobSummary(
    id: 'r_8f2a91c',
    workflow: 'pr-reviewer',
    state: JobState.running,
    input: 'PR #1428',
    elapsedSec: 247,
    tokens: 184233,
    costUsd: 0.42,
    started: '14:18',
  ),
  JobSummary(
    id: 'r_8f2a4b1',
    workflow: 'eval-harness',
    state: JobState.running,
    input: 'suite/regress',
    elapsedSec: 351,
    tokens: 310000,
    costUsd: 1.12,
    started: '14:16',
  ),
  JobSummary(
    id: 'r_8f2a103',
    workflow: 'flake-tracker',
    state: JobState.paused,
    input: 'ci-main',
    elapsedSec: 482,
    tokens: 8200,
    costUsd: 0.08,
    started: '14:14',
  ),
  JobSummary(
    id: 'r_8f29d52',
    workflow: 'pr-reviewer',
    state: JobState.queued,
    input: 'PR #1429',
    started: '14:13',
  ),
  JobSummary(
    id: 'r_8f29442',
    workflow: 'pr-reviewer',
    state: JobState.passed,
    input: 'PR #1427',
    elapsedSec: 224,
    tokens: 156000,
    costUsd: 0.31,
    started: '14:12',
  ),
  JobSummary(
    id: 'r_8f28a01',
    workflow: 'eval-harness',
    state: JobState.failed,
    input: 'suite/all',
    elapsedSec: 492,
    tokens: 310000,
    costUsd: 1.84,
    started: '14:07',
  ),
  JobSummary(
    id: 'r_8f27b3d',
    workflow: 'flake-tracker',
    state: JobState.passed,
    input: 'ci-main',
    elapsedSec: 48,
    tokens: 4100,
    costUsd: 0.04,
    started: '14:03',
  ),
  JobSummary(
    id: 'r_8f26108',
    workflow: 'pr-reviewer',
    state: JobState.passed,
    input: 'PR #1426',
    elapsedSec: 138,
    tokens: 112000,
    costUsd: 0.22,
    started: '13:58',
  ),
  JobSummary(
    id: 'r_8f25fa2',
    workflow: 'pr-reviewer',
    state: JobState.retrying,
    input: 'PR #1425',
    elapsedSec: 310,
    tokens: 98000,
    costUsd: 0.38,
    started: '13:54',
  ),
  JobSummary(
    id: 'r_8f24c0e',
    workflow: 'release-notes',
    state: JobState.passed,
    input: 'v0.42.1',
    elapsedSec: 72,
    tokens: 12000,
    costUsd: 0.09,
    started: '13:01',
  ),
  JobSummary(
    id: 'r_8f23911',
    workflow: 'pr-reviewer',
    state: JobState.cancelled,
    input: 'PR #1424',
    elapsedSec: 22,
    tokens: 8000,
    costUsd: 0.02,
    started: '12:55',
  ),
  JobSummary(
    id: 'r_8f22a05',
    workflow: 'doc-indexer',
    state: JobState.passed,
    input: 'snapshot',
    elapsedSec: 724,
    tokens: 45000,
    costUsd: 0.91,
    started: '12:11',
  ),
  JobSummary(
    id: 'r_8f21338',
    workflow: 'changelog-summary',
    state: JobState.passed,
    input: 'v0.42.0',
    elapsedSec: 38,
    tokens: 5500,
    costUsd: 0.05,
    started: '11:42',
  ),
];

const historyCount = 13;
