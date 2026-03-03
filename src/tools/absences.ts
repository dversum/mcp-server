import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { DversumClient } from "../client.js";

export function registerAbsenceTools(
  server: McpServer,
  client: DversumClient
) {
  server.tool(
    "list_absences",
    "List team absences (vacation, sick leave, home office, etc.).",
    {
      start_date: z.string().optional().describe("Filter from date (YYYY-MM-DD)"),
      end_date: z.string().optional().describe("Filter to date (YYYY-MM-DD)"),
      type: z
        .enum(["vacation", "sick", "absence", "homeoffice", "business_trip"])
        .optional()
        .describe("Filter by absence type"),
    },
    async ({ start_date, end_date, type }) => {
      const params: Record<string, string> = {};
      if (start_date) params.start_date = start_date;
      if (end_date) params.end_date = end_date;
      if (type) params.type = type;
      const data = await client.get("/absences", params);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "create_absence",
    "Create a new absence entry (vacation, sick leave, etc.).",
    {
      type: z
        .enum(["vacation", "sick", "absence", "homeoffice", "business_trip"])
        .describe("Absence type"),
      start_date: z.string().describe("Start date (YYYY-MM-DD)"),
      end_date: z.string().describe("End date (YYYY-MM-DD)"),
      note: z.string().optional().describe("Optional note"),
      half_day: z.boolean().optional().describe("Whether this is a half-day absence"),
    },
    async (input) => {
      const data = await client.post("/absences", input);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "get_vacation_stats",
    "Get vacation quota and usage statistics for the team.",
    {},
    async () => {
      const data = await client.get("/absences/stats");
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "update_absence",
    "Update an existing absence entry.",
    {
      id: z.string().describe("The absence UUID"),
      type: z.enum(["vacation", "sick", "absence", "homeoffice", "business_trip"]).optional().describe("Absence type"),
      start_date: z.string().optional().describe("Start date (YYYY-MM-DD)"),
      end_date: z.string().optional().describe("End date (YYYY-MM-DD)"),
      note: z.string().optional().describe("Note"),
      half_day: z.boolean().optional().describe("Half-day absence"),
    },
    async ({ id, ...fields }) => {
      const data = await client.put(`/absences/${id}`, fields);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "delete_absence",
    "Delete an absence entry.",
    {
      id: z.string().describe("The absence UUID"),
    },
    async ({ id }) => {
      await client.delete(`/absences/${id}`);
      return {
        content: [{ type: "text", text: `Absence ${id} deleted successfully.` }],
      };
    }
  );
}
