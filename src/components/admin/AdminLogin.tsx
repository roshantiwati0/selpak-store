"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { adminApi } from "@/lib/admin";
import { errorMessage } from "@/lib/api";
import { DEMO_ADMIN, IS_DEMO } from "@/lib/config";
import { adminAuth } from "@/store/adminAuth";

export function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError("Enter your username and password.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const { admin, token } = await adminApi.login(username, password);
      adminAuth.signIn(admin, token);
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  }

  return (
    <div className="adm-gate">
      <form className="card auth" onSubmit={submit} noValidate>
        <h1 style={{ fontSize: 26 }}>Admin login</h1>
        <p className="muted" style={{ margin: "6px 0 16px" }}>
          For the shop owner and staff. Customers log in from the store.
        </p>
        {IS_DEMO && (
          <p className="notice notice-info" style={{ marginBottom: 14 }}>
            Demo mode: username <b>{DEMO_ADMIN.username}</b>, password <b>{DEMO_ADMIN.password}</b>.
          </p>
        )}
        <div className="stack">
          <div className="field">
            <label htmlFor="a-user">Username</label>
            <input id="a-user" className="input" autoComplete="username" autoCapitalize="none" value={username} onChange={(e) => { setUsername(e.target.value); setError(""); }} autoFocus />
          </div>
          <div className="field">
            <label htmlFor="a-pass">Password</label>
            <input id="a-pass" className="input" type="password" autoComplete="current-password" value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} />
          </div>
          {error && (
            <p className="notice notice-err" role="alert">
              {error}
            </p>
          )}
          <button className="btn btn-primary btn-lg" type="submit" disabled={busy}>
            {busy ? "Logging in…" : "Log in"}
          </button>
        </div>
        <p className="hint" style={{ marginTop: 18, textAlign: "center" }}>
          <Link href="/">Back to the store</Link>
        </p>
      </form>
    </div>
  );
}
