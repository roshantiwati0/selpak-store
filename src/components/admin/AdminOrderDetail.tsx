"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { adminApi } from "@/lib/admin";
import { nextStatus } from "@/lib/admin/stats";
import { errorMessage } from "@/lib/api";
import { formatDate, inr } from "@/lib/format";
import type { Order, OrderStatus } from "@/lib/types";
import { useAsync } from "@/lib/useAsync";
import { useAdminKey } from "@/store/adminAuth";
import { toast } from "@/store/toast";
import { OrderTrack, PaymentBadge, StatusBadge } from "../OrderBits";
import { STATUS_LABELS } from "./AdminOrders";

export function AdminOrderDetail() {
  const id = useSearchParams().get("id");
  const [changed, setChanged] = useState<Order | null>(null);
  const [busy, setBusy] = useState(false);
  const { loading, data, error } = useAsync(useAdminKey(id ? `admin:order:${id}` : null), () => adminApi.getOrder(id ?? ""));

  // Only while the order itself is loaded: after a logout nothing of it stays on screen.
  const order = data && changed?.id === id ? changed : data;

  async function setStatus(status: OrderStatus) {
    if (!order) return;
    if (status === "cancelled" && !window.confirm(`Cancel order ${order.id}? The customer will see it as cancelled.`)) return;
    setBusy(true);
    try {
      const updated = await adminApi.updateOrderStatus(order.id, status);
      setChanged(updated);
      toast(`${updated.id}: ${STATUS_LABELS[updated.status]}`);
    } catch (e) {
      toast(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <p className="muted" aria-busy="true">
        Loading order…
      </p>
    );
  }
  if (!order) {
    return (
      <div className="card empty">
        <h1 style={{ fontSize: 24, marginBottom: 6 }}>Order not found</h1>
        <p>{error ?? "There is no order with this number."}</p>
        <Link className="btn btn-primary" href="/admin/orders">
          All orders
        </Link>
      </div>
    );
  }

  const a = order.address;
  const next = nextStatus(order.status);
  return (
    <>
      <p className="small" style={{ marginBottom: 8 }}>
        <Link href="/admin/orders">&larr; All orders</Link>
      </p>
      <div className="adm-head">
        <div>
          <h1>Order {order.id}</h1>
          <p className="muted">
            Placed on {formatDate(order.createdAt)} &middot; <StatusBadge status={order.status} /> <PaymentBadge order={order} />
          </p>
        </div>
        <div className="adm-actions">
          {next && (
            <button type="button" className="btn btn-primary btn-sm" disabled={busy} onClick={() => setStatus(next)}>
              Mark as {STATUS_LABELS[next].toLowerCase()}
            </button>
          )}
          {next && (
            <button type="button" className="btn btn-secondary btn-sm" disabled={busy} onClick={() => setStatus("cancelled")}>
              Cancel order
            </button>
          )}
        </div>
      </div>

      <div className="card card-pad">
        <OrderTrack status={order.status} />
        {order.status === "cancelled" && <p className="notice notice-err">This order was cancelled.</p>}
      </div>

      <div className="adm-two" style={{ marginTop: 16 }}>
        <section className="card card-pad" aria-labelledby="adm-items">
          <h2 id="adm-items" className="adm-h2">
            Items
          </h2>
          {order.lines.map((l) => (
            <div className="sum-row" key={l.productId}>
              <span>
                {l.name}, {l.size} <span className="muted">&times; {l.qty}</span>
              </span>
              <span className="price">{inr(l.price * l.qty)}</span>
            </div>
          ))}
          <div className="sum-row">
            <span className="muted">Delivery</span>
            <span className="price">{order.deliveryFee === 0 ? "Free" : inr(order.deliveryFee)}</span>
          </div>
          <div className="sum-row sum-total">
            <span>Total</span>
            <span className="price">{inr(order.total)}</span>
          </div>
        </section>

        <section className="card card-pad" aria-labelledby="adm-ship">
          <h2 id="adm-ship" className="adm-h2">
            Deliver to
          </h2>
          <p style={{ color: "var(--ink)", fontWeight: 600 }}>{a.name}</p>
          <p>
            {a.line1}
            {a.landmark ? `, ${a.landmark}` : ""}
          </p>
          <p>
            {a.city} {a.pincode}, {a.state}
          </p>
          <p style={{ marginTop: 10 }}>
            <a href={`tel:${a.phone}`}>{a.phone}</a>
            {a.email ? (
              <>
                {" "}
                &middot; <a href={`mailto:${a.email}`}>{a.email}</a>
              </>
            ) : null}
          </p>
        </section>
      </div>
    </>
  );
}
