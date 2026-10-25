import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PageHero, ContactCta } from "@/components/site/blocks";
import { ServiceDirectory } from "@/components/site/ServiceDirectory";
import { servicesQuery } from "@/lib/queries";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/shopify-services/")({
  head: () => seo("Shopify Services", "Store design, SEO, speed, conversion optimisation, apps, migrations, audits and more — all 10 Shopify service areas."),
  loader: ({ context }) => context.queryClient.ensureQueryData(servicesQuery("shopify")),
  component: Page,
});

function Page() {
  const { data } = useSuspenseQuery(servicesQuery("shopify"));
  return (
    <>
      <PageHero eyebrow="Shopify Services" title="Find the right help for your store." intro="Search or browse ten service areas, each with its own page explaining what's included." />
      <section className="container-site py-12 md:py-16"><ServiceDirectory services={data} /></section>
      <ContactCta title="Not sure which service fits?" text="Describe your store and what you want to improve. I'll point you in the right direction." />
    </>
  );
}
