import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PageHero, ContactCta, EmptyState } from "@/components/site/blocks";
import { ServiceDirectory } from "@/components/site/ServiceDirectory";
import { servicesQuery } from "@/lib/queries";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/other-services/")({
  head: () => seo("Other Services", "Digital services beyond Shopify from Deborah Ezeadila."),
  loader: ({ context }) => context.queryClient.ensureQueryData(servicesQuery("other")),
  component: Page,
});

function Page() {
  const { data } = useSuspenseQuery(servicesQuery("other"));
  return (
    <>
      <PageHero eyebrow="Other Services" title="Beyond Shopify." intro="Additional digital services, published here as they become available." />
      <section className="container-site py-12 md:py-16">
        {data.length ? <ServiceDirectory services={data} /> : (
          <EmptyState title="New services coming soon" text="Additional services are being prepared. If you have a project in mind, feel free to get in touch." />
        )}
      </section>
      <ContactCta />
    </>
  );
}
