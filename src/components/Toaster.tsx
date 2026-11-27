"use client";

import Link from "next/link";
import { useToasts } from "@/store/toast";

export function Toaster() {
  const toasts = useToasts();
  return (
    <div className="toasts" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div className="toast" key={t.id}>
          <span>{t.message}</span>
          {t.action && <Link href={t.action.href}>{t.action.label}</Link>}
        </div>
      ))}
    </div>
  );
}
