"use client";

import Image from "next/image";
import Link from "next/link";
import { productImage, productTitle } from "@/lib/catalog";
import { inr } from "@/lib/format";
import { cart, useCart } from "@/store/cart";
import { useHydrated } from "@/store/createStore";
import { Breadcrumbs } from "./Breadcrumbs";
import { QtyStepper } from "./QtyStepper";

export function CartView() {
  const hydrated = useHydrated();
  const { lines, subtotal, deliveryFee, total } = useCart();

  return (
    <main className="container">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Cart" }]} />
      <h1 style={{ fontSize: "clamp(24px,3vw,32px)", marginBottom: 16 }}>
        Your cart{" "}
        {lines.length > 0 && (
          <span className="muted" style={{ fontSize: 16, fontWeight: 500 }}>
            ({lines.length} {lines.length === 1 ? "item" : "items"})
          </span>
        )}
      </h1>

      {!hydrated ? (
        <p className="muted" style={{ padding: "40px 0" }} aria-busy="true">
          Loading your cart…
        </p>
      ) : lines.length === 0 ? (
        <div className="card empty">
          <h2>Your cart is empty</h2>
          <p>Add toilet rolls, tissues or wipes to get started.</p>
          <Link className="btn btn-primary" href="/shop">
            Shop all products
          </Link>
        </div>
      ) : (
        <div className="split">
          <div className="card card-pad" style={{ paddingTop: 4, paddingBottom: 4 }}>
            {lines.map(({ product, qty, lineTotal }) => (
              <div className="line" key={product.id}>
                <Link className="line-img" href={`/product/${product.id}`} tabIndex={-1} aria-hidden="true">
                  <Image src={productImage(product.id)} alt="" fill sizes="88px" />
                </Link>
                <div>
                  <Link className="line-name" href={`/product/${product.id}`}>
                    {productTitle(product)}
                  </Link>
                  <div className="small muted">{inr(product.mrp)} each</div>
                  <div className="line-ctrl">
                    <QtyStepper small value={qty} onChange={(n) => cart.setQty(product.id, n)} label={`Quantity of ${product.name}`} />
                    <button type="button" className="link-btn danger" onClick={() => cart.remove(product.id)}>
                      Remove
                    </button>
                  </div>
                </div>
                <div className="line-total price">{inr(lineTotal)}</div>
              </div>
            ))}
          </div>

          <aside className="card card-pad summary" aria-label="Order summary">
            <h2 style={{ fontSize: 17, marginBottom: 10 }}>Order summary</h2>
            <div className="sum-row">
              <span>Subtotal</span>
              <span className="price">{inr(subtotal)}</span>
            </div>
            <div className="sum-row">
              <span>Delivery</span>
              <span className="price">{deliveryFee === 0 ? "Free" : inr(deliveryFee)}</span>
            </div>
            <div className="sum-row sum-total">
              <span>Total</span>
              <span className="price">{inr(total)}</span>
            </div>
            <p className="hint" style={{ margin: "4px 0 16px" }}>
              Prices are MRP, inclusive of all taxes.
            </p>
            <Link className="btn btn-primary btn-lg btn-block" href="/checkout">
              Proceed to checkout
            </Link>
            <Link className="btn btn-ghost btn-block" href="/shop" style={{ marginTop: 8 }}>
              Continue shopping
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}
