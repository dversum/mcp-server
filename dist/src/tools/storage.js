import { z } from "zod";
export function registerStorageTools(server, client) {
    server.tool("list_files", "List files in a folder (or root if no folder specified).", {
        folder_id: z.string().optional().describe("Folder UUID (omit for root)"),
        search: z.string().optional().describe("Search files by name"),
    }, async ({ folder_id, search }) => {
        const params = {};
        if (folder_id)
            params.folder_id = folder_id;
        if (search)
            params.search = search;
        const data = await client.get("/storage/files", params);
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
    server.tool("list_folders", "List folders (or subfolders of a parent folder).", {
        parent_id: z.string().optional().describe("Parent folder UUID (omit for root)"),
    }, async ({ parent_id }) => {
        const params = {};
        if (parent_id)
            params.parent_id = parent_id;
        const data = await client.get("/storage/folders", params);
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
    server.tool("create_folder", "Create a new folder.", {
        name: z.string().describe("Folder name"),
        parent_id: z.string().optional().describe("Parent folder UUID"),
        color: z.string().optional().describe("Folder color"),
    }, async (input) => {
        const data = await client.post("/storage/folders", input);
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
    server.tool("get_folder_tree", "Get the full folder hierarchy tree.", {}, async () => {
        const data = await client.get("/storage/folders/tree");
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
    server.tool("update_folder", "Update a folder's name or color.", {
        id: z.string().describe("The folder UUID"),
        name: z.string().optional().describe("Folder name"),
        color: z.string().optional().describe("Folder color"),
    }, async ({ id, ...fields }) => {
        const data = await client.put(`/storage/folders/${id}`, fields);
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
    server.tool("delete_folder", "Delete a folder and all its contents.", {
        id: z.string().describe("The folder UUID"),
    }, async ({ id }) => {
        await client.delete(`/storage/folders/${id}`);
        return {
            content: [{ type: "text", text: `Folder ${id} deleted successfully.` }],
        };
    });
    server.tool("get_file", "Get details about a specific file.", {
        id: z.string().describe("The file UUID"),
    }, async ({ id }) => {
        const data = await client.get(`/storage/files/${id}`);
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
    server.tool("delete_file", "Delete a file from storage.", {
        id: z.string().describe("The file UUID"),
    }, async ({ id }) => {
        await client.delete(`/storage/files/${id}`);
        return {
            content: [{ type: "text", text: `File ${id} deleted successfully.` }],
        };
    });
    server.tool("get_file_download_url", "Get a presigned download URL for a file.", {
        id: z.string().describe("The file UUID"),
    }, async ({ id }) => {
        const data = await client.get(`/storage/files/${id}/download`);
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
    server.tool("create_share_link", "Create a share link for a file (WeTransfer-style).", {
        file_id: z.string().describe("The file UUID to share"),
        password: z.string().optional().describe("Optional password protection"),
        max_downloads: z.number().optional().describe("Maximum number of downloads"),
        expires_in_days: z.number().optional().describe("Expiry in days"),
    }, async (input) => {
        const data = await client.post("/storage/shares", input);
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
    server.tool("list_share_links", "List all active share links.", {}, async () => {
        const data = await client.get("/storage/shares");
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    });
    server.tool("revoke_share_link", "Revoke/delete a share link.", {
        share_id: z.string().describe("The share link UUID"),
    }, async ({ share_id }) => {
        await client.delete(`/storage/shares/${share_id}`);
        return {
            content: [{ type: "text", text: `Share link revoked.` }],
        };
    });
}
//# sourceMappingURL=storage.js.map