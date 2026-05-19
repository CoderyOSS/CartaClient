# Update Trailhead E2E Test Suite for Probes Fixture API

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update Trailhead E2E tests to use the new Probes framework `fixture()` API instead of the deprecated `put()` methods.

**Architecture:** The Probes framework v0.3.0 introduced `fixture()` as the canonical method for seeding data across HTTP, SQL, and FS interfaces. The old `put()` methods are deprecated. Tests must migrate to `fixture()` to align with framework requirements and ensure compatibility with future versions.

**Tech Stack:** TypeScript, Bun test runtime, @codery/probes v0.3.0

---

## Background: Probes API Changes

The Probes framework REQUIREMENTS.md (section 16) defines the target API:

| Interface | Old Method | New Method |
|-----------|-----------|-----------|
| SQL | `p.sql.put({ file, table, rows })` | `p.sql.fixture({ file, table, rows, force_schema? })` |
| HTTP | `p.http.put({ status, body })` | `p.http.fixture({ status, body })` |
| FS | `p.fs.put({ path, content })` | `p.fs.fixture({ path, content })` |

**Note:** The Trailhead E2E suite only uses SQL fixturing (no HTTP server or FS mocking), so only `p.sql.fixture()` changes are needed.

**Current usage in `helpers.ts`:**
- Line 12: `await p.sql.put({ file: "fixtures/seed.yaml" })`
- Line 33: `await p.sql.put({ table: "projects", rows: [...] })`
- Line 73: `await p.sql.put({ table: "jobs", rows: [...] })`

---

### Task 1: Update helpers.ts to use p.sql.fixture()

**Files:**
- Modify: `tests/probes/helpers.ts:12`
- Modify: `tests/probes/helpers.ts:33`
- Modify: `tests/probes/helpers.ts:73`

**Context:** The `helpers.ts` file exports helper functions used by all integration tests. Three calls to `p.sql.put()` must be renamed to `p.sql.fixture()`. The API is identical—only the method name changes.

- [ ] **Step 1: Read helpers.ts to understand current structure**

Run: `cat tests/probes/helpers.ts`

Expected: File contains `beforeEach` hook with `p.sql.put({ file: "fixtures/seed.yaml" })` and helper functions using `p.sql.put()` for direct table seeding.

- [ ] **Step 2: Replace p.sql.put() with p.sql.fixture() on line 12**

Edit the `beforeEach` hook in `helpers.ts`:

```typescript
// Before
await p.sql.put({ file: "fixtures/seed.yaml" });

// After
await p.sql.fixture({ file: "fixtures/seed.yaml" });
```

- [ ] **Step 3: Replace p.sql.put() with p.sql.fixture() on line 33 in seedProject()**

Edit the `seedProject()` function:

```typescript
// Before
await p.sql.put({
  table: "projects",
  rows: [{
    id,
    repo_url: `https://github.com/test/${id}`,
    branch: "main",
    created_at: now,
    updated_at: now,
  }],
});

// After
await p.sql.fixture({
  table: "projects",
  rows: [{
    id,
    repo_url: `https://github.com/test/${id}`,
    branch: "main",
    created_at: now,
    updated_at: now,
  }],
});
```

- [ ] **Step 4: Replace p.sql.put() with p.sql.fixture() on line 73 in createJobWithStatus()**

Edit the `createJobWithStatus()` function:

```typescript
// Before
await p.sql.put({
  table: "jobs",
  rows: [{
    id,
    project_id: projectId,
    description,
    status,
    workflow_name: workflow ?? null,
    stage_history: "[]",
    attempt: 1,
    max_attempts: 3,
    created_at: now,
    updated_at: now,
  }],
});

// After
await p.sql.fixture({
  table: "jobs",
  rows: [{
    id,
    project_id: projectId,
    description,
    status,
    workflow_name: workflow ?? null,
    stage_history: "[]",
    attempt: 1,
    max_attempts: 3,
    created_at: now,
    updated_at: now,
  }],
});
```

- [ ] **Step 5: Verify no other p.sql.put() calls remain**

Run: `grep -rn "\.sql\.put\|\.sql\.fixture" tests/probes --include="*.ts"`

Expected: Only `p.sql.fixture()` calls found. No `p.sql.put()` remains.

- [ ] **Step 6: Commit**

```bash
git add tests/probes/helpers.ts
git commit -m "test(e2e): migrate from p.sql.put() to p.sql.fixture()

Aligns with Probes framework v0.3.0 API requirements.
The fixture() method is the canonical interface for seeding data.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Run tests to verify migration

**Files:**
- Test: `tests/probes/integration/hello-world.test.ts`
- Test: `tests/probes/integration/full-job.test.ts`
- Test: `tests/probes/service/*.test.ts`
- Test: `tests/probes/workflow/*.test.ts`

- [ ] **Step 1: Ensure test environment is ready**

Run: `cd tests/probes && bun install`

Expected: Dependencies installed, no errors.

- [ ] **Step 2: Run integration tests**

Run: `cd tests/probes && bun test integration/`

Expected: All tests pass. Output shows proof records generated.

- [ ] **Step 3: Run service tests**

Run: `cd tests/probes && bun test service/`

Expected: All tests pass.

- [ ] **Step 4: Run workflow tests**

Run: `cd tests/probes && bun test workflow/`

Expected: All tests pass.

- [ ] **Step 5: Verify proof records are generated**

Run: `ls -la tests/probes/proof-records.md && head -50 tests/probes/proof-records.md`

Expected: `proof-records.md` exists and contains properly formatted proof events with "sql:fixture" entries.

- [ ] **Step 6: Run full test suite**

Run: `cd tests/probes && bun test`

Expected: All tests pass. No "put is not defined" errors.

- [ ] **Step 7: Commit proof records (if generated)**

```bash
git add tests/probes/proof-records.md
git commit -m "test(e2e): update proof records after fixture() migration"
```

---

### Task 3: Verify no deprecated API usage remains

**Files:**
- Search: All TypeScript files in `tests/probes/`

- [ ] **Step 1: Search for any remaining .put() calls on probes interfaces**

Run: `grep -rn "\.\(http\|sql\|fs\|tcp\|ws\|unix\)\.put\|p\.\(http\|sql\|fs\)\.put" tests/probes --include="*.ts" || echo "No matches found"`

Expected: No matches found (grep exits with code 1 and prints "No matches found").

- [ ] **Step 2: Verify all fixture() calls are correct**

Run: `grep -rn "\.fixture(" tests/probes --include="*.ts"`

Expected: Three `p.sql.fixture()` calls in `helpers.ts` at lines 12, 33, 73.

- [ ] **Step 3: Check for any direct Probes instantiation that bypasses the global p**

Run: `grep -rn "from \"@codery/probes\"" tests/probes --include="*.ts"`

Expected: Only `{ p }` is imported. No `probes()`, `probesSession()`, or `group()` imports.

- [ ] **Step 4: Final commit if any cleanup needed**

If any deprecated patterns found, fix and commit.

---

## Self-Review Checklist

**Spec coverage:**
- ✅ All `p.sql.put()` calls renamed to `p.sql.fixture()`
- ✅ API usage matches Probes v0.3.0 requirements
- ✅ Tests verify functionality after migration

**Placeholder scan:**
- ✅ No "TBD" or "TODO" in plan
- ✅ All code steps include exact code
- ✅ All commands include expected output

**Type consistency:**
- ✅ `fixture()` method name used consistently
- ✅ All `fixture()` calls maintain the same parameter structure as the old `put()` calls

---

## Execution Notes

The `fixture()` API is identical to `put()`—only the method name changes. No parameter结构调整 is needed. The Probes framework internally routes `fixture()` to the same implementation that `put()` used, maintaining backward compatibility during the deprecation period.

Key difference per REQUIREMENTS.md:
- `fixture()` implies "test data setup" semantic
- `put()` was generic and could be confused with HTTP PUT

This semantic clarity helps AI agents understand when to use each method.
