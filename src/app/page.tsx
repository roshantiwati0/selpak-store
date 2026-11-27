import Image from "next/image";
import Link from "next/link";
import { BoxIcon, CashIcon, GiftIcon, ShieldIcon } from "@/components/Icons";
import { ProductGrid } from "@/components/ProductCard";
import { getCategories, getProductsByIds, productImage, queryProducts } from "@/lib/catalog";

const POPULAR = ["tp-12", "kt-4", "ft-maxi-100", "ww-organic-100", "tp-comfort-4", "hanky-classic", "nap-lunch-100", "tp-4ply-16"];
const NEW_RANGE = ["tp-comfort-4", "tp-comfort-12", "tp-deluxe-4", "kt-8-deluxe"];

const TRUST = [
  { icon: <ShieldIcon size={26} />, title: "Secure payments", text: "UPI, cards and net banking" },
  { icon: <CashIcon size={26} />, title: "Cash on delivery", text: "Pay when your order arrives" },
  { icon: <BoxIcon size={26} />, title: "Home delivery", text: "Delivered to your door" },
  { icon: <GiftIcon size={26} />, title: "Promo packs", text: "Extra rolls free in value packs" },
];

export default function HomePage() {
  const promo = queryProducts({ types: ["promo"] }).slice(0, 4);
  return (
    <main>
      <section className="hero">
        <div className="container">
          <div>
            <div className="eyebrow">Tissue &amp; hygiene, delivered</div>
            <h1>Softness for every home.</h1>
            <p>Toilet rolls, kitchen towels, tissues, wipes and napkins, delivered to your door.</p>
            <div className="hero-cta">
              <Link className="btn btn-accent btn-lg" href="/shop">
                Shop all products
              </Link>
              <Link
                className="btn btn-lg"
                style={{ background: "rgba(255,255,255,.14)", color: "#fff", borderColor: "rgba(255,255,255,.5)" }}
                href="/shop?tag=promo"
              >
                See promo packs
              </Link>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <Image src={productImage("tp-12")} alt="" width={384} height={232} loading="eager" fetchPriority="high" />
            <Image src={productImage("kt-4")} alt="" width={250} height={256} loading="eager" />
            <Image src={productImage("ft-boutique-48")} alt="" width={690} height={605} loading="eager" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>Shop by category</h2>
          </div>
          <div className="cats">
            {getCategories().map((c) => (
              <Link className="cat" href={`/shop/${c.id}`} key={c.id}>
                <div className="cat-img">
                  <Image src={productImage(c.image)} alt="" fill sizes="180px" />
                </div>
                <b>{c.name}</b>
                <span>{c.blurb}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head">
            <div>
              <h2>Popular packs</h2>
              <p>Everyday essentials for the home</p>
            </div>
            <Link className="btn btn-ghost btn-sm" href="/shop">
              View all
            </Link>
          </div>
          <ProductGrid products={getProductsByIds(POPULAR)} />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="band band-yellow">
            <div>
              <div className="eyebrow" style={{ color: "#7A5200" }}>
                Promo packs
              </div>
              <h2>Extra rolls, same price</h2>
              <p>Value packs with free rolls inside: 7+2, 14+4, 32+8 toilet rolls and 3+1 kitchen towels.</p>
              <Link className="btn btn-dark" href="/shop?tag=promo">
                See promo packs
              </Link>
            </div>
            <div className="band-art" aria-hidden="true">
              <Image src={productImage("tp-7-2")} alt="" width={256} height={229} />
              <Image src={productImage("tp-32-8")} alt="" width={400} height={361} />
              <Image src={productImage("kt-3-1")} alt="" width={346} height={355} />
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head">
            <h2>Free-roll promo packs</h2>
            <Link className="btn btn-ghost btn-sm" href="/shop?tag=promo">
              View all
            </Link>
          </div>
          <ProductGrid products={promo} />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head">
            <div>
              <h2>New: Comfort and Deluxe</h2>
              <p>Latest additions to the range</p>
            </div>
            <Link className="btn btn-ghost btn-sm" href="/shop">
              View all
            </Link>
          </div>
          <ProductGrid products={getProductsByIds(NEW_RANGE)} />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="trust">
            {TRUST.map((t) => (
              <div key={t.title}>
                {t.icon}
                <p>
                  <b>{t.title}</b>
                  <span>{t.text}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
