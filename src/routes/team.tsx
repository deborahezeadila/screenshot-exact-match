import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { PageHero, SectionHeading } from "@/components/site/blocks";
import { getTeamMembers, type PublicTeamMember } from "@/lib/team.functions";
import { starsLabel } from "@/lib/team";

const TITLE = "Team | Deborah Ezeadila, Shopify Specialist";
const DESC = "Meet the people working with Deborah Ezeadila on Shopify and ecommerce projects.";
const teamQuery = queryOptions({ queryKey: ["team"], queryFn: () => getTeamMembers() });

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://deborahezeadila.lovable.app/team" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(teamQuery),
  component: TeamPage,
  errorComponent: () => <p role="alert" className="container-site py-24 text-center">The team page couldn't load. Please try again.</p>,
  notFoundComponent: () => <p className="container-site py-24 text-center">Not found.</p>,
});

function MemberCard({ m, showStars }: { m: PublicTeamMember; showStars: boolean }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card">
      <div className="aspect-[4/5] w-full bg-muted">
        {m.photo_url && <img src={m.photo_url} alt={m.full_name} loading="lazy" className="h-full w-full object-cover" />}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-2xl text-oxblood">{m.full_name}</h3>
        {showStars && m.stars != null && (
          <p className="mt-1 text-berry" aria-label={`Level ${m.stars} of 3`}>
            <span aria-hidden>{starsLabel(m.stars)}</span> <span className="text-sm text-muted-foreground">Level {m.stars}</span>
          </p>
        )}
        {!showStars && m.role && <p className="mt-1 text-sm font-semibold text-berry">{m.role}</p>}
        {m.personal_url && (
          <a href={m.personal_url} target="_blank" rel="noopener noreferrer" className="mt-3 text-sm font-semibold text-berry hover:underline">
            View portfolio
          </a>
        )}
        {m.description && <p className="mt-4 max-w-prose whitespace-pre-line break-words text-sm leading-relaxed text-muted-foreground">{m.description}</p>}
      </div>
    </article>
  );
}

function TeamSection({ title, members, showStars, band }: { title: string; members: PublicTeamMember[]; showStars: boolean; band?: boolean }) {
  return (
    <section className={band ? "border-y border-border bg-secondary/60" : ""}>
      <div className="container-site py-14 md:py-20">
        <SectionHeading eyebrow="Team" title={title} />
        {members.length === 0 ? (
          <p className="mt-6 text-muted-foreground">Team members will be listed here soon.</p>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((m) => <MemberCard key={m.id} m={m} showStars={showStars} />)}
          </div>
        )}
      </div>
    </section>
  );
}

function TeamPage() {
  const { data } = useSuspenseQuery(teamQuery);
  return (
    <>
      <PageHero eyebrow="Team" title="Team" intro={DESC} />
      {data.photoError && <p role="status" className="container-site pt-6 text-sm text-muted-foreground">{data.photoError}</p>}
      <TeamSection title="Internship Team" members={data.members.filter((m) => m.team === "internship")} showStars />
      <TeamSection title="Core Team" members={data.members.filter((m) => m.team === "core")} showStars={false} band />
    </>
  );
}
