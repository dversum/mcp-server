import { z } from "zod";
export function registerFinanceTools(server, client) {
    server.tool("get_finance_overview", "Get the financial overview — monthly revenue vs expenses breakdown for a given year.", {
        year: z
            .number()
            .optional()
            .describe("Year to query (default: current year)"),
    }, async ({ year }) => {
        const params = {};
        if (year !== undefined)
            params.year = String(year);
        const data = await client.get("/finanzen/overview", params);
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
    server.tool("get_vat_summary", "Get the VAT pre-return (USt-Voranmeldung) summary with Kennzahlen 81, 86, 66, 83.", {
        year: z.number().describe("Year"),
        quarter: z
            .number()
            .optional()
            .describe("Quarter (1-4). If omitted, returns full year."),
    }, async ({ year, quarter }) => {
        const params = { year: String(year) };
        if (quarter !== undefined)
            params.quarter = String(quarter);
        const data = await client.get("/finanzen/ust-summary", params);
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
    server.tool("list_received_invoices", "List received invoices (Eingangsrechnungen) from suppliers.", {
        page: z.number().optional().describe("Page number (0-based)"),
        per_page: z.number().optional().describe("Results per page"),
        status: z
            .enum(["received", "validated", "approved", "booked", "paid", "rejected"])
            .optional()
            .describe("Filter by status"),
    }, async ({ page, per_page, status }) => {
        const params = {};
        if (page !== undefined)
            params.page = String(page);
        if (per_page !== undefined)
            params.per_page = String(per_page);
        if (status)
            params.status = status;
        const data = await client.get("/received-invoices", params);
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
    server.tool("list_suppliers", "List all suppliers (Lieferanten).", {
        page: z.number().optional().describe("Page number (0-based)"),
        per_page: z.number().optional().describe("Results per page"),
    }, async ({ page, per_page }) => {
        const params = {};
        if (page !== undefined)
            params.page = String(page);
        if (per_page !== undefined)
            params.per_page = String(per_page);
        const data = await client.get("/suppliers", params);
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
    server.tool("get_supplier", "Get detailed information about a supplier.", {
        id: z.string().describe("The supplier UUID"),
    }, async ({ id }) => {
        const data = await client.get(`/suppliers/${id}`);
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
    server.tool("create_supplier", "Create a new supplier.", {
        name: z.string().describe("Supplier name"),
        email: z.string().optional().describe("Email address"),
        phone: z.string().optional().describe("Phone number"),
        address: z.string().optional().describe("Street address"),
        city: z.string().optional().describe("City"),
        zip: z.string().optional().describe("Postal code"),
        country: z.string().optional().describe("Country"),
        vat_id: z.string().optional().describe("VAT ID"),
    }, async (input) => {
        const data = await client.post("/suppliers", input);
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
    server.tool("update_supplier", "Update an existing supplier.", {
        id: z.string().describe("The supplier UUID"),
        name: z.string().optional().describe("Supplier name"),
        email: z.string().optional().describe("Email"),
        phone: z.string().optional().describe("Phone"),
        address: z.string().optional().describe("Street address"),
        city: z.string().optional().describe("City"),
        zip: z.string().optional().describe("Postal code"),
        country: z.string().optional().describe("Country"),
        vat_id: z.string().optional().describe("VAT ID"),
    }, async ({ id, ...fields }) => {
        const data = await client.put(`/suppliers/${id}`, fields);
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
    server.tool("delete_supplier", "Delete a supplier.", {
        id: z.string().describe("The supplier UUID"),
    }, async ({ id }) => {
        await client.delete(`/suppliers/${id}`);
        return {
            content: [{ type: "text", text: `Supplier ${id} deleted successfully.` }],
        };
    });
    server.tool("get_received_invoice", "Get details of a received invoice (Eingangsrechnung).", {
        id: z.string().describe("The received invoice UUID"),
    }, async ({ id }) => {
        const data = await client.get(`/received-invoices/${id}`);
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
    server.tool("approve_received_invoice", "Approve a received invoice.", {
        id: z.string().describe("The received invoice UUID"),
    }, async ({ id }) => {
        const data = await client.post(`/received-invoices/${id}/approve`);
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
    server.tool("get_datev_export", "Preview or download DATEV export data for tax advisor.", {
        year: z.number().describe("Year"),
        month: z.number().optional().describe("Month (1-12)"),
    }, async ({ year, month }) => {
        const params = { year: String(year) };
        if (month !== undefined)
            params.month = String(month);
        const data = await client.get("/exports/datev/preview", params);
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
}
//# sourceMappingURL=finance.js.map