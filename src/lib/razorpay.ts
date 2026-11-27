"use client";

/* Razorpay Checkout (asli payment). Sirf tab chalta hai jab backend + NEXT_PUBLIC_RAZORPAY_KEY_ID ho.
   Flow: backend Razorpay order banata hai -> yahan popup khulta hai -> backend signature verify karta hai.
   NOTE: asli Razorpay account ke saath abhi test nahi hua hai. */
import { api } from "@/lib/api";
import { RAZORPAY_KEY_ID, SITE } from "@/lib/config";
import type { RazorpayResult } from "@/lib/api/types";
import type { Order } from "@/lib/types";

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: { name?: string; contact?: string; email?: string };
  theme: { color: string };
  handler: (result: RazorpayResult) => void;
  modal: { ondismiss: () => void };
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => { open: () => void };
  }
}

function loadScript(): Promise<boolean> {
  if (window.Razorpay) return Promise.resolve(true);
  return new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export type PayOutcome = { status: "paid"; order: Order } | { status: "dismissed" } | { status: "failed"; message: string };

export async function payWithRazorpay(order: Order): Promise<PayOutcome> {
  if (!(await loadScript()) || !window.Razorpay) {
    return { status: "failed", message: "Could not load the payment screen. Check your internet connection." };
  }
  const rp = await api.createRazorpayOrder(order.id);
  const Razorpay = window.Razorpay;
  return new Promise((resolve) => {
    new Razorpay({
      key: RAZORPAY_KEY_ID,
      amount: rp.amount,
      currency: rp.currency,
      name: SITE.name,
      description: `Order ${order.id}`,
      order_id: rp.razorpayOrderId,
      prefill: { name: order.address.name, contact: order.address.phone, email: order.address.email },
      theme: { color: "#0B5ED7" },
      handler: (result) => {
        api
          .verifyPayment(order.id, result)
          .then((paid) => resolve({ status: "paid", order: paid }))
          .catch(() => resolve({ status: "failed", message: "Payment could not be verified. If money was deducted, contact us." }));
      },
      modal: { ondismiss: () => resolve({ status: "dismissed" }) },
    }).open();
  });
}
