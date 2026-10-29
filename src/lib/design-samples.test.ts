import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { CONCEPT_LABEL, DESIGN_SAMPLES, getDesignSample } from "./design-samples";

describe("design samples", () => {
  it("has exactly four samples with unique, url-safe slugs", () => {
    expect(DESIGN_SAMPLES).toHaveLength(4);
    const slugs = DESIGN_SAMPLES.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(4);
    for (const s of slugs) expect(s).toMatch(/^[a-z0-9-]+$/);
  });

  it("every sample has all five non-empty breakdown fields", () => {
    for (const s of DESIGN_SAMPLES) {
      for (const k of ["navigation", "productPages", "mobile", "customerExperience", "recommendation"] as const) {
        expect(s.breakdown[k].trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("contains no external links in any text", () => {
    const text = JSON.stringify(DESIGN_SAMPLES).toLowerCase();
    expect(text).not.toContain("http");
    expect(text).not.toContain("www.");
    expect(text).not.toContain(".com");
  });

  it("getDesignSample finds known slugs only", () => {
    expect(getDesignSample("skincare-routine-store")?.title).toBe("Skincare Routine Store");
    expect(getDesignSample("does-not-exist")).toBeUndefined();
  });

  it("uses the Concept label in both route files", () => {
    expect(CONCEPT_LABEL).toBe("Concept");
    for (const f of ["shopify-store-design-samples.index.tsx", "shopify-store-design-samples.$slug.tsx"]) {
      const src = readFileSync(resolve(__dirname, "../routes", f), "utf8");
      expect(src).toContain("{CONCEPT_LABEL}");
    }
  });
});
