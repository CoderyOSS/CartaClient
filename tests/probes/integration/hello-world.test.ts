import { describe, expect, beforeAll } from "bun:test";
import { p } from "@codery/probes";
import { test, createProject, createJob, isRecord, uniqueId } from "../helpers";

describe("hello-world pipeline", () => {
  let projectId: string;
  let jobId: string;

  beforeAll(async () => {
    projectId = await createProject();
    jobId = await createJob(projectId, "Hello world test", "hello-world");
  });

  test("creates a job with hello-world workflow", async () => {
    const res = await p.http.send({
      method: "GET",
      path: `/api/v1/jobs/${jobId}`,
    });
    expect(res.status).toBe(200);
    if (isRecord(res.body)) {
      expect(res.body["workflow_name"]).toBe("hello-world");
    }
  });

  test("job config returns resolved workflow stage", async () => {
    const res = await p.http.send({
      method: "GET",
      path: `/api/v1/jobs/${jobId}/config`,
    });
    expect(res.status).toBe(200);
    if (isRecord(res.body)) {
      expect(typeof res.body["prompt"]).toBe("string");
      expect(typeof res.body["max_tokens"]).toBe("number");
      expect(typeof res.body["model"]).toBe("string");
      expect(typeof res.body["provider"]).toBe("string");
      expect(typeof res.body["api_key"]).toBe("string");
    }
  });
});
