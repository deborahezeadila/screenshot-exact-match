import { createFileRoute } from "@tanstack/react-router";
import { PageHero, ContactCta } from "@/components/site/blocks";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/blog")({
  head: () => seo("Blog", "Practical Shopify articles from Deborah Ezeadila, published on Substack."),
  component: () => (
    <>
      <PageHero eyebrow="Blog" title="Shopify insights." intro="Practical Shopify articles from Deborah Ezeadila, published on Substack." />
      <ContactCta />
    </>
  ),
});
