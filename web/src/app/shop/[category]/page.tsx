import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ShopSkeleton } from "@/components/ShopSkeleton";
import { ShopView } from "@/components/ShopView";
import { getCategories, getCategory } from "@/lib/catalog";

type Props = PageProps<"/shop/[category]">;

export function generateStaticParams() {
  return getCategories().map((c) => ({ category: c.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = getCategory((await params).category);
  if (!category) return {};
  return {
    title: category.name,
    description: `Buy Selpak ${category.name.toLowerCase()} online. ${category.blurb}.`,
    alternates: { canonical: `/shop/${category.id}` },
  };
}

/* `params` ko <Suspense> ke andar padhte hain (dekho product/[slug]/page.tsx ka note). */
export default function CategoryPage({ params }: Props) {
  return (
    <Suspense fallback={<ShopSkeleton />}>
      <CategoryShop params={params} />
    </Suspense>
  );
}

async function CategoryShop({ params }: Pick<Props, "params">) {
  const category = getCategory((await params).category);
  if (!category) notFound();
  return <ShopView key={category.id} category={category.id} categoryName={category.name} />;
}
