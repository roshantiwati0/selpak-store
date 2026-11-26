"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { api, errorMessage } from "@/lib/api";
import { inr } from "@/lib/format";
import type { Product } from "@/lib/types";
import { cart } from "@/store/cart";
import { toast } from "@/store/toast";
import { QtyStepper } from "./QtyStepper";

type PinState = { tone: "ok" | "err"; message: string } | null;

export function BuyBox({ product }: { product: Product }) {
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [pin, setPin] = useState("");
  const [pinState, setPinState] = useState<PinState>(null);
  const [checking, setChecking] = useState(false);

  async function checkPin(e: FormEvent) {
    e.preventDefault();
    setChecking(true);
    try {
      const res = await api.checkPincode(pin);
      setPinState({ tone: res.serviceable ? "ok" : "err", message: res.message });
    } catch (err) {
      setPinState({ tone: "err", message: errorMessage(err) });
    } finally {
      setChecking(false);
    }
  }

  return (
    <>
      <div className="buy-row" style={{ marginTop: 20 }}>
        <QtyStepper value={qty} onChange={setQty} />
        <button
          type="button"
          className="btn btn-primary btn-lg"
          onClick={() => {
            cart.add(product.id, qty);
            toast("Added to cart", { label: "View cart", href: "/cart" });
          }}
        >
          Add to cart &middot; {inr(product.mrp * qty)}
        </button>
        <button
          type="button"
          className="btn btn-secondary btn-lg"
          onClick={() => {
            cart.add(product.id, qty);
            router.push("/checkout");
          }}
        >
          Buy now
        </button>
      </div>

      <form className="card card-pad" style={{ marginTop: 20 }} onSubmit={checkPin}>
        <h3 style={{ marginBottom: 10 }}>
          <label htmlFor="pin">Check delivery</label>
        </h3>
        <div className="pin">
          <input
            id="pin"
            className="input"
            inputMode="numeric"
            maxLength={6}
            placeholder="Enter pincode"
            value={pin}
            onChange={(e) => {
              setPin(e.target.value.replace(/\D/g, ""));
              setPinState(null);
            }}
          />
          <button className="btn btn-secondary" type="submit" disabled={checking || pin.length === 0}>
            {checking ? "Checking…" : "Check"}
          </button>
        </div>
        <p className="hint" style={{ marginTop: 8, color: pinState ? `var(--${pinState.tone === "ok" ? "green" : "red"})` : undefined }} aria-live="polite">
          {pinState ? pinState.message : "Cash on delivery and online payment available."}
        </p>
      </form>
    </>
  );
}
