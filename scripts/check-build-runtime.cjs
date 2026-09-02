const nativeCompilers = [
  "@next/swc-linux-x64-gnu",
  "@next/swc-linux-x64-musl",
];

console.log(`Node: ${process.version}`);
console.log(`Platform: ${process.platform} ${process.arch}`);

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
