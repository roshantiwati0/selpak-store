/* Admin panel ka ASLI backend. NEXT_PUBLIC_API_URL set hone par yeh use hota hai.
   Endpoints API_CONTRACT.md ke "Admin" hisse ke hisaab se hain; backend team ke saath confirm karke hi badlo.
   NOTE: yeh code abhi kisi asli server ke saath test nahi hua hai. */
import { ApiError } from "@/lib/api/types";
import { API_URL } from "@/lib/config";
import type { Order } from "@/lib/types";
import { adminAuth } from "@/store/adminAuth";
import type { AdminApi, AdminCustomer, AdminProduct, AdminStats, AdminUser } from "./types";

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = adminAuth.token();
  let res: Response;
  try {
    res = await fetch(`${API_URL}/admin${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init.headers,
      },
    });
  } catch {
    throw new ApiError("Could not reach the server. Check your internet connection.", 0);
  }
  if (res.status === 401 && path !== "/auth/login") adminAuth.signOut();
  if (res.status === 204) return undefined as T;
  const body = (await res.json().catch(() => null)) as { message?: string } | null;
  if (!res.ok) throw new ApiError(body?.message ?? "Something went wrong. Please try again.", res.status);
  return body as T;
}

const send = <T>(method: "POST" | "PATCH", path: string, data?: unknown) =>
  request<T>(path, { method, body: data === undefined ? undefined : JSON.stringify(data) });

export const httpAdminApi: AdminApi = {
  login: (username, password) => send<{ admin: AdminUser; token: string }>("POST", "/auth/login", { username, password }),
  getStats: () => request<AdminStats>("/stats"),
  getOrders: () => request<Order[]>("/orders"),
  getOrder: async (id) => {
    try {
      return await request<Order>(`/orders/${encodeURIComponent(id)}`);
    } catch (e) {
      if (e instanceof ApiError && e.status === 404) return null;
      throw e;
    }
  },
  updateOrderStatus: (id, status) => send<Order>("PATCH", `/orders/${encodeURIComponent(id)}`, { status }),
  getProducts: () => request<AdminProduct[]>("/products"),
  updateProduct: (id, patch) => send<AdminProduct>("PATCH", `/products/${encodeURIComponent(id)}`, patch),
  getCustomers: () => request<AdminCustomer[]>("/customers"),
  addSampleOrders: async () => {
    throw new ApiError("Sample orders are only for demo mode.", 400);
  },
};
