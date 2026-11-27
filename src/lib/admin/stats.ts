/* Orders se ginti nikalne wale saade functions (koi browser / storage nahi), taaki demo backend aur
   pages dono inhe use kar sakein. Asli backend yahi ginti apne database se karega. */
import { LOW_STOCK } from "@/lib/config";
import type { Order, OrderStatus } from "@/lib/types";
import type { AdminCustomer, AdminProduct, AdminStats, DaySales, TopProduct } from "./types";

/** An order counts as a sale when it was not cancelled and is paid, or will be paid on delivery. */
export function isSale(o: Order) {
  return o.status !== "cancelled" && (o.paymentStatus === "paid" || o.paymentStatus === "cod");
}

export function needsWork(status: OrderStatus) {
  return status === "placed" || status === "packed" || status === "out_for_delivery";
}

/** The step an order moves to next, or null when it is finished. */
export function nextStatus(status: OrderStatus): OrderStatus | null {
  if (status === "placed") return "packed";
  if (status === "packed") return "out_for_delivery";
  if (status === "out_for_delivery") return "delivered";
  return null;
}

/** "2026-11-27" in the browser's own time zone (an order at 1 am belongs to that day, not the day before). */
export function dayKey(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function lastDays(orders: Order[], now: Date, count = 7): DaySales[] {
  const days: DaySales[] = [];
  for (let back = count - 1; back >= 0; back--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - back);
    days.push({ date: dayKey(d), label: d.toLocaleDateString("en-IN", { weekday: "short" }), orders: 0, sales: 0 });
  }
  for (const o of orders) {
    const day = days.find((d) => d.date === dayKey(new Date(o.createdAt)));
    if (!day) continue;
    day.orders += 1;
    if (isSale(o)) day.sales += o.total;
  }
  return days;
}

export function topProducts(orders: Order[], limit = 5): TopProduct[] {
  const byId = new Map<string, TopProduct>();
  for (const o of orders) {
    if (!isSale(o)) continue;
    for (const l of o.lines) {
      const row = byId.get(l.productId) ?? { productId: l.productId, name: l.name, size: l.size, qty: 0, sales: 0 };
      row.qty += l.qty;
      row.sales += l.price * l.qty;
      byId.set(l.productId, row);
    }
  }
  return [...byId.values()].sort((a, b) => b.qty - a.qty || b.sales - a.sales).slice(0, limit);
}

/** One row per mobile number, the newest order's name and city, biggest spender first. */
export function customersOf(orders: Order[]): AdminCustomer[] {
  const byPhone = new Map<string, AdminCustomer>();
  for (const o of orders) {
    const have = byPhone.get(o.address.phone);
    const row = have ?? { phone: o.address.phone, name: o.address.name, city: o.address.city, orders: 0, spent: 0, lastOrderAt: o.createdAt };
    row.orders += 1;
    if (isSale(o)) row.spent += o.total;
    if (!have || o.createdAt >= row.lastOrderAt) {
      row.lastOrderAt = o.createdAt;
      row.name = o.address.name;
      row.city = o.address.city;
    }
    byPhone.set(row.phone, row);
  }
  return [...byPhone.values()].sort((a, b) => b.spent - a.spent || b.orders - a.orders);
}

export function isLowStock(p: AdminProduct) {
  return p.active && p.stock <= LOW_STOCK;
}

export function statsOf(orders: Order[], products: AdminProduct[], now: Date): AdminStats {
  const today = dayKey(now);
  const todays = orders.filter((o) => dayKey(new Date(o.createdAt)) === today);
  const sum = (list: Order[]) => list.filter(isSale).reduce((total, o) => total + o.total, 0);
  return {
    ordersToday: todays.length,
    salesToday: sum(todays),
    ordersTotal: orders.length,
    salesTotal: sum(orders),
    toProcess: orders.filter((o) => needsWork(o.status)).length,
    customers: new Set(orders.map((o) => o.address.phone)).size,
    lowStock: products.filter(isLowStock).length,
    days: lastDays(orders, now),
    topProducts: topProducts(orders),
  };
}
