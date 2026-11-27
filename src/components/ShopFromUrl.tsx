"use client";

import { useSearchParams } from "next/navigation";
import { ShopView } from "./ShopView";

/* GitHub Pages wali (saadi HTML) site ke liye: ?q= aur ?tag= browser me padhe jaate hain, kyunki wahan
   koi server nahi hota. Apne server par yeh kaam page khud karta hai (src/app/shop/page.tsx). */
export function ShopFromUrl() {
  const params = useSearchParams();
  const search = (params.get("q") ?? "").trim().slice(0, 80);
  const tag = params.get("tag") ?? "";
  return <ShopView key={`${search}|${tag}`} search={search} initialTag={tag} />;
}
