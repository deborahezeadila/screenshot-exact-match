export type Team = "internship" | "core";
export const DESCRIPTION_MAX = 3000;

export type TeamMemberInput = {
  team: Team;
  full_name: string;
  role: string;
  stars: number | null;
  description: string;
  personal_url: string;
};

export function starsLabel(stars: number): string {
  const n = Math.max(0, Math.min(3, Math.round(stars)));
  return "★".repeat(n) + "☆".repeat(3 - n);
}

/** Empty is allowed; otherwise must be an https:// URL. */
export function isValidPersonalUrl(url: string): boolean {
  const v = url.trim();
  if (!v) return true;
  if (!v.startsWith("https://")) return false;
  try {
    return new URL(v).protocol === "https:";
  } catch {
    return false;
  }
}

export function isValidDescription(text: string): boolean {
  return text.length <= DESCRIPTION_MAX;
}

export function validateMember(m: TeamMemberInput): string[] {
  const errors: string[] = [];
  const name = m.full_name.trim();
  if (!name) errors.push("Full name is required.");
  if (name.length > 120) errors.push("Full name must be 120 characters or fewer.");
  if (m.role.trim().length > 120) errors.push("Role must be 120 characters or fewer.");
  if (!isValidDescription(m.description)) errors.push(`Description must be ${DESCRIPTION_MAX} characters or fewer.`);
  if (!isValidPersonalUrl(m.personal_url)) errors.push("Personal link must start with https://");
  if (m.team === "internship" && (m.stars == null || m.stars < 1 || m.stars > 3))
    errors.push("Choose 1 to 3 stars for internship members.");
  return errors;
}

/** Moving only changes the team; every other field (including stars) is kept. */
export function moveToTeam<T extends { team: Team }>(member: T, team: Team): T {
  return { ...member, team };
}
