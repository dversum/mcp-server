import { z } from "zod";
export function registerClientTools(server, client) {
    server.tool("list_clients", "List all clients in the organization. Returns clients with their associated projects. Supports pagination.", {
        page: z.number().optional().describe("Page number (0-based, default 0)"),
        per_page: z
            .number()
            .optional()
            .describe("Results per page (default 50, max 100)"),
    }, async ({ page, per_page }) => {
        const params = {};
        if (page !== undefined)
            params.page = String(page);
        if (per_page !== undefined)
            params.per_page = String(per_page);
        const data = await client.get("/clients", params);
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
    server.tool("get_client", "Get detailed information about a specific client by ID.", {
        id: z.string().describe("The client UUID"),
    }, async ({ id }) => {
        const data = await client.get(`/clients/${id}`);
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
    server.tool("create_client", "Create a new client in the organization.", {
        name: z.string().describe("Client/company name"),
        email: z.string().optional().describe("Primary email address"),
        phone: z.string().optional().describe("Phone number"),
        website: z.string().optional().describe("Website URL"),
        address: z.string().optional().describe("Street address"),
        city: z.string().optional().describe("City"),
        zip: z.string().optional().describe("Postal/ZIP code"),
        country: z.string().optional().describe("Country"),
        vat_id: z.string().optional().describe("VAT ID (e.g. DE123456789)"),
        notes: z.string().optional().describe("Internal notes"),
    }, async (input) => {
        const data = await client.post("/clients", input);
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
    server.tool("update_client", "Update an existing client's details.", {
        id: z.string().describe("The client UUID"),
        name: z.string().optional().describe("Client/company name"),
        email: z.string().optional().describe("Primary email address"),
        phone: z.string().optional().describe("Phone number"),
        website: z.string().optional().describe("Website URL"),
        address: z.string().optional().describe("Street address"),
        city: z.string().optional().describe("City"),
        zip: z.string().optional().describe("Postal/ZIP code"),
        country: z.string().optional().describe("Country"),
        vat_id: z.string().optional().describe("VAT ID"),
        notes: z.string().optional().describe("Internal notes"),
    }, async ({ id, ...fields }) => {
        const data = await client.put(`/clients/${id}`, fields);
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
    server.tool("delete_client", "Delete a client by ID. This cannot be undone.", {
        id: z.string().describe("The client UUID"),
    }, async ({ id }) => {
        await client.delete(`/clients/${id}`);
        return {
            content: [{ type: "text", text: `Client ${id} deleted successfully.` }],
        };
    });
}
//# sourceMappingURL=clients.js.map