import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createPublicClient } from "./public-db";

export type PublicTeamMember = {
  id: string;
  team: string;
  full_name: string;
  role: string | null;
  stars: number | null;
  description: string | null;
  personal_url: string | null;
  photo_url: string | null;
};

const ONE_HOUR = 60 * 60;

async function signPaths(paths: string[]): Promise<{ map: Record<string, string>; error: string | null }> {
  const map: Record<string, string> = {};
  if (!paths.length) return { map, error: null };
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin.storage.from("portfolio").createSignedUrls(paths, ONE_HOUR);
    if (error) {
      console.error("[team] signing failed:", error.message);
      return { map, error: error.message };
    }
    for (const r of data ?? []) if (r.path && r.signedUrl) map[r.path] = r.signedUrl;
    return { map, error: null };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[team] signing failed:", msg);
    return { map, error: msg };
  }
}

export const getTeamMembers = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await createPublicClient()
    .from("team_members")
    .select("id,team,full_name,role,stars,description,personal_url,photo_path,sort_order,created_at")
    .eq("published", true)
    .order("sort_order")
    .order("created_at");
  if (error) throw new Error("Could not load team members");
  const rows = data ?? [];
  const { map, error: photoError } = await signPaths(rows.map((r) => r.photo_path).filter((p): p is string => !!p));
  const members: PublicTeamMember[] = rows.map((r) => ({
    id: r.id,
    team: r.team,
    full_name: r.full_name,
    role: r.role,
    stars: r.stars,
    description: r.description,
    personal_url: r.personal_url,
    photo_url: r.photo_path ? map[r.photo_path] ?? null : null,
  }));
  return { members, photoError: photoError ? "Photos could not be loaded right now." : null };
});

/** Admin-only: 1-hour signed previews for team photo paths. */
export const signTeamPhotos = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ paths: z.array(z.string().max(300).regex(/^team\//)).max(200) }))
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (!isAdmin) throw new Error("Forbidden");
    return signPaths(data.paths);
  });
