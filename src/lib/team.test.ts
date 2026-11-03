import { describe, it, expect } from "vitest";
import { starsLabel, isValidPersonalUrl, isValidDescription, moveToTeam } from "./team";

describe("team helpers", () => {
  it("stars label", () => {
    expect(starsLabel(1)).toBe("★☆☆");
    expect(starsLabel(2)).toBe("★★☆");
    expect(starsLabel(3)).toBe("★★★");
  });
  it("personal url validation", () => {
    expect(isValidPersonalUrl("https://example.com/me")).toBe(true);
    expect(isValidPersonalUrl("")).toBe(true);
    expect(isValidPersonalUrl("http://example.com")).toBe(false);
    expect(isValidPersonalUrl("javascript:alert(1)")).toBe(false);
  });
  it("description limit", () => {
    expect(isValidDescription("a".repeat(3000))).toBe(true);
    expect(isValidDescription("a".repeat(3001))).toBe(false);
  });
  it("moving keeps stars", () => {
    const m = { id: "1", team: "internship" as const, stars: 2, full_name: "A" };
    const moved = moveToTeam(m, "core");
    expect(moved.team).toBe("core");
    expect(moved.stars).toBe(2);
    expect(moveToTeam(moved, "internship").stars).toBe(2);
  });
});
