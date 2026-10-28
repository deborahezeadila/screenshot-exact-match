
export type WorkCategory = {
  slug: string;
  name: string;
  description: string;
  /** Value of services.category this category maps to. */
  serviceCategory: string;
  /** Only ready categories appear publicly. Set to true when the category is complete. */
  ready: boolean;
};

export const WORK_CATEGORIES: readonly WorkCategory[] = [
  { slug: "shopify", name: "Shopify", description: "Shopify store design, optimisation and setup work.", serviceCategory: "shopify", ready: true },
  { slug: "google-business-profile", name: "Google Business Profile", description: "Google Business Profile setup and optimisation work.", serviceCategory: "google-business-profile", ready: false },
  { slug: "ai-ugc-videos", name: "AI UGC Videos", description: "AI-assisted user-generated-style video work.", serviceCategory: "ai-ugc-videos", ready: false },
  { slug: "email-marketing", name: "Email Marketing", description: "Email campaigns, flows and marketing work.", serviceCategory: "email-marketing", ready: false },
  { slug: "newsletter-design", name: "Newsletter Design", description: "Newsletter layout and design work.", serviceCategory: "newsletter-design", ready: false },
];

/** Any known category, including hidden ones. Used internally. */
export function getCategory(slug: string): WorkCategory | undefined {
  return WORK_CATEGORIES.find((c) => c.slug === slug);
}

/** Only categories marked ready. Hidden categories return undefined, so their pages are not public. */
export function getReadyCategory(slug: string): WorkCategory | undefined {
  const c = getCategory(slug);
  return c && c.ready ? c : undefined;
}

/** Categories shown on the public Work Samples index. */
export const READY_WORK_CATEGORIES: readonly WorkCategory[] = WORK_CATEGORIES.filter((c) => c.ready);

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
