"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { api, errorMessage } from "@/lib/api";
import { DEMO_OTP, IS_DEMO } from "@/lib/config";
import { isPhone } from "@/lib/format";
import { auth } from "@/store/auth";
import { toast } from "@/store/toast";

/* Sirf apni site ke andar ka path allow karo (bahar ke link par redirect nahi). */
function safeNext(next: string | null) {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/account/orders";
}

export function LoginView() {
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function sendOtp(e?: FormEvent) {
    e?.preventDefault();
    if (!isPhone(phone)) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await api.requestOtp(phone);
      setOtp("");
      setStep("otp");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function verify(e: FormEvent) {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Enter the 6-digit OTP.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const { user, token } = await api.verifyOtp(phone, otp);
      auth.signIn(user, token);
      toast("You are logged in");
      router.replace(next);
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  }

  return (
    <div className="card auth">
      <h1 style={{ fontSize: 26 }}>Login or sign up</h1>

      {step === "phone" ? (
        <form className="stack" style={{ marginTop: 8 }} onSubmit={sendOtp} noValidate>
          <p className="muted">Enter your mobile number. We will send a one-time password.</p>
          <div className="field">
            <label htmlFor="l-phone">Mobile number</label>
            <div style={{ display: "flex", gap: 8 }}>
              <span className="input" style={{ width: 64, display: "grid", placeItems: "center", background: "var(--bg)" }} aria-hidden="true">
                +91
              </span>
              <input
                id="l-phone"
                className={`input${error ? " is-err" : ""}`}
                inputMode="numeric"
                autoComplete="tel-national"
                maxLength={10}
                placeholder="10-digit mobile number"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value.replace(/\D/g, ""));
                  setError("");
                }}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "l-err" : undefined}
                autoFocus
              />
            </div>
            {error && (
              <span className="err" id="l-err" role="alert">
                {error}
              </span>
            )}
          </div>
          <button className="btn btn-primary btn-lg" type="submit" disabled={busy}>
            {busy ? "Sending…" : "Send OTP"}
          </button>
        </form>
      ) : (
        <form className="stack" style={{ marginTop: 8 }} onSubmit={verify} noValidate>
          <p className="muted">
            Enter the 6-digit OTP sent to +91 {phone}.{" "}
            <button type="button" className="link-btn" onClick={() => { setStep("phone"); setError(""); }}>
              Change number
            </button>
          </p>
          {IS_DEMO && <p className="notice notice-info">Demo mode: no SMS is sent. Use OTP {DEMO_OTP}.</p>}
          <div className="field">
            <label htmlFor="l-otp">One-time password</label>
            <input
              id="l-otp"
              className={`input${error ? " is-err" : ""}`}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="6-digit OTP"
              style={{ letterSpacing: "0.3em", fontWeight: 700 }}
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value.replace(/\D/g, ""));
                setError("");
              }}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "l-err" : undefined}
              autoFocus
            />
            {error && (
              <span className="err" id="l-err" role="alert">
                {error}
              </span>
            )}
          </div>
          <button className="btn btn-primary btn-lg" type="submit" disabled={busy}>
            {busy ? "Verifying…" : "Verify and continue"}
          </button>
          <button type="button" className="link-btn" disabled={busy} onClick={() => sendOtp()}>
            Resend OTP
          </button>
        </form>
      )}

      <p className="hint" style={{ marginTop: 18, textAlign: "center" }}>
        By continuing you agree to our <Link href="/policies/terms">Terms</Link> and <Link href="/policies/privacy">Privacy policy</Link>.
      </p>
    </div>
  );
}
