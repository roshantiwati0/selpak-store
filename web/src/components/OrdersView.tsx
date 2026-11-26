"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api";
import { productImage } from "@/lib/catalog";
import { formatDate, inr } from "@/lib/format";
import type { Order } from "@/lib/types";
import { useAsync } from "@/lib/useAsync";
import { useAuth } from "@/store/auth";
import { cart } from "@/store/cart";
import { useHydrated } from "@/store/createStore";
import { toast } from "@/store/toast";
import { LoginPrompt } from "./AccountNav";
import { OrderTrack, PaymentBadge, StatusBadge } from "./OrderBits";

type Filter = "all" | "active" | "delivered" | "cancelled";
const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "active", label: "In progress" },
  { id: "delivered", label: "Delivered" },
  { id: "cancelled", label: "Cancelled" },
];

const matches = (o: Order, f: Filter) =>
  f === "all" || (f === "active" ? o.status !== "delivered" && o.status !== "cancelled" : o.status === f);

export function OrdersView() {
  const hydrated = useHydrated();
  const router = useRouter();
  const { user } = useAuth();
  const [filter, setFilter] = useState<Filter>("all");
  const { loading, data, error } = useAsync(hydrated && user ? `orders:${user.phone}` : null, () => api.getOrders());

  if (!hydrated) return <p className="muted" aria-busy="true">Loading…</p>;
  if (!user) return <LoginPrompt next="/account/orders" />;

  const orders = (data ?? []).filter((o) => matches(o, filter));

  function reorder(order: Order) {
    order.lines.forEach((l) => cart.add(l.productId, l.qty));
    toast("Items added to your cart");
    router.push("/cart");
  }

  return (
    <>
      <h1 style={{ fontSize: "clamp(24px,3vw,32px)", marginBottom: 12 }}>My orders</h1>
      <div className="chips" style={{ marginBottom: 16 }} role="group" aria-label="Filter orders">
        {FILTERS.map((f) => (
          <button key={f.id} type="button" className={`chip${filter === f.id ? " is-on" : ""}`} aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
            {f.label}
          </button>
        ))}
      </div>

      {loading && <p className="muted" aria-busy="true">Loading your orders…</p>}
      {error && <p className="notice notice-err" role="alert">{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <div className="card empty">
          <h2>{filter === "all" ? "No orders yet" : "No orders here"}</h2>
          <p>{filter === "all" ? "When you place an order, it will show up here." : "Try another filter."}</p>
          {filter === "all" && (
            <Link className="btn btn-primary" href="/shop">
              Start shopping
            </Link>
          )}
        </div>
      )}

      <div className="stack">
        {orders.map((o) => (
          <article className="card card-pad" key={o.id}>
            <div className="order-head">
              <div>
                <b style={{ color: "var(--ink)" }}>{o.id}</b>
                <div className="small muted" style={{ marginTop: 2 }}>
                  {formatDate(o.createdAt)} &middot; <PaymentBadge order={o} />
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <StatusBadge status={o.status} />
                <div className="price" style={{ fontWeight: 700, color: "var(--ink)", marginTop: 4 }}>
                  {inr(o.total)}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <div className="order-items">
                {o.lines.slice(0, 5).map((l) => (
                  <div key={l.productId} title={`${l.name}, ${l.size}`}>
                    <Image src={productImage(l.productId)} alt={`${l.name}, ${l.size}`} fill sizes="56px" />
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Link className="btn btn-secondary btn-sm" href={`/order?id=${encodeURIComponent(o.id)}`}>
                  View details
                </Link>
                <button type="button" className="btn btn-primary btn-sm" onClick={() => reorder(o)}>
                  Reorder
                </button>
              </div>
            </div>
            <OrderTrack status={o.status} />
          </article>
        ))}
      </div>
    </>
  );
}
