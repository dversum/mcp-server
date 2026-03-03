import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { DversumClient } from "../client.js";

export function registerTaskTools(
  server: McpServer,
  client: DversumClient
) {
  server.tool(
    "get_task",
    "Get detailed information about a task including description, assignees, subtasks, tags, time tracked, and child tasks.",
    {
      id: z.string().describe("The task UUID"),
    },
    async ({ id }) => {
      const data = await client.get(`/tasks/${id}`);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "create_task",
    "Create a new task in a project column.",
    {
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
    },
    async (input) => {
      const data = await client.post("/tasks", input);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "update_task",
    "Update an existing task's properties.",
    {
      id: z.string().describe("The task UUID"),
      title: z.string().optional().describe("Task title"),
      description: z.string().optional().describe("Task description"),
      due_date: z.string().optional().describe("Due date (YYYY-MM-DD)"),
      priority: z
        .enum(["low", "medium", "high", "urgent"])
        .optional()
        .describe("Task priority"),
    },
    async ({ id, ...fields }) => {
      const data = await client.put(`/tasks/${id}`, fields);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "move_task",
    "Move a task to a different column (changes its status on the kanban board).",
    {
      id: z.string().describe("The task UUID"),
      column_id: z.string().describe("Target column UUID"),
    },
    async ({ id, column_id }) => {
      const data = await client.patch(`/tasks/${id}/move`, { column_id });
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "assign_task",
    "Add an assignee to a task.",
    {
      task_id: z.string().describe("The task UUID"),
      user_id: z.string().describe("The user UUID to assign"),
    },
    async ({ task_id, user_id }) => {
      const data = await client.post(`/tasks/${task_id}/assignees`, {
        user_id,
      });
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "list_task_comments",
    "List all comments on a task.",
    {
      task_id: z.string().describe("The task UUID"),
    },
    async ({ task_id }) => {
      const data = await client.get(`/tasks/${task_id}/comments`);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "delete_task",
    "Delete a task. This cannot be undone.",
    {
      id: z.string().describe("The task UUID"),
    },
    async ({ id }) => {
      await client.delete(`/tasks/${id}`);
      return {
        content: [{ type: "text", text: `Task ${id} deleted successfully.` }],
      };
    }
  );

  server.tool(
    "create_subtask",
    "Create a subtask (checklist item) on a task.",
    {
      task_id: z.string().describe("The parent task UUID"),
      title: z.string().describe("Subtask title"),
    },
    async ({ task_id, title }) => {
      const data = await client.post(`/tasks/${task_id}/subtasks`, { title });
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "toggle_task_done",
    "Toggle a task's completion status.",
    {
      id: z.string().describe("The task UUID"),
    },
    async ({ id }) => {
      const data = await client.patch(`/tasks/${id}/toggle-done`);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "remove_assignee",
    "Remove an assignee from a task.",
    {
      task_id: z.string().describe("The task UUID"),
      user_id: z.string().describe("The user UUID to remove"),
    },
    async ({ task_id, user_id }) => {
      await client.delete(`/tasks/${task_id}/assignees/${user_id}`);
      return {
        content: [{ type: "text", text: `Assignee removed from task.` }],
      };
    }
  );

  server.tool(
    "add_tag_to_task",
    "Add a tag to a task.",
    {
      task_id: z.string().describe("The task UUID"),
      tag_id: z.string().describe("The tag UUID"),
    },
    async ({ task_id, tag_id }) => {
      const data = await client.post(`/tasks/${task_id}/tags`, { tag_id });
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "remove_tag_from_task",
    "Remove a tag from a task.",
    {
      task_id: z.string().describe("The task UUID"),
      tag_id: z.string().describe("The tag UUID"),
    },
    async ({ task_id, tag_id }) => {
      await client.delete(`/tasks/${task_id}/tags/${tag_id}`);
      return {
        content: [{ type: "text", text: `Tag removed from task.` }],
      };
    }
  );

  server.tool(
    "archive_task",
    "Archive a task.",
    {
      id: z.string().describe("The task UUID"),
    },
    async ({ id }) => {
      const data = await client.patch(`/tasks/${id}/archive`);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "restore_task",
    "Restore an archived task.",
    {
      id: z.string().describe("The task UUID"),
    },
    async ({ id }) => {
      const data = await client.patch(`/tasks/${id}/restore`);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "move_task_to_project",
    "Move a task to a different project.",
    {
      id: z.string().describe("The task UUID"),
      project_id: z.string().describe("Target project UUID"),
      column_id: z.string().describe("Target column UUID in the new project"),
    },
    async ({ id, project_id, column_id }) => {
      const data = await client.patch(`/tasks/${id}/move-to-project`, { project_id, column_id });
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "create_comment",
    "Add a comment to a task.",
    {
      task_id: z.string().describe("The task UUID"),
      body: z.string().describe("Comment text (HTML supported)"),
    },
    async ({ task_id, body }) => {
      const data = await client.post(`/tasks/${task_id}/comments`, { content: body });
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );
}
