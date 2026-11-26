"use client";

import { useSyncExternalStore } from "react";

export interface Toast {
  id: number;
  message: string;
  action?: { label: string; href: string };
}

let toasts: Toast[] = [];
let nextId = 1;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const EMPTY: Toast[] = [];

export function toast(message: string, action?: Toast["action"]) {
  const id = nextId++;
  toasts = [...toasts.slice(-2), { id, message, action }];
  emit();
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  }, 3500);
}

export function useToasts() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => toasts,
    () => EMPTY,
  );
}
