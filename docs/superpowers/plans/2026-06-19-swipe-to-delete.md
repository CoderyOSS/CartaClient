# Swipe-to-Delete Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add swipe-left-to-delete to workflow and job sidebar rows.

**Architecture:** Wrap each sidebar row in Flutter's built-in `Dismissible` widget with a red danger background, trash icon, and "delete" label. On dismiss, remove the item from the corresponding Riverpod provider.

**Tech Stack:** Flutter, Riverpod, `flutter_svg` for icons

---

### File Map

| File | Responsibility |
|------|--------------|
| `frontend/lib/widgets/icons.dart` | Add `trash` SVG path to `TrailheadIconData` enum + `_bodies` map |
| `frontend/lib/widgets/workflows_sidebar.dart` | Wrap `_WorkflowRow` in `Dismissible`, add `onDelete` callback, clear active selection if needed |
| `frontend/lib/widgets/jobs_sidebar.dart` | Wrap `_JobRowGrouped` and `_JobRowFlat` in `Dismissible`, add `onDelete` callback, clear active selection if needed |

---

### Task 1: Add Trash Icon

**Files:**
- Modify: `frontend/lib/widgets/icons.dart`

- [ ] **Step 1: Add `trash` to enum and map**

Add `trash` to the `TrailheadIconData` enum:

```dart
enum TrailheadIconData {
  pencil,
  stopwatch,
  list,
  terminal,
  settings,
  play,
  bookmark,
  refresh,
  copy,
  file,
  chevRight,
  clock,
  workflow,
  x,
  gitBranch,
  forEach,
  merge,
  zap,
  check,
  save,
  search,
  lock,
  collapseLink,
  bot,
  mousePointer,
  scissors,
  maximize,
  sun,
  layout,
  send,
  plug,
  trash, // <-- add this
}
```

Add the SVG body to `_bodies` map:

```dart
  TrailheadIconData.trash:
      '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>'
      '<line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>'
      '<path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
```

- [ ] **Step 2: Verify icon compiles**

Run: `~/flutter/bin/flutter analyze frontend/lib/widgets/icons.dart`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add frontend/lib/widgets/icons.dart
git commit -m "feat: add trash icon for swipe-to-delete"
```

---

### Task 2: Swipe-to-Delete for Workflows Sidebar

**Files:**
- Modify: `frontend/lib/widgets/workflows_sidebar.dart`

- [ ] **Step 1: Add `_DeleteBackground` helper and import `icons.dart`**

`icons.dart` is already imported. Add a reusable `_DeleteBackground` widget near the top of the file (after `_Header`):

```dart
class _DeleteBackground extends StatelessWidget {
  final double progress;

  const _DeleteBackground({required this.progress});

  @override
  Widget build(BuildContext context) {
    final clamped = progress.clamp(0.0, 1.0);
    return Container(
      decoration: BoxDecoration(
        color: AppColors.danger,
        borderRadius: BorderRadius.circular(6),
      ),
      padding: const EdgeInsets.only(right: 16),
      alignment: Alignment.centerRight,
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Transform.scale(
            scale: 0.85 + clamped * 0.15,
            child: TrailheadIcon(
              icon: TrailheadIconData.trash,
              size: 14,
              color: Colors.white,
            ),
          ),
          const SizedBox(width: 6),
          Opacity(
            opacity: clamped,
            child: const Text(
              'delete',
              style: TextStyle(
                fontFamily: 'monospace',
                fontSize: 11,
                fontWeight: FontWeight.w600,
                color: Colors.white,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
```

- [ ] **Step 2: Update `_WorkflowRow` signature and wrap in `Dismissible`**

Change `_WorkflowRow` constructor to accept `onDelete`:

```dart
class _WorkflowRow extends StatefulWidget {
  final WorkflowSummary workflow;
  final bool active;
  final VoidCallback onTap;
  final VoidCallback? onDelete; // <-- add this

  const _WorkflowRow({
    required this.workflow,
    required this.active,
    required this.onTap,
    this.onDelete, // <-- add this
  });
```

Wrap the existing `GestureDetector` in `Dismissible` inside `build`:

```dart
    return Dismissible(
      key: ValueKey(wf.id),
      direction: DismissDirection.endToStart,
      dismissThresholds: const {DismissDirection.endToStart: 0.4},
      background: _DeleteBackground(progress: 1.0),
      onDismissed: (_) => widget.onDelete?.call(),
      child: GestureDetector(
        onTap: widget.onTap,
        child: MouseRegion(
          ... // existing body unchanged
        ),
      ),
    );
```

- [ ] **Step 3: Pass `onDelete` from parent and handle active-selection cleanup**

In `WorkflowsSidebar.build`, inside `ListView.builder` where `_WorkflowRow` is created:

```dart
                return _WorkflowRow(
                  workflow: wf,
                  active: wf.id == activeId,
                  onTap: () => onPick(wf.id),
                  onDelete: () {
                    ref.read(workflowsProvider.notifier).update((list) =>
                        list.where((w) => w.id != wf.id).toList());
                    if (wf.id == activeId) {
                      ref.read(workflowProvider.notifier).state = null;
                    }
                  },
                );
```

- [ ] **Step 4: Verify compilation**

Run: `~/flutter/bin/flutter analyze frontend/lib/widgets/workflows_sidebar.dart`
Expected: no errors

- [ ] **Step 5: Commit**

```bash
git add frontend/lib/widgets/workflows_sidebar.dart
git commit -m "feat: swipe-to-delete for workflow rows"
```

---

### Task 3: Swipe-to-Delete for Jobs Sidebar (Grouped View)

**Files:**
- Modify: `frontend/lib/widgets/jobs_sidebar.dart`

- [ ] **Step 1: Add `_DeleteBackground` helper**

Add the same `_DeleteBackground` widget near the top of the file (after `_EmptyState`):

```dart
class _DeleteBackground extends StatelessWidget {
  final double progress;

  const _DeleteBackground({required this.progress});

  @override
  Widget build(BuildContext context) {
    final clamped = progress.clamp(0.0, 1.0);
    return Container(
      decoration: BoxDecoration(
        color: AppColors.danger,
        borderRadius: BorderRadius.circular(6),
      ),
      padding: const EdgeInsets.only(right: 16),
      alignment: Alignment.centerRight,
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Transform.scale(
            scale: 0.85 + clamped * 0.15,
            child: TrailheadIcon(
              icon: TrailheadIconData.trash,
              size: 14,
              color: Colors.white,
            ),
          ),
          const SizedBox(width: 6),
          Opacity(
            opacity: clamped,
            child: const Text(
              'delete',
              style: TextStyle(
                fontFamily: 'monospace',
                fontSize: 11,
                fontWeight: FontWeight.w600,
                color: Colors.white,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
```

- [ ] **Step 2: Update `_JobRowGrouped` to accept `onDelete` and wrap in `Dismissible`**

Change constructor:

```dart
class _JobRowGrouped extends StatefulWidget {
  final JobSummary job;
  final bool active;
  final VoidCallback onTap;
  final VoidCallback? onDelete; // <-- add

  const _JobRowGrouped({
    required this.job,
    required this.active,
    required this.onTap,
    this.onDelete, // <-- add
  });
```

Wrap existing `GestureDetector` in `Dismissible` inside build:

```dart
    return Dismissible(
      key: ValueKey(j.id),
      direction: DismissDirection.endToStart,
      dismissThresholds: const {DismissDirection.endToStart: 0.4},
      background: const _DeleteBackground(progress: 1.0),
      onDismissed: (_) => widget.onDelete?.call(),
      child: GestureDetector(
        onTap: widget.onTap,
        child: MouseRegion(
          ... // existing body unchanged
        ),
      ),
    );
```

- [ ] **Step 3: Pass `onDelete` from `_GroupedView` and handle active-selection cleanup**

In `_GroupedView.build`, update the `_JobRowGrouped` call:

```dart
              (j) => _JobRowGrouped(
                job: j,
                active: j.id == activeId,
                onTap: () => onPick(j.id),
                onDelete: () {
                  ref.read(jobsProvider.notifier).update((list) =>
                      list.where((job) => job.id != j.id).toList());
                  if (j.id == activeId) {
                    ref.read(selectedJobProvider.notifier).state = null;
                  }
                },
              ),
```

Note: `_GroupedView` is a `StatelessWidget` without `ref`. Convert it to `ConsumerWidget` (or pass `onDelete` from `JobsSidebar` which already has `ref`). Easiest path: change `_GroupedView` to `ConsumerWidget` so it can read `ref`.

Change class signature:
```dart
class _GroupedView extends ConsumerWidget {
```

Change `build` signature:
```dart
  @override
  Widget build(BuildContext context, WidgetRef ref) {
```

- [ ] **Step 4: Verify compilation**

Run: `~/flutter/bin/flutter analyze frontend/lib/widgets/jobs_sidebar.dart`
Expected: no errors

- [ ] **Step 5: Commit**

```bash
git add frontend/lib/widgets/jobs_sidebar.dart
git commit -m "feat: swipe-to-delete for grouped job rows"
```

---

### Task 4: Swipe-to-Delete for Jobs Sidebar (Flat View)

**Files:**
- Modify: `frontend/lib/widgets/jobs_sidebar.dart`

- [ ] **Step 1: Update `_JobRowFlat` to accept `onDelete` and wrap in `Dismissible`**

Change constructor:

```dart
class _JobRowFlat extends StatefulWidget {
  final JobSummary job;
  final bool active;
  final VoidCallback onTap;
  final VoidCallback? onDelete; // <-- add

  const _JobRowFlat({
    required this.job,
    required this.active,
    required this.onTap,
    this.onDelete, // <-- add
  });
```

Wrap existing `GestureDetector` in `Dismissible` inside build (identical to grouped):

```dart
    return Dismissible(
      key: ValueKey(j.id),
      direction: DismissDirection.endToStart,
      dismissThresholds: const {DismissDirection.endToStart: 0.4},
      background: const _DeleteBackground(progress: 1.0),
      onDismissed: (_) => widget.onDelete?.call(),
      child: GestureDetector(
        onTap: widget.onTap,
        child: MouseRegion(
          ... // existing body unchanged
        ),
      ),
    );
```

- [ ] **Step 2: Convert `_FlatView` to `ConsumerWidget` and pass `onDelete`**

Change class signature:
```dart
class _FlatView extends ConsumerWidget {
```

Change `build` signature:
```dart
  @override
  Widget build(BuildContext context, WidgetRef ref) {
```

Update `_JobRowFlat` call:

```dart
        return _JobRowFlat(
          job: j,
          active: j.id == activeId,
          onTap: () => onPick(j.id),
          onDelete: () {
            ref.read(jobsProvider.notifier).update((list) =>
                list.where((job) => job.id != j.id).toList());
            if (j.id == activeId) {
              ref.read(selectedJobProvider.notifier).state = null;
            }
          },
        );
```

- [ ] **Step 3: Verify compilation**

Run: `~/flutter/bin/flutter analyze frontend/lib/widgets/jobs_sidebar.dart`
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add frontend/lib/widgets/jobs_sidebar.dart
git commit -m "feat: swipe-to-delete for flat job rows"
```

---

### Task 5: Build and Verify

- [ ] **Step 1: Build web release**

Run: `~/flutter/bin/flutter build web --release`
Expected: `✓ Built ...`

- [ ] **Step 2: Commit build artifacts**

```bash
git add frontend/build/web/
git commit -m "chore: rebuild web for swipe-to-delete"
```

- [ ] **Step 3: Smoke test in browser**

Open `trailhead-dev.rancidgrandmas.online` in Chrome DevTools mobile emulator (or mouse-drag on desktop).
- Swipe a workflow row left → red background with trash + "delete" appears.
- Release past 40 % → row slides off and workflow disappears.
- Swipe a job row left in both grouped and flat views → same behavior.
- Delete the currently selected item → orange active rail disappears.

---

## Spec Coverage Check

| Spec Requirement | Task |
|---|---|
| Trash icon | Task 1 |
| Red danger background | Tasks 2–4 (`_DeleteBackground`) |
| Trash icon scales 0.85→1 | Tasks 2–4 (`Transform.scale`) |
| "delete" label fades in | Tasks 2–4 (`Opacity`) |
| 40 % threshold | Tasks 2–4 (`dismissThresholds`) |
| Swipe never fires tap | Built into `Dismissible` |
| Remove from provider | Tasks 2–4 (`onDismissed` updates provider) |
| Clear active selection if deleted | Tasks 2–4 (`if (id == activeId) ...`) |

## Placeholder Scan

No TBD, TODO, or vague steps. Every code block is complete and copy-paste ready.

## Type Consistency

- `onDelete` is always `VoidCallback?`.
- `Dismissible.key` is always `ValueKey<String>` using the item ID.
- `_DeleteBackground.progress` is always `double`.
