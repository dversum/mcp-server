import { AsyncLocalStorage } from "node:async_hooks";
export const requestContext = new AsyncLocalStorage();
export function getRequestToken() {
    return requestContext.getStore()?.token;
}
//# sourceMappingURL=context.js.map