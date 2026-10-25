import { createFileRoute } from "@tanstack/react-router";
import { PageHero, ContactCta } from "@/components/site/blocks";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/faqs")({
  head: () => seo("FAQs", "Answers to common questions about working with Deborah Ezeadila."),
  component: () => (
    <>
      <PageHero eyebrow="FAQs" title="Frequently asked questions." intro="Answers to common questions about working with Deborah Ezeadila." />
      <ContactCta />
    </>
  ),
});
