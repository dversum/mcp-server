import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { DversumClient } from "../client.js";

export function registerNotificationTools(
  server: McpServer,
  client: DversumClient
) {
  server.tool(
    "list_notifications",
    "List recent notifications.",
    {
      page: z.number().optional().describe("Page number (0-based)"),
      per_page: z.number().optional().describe("Results per page"),
    },
    async ({ page, per_page }) => {
      const params: Record<string, string> = {};
      if (page !== undefined) params.page = String(page);
      if (per_page !== undefined) params.per_page = String(per_page);
      const data = await client.get("/notifications", params);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "get_unread_count",
    "Get the count of unread notifications.",
    {},
    async () => {
      const data = await client.get("/notifications/unread-count");
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "mark_notification_read",
    "Mark a notification as read.",
    {
      id: z.string().describe("The notification UUID"),
    },
    async ({ id }) => {
      const data = await client.put(`/notifications/${id}/read`);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "mark_all_notifications_read",
    "Mark all notifications as read.",
    {},
    async () => {
      const data = await client.put("/notifications/read-all");
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );
}
