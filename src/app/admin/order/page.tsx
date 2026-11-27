import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminOrderDetail } from "@/components/admin/AdminOrderDetail";

export const metadata: Metadata = { title: "Order details" };

/* Order ka number URL ke ?id= me aata hai (useSearchParams), isliye Suspense zaruri hai. */
export default function AdminOrderPage() {
  return (
    <Suspense
      fallback={
        <p className="muted" aria-busy="true">
          Loading order…
        </p>
      }
    >
      <AdminOrderDetail />
    </Suspense>
  );
}
