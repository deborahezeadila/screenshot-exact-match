import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, useQuery } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StoreMockup } from "@/components/site/StoreMockup";
import { BlogCards, ContactCta, FaqList, NewsletterForm, ProcessList, ProjectCard, SectionHeading, ShowcaseServiceCard } from "@/components/site/blocks";
import { useContact } from "@/components/site/contact-context";
import { blogQuery, faqsQuery, processQuery, projectsQuery, servicesQuery, testimonialsQuery } from "@/lib/queries";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => seo("Shopify Store Design & Optimisation", "I help businesses build, improve, and optimize Shopify stores for a better shopping experience and stronger conversion potential."),
  loader: ({ context: { queryClient: q } }) =>
    Promise.all([
      q.ensureQueryData(servicesQuery("shopify")),
      q.ensureQueryData(processQuery),
      q.ensureQueryData(faqsQuery),
      q.ensureQueryData(projectsQuery(true)),
      q.ensureQueryData(testimonialsQuery),
    ]),
  component: Home,
});

const WHY = [
  ["Customer-focused store design", "Every decision starts with how your shoppers browse, compare and buy."],
  ["Clear communication", "You always know what's happening, what's next and why."],
  ["Practical problem-solving", "Focused fixes for the issues that actually hold your store back."],
  ["Mobile-first thinking", "Most shoppers are on their phones, so that's where the work begins."],
  ["Structured project process", "Agreed scope, clear deliverables and review points along the way."],
  ["Improvements based on evidence", "Recommendations grounded in what your store's data and behaviour show."],
];

function Home() {
  const { open } = useContact();
  const { data: services } = useSuspenseQuery(servicesQuery("shopify"));
  const { data: steps } = useSuspenseQuery(processQuery);
  const { data: faqs } = useSuspenseQuery(faqsQuery);
  const { data: featured } = useSuspenseQuery(projectsQuery(true));
  const { data: testimonials } = useSuspenseQuery(testimonialsQuery);
  const { data: blog } = useQuery(blogQuery);

  return (
    <div className="bg-ink text-petal">
      {/* 1. Hero */}
      <section className="relative overflow-hidden bg-hero">
        <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-blush/20 blur-3xl" />
        <div className="container-site relative grid items-center gap-14 py-16 md:py-28 lg:grid-cols-[1fr_1.1fr]">
          <div className="fade-up">
            <p className="eyebrow !text-blush">Shopify Specialist</p>
            <h1 className="mt-4 text-[2.6rem] text-petal sm:text-6xl lg:text-[4.3rem]">
              Your Shopify store should do more than <em className="text-blush">look good.</em>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-petal/75">
              I help businesses build, improve, and optimize Shopify stores for a better shopping experience and stronger conversion potential.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="cta" size="lg" onClick={open}>Let's Work Together</Button>
              <Button asChild variant="outline" size="lg" className="border-petal/40 bg-transparent text-petal hover:bg-petal/10 hover:text-petal"><Link to="/portfolio">View My Work</Link></Button>
            </div>
          </div>
          <div className="fade-up [animation-delay:150ms]"><StoreMockup /></div>
        </div>
      </section>

      {/* 2. Services */}
      <section className="container-site py-16 md:py-24">
        <SectionHeading light eyebrow="Shopify Services" title="Everything your store needs, in one place." intro="Ten focused service areas covering the full life of a Shopify store, from first build to ongoing growth." />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((s, i) => <div key={s.id} className="reveal"><ShowcaseServiceCard s={s} index={i} /></div>)}
        </div>
      </section>

      {/* 3. Why */}
      <section className="bg-dark border-y border-petal/10">
        <div className="container-site grid gap-12 py-16 md:py-24 lg:grid-cols-[1fr_1.4fr]">
          <SectionHeading light eyebrow="Why work with me?" title="Thoughtful work that keeps your customers in mind." />
          <ul className="grid gap-5 sm:grid-cols-2">
            {WHY.map(([t, d]) => (
              <li key={t} className="reveal flex gap-4 rounded-2xl border border-petal/10 bg-petal/[0.03] p-5">
                <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blush text-oxblood"><Check className="h-4 w-4" /></span>
                <div><h3 className="text-lg text-petal">{t}</h3><p className="mt-1.5 text-sm leading-relaxed text-petal/65">{d}</p></div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. Process */}
      {steps.length > 0 && (
        <section className="bg-oxblood">
          <div className="container-site py-16 md:py-24">
            <SectionHeading light eyebrow="My Process" title="A clear path from first chat to delivery." />
            <div className="reveal mt-12"><ProcessList steps={steps} /></div>
          </div>
        </section>
      )}

      {/* 5. Portfolio */}
      <section className="container-site py-16 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading light eyebrow="Portfolio" title="Featured work" />
          <Link to="/portfolio" className="font-semibold text-blush hover:underline">View All Projects →</Link>
        </div>
        {featured.length > 0 ? (
          <div className="mt-10 grid gap-10 md:grid-cols-3 [&_h3]:text-petal [&_p]:text-petal/65">{featured.map((p) => <ProjectCard key={p.id} p={p} large />)}</div>
        ) : (
          <div className="mt-8 flex flex-col items-start gap-5 rounded-3xl border border-dashed border-blush/40 bg-petal/[0.03] p-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-petal/70">Featured projects and case studies are being prepared and will appear here soon.</p>
            <Button asChild variant="outline" className="shrink-0 border-petal/40 bg-transparent text-petal hover:bg-petal/10 hover:text-petal"><Link to="/shopify-store-design-samples">View design samples</Link></Button>
          </div>
        )}
      </section>

      {/* 6. Testimonials (hidden when none) */}
      {testimonials.length > 0 && (
        <section className="bg-dark">
          <div className="container-site py-16 md:py-24">
            <SectionHeading light eyebrow="Kind words" title="What clients say" />
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {testimonials.slice(0, 3).map((t) => (
                <figure key={t.id} className="reveal rounded-3xl border border-petal/10 bg-ink-soft p-7">
                  <blockquote className="font-display text-xl leading-snug text-petal">“{t.quote}”</blockquote>
                  <figcaption className="mt-5 text-sm font-semibold text-blush">{t.author}{t.company && <span className="font-normal text-petal/60"> — {t.company}</span>}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. Blog (hidden until posts exist) */}
      {blog && blog.posts.length > 0 && (
        <section className="container-site py-16 md:py-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading light eyebrow="From the blog" title="Shopify insights" />
            <Link to="/blog" className="font-semibold text-blush hover:underline">All articles →</Link>
          </div>
          <div className="mt-10"><BlogCards posts={blog.posts.slice(0, 3)} /></div>
        </section>
      )}

      {/* 8. Email updates */}
      <section className="container-site pb-16 md:pb-24">
        <div className="grid gap-8 rounded-3xl border border-petal/10 bg-plum p-8 md:grid-cols-2 md:p-14">
          <div>
            <p className="eyebrow !text-blush">Email Updates</p>
            <h2 className="mt-3 text-3xl text-petal md:text-4xl">Make more of your Shopify store.</h2>
            <p className="mt-3 text-petal/75">Get practical tips on Shopify design, product pages, SEO, and improving the shopping experience.</p>
          </div>
          <NewsletterForm />
        </div>
      </section>

      {/* 9. FAQs */}
      {faqs.length > 0 && (
        <section className="container-site grid gap-10 pb-8 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <SectionHeading light eyebrow="FAQs" title="Questions, answered." />
            <Link to="/faqs" className="mt-6 inline-block font-semibold text-blush hover:underline">See all FAQs →</Link>
          </div>
          <FaqList faqs={faqs.slice(0, 5)} />
        </section>
      )}

      {/* 10. Final CTA */}
      <ContactCta title="Let's make your Shopify store work harder." />
    </div>
  );
}
