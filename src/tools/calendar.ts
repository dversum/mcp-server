import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { DversumClient } from "../client.js";

export function registerCalendarTools(
  server: McpServer,
  client: DversumClient
) {
  server.tool(
    "list_events",
    "List calendar events within a date range.",
    {
      start: z.string().optional().describe("Start date (YYYY-MM-DD)"),
      end: z.string().optional().describe("End date (YYYY-MM-DD)"),
    },
    async ({ start, end }) => {
      const params: Record<string, string> = {};
      if (start) params.start = start;
      if (end) params.end = end;
      const data = await client.get("/calendar/events", params);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "get_event",
    "Get detailed information about a calendar event.",
    {
      id: z.string().describe("The event UUID"),
    },
    async ({ id }) => {
      const data = await client.get(`/calendar/events/${id}`);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "create_event",
    "Create a new calendar event.",
    {
      title: z.string().describe("Event title"),
      description: z.string().optional().describe("Event description"),
      start_time: z.string().describe("Start time in ISO 8601 format"),
      end_time: z.string().describe("End time in ISO 8601 format"),
      all_day: z.boolean().optional().describe("Whether this is an all-day event"),
      location: z.string().optional().describe("Event location"),
      color: z.string().optional().describe("Event color (hex code)"),
      create_meet_link: z
        .boolean()
        .optional()
        .describe("Create a Google Meet link for this event"),
    },
    async (input) => {
      const data = await client.post("/calendar/events", input);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "update_event",
    "Update an existing calendar event.",
    {
      id: z.string().describe("The event UUID"),
      title: z.string().optional().describe("Event title"),
      description: z.string().optional().describe("Event description"),
      start_time: z.string().optional().describe("Start time (ISO 8601)"),
      end_time: z.string().optional().describe("End time (ISO 8601)"),
      all_day: z.boolean().optional().describe("All-day event"),
      location: z.string().optional().describe("Location"),
      color: z.string().optional().describe("Color (hex code)"),
    },
    async ({ id, ...fields }) => {
      const data = await client.put(`/calendar/events/${id}`, fields);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "delete_event",
    "Delete a calendar event.",
    {
      id: z.string().describe("The event UUID"),
    },
    async ({ id }) => {
      await client.delete(`/calendar/events/${id}`);
      return {
        content: [
          { type: "text", text: `Calendar event ${id} deleted successfully.` },
        ],
      };
    }
  );
}
