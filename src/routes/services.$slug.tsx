import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

import { Check } from "lucide-react";
import { PageHero, ContactCta } from "@/components/site/blocks";
import { Button } from "@/components/ui/button";
import { useContact } from "@/components/site/contact-context";
import { serviceQuery, processQuery, formatPrice } from "@/lib/queries";
import { videoEmbedUrl } from "@/lib/video-embed";
import { supabase } from "@/integrations/supabase/client";
import type { Service } from "@/lib/content.functions";
import { seo } from "@/lib/seo";

const SITE = "https://deborahezeadila.lovable.app";
type Step = { id: string; title: string; description: string };

export const Route = createFileRoute("/services/$slug")({
 validateSearch: (search: Record<string, unknown>) => ({
  preview: search.preview === "1" || search.preview === 1,
}), 
  loaderDeps: ({ search }) => ({ preview: search.preview }),
  loader: async ({ context, params, deps }) => {
    await context.queryClient.ensureQueryData(processQuery);
    if (deps.preview) return { preview: true as const, service: null };
    const data = await context.queryClient.ensureQueryData(serviceQuery(params.slug));
    if (!data) throw notFound();
    return { preview: false as const, service: data.service };
  },
  head: ({ params, loaderData }) => {
    const s = loaderData?.service;
    const base = s ? seo(s.title, s.summary) : seo(loaderData?.preview ? "Preview" : "Service unavailable", "This service page isn't available.");
    return {
      ...base,
      meta: s ? base.meta : [...base.meta, { name: "robots", content: "noindex" }],
      links: s ? [{ rel: "canonical", href: `${SITE}/services/${params.slug}` }] : [],
    };
  },
  errorComponent: () => <p role="alert" className="container-site py-16">This service could not be loaded. Please try again.</p>,
  notFoundComponent: Unavailable,
  component: ServicePage,
});

function Unavailable() {
  return (
    <>
      <PageHero eyebrow="Service" title="This service page isn't available" intro="It may have moved or isn't published yet.">
        <Link to="/shopify-services" className="mt-6 inline-block font-semibold text-berry hover:underline">Browse Shopify services →</Link>
      </PageHero>
      <ContactCta />
    </>
  );
}

function ServicePage() {
  const { preview } = Route.useLoaderData();
  return preview ? <PreviewPage /> : <PublicPage />;
}

function PublicPage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(serviceQuery(slug));
  const { data: steps } = useSuspenseQuery(processQuery);
  if (!data) return <Unavailable />;
  return <ServiceBody s={data.service} steps={steps} />;
}

/** Loads through the browser client so only a signed-in admin's session can see drafts (RLS). */
function PreviewPage() {
  const { slug } = Route.useParams();
  const { data: steps } = useSuspenseQuery(processQuery);
  const q = useQuery({
    queryKey: ["service-preview", slug],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return null;
      const { data } = await supabase.from("services").select("*").eq("slug", slug).maybeSingle();
      return (data as Service & { status: string } | null) ?? null;
    },
  });
  if (q.isPending) return <p className="container-site py-16 text-muted-foreground">Loading preview…</p>;
  if (!q.data) return <Unavailable />;
  return (
    <>
      {q.data.status !== "published" && (
        <div role="status" className="bg-berry py-2 text-center text-sm font-semibold text-petal">Draft preview — not visible to visitors</div>
      )}
      <ServiceBody s={q.data} steps={steps} />
    </>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-card md:p-8">
      <h2 className="text-2xl text-oxblood md:text-3xl">{title}</h2>
      <div className="mt-4 leading-relaxed text-muted-foreground">{children}</div>
    </div>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((i) => (
        <li key={i} className="flex gap-2"><Check className="mt-1 h-4 w-4 shrink-0 text-berry" /><span>{i}</span></li>
      ))}
    </ul>
  );
}

function ServiceBody({ s, steps }: { s: Service; steps: Step[] }) {
  const { open } = useContact();
  const hasPrice = s.pricing_type === "starting" && typeof s.starting_price === "number";
  const embed = videoEmbedUrl(s.video_url);
  return (
    <>
      <PageHero eyebrow="Service" title={s.title} intro={s.hero_headline || s.title} />
      <section className="container-site grid gap-8 py-12 md:py-16 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="min-w-0 space-y-6">
          {s.summary && <p className="text-lg leading-relaxed text-plum">{s.summary}</p>}
          {s.problem && <Block title="The problem"><p className="whitespace-pre-line">{s.problem}</p></Block>}
          {s.included.length > 0 && <Block title="What's included"><List items={s.included} /></Block>}
          {s.deliverables.length > 0 && <Block title="Deliverables"><List items={s.deliverables} /></Block>}
          {s.approach && <Block title="My approach"><p className="whitespace-pre-line">{s.approach}</p></Block>}
          {embed ? (
            <div className="aspect-video w-full overflow-hidden rounded-2xl border border-border bg-card">
              <iframe src={embed} title={`Video: ${s.title}`} loading="lazy" allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                className="h-full w-full" />
            </div>
          ) : s.video_url ? (
            <a href={s.video_url} target="_blank" rel="noopener noreferrer" className="inline-block font-semibold text-berry hover:underline">Watch the video</a>
          ) : null}
        </div>
        <aside className="min-w-0">
          <div className="rounded-2xl border border-border bg-secondary/60 p-6 lg:sticky lg:top-24">
            <p className="eyebrow">Pricing</p>
            <p className="mt-2 font-display text-2xl text-oxblood">
              {hasPrice ? `Starting from ${formatPrice(s.starting_price as number)}` : "Pricing: quote-based"}
            </p>
            {hasPrice && s.pricing_note && <p className="mt-2 text-sm text-muted-foreground">{s.pricing_note}</p>}
            <Button variant="cta" size="lg" className="mt-5 w-full" onClick={open}>Contact Me</Button>
          </div>
        </aside>
      </section>
      {steps.length > 0 && (
        <section className="container-site pb-4">
          <h2 className="text-3xl text-oxblood md:text-4xl">My process</h2>
          <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((st, i) => (
              <li key={st.id} className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <span className="font-display text-3xl text-blush">{i + 1}</span>
                <h3 className="mt-2 text-xl text-oxblood">{st.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{st.description}</p>
              </li>
            ))}
          </ol>
        </section>
      )}
      <ContactCta />
    </>
  );
}
