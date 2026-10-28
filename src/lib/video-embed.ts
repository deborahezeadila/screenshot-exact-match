const YT_HOSTS = new Set(["youtube.com", "www.youtube.com", "youtu.be"]);
const VIMEO_HOSTS = new Set(["vimeo.com", "www.vimeo.com"]);
const YT_ID = /^[A-Za-z0-9_-]{11}$/;

/** Safe embed URL for allowed YouTube/Vimeo https links; null otherwise. */
export function videoEmbedUrl(url: string | null): string | null {
  if (!url) return null;
  let u: URL;
  try { u = new URL(url.trim()); } catch { return null; }
  if (u.protocol !== "https:") return null;
  const host = u.hostname.toLowerCase();
  const parts = u.pathname.split("/").filter(Boolean);
  if (YT_HOSTS.has(host)) {
    let id: string | null = null;
    if (host === "youtu.be") id = parts[0] ?? null;
    else if (parts[0] === "watch") id = u.searchParams.get("v");
    else if ((parts[0] === "embed" || parts[0] === "shorts") && parts[1]) id = parts[1];
    return id && YT_ID.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  }
  if (VIMEO_HOSTS.has(host)) {
    const id = parts[0];
    return id && /^\d+$/.test(id) ? `https://player.vimeo.com/video/${id}` : null;
  }
  return null;
}
