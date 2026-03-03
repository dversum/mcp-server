import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { DversumClient } from "../client.js";

export function registerContactTools(
  server: McpServer,
  client: DversumClient
) {
  server.tool(
    "list_contacts",
    "List all contacts in the organization.",
    {
      page: z.number().optional().describe("Page number (0-based)"),
      per_page: z.number().optional().describe("Results per page (default 50)"),
    },
    async ({ page, per_page }) => {
      const params: Record<string, string> = {};
      if (page !== undefined) params.page = String(page);
      if (per_page !== undefined) params.per_page = String(per_page);
      const data = await client.get("/contacts", params);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "get_contact",
    "Get detailed information about a specific contact.",
    {
      id: z.string().describe("The contact UUID"),
    },
    async ({ id }) => {
      const data = await client.get(`/contacts/${id}`);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "create_contact",
    "Create a new contact.",
    {
      first_name: z.string().describe("First name"),
      last_name: z.string().describe("Last name"),
      email: z.string().optional().describe("Email address"),
      phone: z.string().optional().describe("Phone number"),
      position: z.string().optional().describe("Job title/position"),
      client_id: z.string().optional().describe("Associated client UUID"),
      notes: z.string().optional().describe("Notes about this contact"),
    },
    async (input) => {
      const data = await client.post("/contacts", input);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );
}
