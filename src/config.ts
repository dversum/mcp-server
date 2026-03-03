export interface Config {
  apiUrl: string;
  apiToken: string;
}

export function loadConfig(): Config {
  const apiUrl = process.env.DVERSUM_API_URL;
  const apiToken = process.env.DVERSUM_API_TOKEN || "";
  const transport = process.env.MCP_TRANSPORT || "stdio";

  if (!apiUrl) {
    throw new Error(
      "DVERSUM_API_URL environment variable is required.\n" +
        "Set it to your dVersum API base URL, e.g. https://api.dversum.com/api/v1"
    );
  }

  // Token is required for stdio mode (single user), optional for HTTP mode (per-user auth via headers)
  if (!apiToken && transport !== "http") {
    throw new Error(
      "DVERSUM_API_TOKEN environment variable is required for stdio mode.\n" +
        "Set it to your dVersum JWT authentication token.\n" +
        "In HTTP mode (MCP_TRANSPORT=http), tokens are provided per-request via Authorization header."
    );
  }

  return {
    apiUrl: apiUrl.replace(/\/+$/, ""),
    apiToken,
  };
}
