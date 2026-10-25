import { createFileRoute } from "@tanstack/react-router";
import { PageHero, ContactCta } from "@/components/site/blocks";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/process")({
  head: () => seo("My Process", "How Deborah works with clients, from first conversation to delivery."),
  component: () => (
    <>
      <PageHero eyebrow="My Process" title="A clear, structured way of working." intro="How Deborah works with clients, from first conversation to delivery." />
      <ContactCta />
    </>
  ),
});
