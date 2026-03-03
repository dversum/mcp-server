import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { DversumClient } from "../client.js";

export function registerAreaTools(
  server: McpServer,
  client: DversumClient
) {
  server.tool(
    "list_areas",
    "List all project areas/groups.",
    {},
    async () => {
      const data = await client.get("/areas");
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "create_area",
    "Create a new project area/group.",
    {
      name: z.string().describe("Area name"),
      color: z.string().optional().describe("Area color"),
    },
    async (input) => {
      const data = await client.post("/areas", input);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "update_area",
    "Update a project area/group.",
    {
      id: z.string().describe("The area UUID"),
      name: z.string().optional().describe("Area name"),
      color: z.string().optional().describe("Area color"),
    },
    async ({ id, ...fields }) => {
      const data = await client.put(`/areas/${id}`, fields);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "delete_area",
    "Delete a project area/group.",
    {
      id: z.string().describe("The area UUID"),
    },
    async ({ id }) => {
      await client.delete(`/areas/${id}`);
      return {
        content: [{ type: "text", text: `Area ${id} deleted successfully.` }],
      };
    }
  );
}
