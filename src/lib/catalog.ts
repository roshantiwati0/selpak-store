/* Catalogue read functions. Pages sirf inhi ko use karte hain, data file ko seedha nahi.
   Backend aane par sirf is file ka andar ka code badlega. */
import { CATEGORIES, PRODUCTS } from "@/data/catalog";
import { asset } from "@/lib/config";
import type { CategoryId, Product, ProductTag } from "@/lib/types";

export function getCategories() {
  return CATEGORIES;
}

export function getCategory(id: string) {
  return CATEGORIES.find((c) => c.id === id);
}

export function getProducts() {
  return PRODUCTS;
}

export function getProduct(id: string) {
  return PRODUCTS.find((p) => p.id === id);
}

export function getProductsByIds(ids: string[]) {
  return ids.map(getProduct).filter((p): p is Product => Boolean(p));
}

export function getRelated(product: Product, limit = 4) {
  return PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, limit);
}

export type PriceRange = "any" | "0-300" | "300-700" | "700-1500" | "1500+";
export type SortKey = "featured" | "price-asc" | "price-desc";
export type TypeFilter = ProductTag | "scented";

export interface ProductQuery {
  category?: CategoryId;
  search?: string;
  types?: TypeFilter[];
  price?: PriceRange;
  sort?: SortKey;
}

const RANGES: Record<PriceRange, [number, number]> = {
  any: [0, Infinity],
  "0-300": [0, 300],
  "300-700": [300, 700],
  "700-1500": [700, 1500],
  "1500+": [1500, Infinity],
};

export function queryProducts(q: ProductQuery): Product[] {
  const search = q.search?.trim().toLowerCase();
  const [lo, hi] = RANGES[q.price ?? "any"];
  const list = PRODUCTS.filter((p) => {
    if (q.category && p.category !== q.category) return false;
    if (p.mrp < lo || p.mrp >= hi) return false;
    if (search) {
      const hay = `${p.name} ${p.size} ${getCategory(p.category)?.name ?? ""}`.toLowerCase();
      if (!search.split(/\s+/).every((word) => hay.includes(word))) return false;
    }
    return (q.types ?? []).every((t) => (t === "scented" ? p.scented === true : p.tag === t));
  });
  if (q.sort === "price-asc") return [...list].sort((a, b) => a.mrp - b.mrp);
  if (q.sort === "price-desc") return [...list].sort((a, b) => b.mrp - a.mrp);
  return list;
}

export function productTitle(p: Product) {
  return `Selpak ${p.name}, ${p.size}`;
}

/** Picture of a product, ready for <Image src>. */
export function productImage(id: string) {
  return asset(productImagePath(id));
}

/** The same without the site's folder in front: for places that add the site address themselves (SEO data). */
export function productImagePath(id: string) {
  return `/products/${id}.png`;
}
