import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PageHero, ContactCta, ProjectCard } from "@/components/site/blocks";
import { seo } from "@/lib/seo";
import { projectsQuery } from "@/lib/queries";

export const Route = createFileRoute("/portfolio/")({
  loader: async ({ context }) => { await context.queryClient.ensureQueryData(projectsQuery()); },
  head: () => seo("Portfolio", "Shopify projects and case studies by Deborah Ezeadila. Client work and concept stores are clearly labelled."),
  errorComponent: () => <p role="alert" className="container-site py-16">Projects could not be loaded. Please try again.</p>,
  notFoundComponent: () => <PageHero eyebrow="Portfolio" title="Portfolio not found" />,
  component: PortfolioPage,
});

function PortfolioPage() {
  const { data: projects } = useSuspenseQuery(projectsQuery());
  return (
    <>
      <PageHero eyebrow="Portfolio" title="Selected work." intro="Shopify projects and case studies by Deborah Ezeadila. Client work and concept stores are clearly labelled." />
      {projects.length > 0 && <section className="container-site grid gap-8 py-12 md:grid-cols-2 lg:grid-cols-3" aria-label="Portfolio projects">
        {projects.map(project => <ProjectCard key={project.id} p={project} />)}
      </section>}
      <ContactCta />
    </>
  );
}
