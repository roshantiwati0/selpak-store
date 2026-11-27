"use client";

import { useSyncExternalStore } from "react";

/* Chhota sa store jo localStorage me save hota hai (cart, login).
   useSyncExternalStore ki wajah se server-render aur browser ka HTML match rehta hai. */
export function createPersistedStore<T>(key: string, initial: T) {
  let state = initial;
  let loaded = false;
  const listeners = new Set<() => void>();

  function load() {
    if (loaded || typeof window === "undefined") return;
    loaded = true;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) state = JSON.parse(raw) as T;
    } catch {
      /* storage blocked or corrupt: keep the initial state */
    }
  }

  function get() {
    load();
    return state;
  }

  function set(next: T | ((prev: T) => T)) {
    load();
    state = typeof next === "function" ? (next as (prev: T) => T)(state) : next;
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      /* ignore: state still works in memory */
    }
    listeners.forEach((l) => l());
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);
    const onStorage = (e: StorageEvent) => {
      if (e.key !== key) return;
      loaded = false;
      load();
      listener();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  }

  function useStore() {
    return useSyncExternalStore(subscribe, get, () => initial);
  }

  return { get, set, subscribe, useStore };
}

/** true only in the browser after hydration; use to avoid showing "empty" before storage loads */
export function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
