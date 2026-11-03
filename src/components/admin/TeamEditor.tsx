import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { signTeamPhotos } from "@/lib/team.functions";
import { DESCRIPTION_MAX, starsLabel, validateMember, moveToTeam, type Team } from "@/lib/team";

type Member = {
  id: string;
  team: Team;
  full_name: string;
  role: string | null;
  stars: number | null;
  photo_path: string | null;
  description: string | null;
  personal_url: string | null;
  sort_order: number;
  published: boolean;
  created_at: string;
};

type Draft = Omit<Member, "id" | "created_at" | "sort_order"> & { id?: string };
const EMPTY: Draft = { team: "internship", full_name: "", role: "", stars: 1, photo_path: null, description: "", personal_url: "", published: false };

export function TeamEditor() {
  const sign = useServerFn(signTeamPhotos);
  const [editing, setEditing] = useState<Draft | null>(null);
  const [err, setErr] = useState("");
  const { data, refetch, error } = useQuery({
    queryKey: ["admin", "team"],
    queryFn: async () => {
      const { data, error } = await supabase.from("team_members").select("*").order("sort_order").order("created_at");
      if (error) throw new Error(error.message);
      const rows = (data ?? []) as Member[];
      const paths = rows.map((r) => r.photo_path).filter((p): p is string => !!p);
      const signed = paths.length ? await sign({ data: { paths } }) : { map: {}, error: null };
      return { rows, photos: signed.map as Record<string, string>, photoError: signed.error };
    },
  });
  const rows = data?.rows ?? [];

  async function run(fn: () => PromiseLike<{ error: { message: string } | null }>) {
    setErr("");
    const { error } = await fn();
    if (error) setErr(error.message);
    await refetch();
  }

  async function move(m: Member, dir: -1 | 1) {
    const list = rows.filter((r) => r.team === m.team);
    const i = list.findIndex((r) => r.id === m.id);
    const j = i + dir;
    if (j < 0 || j >= list.length) return;
    const next = [...list];
    [next[i], next[j]] = [next[j]!, next[i]!];
    setErr("");
    for (const [idx, r] of next.entries()) {
      const { error } = await supabase.from("team_members").update({ sort_order: idx }).eq("id", r.id);
      if (error) { setErr(error.message); break; }
    }
    await refetch();
  }

  async function switchTeam(m: Member) {
    const to: Team = m.team === "internship" ? "core" : "internship";
    const moved = moveToTeam(m, to);
    const last = rows.filter((r) => r.team === to).reduce((a, r) => Math.max(a, r.sort_order), -1);
    await run(() => supabase.from("team_members").update({ team: moved.team, sort_order: last + 1 }).eq("id", m.id));
  }

  async function remove(m: Member) {
    if (!window.confirm("Remove this person from the team? This cannot be undone.")) return;
    await run(() => supabase.from("team_members").delete().eq("id", m.id));
  }

  if (editing)
    return (
      <MemberForm
        draft={editing}
        photoUrl={editing.photo_path ? data?.photos[editing.photo_path] : undefined}
        nextOrder={(t) => rows.filter((r) => r.team === t).reduce((a, r) => Math.max(a, r.sort_order), -1) + 1}
        onDone={async () => { setEditing(null); await refetch(); }}
      />
    );

  return (
    <div className="mt-6 space-y-8">
      <Button onClick={() => setEditing({ ...EMPTY })}>Add team member</Button>
      {error && <p role="alert" className="text-sm text-destructive">{(error as Error).message}</p>}
      {data?.photoError && <p role="alert" className="text-sm text-destructive">Photo previews failed: {data.photoError}</p>}
      {err && <p role="alert" className="text-sm text-destructive">{err}</p>}
      {(["internship", "core"] as Team[]).map((t) => {
        const list = rows.filter((r) => r.team === t);
        return (
          <div key={t}>
            <h2 className="font-display text-2xl">{t === "internship" ? "Internship Team" : "Core Team"}</h2>
            {list.length === 0 && <p className="mt-2 text-sm text-muted-foreground">No members yet.</p>}
            <ul className="mt-3 divide-y rounded-lg border">
              {list.map((m, i) => (
                <li key={m.id} data-testid="team-row" className="flex flex-wrap items-center gap-2 p-3">
                  <span className="flex-1 font-medium">
                    {m.full_name}
                    {t === "internship" && m.stars != null && <span className="ml-2 text-berry">{starsLabel(m.stars)}</span>}
                    <span className="ml-2 text-xs text-muted-foreground">{m.published ? "Published" : "Draft"}</span>
                  </span>
                  <Button size="sm" variant="outline" onClick={() => setEditing({ ...m, role: m.role ?? "", description: m.description ?? "", personal_url: m.personal_url ?? "" })}>Edit</Button>
                  <Button size="sm" variant="outline" onClick={() => switchTeam(m)}>{t === "internship" ? "Move to Core" : "Move to Internship"}</Button>
                  <Button size="sm" variant="outline" disabled={i === 0} onClick={() => move(m, -1)}>Move up</Button>
                  <Button size="sm" variant="outline" disabled={i === list.length - 1} onClick={() => move(m, 1)}>Move down</Button>
                  <Button size="sm" variant="destructive" onClick={() => remove(m)}>Delete</Button>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

function MemberForm({ draft, photoUrl, nextOrder, onDone }: { draft: Draft; photoUrl?: string; nextOrder: (t: Team) => number; onDone: () => void }) {
  const [d, setD] = useState<Draft>(draft);
  const [errors, setErrors] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((p) => ({ ...p, [k]: v }));
  const desc = d.description ?? "";

  async function save() {
    const errs = validateMember({ team: d.team, full_name: d.full_name, role: d.role ?? "", stars: d.stars, description: desc, personal_url: d.personal_url ?? "" });
    if (file && !file.type.startsWith("image/")) errs.push("Photo must be an image file.");
    setErrors(errs);
    if (errs.length) return;
    setBusy(true);
    try {
      let photo_path = d.photo_path;
      if (file) {
        const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
        const path = `team/${crypto.randomUUID()}.${ext}`;
        const { error } = await supabase.storage.from("portfolio").upload(path, file, { contentType: file.type });
        if (error) throw new Error(`Photo upload failed: ${error.message}`);
        photo_path = path;
      }
      const row = {
        team: d.team,
        full_name: d.full_name.trim(),
        role: d.role?.trim() || null,
        stars: d.stars,
        photo_path,
        description: desc || null,
        personal_url: d.personal_url?.trim() || null,
        published: d.published,
      };
      const { error } = d.id
        ? await supabase.from("team_members").update(row).eq("id", d.id)
        : await supabase.from("team_members").insert({ ...row, sort_order: nextOrder(d.team) });
      if (error) throw new Error(error.message);
      onDone();
    } catch (e) {
      setErrors([e instanceof Error ? e.message : String(e)]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-6 space-y-4 rounded-lg border p-6">
      <h2 className="font-display text-2xl">{d.id ? "Edit team member" : "Add team member"}</h2>
      <div className="space-y-1">
        <Label htmlFor="tm-team">Team</Label>
        <select id="tm-team" className="block h-10 w-full rounded-md border bg-background px-3" value={d.team} onChange={(e) => set("team", e.target.value as Team)}>
          <option value="internship">Internship Team</option>
          <option value="core">Core Team</option>
        </select>
      </div>
      <div className="space-y-1">
        <Label htmlFor="tm-name">Full name</Label>
        <Input id="tm-name" maxLength={120} value={d.full_name} onChange={(e) => set("full_name", e.target.value)} />
      </div>
      {d.team === "core" && (
        <div className="space-y-1">
          <Label htmlFor="tm-role">Role</Label>
          <Input id="tm-role" maxLength={120} value={d.role ?? ""} onChange={(e) => set("role", e.target.value)} />
        </div>
      )}
      {d.team === "internship" && (
        <div className="space-y-1">
          <Label htmlFor="tm-stars">Stars</Label>
          <select id="tm-stars" className="block h-10 w-full rounded-md border bg-background px-3" value={d.stars ?? ""} onChange={(e) => set("stars", e.target.value ? Number(e.target.value) : null)}>
            <option value="">Choose…</option>
            {[1, 2, 3].map((n) => <option key={n} value={n}>{starsLabel(n)} Level {n}</option>)}
          </select>
        </div>
      )}
      <div className="space-y-1">
        <Label htmlFor="tm-desc">Description</Label>
        <Textarea id="tm-desc" rows={6} value={desc} onChange={(e) => set("description", e.target.value)} />
        <p className={`text-xs ${desc.length > DESCRIPTION_MAX ? "text-destructive" : "text-muted-foreground"}`}>{desc.length} / {DESCRIPTION_MAX}</p>
      </div>
      <div className="space-y-1">
        <Label htmlFor="tm-url">Personal link (https://)</Label>
        <Input id="tm-url" type="url" value={d.personal_url ?? ""} onChange={(e) => set("personal_url", e.target.value)} placeholder="https://" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="tm-photo">Photo</Label>
        {photoUrl && !file && <img src={photoUrl} alt="Current photo" className="h-32 w-32 rounded-md object-cover" />}
        <Input id="tm-photo" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      </div>
      <div className="flex items-center gap-3">
        <Switch id="tm-pub" checked={d.published} onCheckedChange={(v) => set("published", v)} />
        <Label htmlFor="tm-pub">Published</Label>
      </div>
      {errors.length > 0 && <ul role="alert" className="list-disc pl-5 text-sm text-destructive">{errors.map((e) => <li key={e}>{e}</li>)}</ul>}
      <div className="flex gap-2">
        <Button onClick={save} disabled={busy || desc.length > DESCRIPTION_MAX}>{busy ? "Saving…" : "Save"}</Button>
        <Button variant="outline" onClick={onDone}>Cancel</Button>
      </div>
    </div>
  );
}
