const fs = require("node:fs");
const os = require("node:os");
const v8 = require("node:v8");

const report = process.report?.getReport();
const usesGlibc = Boolean(report?.header?.glibcVersionRuntime);
const nativeCompilers = process.platform === "linux"
  ? [usesGlibc ? "@next/swc-linux-x64-gnu" : "@next/swc-linux-x64-musl"]
  : [];

function readLinuxValue(path) {
  try {
    return fs.readFileSync(path, "utf8").trim();
  } catch {
    return null;
  }
}

console.log(`Node: ${process.version}`);
console.log(`Platform: ${process.platform} ${process.arch}`);
console.log(`NODE_OPTIONS: ${process.env.NODE_OPTIONS || "not set"}`);
console.log(`V8 heap limit: ${Math.round(v8.getHeapStatistics().heap_size_limit / 1024 / 1024)} MB`);
console.log(`Process RSS: ${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`);
console.log(`Visible system memory: ${Math.round(os.totalmem() / 1024 / 1024)} MB`);

if (process.platform === "linux") {
  console.log(`Linux libc: ${usesGlibc ? `glibc ${report.header.glibcVersionRuntime}` : "musl or unknown"}`);

  const limits = readLinuxValue("/proc/self/limits");
  if (limits) {
    const relevantLimits = limits
      .split("\n")
      .filter((line) => /Max (data size|resident set|address space|processes)/.test(line));
    console.log("Relevant process limits:");
    console.log(relevantLimits.join("\n"));
  }

  const cgroupMemoryLimit = readLinuxValue("/sys/fs/cgroup/memory.max")
    ?? readLinuxValue("/sys/fs/cgroup/memory/memory.limit_in_bytes");
  const cgroupMemoryCurrent = readLinuxValue("/sys/fs/cgroup/memory.current")
    ?? readLinuxValue("/sys/fs/cgroup/memory/memory.usage_in_bytes");
  console.log(`Cgroup memory limit: ${cgroupMemoryLimit ?? "not exposed"}`);
  console.log(`Cgroup memory current: ${cgroupMemoryCurrent ?? "not exposed"}`);
}

for (const packageName of nativeCompilers) {
  try {
    require(packageName);
    console.log(`${packageName}: loaded`);
  } catch (error) {
    const code = error && typeof error === "object" && "code" in error
      ? error.code
      : error?.name ?? "unknown";
    const message = String(error?.message ?? error).split("\n")[0];
    console.log(`${packageName}: failed (${code}) ${message}`);
  }
}

async function checkWebAssembly() {
  try {
    const emptyModule = new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0]);
    await WebAssembly.instantiate(emptyModule);
    console.log("WebAssembly: available");
  } catch (error) {
    console.log(`WebAssembly: failed (${error?.name ?? "unknown"}) ${error?.message ?? error}`);
  }
}

checkWebAssembly();
