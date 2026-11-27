import Image from "next/image";
import Link from "next/link";
import { productImage, productTitle } from "@/lib/catalog";
import { inr } from "@/lib/format";
import type { Product } from "@/lib/types";
import { AddToCartButton } from "./AddToCartButton";

interface CardProps {
  product: Product;
  /** true for cards visible without scrolling, so their image is not lazy-loaded */
  eager?: boolean;
}

export function ProductCard({ product, eager = false }: CardProps) {
  const href = `/product/${product.id}`;
  const title = productTitle(product);
  return (
    <article className="pcard">
      <Link className="pcard-media" href={href} tabIndex={-1} aria-hidden="true">
        {product.tag && <span className={`badge badge-${product.tag}`}>{product.tagText}</span>}
        <Image
          src={productImage(product.id)}
          alt=""
          fill
          sizes="(max-width: 760px) 50vw, (max-width: 1000px) 33vw, 280px"
          loading={eager ? "eager" : "lazy"}
        />
      </Link>
      <div className="pcard-body">
        <Link className="pcard-name" href={href}>
          Selpak {product.name}
        </Link>
        <div className="pcard-meta">{product.size}</div>
        <div className="pcard-foot">
          <div className="pcard-price price">
            {inr(product.mrp)}
            <small>MRP incl. taxes</small>
          </div>
          <AddToCartButton productId={product.id} productName={title} />
        </div>
      </div>
    </article>
  );
}

interface GridProps {
  products: Product[];
  columns?: 3 | 4;
  /** how many cards from the start are above the fold (their images load eagerly) */
  eagerCount?: number;
}

export function ProductGrid({ products, columns = 4, eagerCount = 0 }: GridProps) {
  return (
    <div className={columns === 3 ? "grid grid-3" : "grid"}>
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} eager={i < eagerCount} />
      ))}
    </div>
  );
}
