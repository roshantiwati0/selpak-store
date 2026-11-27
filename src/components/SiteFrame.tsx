"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/* Dukaan ka header / footer sirf dukaan ke pages par. Admin panel (/admin) ka apna alag dhaancha hai,
   isliye wahan yeh nahi dikhte. Header aur footer server se bankar props me aate hain. */
export function SiteFrame({ header, footer, children }: { header: ReactNode; footer: ReactNode; children: ReactNode }) {
  const isAdmin = usePathname().startsWith("/admin");
  return (
    <>
      {!isAdmin && header}
      <div id="main">{children}</div>
      {!isAdmin && footer}
    </>
  );
}
