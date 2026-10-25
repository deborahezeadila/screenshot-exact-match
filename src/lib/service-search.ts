type Searchable = { title: string; summary: string; keywords: string[]; included: string[] };

/** Every word in the query must appear in the service's title, summary, keywords or inclusions. */
export function matchServices<T extends Searchable>(services: T[], query: string): T[] {
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!words.length) return services;
  return services.filter((s) => {
    const hay = [s.title, s.summary, ...s.keywords, ...s.included].join(" ").toLowerCase();
    return words.every((w) => hay.includes(w));
  });
}
