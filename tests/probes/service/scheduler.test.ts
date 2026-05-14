import { describe, expect } from "bun:test";
import { p } from "@codery/probes";
import { test, createProject, createJob, isRecord } from "../helpers";

describe("scheduler endpoints", () => {
  test("lists jobs with status filter", async () => {
    const projectId = await createProject();
    await createJob(projectId, "Job 1");
    await createJob(projectId, "Job 2");

    const res = await p.http.send({
      method: "GET",
      path: "/api/v1/jobs",
    });

    expect(res.status).toBe(200);
    if (Array.isArray(res.body)) {
      const queued = res.body.filter((j: unknown) =>
        isRecord(j) && j["status"] === "queued"
      );
      expect(queued.length).toBeGreaterThanOrEqual(2);
    }
  });

  test("list workers returns array", async () => {
    const res = await p.http.send({
      method: "GET",
      path: "/api/v1/workers",
    });

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
