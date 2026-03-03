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
    server.tool("update_project", "Update an existing project's details.", {
        id: z.string().describe("The project UUID"),
        name: z.string().optional().describe("Project name"),
        description: z.string().optional().describe("Project description"),
        client_id: z.string().optional().describe("Associated client UUID"),
        area_id: z.string().optional().describe("Area/group UUID"),
        status: z.enum(["active", "archived", "completed"]).optional().describe("Project status"),
    }, async ({ id, ...fields }) => {
        const data = await client.put(`/projects/${id}`, fields);
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
    server.tool("delete_project", "Delete a project. This cannot be undone.", {
        id: z.string().describe("The project UUID"),
    }, async ({ id }) => {
        await client.delete(`/projects/${id}`);
        return {
            content: [{ type: "text", text: `Project ${id} deleted successfully.` }],
        };
    });
    server.tool("list_project_members", "List all members of a project.", {
        id: z.string().describe("The project UUID"),
    }, async ({ id }) => {
        const data = await client.get(`/projects/${id}/members`);
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
    server.tool("add_project_member", "Add a member to a project.", {
        project_id: z.string().describe("The project UUID"),
        user_id: z.string().describe("The user UUID to add"),
    }, async ({ project_id, user_id }) => {
        const data = await client.post(`/projects/${project_id}/members`, { user_id });
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
    server.tool("remove_project_member", "Remove a member from a project.", {
        project_id: z.string().describe("The project UUID"),
        user_id: z.string().describe("The user UUID to remove"),
    }, async ({ project_id, user_id }) => {
        await client.delete(`/projects/${project_id}/members/${user_id}`);
        return {
            content: [{ type: "text", text: `Member ${user_id} removed from project.` }],
        };
    });
    server.tool("get_project_time_stats", "Get time tracking statistics for a specific project.", {
        id: z.string().describe("The project UUID"),
    }, async ({ id }) => {
        const data = await client.get(`/projects/${id}/time-stats`);
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
    server.tool("get_gantt_data", "Get Gantt chart data for a project (tasks with dates and dependencies).", {
        id: z.string().describe("The project UUID"),
    }, async ({ id }) => {
        const data = await client.get(`/projects/${id}/gantt`);
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
    server.tool("create_column", "Create a new column in a project's kanban board.", {
        project_id: z.string().describe("The project UUID"),
        name: z.string().describe("Column name"),
    }, async ({ project_id, name }) => {
        const data = await client.post(`/projects/${project_id}/columns`, { name });
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
}
//# sourceMappingURL=projects.js.map