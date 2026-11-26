import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getPolicy, POLICIES } from "@/lib/policies";

export function generateStaticParams() {
  return POLICIES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/policies/[slug]">): Promise<Metadata> {
  const policy = getPolicy((await params).slug);
  return policy ? { title: policy.title, alternates: { canonical: `/policies/${policy.slug}` } } : {};
}

export default async function PolicyPage({ params }: PageProps<"/policies/[slug]">) {
  const policy = getPolicy((await params).slug);
  if (!policy) notFound();
  return (
    <main className="container">
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
    </main>
  );
}
