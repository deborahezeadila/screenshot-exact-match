import { createFileRoute } from "@tanstack/react-router";
import { PageHero, ContactCta } from "@/components/site/blocks";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () => seo("About Me", "Deborah Ezeadila is a Shopify Specialist with three years of Shopify experience, helping businesses improve their stores."),
  component: () => (
    <>
      <PageHero eyebrow="About Me" title="Hi, I'm Deborah." intro="Deborah Ezeadila is a Shopify Specialist with three years of Shopify experience, helping businesses improve their stores." />
      <ContactCta />
    </>
  ),
});
