// shared/lib/async-context.ts
import { AsyncLocalStorage } from "async_hooks";

type Store = {
  userId?: string;
  email?: string;
};

export const asyncLocalStorage = new AsyncLocalStorage<Store>();

export function setUserContext(userId: string, email: string) {
  asyncLocalStorage.enterWith({ userId, email });
}

export function getUserContext() {
  return asyncLocalStorage.getStore();
}
