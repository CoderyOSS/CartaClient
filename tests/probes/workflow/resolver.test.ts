import { describe, expect } from "bun:test";
import { p } from "@codery/probes";
import { test, createProject, createJob, isRecord } from "../helpers";

describe("workflow resolver", () => {
  test("job config resolves {{input}} in prompt", async () => {
    const projectId = await createProject();
    const jobId = await createJob(projectId, "Add a hello world function", "simple");

    const res = await p.http.send({
      method: "GET",
      path: `/api/v1/jobs/${jobId}/config`,
    });

    expect(res.status).toBe(200);
    if (isRecord(res.body)) {
      expect(typeof res.body["prompt"]).toBe("string");
      const prompt = res.body["prompt"] as string;
      expect(prompt).toContain("Add a hello world function");
    }
  });

  test("job config returns stage and tools", async () => {
    const projectId = await createProject();
    const jobId = await createJob(projectId, "Build feature X", "feature");

    const res = await p.http.send({
      method: "GET",
      path: `/api/v1/jobs/${jobId}/config`,
    });

    expect(res.status).toBe(200);
    if (isRecord(res.body)) {
      expect(typeof res.body["stage"]).toBe("string");
      expect(Array.isArray(res.body["tools"])).toBe(true);
      expect(typeof res.body["max_tokens"]).toBe("number");
      expect(typeof res.body["model"]).toBe("string");
      expect(typeof res.body["provider"]).toBe("string");
    }
  });

  test("job config returns skill content for plan skill", async () => {
    const projectId = await createProject();
    const jobId = await createJob(projectId, "Plan the feature", "simple");

    const res = await p.http.send({
      method: "GET",
      path: `/api/v1/jobs/${jobId}/config`,
    });

    expect(res.status).toBe(200);
    if (isRecord(res.body)) {
      expect(typeof res.body["skill_content"]).toBe("string");
    }
  });
});
