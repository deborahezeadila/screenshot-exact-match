import { createFileRoute } from "@tanstack/react-router";
import { PageHero, ContactCta } from "@/components/site/blocks";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  head: () => seo("Privacy Policy", "How this website handles enquiries and subscriber data. Draft pending legal review."),
  component: () => (
    <>
      <PageHero eyebrow="Privacy Policy" title="Privacy Policy" intro="How this website handles enquiries and subscriber data. Draft pending legal review." />
      <ContactCta />
    </>
  ),
});
