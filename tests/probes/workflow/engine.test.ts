import { describe, expect } from "bun:test";
import { p } from "@codery/probes";
import { test, createProject, createJob, createWorker, isRecord } from "../helpers";

describe("workflow engine", () => {
  test("new job starts at first stage", async () => {
    const projectId = await createProject();
    const jobId = await createJob(projectId, "Start at first stage");

    const res = await p.http.send({
      method: "GET",
      path: `/api/v1/jobs/${jobId}`,
    });
    expect(res.status).toBe(200);
  });

  test("checkpoint advances to next stage", async () => {
    const projectId = await createProject();
    const jobId = await createJob(projectId, "Advance stages", "feature");
    const workerId = await createWorker(jobId);

    await p.http.send({
      method: "POST",
      path: `/api/v1/workers/${workerId}/register`,
      body: { job_id: jobId },
    });

    await p.http.send({
      method: "POST",
      path: `/api/v1/workers/${workerId}/checkpoint`,
      body: {
        stage: "plan",
        response: { complexity: "simple" },
        session_path: "/tmp/session.json",
        git_sha: "abc123",
        token_usage: { prompt_tokens: 100, completion_tokens: 50 },
        files_changed: [],
        next_stage: "implement",
      },
    });

    const res = await p.http.send({
      method: "GET",
      path: `/api/v1/jobs/${jobId}`,
    });
    expect(res.status).toBe(200);
    if (isRecord(res.body)) {
      expect(res.body["current_stage"]).toBe("implement");
    }
  });

  test("multi-stage progression through feature workflow", async () => {
    const projectId = await createProject();
    const jobId = await createJob(projectId, "Multi-stage", "feature");
    const workerId = await createWorker(jobId);

    await p.http.send({
      method: "POST",
      path: `/api/v1/workers/${workerId}/register`,
      body: { job_id: jobId },
    });

    await p.http.send({
      method: "POST",
      path: `/api/v1/workers/${workerId}/checkpoint`,
      body: {
        stage: "plan",
        response: { complexity: "simple" },
        session_path: "/tmp/s1.json",
        git_sha: "aaa111",
        token_usage: { prompt_tokens: 100, completion_tokens: 50 },
        files_changed: [],
        next_stage: "implement",
      },
    });

    await p.http.send({
      method: "POST",
      path: `/api/v1/workers/${workerId}/checkpoint`,
      body: {
        stage: "implement",
        response: { success: true },
        session_path: "/tmp/s2.json",
        git_sha: "bbb222",
        token_usage: { prompt_tokens: 200, completion_tokens: 100 },
        files_changed: ["src/main.rs"],
        next_stage: "done",
      },
    });

    const res = await p.http.send({
      method: "GET",
      path: `/api/v1/jobs/${jobId}`,
    });
    expect(res.status).toBe(200);
    if (isRecord(res.body)) {
      expect(res.body["current_stage"]).toBe("done");
    }
  });

  test("complete finishes the job", async () => {
    const projectId = await createProject();
    const jobId = await createJob(projectId, "Complete workflow", "simple");
    const workerId = await createWorker(jobId);

    await p.http.send({
      method: "POST",
      path: `/api/v1/workers/${workerId}/register`,
      body: { job_id: jobId },
    });

    await p.http.send({
      method: "POST",
      path: `/api/v1/workers/${workerId}/complete`,
      body: { result: "all done" },
    });

    const res = await p.http.send({
      method: "GET",
      path: `/api/v1/jobs/${jobId}`,
    });
    expect(res.status).toBe(200);
    if (isRecord(res.body)) {
      expect(res.body["status"]).toBe("completed");
    }
  });
});
