import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, useQuery } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StoreMockup } from "@/components/site/StoreMockup";
import { BlogCards, ContactCta, FaqList, NewsletterForm, ProcessList, ProjectCard, SectionHeading, ServiceCard } from "@/components/site/blocks";
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
    <>
      {/* 1. Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-blush/50 blur-3xl" />
        <div className="container-site relative grid items-center gap-14 py-14 md:py-24 lg:grid-cols-[1.05fr_1fr]">
          <div className="fade-up">
            <p className="eyebrow">Shopify Specialist</p>
            <h1 className="mt-4 text-[2.6rem] text-oxblood sm:text-6xl lg:text-[4.3rem]">
              Your Shopify store should do more than <em className="text-berry">look good.</em>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              I help businesses build, improve, and optimize Shopify stores for a better shopping experience and stronger conversion potential.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="cta" size="lg" onClick={open}>Let's Work Together</Button>
              <Button asChild variant="outline" size="lg"><Link to="/portfolio">View My Work</Link></Button>
            </div>
          </div>
          <div className="fade-up pb-10 [animation-delay:150ms]"><StoreMockup /></div>
        </div>
      </section>

      {/* 2. Services */}
      <section className="container-site py-16 md:py-24">
        <SectionHeading eyebrow="Shopify Services" title="Everything your store needs, in one place." intro="Ten focused service areas covering the full life of a Shopify store, from first build to ongoing growth." />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {services.map((s, i) => <ServiceCard key={s.id} s={s} index={i} />)}
        </div>
      </section>

      {/* 3. Why */}
      <section className="bg-secondary/60">
        <div className="container-site grid gap-12 py-16 md:py-24 lg:grid-cols-[1fr_1.4fr]">
          <SectionHeading eyebrow="Why work with me?" title="Thoughtful work that keeps your customers in mind." />
          <ul className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
            {WHY.map(([t, d]) => (
              <li key={t} className="flex gap-4">
                <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-oxblood text-petal"><Check className="h-4 w-4" /></span>
                <div><h3 className="text-lg text-oxblood">{t}</h3><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{d}</p></div>
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
            <div className="mt-10"><ProcessList steps={steps} /></div>
          </div>
        </section>
      )}

      {/* 5. Portfolio */}
      <section className="container-site py-16 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Portfolio" title="Featured work" />
          <Link to="/portfolio" className="font-semibold text-berry hover:underline">View All Projects →</Link>
        </div>
        {featured.length > 0 ? (
          <div className="mt-10 grid gap-10 md:grid-cols-3">{featured.map((p) => <ProjectCard key={p.id} p={p} large />)}</div>
        ) : (
          <p className="mt-8 rounded-2xl border border-dashed border-blush bg-card p-8 text-muted-foreground">Featured projects and case studies are being prepared and will appear here soon.</p>
        )}
      </section>

      {/* 6. Testimonials (hidden when none) */}
      {testimonials.length > 0 && (
        <section className="bg-secondary/60">
          <div className="container-site py-16 md:py-24">
            <SectionHeading eyebrow="Kind words" title="What clients say" />
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {testimonials.slice(0, 3).map((t) => (
                <figure key={t.id} className="rounded-2xl bg-card p-7 shadow-card">
                  <blockquote className="font-display text-xl leading-snug text-oxblood">“{t.quote}”</blockquote>
                  <figcaption className="mt-5 text-sm font-semibold text-plum">{t.author}{t.company && <span className="font-normal text-muted-foreground"> — {t.company}</span>}</figcaption>
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
            <SectionHeading eyebrow="From the blog" title="Shopify insights" />
            <Link to="/blog" className="font-semibold text-berry hover:underline">All articles →</Link>
          </div>
          <div className="mt-10"><BlogCards posts={blog.posts.slice(0, 3)} /></div>
        </section>
      )}

      {/* 8. Email updates */}
      <section className="container-site pb-16 md:pb-24">
        <div className="grid gap-8 rounded-3xl bg-plum p-8 md:grid-cols-2 md:p-14">
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
            <SectionHeading eyebrow="FAQs" title="Questions, answered." />
            <Link to="/faqs" className="mt-6 inline-block font-semibold text-berry hover:underline">See all FAQs →</Link>
          </div>
          <FaqList faqs={faqs.slice(0, 5)} />
        </section>
      )}

      {/* 10. Final CTA */}
      <ContactCta title="Let's make your Shopify store work harder." />
    </>
  );
}
