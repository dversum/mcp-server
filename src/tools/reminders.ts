import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { DversumClient } from "../client.js";

export function registerReminderTools(
  server: McpServer,
  client: DversumClient
) {
  server.tool(
    "list_reminders",
    "List payment reminders (Mahnungen).",
    {
      page: z.number().optional().describe("Page number (0-based)"),
      per_page: z.number().optional().describe("Results per page"),
    },
    async ({ page, per_page }) => {
      const params: Record<string, string> = {};
      if (page !== undefined) params.page = String(page);
      if (per_page !== undefined) params.per_page = String(per_page);
      const data = await client.get("/reminders", params);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "get_reminder",
    "Get details of a payment reminder.",
    {
      id: z.string().describe("The reminder UUID"),
    },
    async ({ id }) => {
      const data = await client.get(`/reminders/${id}`);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "get_reminder_suggestion",
    "Get a suggested reminder for an overdue invoice (auto-detects level and fees).",
    {
      invoice_id: z.string().describe("The overdue invoice UUID"),
    },
    async ({ invoice_id }) => {
      const data = await client.get("/reminders/suggestion", { invoice_id });
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "create_reminder",
    "Create a payment reminder (Mahnung) for an overdue invoice.",
    {
      invoice_id: z.string().describe("The invoice UUID"),
      level: z.number().optional().describe("Reminder level (1-4, auto-detected if omitted)"),
      fee: z.number().optional().describe("Reminder fee in cents"),
      due_date: z.string().optional().describe("Payment due date (YYYY-MM-DD)"),
      note: z.string().optional().describe("Custom note"),
    },
    async (input) => {
      const data = await client.post("/reminders", input);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "send_reminder_email",
    "Send a payment reminder via email.",
    {
      id: z.string().describe("The reminder UUID"),
      to: z.string().optional().describe("Override recipient email"),
      subject: z.string().optional().describe("Custom email subject"),
      message: z.string().optional().describe("Custom email body"),
    },
    async ({ id, ...options }) => {
      const data = await client.post(`/reminders/${id}/send-email`, options);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "delete_reminder",
    "Delete a payment reminder.",
    {
      id: z.string().describe("The reminder UUID"),
    },
    async ({ id }) => {
      await client.delete(`/reminders/${id}`);
      return {
        content: [{ type: "text", text: `Reminder ${id} deleted successfully.` }],
      };
    }
  );
}
