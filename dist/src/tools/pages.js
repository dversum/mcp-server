import { z } from "zod";
export function registerPageTools(server, client) {
    server.tool("list_pages", "List all pages (Notion-like documents).", {
        page: z.number().optional().describe("Page number (0-based)"),
        per_page: z.number().optional().describe("Results per page"),
    }, async ({ page, per_page }) => {
        const params = {};
        if (page !== undefined)
            params.page = String(page);
        if (per_page !== undefined)
            params.per_page = String(per_page);
        const data = await client.get("/pages", params);
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
    server.tool("get_page", "Get a page with its full content.", {
        id: z.string().describe("The page UUID"),
    }, async ({ id }) => {
        const data = await client.get(`/pages/${id}`);
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
    server.tool("create_page", "Create a new page.", {
        title: z.string().describe("Page title"),
        parent_id: z.string().optional().describe("Parent page UUID (for nesting)"),
        project_id: z.string().optional().describe("Project UUID (for project-scoped pages)"),
        icon: z.string().optional().describe("Page icon (emoji)"),
    }, async (input) => {
        const data = await client.post("/pages", input);
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
    server.tool("update_page_content", "Update a page's content (Tiptap JSON format).", {
        id: z.string().describe("The page UUID"),
        content: z.any().describe("Page content in Tiptap JSON format"),
    }, async ({ id, content }) => {
        const data = await client.put(`/pages/${id}/content`, { content });
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
    server.tool("get_page_tree", "Get the full page tree hierarchy.", {}, async () => {
        const data = await client.get("/pages/tree");
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
    server.tool("update_page", "Update a page's metadata (title, icon, parent).", {
        id: z.string().describe("The page UUID"),
        title: z.string().optional().describe("Page title"),
        icon: z.string().optional().describe("Page icon (emoji)"),
        parent_id: z.string().optional().describe("Parent page UUID"),
    }, async ({ id, ...fields }) => {
        const data = await client.put(`/pages/${id}`, fields);
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
    server.tool("delete_page", "Delete a page and all its children. This cannot be undone.", {
        id: z.string().describe("The page UUID"),
    }, async ({ id }) => {
        await client.delete(`/pages/${id}`);
        return {
            content: [{ type: "text", text: `Page ${id} deleted successfully.` }],
        };
    });
}
//# sourceMappingURL=pages.js.map