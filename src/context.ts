import { AsyncLocalStorage } from "node:async_hooks";

interface RequestStore {
  token: string;
}

export const requestContext = new AsyncLocalStorage<RequestStore>();

export function getRequestToken(): string | undefined {
  return requestContext.getStore()?.token;
}
