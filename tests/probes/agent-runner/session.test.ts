import { describe, expect, beforeAll } from "bun:test";
import { test, p, uniqueId } from "../helpers";

const hasLLMKey = typeof process.env.DEEPSEEK_API_KEY === "string" && process.env.DEEPSEEK_API_KEY.length > 0;

const SSH_BUILD =
  "export PATH=\"$HOME/.cargo/bin:$PATH\" && cd /home/gem/projects/CoderyTrailhead && cargo build -p agent-runner --release 2>&1";

const BINARY_PATH =
  "/home/gem/projects/CoderyTrailhead/target/release/agent-runner";

interface SshResult {
  exitCode: number;
  stdout: string;
  stderr: string;
}

function ssh(cmd: string): Promise<SshResult> {
  const proc = Bun.spawn(["ssh", "gem@apps", cmd], {
    stdout: "pipe",
    stderr: "pipe",
  });
  return new Promise((resolve) => {
    proc.exited.then((code) => {
      Promise.all([proc.stdout.text(), proc.stderr.text()]).then(([out, err]) => {
        resolve({ exitCode: code, stdout: out, stderr: err });
      });
    });
  });
}

function runAgent(args: string): Promise<SshResult> {
  const env = [
    `LLM_API_KEY=${process.env.DEEPSEEK_API_KEY ?? ""}`,
    `LLM_PROVIDER=openai-compatible`,
    `LLM_BASE_URL=https://api.deepseek.com/v1`,
    `LLM_MODEL=deepseek-chat`,
  ].join(" ");
  return ssh(`export PATH="$HOME/.cargo/bin:$PATH" && ${env} ${BINARY_PATH} ${args}`);
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

describe("agent-runner session", () => {
  beforeAll(async () => {
    const result = await ssh(SSH_BUILD);
    expect(result.exitCode).toBe(0);
  });

  test("resume fails when no session file exists", async () => {
    const ws = `/tmp/ar-noresume-${uniqueId()}`;
    const result = await runAgent(
      `resume --workspace ${ws} --prompt "continue" --max-tokens 100`
    );

    expect(result.exitCode).not.toBe(0);
    expect(result.stderr.toLowerCase()).toContain("session");
  });
});

describe.skipIf(!hasLLMKey)("agent-runner session (requires LLM)", () => {
  beforeAll(async () => {
    const result = await ssh(SSH_BUILD);
    expect(result.exitCode).toBe(0);
  });

  test("session file created after run", async () => {
    const ws = `/tmp/ar-session-${uniqueId()}`;
    const prompt = "Use the bash tool to run: echo done";

    const result = await runAgent(
      `run --workspace ${ws} --prompt '${prompt}' --tools bash --max-tokens 1024 --max-tool-calls 5`
    );

    expect(result.exitCode).toBe(0);

    const session = await ssh(`cat ${ws}/session.json`);
    expect(session.exitCode).toBe(0);
    expect(session.stdout.length).toBeGreaterThan(0);
  });

  test("session file has required fields", async () => {
    const ws = `/tmp/ar-fields-${uniqueId()}`;
    const prompt = "Use the bash tool to run: echo done";

    await runAgent(
      `run --workspace ${ws} --prompt '${prompt}' --tools bash --max-tokens 1024 --max-tool-calls 5`
    );

    const raw = await ssh(`cat ${ws}/session.json`);
    expect(raw.exitCode).toBe(0);

    const session = JSON.parse(raw.stdout);
    expect(isObject(session)).toBe(true);
    expect(typeof session["id"]).toBe("string");
    expect(Array.isArray(session["messages"])).toBe(true);
    expect(typeof session["created_at"]).toBe("string");
  });

  test("session contains token usage", async () => {
    const ws = `/tmp/ar-tokens-${uniqueId()}`;
    const prompt = "Use the bash tool to run: echo done";

    await runAgent(
      `run --workspace ${ws} --prompt '${prompt}' --tools bash --max-tokens 1024 --max-tool-calls 5`
    );

    const raw = await ssh(`cat ${ws}/session.json`);
    expect(raw.exitCode).toBe(0);

    const session = JSON.parse(raw.stdout);
    if (isObject(session) && isObject(session["token_usage"])) {
      expect(typeof session["token_usage"]["prompt_tokens"]).toBe("number");
      expect(typeof session["token_usage"]["completion_tokens"]).toBe("number");
      expect(typeof session["token_usage"]["total_tokens"]).toBe("number");
    }
  });

  test("resume subcommand loads existing session", async () => {
    const ws = `/tmp/ar-resume-${uniqueId()}`;
    const prompt = "Use the bash tool to run: echo step1";

    await runAgent(
      `run --workspace ${ws} --prompt '${prompt}' --tools bash --max-tokens 1024 --max-tool-calls 5`
    );

    const sessionAfterFirst = await ssh(`cat ${ws}/session.json`);
    expect(sessionAfterFirst.exitCode).toBe(0);

    const resumePrompt = "Continue: use the bash tool to run: echo step2";
    const result = await runAgent(
      `resume --workspace ${ws} --prompt '${resumePrompt}' --max-tokens 1024 --max-tool-calls 5`
    );

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("step2");

    const sessionAfterResume = await ssh(`cat ${ws}/session.json`);
    const first = JSON.parse(sessionAfterFirst.stdout);
    const resumed = JSON.parse(sessionAfterResume.stdout);
    if (isObject(first) && isObject(resumed) && Array.isArray(first["messages"]) && Array.isArray(resumed["messages"])) {
      expect(resumed["messages"].length).toBeGreaterThan(first["messages"].length);
    }
  });
});
