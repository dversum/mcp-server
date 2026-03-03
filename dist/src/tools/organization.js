import { z } from "zod";
export function registerOrganizationTools(server, client) {
    server.tool("get_organization", "Get details about an organization.", {
        id: z.string().describe("The organization UUID"),
    }, async ({ id }) => {
        const data = await client.get(`/organizations/${id}`);
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
    server.tool("list_members", "List all members of an organization.", {
        id: z.string().describe("The organization UUID"),
    }, async ({ id }) => {
        const data = await client.get(`/organizations/${id}/members`);
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
}
//# sourceMappingURL=organization.js.map