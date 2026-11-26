import Image from "next/image";
import Link from "next/link";
import { getCategories } from "@/lib/catalog";
import { SELLER, SITE } from "@/lib/config";
import { POLICIES } from "@/lib/policies";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div>
          <Image src="/logo.png" alt="Selpak" width={250} height={208} />
          <p>
            Selpak tissue and hygiene products for your home, sold by {SELLER.name}, {SELLER.city}.
          </p>
        </div>
        <div>
          <h4>Shop</h4>
          {getCategories().map((c) => (
            <Link key={c.id} href={`/shop/${c.id}`}>
              {c.name}
            </Link>
          ))}
        </div>
        <div>
          <h4>My account</h4>
          <Link href="/login">Login / sign up</Link>
          <Link href="/account/orders">My orders</Link>
          <Link href="/cart">Cart</Link>
        </div>
        <div>
          <h4>Help</h4>
          <Link href="/contact">Contact us</Link>
          {POLICIES.map((p) => (
            <Link key={p.slug} href={`/policies/${p.slug}`}>
              {p.title}
            </Link>
          ))}
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <span>
            &copy; {SITE.year} {SELLER.name}. All rights reserved.
          </span>
          <span>UPI &middot; Cards &middot; Net banking &middot; Cash on delivery</span>
        </div>
      </div>
    </footer>
  );
}
