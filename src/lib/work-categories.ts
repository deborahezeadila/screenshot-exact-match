export type WorkCategory = {
  slug: string;
  name: string;
  description: string;
  /** Value of services.category this category maps to. */
  serviceCategory: string;
};

export const WORK_CATEGORIES: readonly WorkCategory[] = [
  { slug: "shopify", name: "Shopify", description: "Shopify store design, optimisation and setup work.", serviceCategory: "shopify" },
  { slug: "google-business-profile", name: "Google Business Profile", description: "Google Business Profile setup and optimisation work.", serviceCategory: "google-business-profile" },
  { slug: "ai-ugc-videos", name: "AI UGC Videos", description: "AI-assisted user-generated-style video work.", serviceCategory: "ai-ugc-videos" },
  { slug: "email-marketing", name: "Email Marketing", description: "Email campaigns, flows and marketing work.", serviceCategory: "email-marketing" },
  { slug: "newsletter-design", name: "Newsletter Design", description: "Newsletter layout and design work.", serviceCategory: "newsletter-design" },
];

export function getCategory(slug: string): WorkCategory | undefined {
  return WORK_CATEGORIES.find((c) => c.slug === slug);
}

/** Target for legacy /shopify-services/$slug and /other-services/$slug URLs. */
export function serviceRedirectTarget(slug: string) {
  return { to: "/services/$slug" as const, params: { slug } };
}

/** Projects linked to any of the given service slugs; empty input → empty list, never placeholders. */
export function selectSamples<P extends { services: string[] }>(serviceSlugs: string[], projects: P[]): P[] {
  if (!serviceSlugs.length) return [];
  const set = new Set(serviceSlugs);
  return projects.filter((p) => p.services.some((s) => set.has(s)));
}
