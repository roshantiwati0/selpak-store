import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ContactForm } from "@/components/ContactForm";
import { SELLER } from "@/lib/config";

export const metadata: Metadata = {
  title: "Contact us",
  description: `Contact ${SELLER.name}, ${SELLER.city} for help with your Selpak order.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="container">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact us" }]} />
      <h1 style={{ fontSize: "clamp(24px,3vw,32px)", marginBottom: 16 }}>Contact us</h1>
      <div className="split" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))" }}>
        <div className="stack">
          <div className="card card-pad">
            <div className="eyebrow">Sold by</div>
            <h2 style={{ margin: "6px 0 12px" }}>{SELLER.name}</h2>
            <table className="spec">
              <tbody>
                <tr>
                  <th scope="row">City</th>
                  <td>{SELLER.city}</td>
                </tr>
                <tr>
                  <th scope="row">Phone</th>
                  <td>
                    <a href={`tel:${SELLER.phone}`}>{SELLER.phone}</a>
                  </td>
                </tr>
              </tbody>
            </table>
            <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
              <a className="btn btn-primary" href={`tel:${SELLER.phone}`}>
                Call now
              </a>
            </div>
          </div>
          <div className="card card-pad">
            <h3>Need help with an order?</h3>
            <p className="muted" style={{ margin: "6px 0 14px" }}>
              Check the status of your order or reorder from your account.
            </p>
            <Link className="btn btn-secondary" href="/account/orders">
              Go to my orders
            </Link>
          </div>
        </div>
        <ContactForm />
      </div>
    </main>
  );
}
