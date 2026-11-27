import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopSkeleton } from "@/components/ShopSkeleton";
import { ShopView } from "@/components/ShopView";

type Props = PageProps<"/shop">;

export const metadata: Metadata = {
  title: "All products",
  description: "Browse all Selpak toilet rolls, kitchen towels, facial tissues, hankies, wet wipes and napkins.",
  alternates: { canonical: "/shop" },
};

/* /shop          -> saare products
   /shop?q=wipes  -> search
   /shop?tag=promo -> promo packs
   `searchParams` URL ka data hai, isliye <Suspense> ke andar padhte hain. */
export default function ShopPage({ searchParams }: Props) {
  return (
    <Suspense fallback={<ShopSkeleton />}>
      <ShopResults searchParams={searchParams} />
    </Suspense>
  );
}

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? "";

async function ShopResults({ searchParams }: Pick<Props, "searchParams">) {
  const params = await searchParams;
  const search = first(params.q).trim().slice(0, 80);
  const tag = first(params.tag);
  return <ShopView key={`${search}|${tag}`} search={search} initialTag={tag} />;
}
