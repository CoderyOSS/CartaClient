import { describe, expect } from "bun:test";
import { p } from "@codery/probes";
import { test, setupRunningJob, isRecord } from "../helpers";

describe("worker HTTP API", () => {
  test("worker register sets job to running", async () => {
    const { workerId, jobId } = await setupRunningJob();

    const res = await p.http.send({
      method: "GET",
      path: `/api/v1/jobs/${jobId}`,
    });
    expect(res.status).toBe(200);
    if (isRecord(res.body)) {
      expect(res.body["status"]).toBe("running");
    }
  });

  test("worker heartbeat succeeds", async () => {
    const { workerId } = await setupRunningJob();

    const res = await p.http.send({
      method: "POST",
      path: `/api/v1/workers/${workerId}/heartbeat`,
      body: {
        status: "running",
        current_stage: "plan",
        token_usage: { prompt_tokens: 500, completion_tokens: 200 },
        files_changed: 0,
        tool_calls_made: 5,
        message: "working",
      },
    });

    expect(res.status).toBe(200);
  });

  test("worker checkpoint saves stage data", async () => {
    const { workerId, jobId } = await setupRunningJob();

    const res = await p.http.send({
      method: "POST",
      path: `/api/v1/workers/${workerId}/checkpoint`,
      body: {
        stage: "plan",
        response: { complexity: "simple" },
        session_path: "/tmp/session.json",
        git_sha: "def456",
        token_usage: { prompt_tokens: 100, completion_tokens: 50 },
        files_changed: ["src/lib.rs"],
        next_stage: "implement",
      },
    });

    expect(res.status).toBe(200);
  });

  test("worker complete marks job completed", async () => {
    const { workerId, jobId } = await setupRunningJob();

    const res = await p.http.send({
      method: "POST",
      path: `/api/v1/workers/${workerId}/complete`,
      body: { result: "success" },
    });

    expect(res.status).toBe(200);

    const jobRes = await p.http.send({
      method: "GET",
      path: `/api/v1/jobs/${jobId}`,
    });
    if (isRecord(jobRes.body)) {
      expect(jobRes.body["status"]).toBe("completed");
    }
  });

  test("worker fail marks job failed_retryable on first attempt", async () => {
    const { workerId, jobId } = await setupRunningJob();

    const res = await p.http.send({
      method: "POST",
      path: `/api/v1/workers/${workerId}/fail`,
      body: { error: "build failed" },
    });

    expect(res.status).toBe(200);

    const jobRes = await p.http.send({
      method: "GET",
      path: `/api/v1/jobs/${jobId}`,
    });
    if (isRecord(jobRes.body)) {
      expect(jobRes.body["status"]).toBe("failed_retryable");
    }
  });

  test("get job config returns resolved stage info", async () => {
    const { jobId } = await setupRunningJob();

    const res = await p.http.send({
      method: "GET",
      path: `/api/v1/jobs/${jobId}/config`,
    });

    expect(res.status).toBe(200);
    if (isRecord(res.body)) {
      expect(typeof res.body["stage"]).toBe("string");
      expect(typeof res.body["prompt"]).toBe("string");
      expect(Array.isArray(res.body["tools"])).toBe(true);
      expect(typeof res.body["max_tokens"]).toBe("number");
      expect(typeof res.body["model"]).toBe("string");
      expect(typeof res.body["provider"]).toBe("string");
      expect(typeof res.body["base_url"]).toBe("string");
      expect(typeof res.body["api_key"]).toBe("string");
    }
  });

  test("get skill content returns markdown", async () => {
    const { jobId } = await setupRunningJob();

    const res = await p.http.send({
      method: "GET",
      path: `/api/v1/jobs/${jobId}/skill/plan`,
    });

    expect(res.status).toBe(200);
    if (isRecord(res.body)) {
      expect(typeof res.body["content"]).toBe("string");
      expect(res.body["content"].length).toBeGreaterThan(0);
    }
  });

  test("unknown worker returns 404", async () => {
    const res = await p.http.send({
      method: "POST",
      path: "/api/v1/workers/nonexistent-id/register",
      body: { job_id: "fake-job" },
    });

    expect(res.status).toBe(404);
  });
});
