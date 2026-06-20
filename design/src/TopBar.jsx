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

// Coarse-pointer / no-hover detection. On touch we can't rely on :hover to
// reveal row actions, so we keep them always visible there.
function useIsTouch() {
  const [touch, setTouch] = useStateTB(false);
  useEffectTB(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia("(hover: none), (pointer: coarse)");
    const sync = () => setTouch(mq.matches);
    sync();
    mq.addEventListener ? mq.addEventListener("change", sync) : mq.addListener(sync);
    return () => { mq.removeEventListener ? mq.removeEventListener("change", sync) : mq.removeListener(sync); };
  }, []);
  return touch;
}

// Workflow names are mono identifiers — lower-kebab, like `pr-reviewer`.
// Sanitize as the user types so the field can't hold an illegal name.
function sanitizeWfName(s) {
  return String(s).toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "")
    .replace(/-{2,}/g, "-");
}

// Inline name editor — shared by the trigger and the menu rows. Auto-focuses
// and selects, sanitizes live, validates empty + duplicate, and offers an
// explicit check / cancel pair (essential on touch, where blur/Enter is
// invisible). Enter / check commits, Esc / cancel reverts, blur
// commits-if-valid else reverts.
function InlineRename({ initial, siblings, size, onCommit, onCancel }) {
  const [val, setVal] = useStateTB(initial);
  const inputRef = useRefTB(null);
  const committedRef = useRefTB(false);

  useEffectTB(() => {
    const el = inputRef.current;
    if (el) { el.focus(); el.select(); }
  }, []);

  const clean = sanitizeWfName(val).replace(/^-+|-+$/g, "");
  const lower = clean.toLowerCase();
  const dupe = (siblings || []).some(n => n.toLowerCase() === lower);
  const empty = clean.length === 0;
  const invalid = empty || dupe;
  const err = empty ? "name can't be empty" : dupe ? "name already in use" : "";

  const finish = (fn) => { committedRef.current = true; fn(); };
  const commit = () => { if (!invalid) finish(() => onCommit(clean)); };
  const cancel = () => finish(() => onCancel());

  const big = size === "trigger";
  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 5, width: "100%", minWidth: 0 }}>
      <input
        ref={inputRef}
        value={val}
        spellCheck={false}
        autoCapitalize="none"
        autoCorrect="off"
        autoComplete="off"
        inputMode="text"
        aria-label="workflow name"
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") { e.preventDefault(); commit(); }
          else if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); cancel(); }
        }}
        onBlur={() => { if (committedRef.current) return; invalid ? cancel() : commit(); }}
        style={{
          flex: 1, minWidth: 0,
          fontFamily: "var(--co-font-mono)",
          fontSize: big ? 13 : 11.5,
          fontWeight: big ? 600 : 500,
          color: "var(--co-text-strong)",
          background: "var(--co-bg-0)",
          border: "1px solid",
          borderColor: invalid ? "var(--co-danger)" : "var(--co-accent)",
          borderRadius: 6,
          padding: big ? "6px 8px" : "5px 7px",
          outline: "none",
          boxShadow: invalid
            ? "0 0 0 3px color-mix(in oklab, var(--co-danger) 22%, transparent)"
            : "0 0 0 3px color-mix(in oklab, var(--co-accent) 22%, transparent)",
        }}
      />
      <button
        type="button"
        title="save name"
        aria-label="save name"
        onPointerDown={(e) => e.preventDefault()}
        onClick={(e) => { e.stopPropagation(); commit(); }}
        disabled={invalid}
        style={renameIconBtn(true, invalid)}
      >
        <Icon name="check" size={14} color="currentColor" />
      </button>
      <button
        type="button"
        title="cancel"
        aria-label="cancel rename"
        onPointerDown={(e) => e.preventDefault()}
        onClick={(e) => { e.stopPropagation(); cancel(); }}
        style={renameIconBtn(false, false)}
      >
        <span style={{ display: "inline-flex", transform: "rotate(45deg)", lineHeight: 0 }}>
          <Icon name="plus" size={14} color="currentColor" />
        </span>
      </button>
      {invalid && val.trim().length > 0 && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0,
          fontFamily: "var(--co-font-mono)", fontSize: 9.5,
          color: "var(--co-danger)", whiteSpace: "nowrap",
          pointerEvents: "none", zIndex: 2,
        }}>{err}</div>
      )}
    </div>
  );
}

function renameIconBtn(primary, disabled) {
  return {
    flex: "0 0 auto",
    width: 30, height: 30, borderRadius: 7,
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    background: primary ? (disabled ? "var(--co-bg-2)" : "var(--co-accent-soft)") : "var(--co-bg-2)",
    color: primary ? (disabled ? "var(--co-text-disabled)" : "var(--co-accent)") : "var(--co-text-subtle)",
    border: "1px solid",
    borderColor: primary && !disabled ? "color-mix(in oklab, var(--co-accent) 35%, transparent)" : "var(--co-border-1)",
    cursor: disabled ? "not-allowed" : "pointer",
  };
}

function rowActionBtn() {
  return {
    flex: "0 0 auto",
    width: 30, height: 30, borderRadius: 7,
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    background: "var(--co-bg-3)", border: "1px solid var(--co-border-1)",
    color: "var(--co-text-subtle)", cursor: "pointer",
  };
}

function WorkflowMenuRow({ wf, active, editing, touch, siblings, onPick, onStartRename, onRename, onCancelRename, onDelete }) {
  const [hover, setHover] = useStateTB(false);

  if (editing) {
    return (
      <div style={{ padding: "3px 4px" }}>
        <InlineRename
          initial={wf.name}
          siblings={siblings}
          size="row"
          onCommit={(name) => onRename(wf.id, name)}
          onCancel={onCancelRename}
        />
      </div>
    );
  }

  // Actions are always rendered so the row never reflows; on hover-capable
  // pointers they fade in, on touch they stay lit (no hover to depend on).
  const showActions = touch || hover;
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ display: "flex", alignItems: "center", gap: 6, padding: "2px 4px" }}
    >
      <button
        type="button"
        onClick={() => onPick(wf.id)}
        style={{
          flex: 1, minWidth: 0,
          display: "flex", alignItems: "center", gap: 8,
          padding: "5px 6px",
          background: active ? "var(--co-bg-3)" : hover ? "var(--co-bg-2)" : "transparent",
          border: "none", borderRadius: 5,
          textAlign: "left", cursor: "pointer",
          transition: "background 140ms var(--co-ease-out)",
        }}
      >
        <div style={{ minWidth: 0, flex: 1 }}>
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
        {wf.active > 0 && (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 4, flex: "0 0 auto",
            fontFamily: "var(--co-font-mono)", fontSize: 10, color: "var(--co-accent)",
          }}>
            <StatusDot status="running" pulse size={5} />
            {wf.active}
          </span>
        )}
      </button>
      <div style={{
        display: "flex", alignItems: "center", gap: 4, flex: "0 0 auto",
        opacity: showActions ? 1 : 0,
        pointerEvents: showActions ? "auto" : "none",
        transition: "opacity 140ms var(--co-ease-out)",
      }}>
        <button
          type="button"
          title="rename workflow"
          aria-label={`rename ${wf.name}`}
          onClick={(e) => { e.stopPropagation(); onStartRename(wf.id); }}
          style={rowActionBtn()}
        >
          <Icon name="pencil" size={13} color="currentColor" />
        </button>
        <button
          type="button"
          title="delete workflow"
          aria-label={`delete ${wf.name}`}
          onClick={(e) => { e.stopPropagation(); onDelete(wf.id); }}
          style={rowActionBtn()}
        >
          <Icon name="trash" size={13} color="currentColor" />
        </button>
      </div>
    </div>
  );
}

function WorkflowSelect({ workflow, workflows, activeWfId, onPickWorkflow, onRenameWorkflow, onCreateWorkflow, onDeleteWorkflow, defaultOpen }) {
  const [open, setOpen] = useStateTB(!!defaultOpen);
  const [triggerEditing, setTriggerEditing] = useStateTB(false);
  const [editingRowId, setEditingRowId] = useStateTB(null);
  // Local fallback state so the component is fully self-contained when used
  // without handlers (e.g. the handoff doc specimen): renames + deletes +
  // creates still work, they just don't persist past the mount.
  const [localNames, setLocalNames] = useStateTB({});
  const [localHidden, setLocalHidden] = useStateTB(() => new Set());
  const [localExtra, setLocalExtra] = useStateTB([]);
  const ref = useRefTB(null);
  const touch = useIsTouch();

  const editingActive = triggerEditing || editingRowId != null;

  useEffectTB(() => {
    if (!open && !triggerEditing) return;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false); setTriggerEditing(false); setEditingRowId(null);
      }
    };
    const onKey = (e) => {
      // InlineRename owns Escape while editing; only collapse the panel here.
      if (e.key === "Escape" && !triggerEditing && editingRowId == null) setOpen(false);
    };
    document.addEventListener("pointerdown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("pointerdown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open, triggerEditing, editingRowId]);

  // Compose the visible list from props + local fallback overlays.
  const list = [...localExtra, ...(workflows || [])]
    .filter(wf => !localHidden.has(wf.id))
    .map(wf => localNames[wf.id] ? { ...wf, name: localNames[wf.id] } : wf);

  const displayName = localNames[workflow.id] || workflow.name;
  const namesExcept = (id) => list.filter(w => w.id !== id).map(w => w.name);

  const pick = (id) => { onPickWorkflow && onPickWorkflow(id); setOpen(false); };

  const commitRename = (id, name) => {
    if (onRenameWorkflow) onRenameWorkflow(id, name);
    else setLocalNames(m => ({ ...m, [id]: name }));
    setEditingRowId(null);
    setTriggerEditing(false);
  };

  const removeWf = (id) => {
    if (onDeleteWorkflow) onDeleteWorkflow(id);
    else setLocalHidden(h => { const n = new Set(h); n.add(id); return n; });
    if (editingRowId === id) setEditingRowId(null);
  };

  const createWf = () => {
    let id;
    if (onCreateWorkflow) {
      id = onCreateWorkflow();
    } else {
      id = "wf_" + Math.random().toString(36).slice(2, 8);
      setLocalExtra(x => [{ id, name: "untitled-workflow", runs: 0, last: "—", active: 0 }, ...x]);
    }
    // Drop the freshly-created workflow straight into rename — create is name.
    if (id) { setOpen(true); setEditingRowId(id); }
  };

  return (
    <div ref={ref} style={{ position: "relative", flex: "0 0 auto", width: 288 }}>
      {triggerEditing ? (
        <div style={{
          display: "flex", alignItems: "center", width: "100%",
          padding: "5px 6px",
          background: "var(--co-bg-1)",
          border: "1px solid var(--co-accent)",
          borderRadius: 8,
        }}>
          <InlineRename
            initial={displayName}
            siblings={namesExcept(workflow.id)}
            size="trigger"
            onCommit={(name) => commitRename(workflow.id, name)}
            onCancel={() => setTriggerEditing(false)}
          />
        </div>
      ) : (
        <div style={{
          display: "flex", alignItems: "stretch", width: "100%",
          background: "var(--co-bg-1)",
          border: "1px solid", borderColor: open ? "var(--co-accent)" : "var(--co-border-2)",
          borderRadius: 8, overflow: "hidden",
          transition: "border-color 140ms var(--co-ease-out)",
        }}>
          <button
            type="button"
            onClick={() => setOpen(o => !o)}
            onDoubleClick={() => { setOpen(false); setTriggerEditing(true); }}
            title="switch workflow"
            style={{
              flex: 1, minWidth: 0,
              display: "flex", alignItems: "center", gap: 9,
              padding: "8px 10px",
              background: "transparent", border: "none",
              cursor: "pointer",
            }}
          >
            <span style={{
              flex: 1, minWidth: 0,
              fontFamily: "var(--co-font-mono)", fontSize: 13, fontWeight: 600,
              color: "var(--co-text)",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              textAlign: "left",
            }}>{displayName}</span>
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
          <button
            type="button"
            title="rename this workflow"
            aria-label="rename current workflow"
            onClick={(e) => { e.stopPropagation(); setOpen(false); setTriggerEditing(true); }}
            style={{
              flex: "0 0 auto",
              width: 38,
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              background: "transparent",
              border: "none", borderLeft: "1px solid var(--co-border-1)",
              color: "var(--co-text-subtle)", cursor: "pointer",
            }}
          >
            <Icon name="pencil" size={13} color="currentColor" />
          </button>
        </div>
      )}

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
            <Button variant="secondary" size="sm" icon="plus" onClick={createWf}>new</Button>
          </div>
          <div style={{ maxHeight: 340, overflowY: "auto", display: "flex", flexDirection: "column", gap: 1 }}>
            {list.map(wf => (
              <WorkflowMenuRow
                key={wf.id}
                wf={wf}
                active={wf.id === activeWfId}
                editing={editingRowId === wf.id}
                touch={touch}
                siblings={namesExcept(wf.id)}
                onPick={pick}
                onStartRename={(id) => setEditingRowId(id)}
                onRename={commitRename}
                onCancelRename={() => setEditingRowId(null)}
                onDelete={removeWf}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function BuildBar({ workflow, workflows, activeWfId, onPickWorkflow, onRenameWorkflow, onCreateWorkflow, onDeleteWorkflow, onYaml, yamlActive }) {
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
        onRenameWorkflow={onRenameWorkflow}
        onCreateWorkflow={onCreateWorkflow}
        onDeleteWorkflow={onDeleteWorkflow}
      />

      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, flex: "0 0 auto" }}>
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
  mode, workflow, workflows, activeWfId, onPickWorkflow, onRenameWorkflow, onCreateWorkflow, onDeleteWorkflow, job, jobState,
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
      {mode === "build" && <BuildBar workflow={workflow} workflows={workflows} activeWfId={activeWfId} onPickWorkflow={onPickWorkflow} onRenameWorkflow={onRenameWorkflow} onCreateWorkflow={onCreateWorkflow} onDeleteWorkflow={onDeleteWorkflow} onYaml={onYaml} yamlActive={yamlActive} />}
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
