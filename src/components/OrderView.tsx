"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { formatDate, inr } from "@/lib/format";
import { useAsync } from "@/lib/useAsync";
import { CheckIcon } from "./Icons";
import { OrderTrack, PaymentBadge, StatusBadge } from "./OrderBits";

export function OrderView() {
  const params = useSearchParams();
  const id = params.get("id");
  const isNew = params.get("new") === "1";
  const { loading, data: order, error } = useAsync(id, () => api.getOrder(id ?? ""));

  if (loading) {
    return (
      <main className="container">
        <p className="muted" style={{ padding: "60px 0" }} aria-busy="true">
          Loading order…
        </p>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="container">
        <div className="card empty" style={{ marginTop: 32 }}>
          <h1 style={{ fontSize: 24, marginBottom: 6 }}>Order not found</h1>
          <p>{error ?? "We could not find this order. Check the link, or look in your orders."}</p>
          <Link className="btn btn-primary" href="/account/orders">
            Go to my orders
          </Link>
        </div>
      </main>
    );
  }

  const a = order.address;
  return (
    <main className="container">
      <div className="card success" style={{ maxWidth: 720 }}>
        {isNew && (
          <>
            <div className="success-ic">
              <CheckIcon size={36} />
            </div>
            <h1 style={{ fontSize: 28 }}>Order placed</h1>
            <p className="muted" style={{ marginTop: 8 }}>
              Thank you, {a.name.split(" ")[0]}. Order updates will be sent to {a.phone}.
            </p>
          </>
        )}
        {!isNew && <h1 style={{ fontSize: 26 }}>Order {order.id}</h1>}

        <div className="card card-pad" style={{ textAlign: "left", marginTop: 24, background: "var(--bg)" }}>
          <div className="sum-row">
            <span className="muted">Order number</span>
            <b style={{ color: "var(--ink)" }}>{order.id}</b>
          </div>
          <div className="sum-row">
            <span className="muted">Placed on</span>
            <span>{formatDate(order.createdAt)}</span>
          </div>
          <div className="sum-row">
            <span className="muted">Status</span>
            <StatusBadge status={order.status} />
          </div>
          <div className="sum-row">
            <span className="muted">Payment</span>
            <PaymentBadge order={order} />
          </div>
          <div className="sum-row">
            <span className="muted">Deliver to</span>
            <span style={{ textAlign: "right" }}>
              {a.line1}
              {a.landmark ? `, ${a.landmark}` : ""}, {a.city} {a.pincode}
            </span>
          </div>
        </div>

        <OrderTrack status={order.status} />

        <div style={{ textAlign: "left", marginTop: 16 }}>
          <h2 style={{ fontSize: 17, marginBottom: 4 }}>Items</h2>
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
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginTop: 24 }}>
          <Link className="btn btn-primary" href="/account/orders">
            My orders
          </Link>
          <Link className="btn btn-ghost" href="/shop">
            Continue shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
