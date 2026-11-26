"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { auth, useAuth } from "@/store/auth";

const LINKS = [
  { href: "/account/orders", label: "My orders" },
  { href: "/account", label: "Profile" },
];

export function AccountNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  return (
    <aside className="card side is-mobile-row" style={{ padding: "8px 0", overflow: "hidden" }} aria-label="Account">
      {LINKS.map((l) => (
        <Link key={l.href} href={l.href} className={pathname === l.href ? "is-on" : undefined}>
          {l.label}
        </Link>
      ))}
      {user && (
        <Link
          href="/"
          onClick={(e) => {
            e.preventDefault();
            auth.signOut();
            router.push("/");
          }}
        >
          Logout
        </Link>
      )}
    </aside>
  );
}

/** Shown on account pages when nobody is logged in. */
export function LoginPrompt({ next }: { next: string }) {
  return (
    <div className="card empty">
      <h2>Please log in</h2>
      <p>Log in with your mobile number to see this page.</p>
      <Link className="btn btn-primary" href={`/login?next=${encodeURIComponent(next)}`}>
        Login
      </Link>
    </div>
  );
}
