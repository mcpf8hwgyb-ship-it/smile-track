// Local static-export preview only; this is not a production application server.
import { createServer } from "node:http";
import { readFile, realpath, stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import { fileURLToPath, URL } from "node:url";

const root = await realpath(fileURLToPath(new URL("../out", import.meta.url)));
await stat(resolve(root, "index.html")); // Fail clearly if no export exists.
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};
const server = createServer(async (request, response) => {
  if (!["GET", "HEAD"].includes(request.method)) {
    response.writeHead(405, { Allow: "GET, HEAD" }).end();
    return;
  }
  try {
    const pathname = decodeURIComponent(new URL(request.url, "http://127.0.0.1").pathname);
    let path = resolve(root, `.${pathname}`);
    if ((await stat(path)).isDirectory()) path = resolve(path, "index.html");
    path = await realpath(path);
    if (!path.startsWith(`${root}${sep}`)) throw new Error("Outside export");
    const body = await readFile(path);
    response.writeHead(200, {
      "Content-Type": types[extname(path)] ?? "application/octet-stream",
      "Content-Length": body.length,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    });
    response.end(request.method === "HEAD" ? undefined : body);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain" }).end("Not found");
  }
});
server.listen(4173, "127.0.0.1", () => process.stdout.write("Static preview: http://127.0.0.1:4173\n"));
