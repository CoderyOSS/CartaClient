/* global React, Icon */
// ──────────────────────────────────────────────────────────────────────────
// Node-consistency exploration — shared scaffolding only.
// The chosen grammar is Direction F (role-tile + clean ports), rendered by
// synthesis.jsx (horizontal) and tree.jsx (vertical). Every earlier/rejected
// direction has been expunged so this file is a single source of truth for
// the board chrome, never a place node styles linger.
// ──────────────────────────────────────────────────────────────────────────

const NS_MONO = "var(--co-font-mono)";

// Small caption under each specimen.
function NSCaption({ children }) {
  return (
    <div style={{
      marginTop: 9, textAlign: "center",
      fontFamily: NS_MONO, fontSize: 10, letterSpacing: "0.05em",
      color: "var(--co-text-subtle)",
    }}>{children}</div>
  );
}

// A node + its caption, stacked.
function Spec({ caption, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: "0 0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", minHeight: 72 }}>{children}</div>
      <NSCaption>{caption}</NSCaption>
    </div>
  );
}

// The dark "canvas" panel the specimens sit on.
function NSStage({ children }) {
  return (
    <div style={{
      position: "relative",
      display: "flex", alignItems: "center", justifyContent: "center", gap: 30,
      padding: "26px 18px",
      flexShrink: 0,
      borderRadius: 14,
      background: "var(--co-grad-hearth)",
      backgroundColor: "var(--co-bg-0)",
      border: "1px solid var(--co-border-1)",
      backgroundImage: "radial-gradient(circle, color-mix(in oklab, var(--co-border-2) 70%, transparent) 1px, transparent 1px)",
      backgroundSize: "26px 26px",
      backgroundPosition: "center",
      overflow: "hidden",
    }}>{children}</div>
  );
}

// One full board: heading + stage + rationale. Fixed height for the canvas.
function Board({ tag, name, tagline, rationale, move, render, h = 396 }) {
  return (
    <div style={{
      width: 700, height: h, boxSizing: "border-box",
      display: "flex", flexDirection: "column",
      padding: "20px 22px 22px",
      background: "var(--co-bg-1)",
      fontFamily: "var(--co-font-sans)",
    }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 3 }}>
        <span style={{
          fontFamily: NS_MONO, fontSize: 11, fontWeight: 700,
          color: "var(--co-accent)", letterSpacing: "0.04em",
        }}>{tag}</span>
        <span style={{
          fontFamily: "var(--co-font-display)", fontSize: 21, fontWeight: 600,
          color: "var(--co-text-strong)", letterSpacing: "-0.02em",
        }}>{name}</span>
      </div>
      <div style={{ fontSize: 12.5, color: "var(--co-text-muted)", marginBottom: 14, lineHeight: 1.4 }}>{tagline}</div>

      <NSStage>{render()}</NSStage>

      <div style={{ display: "flex", gap: 16, marginTop: 16, alignItems: "flex-start" }}>
        <div style={{ flex: 1, fontSize: 12, lineHeight: 1.55, color: "var(--co-text-muted)" }}>{rationale}</div>
        <div style={{
          flex: "0 0 188px",
          padding: "9px 11px", borderRadius: 9,
          background: "color-mix(in oklab, var(--co-accent) 9%, var(--co-bg-2))",
          border: "1px solid color-mix(in oklab, var(--co-accent) 26%, transparent)",
        }}>
          <div style={{ fontFamily: NS_MONO, fontSize: 8.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--co-accent)", marginBottom: 4, fontWeight: 600 }}>consistency move</div>
          <div style={{ fontSize: 11, lineHeight: 1.45, color: "var(--co-text)" }}>{move}</div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Board, NSStage, Spec, NSCaption, NS_MONO });
