"use client";

import Link from "next/link";
import { useState } from "react";
import { adminApi } from "@/lib/admin";
import { needsWork } from "@/lib/admin/stats";
import { errorMessage } from "@/lib/api";
import { formatDate, inr } from "@/lib/format";
import type { Order, OrderStatus } from "@/lib/types";
import { useAsync } from "@/lib/useAsync";
import { useAdminKey } from "@/store/adminAuth";
import { toast } from "@/store/toast";
import { PaymentBadge } from "../OrderBits";

type Filter = "all" | "open" | "delivered" | "cancelled";
const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "open", label: "To pack or deliver" },
  { id: "delivered", label: "Delivered" },
  { id: "cancelled", label: "Cancelled" },
];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  placed: "Order placed",
  packed: "Packed",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const matches = (o: Order, f: Filter) => f === "all" || (f === "open" ? needsWork(o.status) : o.status === f);

function found(o: Order, search: string) {
  const hay = `${o.id} ${o.address.name} ${o.address.phone} ${o.address.city}`.toLowerCase();
  return search.split(/\s+/).every((word) => hay.includes(word));
}

export function AdminOrders() {
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [changed, setChanged] = useState<Record<string, Order>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const { loading, data, error } = useAsync(useAdminKey("admin:orders"), () => adminApi.getOrders());

  async function setStatus(order: Order, status: OrderStatus) {
    if (status === order.status) return;
    if (status === "cancelled" && !window.confirm(`Cancel order ${order.id}? The customer will see it as cancelled.`)) return;
    setSaving(order.id);
    try {
      const updated = await adminApi.updateOrderStatus(order.id, status);
      setChanged((c) => ({ ...c, [updated.id]: updated }));
      toast(`${updated.id}: ${STATUS_LABELS[updated.status]}`);
    } catch (e) {
      toast(errorMessage(e));
    } finally {
      setSaving(null);
    }
  }

  const all = (data ?? []).map((o) => changed[o.id] ?? o);
  const q = search.trim().toLowerCase();
  const orders = all.filter((o) => matches(o, filter) && (!q || found(o, q)));

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Orders</h1>
          <p className="muted">Change the status as you pack and deliver; the customer sees it on their order page.</p>
        </div>
      </div>

      <div className="adm-tools">
        <div className="chips" role="group" aria-label="Filter orders">
          {FILTERS.map((f) => (
            <button key={f.id} type="button" className={`chip${filter === f.id ? " is-on" : ""}`} aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
              {f.label}
              {data ? ` (${all.filter((o) => matches(o, f.id)).length})` : ""}
            </button>
          ))}
        </div>
        <input className="input adm-search" type="search" placeholder="Search order, name, mobile or city" aria-label="Search orders" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading && (
        <p className="muted" aria-busy="true">
          Loading orders…
        </p>
      )}
      {error && (
        <p className="notice notice-err" role="alert">
          {error}
        </p>
      )}
      {!loading && !error && orders.length === 0 && (
        <div className="card empty">
          <h2>{all.length === 0 ? "No orders yet" : "No orders match"}</h2>
          <p>{all.length === 0 ? "Orders show up here as soon as customers place them." : "Try another filter or search."}</p>
        </div>
      )}

      {orders.length > 0 && (
        <div className="card adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Payment</th>
                <th className="num">Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>
                    <Link href={`/admin/order?id=${encodeURIComponent(o.id)}`}>{o.id}</Link>
                  </td>
                  <td>{formatDate(o.createdAt)}</td>
                  <td>
                    {o.address.name}
                    <div className="small muted">
                      {o.address.phone} &middot; {o.address.city}
                    </div>
                  </td>
                  <td>{o.lines.reduce((n, l) => n + l.qty, 0)}</td>
                  <td>
                    <PaymentBadge order={o} />
                  </td>
                  <td className="num price">{inr(o.total)}</td>
                  <td>
                    <select
                      className={`select adm-status is-${o.status}`}
                      aria-label={`Status of order ${o.id}`}
                      value={o.status}
                      disabled={saving === o.id}
                      onChange={(e) => setStatus(o, e.target.value as OrderStatus)}
                    >
                      {(Object.keys(STATUS_LABELS) as OrderStatus[]).map((s) => (
                        <option key={s} value={s}>
                          {STATUS_LABELS[s]}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
