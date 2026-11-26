"use client";

import type { User } from "@/lib/types";
import { createPersistedStore } from "./createStore";

interface AuthState {
  user: User | null;
  token: string | null;
}

const store = createPersistedStore<AuthState>("selpak.auth.v1", { user: null, token: null });

export const auth = {
  signIn(user: User, token: string) {
    store.set({ user, token });
  },
  signOut() {
    store.set({ user: null, token: null });
  },
  updateName(name: string) {
    store.set((s) => (s.user ? { ...s, user: { ...s.user, name } } : s));
  },
  token: () => store.get().token,
  user: () => store.get().user,
};

export function useAuth() {
  return store.useStore();
}
