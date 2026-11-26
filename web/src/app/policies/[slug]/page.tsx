import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getPolicy, POLICIES } from "@/lib/policies";

type Props = PageProps<"/policies/[slug]">;

export function generateStaticParams() {
  return POLICIES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const policy = getPolicy((await params).slug);
  return policy ? { title: policy.title, alternates: { canonical: `/policies/${policy.slug}` } } : {};
}

/* `params` ko <Suspense> ke andar padhte hain (dekho product/[slug]/page.tsx ka note). */
export default function PolicyPage({ params }: Props) {
  return (
    <main className="container">
      <Suspense
        fallback={
          <p className="muted" style={{ padding: "40px 0" }} aria-busy="true">
            Loading…
          </p>
        }
      >
        <PolicyContent params={params} />
      </Suspense>
    </main>
  );
}

async function PolicyContent({ params }: Pick<Props, "params">) {
  const policy = getPolicy((await params).slug);
  if (!policy) notFound();
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: policy.title }]} />
      <article className="prose">
        <h1 style={{ fontSize: "clamp(24px,3vw,32px)" }}>{policy.title}</h1>
        {policy.sections.map((s) => (
          <section key={s.heading}>
            <h2>{s.heading}</h2>
            {s.body.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </section>
        ))}
      </article>
    </>
  );
}
