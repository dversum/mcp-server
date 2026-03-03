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
}
//# sourceMappingURL=quotes.js.map