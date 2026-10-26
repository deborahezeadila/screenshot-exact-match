import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SOCIAL_KEYS } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin dashboard — Deborah Ezeadila" },
      { name: "description", content: "Manage website content." },
      { property: "og:title", content: "Admin dashboard — Deborah Ezeadila" },
      { property: "og:description", content: "Manage website content." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type FieldType = "text" | "textarea" | "list" | "number" | "bool" | "select" | "image" | "images";

const TEN_YEARS = 60 * 60 * 24 * 365 * 10;
async function uploadPhoto(file: File): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("portfolio").upload(path, file, { contentType: file.type });
  if (error) throw error;
  const { data, error: e2 } = await supabase.storage.from("portfolio").createSignedUrl(path, TEN_YEARS);
  if (e2 || !data) throw e2 ?? new Error("Upload failed");
  return data.signedUrl;
}

function PhotoField({ id, multiple, value, onChange }: { id: string; multiple: boolean; value: string[]; onChange: (v: string[]) => void }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  async function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!files.length) return;
    setBusy(true); setErr("");
    try {
      const urls = await Promise.all(files.map(uploadPhoto));
      onChange(multiple ? [...value, ...urls] : urls.slice(0, 1));
    } catch (x) {
      setErr(x instanceof Error ? x.message : "Upload failed");
    } finally { setBusy(false); }
  }
  return (
    <div className="space-y-2">
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((u, i) => (
            <div key={u + i} className="relative">
              <img src={u} alt="" className="h-24 w-24 rounded-md border border-border object-cover" />
              <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))}
                className="absolute -right-2 -top-2 rounded-full bg-destructive px-2 text-xs text-destructive-foreground" aria-label="Remove photo">×</button>
            </div>
          ))}
        </div>
      )}
      <Input id={id} type="file" accept="image/*" multiple={multiple} onChange={pick} disabled={busy} />
      {busy && <p className="text-xs text-muted-foreground">Uploading…</p>}
      {err && <p className="text-xs text-destructive">{err}</p>}
    </div>
  );
}
type Field = { key: string; label: string; type: FieldType; options?: string[] };
type TableName = "services" | "faqs" | "projects" | "testimonials" | "process_steps";
type Section = { table: TableName; label: string; titleKey: string; fields: Field[]; defaults: Record<string, unknown> };

const SECTIONS: Section[] = [
  {
    table: "services", label: "Services", titleKey: "title",
    defaults: { category: "shopify", status: "draft", pricing_type: "hidden", sort_order: 0 },
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "slug", label: "Web address (e.g. store-setup)", type: "text" },
      { key: "category", label: "Category", type: "select", options: ["shopify", "other"] },
      { key: "status", label: "Status", type: "select", options: ["draft", "published"] },
      { key: "summary", label: "Short summary", type: "textarea" },
      { key: "hero_headline", label: "Page headline", type: "text" },
      { key: "problem", label: "Problem it solves", type: "textarea" },
      { key: "included", label: "What's included (one per line)", type: "list" },
      { key: "deliverables", label: "Deliverables (one per line)", type: "list" },
      { key: "approach", label: "Approach", type: "textarea" },
      { key: "keywords", label: "Search keywords (one per line)", type: "list" },
      { key: "pricing_type", label: "Pricing display", type: "select", options: ["hidden", "starting", "quote"] },
      { key: "starting_price", label: "Starting price (USD)", type: "number" },
      { key: "pricing_note", label: "Pricing note", type: "text" },
      { key: "video_url", label: "Video link", type: "text" },
      { key: "sort_order", label: "Order", type: "number" },
    ],
  },
  {
    table: "projects", label: "Portfolio", titleKey: "title",
    defaults: { status: "draft", project_type: "concept", sort_order: 0, featured: false },
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "slug", label: "Web address", type: "text" },
      { key: "status", label: "Status", type: "select", options: ["draft", "published"] },
      { key: "project_type", label: "Type", type: "select", options: ["concept", "client", "practice"] },
      { key: "featured", label: "Show on home page", type: "bool" },
      { key: "summary", label: "Summary", type: "textarea" },
      { key: "cover_url", label: "Cover photo", type: "image" },
      { key: "services", label: "Related service web addresses (one per line)", type: "list" },
      { key: "background", label: "Background", type: "textarea" },
      { key: "goal", label: "Goal", type: "textarea" },
      { key: "problem", label: "Problem", type: "textarea" },
      { key: "role", label: "My role", type: "textarea" },
      { key: "process", label: "Process", type: "textarea" },
      { key: "results", label: "Results", type: "textarea" },
      { key: "gallery", label: "Gallery photos", type: "images" },
      { key: "sort_order", label: "Order", type: "number" },
    ],
  },
  {
    table: "faqs", label: "FAQs", titleKey: "question",
    defaults: { published: true, sort_order: 0 },
    fields: [
      { key: "question", label: "Question", type: "text" },
      { key: "answer", label: "Answer", type: "textarea" },
      { key: "published", label: "Visible", type: "bool" },
      { key: "sort_order", label: "Order", type: "number" },
    ],
  },
  {
    table: "testimonials", label: "Testimonials", titleKey: "author",
    defaults: { published: false },
    fields: [
      { key: "author", label: "Name", type: "text" },
      { key: "company", label: "Company", type: "text" },
      { key: "quote", label: "Quote", type: "textarea" },
      { key: "published", label: "Visible", type: "bool" },
    ],
  },
  {
    table: "process_steps", label: "Process", titleKey: "title",
    defaults: { sort_order: 0 },
    fields: [
      { key: "title", label: "Step title", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "sort_order", label: "Order", type: "number" },
    ],
  },
];

function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: isAdmin, isLoading } = useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return false;
      const { data } = await supabase.rpc("has_role", { _user_id: u.user.id, _role: "admin" });
      return !!data;
    },
  });

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (isLoading) return <p className="px-4 py-24 text-center text-muted-foreground">Loading…</p>;
  if (!isAdmin)
    return (
      <section className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="font-display text-3xl">No access</h1>
        <p className="mt-2 text-muted-foreground">This account isn't an admin.</p>
        <Button className="mt-6" onClick={signOut}>Sign out</Button>
      </section>
    );

  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-4xl">Dashboard</h1>
        <Button variant="outline" onClick={signOut}>Sign out</Button>
      </div>
      <Tabs defaultValue="services" className="mt-8">
        <TabsList className="flex h-auto flex-wrap">
          {SECTIONS.map((s) => <TabsTrigger key={s.table} value={s.table}>{s.label}</TabsTrigger>)}
          <TabsTrigger value="settings">Contact & social</TabsTrigger>
        </TabsList>
        {SECTIONS.map((s) => (
          <TabsContent key={s.table} value={s.table}><TableEditor section={s} /></TabsContent>
        ))}
        <TabsContent value="settings"><SettingsEditor /></TabsContent>
      </Tabs>
    </section>
  );
}

type Row = Record<string, unknown> & { id?: string };

function TableEditor({ section }: { section: Section }) {
  const [editing, setEditing] = useState<Row | null>(null);
  const { data: rows = [], refetch } = useQuery({
    queryKey: ["admin", section.table],
    queryFn: async () => {
      const { data, error } = await supabase.from(section.table).select("*").order("created_at");
      if (error) throw error;
      return data as Row[];
    },
  });

  async function remove(id: string) {
    if (!confirm("Delete this item?")) return;
    await supabase.from(section.table).delete().eq("id", id);
    refetch();
  }

  if (editing)
    return <RowForm section={section} row={editing} onDone={() => { setEditing(null); refetch(); }} />;

  return (
    <div className="mt-6 space-y-3">
      <Button onClick={() => setEditing({ ...section.defaults })}>Add new</Button>
      {rows.length === 0 && <p className="text-muted-foreground">Nothing here yet.</p>}
      {rows.map((r) => (
        <div key={r.id} className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-4">
          <div className="min-w-0">
            <p className="truncate font-medium">{String(r[section.titleKey] ?? "")}</p>
            {"status" in r && <p className="text-xs text-muted-foreground">{String(r["status"])}</p>}
            {"published" in r && <p className="text-xs text-muted-foreground">{r["published"] ? "Visible" : "Hidden"}</p>}
          </div>
          <div className="flex shrink-0 gap-2">
            <Button size="sm" variant="outline" onClick={() => setEditing(r)}>Edit</Button>
            <Button size="sm" variant="ghost" onClick={() => remove(r.id!)}>Delete</Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function RowForm({ section, row, onDone }: { section: Section; row: Row; onDone: () => void }) {
  const [vals, setVals] = useState<Row>(row);
  const [err, setErr] = useState("");
  const set = (k: string, v: unknown) => setVals((p) => ({ ...p, [k]: v }));

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const payload: Row = {};
    for (const f of section.fields) payload[f.key] = vals[f.key] ?? (f.type === "list" || f.type === "images" ? [] : f.type === "bool" ? false : null);
    if ("updated_at" in row || section.table === "services") payload["updated_at"] = new Date().toISOString();
    const q = row.id
      ? supabase.from(section.table).update(payload as never).eq("id", row.id)
      : supabase.from(section.table).insert(payload as never);
    const { error } = await q;
    if (error) setErr(error.message.includes("null value") ? "Please fill in all required fields." : error.message);
    else onDone();
  }

  return (
    <form onSubmit={save} className="mt-6 space-y-4 rounded-lg border border-border bg-card p-6">
      {section.fields.map((f) => {
        const v = vals[f.key];
        const id = `f-${f.key}`;
        return (
          <div key={f.key} className="space-y-1.5">
            <Label htmlFor={id}>{f.label}</Label>
            {f.type === "text" && <Input id={id} value={(v as string) ?? ""} onChange={(e) => set(f.key, e.target.value)} />}
            {f.type === "textarea" && <Textarea id={id} rows={4} value={(v as string) ?? ""} onChange={(e) => set(f.key, e.target.value)} />}
            {f.type === "number" && (
              <Input id={id} type="number" value={v == null ? "" : String(v)} onChange={(e) => set(f.key, e.target.value === "" ? null : Number(e.target.value))} />
            )}
            {f.type === "list" && (
              <Textarea id={id} rows={4} value={((v as string[]) ?? []).join("\n")}
                onChange={(e) => set(f.key, e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))} />
            )}
            {f.type === "bool" && <div><Switch id={id} checked={!!v} onCheckedChange={(c) => set(f.key, c)} /></div>}
            {f.type === "image" && (
              <PhotoField id={id} multiple={false} value={v ? [v as string] : []} onChange={(a) => set(f.key, a[0] ?? null)} />
            )}
            {f.type === "images" && (
              <PhotoField id={id} multiple value={(v as string[]) ?? []} onChange={(a) => set(f.key, a)} />
            )}
            {f.type === "select" && (
              <select id={id} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={(v as string) ?? ""} onChange={(e) => set(f.key, e.target.value)}>
                {f.options!.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            )}
          </div>
        );
      })}
      {err && <p className="text-sm text-destructive">{err}</p>}
      <div className="flex gap-2">
        <Button type="submit">Save</Button>
        <Button type="button" variant="outline" onClick={onDone}>Cancel</Button>
      </div>
    </form>
  );
}

const SETTING_KEYS = ["email", "whatsapp", "substack_url", ...SOCIAL_KEYS] as const;

function SettingsEditor() {
  const [vals, setVals] = useState<Record<string, string> | null>(null);
  const [msg, setMsg] = useState("");
  useQuery({
    queryKey: ["admin", "settings"],
    queryFn: async () => {
      const { data } = await supabase.from("site_settings").select("key,value");
      const m: Record<string, string> = {};
      for (const r of data ?? []) m[r.key] = r.value;
      setVals(m);
      return m;
    },
  });
  if (!vals) return null;

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const rows = SETTING_KEYS.map((key) => ({ key, value: (vals![key] ?? "").trim(), updated_at: new Date().toISOString() }));
    const { error } = await supabase.from("site_settings").upsert(rows, { onConflict: "key" });
    setMsg(error ? error.message : "Saved.");
  }

  return (
    <form onSubmit={save} className="mt-6 space-y-4 rounded-lg border border-border bg-card p-6">
      {SETTING_KEYS.map((k) => (
        <div key={k} className="space-y-1.5">
          <Label htmlFor={`s-${k}`} className="capitalize">{k === "substack_url" ? "Substack address" : k}</Label>
          <Input id={`s-${k}`} value={vals[k] ?? ""} onChange={(e) => setVals({ ...vals, [k]: e.target.value })} />
        </div>
      ))}
      {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
      <Button type="submit">Save</Button>
    </form>
  );
}
