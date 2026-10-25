import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

/** Read-only publishable client for public content (RLS applies). Create inside handlers. */
export function createPublicClient() {
  const url = (process.env['SUPABASE_URL'] ?? import.meta.env['VITE_SUPABASE_URL']) as string;
  const key = (process.env['SUPABASE_PUBLISHABLE_KEY'] ??
    import.meta.env['VITE_SUPABASE_PUBLISHABLE_KEY']) as string;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}
