import { test as bunTest, afterAll } from "bun:test";
import { p } from "@codery/probes";

export { p };

afterAll(() => {
  p.proof.save();
});

export const test = (name: string, fn: () => Promise<void> | void) => {
  bunTest(name, async () => {
    p.proof.begin(name);
    try { await fn(); } finally { p.proof.end(); }
  });
};

export function uniqueId(): string {
  return `test-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function createProject(): Promise<string> {
  const res = await p.http.send({
    method: "POST",
    path: "/api/v1/projects",
    body: { name: uniqueId(), repo_url: "https://github.com/test/e2e" },
  });
  if (isRecord(res.body) && typeof res.body["project_id"] === "string") {
    return res.body["project_id"];
  }
  throw new Error(`createProject failed: ${JSON.stringify(res.body)}`);
}

export async function createJob(projectId: string, description: string, workflow?: string): Promise<string> {
  const res = await p.http.send({
    method: "POST",
    path: "/api/v1/jobs",
    body: { project_id: projectId, description, workflow },
  });
  if (isRecord(res.body) && typeof res.body["job_id"] === "string") {
    return res.body["job_id"];
  }
  throw new Error(`createJob failed: ${JSON.stringify(res.body)}`);
}

export async function createWorker(jobId: string): Promise<string> {
  const res = await p.http.send({
    method: "POST",
    path: "/api/v1/workers",
    body: { job_id: jobId, provider: "test" },
  });
  if (isRecord(res.body) && typeof res.body["worker_id"] === "string") {
    return res.body["worker_id"];
  }
  throw new Error(`createWorker failed: ${JSON.stringify(res.body)}`);
}

export async function setupRunningJob(): Promise<{ projectId: string; jobId: string; workerId: string }> {
  const projectId = await createProject();
  const jobId = await createJob(projectId, "E2E test job");
  const workerId = await createWorker(jobId);
  await p.http.send({
    method: "POST",
    path: `/api/v1/workers/${workerId}/register`,
    body: { job_id: jobId },
  });
  return { projectId, jobId, workerId };
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function getStatus(job: unknown): string {
  if (isRecord(job) && typeof job["status"] === "string") {
    return job["status"];
  }
  return "";
}
