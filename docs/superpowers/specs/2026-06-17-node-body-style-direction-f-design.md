# Node Body Style — Direction F Family

## Overview

Refactor the graph canvas node system to match the updated design guide (Direction F). Three node types share one visual grammar: a single-line capsule with a leading golden role-tile, neutral connector dots on the edges, and status shown in a straddling top pill. Replace the floating delete button with a long-press / right-click context menu.

## 1. Visual Grammar (All Nodes)

| Element | Spec |
|---------|------|
| **Capsule shell** | 168px wide, border radius 10px, `AppColors.loafGradient` idle, accent-tinted gradient when running |
| **Border** | `AppColors.border2` idle; `AppColors.accent` when selected |
| **Shadow** | Accent spread ring + drop shadow (selected); accent blur glow + drop shadow (running); subtle shadow (idle) |
| **Role-tile** | Leading 30px strip, `AppColors.crustGradient`, 14px icon in `AppColors.accentInk`, 1px right border `AppColors.border2` |
| **Label** | Monospace 13px weight 600, `AppColors.fg0`, single-line ellipsis, padding 0 10px |
| **Status pill** | Straddles top border at `top: -8, right: 8`. Solid fill per state. Running gets spinner. |
| **Connector dots** | 8px diameter, `bg3` fill, 1.5px `border3` border. Selected: 12px accent dot with ring + glow. |
| **No left-edge status rail** | Removed from all node types. |

## 2. Node Types

### WorkerNode — `168 × 36`
- Icon: `bot`
- Label: `node.label`

### MapNode (replaces FanNode) — `168 × 36`
- Icon: `forEach`
- Label: `node.label` (e.g., "comment-file")
- Same shell as worker. No ×n chip for this pass.

### BranchNode (replaces RoutingNode) — `130 × dynamic`
- Role-tile with `gitBranch` icon
- Body stacks case rows (e.g., high / medium / low / default)
- Each case row gets an output dot on the right edge, vertically centered to its row
- Input dot on left edge, mid-height

## 3. Connector Touch Targets

Both input and output get enlarged hit areas:

- 88 × 88 world-space container (44 screen-px at zoom=1) centered on each dot
- `GestureDetector` with `behavior: HitTestBehavior.translucent`
- `MultiHitStack` ordering preserved: node body gesture detector sits below connector overlays, so both receive pointer events
- `_InputHandle` widget mirrors existing `_OutputHandle` (same inverseZoom scaling, same visual dot treatment)

Canvas positions:
- Worker input: left of body, vertically centered; output: right edge mid-height
- Map input/output: same as worker (same 168×36 size)
- Branch input: left edge mid-height; outputs: one per case aligned to case row center

## 4. Canvas Wiring Changes

`graph_canvas.dart`:
- Node widget routing: `worker` → `WorkerNode`, `fan` → `MapNode`, else → `BranchNode`
- `_InputHandle` added per selected node at left-edge position
- Handle positions updated for new node sizes:
  - Worker: input at `(0, 18)`, output at `(168, 18)`
  - Map: input at `(0, 18)`, output at `(168, 18)`
  - Branch: input at `(0, H/2)`, outputs at `(130, caseCenterY[i])`

## 5. Delete Button → Context Menu

**Remove:** Floating delete button on selected nodes.

**Add:** Long-press (touch) or right-click (mouse) on a **selected** node opens a context menu at the press point.

### Menu items

| Action | Icon | Label | Description | Behavior |
|--------|------|-------|-------------|----------|
| Duplicate | `copy` | duplicate | clone this node downstream | Clone node, offset by grid gap, wire from same parent |
| Remove + collapse | `collapseLink` | remove + collapse | delete & rewire parent → child | Delete node, connect parent's output to child's input |
| — | — | — | — | Divider |
| Delete node | `x` | delete node | removes its connections too | Delete node + all connected edges (danger) |

### Menu styling
- Min width: 196px
- Background: `AppColors.bg1`, border: `AppColors.border2`, radius: 8px
- Shadow: drop shadow (reuse existing shadow tokens)
- Padding: 4px
- Item: 20px icon square + label (sans 12px weight 500) + desc (mono 9.5px)
- Danger item: `AppColors.danger` text, tinted hover background
- Divider: 1px `AppColors.border1`, margin 4px 6px

### Press point indicator
Small accent dot (11px) with soft halo ring (32px, 1.5px accent border at 32% opacity) sits at the menu anchor corner, showing where the long-press / right-click landed.

### Trigger behavior
- Menu only opens when node is **selected** (not on hover alone)
- Flows down and to the right from press point; flips to stay on-screen near canvas edges
- Dismisses on tap outside

## 6. Files Changed

| File | Change |
|------|--------|
| `lib/widgets/canvas/worker_node.dart` | Resize to 168×36, add role-tile, remove status rail, add connector dots |
| `lib/widgets/canvas/fan_node.dart` | Refactor to single-line MapNode (168×36) |
| `lib/widgets/canvas/routing_node.dart` | Refactor to BranchNode (tall, case rows, per-case outputs) |
| `lib/widgets/canvas/graph_canvas.dart` | Remove delete button; add `_InputHandle`; add context menu overlay; wire long-press/right-click on selected nodes; wire menu actions |
| `lib/widgets/canvas/node_context_menu.dart` | New widget: menu container, menu items, press point indicator |
| `lib/providers/mock_data.dart` | Update mock node coordinates if needed for new sizes |

## 7. Explicitly Preserved

- Touch target sizes and logic (unchanged)
- Drag-to-move behavior for nodes and grid view (unchanged)
- Selection tap behavior (unchanged)
- Operator picker from output handle tap (unchanged)
- Snap-to-grid logic (unchanged)
- `MultiHitStack` / `UnboundedHitStack` unchanged

## 8. Out of Scope

- Tree layout (vertical connections) — graph layout only for this pass
- Expanded fan node / modal workflow editor
- Dynamic fan fields (backend integration)
- ×n chip on MapNode
- Edge insert/delete affordances (mid-edge + and × buttons)
