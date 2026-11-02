import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { REFERENCE_LABEL, DESIGN_SAMPLES, getDesignSample } from "./design-samples";

describe("design samples", () => {
  it("has exactly three samples with unique, url-safe slugs", () => {
    expect(DESIGN_SAMPLES).toHaveLength(3);
    const slugs = DESIGN_SAMPLES.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(3);
    for (const s of slugs) expect(s).toMatch(/^[a-z0-9-]+$/);
  });

  it("every sample has non-empty details and all four observation fields", () => {
    for (const s of DESIGN_SAMPLES) {
      for (const k of ["storeName", "domain", "niche", "designFocus", "summary"] as const) {
        expect(s[k].trim().length).toBeGreaterThan(0);
      }
      for (const k of ["navigation", "productPages", "customerExperience", "takeaway"] as const) {
        expect(s.observations[k].trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("contains no URLs in observation text", () => {
    for (const s of DESIGN_SAMPLES) {
      for (const text of Object.values(s.observations)) {
        expect(text.toLowerCase()).not.toContain("http://");
        expect(text.toLowerCase()).not.toContain("https://");
      }
    }
  });

  it("getDesignSample finds known slugs only", () => {
    expect(getDesignSample("rituaria")).toBe(DESIGN_SAMPLES[0]);
    expect(getDesignSample("store-that-does-not-exist")).toBeUndefined();
    expect(getDesignSample("skincare-routine-store")).toBeUndefined();
  });

  it("identifies references as not client work", () => {
    expect(REFERENCE_LABEL).toBe("Design reference only — not my client work");
  });

  it("does not link to external domains in any design sample route", () => {
    const routes = resolve(__dirname, "../routes");
    const files = readdirSync(routes).filter((f) => f.startsWith("shopify-store-design-samples"));
    expect(files.length).toBeGreaterThan(0);
    for (const f of files) {
      const src = readFileSync(resolve(routes, f), "utf8");
      expect(src).not.toMatch(/(?:href|to)\s*=\s*["']http/i);
      expect(src).not.toMatch(/(?:href|to)\s*=\s*\{\s*["'`]https?:\/\//i);
    }
  });
});
