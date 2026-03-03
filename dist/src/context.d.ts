import { AsyncLocalStorage } from "node:async_hooks";
interface RequestStore {
    token: string;
}
export declare const requestContext: AsyncLocalStorage<RequestStore>;
export declare function getRequestToken(): string | undefined;
export {};
//# sourceMappingURL=context.d.ts.map