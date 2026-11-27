"use client";

import type { AdminUser } from "@/lib/admin/types";
import { createPersistedStore, useHydrated } from "./createStore";

interface AdminAuthState {
  admin: AdminUser | null;
  token: string | null;
}

/* Admin ka login customer ke login se alag rakha hai (alag key, alag token). */
const store = createPersistedStore<AdminAuthState>("selpak.admin.v1", { admin: null, token: null });

export const adminAuth = {
  signIn(admin: AdminUser, token: string) {
    store.set({ admin, token });
  },
  signOut() {
    store.set({ admin: null, token: null });
  },
  token: () => store.get().token,
  admin: () => store.get().admin,
};

export function useAdminAuth() {
  return store.useStore();
}

/** `key` once an admin is logged in (and the browser has loaded the login), else null.
    Admin pages give this to useAsync, so nothing is fetched or kept on screen without a login. */
export function useAdminKey(key: string | null) {
  const hydrated = useHydrated();
  const { admin } = store.useStore();
  return hydrated && admin ? key : null;
}
