import type { MetadataRoute } from "next";
import { getCategories, getProducts } from "@/lib/catalog";
import { SITE } from "@/lib/config";
import { POLICIES } from "@/lib/policies";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/shop",
    "/contact",
    ...getCategories().map((c) => `/shop/${c.id}`),
    ...getProducts().map((p) => `/product/${p.id}`),
    ...POLICIES.map((p) => `/policies/${p.slug}`),
  ];
  return paths.map((path) => ({ url: `${SITE.url}${path}` }));
}
