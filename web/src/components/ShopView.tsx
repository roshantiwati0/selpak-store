"use client";

import Link from "next/link";
import { useState } from "react";
import { getCategories, getProducts, queryProducts, type PriceRange, type SortKey, type TypeFilter } from "@/lib/catalog";
import type { CategoryId } from "@/lib/types";
import { Breadcrumbs } from "./Breadcrumbs";
import { ProductGrid } from "./ProductCard";

const TYPES: { id: TypeFilter; label: string }[] = [
  { id: "promo", label: "Promo packs" },
  { id: "scented", label: "Scented" },
  { id: "deluxe", label: "Deluxe / Premium" },
  { id: "new", label: "New" },
];

const PRICES: { id: PriceRange; label: string }[] = [
  { id: "any", label: "Any price" },
  { id: "0-300", label: "Under ₹300" },
  { id: "300-700", label: "₹300 to ₹700" },
  { id: "700-1500", label: "₹700 to ₹1,500" },
  { id: "1500+", label: "Above ₹1,500" },
];

interface Props {
  category?: CategoryId;
  categoryName?: string;
  /** search text from the URL (?q=) */
  search?: string;
  /** type filter to start with, from the URL (?tag=promo) */
  initialTag?: string;
}

/* URL ka data (category, ?q=, ?tag=) server page padhta hai aur props me deta hai,
   isliye products ki list server ke HTML me hoti hai (SEO). Filters aur sort browser me chalte hain.
   URL badalne par page is component ko naya `key` deta hai, jisse filters reset ho jaate hain. */
export function ShopView({ category, categoryName, search = "", initialTag = "" }: Props) {
  const [types, setTypes] = useState<TypeFilter[]>(() =>
    TYPES.some((t) => t.id === initialTag) ? [initialTag as TypeFilter] : [],
  );
  const [price, setPrice] = useState<PriceRange>("any");
  const [sort, setSort] = useState<SortKey>("featured");
  const [sheetOpen, setSheetOpen] = useState(false);

  const products = queryProducts({ category, search, types, price, sort });
  const total = getProducts().length;
  const title = categoryName ?? (search ? `Results for “${search}”` : "All products");
  const activeCount = types.length + (price === "any" ? 0 : 1);

  const toggleType = (id: TypeFilter) => setTypes((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));
  const clear = () => {
    setTypes([]);
    setPrice("any");
  };

  return (
    <main className="container">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: title }]} />
      <div className="section-head" style={{ marginBottom: 12 }}>
        <div>
          <h1 style={{ fontSize: "clamp(24px,3vw,32px)" }}>{title}</h1>
          <p aria-live="polite">
            {products.length} {products.length === 1 ? "product" : "products"}
          </p>
        </div>
      </div>

      <div className="chips only-mobile" style={{ marginBottom: 12 }}>
        <Link className={`chip${category ? "" : " is-on"}`} href="/shop">
          All
        </Link>
        {getCategories().map((c) => (
          <Link key={c.id} className={`chip${category === c.id ? " is-on" : ""}`} href={`/shop/${c.id}`}>
            {c.name}
          </Link>
        ))}
      </div>

      <div className="shop">
        {sheetOpen && <button type="button" className="sheet-back only-mobile" aria-label="Close filters" onClick={() => setSheetOpen(false)} />}
        <aside className={`card filters${sheetOpen ? " is-open" : ""}`} aria-label="Filters">
          <div className="sheet-head">
            <h3>Filters</h3>
            <button type="button" className="btn btn-primary btn-sm" onClick={() => setSheetOpen(false)}>
              Show {products.length}
            </button>
          </div>
          <h4>Category</h4>
          <Link className="check" href="/shop" style={{ color: category ? "inherit" : "var(--blue-700)", fontWeight: category ? 400 : 700 }}>
            All <span>{total}</span>
          </Link>
          {getCategories().map((c) => (
            <Link
              key={c.id}
              className="check"
              href={`/shop/${c.id}`}
              style={{ color: category === c.id ? "var(--blue-700)" : "inherit", fontWeight: category === c.id ? 700 : 400 }}
            >
              {c.name} <span>{getProducts().filter((p) => p.category === c.id).length}</span>
            </Link>
          ))}
          <h4>Type</h4>
          {TYPES.map((t) => (
            <label className="check" key={t.id}>
              <input type="checkbox" checked={types.includes(t.id)} onChange={() => toggleType(t.id)} /> {t.label}
            </label>
          ))}
          <h4>Price</h4>
          {PRICES.map((p) => (
            <label className="check" key={p.id}>
              <input type="radio" name="price" checked={price === p.id} onChange={() => setPrice(p.id)} /> {p.label}
            </label>
          ))}
          {activeCount > 0 && (
            <button type="button" className="link-btn" style={{ marginTop: 14 }} onClick={clear}>
              Clear filters
            </button>
          )}
        </aside>

        <div>
          <div className="toolbar">
            <button type="button" className="btn btn-secondary btn-sm only-mobile" onClick={() => setSheetOpen(true)}>
              Filters{activeCount > 0 ? ` (${activeCount})` : ""}
            </button>
            <span className="muted small hide-m">
              Showing {products.length} of {total}
            </span>
            <select className="select" aria-label="Sort by" value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
          </div>
          {products.length > 0 ? (
            <ProductGrid products={products} columns={3} eagerCount={6} />
          ) : (
            <div className="card empty">
              <h3>No products found</h3>
              <p>Try removing a filter, or check the spelling of your search.</p>
              {activeCount > 0 ? (
                <button type="button" className="btn btn-secondary btn-sm" onClick={clear}>
                  Clear filters
                </button>
              ) : (
                <Link className="btn btn-secondary btn-sm" href="/shop">
                  View all products
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
