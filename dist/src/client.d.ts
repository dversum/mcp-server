export declare class DversumClient {
    private baseUrl;
    private fallbackToken;
    constructor(baseUrl: string, fallbackToken: string);
    private buildUrl;
    private request;
    get<T>(path: string, params?: Record<string, string>): Promise<T>;
    post<T>(path: string, body?: unknown): Promise<T>;
    put<T>(path: string, body?: unknown): Promise<T>;
    patch<T>(path: string, body?: unknown): Promise<T>;
    delete(path: string): Promise<void>;
}
//# sourceMappingURL=client.d.ts.map