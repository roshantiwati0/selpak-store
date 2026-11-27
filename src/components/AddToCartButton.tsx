"use client";

import { cart } from "@/store/cart";
import { toast } from "@/store/toast";

interface Props {
  productId: string;
  productName: string;
  qty?: number;
  className?: string;
  children?: React.ReactNode;
}

export function AddToCartButton({ productId, productName, qty = 1, className = "btn btn-primary btn-sm", children = "Add" }: Props) {
  return (
    <button
      type="button"
      className={className}
      aria-label={`Add ${productName} to cart`}
      onClick={() => {
        cart.add(productId, qty);
        toast("Added to cart", { label: "View cart", href: "/cart" });
      }}
    >
      {children}
    </button>
  );
}
