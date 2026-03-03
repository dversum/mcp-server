import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { DversumClient } from "../client.js";

export function registerTimeTools(
  server: McpServer,
  client: DversumClient
) {
  server.tool(
    "list_time_entries",
    "List time entries. Filter by date range, project, or user.",
    {
      page: z.number().optional().describe("Page number (0-based)"),
      per_page: z.number().optional().describe("Results per page (default 50)"),
      project_id: z.string().optional().describe("Filter by project UUID"),
      start_date: z.string().optional().describe("Filter from date (YYYY-MM-DD)"),
      end_date: z.string().optional().describe("Filter to date (YYYY-MM-DD)"),
    },
    async ({ page, per_page, project_id, start_date, end_date }) => {
      const params: Record<string, string> = {};
      if (page !== undefined) params.page = String(page);
      if (per_page !== undefined) params.per_page = String(per_page);
      if (project_id) params.project_id = project_id;
      if (start_date) params.start_date = start_date;
      if (end_date) params.end_date = end_date;
      const data = await client.get("/time-entries", params);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "create_time_entry",
    "Log a completed time entry with start and end time.",
    {
      project_id: z.string().describe("Project UUID"),
      task_id: z.string().optional().describe("Task UUID (optional)"),
      description: z.string().optional().describe("What was worked on"),
      start_time: z.string().describe("Start time in ISO 8601 format"),
      end_time: z.string().describe("End time in ISO 8601 format"),
      billable: z.boolean().optional().describe("Whether this time is billable (default true)"),
    },
    async (input) => {
      const data = await client.post("/time-entries", input);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "start_timer",
    "Start a running timer for time tracking.",
    {
      project_id: z.string().describe("Project UUID"),
      task_id: z.string().optional().describe("Task UUID (optional)"),
      description: z.string().optional().describe("What you're working on"),
    },
    async (input) => {
      const data = await client.post("/time-entries/start", input);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "stop_timer",
    "Stop a currently running timer.",
    {
      id: z.string().describe("The running time entry UUID"),
    },
    async ({ id }) => {
      const data = await client.post(`/time-entries/${id}/stop`);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "get_running_timer",
    "Get the currently running timer, if any.",
    {},
    async () => {
      const data = await client.get("/time-entries/running");
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "get_time_stats",
    "Get time tracking statistics (total hours, billable hours, etc.).",
    {
      project_id: z.string().optional().describe("Filter by project UUID"),
      start_date: z.string().optional().describe("From date (YYYY-MM-DD)"),
      end_date: z.string().optional().describe("To date (YYYY-MM-DD)"),
    },
    async ({ project_id, start_date, end_date }) => {
      const params: Record<string, string> = {};
      if (project_id) params.project_id = project_id;
      if (start_date) params.start_date = start_date;
      if (end_date) params.end_date = end_date;
      const data = await client.get("/time-entries/stats", params);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "update_time_entry",
    "Update an existing time entry.",
    {
      id: z.string().describe("The time entry UUID"),
      description: z.string().optional().describe("What was worked on"),
      start_time: z.string().optional().describe("Start time (ISO 8601)"),
      end_time: z.string().optional().describe("End time (ISO 8601)"),
      billable: z.boolean().optional().describe("Whether billable"),
      project_id: z.string().optional().describe("Project UUID"),
      task_id: z.string().optional().describe("Task UUID"),
    },
    async ({ id, ...fields }) => {
      const data = await client.put(`/time-entries/${id}`, fields);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "delete_time_entry",
    "Delete a time entry. This cannot be undone.",
    {
      id: z.string().describe("The time entry UUID"),
    },
    async ({ id }) => {
      await client.delete(`/time-entries/${id}`);
      return {
        content: [{ type: "text", text: `Time entry ${id} deleted successfully.` }],
      };
    }
  );
}
