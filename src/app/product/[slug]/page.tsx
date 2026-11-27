import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BuyBox } from "@/components/BuyBox";
import { ProductGrid } from "@/components/ProductCard";
import { getCategory, getProduct, getProducts, getRelated, productImage, productTitle } from "@/lib/catalog";
import { SELLER, SITE } from "@/lib/config";
import { inr } from "@/lib/format";

type Props = PageProps<"/product/[slug]">;

export function generateStaticParams() {
  return getProducts().map((p) => ({ slug: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProduct((await params).slug);
  if (!product) return {};
  const title = productTitle(product);
  return {
    title,
    description: `Buy ${title} online at ${inr(product.mrp)} (MRP, incl. taxes). Cash on delivery available.`,
    alternates: { canonical: `/product/${product.id}` },
    openGraph: { title, images: [productImage(product.id)] },
  };
}

/* Next.js 16: `params` (URL ka data) page ke upar await nahi karte.
   Promise ko <Suspense> ke andar wale component ko dete hain, taaki page ka
   "shell" har product ke liye ek hi rahe aur navigation turant ho. */
export default function ProductPage({ params }: Props) {
  return (
    <main className="container">
      <Suspense fallback={<ProductSkeleton />}>
        <ProductDetails params={params} />
      </Suspense>
    </main>
  );
}

async function ProductDetails({ params }: Pick<Props, "params">) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const category = getCategory(product.category);
  const title = productTitle(product);
  const related = getRelated(product);

  /* Google ke liye product ki structured info (SEO) */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: title,
    image: `${SITE.url}${productImage(product.id)}`,
    brand: { "@type": "Brand", name: SITE.brand },
    gtin13: product.barcode,
    category: category?.name,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.mrp,
      url: `${SITE.url}/product/${product.id}`,
      seller: { "@type": "Organization", name: SELLER.name },
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: category?.name ?? "Shop", href: `/shop/${product.category}` }, { label: title }]}
      />
      <div className="pdp">
        <div className="gallery-main">
          {product.tag && <span className={`badge badge-${product.tag}`}>{product.tagText}</span>}
          <Image src={productImage(product.id)} alt={title} fill preload sizes="(max-width: 760px) 100vw, 560px" />
        </div>
        <div className="pdp-info">
          <div className="eyebrow">{category?.name}</div>
          <h1 style={{ marginTop: 6 }}>{title}</h1>
          <div className="pdp-price price">{inr(product.mrp)}</div>
          <div className="muted small">MRP, inclusive of all taxes</div>

          <BuyBox product={product} />

          <div className="card card-pad" style={{ marginTop: 16 }}>
            <h2 style={{ fontSize: 17, marginBottom: 6 }}>Product details</h2>
            <table className="spec">
              <tbody>
                <tr>
                  <th scope="row">Brand</th>
                  <td>{SITE.brand}</td>
                </tr>
                <tr>
                  <th scope="row">Category</th>
                  <td>{category?.name}</td>
                </tr>
                <tr>
                  <th scope="row">Pack size</th>
                  <td>{product.size}</td>
                </tr>
                <tr>
                  <th scope="row">Barcode (EAN)</th>
                  <td>{product.barcode}</td>
                </tr>
                <tr>
                  <th scope="row">Sold by</th>
                  <td>
                    {SELLER.name}, {SELLER.city}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2>More from this category</h2>
          </div>
          <ProductGrid products={related} />
        </section>
      )}
    </>
  );
}

/* Product load hone tak dikhne wala dhancha (sirf un links par jo pehle se bane nahi hain). */
function ProductSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading product">
      <div className="crumbs">Home / …</div>
      <div className="pdp">
        <div className="gallery-main skeleton" />
        <div className="pdp-info">
          <div className="skeleton skeleton-line" style={{ width: "30%" }} />
          <div className="skeleton skeleton-line" style={{ width: "80%", height: 32, marginTop: 10 }} />
          <div className="skeleton skeleton-line" style={{ width: "35%", height: 36, marginTop: 18 }} />
          <div className="skeleton skeleton-line" style={{ width: "100%", height: 52, marginTop: 24 }} />
        </div>
      </div>
    </div>
  );
}
