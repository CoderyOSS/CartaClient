# Swipe-to-Delete for Workflow and Job Rows

## Goal
Add swipe-left-to-delete affordance to every row in the Workflows sidebar and Jobs sidebar (both grouped and flat views), matching the design prototype behavior.

## Scope
- `frontend/lib/widgets/workflows_sidebar.dart` — `_WorkflowRow`
- `frontend/lib/widgets/jobs_sidebar.dart` — `_JobRowGrouped`, `_JobRowFlat`
- `frontend/lib/widgets/icons.dart` — add `trash` icon

## Design

### Interaction
- Swipe row left (mouse drag or touch). Red delete background reveals underneath.
- Release past **40 % of row width** → row slides off, height collapses, item deleted.
- Release short of threshold → springs back.
- A swipe never triggers the row’s tap/select.

### Flutter mapping
Use built-in `Dismissible` widget — exact match with handoff spec.

```dart
Dismissible(
  key: ValueKey(itemId),
  direction: DismissDirection.endToStart,
  dismissThresholds: const {DismissDirection.endToStart: 0.4},
  background: _DeleteBackground(progress: ...),
  onDismissed: (_) => /* remove from provider */,
  child: /* existing row GestureDetector+MouseRegion */,
)
```

### Delete background
- `Container(color: AppColors.danger, borderRadius: BorderRadius.circular(6))`
- Right-aligned: trash icon (14 px) + "delete" label (monospace 11 px, white)
- Trash icon scales `0.85 → 1.0` with drag progress
- "delete" label opacity `0 → 1` with drag progress

### Icon addition
Add `trash` to `TrailheadIconData`:
```svg
<path d="M3 6h18"/>
<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
<line x1="10" y1="11" x2="10" y2="17"/>
<line x1="14" y1="11" x2="14" y2="17"/>
<path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
```

### Deletion behavior
- Remove item from respective Riverpod provider (`workflowsProvider` / `jobsProvider`).
- If deleted item was the active selection, clear `workflowProvider` or `selectedJobProvider`.
- `Dismissible` handles spring-back and slide-off animations automatically.

## Testing
- Build web release after changes (`flutter build web --release`).
- Verify swipe works on Chrome DevTools mobile emulator + mouse drag.
- Confirm active-selection rail disappears when active item is deleted.
