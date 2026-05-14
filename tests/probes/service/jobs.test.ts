import { describe, expect } from "bun:test";
import { p } from "@codery/probes";
import { test, createProject, createJob, createWorker, isRecord, getStatus } from "../helpers";

describe("job state machine", () => {
  test("new job is queued", async () => {
    const projectId = await createProject();
    const jobId = await createJob(projectId, "State machine test");

    const res = await p.http.send({
      method: "GET",
      path: `/api/v1/jobs/${jobId}`,
    });
    expect(res.status).toBe(200);
    if (isRecord(res.body)) {
      expect(res.body["status"]).toBe("queued");
    }
  });

  test("running to paused", async () => {
    const projectId = await createProject();
    const jobId = await createJob(projectId, "Pause test");
    const workerId = await createWorker(jobId);

    await p.http.send({
      method: "POST",
      path: `/api/v1/workers/${workerId}/register`,
      body: { job_id: jobId },
    });

    const pauseRes = await p.http.send({
      method: "POST",
      path: `/api/v1/jobs/${jobId}/pause`,
    });
    expect(pauseRes.status).toBe(200);

    const jobRes = await p.http.send({
      method: "GET",
      path: `/api/v1/jobs/${jobId}`,
    });
    if (isRecord(jobRes.body)) {
      expect(jobRes.body["status"]).toBe("paused");
    }
  });

  test("paused to resuming", async () => {
    const projectId = await createProject();
    const jobId = await createJob(projectId, "Resume test");
    const workerId = await createWorker(jobId);

    await p.http.send({
      method: "POST",
      path: `/api/v1/workers/${workerId}/register`,
      body: { job_id: jobId },
    });

    await p.http.send({
      method: "POST",
      path: `/api/v1/jobs/${jobId}/pause`,
    });

    const resumeRes = await p.http.send({
      method: "POST",
      path: `/api/v1/jobs/${jobId}/resume`,
    });
    expect(resumeRes.status).toBe(200);

    const jobRes = await p.http.send({
      method: "GET",
      path: `/api/v1/jobs/${jobId}`,
    });
    if (isRecord(jobRes.body)) {
      expect(jobRes.body["status"]).toBe("resuming");
    }
  });

  test("running to completed", async () => {
    const projectId = await createProject();
    const jobId = await createJob(projectId, "Complete test");
    const workerId = await createWorker(jobId);

    await p.http.send({
      method: "POST",
      path: `/api/v1/workers/${workerId}/register`,
      body: { job_id: jobId },
    });

    await p.http.send({
      method: "POST",
      path: `/api/v1/workers/${workerId}/complete`,
      body: { result: "success" },
    });

    const jobRes = await p.http.send({
      method: "GET",
      path: `/api/v1/jobs/${jobId}`,
    });
    if (isRecord(jobRes.body)) {
      expect(jobRes.body["status"]).toBe("completed");
    }
  });

  test("running to failed_retryable on first attempt", async () => {
    const projectId = await createProject();
    const jobId = await createJob(projectId, "Fail test");
    const workerId = await createWorker(jobId);

    await p.http.send({
      method: "POST",
      path: `/api/v1/workers/${workerId}/register`,
      body: { job_id: jobId },
    });

    await p.http.send({
      method: "POST",
      path: `/api/v1/workers/${workerId}/fail`,
      body: { error: "transient failure" },
    });

    const jobRes = await p.http.send({
      method: "GET",
      path: `/api/v1/jobs/${jobId}`,
    });
    if (isRecord(jobRes.body)) {
      expect(jobRes.body["status"]).toBe("failed_retryable");
    }
  });

  test("cannot resume completed job", async () => {
    const projectId = await createProject();
    const jobId = await createJob(projectId, "Terminal test");
    const workerId = await createWorker(jobId);

    await p.http.send({
      method: "POST",
      path: `/api/v1/workers/${workerId}/register`,
      body: { job_id: jobId },
    });

    await p.http.send({
      method: "POST",
      path: `/api/v1/workers/${workerId}/complete`,
      body: { result: "done" },
    });

    const res = await p.http.send({
      method: "POST",
      path: `/api/v1/jobs/${jobId}/resume`,
    });

    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  test("cancel from queued state", async () => {
    const projectId = await createProject();
    const jobId = await createJob(projectId, "Cancel queued");

    const cancelRes = await p.http.send({
      method: "POST",
      path: `/api/v1/jobs/${jobId}/cancel`,
    });
    expect(cancelRes.status).toBe(200);

    const jobRes = await p.http.send({
      method: "GET",
      path: `/api/v1/jobs/${jobId}`,
    });
    if (isRecord(jobRes.body)) {
      expect(jobRes.body["status"]).toBe("cancelled");
    }
  });

  test("cancel from running state", async () => {
    const projectId = await createProject();
    const jobId = await createJob(projectId, "Cancel running");
    const workerId = await createWorker(jobId);

    await p.http.send({
      method: "POST",
      path: `/api/v1/workers/${workerId}/register`,
      body: { job_id: jobId },
    });

    const cancelRes = await p.http.send({
      method: "POST",
      path: `/api/v1/jobs/${jobId}/cancel`,
    });
    expect(cancelRes.status).toBe(200);

    const jobRes = await p.http.send({
      method: "GET",
      path: `/api/v1/jobs/${jobId}`,
    });
    if (isRecord(jobRes.body)) {
      expect(jobRes.body["status"]).toBe("cancelled");
    }
  });
});
