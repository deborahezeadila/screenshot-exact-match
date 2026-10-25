import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useContact } from "./contact-context";
import { SUBSCRIBE_CONSENT, subscribeEmail } from "@/lib/forms.functions";
import type { BlogPost } from "@/lib/content.functions";

export function PageHero({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro?: string; children?: ReactNode }) {
  return (
    <section className="border-b border-border bg-secondary/60">
      <div className="container-site fade-up py-14 md:py-20">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl text-4xl text-oxblood md:text-6xl">{title}</h1>
        {intro && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">{intro}</p>}
        {children}
      </div>
    </section>
  );
}

export function SectionHeading({ eyebrow, title, intro, light }: { eyebrow: string; title: string; intro?: string; light?: boolean }) {
  return (
    <div className="max-w-2xl">
      <p className={`eyebrow ${light ? "!text-blush" : ""}`}>{eyebrow}</p>
      <h2 className={`mt-3 text-3xl md:text-5xl ${light ? "text-petal" : "text-oxblood"}`}>{title}</h2>
      {intro && <p className={`mt-4 leading-relaxed ${light ? "text-petal/75" : "text-muted-foreground"}`}>{intro}</p>}
    </div>
  );
}

type ServiceLite = { slug: string; title: string; summary: string; category: string };

export function ServiceCard({ s, index }: { s: ServiceLite; index?: number }) {
  const to = s.category === "other" ? "/other-services/$slug" : "/shopify-services/$slug";
  return (
    <Link to={to} params={{ slug: s.slug }}
      className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-berry/40">
      {index !== undefined && <span className="font-display text-3xl text-blush transition-colors group-hover:text-berry">{String(index + 1).padStart(2, "0")}</span>}
      <h3 className="mt-4 text-xl text-oxblood">{s.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{s.summary}</p>
      <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-berry">
        Explore service <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </Link>
  );
}

export function FaqList({ faqs }: { faqs: { id: string; question: string; answer: string }[] }) {
  if (!faqs.length) return null;
  return (
    <Accordion type="single" collapsible className="divide-y divide-border rounded-2xl border border-border bg-card px-6">
      {faqs.map((f) => (
        <AccordionItem key={f.id} value={f.id} className="border-0">
          <AccordionTrigger className="py-5 text-left font-display text-lg text-oxblood hover:no-underline">{f.question}</AccordionTrigger>
          <AccordionContent className="pb-5 text-[0.95rem] leading-relaxed text-muted-foreground">{f.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export function ProcessList({ steps }: { steps: { id: string; title: string; description: string }[] }) {
  return (
    <ol className="grid gap-4 md:grid-cols-5">
      {steps.map((s, i) => (
        <li key={s.id} className="relative rounded-2xl border border-petal/15 bg-petal/5 p-6">
          <span className="font-display text-4xl text-blush">{i + 1}</span>
          <h3 className="mt-3 text-xl text-petal">{s.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-petal/70">{s.description}</p>
        </li>
      ))}
    </ol>
  );
}

export function ContactCta({ title = "Ready to talk about your Shopify store?", text = "Share what you're working on and I'll get back to you with the next steps." }: { title?: string; text?: string }) {
  const { open } = useContact();
  return (
    <section className="container-site py-16 md:py-24">
      <div className="relative overflow-hidden rounded-3xl bg-oxblood px-6 py-14 text-center md:px-16">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-berry/40 blur-3xl" />
        <h2 className="relative mx-auto max-w-2xl text-3xl text-petal md:text-5xl">{title}</h2>
        <p className="relative mx-auto mt-4 max-w-xl text-petal/75">{text}</p>
        <div className="relative mt-8 flex flex-wrap justify-center gap-3">
          <Button variant="light" size="lg" onClick={open}>Contact Me</Button>
        </div>
      </div>
    </section>
  );
}

export function NewsletterForm({ compact }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "ok" | "already" | "error">("idle");
  const [msg, setMsg] = useState("");
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) { setState("error"); setMsg("Please enter a valid email address."); return; }
    if (!consent) { setState("error"); setMsg("Please tick the box to confirm you'd like to receive emails."); return; }
    setState("sending");
    try {
      const r = await subscribeEmail({ data: { email, consent: true } });
      setState(r.status);
    } catch {
      setState("error"); setMsg("Something went wrong. Please try again.");
    }
  }
  if (state === "ok" || state === "already")
    return <p role="status" className="rounded-xl bg-petal/10 p-4 text-petal">{state === "ok" ? "You're subscribed — thank you! Look out for practical Shopify tips in your inbox." : "You're already subscribed. Thank you!"}</p>;
  return (
    <form onSubmit={submit} noValidate className={compact ? "space-y-3" : "space-y-4"}>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Label htmlFor="nl-email" className="sr-only">Email address</Label>
        <Input id="nl-email" type="email" placeholder="you@yourstore.com" value={email} onChange={(e) => setEmail(e.target.value)}
          className="h-12 rounded-full border-petal/30 bg-petal text-plum" />
        <Button type="submit" variant="cta" size="lg" disabled={state === "sending"}>
          {state === "sending" && <Loader2 className="animate-spin" />} Subscribe
        </Button>
      </div>
      <div className="flex items-start gap-3">
        <Checkbox id="nl-consent" checked={consent} onCheckedChange={(v) => setConsent(v === true)} className="mt-0.5 border-petal/60 data-[state=checked]:bg-petal data-[state=checked]:text-oxblood" />
        <Label htmlFor="nl-consent" className="text-sm font-normal leading-snug text-petal/75">{SUBSCRIBE_CONSENT}</Label>
      </div>
      {state === "error" && <p role="alert" className="text-sm text-blush">{msg}</p>}
    </form>
  );
}

export function BlogCards({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {posts.map((p) => (
        <article key={p.link} className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          {p.image && <img src={p.image} alt="" loading="lazy" className="aspect-[16/9] w-full object-cover" />}
          <div className="flex flex-1 flex-col p-6">
            {p.date && <time className="text-xs font-semibold uppercase tracking-widest text-berry">{new Date(p.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</time>}
            <h3 className="mt-2 text-xl text-oxblood">{p.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{p.excerpt}</p>
            <a href={p.link} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-berry hover:underline">
              Read Article <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}

type ProjectLite = { slug: string; title: string; summary: string; cover_url: string | null; project_type: string; services?: string[] };
export const PROJECT_TYPE_LABEL: Record<string, string> = { client: "Client work", concept: "Concept store", practice: "Practice project" };

export function ProjectCard({ p, large }: { p: ProjectLite; large?: boolean }) {
  return (
    <Link to="/portfolio/$slug" params={{ slug: p.slug }} className="group block">
      <div className={`overflow-hidden rounded-2xl bg-blush ${large ? "aspect-[4/3]" : "aspect-[16/11]"}`}>
        {p.cover_url && <img src={p.cover_url} alt={`Screenshot of ${p.title}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />}
      </div>
      <span className="mt-4 inline-block rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-oxblood">{PROJECT_TYPE_LABEL[p.project_type] ?? p.project_type}</span>
      <h3 className="mt-2 text-2xl text-oxblood group-hover:text-berry">{p.title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{p.summary}</p>
    </Link>
  );
}

export function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-blush bg-card p-10 text-center">
      <h3 className="text-2xl text-oxblood">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-muted-foreground">{text}</p>
    </div>
  );
}
