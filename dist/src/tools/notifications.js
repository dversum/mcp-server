import { z } from "zod";
export function registerNotificationTools(server, client) {
    server.tool("list_notifications", "List recent notifications.", {
        page: z.number().optional().describe("Page number (0-based)"),
        per_page: z.number().optional().describe("Results per page"),
    }, async ({ page, per_page }) => {
        const params = {};
        if (page !== undefined)
            params.page = String(page);
        if (per_page !== undefined)
            params.per_page = String(per_page);
        const data = await client.get("/notifications", params);
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
    server.tool("get_unread_count", "Get the count of unread notifications.", {}, async () => {
        const data = await client.get("/notifications/unread-count");
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
}
//# sourceMappingURL=notifications.js.map