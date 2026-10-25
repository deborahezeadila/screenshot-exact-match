import { queryOptions } from "@tanstack/react-query";
import {
  getFaqs,
  getProcess,
  getProject,
  getProjects,
  getService,
  getServices,
  getSettings,
  getSubstackPosts,
  getTestimonials,
} from "./content.functions";

export const settingsQuery = queryOptions({ queryKey: ["settings"], queryFn: () => getSettings(), staleTime: 60_000 });
export const servicesQuery = (category: "shopify" | "other") =>
  queryOptions({ queryKey: ["services", category], queryFn: () => getServices({ data: { category } }) });
export const serviceQuery = (slug: string) =>
  queryOptions({ queryKey: ["service", slug], queryFn: () => getService({ data: { slug } }) });
export const processQuery = queryOptions({ queryKey: ["process"], queryFn: () => getProcess() });
export const faqsQuery = queryOptions({ queryKey: ["faqs"], queryFn: () => getFaqs() });
export const projectsQuery = (featuredOnly = false) =>
  queryOptions({ queryKey: ["projects", featuredOnly], queryFn: () => getProjects({ data: { featuredOnly } }) });
export const projectQuery = (slug: string) =>
  queryOptions({ queryKey: ["project", slug], queryFn: () => getProject({ data: { slug } }) });
export const testimonialsQuery = queryOptions({ queryKey: ["testimonials"], queryFn: () => getTestimonials() });
export const blogQuery = queryOptions({ queryKey: ["blog"], queryFn: () => getSubstackPosts(), staleTime: 5 * 60_000 });

export const SOCIAL_KEYS = ["linkedin", "instagram", "tiktok", "x", "facebook", "youtube", "pinterest"] as const;

export function whatsappLink(raw?: string) {
  const digits = (raw ?? "").replace(/\D/g, "");
  return digits.length >= 8 ? `https://wa.me/${digits}` : null;
}

export function formatPrice(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}
