"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { api, errorMessage } from "@/lib/api";
import { productImage } from "@/lib/catalog";
import { IS_DEMO, STATES } from "@/lib/config";
import { inr, isEmail, isPhone, isPincode } from "@/lib/format";
import { payWithRazorpay } from "@/lib/razorpay";
import type { Address, Order, PaymentMethod } from "@/lib/types";
import { savedAddress } from "@/store/address";
import { auth } from "@/store/auth";
import { cart, useCart } from "@/store/cart";
import { useHydrated } from "@/store/createStore";
import { Breadcrumbs } from "./Breadcrumbs";
import { DemoPayment } from "./DemoPayment";

type Errors = Partial<Record<keyof Address, string>>;

function validate(a: Address): Errors {
  const e: Errors = {};
  if (a.name.trim().length < 2) e.name = "Enter your full name.";
  if (!isPhone(a.phone)) e.phone = "Enter a valid 10-digit mobile number.";
  if (a.email && !isEmail(a.email)) e.email = "Enter a valid email, or leave it empty.";
  if (!isPincode(a.pincode)) e.pincode = "Enter a 6-digit pincode.";
  if (a.city.trim().length < 2) e.city = "Enter your city.";
  if (a.line1.trim().length < 5) e.line1 = "Enter your flat, building and street.";
  return e;
}

export function CheckoutView() {
  const hydrated = useHydrated();

  if (!hydrated) {
    return (
      <main className="container">
        <p className="muted" style={{ padding: "60px 0" }} aria-busy="true">
          Loading checkout…
        </p>
      </main>
    );
  }
  return <CheckoutForm />;
}

function CheckoutForm() {
  const router = useRouter();
  const { lines, subtotal, deliveryFee, total } = useCart();

  /* Form sirf browser me banta hai, isliye saved data se seedha shuru kar sakte hain. */
  const [address, setAddress] = useState<Address>(() => {
    const saved = savedAddress.get();
    const user = auth.user();
    return saved ?? { name: user?.name ?? "", phone: user?.phone ?? "", email: "", pincode: "", city: "", line1: "", landmark: "", state: STATES[0] };
  });
  const [method, setMethod] = useState<PaymentMethod>("online");
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState("");
  const [pending, setPending] = useState<Order | null>(null); // order banaya par payment baaki
  const [demoPay, setDemoPay] = useState(false);
  const [done, setDone] = useState(false); // order ho gaya, confirmation page khul raha hai

  const set = (key: keyof Address) => (e: { target: { value: string } }) => {
    setAddress((a) => ({ ...a, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  function finish(order: Order) {
    setDone(true);
    cart.clear();
    router.push(`/order?id=${encodeURIComponent(order.id)}&new=1`);
  }

  async function collectPayment(order: Order) {
    if (IS_DEMO) {
      setDemoPay(true);
      return;
    }
    const outcome = await payWithRazorpay(order);
    if (outcome.status === "paid") finish(outcome.order);
    else setFormError(outcome.status === "failed" ? outcome.message : "Payment was not completed. You can try again.");
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError("");
    const found = validate(address);
    setErrors(found);
    const firstBad = Object.keys(found)[0];
    if (firstBad) {
      document.getElementById(`f-${firstBad}`)?.focus();
      return;
    }
    setBusy(true);
    try {
      savedAddress.save(address);
      if (pending && method === "online") {
        await collectPayment(pending);
        return;
      }
      const order = await api.createOrder({
        items: lines.map((l) => ({ productId: l.product.id, qty: l.qty })),
        address,
        paymentMethod: method,
      });
      if (method === "cod") {
        finish(order);
        return;
      }
      setPending(order);
      await collectPayment(order);
    } catch (err) {
      setFormError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function onDemoResult(success: boolean) {
    if (!pending) return;
    try {
      const order = await api.demoPayment(pending.id, success);
      setDemoPay(false);
      if (success) finish(order);
      else setFormError("Payment failed. No money was taken. You can try again or choose cash on delivery.");
    } catch (err) {
      setDemoPay(false);
      setFormError(errorMessage(err));
    }
  }

  if (done) {
    return (
      <main className="container">
        <p className="muted" style={{ padding: "60px 0" }} aria-busy="true">
          Order placed. Opening your confirmation…
        </p>
      </main>
    );
  }

  if (lines.length === 0) {
    return (
      <main className="container">
        <Breadcrumbs items={[{ label: "Cart", href: "/cart" }, { label: "Checkout" }]} />
        <div className="card empty">
          <h1 style={{ fontSize: 24, marginBottom: 6 }}>Nothing to check out</h1>
          <p>Your cart is empty.</p>
          <Link className="btn btn-primary" href="/shop">
            Shop all products
          </Link>
        </div>
      </main>
    );
  }

  const field = (key: keyof Address, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}, hint?: string, full = false) => (
    <div className={`field${full ? " full" : ""}`}>
      <label htmlFor={`f-${key}`}>{label}</label>
      <input
        id={`f-${key}`}
        className={`input${errors[key] ? " is-err" : ""}`}
        value={address[key] ?? ""}
        onChange={set(key)}
        aria-invalid={errors[key] ? true : undefined}
        aria-describedby={errors[key] ? `e-${key}` : undefined}
        {...props}
      />
      {errors[key] ? (
        <span className="err" id={`e-${key}`}>
          {errors[key]}
        </span>
      ) : (
        hint && <span className="hint">{hint}</span>
      )}
    </div>
  );

  const submitLabel = busy ? "Please wait…" : pending && method === "online" ? "Retry payment" : method === "cod" ? "Place order" : `Pay ${inr(total)}`;

  return (
    <main className="container">
      <Breadcrumbs items={[{ label: "Cart", href: "/cart" }, { label: "Checkout" }]} />
      <h1 style={{ fontSize: "clamp(24px,3vw,32px)" }}>Checkout</h1>
      <div className="steps" aria-label="Checkout steps">
        <span className="is-done">
          <i>&#10003;</i>Cart
        </span>
        <hr />
        <span className="is-on">
          <i>2</i>Address &amp; payment
        </span>
        <hr />
        <span>
          <i>3</i>Confirmation
        </span>
      </div>

      <form className="split" onSubmit={onSubmit} noValidate>
        <div className="stack">
          <section className="card card-pad">
            <div className="block-title">
              <h2 style={{ fontSize: 17 }}>1. Contact</h2>
              {!auth.user() && (
                <Link href="/login?next=/checkout" className="small">
                  Already have an account? Login
                </Link>
              )}
            </div>
            <div className="form-grid">
              {field("name", "Full name", { autoComplete: "name", placeholder: "Your name" })}
              {field(
                "phone",
                "Mobile number",
                { inputMode: "numeric", autoComplete: "tel-national", maxLength: 10, placeholder: "10-digit mobile number" },
                "Order updates are sent to this number.",
              )}
              {field("email", "Email (optional)", { type: "email", autoComplete: "email", placeholder: "For your invoice" }, undefined, true)}
            </div>
          </section>

          <section className="card card-pad">
            <div className="block-title">
              <h2 style={{ fontSize: 17 }}>2. Delivery address</h2>
            </div>
            <div className="form-grid">
              {field("pincode", "Pincode", { inputMode: "numeric", autoComplete: "postal-code", maxLength: 6, placeholder: "6-digit pincode" })}
              {field("city", "City", { autoComplete: "address-level2", placeholder: "City" })}
              {field("line1", "Flat, building, street", { autoComplete: "address-line1", placeholder: "Address" }, undefined, true)}
              {field("landmark", "Area / landmark (optional)", { autoComplete: "address-line2", placeholder: "Landmark" })}
              <div className="field">
                <label htmlFor="f-state">State</label>
                <select id="f-state" className="select" value={address.state} onChange={set("state")} autoComplete="address-level1">
                  {STATES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="card card-pad">
            <div className="block-title">
              <h2 style={{ fontSize: 17 }}>3. Payment</h2>
            </div>
            <label className={`pay${method === "online" ? " is-on" : ""}`}>
              <input type="radio" name="pay" checked={method === "online"} onChange={() => setMethod("online")} />
              <span>
                <b>Pay online</b>
                <small>UPI, credit or debit card, net banking. Secured by Razorpay.</small>
              </span>
            </label>
            <label className={`pay${method === "cod" ? " is-on" : ""}`}>
              <input type="radio" name="pay" checked={method === "cod"} onChange={() => setMethod("cod")} />
              <span>
                <b>Cash on delivery</b>
                <small>Pay in cash or UPI when the order arrives.</small>
              </span>
            </label>
            {IS_DEMO && <p className="notice notice-info">Demo mode: online payment opens a test screen. No real money is taken.</p>}
          </section>

          {formError && (
            <p className="notice notice-err" role="alert">
              {formError}
            </p>
          )}
          <button className="btn btn-primary btn-lg only-mobile" type="submit" disabled={busy} style={{ width: "100%" }}>
            {submitLabel}
          </button>
        </div>

        <aside className="card card-pad summary" aria-label="Order summary">
          <h2 style={{ fontSize: 17, marginBottom: 6 }}>Order summary</h2>
          {lines.map(({ product, qty, lineTotal }) => (
            <div className="line" key={product.id} style={{ gridTemplateColumns: "56px 1fr auto", padding: "10px 0", gap: 12 }}>
              <div className="line-img" style={{ width: 56, height: 56 }}>
                <Image src={productImage(product.id)} alt="" fill sizes="56px" />
              </div>
              <div>
                <div className="line-name small">
                  Selpak {product.name}, {product.size}
                </div>
                <div className="small muted">Qty {qty}</div>
              </div>
              <div className="line-total price" style={{ fontSize: 14, gridColumn: "auto" }}>
                {inr(lineTotal)}
              </div>
            </div>
          ))}
          <div className="sum-row" style={{ marginTop: 8 }}>
            <span>Subtotal</span>
            <span className="price">{inr(subtotal)}</span>
          </div>
          <div className="sum-row">
            <span>Delivery</span>
            <span className="price">{deliveryFee === 0 ? "Free" : inr(deliveryFee)}</span>
          </div>
          <div className="sum-row sum-total">
            <span>Total</span>
            <span className="price">{inr(total)}</span>
          </div>
          <button className="btn btn-primary btn-lg btn-block hide-m" type="submit" disabled={busy} style={{ marginTop: 16 }}>
            {submitLabel}
          </button>
          <p className="hint" style={{ marginTop: 10, textAlign: "center" }}>
            By placing the order you agree to our <Link href="/policies/terms">Terms</Link> and{" "}
            <Link href="/policies/returns">Refund policy</Link>.
          </p>
        </aside>
      </form>

      {demoPay && pending && <DemoPayment amount={pending.total} orderId={pending.id} onResult={onDemoResult} onClose={() => setDemoPay(false)} />}
    </main>
  );
}
