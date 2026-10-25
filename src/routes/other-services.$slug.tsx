import { createFileRoute } from "@tanstack/react-router";
import { PageHero, ContactCta } from "@/components/site/blocks";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/other-services/$slug")({
  head: () => seo("Service", "Service details from Deborah Ezeadila."),
  component: () => (
    <>
      <PageHero eyebrow="Service" title="Service" intro="Service details from Deborah Ezeadila." />
      <ContactCta />
    </>
  ),
});
