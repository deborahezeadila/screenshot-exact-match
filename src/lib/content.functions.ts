import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createPublicClient } from "./public-db";

export type Service = {
  id: string;
  slug: string;
  category: string;
  title: string;
  summary: string;
  hero_headline: string | null;
  problem: string | null;
  included: string[];
  deliverables: string[];
  approach: string | null;
  keywords: string[];
  pricing_type: string;
  starting_price: number | null;
  pricing_note: string | null;
  video_url: string | null;
};

export const getServices = createServerFn({ method: "GET" })
  .inputValidator(z.object({ category: z.enum(["shopify", "other"]) }))
  .handler(async ({ data }) => {
    const db = createPublicClient();
    const { data: rows, error } = await db
      .from("services")
      .select("*")
      .eq("category", data.category)
      .eq("status", "published")
      .order("sort_order");
    if (error) throw new Error("Could not load services");
    return rows as Service[];
  });

export const getService = createServerFn({ method: "GET" })
  .inputValidator(z.object({ slug: z.string().max(120) }))
  .handler(async ({ data }) => {
    const db = createPublicClient();
    const { data: row } = await db
      .from("services")
      .select("*")
      .eq("slug", data.slug)
      .eq("status", "published")
      .maybeSingle();
    if (!row) return null;
    const { data: related } = await db
      .from("services")
      .select("slug,title,summary,category")
      .eq("category", row.category)
      .eq("status", "published")
      .neq("slug", row.slug)
      .order("sort_order")
      .limit(3);
    const { data: projects } = await db
      .from("projects")
      .select("slug,title,summary,cover_url,project_type")
      .eq("status", "published")
      .contains("services", [row.slug])
      .limit(3);
    return { service: row as Service, related: related ?? [], projects: projects ?? [] };
  });

export const getProcess = createServerFn({ method: "GET" }).handler(async () => {
  const { data } = await createPublicClient().from("process_steps").select("*").order("sort_order");
  return data ?? [];
});

export const getFaqs = createServerFn({ method: "GET" }).handler(async () => {
  const { data } = await createPublicClient()
    .from("faqs")
    .select("*")
    .eq("published", true)
    .order("sort_order");
  return data ?? [];
});

export const getProjects = createServerFn({ method: "GET" })
  .inputValidator(z.object({ featuredOnly: z.boolean().optional() }))
  .handler(async ({ data }) => {
    let q = createPublicClient().from("projects").select("*").eq("status", "published");
    if (data.featuredOnly) q = q.eq("featured", true).limit(3);
    const { data: rows } = await q.order("sort_order");
    return rows ?? [];
  });

export const getProject = createServerFn({ method: "GET" })
  .inputValidator(z.object({ slug: z.string().max(120) }))
  .handler(async ({ data }) => {
    const { data: row } = await createPublicClient()
      .from("projects")
      .select("*")
      .eq("slug", data.slug)
      .eq("status", "published")
      .maybeSingle();
    return row ?? null;
  });

export const getTestimonials = createServerFn({ method: "GET" }).handler(async () => {
  const { data } = await createPublicClient()
    .from("testimonials")
    .select("id,author,company,quote")
    .eq("published", true)
    .order("created_at", { ascending: false });
  return data ?? [];
});

export const getSettings = createServerFn({ method: "GET" }).handler(async () => {
  const { data } = await createPublicClient().from("site_settings").select("key,value");
  const map: Record<string, string> = {};
  for (const r of data ?? []) map[r.key] = r.value;
  return map;
});

export type BlogPost = { title: string; link: string; date: string | null; excerpt: string; image: string | null };

function pick(xml: string, tag: string) {
  const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  if (!m) return "";
  return (m[1] ?? "").replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "").trim();
}
function strip(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/&[a-z#0-9]+;/gi, " ").replace(/\s+/g, " ").trim();
}

/** Reads the publication's public RSS feed (Substack exposes /feed publicly). */
export const getSubstackPosts = createServerFn({ method: "GET" }).handler(async () => {
  const { data } = await createPublicClient()
    .from("site_settings")
    .select("value")
    .eq("key", "substack_url")
    .maybeSingle();
  const base = (data?.value ?? "").trim().replace(/\/$/, "");
  if (!base || !/^https:\/\//.test(base)) return { configured: false, url: "", posts: [] as BlogPost[] };
  try {
    const res = await fetch(`${base}/feed`, { headers: { accept: "application/rss+xml" } });
    if (!res.ok) return { configured: true, url: base, posts: [] as BlogPost[] };
    const xml = await res.text();
    const items = xml.split("<item>").slice(1, 13);
    const posts: BlogPost[] = items.map((it) => {
      const img = it.match(/<enclosure[^>]*url="([^"]+)"/);
      const d = pick(it, "pubDate");
      return {
        title: strip(pick(it, "title")),
        link: pick(it, "link"),
        date: d ? new Date(d).toISOString() : null,
        excerpt: strip(pick(it, "description")).slice(0, 180),
        image: img?.[1] ?? null,
      };
    });
    return { configured: true, url: base, posts };
  } catch {
    return { configured: true, url: base, posts: [] as BlogPost[] };
  }
});

export const getWorkSamples = createServerFn({ method: "GET" })
  .inputValidator(z.object({ categorySlug: z.string().max(80) }))
  .handler(async ({ data }) => {
    const { getCategory, selectSamples } = await import("./work-categories");
    const cat = getCategory(data.categorySlug);
    if (!cat) return { found: false, samples: [] };
    const db = createPublicClient();
    const { data: svc } = await db
      .from("services")
      .select("slug")
      .eq("category", cat.serviceCategory)
      .eq("status", "published");
    const slugs = (svc ?? []).map((s) => s.slug);
    if (!slugs.length) return { found: true, samples: [] };
    const { data: projects } = await db
      .from("projects")
      .select("id,slug,title,summary,cover_url,project_type,services")
      .eq("status", "published")
      .overlaps("services", slugs)
      .order("sort_order");
    return { found: true, samples: selectSamples(slugs, projects ?? []) };
  });
