import { createServer as createHttpServer } from "node:http";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { DversumClient } from "./client.js";
import { loadConfig } from "./config.js";
import { requestContext } from "./context.js";
import { registerClientTools } from "./tools/clients.js";
import { registerContactTools } from "./tools/contacts.js";
import { registerProjectTools } from "./tools/projects.js";
import { registerTaskTools } from "./tools/tasks.js";
import { registerTimeTools } from "./tools/time.js";
import { registerCalendarTools } from "./tools/calendar.js";
import { registerInvoiceTools } from "./tools/invoices.js";
import { registerQuoteTools } from "./tools/quotes.js";
import { registerFinanceTools } from "./tools/finance.js";
import { registerAbsenceTools } from "./tools/absences.js";
import { registerPageTools } from "./tools/pages.js";
import { registerStorageTools } from "./tools/storage.js";
import { registerNotificationTools } from "./tools/notifications.js";
import { registerOrganizationTools } from "./tools/organization.js";
function registerAllTools(server, apiClient) {
    registerClientTools(server, apiClient);
    registerContactTools(server, apiClient);
    registerProjectTools(server, apiClient);
    registerTaskTools(server, apiClient);
    registerTimeTools(server, apiClient);
    registerCalendarTools(server, apiClient);
    registerInvoiceTools(server, apiClient);
    registerQuoteTools(server, apiClient);
    registerFinanceTools(server, apiClient);
    registerAbsenceTools(server, apiClient);
    registerPageTools(server, apiClient);
    registerStorageTools(server, apiClient);
    registerNotificationTools(server, apiClient);
    registerOrganizationTools(server, apiClient);
}
export function createServer() {
    const config = loadConfig();
    const server = new McpServer({
        name: "dversum",
        version: "1.0.0",
    });
    const apiClient = new DversumClient(config.apiUrl, config.apiToken);
    registerAllTools(server, apiClient);
    return { server, fallbackToken: config.apiToken };
}
async function startStdio() {
    const { server } = createServer();
    const transport = new StdioServerTransport();
    await server.connect(transport);
}
async function handleHttpRequest(req, res, config, fallbackToken) {
    // CORS headers for remote access
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, mcp-session-id");
    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }
    // Health check
    if (req.url === "/health" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "ok", server: "dversum-mcp" }));
        return;
    }
    // MCP endpoint
    if (req.url === "/mcp") {
        console.log(`[MCP] ${req.method} /mcp from ${req.headers["user-agent"] || "unknown"}`);
        // Extract Bearer token from Authorization header
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
        const effectiveToken = token || fallbackToken;
        if (!effectiveToken) {
            res.writeHead(401, { "Content-Type": "application/json" });
            res.end(JSON.stringify({
                error: "Authorization required. Send a Bearer token in the Authorization header.",
            }));
            return;
        }
        // Stateless mode: create a new server + transport per request
        const server = new McpServer({ name: "dversum", version: "1.0.0" });
        const apiClient = new DversumClient(config.apiUrl, config.apiToken);
        registerAllTools(server, apiClient);
        const transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: undefined, // Stateless mode
        });
        await server.connect(transport);
        await requestContext.run({ token: effectiveToken }, async () => {
            await transport.handleRequest(req, res);
        });
        return;
    }
    res.writeHead(404);
    res.end("Not found");
}
async function startHttp() {
    const config = loadConfig();
    const fallbackToken = config.apiToken;
    const port = parseInt(process.env.MCP_PORT || "3100", 10);
    // Use non-async callback to properly catch all errors
    const httpServer = createHttpServer((req, res) => {
        handleHttpRequest(req, res, config, fallbackToken).catch((err) => {
            console.error("[MCP] Unhandled error:", err);
            if (!res.headersSent) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Internal server error" }));
            }
        });
    });
    httpServer.listen(port, () => {
        console.log(`dVersum MCP server (HTTP) running on port ${port}`);
        console.log(`MCP endpoint: http://localhost:${port}/mcp`);
        console.log(`Health check: http://localhost:${port}/health`);
    });
}
export async function main() {
    const transport = process.env.MCP_TRANSPORT || "stdio";
    if (transport === "http") {
        await startHttp();
    }
    else {
        await startStdio();
    }
}
//# sourceMappingURL=index.js.map