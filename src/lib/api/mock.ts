/* DEMO backend: sab kuch browser ke localStorage me rehta hai.
   Asli backend aane par yeh file use nahi hogi (dekho ./index.ts). */
import { getProduct } from "@/lib/catalog";
import { DELIVERY_FEE, DEMO_OTP } from "@/lib/config";
import { isPhone, isPincode } from "@/lib/format";
import type { Order, OrderLine } from "@/lib/types";
import { auth } from "@/store/auth";
import { ApiError, type Api } from "./types";

const KEY = "selpak.orders.v1";
const wait = (ms = 450) => new Promise((r) => setTimeout(r, ms));

function readOrders(): Order[] {
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "[]") as Order[];
  } catch {
    return [];
  }
}

function writeOrders(orders: Order[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(orders));
  } catch {
    /* ignore */
  }
}

function updateOrder(id: string, patch: Partial<Order>): Order {
  const orders = readOrders();
  const index = orders.findIndex((o) => o.id === id);
  if (index < 0) throw new ApiError("Order not found", 404);
  orders[index] = { ...orders[index], ...patch };
  writeOrders(orders);
  return orders[index];
}

export const mockApi: Api = {
  async requestOtp(phone) {
    await wait();
    if (!isPhone(phone)) throw new ApiError("Enter a valid 10-digit mobile number.");
  },

  async verifyOtp(phone, otp) {
    await wait();
    if (otp !== DEMO_OTP) throw new ApiError("Incorrect OTP. Please try again.");
    return { user: { phone }, token: `demo-${phone}` };
  },

  async checkPincode(pincode) {
    await wait(300);
    if (!isPincode(pincode)) return { serviceable: false, message: "Enter a valid 6-digit pincode." };
    return { serviceable: true, message: `Delivery available to ${pincode}.` };
  },

  async createOrder({ items, address, paymentMethod }) {
    await wait(600);
    const lines: OrderLine[] = [];
    for (const item of items) {
      const p = getProduct(item.productId);
      if (p) lines.push({ productId: p.id, name: `Selpak ${p.name}`, size: p.size, price: p.mrp, qty: item.qty });
    }
    if (!lines.length) throw new ApiError("Your cart is empty.");
    const subtotal = lines.reduce((sum, l) => sum + l.price * l.qty, 0);
    const order: Order = {
      id: `SP-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      lines,
      subtotal,
      deliveryFee: DELIVERY_FEE,
      total: subtotal + DELIVERY_FEE,
      address,
      paymentMethod,
      paymentStatus: paymentMethod === "cod" ? "cod" : "pending",
      status: "placed",
    };
    writeOrders([order, ...readOrders()]);
    return order;
  },

  async createRazorpayOrder() {
    throw new ApiError("Online payment needs the backend. Demo mode uses a test payment screen.", 501);
  },

  async verifyPayment() {
    throw new ApiError("Online payment needs the backend.", 501);
  },

  async demoPayment(orderId, success) {
    await wait(700);
    return updateOrder(orderId, { paymentStatus: success ? "paid" : "failed" });
  },

  async getOrders() {
    await wait(300);
    const phone = auth.user()?.phone;
    if (!phone) throw new ApiError("Please log in to see your orders.", 401);
    return readOrders().filter((o) => o.address.phone === phone);
  },

  async getOrder(id) {
    await wait(200);
    return readOrders().find((o) => o.id === id) ?? null;
  },

  async sendMessage() {
    await wait(600);
  },
};
