import { z } from "zod";
export function registerProjectTools(server, client) {
    server.tool("list_projects", "List all projects in the organization. Returns projects grouped by area with status and member info.", {
        page: z.number().optional().describe("Page number (0-based)"),
        per_page: z.number().optional().describe("Results per page (default 50)"),
    }, async ({ page, per_page }) => {
        const params = {};
        if (page !== undefined)
            params.page = String(page);
        if (per_page !== undefined)
            params.per_page = String(per_page);
        const data = await client.get("/projects", params);
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
    server.tool("get_project", "Get detailed information about a specific project.", {
        id: z.string().describe("The project UUID"),
    }, async ({ id }) => {
        const data = await client.get(`/projects/${id}`);
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
    server.tool("create_project", "Create a new project.", {
        name: z.string().describe("Project name"),
        description: z.string().optional().describe("Project description"),
        client_id: z.string().optional().describe("Associated client UUID"),
        area_id: z.string().optional().describe("Area/group UUID"),
        status: z
            .enum(["active", "archived", "completed"])
            .optional()
            .describe("Project status (default: active)"),
    }, async (input) => {
        const data = await client.post("/projects", input);
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
    server.tool("get_project_board", "Get the full kanban board for a project — all columns with their tasks, assignees, tags, subtask counts, and time tracked.", {
        id: z.string().describe("The project UUID"),
    }, async ({ id }) => {
        const data = await client.get(`/projects/${id}/columns`);
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
}
//# sourceMappingURL=projects.js.map