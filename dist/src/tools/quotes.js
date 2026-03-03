import { z } from "zod";
export function registerQuoteTools(server, client) {
    server.tool("list_quotes", "List quotes/proposals. Filter by status or client.", {
        page: z.number().optional().describe("Page number (0-based)"),
        per_page: z.number().optional().describe("Results per page (default 50)"),
        status: z
            .enum(["draft", "sent", "accepted", "declined", "expired"])
            .optional()
            .describe("Filter by quote status"),
        client_id: z.string().optional().describe("Filter by client UUID"),
    }, async ({ page, per_page, status, client_id }) => {
        const params = {};
        if (page !== undefined)
            params.page = String(page);
        if (per_page !== undefined)
            params.per_page = String(per_page);
        if (status)
            params.status = status;
        if (client_id)
            params.client_id = client_id;
        const data = await client.get("/quotes", params);
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
    server.tool("get_quote", "Get detailed information about a quote including line items and totals.", {
        id: z.string().describe("The quote UUID"),
    }, async ({ id }) => {
        const data = await client.get(`/quotes/${id}`);
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
    server.tool("create_quote", "Create a new draft quote/proposal for a client.", {
        client_id: z.string().describe("Client UUID"),
        valid_until: z.string().optional().describe("Quote valid until date (YYYY-MM-DD)"),
        notes: z.string().optional().describe("Notes on the quote"),
        line_items: z
            .array(z.object({
            description: z.string().describe("Line item description"),
            quantity: z.number().describe("Quantity"),
            unit_price: z.number().describe("Unit price in cents"),
            tax_rate: z.number().optional().describe("Tax rate percentage"),
        }))
            .optional()
            .describe("Quote line items"),
    }, async (input) => {
        const data = await client.post("/quotes", input);
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
    server.tool("convert_quote_to_invoice", "Convert an accepted quote into a draft invoice.", {
        id: z.string().describe("The quote UUID to convert"),
    }, async ({ id }) => {
        const data = await client.post(`/quotes/${id}/convert-to-invoice`);
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
    server.tool("update_quote", "Update an existing quote.", {
        id: z.string().describe("The quote UUID"),
        valid_until: z.string().optional().describe("Valid until date (YYYY-MM-DD)"),
        notes: z.string().optional().describe("Notes on the quote"),
    }, async ({ id, ...fields }) => {
        const data = await client.put(`/quotes/${id}`, fields);
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
    server.tool("delete_quote", "Delete a quote. This cannot be undone.", {
        id: z.string().describe("The quote UUID"),
    }, async ({ id }) => {
        await client.delete(`/quotes/${id}`);
        return {
            content: [{ type: "text", text: `Quote ${id} deleted successfully.` }],
        };
    });
    server.tool("update_quote_status", "Update the status of a quote.", {
        id: z.string().describe("The quote UUID"),
        status: z.enum(["draft", "sent", "accepted", "declined", "expired"]).describe("New status"),
    }, async ({ id, status }) => {
        const data = await client.patch(`/quotes/${id}/status`, { status });
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
    server.tool("send_quote_email", "Send a quote to the client via email.", {
        id: z.string().describe("The quote UUID"),
        to: z.string().optional().describe("Override recipient email"),
        subject: z.string().optional().describe("Custom email subject"),
        message: z.string().optional().describe("Custom email body"),
    }, async ({ id, ...options }) => {
        const data = await client.post(`/quotes/${id}/send-email`, options);
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
    server.tool("duplicate_quote", "Duplicate an existing quote.", {
        id: z.string().describe("The quote UUID to duplicate"),
    }, async ({ id }) => {
        const data = await client.post(`/quotes/${id}/duplicate`);
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
    server.tool("add_quote_line_item", "Add a line item to a quote.", {
        quote_id: z.string().describe("The quote UUID"),
        description: z.string().describe("Line item description"),
        quantity: z.number().describe("Quantity"),
        unit_price: z.number().describe("Unit price in cents"),
        tax_rate: z.number().optional().describe("Tax rate percentage"),
    }, async ({ quote_id, ...item }) => {
        const data = await client.post(`/quotes/${quote_id}/line-items`, item);
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
    server.tool("update_quote_line_item", "Update a line item on a quote.", {
        quote_id: z.string().describe("The quote UUID"),
        item_id: z.string().describe("The line item UUID"),
        description: z.string().optional().describe("Description"),
        quantity: z.number().optional().describe("Quantity"),
        unit_price: z.number().optional().describe("Unit price in cents"),
        tax_rate: z.number().optional().describe("Tax rate percentage"),
    }, async ({ quote_id, item_id, ...fields }) => {
        const data = await client.put(`/quotes/${quote_id}/line-items/${item_id}`, fields);
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
    server.tool("delete_quote_line_item", "Delete a line item from a quote.", {
        quote_id: z.string().describe("The quote UUID"),
        item_id: z.string().describe("The line item UUID"),
    }, async ({ quote_id, item_id }) => {
        await client.delete(`/quotes/${quote_id}/line-items/${item_id}`);
        return {
            content: [{ type: "text", text: `Line item deleted.` }],
        };
    });
}
//# sourceMappingURL=quotes.js.map