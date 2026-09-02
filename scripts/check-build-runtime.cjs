const os = require("node:os");
const v8 = require("node:v8");

const nativeCompilers = [
  "@next/swc-linux-x64-gnu",
  "@next/swc-linux-x64-musl",
];

console.log(`Node: ${process.version}`);
console.log(`Platform: ${process.platform} ${process.arch}`);
console.log(`NODE_OPTIONS: ${process.env.NODE_OPTIONS || "not set"}`);
console.log(`V8 heap limit: ${Math.round(v8.getHeapStatistics().heap_size_limit / 1024 / 1024)} MB`);
console.log(`Process RSS: ${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`);
console.log(`Visible system memory: ${Math.round(os.totalmem() / 1024 / 1024)} MB`);

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
