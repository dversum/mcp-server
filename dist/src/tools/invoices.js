import { z } from "zod";
export function registerInvoiceTools(server, client) {
    server.tool("list_invoices", "List invoices. Filter by status, client, or type (invoice, credit_note, cancellation).", {
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
    }, async ({ page, per_page, status, client_id, type }) => {
        const params = {};
        if (page !== undefined)
            params.page = String(page);
        if (per_page !== undefined)
            params.per_page = String(per_page);
        if (status)
            params.status = status;
        if (client_id)
            params.client_id = client_id;
        if (type)
            params.type = type;
        const data = await client.get("/invoices", params);
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
    server.tool("get_invoice", "Get detailed information about an invoice including line items, payments, and totals.", {
        id: z.string().describe("The invoice UUID"),
    }, async ({ id }) => {
        const data = await client.get(`/invoices/${id}`);
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
    server.tool("create_invoice", "Create a new draft invoice for a client.", {
        client_id: z.string().describe("Client UUID"),
        invoice_date: z.string().optional().describe("Invoice date (YYYY-MM-DD, default today)"),
        due_date: z.string().optional().describe("Due date (YYYY-MM-DD)"),
        notes: z.string().optional().describe("Notes/description on the invoice"),
        line_items: z
            .array(z.object({
            description: z.string().describe("Line item description"),
            quantity: z.number().describe("Quantity"),
            unit_price: z.number().describe("Unit price in cents"),
            tax_rate: z
                .number()
                .optional()
                .describe("Tax rate as percentage (e.g. 19 for 19%)"),
        }))
            .optional()
            .describe("Invoice line items"),
    }, async (input) => {
        const data = await client.post("/invoices", input);
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
    server.tool("update_invoice_status", "Update the status of an invoice (e.g. mark as sent, paid, cancelled).", {
        id: z.string().describe("The invoice UUID"),
        status: z
            .enum(["draft", "sent", "paid", "overdue", "cancelled"])
            .describe("New invoice status"),
    }, async ({ id, status }) => {
        const data = await client.patch(`/invoices/${id}/status`, { status });
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
    server.tool("send_invoice_email", "Send an invoice to the client via email.", {
        id: z.string().describe("The invoice UUID"),
        to: z.string().optional().describe("Override recipient email address"),
        subject: z.string().optional().describe("Custom email subject"),
        message: z.string().optional().describe("Custom email body message"),
    }, async ({ id, ...options }) => {
        const data = await client.post(`/invoices/${id}/send-email`, options);
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
    server.tool("create_invoice_from_time", "Create a new invoice from tracked time entries for a project.", {
        project_id: z.string().describe("Project UUID"),
        client_id: z.string().describe("Client UUID"),
        start_date: z.string().optional().describe("Include time entries from (YYYY-MM-DD)"),
        end_date: z.string().optional().describe("Include time entries until (YYYY-MM-DD)"),
    }, async (input) => {
        const data = await client.post("/invoices/from-time-entries", input);
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
}
//# sourceMappingURL=invoices.js.map