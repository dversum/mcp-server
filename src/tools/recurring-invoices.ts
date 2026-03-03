import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { DversumClient } from "../client.js";

export function registerRecurringInvoiceTools(
  server: McpServer,
  client: DversumClient
) {
  server.tool(
    "list_recurring_invoices",
    "List recurring invoice templates.",
    {
      page: z.number().optional().describe("Page number (0-based)"),
      per_page: z.number().optional().describe("Results per page"),
    },
    async ({ page, per_page }) => {
      const params: Record<string, string> = {};
      if (page !== undefined) params.page = String(page);
      if (per_page !== undefined) params.per_page = String(per_page);
      const data = await client.get("/recurring-invoices", params);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "get_recurring_invoice",
    "Get details of a recurring invoice template.",
    {
      id: z.string().describe("The recurring invoice UUID"),
    },
    async ({ id }) => {
      const data = await client.get(`/recurring-invoices/${id}`);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "create_recurring_invoice",
    "Create a new recurring invoice template.",
    {
      client_id: z.string().describe("Client UUID"),
      interval: z.enum(["weekly", "monthly", "quarterly", "yearly"]).describe("Billing interval"),
      next_date: z.string().describe("Next invoice date (YYYY-MM-DD)"),
      notes: z.string().optional().describe("Notes on the invoice"),
      line_items: z
        .array(
          z.object({
            description: z.string().describe("Line item description"),
            quantity: z.number().describe("Quantity"),
            unit_price: z.number().describe("Unit price in cents"),
            tax_rate: z.number().optional().describe("Tax rate percentage"),
          })
        )
        .optional()
        .describe("Line items"),
    },
    async (input) => {
      const data = await client.post("/recurring-invoices", input);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "update_recurring_invoice",
    "Update a recurring invoice template.",
    {
      id: z.string().describe("The recurring invoice UUID"),
      interval: z.enum(["weekly", "monthly", "quarterly", "yearly"]).optional().describe("Billing interval"),
      next_date: z.string().optional().describe("Next invoice date (YYYY-MM-DD)"),
      notes: z.string().optional().describe("Notes"),
    },
    async ({ id, ...fields }) => {
      const data = await client.put(`/recurring-invoices/${id}`, fields);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "delete_recurring_invoice",
    "Delete a recurring invoice template.",
    {
      id: z.string().describe("The recurring invoice UUID"),
    },
    async ({ id }) => {
      await client.delete(`/recurring-invoices/${id}`);
      return {
        content: [{ type: "text", text: `Recurring invoice ${id} deleted.` }],
      };
    }
  );

  server.tool(
    "pause_recurring_invoice",
    "Pause a recurring invoice (stops auto-generation).",
    {
      id: z.string().describe("The recurring invoice UUID"),
    },
    async ({ id }) => {
      const data = await client.post(`/recurring-invoices/${id}/pause`);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "resume_recurring_invoice",
    "Resume a paused recurring invoice.",
    {
      id: z.string().describe("The recurring invoice UUID"),
    },
    async ({ id }) => {
      const data = await client.post(`/recurring-invoices/${id}/resume`);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "generate_recurring_invoice_now",
    "Manually generate an invoice from a recurring template now.",
    {
      id: z.string().describe("The recurring invoice UUID"),
    },
    async ({ id }) => {
      const data = await client.post(`/recurring-invoices/${id}/generate`);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );
}
