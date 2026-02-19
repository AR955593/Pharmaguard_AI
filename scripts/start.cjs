const { existsSync, readFileSync } = require("node:fs");
const { spawn } = require("node:child_process");

function getBuildOutputMode() {
  const requiredServerFilesPath = ".next/required-server-files.json";
  if (!existsSync(requiredServerFilesPath)) {
    return null;
  }

  try {
    const fileContent = readFileSync(requiredServerFilesPath, "utf8");
    const parsed = JSON.parse(fileContent);
    return parsed?.config?.output ?? null;
  } catch {
    return null;
  }
}

const port = process.env.PORT || "10000";
const outputMode = getBuildOutputMode();
const hasNextBuild = existsSync(".next/BUILD_ID");
const hasStaticExport = existsSync("out/index.html");
const shouldServeStatic = outputMode === "export" || (!hasNextBuild && hasStaticExport);

const cmd = process.execPath;
const args = shouldServeStatic
  ? [require.resolve("serve/build/main.js"), "-s", "out", "-l", port]
  : [require.resolve("next/dist/bin/next"), "start", "-p", port, "-H", "0.0.0.0"];

const child = spawn(cmd, args, {
  stdio: "inherit",
  env: process.env,
});

child.on("exit", (code) => {
  process.exit(code ?? 1);
});
