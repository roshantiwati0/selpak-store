"use client";

import { useState, type FormEvent } from "react";
import type { User } from "@/lib/types";
import { auth, useAuth } from "@/store/auth";
import { useHydrated } from "@/store/createStore";
import { toast } from "@/store/toast";
import { LoginPrompt } from "./AccountNav";

export function ProfileView() {
  const hydrated = useHydrated();
  const { user } = useAuth();
  if (!hydrated) return <p className="muted" aria-busy="true">Loading…</p>;
  if (!user) return <LoginPrompt next="/account" />;
  return <ProfileForm user={user} />;
}

function ProfileForm({ user }: { user: User }) {
  const [name, setName] = useState(user.name ?? "");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    auth.updateName(name.trim());
    toast("Profile saved");
  }

  return (
    <>
      <h1 style={{ fontSize: "clamp(24px,3vw,32px)", marginBottom: 12 }}>Profile</h1>
      <form className="card card-pad stack" style={{ maxWidth: 480 }} onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="p-name">Full name</label>
          <input id="p-name" className="input" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Your name" />
        </div>
        <div className="field">
          <label htmlFor="p-phone">Mobile number</label>
          <input id="p-phone" className="input" value={`+91 ${user.phone}`} readOnly disabled />
          <span className="hint">Your mobile number is your login and cannot be changed here.</span>
        </div>
        <button className="btn btn-primary" type="submit" style={{ justifySelf: "start" }}>
          Save
        </button>
      </form>
    </>
  );
}
