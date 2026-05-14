import { describe, expect } from "bun:test";
import { p } from "@codery/probes";
import { test, createProject, createJob, createWorker, isRecord } from "../helpers";

describe("full job lifecycle", () => {
  test("create project → create job → register worker → complete", async () => {
    const projectId = await createProject();
    const jobId = await createJob(projectId, "Full lifecycle test");

    const jobRes1 = await p.http.send({
      method: "GET",
      path: `/api/v1/jobs/${jobId}`,
    });
    expect(jobRes1.status).toBe(200);
    if (isRecord(jobRes1.body)) {
      expect(jobRes1.body["status"]).toBe("queued");
    }

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
        tool_calls_made: 1,
        message: "Planning",
      },
    });
    expect(hbRes.status).toBe(200);

    await p.http.send({
      method: "POST",
      path: `/api/v1/workers/${workerId}/checkpoint`,
      body: {
        stage: "plan",
        response: { complexity: "simple" },
        session_path: "/workspace/.codery/session.json",
        git_sha: "abc123",
        token_usage: { prompt_tokens: 100, completion_tokens: 50 },
        files_changed: [],
        next_stage: "done",
      },
    });

    await p.http.send({
      method: "POST",
      path: `/api/v1/workers/${workerId}/complete`,
      body: { result: "Job completed successfully" },
    });

    const finalRes = await p.http.send({
      method: "GET",
      path: `/api/v1/jobs/${jobId}`,
    });
    expect(finalRes.status).toBe(200);
    if (isRecord(finalRes.body)) {
      expect(finalRes.body["status"]).toBe("completed");
    }
  });

  test("lists jobs and workers", async () => {
    const jobsRes = await p.http.send({
      method: "GET",
      path: "/api/v1/jobs",
    });
    expect(jobsRes.status).toBe(200);
    expect(Array.isArray(jobsRes.body)).toBe(true);

    const workersRes = await p.http.send({
      method: "GET",
      path: "/api/v1/workers",
    });
    expect(workersRes.status).toBe(200);
    expect(Array.isArray(workersRes.body)).toBe(true);
  });

  test("validates workflow YAML", async () => {
    const yaml = `
name: test
stages:
  plan:
    skill: plan
    prompt: "Plan: {{input}}"
    tools: [bash]
    routes: null
`;
    const res = await p.http.send({
      method: "POST",
      path: "/api/v1/workflows/validate",
      body: { content: yaml },
    });
    expect(res.status).toBe(200);
  });

  test("rejects invalid workflow YAML", async () => {
    const yaml = "name: bad\nstages: {}\n";
    const res = await p.http.send({
      method: "POST",
      path: "/api/v1/workflows/validate",
      body: { content: yaml },
    });
    if (isRecord(res.body)) {
      expect(res.body["valid"]).toBe(false);
    }
  });
});
