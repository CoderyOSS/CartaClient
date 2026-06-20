/* global React, Icon, IconButton, Button, StatusDot, StatusTag, Tag, WORKFLOWS_LIST */
const { useState: useStateTB, useRef: useRefTB, useEffect: useEffectTB } = React;

// ──────────────────────────────────────────────────────────────────────────
// Top bar — adapts to the active mode. The mode rail (on the far left)
// is the sole selector for build / active / history. This bar focuses on
// context + actions for whatever the user is currently doing.
// ──────────────────────────────────────────────────────────────────────────

function ContextChip({ icon, label, value, accent }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      fontFamily: "var(--co-font-mono)", fontSize: 11,
      color: accent ? "var(--co-accent)" : "var(--co-text)",
    }}>
      {icon && <Icon name={icon} size={11} color="currentColor" />}
      {label && <span style={{ color: "var(--co-text-subtle)" }}>{label}</span>}
      <span style={{ fontVariantNumeric: "tabular-nums" }}>{value}</span>
    </span>
  );
}

function JobControls({ state, onPlay, onPause, onStop, onRestart, onSnapshot }) {
  const running = state === "running";
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: 3,
      background: "var(--co-bg-2)",
      border: "1px solid var(--co-border-1)",
      borderRadius: 8,
    }}>
      {running ? (
        <button type="button" onClick={onPause} title="Pause" style={ctrlBtn(false)}>
          <span style={{ display: "inline-flex", gap: 2 }}>
            <span style={{ width: 3, height: 11, background: "currentColor", borderRadius: 1 }} />
            <span style={{ width: 3, height: 11, background: "currentColor", borderRadius: 1 }} />
          </span>
          <span>pause</span>
        </button>
      ) : (
        <button type="button" onClick={onPlay} title="Resume" style={ctrlBtn(true)}>
          <Icon name="play" size={11} />
          <span>{state === "paused" ? "resume" : state === "queued" ? "start" : "resume"}</span>
        </button>
      )}
      <button type="button" onClick={onStop} title="Stop" style={ctrlBtn(false)}>
        <span style={{ width: 9, height: 9, background: "currentColor", display: "inline-block", borderRadius: 1 }} />
        <span>stop</span>
      </button>
      <button type="button" onClick={onRestart} title="Restart from scratch" style={ctrlBtn(false)}>
        <Icon name="refresh" size={11} />
      </button>
      <button type="button" onClick={onSnapshot} title="Take a snapshot" style={ctrlBtn(false)}>
        <Icon name="bookmark" size={11} />
      </button>
    </div>
  );
}

function ctrlBtn(primary) {
  return {
    display: "inline-flex", alignItems: "center", gap: 5,
    padding: "3px 10px",
    fontSize: 11.5, fontWeight: 500,
    fontFamily: "var(--co-font-sans)",
    background: primary ? "var(--co-grad-crust)" : "transparent",
    color: primary ? "var(--co-accent-ink)" : "var(--co-text)",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
    boxShadow: primary ? "0 1px 0 0 rgba(255,255,255,0.16) inset, 0 2px 6px color-mix(in oklab, var(--co-accent-400) 30%, transparent)" : "none",
  };
}

// ──────────────────────────────────────────────────────────────────────────

function ModeBadge({ mode }) {
  const meta = mode === "build"   ? { label: "BUILD",   color: "var(--co-text-strong)", bg: "var(--co-bg-3)" }
            : mode === "active"  ? { label: "ACTIVE",  color: "var(--co-accent)",      bg: "var(--co-accent-soft)" }
            :                       { label: "HISTORY", color: "var(--co-text-muted)",  bg: "var(--co-bg-3)" };
  return (
    <span style={{
      fontFamily: "var(--co-font-mono)", fontSize: 9.5, fontWeight: 700,
      letterSpacing: "0.10em",
      padding: "3px 8px",
      borderRadius: 4,
      background: meta.bg,
      color: meta.color,
      border: `1px solid color-mix(in oklab, ${meta.color} 22%, transparent)`,
    }}>{meta.label}</span>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Workflow selector — the build-mode header dropdown that replaces the old
// left sidebar. The trigger shows the loaded workflow (name + version +
// draft); the panel lists every workflow with its run stats and live-job
// pip, plus "new workflow" and per-row delete — everything the sidebar did.
// ──────────────────────────────────────────────────────────────────────────

function WorkflowMenuRow({ wf, active, onPick, onDelete }) {
  const [hover, setHover] = useStateTB(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ position: "relative", display: "flex", alignItems: "center" }}
    >
      <button
        type="button"
        onClick={() => onPick(wf.id)}
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "1fr auto",
          alignItems: "center",
          gap: 8,
          padding: "6px 8px",
          background: active ? "var(--co-bg-3)" : hover ? "var(--co-bg-2)" : "transparent",
          border: "none",
          borderRadius: 4,
          textAlign: "left",
          cursor: "pointer",
          fontFamily: "var(--co-font-mono)",
          transition: "background 140ms var(--co-ease-out)",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontFamily: "var(--co-font-mono)", fontSize: 11.5,
            color: active ? "var(--co-text-strong)" : "var(--co-text)",
            fontWeight: active ? 600 : 500,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>{wf.name}</div>
          <div style={{
            fontFamily: "var(--co-font-mono)", fontSize: 9.5,
            color: "var(--co-text-subtle)", marginTop: 1,
          }}>
            {wf.runs.toLocaleString()} runs · last {wf.last}
          </div>
        </div>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8, flex: "0 0 auto" }}>
          {wf.active > 0 && (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              fontFamily: "var(--co-font-mono)", fontSize: 10,
              color: "var(--co-accent)",
            }}>
              <StatusDot status="running" pulse size={5} />
              {wf.active}
            </span>
          )}
        </span>
      </button>
      {hover && (
        <button
          type="button"
          title="delete workflow"
          onClick={(e) => { e.stopPropagation(); onDelete(wf.id); }}
          style={{
            position: "absolute", right: 8,
            width: 24, height: 24, borderRadius: 6,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            background: "var(--co-bg-3)", border: "1px solid var(--co-border-1)",
            color: "var(--co-text-subtle)", cursor: "pointer",
          }}
        >
          <Icon name="trash" size={12} color="currentColor" />
        </button>
      )}
    </div>
  );
}

function WorkflowSelect({ workflow, workflows, activeWfId, onPickWorkflow, defaultOpen }) {
  const [open, setOpen] = useStateTB(!!defaultOpen);
  const [hidden, setHidden] = useStateTB(() => new Set());
  const ref = useRefTB(null);

  useEffectTB(() => {
    if (!open) return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open]);

  const list = (workflows || []).filter(wf => !hidden.has(wf.id));
  const removeWf = (id) => setHidden(h => { const n = new Set(h); n.add(id); return n; });
  const pick = (id) => { onPickWorkflow(id); setOpen(false); };

  return (
    <div ref={ref} style={{ position: "relative", flex: "0 0 auto", width: 288 }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex", alignItems: "center", gap: 9,
          width: "100%",
          padding: "8px 10px",
          background: "var(--co-bg-1)",
          border: "1px solid", borderColor: open ? "var(--co-accent)" : "var(--co-border-2)",
          borderRadius: 8,
          cursor: "pointer", minWidth: 0,
          transition: "border-color 140ms var(--co-ease-out)",
        }}
      >
        <span style={{
          flex: 1, minWidth: 0,
          fontFamily: "var(--co-font-mono)", fontSize: 13, fontWeight: 600,
          color: "var(--co-text)",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          textAlign: "left",
        }}>{workflow.name}</span>
        <span style={{
          flex: "0 0 auto",
          width: 0, height: 0,
          borderLeft: "4px solid transparent",
          borderRight: "4px solid transparent",
          borderTop: "4px solid var(--co-text-muted)",
          transform: open ? "rotate(180deg)" : "rotate(0)",
          transition: "transform 160ms var(--co-ease-out)",
        }} />
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0, marginTop: 4,
          background: "var(--co-bg-2)",
          border: "1px solid var(--co-border-2)",
          borderRadius: 8,
          boxShadow: "var(--co-shadow-2)",
          padding: 4,
          zIndex: 60,
          overflow: "hidden",
          transformOrigin: "top",
          animation: "co-reveal-down 180ms var(--co-ease-out)",
        }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "6px 6px 8px", borderBottom: "1px solid var(--co-border-1)", marginBottom: 4,
          }}>
            <span style={{
              fontFamily: "var(--co-font-mono)", fontSize: 9.5,
              letterSpacing: "0.08em", textTransform: "uppercase",
              color: "var(--co-text-subtle)", fontWeight: 500,
            }}>switch workflow · {list.length}</span>
            <Button variant="secondary" size="sm" icon="plus">new</Button>
          </div>
          <div style={{ maxHeight: 340, overflowY: "auto", display: "flex", flexDirection: "column", gap: 1 }}>
            {list.map(wf => (
              <WorkflowMenuRow
                key={wf.id}
                wf={wf}
                active={wf.id === activeWfId}
                onPick={pick}
                onDelete={removeWf}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function BuildBar({ workflow, workflows, activeWfId, onPickWorkflow, onYaml, yamlActive }) {
  return (
    <div style={{
      flex: 1,
      display: "flex", alignItems: "center", gap: 12,
      minWidth: 0,
    }}>
      <WorkflowSelect
        workflow={workflow}
        workflows={workflows}
        activeWfId={activeWfId}
        onPickWorkflow={onPickWorkflow}
      />

      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, flex: "0 0 auto" }}>
        <Button variant="ghost" size="sm" icon="copy">duplicate</Button>
        <Button variant={yamlActive ? "secondary" : "ghost"} size="sm" icon="file" onClick={onYaml}>YAML</Button>
        <span style={{ width: 1, height: 22, background: "var(--co-border-1)", margin: "0 2px" }} />
        <Button variant="secondary" size="sm">save draft</Button>
        <Button variant="trail" size="sm" icon="play">launch</Button>
      </div>
    </div>
  );
}

function JobBar({ job, mode, jobState, onPlay, onPause, onStop, onRestart, onSnapshot, onClear, onYaml, yamlActive }) {
  if (!job) {
    return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontFamily: "var(--co-font-mono)", fontSize: 12, color: "var(--co-text-subtle)" }}>
          {mode === "active" ? "select a running job from the sidebar" : "select a past job — or browse the table"}
        </span>
      </div>
    );
  }
  const stateForTag = jobState === "paused" ? "cancelled"
                    : jobState === "passed" ? "passed"
                    : jobState === "failed" ? "failed"
                    : jobState === "cancelled" ? "cancelled"
                    : "running";

  // Two-row layout. Row 1 is identity + status + actions; Row 2 is the
  // input string + execution stats. This is the only robust way to fit a
  // job id, a workflow tag, an input, a status, three stat values, and
  // five controls into a header at any viewport width.
  return (
    <div style={{
      flex: 1,
      display: "grid",
      gridTemplateRows: "auto auto",
      rowGap: 2,
      minWidth: 0,
    }}>
      {/* Row 1 — identity + status + actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>

        <button type="button" onClick={onClear} title="back to list"
          style={{
            background: "transparent", border: "none", padding: 0, cursor: "pointer",
            color: "var(--co-text-subtle)",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            flex: "0 0 auto",
            width: 18, height: 18,
          }}>
          <span style={{ display: "inline-block", transform: "rotate(180deg)", lineHeight: 0 }}>
            <Icon name="chevRight" size={14} color="currentColor" />
          </span>
        </button>

        {/* Identity — id is the primary, workflow tag is the secondary */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0, flex: "1 1 auto", overflow: "hidden" }}>
          <span style={{
            fontFamily: "var(--co-font-mono)", fontSize: 13, fontWeight: 600,
            color: "var(--co-text-strong)",
            flex: "0 0 auto",
          }}>{job.id}</span>
          <span style={{
            fontFamily: "var(--co-font-mono)", fontSize: 10,
            padding: "1px 5px", borderRadius: 3,
            background: "var(--co-bg-3)", color: "var(--co-text-muted)",
            border: "1px solid var(--co-border-1)",
            flex: "0 1 auto",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            maxWidth: 180,
          }}>{job.workflow || "pr-reviewer"} · v{job.workflowVersion || 14}</span>
        </div>

        <StatusTag status={stateForTag} />

        {/* Actions — always pinned to the right of row 1 */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, flex: "0 0 auto" }}>
          {mode === "active" && (
            <>
              <Button variant={yamlActive ? "secondary" : "ghost"} size="sm" icon="file" onClick={onYaml}>YAML</Button>
              <JobControls state={jobState} onPlay={onPlay} onPause={onPause} onStop={onStop} onRestart={onRestart} onSnapshot={onSnapshot} />
            </>
          )}
          {mode === "history" && (
            <>
              <Button variant={yamlActive ? "secondary" : "ghost"} size="sm" icon="file" onClick={onYaml}>YAML</Button>
              <Button variant="secondary" size="sm" icon="refresh">rerun</Button>
            </>
          )}
        </div>
      </div>

      {/* Row 2 — input + execution stats. Smaller, mono, single line. */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        fontFamily: "var(--co-font-mono)", fontSize: 11,
        color: "var(--co-text-subtle)",
        minWidth: 0,
        paddingLeft: 24, // align beneath the back arrow + identity
        whiteSpace: "nowrap",
      }}>
        <span style={{ color: "var(--co-text-subtle)" }}>input</span>
        <span style={{
          color: "var(--co-text-muted)",
          minWidth: 0,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>{job.input || "PR #1428"}</span>

        <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10, flex: "0 0 auto" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <Icon name="clock" size={10} color="var(--co-text-subtle)" />
            <span style={{ color: "var(--co-text)", fontVariantNumeric: "tabular-nums" }}>
              {Math.floor(job.elapsedSec/60)}m{String(job.elapsedSec%60).padStart(2,"0")}s
            </span>
          </span>
          <span style={{ color: "var(--co-border-2)" }}>·</span>
          <span style={{ color: "var(--co-text)", fontVariantNumeric: "tabular-nums" }}>
            {(job.tokens/1000).toFixed(1)}k tok
          </span>
          <span style={{ color: "var(--co-border-2)" }}>·</span>
          <span style={{ color: "var(--co-text)", fontVariantNumeric: "tabular-nums" }}>
            ${job.costUsd.toFixed(2)}
          </span>
        </span>
      </div>
    </div>
  );
}

function HistoryListBar({ count }) {
  return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
        <span style={{
          fontFamily: "var(--co-font-display)", fontSize: 15, fontWeight: 600,
          color: "var(--co-text-strong)", letterSpacing: "-0.01em",
        }}>Past jobs</span>
        <span style={{ fontFamily: "var(--co-font-mono)", fontSize: 10, color: "var(--co-text-subtle)" }}>
          {count} runs · last 24h
        </span>
      </div>
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
        <Button variant="ghost" size="sm" icon="refresh">refresh</Button>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────

function TopBar({
  mode, workflow, workflows, activeWfId, onPickWorkflow, job, jobState,
  onPlay, onPause, onStop, onRestart, onSnapshot, onClearJob,
  historyCount, onYaml, yamlActive,
}) {
  // The job header needs two rows to fit identity + stats + actions at any
  // width. Build/list headers only need one — but keep min-height consistent
  // so the canvas position doesn't jump when modes change.
  const isJobView = (mode === "active" && job) || (mode === "history" && job);
  return (
    <header style={{
      minHeight: 56,
      flex: "0 0 auto",
      borderBottom: "1px solid var(--co-border-1)",
      background: "color-mix(in oklab, var(--co-bg-1) 92%, transparent)",
      backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center",
      padding: isJobView ? "8px 14px" : "0 14px",
      position: "relative",
      zIndex: 30,
    }}>
      {mode === "build" && <BuildBar workflow={workflow} workflows={workflows} activeWfId={activeWfId} onPickWorkflow={onPickWorkflow} onYaml={onYaml} yamlActive={yamlActive} />}
      {mode === "active" && (
        <JobBar
          job={job} mode="active" jobState={jobState}
          onPlay={onPlay} onPause={onPause} onStop={onStop} onRestart={onRestart} onSnapshot={onSnapshot}
          onClear={onClearJob} onYaml={onYaml} yamlActive={yamlActive}
        />
      )}
      {mode === "history" && !job && <HistoryListBar count={historyCount} />}
      {mode === "history" && job && (
        <JobBar
          job={job} mode="history" jobState={jobState}
          onPlay={onPlay} onPause={onPause} onStop={onStop} onRestart={onRestart} onSnapshot={onSnapshot}
          onClear={onClearJob} onYaml={onYaml} yamlActive={yamlActive}
        />
      )}
    </header>
  );
}

Object.assign(window, { TopBar, WorkflowSelect });
