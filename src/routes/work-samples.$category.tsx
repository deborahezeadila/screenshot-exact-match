
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PageHero, ContactCta, ProjectCard, EmptyState } from "@/components/site/blocks";
import { getReadyCategory } from "@/lib/work-categories";
import { workSamplesQuery } from "@/lib/queries";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/work-samples/$category")({
  loader: async ({ context, params }) => {
    if (!getReadyCategory(params.category)) throw notFound();
    await context.queryClient.ensureQueryData(workSamplesQuery(params.category));
  },
  head: ({ params }) => {
    const c = getReadyCategory(params.category);
    return c ? seo(`${c.name} Work Samples`, c.description) : seo("Work Samples", "This category isn't available.");
  },
  errorComponent: () => <p role="alert" className="container-site py-16">Samples could not be loaded. Please try again.</p>,
  notFoundComponent: Unavailable,
  component: Page,
});

function Unavailable() {
  return (
    <PageHero eyebrow="Work Samples" title="This category isn't available">
      <Link to="/work-samples" className="mt-6 inline-block font-semibold text-berry hover:underline">← Back to Work Samples</Link>
    </PageHero>
  );
}

function Page() {
  const { category } = Route.useParams();
  const cat = getReadyCategory(category);
  const { data } = useSuspenseQuery(workSamplesQuery(category));
  if (!cat) return <Unavailable />;
  return (
    <>
      <PageHero eyebrow="Work Samples" title={cat.name} intro={cat.description} />
      <section className="container-site py-12 md:py-16">
        {data.samples.length ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {data.samples.map((p) => <ProjectCard key={p.id} p={p} />)}
          </div>
        ) : (
          <EmptyState title="Coming soon" text="Work samples for this category will be added soon." />
        )}
      </section>
      <ContactCta />
    </>
  );
}
