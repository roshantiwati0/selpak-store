import type { Address, CartItem, Order, PaymentMethod, User } from "@/lib/types";

export interface CreateOrderInput {
  items: CartItem[];
  address: Address;
  paymentMethod: PaymentMethod;
}

export interface RazorpayOrder {
  razorpayOrderId: string;
  amount: number; // paise
  currency: "INR";
}

export interface RazorpayResult {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

/* Frontend ko backend se yahi functions chahiye. Poora detail API_CONTRACT.md me hai (team ke paas). */
export interface Api {
  requestOtp(phone: string): Promise<void>;
  verifyOtp(phone: string, otp: string): Promise<{ user: User; token: string }>;
  checkPincode(pincode: string): Promise<{ serviceable: boolean; message: string }>;
  createOrder(input: CreateOrderInput): Promise<Order>;
  createRazorpayOrder(orderId: string): Promise<RazorpayOrder>;
  verifyPayment(orderId: string, result: RazorpayResult): Promise<Order>;
  /** demo mode only: marks the order paid or failed without a gateway */
  demoPayment(orderId: string, success: boolean): Promise<Order>;
  getOrders(): Promise<Order[]>;
  getOrder(id: string): Promise<Order | null>;
  sendMessage(input: { name: string; phone: string; topic: string; message: string }): Promise<void>;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
    this.name = "ApiError";
  }
}
