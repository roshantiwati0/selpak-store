import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ShopFallback, ShopView } from "@/components/ShopView";
import { getCategories, getCategory } from "@/lib/catalog";

export function generateStaticParams() {
  return getCategories().map((c) => ({ category: c.id }));
}

export async function generateMetadata({ params }: PageProps<"/shop/[category]">): Promise<Metadata> {
  const category = getCategory((await params).category);
  if (!category) return {};
  return {
    title: category.name,
    description: `Buy Selpak ${category.name.toLowerCase()} online. ${category.blurb}.`,
    alternates: { canonical: `/shop/${category.id}` },
  };
}

export default async function CategoryPage({ params }: PageProps<"/shop/[category]">) {
  const category = getCategory((await params).category);
  if (!category) notFound();
  return (
    <Suspense fallback={<ShopFallback />}>
      <ShopView category={category.id} categoryName={category.name} />
    </Suspense>
  );
}
