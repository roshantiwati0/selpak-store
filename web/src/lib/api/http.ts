/* ASLI backend ke liye. NEXT_PUBLIC_API_URL set hone par yeh use hota hai.
   Endpoints docs/API_CONTRACT.md ke hisaab se hain; backend team ke saath confirm karke hi badlo.
   NOTE: yeh code abhi kisi asli server ke saath test nahi hua hai. */
import { API_URL } from "@/lib/config";
import type { Order, User } from "@/lib/types";
import { auth } from "@/store/auth";
import { ApiError, type Api, type RazorpayOrder } from "./types";

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = auth.token();
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
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
  if (res.status === 401) auth.signOut();
  if (res.status === 204) return undefined as T;
  const body = (await res.json().catch(() => null)) as { message?: string } | null;
  if (!res.ok) throw new ApiError(body?.message ?? "Something went wrong. Please try again.", res.status);
  return body as T;
}

const post = <T>(path: string, data?: unknown) =>
  request<T>(path, { method: "POST", body: data === undefined ? undefined : JSON.stringify(data) });

export const httpApi: Api = {
  requestOtp: (phone) => post<void>("/auth/otp", { phone }),
  verifyOtp: (phone, otp) => post<{ user: User; token: string }>("/auth/verify", { phone, otp }),
  checkPincode: (pincode) => request(`/delivery/pincode/${encodeURIComponent(pincode)}`),
  createOrder: (input) => post<Order>("/orders", input),
  createRazorpayOrder: (orderId) => post<RazorpayOrder>(`/orders/${encodeURIComponent(orderId)}/razorpay`),
  verifyPayment: (orderId, result) => post<Order>(`/orders/${encodeURIComponent(orderId)}/verify-payment`, result),
  demoPayment: async () => {
    throw new ApiError("Demo payment is not available with the real backend.", 400);
  },
  getOrders: () => request<Order[]>("/orders"),
  getOrder: async (id) => {
    try {
      return await request<Order>(`/orders/${encodeURIComponent(id)}`);
    } catch (e) {
      if (e instanceof ApiError && e.status === 404) return null;
      throw e;
    }
  },
  sendMessage: (input) => post<void>("/contact", input),
};
