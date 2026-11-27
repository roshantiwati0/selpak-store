"use client";

import Image from "next/image";
import { useState } from "react";
import { adminApi } from "@/lib/admin";
import { isLowStock } from "@/lib/admin/stats";
import type { AdminProduct, ProductPatch } from "@/lib/admin/types";
import { errorMessage } from "@/lib/api";
import { getCategories, getCategory, productImage } from "@/lib/catalog";
import { IS_DEMO, LOW_STOCK } from "@/lib/config";
import { useAsync } from "@/lib/useAsync";
import { useAdminKey } from "@/store/adminAuth";
import { toast } from "@/store/toast";

/** What is typed in a row's boxes but not saved yet (text, so a half-typed number is kept as typed). */
interface Draft {
  mrp?: string;
  stock?: string;
}

const wholeNumber = (text: string, min: number) => (/^\d+$/.test(text.trim()) && Number(text) >= min ? Number(text) : null);

export function AdminProducts() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [lowOnly, setLowOnly] = useState(false);
  const [saved, setSaved] = useState<Record<string, AdminProduct>>({});
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [switching, setSwitching] = useState<{ id: string; on: boolean } | null>(null);
  const { loading, data, error } = useAsync(useAdminKey("admin:products"), () => adminApi.getProducts());

  const all = (data ?? []).map((p) => saved[p.id] ?? p);
  const q = search.trim().toLowerCase();
  const products = all.filter((p) => {
    if (category !== "all" && p.category !== category) return false;
    if (lowOnly && !isLowStock(p)) return false;
    return !q || q.split(/\s+/).every((word) => `${p.name} ${p.size} ${p.id} ${p.barcode}`.toLowerCase().includes(word));
  });

  const edit = (id: string, patch: Draft) => setDrafts((d) => ({ ...d, [id]: { ...d[id], ...patch } }));

  async function save(p: AdminProduct, patch: ProductPatch, done: string) {
    setSaving(p.id);
    // The switch shows the new position at once; if saving fails it goes back by itself.
    if (patch.active !== undefined) setSwitching({ id: p.id, on: patch.active });
    try {
      const updated = await adminApi.updateProduct(p.id, patch);
      setSaved((s) => ({ ...s, [updated.id]: updated }));
      // Only what was saved is cleared: flipping the switch keeps a price that is still being typed.
      if (patch.mrp !== undefined || patch.stock !== undefined) {
        setDrafts((d) => {
          const rest = { ...d };
          delete rest[p.id];
          return rest;
        });
      }
      toast(done);
    } catch (e) {
      toast(errorMessage(e));
    } finally {
      setSaving(null);
      setSwitching(null);
    }
  }

  function saveRow(p: AdminProduct) {
    const draft = drafts[p.id] ?? {};
    const mrp = draft.mrp === undefined ? p.mrp : wholeNumber(draft.mrp, 1);
    const stock = draft.stock === undefined ? p.stock : wholeNumber(draft.stock, 0);
    if (mrp === null) return toast("Price must be a whole number above 0");
    if (stock === null) return toast("Stock must be a whole number, 0 or more");
    void save(p, { mrp, stock }, `Saved: ${p.name}, ${p.size}`);
  }

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Products</h1>
          <p className="muted">Change a price or the stock, or take a product off sale.</p>
        </div>
      </div>

      {IS_DEMO && (
        <p className="notice notice-info" style={{ marginBottom: 14 }}>
          Demo mode: the stock numbers are sample values, and what you change here is kept in this browser only. The store pages will follow
          these prices and stock once the backend is connected.
        </p>
      )}

      <div className="adm-tools">
        <div className="adm-filters">
          <select className="select" aria-label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">All categories</option>
            {getCategories().map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <label className="check">
            <input type="checkbox" checked={lowOnly} onChange={(e) => setLowOnly(e.target.checked)} />
            Low stock only ({LOW_STOCK} or fewer)
          </label>
        </div>
        <input className="input adm-search" type="search" placeholder="Search name, size or barcode" aria-label="Search products" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading && (
        <p className="muted" aria-busy="true">
          Loading products…
        </p>
      )}
      {error && (
        <p className="notice notice-err" role="alert">
          {error}
        </p>
      )}
      {!loading && !error && products.length === 0 && (
        <div className="card empty">
          <h2>No products match</h2>
          <p>Try another category or search.</p>
        </div>
      )}

      {products.length > 0 && (
        <div className="card adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price (₹)</th>
                <th>Stock</th>
                <th>On sale</th>
                <th aria-label="Save" />
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const draft = drafts[p.id];
                const dirty = draft !== undefined && ((draft.mrp !== undefined && draft.mrp !== String(p.mrp)) || (draft.stock !== undefined && draft.stock !== String(p.stock)));
                const label = `${p.name}, ${p.size}`;
                const onSale = switching?.id === p.id ? switching.on : p.active;
                return (
                  <tr key={p.id} className={p.active ? undefined : "is-off"}>
                    <td>
                      <div className="adm-prod">
                        <div className="adm-thumb">
                          <Image src={productImage(p.id)} alt="" fill sizes="44px" />
                        </div>
                        <div>
                          <b>{p.name}</b>
                          <div className="small muted">
                            {p.size} &middot; {p.barcode}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{getCategory(p.category)?.name ?? p.category}</td>
                    <td>
                      <input className="input adm-num" inputMode="numeric" aria-label={`Price of ${label}`} value={draft?.mrp ?? String(p.mrp)} onChange={(e) => edit(p.id, { mrp: e.target.value })} />
                    </td>
                    <td>
                      <input className="input adm-num" inputMode="numeric" aria-label={`Stock of ${label}`} value={draft?.stock ?? String(p.stock)} onChange={(e) => edit(p.id, { stock: e.target.value })} />
                      {isLowStock(p) && <span className="badge badge-warn adm-low">{p.stock === 0 ? "Out of stock" : "Low"}</span>}
                    </td>
                    <td>
                      <label className="adm-switch">
                        <input
                          type="checkbox"
                          role="switch"
                          aria-label={`${label} on sale`}
                          checked={onSale}
                          disabled={saving === p.id}
                          onChange={(e) => void save(p, { active: e.target.checked }, e.target.checked ? `On sale: ${label}` : `Off sale: ${label}`)}
                        />
                        <span>{onSale ? "Yes" : "No"}</span>
                      </label>
                    </td>
                    <td className="num">
                      <button type="button" className="btn btn-primary btn-sm" disabled={!dirty || saving === p.id} onClick={() => saveRow(p)}>
                        {saving === p.id ? "Saving…" : "Save"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
