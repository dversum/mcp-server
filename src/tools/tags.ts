import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { DversumClient } from "../client.js";

export function registerTagTools(
  server: McpServer,
  client: DversumClient
) {
  server.tool(
    "list_tags",
    "List all tags used in the organization.",
    {},
    async () => {
      const data = await client.get("/tags");
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "create_tag",
    "Create a new tag.",
    {
      name: z.string().describe("Tag name"),
      color: z.string().optional().describe("Tag color (hex code)"),
    },
    async (input) => {
      const data = await client.post("/tags", input);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "update_tag",
    "Update a tag's name or color.",
    {
      id: z.string().describe("The tag UUID"),
      name: z.string().optional().describe("Tag name"),
      color: z.string().optional().describe("Tag color (hex code)"),
    },
    async ({ id, ...fields }) => {
      const data = await client.put(`/tags/${id}`, fields);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "delete_tag",
    "Delete a tag.",
    {
      id: z.string().describe("The tag UUID"),
    },
    async ({ id }) => {
      await client.delete(`/tags/${id}`);
      return {
        content: [{ type: "text", text: `Tag ${id} deleted successfully.` }],
      };
    }
  );
}
