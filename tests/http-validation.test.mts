import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { once } from "node:events";
import { createServer } from "node:net";
import { join } from "node:path";
import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import { after, before, test } from "node:test";

const cwd = process.cwd();
let serverProcess: ChildProcessWithoutNullStreams | undefined;
let serverLogs = "";
let baseUrl = "";

before(async () => {
  const port = await getFreePort();
  baseUrl = `http://127.0.0.1:${port}`;

  serverProcess = spawn(
    process.execPath,
    [join(cwd, "node_modules/next/dist/bin/next"), "start", "-H", "127.0.0.1", "-p", `${port}`],
    {
      cwd,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
    }
  );

  serverProcess.stdout.setEncoding("utf8");
  serverProcess.stderr.setEncoding("utf8");
  serverProcess.stdout.on("data", (chunk) => {
    serverLogs += chunk;
  });
  serverProcess.stderr.on("data", (chunk) => {
    serverLogs += chunk;
  });

  const ready = await waitForServer(`${baseUrl}/api/vendors`);
  assert.equal(ready, true, `Next server did not start successfully.\n${serverLogs}`);
});

after(async () => {
  if (!serverProcess || serverProcess.exitCode !== null) {
    return;
  }

  serverProcess.kill("SIGTERM");
  const exited = await Promise.race([
    once(serverProcess, "exit"),
    new Promise((resolve) => setTimeout(() => resolve(false), 5000)),
  ]);

  if (exited === false && serverProcess.exitCode === null) {
    serverProcess.kill("SIGKILL");
    await once(serverProcess, "exit");
  }
});

test("GET collection endpoints return HTTP 200", async () => {
  for (const path of ["/api/vendors", "/api/customers", "/api/invoices", "/api/transactions"]) {
    const response = await fetch(`${baseUrl}${path}`);
    assert.equal(response.status, 200, `${path} expected 200, got ${response.status}`);
  }
});

test("validation failures use the shared error envelope over HTTP", async () => {
  const response = await fetch(`${baseUrl}/api/payments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amountPaid: 10.25,
      paymentDate: "2026-03-31",
      method: "wire",
      invoiceId: 1,
      paidById: "emp-1",
    }),
  });

  assert.equal(response.status, 400);
  const body = await response.json();
  assert.equal(body.error.code, "validation_error");
  assert.equal(body.error.message, "Validation failed");
  assert.ok(Array.isArray(body.error.details.issues));
});

test("vendor CRUD routes honor POST/PATCH/DELETE contract", async () => {
  const token = randomUUID().slice(0, 8);
  const email = `http-test-${token}@example.test`;

  const createResponse = await fetch(`${baseUrl}/api/vendors`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: `HTTP Test Vendor ${token}`,
      contactName: "Integration Runner",
      email,
      phone: "555-0100",
    }),
  });

  assert.equal(createResponse.status, 201, await responseBody(createResponse));
  const location = createResponse.headers.get("Location");
  assert.ok(location, "POST /api/vendors should include a Location header");

  const created = await createResponse.json();
  assert.equal(typeof created.id, "number");
  assert.equal(created.email, email);

  const getResponse = await fetch(location!);
  assert.equal(getResponse.status, 200, await responseBody(getResponse));
  const loaded = await getResponse.json();
  assert.equal(loaded.id, created.id);

  const patchResponse = await fetch(location!, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      phone: "555-0101",
    }),
  });

  assert.equal(patchResponse.status, 200, await responseBody(patchResponse));
  const updated = await patchResponse.json();
  assert.equal(updated.phone, "555-0101");

  const deleteResponse = await fetch(location!, {
    method: "DELETE",
  });
  assert.equal(deleteResponse.status, 204, await responseBody(deleteResponse));
  assert.equal(await deleteResponse.text(), "");

  const missingResponse = await fetch(location!);
  assert.equal(missingResponse.status, 404, await responseBody(missingResponse));
});

test("financial delete routes are not publicly exposed", async () => {
  for (const path of [
    "/api/invoices/1",
    "/api/payments/1",
    "/api/sales-invoices/1",
    "/api/transactions/test-id",
    "/api/gl-codings/1",
  ]) {
    const response = await fetch(`${baseUrl}${path}`, {
      method: "DELETE",
    });
    assert.equal(response.status, 405, `${path} expected 405, got ${response.status}`);
  }
});

async function getFreePort() {
  const server = createServer();
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();

  if (!address || typeof address === "string") {
    server.close();
    throw new Error("Failed to allocate a test port");
  }

  const { port } = address;
  server.close();
  await once(server, "close");
  return port;
}

async function waitForServer(url: string, timeoutMs = 30000) {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    if (serverProcess?.exitCode !== null && serverProcess?.exitCode !== undefined) {
      return false;
    }

    try {
      const response = await fetch(url);
      if (response.status < 500) {
        return true;
      }
    } catch {
      // Server is still starting.
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  return false;
}

async function responseBody(response: Response) {
  const clone = response.clone();
  const contentType = clone.headers.get("Content-Type") ?? "";
  if (contentType.includes("application/json")) {
    return JSON.stringify(await clone.json());
  }

  return await clone.text();
}
