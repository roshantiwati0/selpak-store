"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/store/auth";
import { CartIcon, GridIcon, HomeIcon, UserIcon } from "./Icons";

export function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const on = (test: boolean) => (test ? "is-on" : undefined);
  return (
    <nav className="bottom-nav" aria-label="Mobile">
      <Link href="/" className={on(pathname === "/")}>
        <HomeIcon />
        Home
      </Link>
      <Link href="/shop" className={on(pathname.startsWith("/shop") || pathname.startsWith("/product"))}>
        <GridIcon />
        Shop
      </Link>
      <Link href="/cart" className={on(pathname === "/cart" || pathname === "/checkout")}>
        <CartIcon />
        Cart
      </Link>
      <Link href={user ? "/account/orders" : "/login"} className={on(pathname.startsWith("/account") || pathname === "/login")}>
        <UserIcon />
        Account
      </Link>
    </nav>
  );
}
