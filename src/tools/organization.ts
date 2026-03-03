import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { DversumClient } from "../client.js";

export function registerOrganizationTools(
  server: McpServer,
  client: DversumClient
) {
  server.tool(
    "get_organization",
    "Get details about an organization.",
    {
      id: z.string().describe("The organization UUID"),
    },
    async ({ id }) => {
      const data = await client.get(`/organizations/${id}`);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "list_members",
    "List all members of an organization.",
    {
      id: z.string().describe("The organization UUID"),
    },
    async ({ id }) => {
      const data = await client.get(`/organizations/${id}/members`);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "update_organization",
    "Update organization settings.",
    {
      id: z.string().describe("The organization UUID"),
      name: z.string().optional().describe("Organization name"),
    },
    async ({ id, ...fields }) => {
      const data = await client.put(`/organizations/${id}`, fields);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "invite_member",
    "Invite a new member to the organization via email.",
    {
      org_id: z.string().describe("The organization UUID"),
      email: z.string().describe("Email address to invite"),
      role: z.enum(["admin", "member"]).optional().describe("Role (default: member)"),
    },
    async ({ org_id, ...input }) => {
      const data = await client.post(`/organizations/${org_id}/invite`, input);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "update_member_role",
    "Update a member's role in the organization.",
    {
      org_id: z.string().describe("The organization UUID"),
      user_id: z.string().describe("The user UUID"),
      role: z.enum(["admin", "member"]).describe("New role"),
    },
    async ({ org_id, user_id, role }) => {
      const data = await client.put(`/organizations/${org_id}/members/${user_id}`, { role });
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "remove_member",
    "Remove a member from the organization.",
    {
      org_id: z.string().describe("The organization UUID"),
      user_id: z.string().describe("The user UUID to remove"),
    },
    async ({ org_id, user_id }) => {
      await client.delete(`/organizations/${org_id}/members/${user_id}`);
      return {
        content: [{ type: "text", text: `Member ${user_id} removed from organization.` }],
      };
    }
  );

  server.tool(
    "global_search",
    "Search across all entities (clients, projects, tasks, invoices, etc.).",
    {
      query: z.string().describe("Search query"),
    },
    async ({ query }) => {
      const data = await client.get("/search", { q: query });
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "get_activity_feed",
    "Get the recent activity feed.",
    {},
    async () => {
      const data = await client.get("/activity");
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );
}
