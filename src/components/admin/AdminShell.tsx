"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { asset, IS_DEMO } from "@/lib/config";
import { adminAuth, useAdminAuth } from "@/store/adminAuth";
import { useHydrated } from "@/store/createStore";
import { BoxIcon, CartIcon, GridIcon, HomeIcon, UserIcon } from "../Icons";
import { AdminLogin } from "./AdminLogin";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: GridIcon },
  { href: "/admin/orders", label: "Orders", icon: CartIcon },
  { href: "/admin/products", label: "Products", icon: BoxIcon },
  { href: "/admin/customers", label: "Customers", icon: UserIcon },
];

/* Admin panel ka dhaancha: baayin taraf menu, daayin taraf page. Login na ho to login form dikhta hai. */
export function AdminShell({ children }: { children: ReactNode }) {
  const hydrated = useHydrated();
  const pathname = usePathname();
  const { admin } = useAdminAuth();

  // An order's own page belongs to "Orders" in the menu.
  const isOn = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href) || (href === "/admin/orders" && pathname === "/admin/order"));

  /* Page ({children}) hamesha render hota hai, login ke bina bas chhupa rehta hai aur koi data nahi laata
     (pages useAdminKey se login ka intezaar karte hain). Next.js ko page ka dhaancha har haal me chahiye:
     use hata dene par dev mode "instant-unrendered-segment" error deta hai. */
  return (
    <>
      {!hydrated && (
        <div className="adm-gate">
          <p className="muted" aria-busy="true">
            Loading…
          </p>
        </div>
      )}
      {hydrated && !admin && <AdminLogin />}
      <div className="adm" hidden={!hydrated || !admin}>
      <aside className="adm-side">
        <Link className="adm-brand" href="/admin" aria-label="Admin dashboard">
          <Image src={asset("/logo.png")} alt="Selpak" width={250} height={208} loading="eager" />
          <span>Admin</span>
        </Link>
        <nav className="adm-nav" aria-label="Admin">
          {LINKS.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className={isOn(href) ? "is-on" : undefined} aria-current={isOn(href) ? "page" : undefined}>
              <Icon size={20} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="adm-side-foot">
          <Link href="/">
            <HomeIcon size={20} />
            View store
          </Link>
          <button type="button" onClick={() => adminAuth.signOut()}>
            Log out
          </button>
        </div>
      </aside>
      <div className="adm-main">
        <header className="adm-top">
          <span className="adm-who">
            Signed in as <b>{admin?.name}</b>
          </span>
          {IS_DEMO && <span className="badge badge-warn">Demo mode</span>}
        </header>
        <main className="adm-content">{children}</main>
      </div>
      </div>
    </>
  );
}
