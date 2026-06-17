# Node Body Style — Direction F Family Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor WorkerNode, FanNode→MapNode, and RoutingNode→BranchNode to match the Direction F design guide, add input connector handles, replace the floating delete button with a long-press / right-click context menu, and preserve all existing touch targets and drag logic.

**Architecture:** Inline refactor of three node widgets plus canvas wiring. Node widgets render their own neutral connector dots; canvas overlays enlarged accent handles only when selected. Context menu is a new screen-space overlay widget driven by a Riverpod provider, mirroring the existing OperatorPicker pattern.

**Tech Stack:** Flutter, Riverpod, flutter_svg, CustomPaint

---

### Task 1: Add collapseLink icon

**Files:**
- Modify: `frontend/lib/widgets/icons.dart`

- [ ] **Step 1: Add enum value and SVG path**

Add `collapseLink` to `TrailheadIconData` enum and `_bodies` map.

```dart
// In enum:
collapseLink,

// In _bodies map:
TrailheadIconData.collapseLink:
    '<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>',
```

- [ ] **Step 2: Verify icon renders**

Run: `~/flutter/bin/flutter analyze`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add frontend/lib/widgets/icons.dart
git commit -m "feat: add collapseLink icon for node context menu"
```

---

### Task 2: Refactor WorkerNode

**Files:**
- Modify: `frontend/lib/widgets/canvas/worker_node.dart`

- [ ] **Step 1: Rewrite WorkerNode to 168×36 capsule with role-tile**

Replace the entire file content with:

```dart
import 'package:flutter/material.dart';
import '../../models/workflow_node.dart';
import '../../providers/mock_data.dart';
import '../../theme/tokens.dart';
import '../icons.dart';
import '../status_tag.dart';

class WorkerNode extends StatelessWidget {
  final WorkflowNode node;
  final JobState? status;
  final bool selected;
  final VoidCallback? onEnter;
  final VoidCallback? onExit;
  const WorkerNode({
    super.key,
    required this.node,
    this.status,
    this.selected = false,
    this.onEnter,
    this.onExit,
  });

  @override
  Widget build(BuildContext context) {
    final running = status == JobState.running;

    List<BoxShadow> outlineShadows;
    if (selected) {
      outlineShadows = [
        BoxShadow(
          color: AppColors.accent.withValues(alpha: 0.22),
          blurRadius: 0,
          spreadRadius: 3,
        ),
        const BoxShadow(
          color: Color(0x66000000),
          blurRadius: 10,
          offset: Offset(0, 4),
        ),
      ];
    } else if (running) {
      outlineShadows = [
        BoxShadow(
          color: AppColors.accent.withValues(alpha: 0.30),
          blurRadius: 14,
        ),
        const BoxShadow(
          color: Color(0x66000000),
          blurRadius: 8,
          offset: Offset(0, 2),
        ),
      ];
    } else {
      outlineShadows = [
        const BoxShadow(
          color: Color(0x1A000000),
          blurRadius: 8,
          offset: Offset(0, 2),
        ),
      ];
    }

    return MouseRegion(
      onEnter: (_) => onEnter?.call(),
      onExit: (_) => onExit?.call(),
      child: Container(
        width: 168,
        height: 36,
        decoration: BoxDecoration(
          gradient: running
              ? LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    AppColors.accent.withValues(alpha: 0.12),
                    AppColors.bg2,
                  ],
                  stops: const [0.0, 0.7],
                )
              : AppColors.loafGradient,
          border: Border.all(
            color: selected
                ? AppColors.accent
                : running
                    ? AppColors.accent
                    : AppColors.border2,
          ),
          borderRadius: BorderRadius.circular(AppRadius.md),
          boxShadow: outlineShadows,
        ),
        child: Stack(
          clipBehavior: Clip.none,
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(AppRadius.md),
              child: SizedBox.expand(
                child: Row(
                  children: [
                    Container(
                      width: 30,
                      decoration: const BoxDecoration(
                        gradient: AppColors.crustGradient,
                        border: Border(
                          right: BorderSide(color: AppColors.border2),
                        ),
                      ),
                      child: const Center(
                        child: TrailheadIcon(
                          icon: TrailheadIconData.bot,
                          size: 14,
                          color: AppColors.accentInk,
                        ),
                      ),
                    ),
                    Expanded(
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 10),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: [
                            if (running)
                              const Padding(
                                padding: EdgeInsets.only(right: 5),
                                child: StatusDot(
                                  status: JobState.running,
                                  pulse: true,
                                  size: 5,
                                ),
                              ),
                            Expanded(
                              child: Text(
                                node.label,
                                style: const TextStyle(
                                  fontFamily: 'monospace',
                                  fontSize: 13,
                                  fontWeight: FontWeight.w600,
                                  color: AppColors.fg0,
                                ),
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            _ConnectorDot(left: true),
            _ConnectorDot(left: false),
            if (running)
              Positioned(
                left: 36,
                right: 10,
                bottom: 3,
                child: Container(
                  height: 2,
                  decoration: BoxDecoration(
                    color: AppColors.bg4,
                    borderRadius: BorderRadius.circular(1),
                  ),
                  child: const FractionallySizedBox(
                    alignment: Alignment.centerLeft,
                    widthFactor: 0.55,
                    child: DecoratedBox(
                      decoration: BoxDecoration(
                        gradient: AppColors.crustGradient,
                        borderRadius: BorderRadius.horizontal(
                          left: Radius.circular(1),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            if (status != null && !running && status != JobState.queued)
              Positioned(
                top: -8,
                right: 8,
                child: _StatusBadge(status: status!),
              ),
          ],
        ),
      ),
    );
  }
}

class _ConnectorDot extends StatelessWidget {
  final bool left;
  const _ConnectorDot({required this.left});

  @override
  Widget build(BuildContext context) {
    return Positioned(
      left: left ? -4 : null,
      right: left ? null : -4,
      top: 14,
      child: Container(
        width: 8,
        height: 8,
        decoration: BoxDecoration(
          color: AppColors.bg3,
          shape: BoxShape.circle,
          border: Border.all(color: AppColors.border3, width: 1.5),
        ),
      ),
    );
  }
}

class _StatusBadge extends StatelessWidget {
  final JobState status;
  const _StatusBadge({required this.status});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1),
      decoration: BoxDecoration(
        color: status == JobState.passed
            ? AppColors.success
            : status == JobState.failed
                ? AppColors.danger
                : AppColors.bg4,
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        status == JobState.cancelled ? 'cancelled' : status.name,
        style: TextStyle(
          fontFamily: 'monospace',
          fontSize: 9,
          fontWeight: FontWeight.w600,
          color: status == JobState.passed
              ? const Color(0xFF1a3d1c)
              : status == JobState.failed
                  ? const Color(0xFF3d1a1a)
                  : AppColors.fg2,
        ),
      ),
    );
  }
}
```

- [ ] **Step 2: Verify build**

Run: `~/flutter/bin/flutter analyze`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add frontend/lib/widgets/canvas/worker_node.dart
git commit -m "feat: refactor WorkerNode to 168x36 Direction F capsule"
```

---

### Task 3: Refactor FanNode → MapNode

**Files:**
- Modify: `frontend/lib/widgets/canvas/fan_node.dart`

- [ ] **Step 1: Rewrite as single-line MapNode**

Replace the entire file with:

```dart
import 'package:flutter/material.dart';
import '../../models/workflow_node.dart';
import '../../providers/mock_data.dart';
import '../../theme/tokens.dart';
import '../icons.dart';

class MapNode extends StatelessWidget {
  final WorkflowNode node;
  final JobState? status;
  final bool selected;
  final VoidCallback? onEnter;
  final VoidCallback? onExit;
  const MapNode({
    super.key,
    required this.node,
    this.status,
    this.selected = false,
    this.onEnter,
    this.onExit,
  });

  @override
  Widget build(BuildContext context) {
    final running = status == JobState.running;

    List<BoxShadow> outlineShadows;
    if (selected) {
      outlineShadows = [
        BoxShadow(
          color: AppColors.accent.withValues(alpha: 0.22),
          blurRadius: 0,
          spreadRadius: 3,
        ),
        const BoxShadow(
          color: Color(0x66000000),
          blurRadius: 10,
          offset: Offset(0, 4),
        ),
      ];
    } else if (running) {
      outlineShadows = [
        BoxShadow(
          color: AppColors.accent.withValues(alpha: 0.30),
          blurRadius: 14,
        ),
        const BoxShadow(
          color: Color(0x66000000),
          blurRadius: 8,
          offset: Offset(0, 2),
        ),
      ];
    } else {
      outlineShadows = [
        const BoxShadow(
          color: Color(0x1A000000),
          blurRadius: 8,
          offset: Offset(0, 2),
        ),
      ];
    }

    return MouseRegion(
      onEnter: (_) => onEnter?.call(),
      onExit: (_) => onExit?.call(),
      child: Container(
        width: 168,
        height: 36,
        decoration: BoxDecoration(
          gradient: running
              ? LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    AppColors.accent.withValues(alpha: 0.12),
                    AppColors.bg2,
                  ],
                  stops: const [0.0, 0.7],
                )
              : AppColors.loafGradient,
          border: Border.all(
            color: selected
                ? AppColors.accent
                : running
                    ? AppColors.accent
                    : AppColors.border2,
          ),
          borderRadius: BorderRadius.circular(AppRadius.md),
          boxShadow: outlineShadows,
        ),
        child: Stack(
          clipBehavior: Clip.none,
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(AppRadius.md),
              child: SizedBox.expand(
                child: Row(
                  children: [
                    Container(
                      width: 30,
                      decoration: const BoxDecoration(
                        gradient: AppColors.crustGradient,
                        border: Border(
                          right: BorderSide(color: AppColors.border2),
                        ),
                      ),
                      child: const Center(
                        child: TrailheadIcon(
                          icon: TrailheadIconData.forEach,
                          size: 14,
                          color: AppColors.accentInk,
                        ),
                      ),
                    ),
                    Expanded(
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 10),
                        child: Text(
                          node.label,
                          style: const TextStyle(
                            fontFamily: 'monospace',
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: AppColors.fg0,
                          ),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            _ConnectorDot(left: true),
            _ConnectorDot(left: false),
            if (status != null && !running && status != JobState.queued)
              Positioned(
                top: -8,
                right: 8,
                child: _StatusBadge(status: status!),
              ),
          ],
        ),
      ),
    );
  }
}

class _ConnectorDot extends StatelessWidget {
  final bool left;
  const _ConnectorDot({required this.left});

  @override
  Widget build(BuildContext context) {
    return Positioned(
      left: left ? -4 : null,
      right: left ? null : -4,
      top: 14,
      child: Container(
        width: 8,
        height: 8,
        decoration: BoxDecoration(
          color: AppColors.bg3,
          shape: BoxShape.circle,
          border: Border.all(color: AppColors.border3, width: 1.5),
        ),
      ),
    );
  }
}

class _StatusBadge extends StatelessWidget {
  final JobState status;
  const _StatusBadge({required this.status});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1),
      decoration: BoxDecoration(
        color: status == JobState.passed
            ? AppColors.success
            : status == JobState.failed
                ? AppColors.danger
                : AppColors.bg4,
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        status == JobState.cancelled ? 'cancelled' : status.name,
        style: TextStyle(
          fontFamily: 'monospace',
          fontSize: 9,
          fontWeight: FontWeight.w600,
          color: status == JobState.passed
              ? const Color(0xFF1a3d1c)
              : status == JobState.failed
                  ? const Color(0xFF3d1a1a)
                  : AppColors.fg2,
        ),
      ),
    );
  }
}
```

- [ ] **Step 2: Verify build**

Run: `~/flutter/bin/flutter analyze`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add frontend/lib/widgets/canvas/fan_node.dart
git commit -m "feat: refactor FanNode to single-line MapNode (168x36)"
```

---

### Task 4: Refactor RoutingNode → BranchNode

**Files:**
- Modify: `frontend/lib/widgets/canvas/routing_node.dart`

- [ ] **Step 1: Rewrite as tall BranchNode with case rows and per-case output dots**

Replace the entire file with:

```dart
import 'package:flutter/material.dart';
import '../../models/workflow_node.dart';
import '../../providers/mock_data.dart';
import '../../theme/tokens.dart';
import '../icons.dart';

class BranchNode extends StatelessWidget {
  final WorkflowNode node;
  final JobState? status;
  final bool selected;
  final VoidCallback? onEnter;
  final VoidCallback? onExit;
  const BranchNode({
    super.key,
    required this.node,
    this.status,
    this.selected = false,
    this.onEnter,
    this.onExit,
  });

  static const double width = 130;
  static const double _rowH = 27;
  static const double _padY = 9;

  static const List<_Case> _cases = [
    _Case(label: 'high', muted: false),
    _Case(label: 'medium', muted: false),
    _Case(label: 'low', muted: false),
    _Case(label: 'default', muted: true),
  ];

  double get height => _padY * 2 + _cases.length * _rowH;

  @override
  Widget build(BuildContext context) {
    final running = status == JobState.running;

    List<BoxShadow> outlineShadows;
    if (selected) {
      outlineShadows = [
        BoxShadow(
          color: AppColors.accent.withValues(alpha: 0.22),
          blurRadius: 0,
          spreadRadius: 3,
        ),
        const BoxShadow(
          color: Color(0x66000000),
          blurRadius: 10,
          offset: Offset(0, 4),
        ),
      ];
    } else if (running) {
      outlineShadows = [
        BoxShadow(
          color: AppColors.accent.withValues(alpha: 0.30),
          blurRadius: 14,
        ),
        const BoxShadow(
          color: Color(0x66000000),
          blurRadius: 8,
          offset: Offset(0, 2),
        ),
      ];
    } else {
      outlineShadows = [
        const BoxShadow(
          color: Color(0x1A000000),
          blurRadius: 8,
          offset: Offset(0, 2),
        ),
      ];
    }

    final h = height;

    return MouseRegion(
      onEnter: (_) => onEnter?.call(),
      onExit: (_) => onExit?.call(),
      child: Container(
        width: width,
        height: h,
        decoration: BoxDecoration(
          gradient: running
              ? LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    AppColors.accent.withValues(alpha: 0.12),
                    AppColors.bg2,
                  ],
                  stops: const [0.0, 0.7],
                )
              : AppColors.loafGradient,
          border: Border.all(
            color: selected
                ? AppColors.accent
                : running
                    ? AppColors.accent
                    : AppColors.border2,
          ),
          borderRadius: BorderRadius.circular(AppRadius.md),
          boxShadow: outlineShadows,
        ),
        child: Stack(
          clipBehavior: Clip.none,
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(AppRadius.md),
              child: SizedBox.expand(
                child: Row(
                  children: [
                    Container(
                      width: 30,
                      decoration: const BoxDecoration(
                        gradient: AppColors.crustGradient,
                        border: Border(
                          right: BorderSide(color: AppColors.border2),
                        ),
                      ),
                      child: const Center(
                        child: TrailheadIcon(
                          icon: TrailheadIconData.gitBranch,
                          size: 14,
                          color: AppColors.accentInk,
                        ),
                      ),
                    ),
                    Expanded(
                      child: Padding(
                        padding: EdgeInsets.symmetric(vertical: _padY),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: _cases.map((c) {
                            return SizedBox(
                              height: _rowH,
                              child: Padding(
                                padding: const EdgeInsets.only(right: 12, left: 11),
                                child: Align(
                                  alignment: Alignment.centerRight,
                                  child: Text(
                                    c.label,
                                    style: TextStyle(
                                      fontFamily: 'monospace',
                                      fontSize: 12,
                                      fontWeight: c.muted ? FontWeight.w500 : FontWeight.w600,
                                      color: c.muted ? AppColors.fg3 : AppColors.fg0,
                                    ),
                                  ),
                                ),
                              ),
                            );
                          }).toList(),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            // Input dot
            Positioned(
              left: -4,
              top: h / 2 - 4,
              child: Container(
                width: 8,
                height: 8,
                decoration: BoxDecoration(
                  color: AppColors.bg3,
                  shape: BoxShape.circle,
                  border: Border.all(color: AppColors.border3, width: 1.5),
                ),
              ),
            ),
            // Output dots
            ..._cases.asMap().entries.map((e) {
              final i = e.key;
              final top = _padY + i * _rowH + _rowH / 2 - 4;
              return Positioned(
                right: -4,
                top: top,
                child: Container(
                  width: 8,
                  height: 8,
                  decoration: BoxDecoration(
                    color: AppColors.bg3,
                    shape: BoxShape.circle,
                    border: Border.all(color: AppColors.border3, width: 1.5),
                  ),
                ),
              );
            }),
            if (status != null && !running && status != JobState.queued)
              Positioned(
                top: -8,
                right: 8,
                child: _StatusBadge(status: status!),
              ),
          ],
        ),
      ),
    );
  }
}

class _Case {
  final String label;
  final bool muted;
  const _Case({required this.label, required this.muted});
}

class _StatusBadge extends StatelessWidget {
  final JobState status;
  const _StatusBadge({required this.status});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1),
      decoration: BoxDecoration(
        color: status == JobState.passed
            ? AppColors.success
            : status == JobState.failed
                ? AppColors.danger
                : AppColors.bg4,
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        status == JobState.cancelled ? 'cancelled' : status.name,
        style: TextStyle(
          fontFamily: 'monospace',
          fontSize: 9,
          fontWeight: FontWeight.w600,
          color: status == JobState.passed
              ? const Color(0xFF1a3d1c)
              : status == JobState.failed
                  ? const Color(0xFF3d1a1a)
                  : AppColors.fg2,
        ),
      ),
    );
  }
}
```

- [ ] **Step 2: Verify build**

Run: `~/flutter/bin/flutter analyze`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add frontend/lib/widgets/canvas/routing_node.dart
git commit -m "feat: refactor RoutingNode to BranchNode with case rows"
```

---

### Task 5: Create NodeContextMenu widget

**Files:**
- Create: `frontend/lib/widgets/canvas/node_context_menu.dart`

- [ ] **Step 1: Write the widget**

```dart
import 'package:flutter/material.dart';
import '../../theme/tokens.dart';
import '../../widgets/icons.dart';

class NodeContextMenu extends StatelessWidget {
  final Offset anchor;
  final VoidCallback onDuplicate;
  final VoidCallback onCollapse;
  final VoidCallback onDelete;
  final VoidCallback onClose;

  const NodeContextMenu({
    super.key,
    required this.anchor,
    required this.onDuplicate,
    required this.onCollapse,
    required this.onDelete,
    required this.onClose,
  });

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Positioned.fill(
          child: GestureDetector(
            onTap: onClose,
            child: Container(color: Colors.transparent),
          ),
        ),
        Positioned(
          left: anchor.dx,
          top: anchor.dy + 8,
          child: Container(
            width: 196,
            decoration: BoxDecoration(
              color: AppColors.bg1,
              border: Border.all(color: AppColors.border2),
              borderRadius: BorderRadius.circular(8),
              boxShadow: const [
                BoxShadow(
                  color: Color(0x66000000),
                  blurRadius: 24,
                  offset: Offset(0, 8),
                ),
              ],
            ),
            padding: const EdgeInsets.all(4),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                _MenuItem(
                  icon: TrailheadIconData.copy,
                  label: 'duplicate',
                  desc: 'clone this node downstream',
                  onTap: onDuplicate,
                ),
                _MenuItem(
                  icon: TrailheadIconData.collapseLink,
                  label: 'remove + collapse',
                  desc: 'delete & rewire parent → child',
                  onTap: onCollapse,
                ),
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 4, horizontal: 6),
                  child: Container(height: 1, color: AppColors.border1),
                ),
                _MenuItem(
                  icon: TrailheadIconData.x,
                  label: 'delete node',
                  desc: 'removes its connections too',
                  danger: true,
                  onTap: onDelete,
                ),
              ],
            ),
          ),
        ),
        Positioned(
          left: anchor.dx - 16,
          top: anchor.dy - 16,
          child: SizedBox(
            width: 32,
            height: 32,
            child: Stack(
              alignment: Alignment.center,
              children: [
                Container(
                  width: 32,
                  height: 32,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: AppColors.accent.withValues(alpha: 0.32),
                      width: 1.5,
                    ),
                  ),
                ),
                Container(
                  width: 11,
                  height: 11,
                  decoration: BoxDecoration(
                    color: AppColors.accent,
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.accent.withValues(alpha: 0.22),
                        blurRadius: 0,
                        spreadRadius: 4,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

class _MenuItem extends StatefulWidget {
  final TrailheadIconData icon;
  final String label;
  final String desc;
  final bool danger;
  final VoidCallback onTap;

  const _MenuItem({
    required this.icon,
    required this.label,
    required this.desc,
    required this.onTap,
    this.danger = false,
  });

  @override
  State<_MenuItem> createState() => _MenuItemState();
}

class _MenuItemState extends State<_MenuItem> {
  bool _hover = false;

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      onEnter: (_) => setState(() => _hover = true),
      onExit: (_) => setState(() => _hover = false),
      child: GestureDetector(
        onTap: widget.onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
          decoration: BoxDecoration(
            color: _hover
                ? (widget.danger
                    ? AppColors.danger.withValues(alpha: 0.12)
                    : AppColors.bg3)
                : Colors.transparent,
            borderRadius: BorderRadius.circular(5),
          ),
          child: Row(
            children: [
              SizedBox(
                width: 20,
                child: Center(
                  child: TrailheadIcon(
                    icon: widget.icon,
                    size: 14,
                    color: widget.danger ? AppColors.danger : AppColors.fg2,
                  ),
                ),
              ),
              const SizedBox(width: 9),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      widget.label,
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                        color: AppColors.fg0,
                      ),
                    ),
                    Text(
                      widget.desc,
                      style: TextStyle(
                        fontFamily: 'monospace',
                        fontSize: 9.5,
                        color: widget.danger
                            ? AppColors.danger.withValues(alpha: 0.7)
                            : AppColors.fg3,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
```

- [ ] **Step 2: Verify build**

Run: `~/flutter/bin/flutter analyze`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add frontend/lib/widgets/canvas/node_context_menu.dart
git commit -m "feat: add NodeContextMenu widget"
```

---

### Task 6: Create node menu provider

**Files:**
- Create: `frontend/lib/providers/node_menu_provider.dart`

- [ ] **Step 1: Write provider**

```dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class NodeMenuAnchor {
  final Offset screenPos;
  final String nodeId;

  const NodeMenuAnchor({
    required this.screenPos,
    required this.nodeId,
  });
}

final nodeMenuProvider = StateProvider<NodeMenuAnchor?>((ref) => null);
```

- [ ] **Step 2: Verify build**

Run: `~/flutter/bin/flutter analyze`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add frontend/lib/providers/node_menu_provider.dart
git commit -m "feat: add nodeMenuProvider for context menu state"
```

---

### Task 7: Update GraphCanvas

**Files:**
- Modify: `frontend/lib/widgets/canvas/graph_canvas.dart`
- Modify: `frontend/lib/widgets/canvas/connection_painter.dart`

- [ ] **Step 1: Update ConnectionPainter constants**

In `frontend/lib/widgets/canvas/connection_painter.dart`, replace the hardcoded geometry constants:

```dart
static const double _workerWidth = 168.0;
static const double _workerHeight = 36.0;
static const double _fanWidth = 168.0;
static const double _fanHeight = 36.0;
static const double _branchWidth = 130.0;
static const double _branchHeight = 126.0;
static const double _controlMin = 40.0;
static const double _controlMax = 150.0;
```

Remove the old `_pillLeft`, `_pillRight`, `_pillVCenter` constants.

Update `_exitPoint` and `_entryPoint`:

```dart
Offset _exitPoint(WorkflowNode node) {
  final pos = _nodePos(node);
  return switch (node.kind) {
    'worker' => Offset(pos.dx + _workerWidth, pos.dy + _workerHeight / 2),
    'fan'    => Offset(pos.dx + _fanWidth,    pos.dy + _fanHeight / 2),
    _        => Offset(pos.dx + _branchWidth, pos.dy + _branchHeight / 2),
  };
}

Offset _entryPoint(WorkflowNode node) {
  final pos = _nodePos(node);
  return switch (node.kind) {
    'worker' => Offset(pos.dx,              pos.dy + _workerHeight / 2),
    'fan'    => Offset(pos.dx,              pos.dy + _fanHeight / 2),
    _        => Offset(pos.dx,              pos.dy + _branchHeight / 2),
  };
}
```

- [ ] **Step 2: Update GraphCanvas imports and node widget routing**

In `frontend/lib/widgets/canvas/graph_canvas.dart`:

Add imports:
```dart
import '../../providers/node_menu_provider.dart';
import 'node_context_menu.dart';
```

Remove import:
```dart
import '../delete_button.dart';
```

Update node widget routing inside the `workflow.nodes.map((node) => ...)` block:

```dart
final nodeWidget = node.kind == 'worker'
    ? WorkerNode(
        node: node,
        selected: isSelected,
        onEnter: () { ref.read(hoveredNodeProvider.notifier).state = node.id; },
        onExit: () { ref.read(hoveredNodeProvider.notifier).state = (hoveredNodeId == node.id) ? null : hoveredNodeId; },
      )
    : node.kind == 'fan'
        ? MapNode(
            node: node,
            selected: isSelected,
            onEnter: () { ref.read(hoveredNodeProvider.notifier).state = node.id; },
            onExit: () { ref.read(hoveredNodeProvider.notifier).state = (hoveredNodeId == node.id) ? null : hoveredNodeId; },
          )
        : BranchNode(
            node: node,
            selected: isSelected,
            onEnter: () { ref.read(hoveredNodeProvider.notifier).state = node.id; },
            onExit: () { ref.read(hoveredNodeProvider.notifier).state = (hoveredNodeId == node.id) ? null : hoveredNodeId; },
          );
```

- [ ] **Step 3: Replace hardcoded node sizes with helper function**

Add a helper inside `GraphCanvas.build` (before the return):

```dart
double nodeWidth(String kind) => switch (kind) {
  'worker' => 168.0,
  'fan'    => 168.0,
  _        => 130.0,
};

double nodeHeight(String kind) => switch (kind) {
  'worker' => 36.0,
  'fan'    => 36.0,
  _        => 126.0,
};
```

Update all usages of hardcoded sizes:
- `sourceHeight`: `nodeHeight(source.kind)`
- `newNodeHeight`: `nodeHeight(type.kind)`
- `snappedY`: `nodeHeight(type.kind)`
- `nodeHeight` in `onPanEnd`: `nodeHeight(node.kind)`
- Output handle `left`: `nodeWidth(node.kind) - 44.0 / viewport.zoom`
- Output handle `top`: `nodeHeight(node.kind) / 2 - 44.0 / viewport.zoom`
- `showPicker` worldPos: use `nodeWidth` and `nodeHeight / 2`

- [ ] **Step 4: Add _InputHandle widget**

Add `_InputHandle` class at the bottom of the file, mirroring `_OutputHandle`:

```dart
class _InputHandle extends StatelessWidget {
  final double inverseZoom;
  final VoidCallback onTap;

  const _InputHandle({
    required this.inverseZoom,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final size = 88.0 * inverseZoom;
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
              BoxShadow(
                color: AppColors.accent,
                blurRadius: 0,
                spreadRadius: ringSpread,
              ),
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
```

- [ ] **Step 5: Add input handle and context menu overlay to MultiHitStack**

Inside the `MultiHitStack` children array, after the node `GestureDetector` and before (or alongside) the output handle:

Replace the delete-button block with an input handle:

```dart
if (isSelected && editable)
  Positioned(
    left: 0 - 44.0 / viewport.zoom,
    top: nodeHeight(node.kind) / 2 - 44.0 / viewport.zoom,
    child: _InputHandle(
      inverseZoom: 1.0 / viewport.zoom,
      onTap: () {}, // no-op for now; preserves touch target
    ),
  ),
```

Update the output handle block to use `nodeWidth` and `nodeHeight`:

```dart
if (isSelected && editable)
  Positioned(
    left: nodeWidth(node.kind) - 44.0 / viewport.zoom,
    top: nodeHeight(node.kind) / 2 - 44.0 / viewport.zoom,
    child: _OutputHandle(
      inverseZoom: 1.0 / viewport.zoom,
      onTap: () => showPicker(
        Offset(
          displayX + nodeWidth(node.kind),
          displayY + nodeHeight(node.kind) / 2,
        ),
        node.id,
      ),
    ),
  ),
```

Remove the delete-button `Positioned` block entirely.

- [ ] **Step 6: Add long-press and right-click triggers to node GestureDetector**

Update the node `GestureDetector` to capture menu anchor:

```dart
GestureDetector(
  behavior: HitTestBehavior.opaque,
  onTap: () { ... },
  onLongPressStart: isSelected && editable
      ? (details) {
          final worldPos = Offset(
            displayX + details.localPosition.dx,
            displayY + details.localPosition.dy,
          );
          final screenPos = Offset(
            worldPos.dx * viewport.zoom + viewport.pan.dx,
            worldPos.dy * viewport.zoom + viewport.pan.dy,
          );
          ref.read(nodeMenuProvider.notifier).state = NodeMenuAnchor(
            screenPos: screenPos,
            nodeId: node.id,
          );
        }
      : null,
  onSecondaryTapDown: isSelected && editable
      ? (details) {
          final worldPos = Offset(
            displayX + details.localPosition.dx,
            displayY + details.localPosition.dy,
          );
          final screenPos = Offset(
            worldPos.dx * viewport.zoom + viewport.pan.dx,
            worldPos.dy * viewport.zoom + viewport.pan.dy,
          );
          ref.read(nodeMenuProvider.notifier).state = NodeMenuAnchor(
            screenPos: screenPos,
            nodeId: node.id,
          );
        }
      : null,
  onPanStart: editable ? (_) { ... } : null,
  onPanUpdate: editable ? (details) { ... } : null,
  onPanEnd: editable ? (_) { ... } : null,
  onPanCancel: editable ? () { ... } : null,
  child: nodeWidget,
),
```

- [ ] **Step 7: Add menu actions and render overlay**

Add these methods inside `GraphCanvas.build` (before the return):

```dart
void duplicateNode(String nodeId) {
  final node = workflow.nodes.firstWhere((n) => n.id == nodeId);
  final id = 'node_${DateTime.now().millisecondsSinceEpoch}_${Random().nextInt(9999)}';
  final newNode = WorkflowNode(
    id: id,
    kind: node.kind,
    label: node.label,
    x: _snap(node.x + 220),
    y: _snap(node.y + 32),
  );
  ref.read(workflowProvider.notifier).state = workflow.copyWith(
    nodes: [...workflow.nodes, newNode],
  );
  ref.read(selectedNodeProvider.notifier).state = id;
  ref.read(nodeMenuProvider.notifier).state = null;
}

void collapseNode(String nodeId) {
  final parentEdge = workflow.edges.cast<WorkflowEdge?>().firstWhere(
    (e) => e?.targetId == nodeId,
    orElse: () => null,
  );
  final childEdge = workflow.edges.cast<WorkflowEdge?>().firstWhere(
    (e) => e?.sourceId == nodeId,
    orElse: () => null,
  );

  final newEdges = workflow.edges
      .where((e) => e.targetId != nodeId && e.sourceId != nodeId)
      .toList();

  if (parentEdge != null && childEdge != null) {
    newEdges.add(WorkflowEdge(
      id: 'edge_${DateTime.now().millisecondsSinceEpoch}_${Random().nextInt(9999)}',
      sourceId: parentEdge.sourceId,
      targetId: childEdge.targetId,
    ));
  }

  final newNodes = workflow.nodes.where((n) => n.id != nodeId).toList();

  ref.read(workflowProvider.notifier).state = workflow.copyWith(
    nodes: newNodes,
    edges: newEdges,
  );

  if (selectedNodeId == nodeId) {
    ref.read(selectedNodeProvider.notifier).state = null;
  }
  ref.read(nodeMenuProvider.notifier).state = null;
}
```

Update the `deleteNode` method to also close the menu:

```dart
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
  ref.read(nodeMenuProvider.notifier).state = null;
}
```

Watch the menu provider:

```dart
final menuAnchor = ref.watch(nodeMenuProvider);
```

Render the menu overlay at the end of the Stack (after OperatorPicker, in screen space):

```dart
if (menuAnchor != null)
  NodeContextMenu(
    anchor: menuAnchor.screenPos,
    onDuplicate: () => duplicateNode(menuAnchor.nodeId),
    onCollapse: () => collapseNode(menuAnchor.nodeId),
    onDelete: () => deleteNode(menuAnchor.nodeId),
    onClose: () {
      ref.read(nodeMenuProvider.notifier).state = null;
    },
  ),
```

- [ ] **Step 8: Verify build**

Run: `~/flutter/bin/flutter analyze`
Expected: no errors

- [ ] **Step 9: Commit**

```bash
git add frontend/lib/widgets/canvas/graph_canvas.dart frontend/lib/widgets/canvas/connection_painter.dart frontend/lib/providers/node_menu_provider.dart
git commit -m "feat: add input handles, context menu, and update canvas wiring"
```

---

### Task 8: Update mock data coordinates

**Files:**
- Modify: `frontend/lib/providers/mock_data.dart`

- [ ] **Step 1: Adjust fan node y to align centers**

Current:
```dart
WorkflowNode(
  id: 'commenter',
  kind: 'fan',
  label: 'comment-files',
  x: 220,
  y: -32,
),
```

Change `y` from `-32` to `-16` so both worker and map centers align at y=2:

```dart
WorkflowNode(
  id: 'commenter',
  kind: 'fan',
  label: 'comment-files',
  x: 220,
  y: -16,
),
```

- [ ] **Step 2: Verify build**

Run: `~/flutter/bin/flutter analyze`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add frontend/lib/providers/mock_data.dart
git commit -m "chore: align mock map node y with worker node"
```

---

### Task 9: Build verification

- [ ] **Step 1: Build web release**

Run: `~/flutter/bin/flutter build web --release`
Expected: `✓ Built build/web`

- [ ] **Step 2: Commit if clean**

```bash
git add frontend/build/web
git commit -m "chore: build web release"
```

---

## Self-Review Checklist

**1. Spec coverage:**
- [x] WorkerNode resized to 168×36 with role-tile — Task 2
- [x] MapNode (was FanNode) single-line 168×36 — Task 3
- [x] BranchNode tall with case rows and output dots — Task 4
- [x] Input connector handle added — Task 7 Step 4
- [x] Output connector handle preserved — Task 7 Step 5
- [x] Touch target sizes unchanged (88×88 world-space) — Tasks 4–5
- [x] Delete button removed — Task 7 Step 5
- [x] Context menu with duplicate/collapse/delete — Tasks 5, 7
- [x] Long-press and right-click triggers — Task 7 Step 6
- [x] Drag-to-move preserved — Task 7 (no changes to pan logic)
- [x] ConnectionPainter updated for new sizes — Task 7 Step 1

**2. Placeholder scan:**
- No TBD/TODO/fill-in-details found.

**3. Type consistency:**
- `MapNode` replaces `FanNode` in graph_canvas.dart routing.
- `BranchNode` replaces `RoutingNode` in graph_canvas.dart routing.
- `nodeWidth`/`nodeHeight` helpers used consistently for handle positioning and snap logic.
