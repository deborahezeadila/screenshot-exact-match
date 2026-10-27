import { createFileRoute, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PageHero, ContactCta } from "@/components/site/blocks";
import { seo } from "@/lib/seo";
import { projectQuery } from "@/lib/queries";

export const Route = createFileRoute("/portfolio/$slug")({
  loader: async ({ context, params }) => {
    const project = await context.queryClient.ensureQueryData(projectQuery(params.slug));
    if (!project) throw notFound();
    return project;
  },
  head: ({ loaderData }) => {
    const metadata = seo(loaderData?.title ?? "Project not found", loaderData?.summary ?? "A Shopify project case study by Deborah Ezeadila.");
    const image = loaderData?.cover_url;
    if (image?.startsWith("https://")) {
      metadata.meta.push({ property: "og:image", content: image }, { name: "twitter:image", content: image });
    }
    return metadata;
  },
  errorComponent: () => <p role="alert" className="container-site py-16">This project could not be loaded. Please try again.</p>,
  notFoundComponent: () => <PageHero eyebrow="Portfolio" title="Project not found" />,
  component: ProjectPage,
});

function ProjectPage() {
  const { slug } = Route.useParams();
  const { data: project } = useSuspenseQuery(projectQuery(slug));
  if (!project) return null;
  return (
    <>
      <PageHero eyebrow="Case Study" title={project.title} intro={project.summary} />
      {(project.cover_url || project.gallery.length > 0) && (
        <section className="container-site py-12" aria-label="Project photos">
          {project.cover_url && <img src={project.cover_url} alt={`${project.title} cover`} className="mb-6 h-auto w-full rounded-lg" />}
          <div className="grid items-start gap-6 md:grid-cols-2" aria-label="Project gallery">
            {project.gallery.map((photo, index) => (
              <img key={`${photo}-${index}`} src={photo} alt={`${project.title} — photo ${index + 1}`} loading="lazy" className="h-auto w-full rounded-lg" />
            ))}
          </div>
        </section>
      )}
      <ContactCta />
    </>
  );
}
