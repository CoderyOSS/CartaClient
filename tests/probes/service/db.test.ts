import { describe, expect } from "bun:test";
import { p } from "@codery/probes";
import { test, createProject, createJob, createWorker, isRecord } from "../helpers";

describe("database operations", () => {
  test("creates project and retrieves it", async () => {
    const projectId = await createProject();

    const res = await p.http.send({
      method: "GET",
      path: `/api/v1/projects`,
    });

    expect(res.status).toBe(200);
    if (Array.isArray(res.body)) {
      const found = res.body.some((r: unknown) =>
        isRecord(r) && r["id"] === projectId
      );
      expect(found).toBe(true);
    }
  });

  test("creates job linked to project", async () => {
    const projectId = await createProject();
    const jobId = await createJob(projectId, "DB test job");

    const res = await p.http.send({
      method: "GET",
      path: `/api/v1/jobs/${jobId}`,
    });

    expect(res.status).toBe(200);
    if (isRecord(res.body)) {
      expect(res.body["project_id"]).toBe(projectId);
      expect(res.body["description"]).toBe("DB test job");
      expect(res.body["status"]).toBe("queued");
    }
  });

  test("stores checkpoint for job", async () => {
    const projectId = await createProject();
    const jobId = await createJob(projectId, "Checkpoint test");
    const workerId = await createWorker(jobId);

    await p.http.send({
      method: "POST",
      path: `/api/v1/workers/${workerId}/register`,
      body: { job_id: jobId },
    });

    const res = await p.http.send({
      method: "POST",
      path: `/api/v1/workers/${workerId}/checkpoint`,
      body: {
        stage: "plan",
        response: { complexity: "simple" },
        session_path: "/tmp/session.json",
        git_sha: "abc123",
        token_usage: { prompt_tokens: 100, completion_tokens: 50 },
        files_changed: ["src/main.rs"],
        next_stage: "done",
      },
    });

    expect(res.status).toBe(200);

    const jobRes = await p.http.send({
      method: "GET",
      path: `/api/v1/jobs/${jobId}`,
    });
    if (isRecord(jobRes.body)) {
      expect(jobRes.body["current_stage"]).toBe("done");
    }
  });

  test("tracks worker heartbeat", async () => {
    const projectId = await createProject();
    const jobId = await createJob(projectId, "Heartbeat test");
    const workerId = await createWorker(jobId);

    await p.http.send({
      method: "POST",
      path: `/api/v1/workers/${workerId}/register`,
      body: { job_id: jobId },
    });

    const hbRes = await p.http.send({
      method: "POST",
      path: `/api/v1/workers/${workerId}/heartbeat`,
      body: {
        status: "running",
        current_stage: "plan",
        token_usage: { prompt_tokens: 100, completion_tokens: 50 },
        files_changed: 0,
        tool_calls_made: 3,
        message: "working",
      },
    });

    expect(hbRes.status).toBe(200);
  });
});
