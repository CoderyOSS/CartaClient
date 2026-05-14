import { describe, expect } from "bun:test";
import { p } from "@codery/probes";
import { test, createProject, createJob, createWorker, isRecord, isRecordArray } from "../helpers";

function isRecordArrayVal(value: unknown): value is Record<string, unknown>[] {
  return Array.isArray(value) && value.every(isRecord);
}

describe("dashboard API", () => {
  test("GET /api/v1/jobs returns list", async () => {
    const projectId = await createProject();
    const jobId = await createJob(projectId, "Dashboard test job");

    const res = await p.http.send({
      method: "GET",
      path: "/api/v1/jobs",
    });

    expect(res.status).toBe(200);
    if (Array.isArray(res.body)) {
      const found = res.body.some((j: unknown) =>
        isRecord(j) && j["id"] === jobId
      );
      expect(found).toBe(true);
    }
  });

  test("GET /api/v1/jobs/{id} returns detail", async () => {
    const projectId = await createProject();
    const jobId = await createJob(projectId, "Detail test");

    const res = await p.http.send({
      method: "GET",
      path: `/api/v1/jobs/${jobId}`,
    });

    expect(res.status).toBe(200);
    if (isRecord(res.body)) {
      expect(typeof res.body["id"]).toBe("string");
      expect(typeof res.body["status"]).toBe("string");
      expect(typeof res.body["project_id"]).toBe("string");
      expect(typeof res.body["description"]).toBe("string");
      expect(typeof res.body["created_at"]).toBe("string");
    }
  });

  test("GET /api/v1/workers returns list", async () => {
    const projectId = await createProject();
    const jobId = await createJob(projectId, "Worker list test");
    const workerId = await createWorker(jobId);

    await p.http.send({
      method: "POST",
      path: `/api/v1/workers/${workerId}/register`,
      body: { job_id: jobId },
    });

    const res = await p.http.send({
      method: "GET",
      path: "/api/v1/workers",
    });

    expect(res.status).toBe(200);
    if (Array.isArray(res.body)) {
      const found = res.body.some((w: unknown) =>
        isRecord(w) && w["id"] === workerId
      );
      expect(found).toBe(true);
    }
  });

  test("POST /api/v1/jobs/{id}/pause changes status", async () => {
    const projectId = await createProject();
    const jobId = await createJob(projectId, "Pause via dashboard");
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

    const jobRes = await p.http.send({
      method: "GET",
      path: `/api/v1/jobs/${jobId}`,
    });
    if (isRecord(jobRes.body)) {
      expect(jobRes.body["status"]).toBe("paused");
    }
  });

  test("POST /api/v1/jobs/{id}/cancel changes status", async () => {
    const projectId = await createProject();
    const jobId = await createJob(projectId, "Cancel via dashboard");

    await p.http.send({
      method: "POST",
      path: `/api/v1/jobs/${jobId}/cancel`,
    });

    const jobRes = await p.http.send({
      method: "GET",
      path: `/api/v1/jobs/${jobId}`,
    });
    if (isRecord(jobRes.body)) {
      expect(jobRes.body["status"]).toBe("cancelled");
    }
  });
});
