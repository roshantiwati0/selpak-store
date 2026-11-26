"use client";

import { useState, type FormEvent } from "react";
import { api, errorMessage } from "@/lib/api";
import { isPhone } from "@/lib/format";

const TOPICS = ["Order help", "Product question", "Return or refund", "Other"];

export function ContactForm() {
  const [form, setForm] = useState({ name: "", phone: "", topic: TOPICS[0], message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "busy" | "sent">("idle");
  const [formError, setFormError] = useState("");

  const set = (key: keyof typeof form) => (e: { target: { value: string } }) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const found: Record<string, string> = {};
    if (form.name.trim().length < 2) found.name = "Enter your name.";
    if (!isPhone(form.phone)) found.phone = "Enter a valid 10-digit mobile number.";
    if (form.message.trim().length < 10) found.message = "Tell us a little more (at least 10 characters).";
    setErrors(found);
    const firstBad = Object.keys(found)[0];
    if (firstBad) {
      document.getElementById(`c-${firstBad}`)?.focus();
      return;
    }
    setState("busy");
    setFormError("");
    try {
      await api.sendMessage(form);
      setState("sent");
    } catch (err) {
      setFormError(errorMessage(err));
      setState("idle");
    }
  }

  if (state === "sent") {
    return (
      <div className="card card-pad" role="status">
        <h2 style={{ fontSize: 19 }}>Message sent</h2>
        <p className="muted" style={{ margin: "6px 0 14px" }}>
          Thank you, {form.name.split(" ")[0]}. We will call you back on {form.phone}.
        </p>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            setForm({ name: "", phone: "", topic: TOPICS[0], message: "" });
            setState("idle");
          }}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form className="card card-pad stack" onSubmit={onSubmit} noValidate>
      <h2 style={{ fontSize: 19 }}>Send us a message</h2>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="c-name">Name</label>
          <input id="c-name" className={`input${errors.name ? " is-err" : ""}`} value={form.name} onChange={set("name")} autoComplete="name" placeholder="Your name" />
          {errors.name && <span className="err">{errors.name}</span>}
        </div>
        <div className="field">
          <label htmlFor="c-phone">Mobile number</label>
          <input
            id="c-phone"
            className={`input${errors.phone ? " is-err" : ""}`}
            value={form.phone}
            onChange={set("phone")}
            inputMode="numeric"
            maxLength={10}
            autoComplete="tel-national"
            placeholder="10-digit mobile number"
          />
          {errors.phone && <span className="err">{errors.phone}</span>}
        </div>
        <div className="field full">
          <label htmlFor="c-topic">Topic</label>
          <select id="c-topic" className="select" value={form.topic} onChange={set("topic")}>
            {TOPICS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="field full">
          <label htmlFor="c-message">Message</label>
          <textarea id="c-message" className={`textarea${errors.message ? " is-err" : ""}`} value={form.message} onChange={set("message")} placeholder="How can we help?" />
          {errors.message && <span className="err">{errors.message}</span>}
        </div>
      </div>
      {formError && (
        <p className="notice notice-err" role="alert">
          {formError}
        </p>
      )}
      <button className="btn btn-primary btn-lg" type="submit" disabled={state === "busy"}>
        {state === "busy" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
