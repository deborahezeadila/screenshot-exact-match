import { createFileRoute } from "@tanstack/react-router";
import { PageHero, ContactCta } from "@/components/site/blocks";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/terms")({
  head: () => seo("Terms of Service", "Terms for using this website. Draft pending legal review."),
  component: () => (
    <>
      <PageHero eyebrow="Terms of Service" title="Terms of Service" intro="Terms for using this website. Draft pending legal review." />
      <ContactCta />
    </>
  ),
});
