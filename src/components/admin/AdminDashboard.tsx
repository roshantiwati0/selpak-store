"use client";

import Link from "next/link";
import { useState } from "react";
import { adminApi } from "@/lib/admin";
import { errorMessage } from "@/lib/api";
import { IS_DEMO } from "@/lib/config";
import { formatDate, inr } from "@/lib/format";
import { useAsync } from "@/lib/useAsync";
import { useAdminKey } from "@/store/adminAuth";
import { toast } from "@/store/toast";
import { PaymentBadge, StatusBadge } from "../OrderBits";

export function AdminDashboard() {
  const [version, setVersion] = useState(0);
  const [adding, setAdding] = useState(false);
  const stats = useAsync(useAdminKey(`admin:stats:${version}`), () => adminApi.getStats());
  const orders = useAsync(useAdminKey(`admin:recent:${version}`), () => adminApi.getOrders());

  async function addSamples() {
    setAdding(true);
    try {
      const added = await adminApi.addSampleOrders();
      toast(added ? `${added} sample orders added` : "The sample orders are already there");
      setVersion((v) => v + 1);
    } catch (e) {
      toast(errorMessage(e));
    } finally {
      setAdding(false);
    }
  }

  const s = stats.data;
  const recent = (orders.data ?? []).slice(0, 5);
  const peak = Math.max(1, ...(s?.days ?? []).map((d) => d.sales));

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Dashboard</h1>
          <p className="muted">Today&rsquo;s orders and what needs your attention.</p>
        </div>
        {IS_DEMO && (
          <button type="button" className="btn btn-secondary btn-sm" onClick={addSamples} disabled={adding}>
            {adding ? "Adding…" : "Add sample orders"}
          </button>
        )}
      </div>

      {stats.error && (
        <p className="notice notice-err" role="alert">
          {stats.error}
        </p>
      )}
      {stats.loading && (
        <p className="muted" aria-busy="true">
          Loading the numbers…
        </p>
      )}

      {s && (
        <>
          <div className="adm-stats">
            <div className="card adm-stat">
              <span>Orders today</span>
              <b>{s.ordersToday}</b>
              <small>{inr(s.salesToday)} in sales</small>
            </div>
            <Link className="card adm-stat" href="/admin/orders">
              <span>To pack or deliver</span>
              <b>{s.toProcess}</b>
              <small>{s.toProcess ? "Open the orders" : "Nothing waiting"}</small>
            </Link>
            <div className="card adm-stat">
              <span>All orders</span>
              <b>{s.ordersTotal}</b>
              <small>{inr(s.salesTotal)} in sales</small>
            </div>
            <Link className="card adm-stat" href="/admin/customers">
              <span>Customers</span>
              <b>{s.customers}</b>
              <small>who have ordered</small>
            </Link>
            <Link className={`card adm-stat${s.lowStock ? " is-warn" : ""}`} href="/admin/products">
              <span>Low stock</span>
              <b>{s.lowStock}</b>
              <small>{s.lowStock ? "products to refill" : "All stocked"}</small>
            </Link>
          </div>
          <p className="hint" style={{ marginTop: 8 }}>
            Sales count paid and cash-on-delivery orders; cancelled and unpaid orders are left out.
          </p>

          <div className="adm-two">
            <section className="card card-pad" aria-labelledby="adm-week">
              <h2 id="adm-week" className="adm-h2">
                Last 7 days
              </h2>
              <div className="adm-bars">
                {s.days.map((d) => (
                  <div key={d.date} className="adm-bar" title={`${d.label}: ${d.orders} orders, ${inr(d.sales)}`}>
                    <span className="adm-bar-val">{d.sales ? inr(d.sales) : "–"}</span>
                    <i style={{ height: `${Math.round((d.sales / peak) * 100)}%` }} />
                    <span className="adm-bar-day">{d.label}</span>
                    <span className="adm-bar-n">
                      {d.orders} {d.orders === 1 ? "order" : "orders"}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="card card-pad" aria-labelledby="adm-top">
              <h2 id="adm-top" className="adm-h2">
                Best sellers
              </h2>
              {s.topProducts.length === 0 && <p className="muted">No sales yet.</p>}
              <ol className="adm-rank">
                {s.topProducts.map((p) => (
                  <li key={p.productId}>
                    <span>
                      {p.name}, {p.size}
                    </span>
                    <span className="muted price">
                      {p.qty} sold &middot; {inr(p.sales)}
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </>
      )}

      <section className="card card-pad" aria-labelledby="adm-recent" style={{ marginTop: 16 }}>
        <div className="block-title">
          <h2 id="adm-recent" className="adm-h2" style={{ margin: 0 }}>
            Newest orders
          </h2>
          <Link href="/admin/orders">All orders</Link>
        </div>
        {orders.error && (
          <p className="notice notice-err" role="alert">
            {orders.error}
          </p>
        )}
        {!orders.loading && !orders.error && recent.length === 0 && (
          <p className="muted">No orders yet. {IS_DEMO ? "Place one in the store, or add the sample orders above." : "They show up here as customers order."}</p>
        )}
        {recent.length > 0 && (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th className="num">Total</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <Link href={`/admin/order?id=${encodeURIComponent(o.id)}`}>{o.id}</Link>
                    </td>
                    <td>{formatDate(o.createdAt)}</td>
                    <td>{o.address.name}</td>
                    <td>
                      <PaymentBadge order={o} />
                    </td>
                    <td>
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="num price">{inr(o.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
