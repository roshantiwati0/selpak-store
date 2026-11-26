import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderView } from "@/components/OrderView";

export const metadata: Metadata = { title: "Order details", robots: { index: false } };

export default function OrderPage() {
  return (
    <Suspense
      fallback={
        <main className="container">
          <p className="muted" style={{ padding: "60px 0" }}>
            Loading order…
          </p>
        </main>
      }
    >
      <OrderView />
    </Suspense>
  );
}
