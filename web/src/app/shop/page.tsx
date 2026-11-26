import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopFallback, ShopView } from "@/components/ShopView";

export const metadata: Metadata = {
  title: "All products",
  description: "Browse all Selpak toilet rolls, kitchen towels, facial tissues, hankies, wet wipes and napkins.",
  alternates: { canonical: "/shop" },
};

export default function ShopPage() {
  return (
    <Suspense fallback={<ShopFallback />}>
      <ShopView />
    </Suspense>
  );
}
