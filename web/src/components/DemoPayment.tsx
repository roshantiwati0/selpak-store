"use client";

import { useEffect, useRef, useState } from "react";
import { inr } from "@/lib/format";

interface Props {
  amount: number;
  orderId: string;
  onResult: (success: boolean) => Promise<void>;
  onClose: () => void;
}

/* Sirf DEMO mode ke liye: asli site par yahan Razorpay ka popup khulta hai. */
export function DemoPayment({ amount, orderId, onResult, onClose }: Props) {
  const [busy, setBusy] = useState(false);
  const firstButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    firstButton.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const run = async (success: boolean) => {
    setBusy(true);
    await onResult(success);
  };

  return (
    <div className="modal-back" role="dialog" aria-modal="true" aria-labelledby="demo-pay-title">
      <div className="modal">
        <span className="badge badge-warn">Demo payment</span>
        <h2 id="demo-pay-title" style={{ margin: "10px 0 4px" }}>
          Pay {inr(amount)}
        </h2>
        <p className="muted small">Order {orderId}. This is a test screen; no real money is taken. On the live site the Razorpay payment window opens here.</p>
        <div className="stack" style={{ marginTop: 18, gap: 10 }}>
          <button ref={firstButton} type="button" className="btn btn-primary btn-lg" disabled={busy} onClick={() => run(true)}>
            {busy ? "Please wait…" : "Simulate successful payment"}
          </button>
          <button type="button" className="btn btn-secondary" disabled={busy} onClick={() => run(false)}>
            Simulate failed payment
          </button>
          <button type="button" className="btn btn-ghost" disabled={busy} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
