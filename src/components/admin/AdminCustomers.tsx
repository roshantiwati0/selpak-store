"use client";

import { useState } from "react";
import { adminApi } from "@/lib/admin";
import { formatDate, inr } from "@/lib/format";
import { useAsync } from "@/lib/useAsync";
import { useAdminKey } from "@/store/adminAuth";

export function AdminCustomers() {
  const [search, setSearch] = useState("");
  const { loading, data, error } = useAsync(useAdminKey("admin:customers"), () => adminApi.getCustomers());

  const q = search.trim().toLowerCase();
  const customers = (data ?? []).filter((c) => !q || q.split(/\s+/).every((word) => `${c.name} ${c.phone} ${c.city}`.toLowerCase().includes(word)));

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Customers</h1>
          <p className="muted">Everyone who has placed an order, biggest buyers first.</p>
        </div>
      </div>

      <div className="adm-tools">
        <span className="muted">{data ? `${customers.length} of ${data.length} customers` : ""}</span>
        <input className="input adm-search" type="search" placeholder="Search name, mobile or city" aria-label="Search customers" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading && (
        <p className="muted" aria-busy="true">
          Loading customers…
        </p>
      )}
      {error && (
        <p className="notice notice-err" role="alert">
          {error}
        </p>
      )}
      {!loading && !error && customers.length === 0 && (
        <div className="card empty">
          <h2>{data?.length ? "No customers match" : "No customers yet"}</h2>
          <p>{data?.length ? "Try another search." : "A customer shows up here after their first order."}</p>
        </div>
      )}

      {customers.length > 0 && (
        <div className="card adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Mobile</th>
                <th>City</th>
                <th className="num">Orders</th>
                <th className="num">Spent</th>
                <th>Last order</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.phone}>
                  <td>
                    <b>{c.name}</b>
                  </td>
                  <td>
                    <a href={`tel:${c.phone}`}>{c.phone}</a>
                  </td>
                  <td>{c.city}</td>
                  <td className="num">{c.orders}</td>
                  <td className="num price">{inr(c.spent)}</td>
                  <td>{formatDate(c.lastOrderAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
