const { createServer } = require("node:http");
const next = require("next");

const dev = process.env.NODE_ENV === "development";
const port = Number.parseInt(process.env.PORT || "3000", 10);
const hostname = "127.0.0.1";
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((request, response) => handle(request, response)).listen(port, hostname, () => {
    console.log(`Shenacha Fiber is listening on ${hostname}:${port}`);
  });
}).catch((error) => {
  console.error("application_start_failed", error);
  process.exit(1);
});
