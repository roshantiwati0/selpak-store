import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginView } from "@/components/LoginView";

export const metadata: Metadata = { title: "Login or sign up", robots: { index: false } };

export default function LoginPage() {
  return (
    <main className="container">
      <Suspense fallback={<p className="muted" style={{ padding: "60px 0" }}>Loading…</p>}>
        <LoginView />
      </Suspense>
    </main>
  );
}
