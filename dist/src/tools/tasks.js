import { z } from "zod";
export function registerTaskTools(server, client) {
    server.tool("get_task", "Get detailed information about a task including description, assignees, subtasks, tags, time tracked, and child tasks.", {
        id: z.string().describe("The task UUID"),
    }, async ({ id }) => {
        const data = await client.get(`/tasks/${id}`);
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
    server.tool("create_task", "Create a new task in a project column.", {
        project_id: z.string().describe("The project UUID"),
        column_id: z.string().describe("The column UUID to place the task in"),
        title: z.string().describe("Task title"),
        description: z.string().optional().describe("Task description (HTML supported)"),
        due_date: z.string().optional().describe("Due date in ISO 8601 format (YYYY-MM-DD)"),
        priority: z
            .enum(["low", "medium", "high", "urgent"])
            .optional()
            .describe("Task priority"),
        parent_id: z.string().optional().describe("Parent task UUID (for child tasks)"),
    }, async (input) => {
        const data = await client.post("/tasks", input);
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
    server.tool("update_task", "Update an existing task's properties.", {
        id: z.string().describe("The task UUID"),
        title: z.string().optional().describe("Task title"),
        description: z.string().optional().describe("Task description"),
        due_date: z.string().optional().describe("Due date (YYYY-MM-DD)"),
        priority: z
            .enum(["low", "medium", "high", "urgent"])
            .optional()
            .describe("Task priority"),
    }, async ({ id, ...fields }) => {
        const data = await client.put(`/tasks/${id}`, fields);
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
    server.tool("move_task", "Move a task to a different column (changes its status on the kanban board).", {
        id: z.string().describe("The task UUID"),
        column_id: z.string().describe("Target column UUID"),
    }, async ({ id, column_id }) => {
        const data = await client.patch(`/tasks/${id}/move`, { column_id });
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
    server.tool("assign_task", "Add an assignee to a task.", {
        task_id: z.string().describe("The task UUID"),
        user_id: z.string().describe("The user UUID to assign"),
    }, async ({ task_id, user_id }) => {
        const data = await client.post(`/tasks/${task_id}/assignees`, {
            user_id,
        });
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
    server.tool("list_task_comments", "List all comments on a task.", {
        task_id: z.string().describe("The task UUID"),
    }, async ({ task_id }) => {
        const data = await client.get(`/tasks/${task_id}/comments`);
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
}
//# sourceMappingURL=tasks.js.map