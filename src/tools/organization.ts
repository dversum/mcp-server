import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { DversumClient } from "../client.js";

export function registerOrganizationTools(
  server: McpServer,
  client: DversumClient
) {
  server.tool(
    "get_organization",
    "Get details about an organization.",
    {
      id: z.string().describe("The organization UUID"),
    },
    async ({ id }) => {
      const data = await client.get(`/organizations/${id}`);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "list_members",
    "List all members of an organization.",
    {
      id: z.string().describe("The organization UUID"),
    },
    async ({ id }) => {
      const data = await client.get(`/organizations/${id}/members`);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );
}
