import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { DversumClient } from "../client.js";

export function registerInvoiceTools(
  server: McpServer,
  client: DversumClient
) {
  server.tool(
    "list_invoices",
    "List invoices. Filter by status, client, or type (invoice, credit_note, cancellation).",
    {
      page: z.number().optional().describe("Page number (0-based)"),
      per_page: z.number().optional().describe("Results per page (default 50)"),
      status: z
        .enum(["draft", "sent", "paid", "overdue", "cancelled"])
        .optional()
        .describe("Filter by invoice status"),
      client_id: z.string().optional().describe("Filter by client UUID"),
      type: z
        .enum(["invoice", "credit_note", "cancellation"])
        .optional()
        .describe("Filter by invoice type"),
    },
    async ({ page, per_page, status, client_id, type }) => {
      const params: Record<string, string> = {};
      if (page !== undefined) params.page = String(page);
      if (per_page !== undefined) params.per_page = String(per_page);
      if (status) params.status = status;
      if (client_id) params.client_id = client_id;
      if (type) params.type = type;
      const data = await client.get("/invoices", params);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "get_invoice",
    "Get detailed information about an invoice including line items, payments, and totals.",
    {
      id: z.string().describe("The invoice UUID"),
    },
    async ({ id }) => {
      const data = await client.get(`/invoices/${id}`);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "create_invoice",
    "Create a new draft invoice for a client.",
    {
      client_id: z.string().describe("Client UUID"),
      invoice_date: z.string().optional().describe("Invoice date (YYYY-MM-DD, default today)"),
      due_date: z.string().optional().describe("Due date (YYYY-MM-DD)"),
      notes: z.string().optional().describe("Notes/description on the invoice"),
      line_items: z
        .array(
          z.object({
            description: z.string().describe("Line item description"),
            quantity: z.number().describe("Quantity"),
            unit_price: z.number().describe("Unit price in cents"),
            tax_rate: z
              .number()
              .optional()
              .describe("Tax rate as percentage (e.g. 19 for 19%)"),
          })
        )
        .optional()
        .describe("Invoice line items"),
    },
    async (input) => {
      const data = await client.post("/invoices", input);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "update_invoice_status",
    "Update the status of an invoice (e.g. mark as sent, paid, cancelled).",
    {
      id: z.string().describe("The invoice UUID"),
      status: z
        .enum(["draft", "sent", "paid", "overdue", "cancelled"])
        .describe("New invoice status"),
    },
    async ({ id, status }) => {
      const data = await client.patch(`/invoices/${id}/status`, { status });
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "send_invoice_email",
    "Send an invoice to the client via email.",
    {
      id: z.string().describe("The invoice UUID"),
      to: z.string().optional().describe("Override recipient email address"),
      subject: z.string().optional().describe("Custom email subject"),
      message: z.string().optional().describe("Custom email body message"),
    },
    async ({ id, ...options }) => {
      const data = await client.post(`/invoices/${id}/send-email`, options);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "create_invoice_from_time",
    "Create a new invoice from tracked time entries for a project.",
    {
      project_id: z.string().describe("Project UUID"),
      client_id: z.string().describe("Client UUID"),
      start_date: z.string().optional().describe("Include time entries from (YYYY-MM-DD)"),
      end_date: z.string().optional().describe("Include time entries until (YYYY-MM-DD)"),
    },
    async (input) => {
      const data = await client.post("/invoices/from-time-entries", input);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "update_invoice",
    "Update an existing invoice (only drafts can be edited).",
    {
      id: z.string().describe("The invoice UUID"),
      invoice_date: z.string().optional().describe("Invoice date (YYYY-MM-DD)"),
      due_date: z.string().optional().describe("Due date (YYYY-MM-DD)"),
      notes: z.string().optional().describe("Notes on the invoice"),
    },
    async ({ id, ...fields }) => {
      const data = await client.put(`/invoices/${id}`, fields);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "delete_invoice",
    "Delete a draft invoice. This cannot be undone.",
    {
      id: z.string().describe("The invoice UUID"),
    },
    async ({ id }) => {
      await client.delete(`/invoices/${id}`);
      return {
        content: [{ type: "text", text: `Invoice ${id} deleted successfully.` }],
      };
    }
  );

  server.tool(
    "add_invoice_line_item",
    "Add a line item to an invoice.",
    {
      invoice_id: z.string().describe("The invoice UUID"),
      description: z.string().describe("Line item description"),
      quantity: z.number().describe("Quantity"),
      unit_price: z.number().describe("Unit price in cents"),
      tax_rate: z.number().optional().describe("Tax rate percentage (e.g. 19)"),
    },
    async ({ invoice_id, ...item }) => {
      const data = await client.post(`/invoices/${invoice_id}/line-items`, item);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "update_invoice_line_item",
    "Update a line item on an invoice.",
    {
      invoice_id: z.string().describe("The invoice UUID"),
      item_id: z.string().describe("The line item UUID"),
      description: z.string().optional().describe("Description"),
      quantity: z.number().optional().describe("Quantity"),
      unit_price: z.number().optional().describe("Unit price in cents"),
      tax_rate: z.number().optional().describe("Tax rate percentage"),
    },
    async ({ invoice_id, item_id, ...fields }) => {
      const data = await client.put(`/invoices/${invoice_id}/line-items/${item_id}`, fields);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "delete_invoice_line_item",
    "Delete a line item from an invoice.",
    {
      invoice_id: z.string().describe("The invoice UUID"),
      item_id: z.string().describe("The line item UUID"),
    },
    async ({ invoice_id, item_id }) => {
      await client.delete(`/invoices/${invoice_id}/line-items/${item_id}`);
      return {
        content: [{ type: "text", text: `Line item deleted.` }],
      };
    }
  );

  server.tool(
    "record_payment",
    "Record a payment on an invoice.",
    {
      invoice_id: z.string().describe("The invoice UUID"),
      amount: z.number().describe("Payment amount in cents"),
      paid_at: z.string().optional().describe("Payment date (YYYY-MM-DD, default today)"),
      method: z.string().optional().describe("Payment method (e.g. bank_transfer, paypal)"),
      note: z.string().optional().describe("Payment note"),
    },
    async ({ invoice_id, ...payment }) => {
      const data = await client.post(`/invoices/${invoice_id}/payments`, payment);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "create_credit_note",
    "Create a credit note (Gutschrift) for an invoice.",
    {
      invoice_id: z.string().describe("The original invoice UUID"),
    },
    async ({ invoice_id }) => {
      const data = await client.post(`/invoices/${invoice_id}/credit-note`);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "create_cancellation",
    "Create a cancellation invoice (Stornorechnung) for an invoice.",
    {
      invoice_id: z.string().describe("The original invoice UUID"),
    },
    async ({ invoice_id }) => {
      const data = await client.post(`/invoices/${invoice_id}/cancellation`);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );
}
