import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PageHero, ContactCta } from "@/components/site/blocks";
import { seo } from "@/lib/seo";
import { settingsQuery } from "@/lib/queries";

const DEFAULT_INTRO =
  "Deborah Ezeadila is a Shopify Specialist with three years of Shopify experience, helping businesses improve their stores.";

export const Route = createFileRoute("/about")({
  head: () => seo("About Me", DEFAULT_INTRO),
  loader: ({ context }) => context.queryClient.ensureQueryData(settingsQuery),
  component: AboutPage,
});

function AboutPage() {
  const { data: s } = useSuspenseQuery(settingsQuery);
  const title = s["about_title"]?.trim() || "Hi, I'm Deborah.";
  const intro = s["about_intro"]?.trim() || DEFAULT_INTRO;
  const body = (s["about_body"] ?? "").split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const photo = s["about_photo"]?.trim();
  return (
    <>
      <PageHero eyebrow="About Me" title={title} intro={intro} />
      {(body.length > 0 || photo) && (
        <section className="mx-auto grid max-w-5xl gap-10 px-4 pb-16 md:grid-cols-[1fr_2fr]">
          {photo && <img src={photo} alt="Deborah Ezeadila" className="w-full rounded-lg object-cover" />}
          <div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
            {body.map((p, i) => <p key={i} className="whitespace-pre-line">{p}</p>)}
          </div>
        </section>
      )}
      <ContactCta />
    </>
  );
}
