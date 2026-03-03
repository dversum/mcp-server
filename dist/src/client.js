import { getRequestToken } from "./context.js";
export class DversumClient {
    baseUrl;
    fallbackToken;
    constructor(baseUrl, fallbackToken) {
        this.baseUrl = baseUrl;
        this.fallbackToken = fallbackToken;
    }
    buildUrl(path, params) {
        const url = new URL(`${this.baseUrl}${path}`);
        if (params) {
            for (const [key, value] of Object.entries(params)) {
                if (value !== undefined && value !== null && value !== "") {
                    url.searchParams.set(key, value);
                }
            }
        }
        return url.toString();
    }
    async request(method, path, options) {
        const url = this.buildUrl(path, options?.params);
        const token = getRequestToken() ?? this.fallbackToken;
        const headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        };
        const fetchOptions = { method, headers };
        if (options?.body !== undefined) {
            fetchOptions.body = JSON.stringify(options.body);
        }
        const response = await fetch(url, fetchOptions);
        if (!response.ok) {
            let errorMessage = `API error ${response.status}: ${response.statusText}`;
            try {
                const errorBody = (await response.json());
                if (errorBody.error) {
                    errorMessage = errorBody.error;
                }
            }
            catch {
                // Use default error message
            }
            throw new Error(errorMessage);
        }
        if (response.status === 204) {
            return undefined;
        }
        return (await response.json());
    }
    async get(path, params) {
        return this.request("GET", path, { params });
    }
    async post(path, body) {
        return this.request("POST", path, { body });
    }
    async put(path, body) {
        return this.request("PUT", path, { body });
    }
    async patch(path, body) {
        return this.request("PATCH", path, { body });
    }
    async delete(path) {
        await this.request("DELETE", path);
    }
}
//# sourceMappingURL=client.js.map