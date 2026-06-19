# Scissors Mode Flash Animation — Design

**Date:** 2026-06-19
**Scope:** Graph canvas mode-flash overlay when toggling scissors tool

## Context

The Flutter graph canvas already supports scissors mode (double-tap canvas or toolbar button). The design prototype at `design.rancidgrandmas.online` shows a center-screen glyph flash animation that plays whenever the mode toggles between select (cursor) and scissors. The flash communicates the mode change to users, especially on touchscreens where there is no cursor change.

## Requirements

1. When scissors mode toggles ON, show a center-screen flash with the scissors icon and "scissors" label.
2. When scissors mode toggles OFF, show a center-screen flash with the mouse-pointer icon and "select mode" label.
3. Animation: 820 ms total — scale 0.7 → 1.05 → 1.0 → 0.97, opacity 0 → 1 → 1 → 0, `Curves.easeOut`.
4. Visual style: 128 × 128 rounded rect (radius 26), backdrop blur, border colored accent for scissors / muted for select, shadow, 62 px icon, mono label below.
5. Auto-dismiss after animation completes; no user interaction required.
6. Only triggers in Build mode.
7. Does not block canvas interaction (pointer events none).

## Architecture

```
GraphCanvas (ConsumerWidget)
├── State: flashId (int), flashMode (enum)
│   └── set on double-tap toggle
├── ModeFlashOverlay (StatefulWidget)
│   ├── Implicit: AnimatedScale + AnimatedOpacity
│   └── Timer auto-dismiss after 820 ms
└── Existing canvas children unchanged
```

## Implementation Approach

**Chosen: Implicit animations** (`AnimatedScale` + `AnimatedOpacity`) keyed on a unique `flashId`.

- `flashId` increments each toggle → widget rebuilds with new key → implicit animations restart from initial values.
- `Timer(Duration(milliseconds: 820), () => setState(() => flashId = null))` removes the overlay.
- No `AnimationController` / `TickerProvider` needed → minimal lifecycle code.

### Color mapping (design → Flutter tokens)

| Design CSS var | Flutter token | Hex |
|---|---|---|
| `--co-bg-1` | `AppColors.bg1` | `#14161b` |
| `--co-accent` | `AppColors.accent` | `#e8923a` |
| `--co-accent-ink` | `AppColors.accentInk` | `#2d1810` |
| `--co-border-2` | `AppColors.border2` | `#2b303a` approx |
| `--co-text-strong` | `AppColors.fg0` | `#f3f4f6` |
| `--co-text-muted` | `AppColors.fg2` | `#a5a9b1` |

## Files Changed

- `lib/widgets/canvas/mode_flash_overlay.dart` — new widget
- `lib/widgets/canvas/graph_canvas.dart` — integrate overlay + flash state + trigger on double-tap

## Out of Scope

- Persistent bottom-right mode badge ("tool · scissors" / "layout · graph")
- Tool toolbar buttons (already implemented in `canvas_toolbar.dart`)
- Scissors cutting logic (already implemented)

## Testing

1. Double-tap canvas in Build mode → flash shows scissors glyph, fades after ~820 ms.
2. Double-tap again → flash shows mouse-pointer glyph, fades.
3. Switch to Active/History mode while scissors active → no flash, scissors state resets.
4. Rapid double-taps — each new flash cancels previous via key change.
