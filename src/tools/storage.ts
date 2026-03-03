import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { DversumClient } from "../client.js";

export function registerStorageTools(
  server: McpServer,
  client: DversumClient
) {
  server.tool(
    "list_files",
    "List files in a folder (or root if no folder specified).",
    {
      folder_id: z.string().optional().describe("Folder UUID (omit for root)"),
      search: z.string().optional().describe("Search files by name"),
    },
    async ({ folder_id, search }) => {
      const params: Record<string, string> = {};
      if (folder_id) params.folder_id = folder_id;
      if (search) params.search = search;
      const data = await client.get("/storage/files", params);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "list_folders",
    "List folders (or subfolders of a parent folder).",
    {
      parent_id: z.string().optional().describe("Parent folder UUID (omit for root)"),
    },
    async ({ parent_id }) => {
      const params: Record<string, string> = {};
      if (parent_id) params.parent_id = parent_id;
      const data = await client.get("/storage/folders", params);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "create_folder",
    "Create a new folder.",
    {
      name: z.string().describe("Folder name"),
      parent_id: z.string().optional().describe("Parent folder UUID"),
      color: z.string().optional().describe("Folder color"),
    },
    async (input) => {
      const data = await client.post("/storage/folders", input);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "get_folder_tree",
    "Get the full folder hierarchy tree.",
    {},
    async () => {
      const data = await client.get("/storage/folders/tree");
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );
}
