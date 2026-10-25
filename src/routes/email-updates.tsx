import { createFileRoute } from "@tanstack/react-router";
import { PageHero, ContactCta } from "@/components/site/blocks";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/email-updates")({
  head: () => seo("Email Updates", "Get practical tips on Shopify design, product pages, SEO, and the shopping experience."),
  component: () => (
    <>
      <PageHero eyebrow="Email Updates" title="Make more of your Shopify store." intro="Get practical tips on Shopify design, product pages, SEO, and the shopping experience." />
      <ContactCta />
    </>
  ),
});
