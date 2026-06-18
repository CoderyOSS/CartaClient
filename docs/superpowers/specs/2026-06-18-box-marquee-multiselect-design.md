# Box-Marquee Multi-Selection + Group Drag

**Date:** 2026-06-18
**Status:** Approved
**Component:** `frontend/` (Flutter)

## Goal

Long-press-drag (touch) and plain mouse-drag inside the empty grid region starts a
box/marquee selection. Every node whose rect overlaps the marquee becomes selected.
The selected group then supports drag-to-move for the entire group.

## Non-goals

- No additive/Shift-marquee mode (plain marquee unions with prior selection; see §2).
- No drag-handle overlay on selection bbox.
- No trackpad-specific gesture (trackpad treated as mouse).
- No persistence of selection across app restarts.

## Decisions (from brainstorming)

| Concern | Decision |
|---|---|
| Mouse pan modifier | Space-hold + drag (Figma-style) |
| Mouse zoom | Scroll wheel, zooms toward cursor. No Shift/Ctrl+wheel. |
| Mouse marquee trigger | Plain left-drag on empty grid |
| Touch marquee trigger | Long-press + drag on empty grid |
| Touch pan/zoom | Unchanged: 1-finger drag pans, 2-finger pinch zooms |
| In-drag selection semantics | Live: nodes enter/leave selection as marquee rect grows/shrinks |
| Across-drag semantics | Union: each new marquee accumulates onto prior `base` selection |
| Tap empty grid | Clears all selection |
| Tap single node | Replaces selection with `{id}` |
| Group drag trigger | Plain drag on any selected node moves whole group |
| Selection state | Single `Set<String>` source of truth (replaces `selectedNodeProvider`) |

## Architecture

### 1. Gesture model (split by device)

Background `GestureDetector` at `graph_canvas.dart:228-249` currently mixes mouse pan
(raw `Listener.onPointerMove`) and touch pan/zoom (`onScale*`). Rework:

**Mouse (`PointerDeviceKind.mouse`):**
- Plain left-drag on empty grid → marquee (new).
- Plain left-drag on a node → drag that node; if node is in selection set and set
  size > 1, fires group drag (see §5).
- Space-hold + drag → pan. Tracked via `spaceHeldProvider` driven by a
  `KeyboardListener`/`Focus` widget at canvas root. `Listener.onPointerMove` only
  calls `controller.pan(delta)` when `spaceHeld && !marqueeActive`.
- Wheel → zoom toward cursor. New `Listener.onPointerSignal` handler calling
  new `controller.zoomAt(delta, cursorScreen)`.

**Touch (`PointerDeviceKind.touch`):**
- 1-finger drag on empty grid → pan (existing `onScaleUpdate` path, unchanged).
- 2-finger pinch → zoom (existing `onScale*`, unchanged).
- Long-press + drag on empty grid → marquee. Add `onLongPressStart` /
  `onLongPressMoveUpdate` / `onLongPressEnd` to background `GestureDetector`.
  Wins arena over `onScale` because long-press declares itself first once the
  deadline passes.

**Both devices:**
- Tap empty grid → clear selection (existing `onTap`).
- Tap single node → replaces selection with `{id}`.

Node-side gestures (drag, long-press-for-context-menu) win their own arena over
background gestures when the pointer is over a node, so no explicit arbitration
needed.

### 2. Selection state model

Two sets under one notifier to support live-in-drag + union-across-drags:

```dart
class SelectionState {
  final Set<String> base;      // committed from prior marquees / taps
  final Set<String> live;      // current marquee overlap (recomputed each move)
  Set<String> get current => base | live;
  bool get active => live.isNotEmpty;
}
final selectionProvider =
    StateNotifierProvider<SelectionNotifier, SelectionState>(...);
```

**Notifier API:**
- `beginMarquee()` — `live = {}` (base frozen as-is).
- `updateMarqueeLive(Set<String> hits)` — `live = hits`.
- `commitMarquee()` — `base = base | live; live = {}`.
- `cancelMarquee()` — `live = {}` (no commit).
- `selectOne(String id)` — `base = {id}; live = {}`.
- `toggleOne(String id)` — `base = base..toggle(id); live = {}` (if needed later; not in scope).
- `clear()` — `base = {}; live = {}`.
- `removeIds(Iterable<String> ids)` — `base..removeAll(ids)` (keyboard delete).

Replaces existing `selectedNodeProvider`. UI (node `selected` prop, group drag,
context-menu anchor, keyboard delete) reads `selection.current`.

### 3. Marquee render + hit-test

**Transient state:** `marqueeProvider` holding the current screen-space rect:

```dart
class MarqueeState {
  final Rect screenRect;
  final bool active;
}
final marqueeProvider = StateProvider<MarqueeState>(
    (ref) => const MarqueeState(screenRect: Rect.zero, active: false));
```

Screen-space rect because pointer events are screen-space; convert once per update
to world for hit-test.

**Paint:** sibling to `OperatorPicker` at `graph_canvas.dart:484` (screen space,
outside the world transform):

```dart
Consumer(builder: (_, ref, __) {
  final m = ref.watch(marqueeProvider);
  if (!m.active) return const SizedBox.shrink();
  return Positioned.fill(child: CustomPaint(painter: MarqueePainter(m.screenRect)));
}),
```

`MarqueePainter` (new file `widgets/canvas/marquee_painter.dart`): semi-transparent
blue fill + solid border, standard marquee look.

**Hit-test on every move:**
```dart
final world = Rect.fromPoints(
  (m.screenRect.topLeft     - viewport.pan) / viewport.zoom,
  (m.screenRect.bottomRight - viewport.pan) / viewport.zoom,
);
final hits = workflow.nodes
    .where((n) => n.rect.overlaps(world))
    .map((n) => n.id).toSet();
ref.read(selectionProvider.notifier).updateMarqueeLive(hits);
```

In-drag, `live` is fully recomputed (nodes leave when no longer overlapping).
`current = base ∪ live` is what's rendered.

### 4. Node rect helper (dedup)

Extract size logic duplicated in 3 places (`graph_canvas.dart:50-62`,
`zoom_controls.dart:27-39`, `connection_painter.dart:14-23`) into a model extension:

```dart
// models/workflow_node.dart
extension WorkflowNodeRect on WorkflowNode {
  double get width => switch (kind) {
    'worker' => 168.0,
    'fan'    => 168.0,
    _        => BranchNode.width,  // 130
  };
  double get height => switch (kind) {
    'worker' => 36.0,
    'fan'    => 36.0,
    _        => BranchNode.padY * 2 +
                (outputs.isEmpty ? 4 : outputs.length) * BranchNode.rowHeight,
  };
  Rect get rect => Rect.fromLTWH(x, y, width, height);
}
```

Pure refactor; `graph_canvas.dart`, `zoom_controls.dart`, `connection_painter.dart`
call `node.width` / `node.height` instead of local closures. Behavior identical.

### 5. Group drag mechanics

Extend existing per-node `onPan*` (`graph_canvas.dart:375-413`):

**Live preview** (`graph_canvas.dart:291-292`):
```dart
final inGroup = selection.current.contains(node.id) &&
                selection.current.length > 1 &&
                draggingNodeId != null;
final displayX = node.x + (inGroup ? dragOffset.dx : 0);
final displayY = node.y + (inGroup ? dragOffset.dy : 0);
```
Every node in the set moves together; unselected nodes stay put.

**Commit** (`onPanEnd`):
```dart
final cur = ref.read(selectionProvider).current;
if (cur.length > 1 && cur.contains(node.id)) {
  final newNodes = workflow.nodes.map((n) {
    if (!cur.contains(n.id)) return n;
    final h = n.height;
    return n.copyWith(
      x: _snap(n.x + offset.dx),
      y: _snapCenter(n.y + offset.dy + h / 2) - h / 2,
    );
  }).toList();
  ref.read(workflowProvider.notifier).state =
      workflow.copyWith(nodes: newNodes);
} else {
  // existing single-node commit path
}
```

Snapping applies per-node (grid snap is positional, not bbox-preserving) —
consistent with current single-node behavior.

**Conflict with marquee start:** plain drag starting on a node always drags nodes
(the node's `GestureDetector` wins the arena). Marquee only fires on empty grid.

### 6. Canvas controller additions (`providers/canvas_controller.dart`)

```dart
void zoomAt(double delta, Offset screenCursor) {
  final factor = delta < 0 ? 1.1 : 1 / 1.1;
  final newZoom = (viewport.zoom * factor).clamp(0.35, 2.0);
  // keep cursor anchored: world point under cursor stays fixed
  final worldBefore = (screenCursor - viewport.pan) / viewport.zoom;
  final newPan = screenCursor - worldBefore * newZoom;
  state = CanvasViewport(zoom: newZoom, pan: newPan);
}
```

## Files touched

| File | Change |
|---|---|
| `models/workflow_node.dart` | Add `WorkflowNodeRect` extension |
| `providers/mode_provider.dart` | Remove `selectedNodeProvider`; add `marqueeProvider`, `spaceHeldProvider` |
| `providers/selection_notifier.dart` (new) | `SelectionState` + `SelectionNotifier` + `selectionProvider` |
| `providers/canvas_controller.dart` | Add `zoomAt(delta, screenCursor)` |
| `widgets/canvas/graph_canvas.dart` | Gesture rework (§1); marquee overlay (§3); group-drag commit + preview (§5); node-size dedup; migrate all `selectedNodeProvider` reads |
| `widgets/canvas/marquee_painter.dart` (new) | `MarqueePainter` |
| `widgets/canvas/zoom_controls.dart` | Use `node.width` / `node.height` |
| `widgets/canvas/connection_painter.dart` | Use `node.width` / `node.height` |
| Canvas root or new wrapper | Space-hold tracking via `Focus` + `KeyboardListener` |

## Testing

`frontend/test/` exists; Riverpod `ProviderScope` overrides available.

- **Unit — `WorkflowNodeRect`:** correct width/height/rect per kind (worker, fan,
  branch with 0/3/N outputs, entrypoint).
- **Unit — `SelectionNotifier`:** `beginMarquee` freezes base;
  `updateMarqueeLive` overwrites live only; `commitMarquee` unions into base;
  `cancelMarquee` discards live; `selectOne` replaces; `clear` empties; `removeIds`
  removes from base only.
- **Widget — marquee union:** simulate marquee over nodes A,B → commit; second
  marquee over C → commit; assert `current = {A,B,C}`.
- **Widget — in-drag live:** marquee grows over A,B then shrinks past A → assert
  `current = base ∪ {B}` (A left live during drag).
- **Widget — group drag commit:** selected set {A,B}; drag delta (10,10);
  assert both A.x and B.x increased by snapped amount; unselected node C unchanged.
- **Golden (optional):** `MarqueePainter` renders expected rect.
- **Manual:** mouse plain-drag → marquee; space-hold drag → pan; wheel → zoom at
  cursor; touch long-press-drag → marquee; tap empty → clear; plain drag on
  selected node in multi-set → group move.

## Open questions

None. All decided in brainstorming.
