"use client";

import { getProduct } from "@/lib/catalog";
import { DELIVERY_FEE } from "@/lib/config";
import type { CartItem, Product } from "@/lib/types";
import { createPersistedStore } from "./createStore";

const MAX_QTY = 20;
const store = createPersistedStore<CartItem[]>("selpak.cart.v1", []);

const clamp = (n: number) => Math.max(1, Math.min(MAX_QTY, Math.round(n)));

export const cart = {
  add(productId: string, qty = 1) {
    store.set((items) => {
      const found = items.find((i) => i.productId === productId);
      if (found) return items.map((i) => (i.productId === productId ? { ...i, qty: clamp(i.qty + qty) } : i));
      return [...items, { productId, qty: clamp(qty) }];
    });
  },
  setQty(productId: string, qty: number) {
    store.set((items) => items.map((i) => (i.productId === productId ? { ...i, qty: clamp(qty) } : i)));
  },
  remove(productId: string) {
    store.set((items) => items.filter((i) => i.productId !== productId));
  },
  clear() {
    store.set([]);
  },
  replace(items: CartItem[]) {
    store.set(items.map((i) => ({ ...i, qty: clamp(i.qty) })));
  },
};

export interface CartLine {
  product: Product;
  qty: number;
  lineTotal: number;
}

export function summarise(items: CartItem[]) {
  const lines: CartLine[] = [];
  for (const item of items) {
    const product = getProduct(item.productId);
    if (product) lines.push({ product, qty: item.qty, lineTotal: product.mrp * item.qty });
  }
  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);
  const count = lines.reduce((sum, l) => sum + l.qty, 0);
  const deliveryFee = lines.length ? DELIVERY_FEE : 0;
  return { lines, subtotal, count, deliveryFee, total: subtotal + deliveryFee };
}

export function useCart() {
  return summarise(store.useStore());
}

export { MAX_QTY };
