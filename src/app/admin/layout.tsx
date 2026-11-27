import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { SITE } from "@/lib/config";
import "./admin.css";

/* Admin panel: dukaan ke maalik / staff ke liye. Search engine me nahi aana chahiye. */
export const metadata: Metadata = {
  title: { default: "Admin", template: `%s — ${SITE.name} admin` },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
