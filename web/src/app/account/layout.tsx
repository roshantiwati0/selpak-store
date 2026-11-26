import type { Metadata } from "next";
import { AccountNav } from "@/components/AccountNav";

export const metadata: Metadata = { robots: { index: false } };

export default function AccountLayout({ children }: LayoutProps<"/account">) {
  return (
    <main className="container">
      <div className="crumbs">My account</div>
      <div className="account">
        <AccountNav />
        <div>{children}</div>
      </div>
    </main>
  );
}
