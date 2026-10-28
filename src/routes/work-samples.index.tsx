
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { PageHero, ContactCta } from "@/components/site/blocks";
import { READY_WORK_CATEGORIES } from "@/lib/work-categories";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/work-samples/")({
  head: () => seo("Work Samples", "Work samples by Deborah Ezeadila, grouped by service category."),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHero eyebrow="Work Samples" title="Work Samples" intro="Browse samples of my work by service category." />
      <section className="container-site grid gap-6 py-12 sm:grid-cols-2 lg:grid-cols-3 md:py-16">
        {READY_WORK_CATEGORIES.map((c) => (
          <Link key={c.slug} to="/work-samples/$category" params={{ category: c.slug }}
            className="group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:border-berry/40">
            <h2 className="text-xl text-oxblood">{c.name}</h2>
            <p className="mt-2 flex-1 text-sm text-muted-foreground">{c.description}</p>
            <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-berry">View samples <ArrowUpRight className="h-4 w-4" /></span>
          </Link>
        ))}
      </section>
      <ContactCta />
    </>
  );
}
