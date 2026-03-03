import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { DversumClient } from "../client.js";

export function registerWhiteboardTools(
  server: McpServer,
  client: DversumClient
) {
  server.tool(
    "list_whiteboards",
    "List all whiteboards.",
    {},
    async () => {
      const data = await client.get("/whiteboards");
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "get_whiteboard",
    "Get whiteboard details including content.",
    {
      id: z.string().describe("The whiteboard UUID"),
    },
    async ({ id }) => {
      const data = await client.get(`/whiteboards/${id}`);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "create_whiteboard",
    "Create a new whiteboard.",
    {
      name: z.string().describe("Whiteboard name"),
      project_id: z.string().optional().describe("Project UUID (for project-scoped whiteboards)"),
    },
    async (input) => {
      const data = await client.post("/whiteboards", input);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "update_whiteboard",
    "Update whiteboard metadata.",
    {
      id: z.string().describe("The whiteboard UUID"),
      name: z.string().optional().describe("Whiteboard name"),
    },
    async ({ id, ...fields }) => {
      const data = await client.put(`/whiteboards/${id}`, fields);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "delete_whiteboard",
    "Delete a whiteboard.",
    {
      id: z.string().describe("The whiteboard UUID"),
    },
    async ({ id }) => {
      await client.delete(`/whiteboards/${id}`);
      return {
        content: [{ type: "text", text: `Whiteboard ${id} deleted successfully.` }],
      };
    }
  );

  server.tool(
    "duplicate_whiteboard",
    "Duplicate an existing whiteboard.",
    {
      id: z.string().describe("The whiteboard UUID to duplicate"),
    },
    async ({ id }) => {
      const data = await client.post(`/whiteboards/${id}/duplicate`);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );
}
