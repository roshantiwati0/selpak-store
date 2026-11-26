"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { getCategories } from "@/lib/catalog";
import { SELLER } from "@/lib/config";
import { useAuth } from "@/store/auth";
import { useCart } from "@/store/cart";
import { CartIcon, SearchIcon, UserIcon } from "./Icons";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { count } = useCart();
  const { user } = useAuth();

  function onSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = String(new FormData(e.currentTarget).get("q") ?? "").trim();
    router.push(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
  }

  return (
    <>
      <div className="topbar">
        <div className="container">
          <span>
            Sold by {SELLER.name}, {SELLER.city}
          </span>
          <span className="hide-m">
            Help? Call <a href={`tel:${SELLER.phone}`}>{SELLER.phone}</a>
          </span>
        </div>
      </div>
      <header className="header">
        <div className="container header-main">
          <Link className="logo" href="/" aria-label="Selpak Store home">
            <Image src="/logo.png" alt="Selpak" width={250} height={208} priority />
          </Link>
          <form className="search" role="search" onSubmit={onSearch}>
            <SearchIcon size={20} />
            <input type="search" name="q" placeholder="Search toilet rolls, tissues, wipes..." aria-label="Search products" />
          </form>
          <div className="header-actions">
            <Link className="icon-btn" href={user ? "/account/orders" : "/login"}>
              <UserIcon />
              <span className="lbl">{user ? "Account" : "Login"}</span>
            </Link>
            <Link className="icon-btn" href="/cart" aria-label={`Cart, ${count} items`}>
              <CartIcon />
              {count > 0 && <span className="cart-count">{count}</span>}
              <span className="lbl">Cart</span>
            </Link>
          </div>
        </div>
        <nav className="nav" aria-label="Categories">
          <div className="container">
            <Link href="/shop" className={pathname === "/shop" ? "is-on" : undefined}>
              All products
            </Link>
            {getCategories().map((c) => (
              <Link key={c.id} href={`/shop/${c.id}`} className={pathname === `/shop/${c.id}` ? "is-on" : undefined}>
                {c.name}
              </Link>
            ))}
          </div>
        </nav>
      </header>
    </>
  );
}
