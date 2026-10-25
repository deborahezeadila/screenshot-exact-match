import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";

export const SUBSCRIBE_CONSENT =
  "I agree to receive occasional Shopify tips and updates from Deborah Ezeadila by email. I can unsubscribe at any time.";

async function ipHash() {
  const req = getRequest();
  const ip =
    req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`de-site:${ip}`));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const enquirySchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  email: z.string().trim().email("Please enter a valid email address").max(255),
  message: z.string().trim().min(5, "Please write a short message").max(5000),
  wantsUpdates: z.boolean(),
  website: z.string().max(0).optional(), // honeypot
});

async function addSubscriber(email: string, source: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const normalized = email.toLowerCase();
  const { data: existing } = await supabaseAdmin
    .from("subscribers")
    .select("id,status")
    .eq("email", normalized)
    .maybeSingle();
  if (existing?.status === "subscribed") return "already" as const;
  if (existing) {
    await supabaseAdmin
      .from("subscribers")
      .update({ status: "subscribed", consent_text: SUBSCRIBE_CONSENT, consent_at: new Date().toISOString(), unsubscribed_at: null, source })
      .eq("id", existing.id);
    return "ok" as const;
  }
  const { error } = await supabaseAdmin
    .from("subscribers")
    .insert({ email: normalized, consent_text: SUBSCRIBE_CONSENT, source });
  if (error) throw new Error("Could not subscribe right now");
  return "ok" as const;
}

export const submitEnquiry = createServerFn({ method: "POST" })
  .inputValidator(enquirySchema)
  .handler(async ({ data }) => {
    if (data.website) return { ok: true };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const hash = await ipHash();
    const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { count } = await supabaseAdmin
      .from("enquiries")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", hash)
      .gte("created_at", since);
    if ((count ?? 0) >= 3) throw new Error("Too many messages in a short time. Please try again later.");
    const { data: dup } = await supabaseAdmin
      .from("enquiries")
      .select("id")
      .eq("email", data.email.toLowerCase())
      .eq("message", data.message)
      .gte("created_at", since)
      .maybeSingle();
    if (!dup) {
      const { error } = await supabaseAdmin.from("enquiries").insert({
        name: data.name,
        email: data.email.toLowerCase(),
        message: data.message,
        wants_updates: data.wantsUpdates,
        ip_hash: hash,
      });
      if (error) throw new Error("Your message could not be sent. Please try again.");
    }
    if (data.wantsUpdates) await addSubscriber(data.email, "contact_form");
    return { ok: true };
  });

export const subscribeEmail = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      email: z.string().trim().email("Please enter a valid email address").max(255),
      consent: z.literal(true, { message: "Please confirm you agree to receive emails" }),
    }),
  )
  .handler(async ({ data }) => ({ status: await addSubscriber(data.email, "newsletter_form") }));

export const unsubscribeEmail = createServerFn({ method: "POST" })
  .inputValidator(z.object({ token: z.string().uuid() }))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("subscribers")
      .update({ status: "unsubscribed", unsubscribed_at: new Date().toISOString() })
      .eq("unsubscribe_token", data.token)
      .select("id")
      .maybeSingle();
    return { ok: !!row };
  });
