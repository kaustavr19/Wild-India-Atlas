import { spawn } from "node:child_process";
import { join } from "node:path";
import process from "node:process";

const PRODUCTION_FLAG = "--production-server";
const forwardedArgs = process.argv.slice(2).filter((argument) => argument !== PRODUCTION_FLAG);
const useProductionServer = process.argv.includes(PRODUCTION_FLAG) || process.env.PLAYWRIGHT_USE_PRODUCTION === "1";
const externalBaseUrl = process.env.PLAYWRIGHT_BASE_URL;
const host = "127.0.0.1";
const port = process.env.PLAYWRIGHT_PORT ?? "3210";
const localBaseUrl = `http://${host}:${port}`;
const root = process.cwd();

function runPlaywright(baseUrl) {
  const cli = join(root, "node_modules", "@playwright", "test", "cli.js");
  return spawn(process.execPath, [cli, "test", ...forwardedArgs], {
    cwd: root,
    env: { ...process.env, PLAYWRIGHT_BASE_URL: baseUrl },
    stdio: "inherit",
    windowsHide: true,
  });
}

async function waitForServer(server) {
  for (let attempt = 0; attempt < 120; attempt++) {
    if (server.exitCode !== null) throw new Error(`Next.js exited before ${localBaseUrl} became ready.`);
    try {
      const response = await fetch(localBaseUrl);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Timed out waiting for ${localBaseUrl}.`);
}

async function waitForExit(child) {
  return new Promise((resolve, reject) => {
    child.once("error", reject);
    child.once("exit", (code, signal) => resolve(code ?? (signal ? 1 : 0)));
  });
}

async function stopServer(server) {
  if (server.exitCode !== null) return;
  server.kill();
  await Promise.race([
    waitForExit(server),
    new Promise((resolve) => setTimeout(resolve, 5_000)),
  ]);
  if (server.exitCode === null) server.kill("SIGKILL");
}

if (externalBaseUrl) {
  const testProcess = runPlaywright(externalBaseUrl);
  process.exitCode = await waitForExit(testProcess);
} else {
  const nextCli = join(root, "node_modules", "next", "dist", "bin", "next");
  const mode = useProductionServer ? "start" : "dev";
  const server = spawn(process.execPath, [nextCli, mode, "--hostname", host, "--port", port], {
    cwd: root,
    env: process.env,
    stdio: "inherit",
    windowsHide: true,
  });

  try {
    await waitForServer(server);
    const testProcess = runPlaywright(localBaseUrl);
    process.exitCode = await waitForExit(testProcess);
  } finally {
    await stopServer(server);
  }
}
