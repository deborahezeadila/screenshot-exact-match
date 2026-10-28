import { describe, expect, it } from "vitest";
import { getCategory, selectSamples, serviceRedirectTarget, WORK_CATEGORIES } from "./work-categories";

describe("work categories", () => {
  it("has exactly the five categories", () => {
    expect(WORK_CATEGORIES.map((c) => c.slug)).toEqual([
      "shopify", "google-business-profile", "ai-ugc-videos", "email-marketing", "newsletter-design",
    ]);
  });
  it("finds a known slug", () => {
    expect(getCategory("email-marketing")?.name).toBe("Email Marketing");
  });
  it("returns undefined for unknown slug", () => {
    expect(getCategory("nope")).toBeUndefined();
  });
});

describe("old service URLs", () => {
  it("redirect to /services/$slug with the same slug", () => {
    expect(serviceRedirectTarget("shopify-seo")).toEqual({ to: "/services/$slug", params: { slug: "shopify-seo" } });
  });
});

describe("samples", () => {
  const projects = [{ slug: "a", services: ["x"] }, { slug: "b", services: ["y"] }];
  it("no linked services gives an empty list", () => {
    expect(selectSamples([], projects)).toEqual([]);
  });
  it("no matching projects gives an empty list", () => {
    expect(selectSamples(["z"], projects)).toEqual([]);
  });
  it("returns only linked projects", () => {
    expect(selectSamples(["y"], projects).map((p) => p.slug)).toEqual(["b"]);
  });
});
