import type { Order, OrderStatus, Product } from "@/lib/types";

export interface AdminUser {
  name: string;
}

/** A catalogue product as the shop owner sees it: with stock, and whether it is on sale. */
export interface AdminProduct extends Product {
  stock: number;
  active: boolean;
}

export interface ProductPatch {
  mrp?: number;
  stock?: number;
  active?: boolean;
}

export interface AdminCustomer {
  phone: string;
  name: string;
  city: string;
  orders: number;
  spent: number; // rupees, counted like "sales" (see stats.ts)
  lastOrderAt: string; // ISO date
}

export interface DaySales {
  date: string; // YYYY-MM-DD, local time
  label: string; // "Mon", "Tue", ...
  orders: number;
  sales: number;
}

export interface TopProduct {
  productId: string;
  name: string;
  size: string;
  qty: number;
  sales: number;
}

export interface AdminStats {
  ordersToday: number;
  salesToday: number;
  ordersTotal: number;
  salesTotal: number;
  /** placed, packed or out for delivery: still needs work */
  toProcess: number;
  customers: number;
  lowStock: number;
  days: DaySales[]; // last 7 days, oldest first
  topProducts: TopProduct[];
}

/* Admin panel ko backend se yahi functions chahiye. Endpoints API_CONTRACT.md ke "Admin" hisse me hain. */
export interface AdminApi {
  login(username: string, password: string): Promise<{ admin: AdminUser; token: string }>;
  getStats(): Promise<AdminStats>;
  getOrders(): Promise<Order[]>;
  getOrder(id: string): Promise<Order | null>;
  updateOrderStatus(id: string, status: OrderStatus): Promise<Order>;
  getProducts(): Promise<AdminProduct[]>;
  updateProduct(id: string, patch: ProductPatch): Promise<AdminProduct>;
  getCustomers(): Promise<AdminCustomer[]>;
  /** demo mode only: adds a few sample orders so the panel has something to show; returns how many were added */
  addSampleOrders(): Promise<number>;
}
