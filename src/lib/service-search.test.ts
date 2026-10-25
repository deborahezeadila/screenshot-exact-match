import { describe, expect, it } from "vitest";
import { matchServices } from "./service-search";

const services = [
  { title: "Shopify Speed Optimization & Bug Fixes", summary: "Performance", keywords: ["speed"], included: [] },
  { title: "Product Page & Conversion Optimization", summary: "Product page improvements", keywords: ["product page"], included: [] },
  { title: "Shopify SEO & Organic Growth", summary: "On-page SEO", keywords: ["seo"], included: [] },
];

describe("service search", () => {
  it("'speed' finds Speed Optimization", () => {
    expect(matchServices(services, "speed").map((s) => s.title)).toEqual(["Shopify Speed Optimization & Bug Fixes"]);
  });
  it("'product page' finds Product Page & Conversion", () => {
    expect(matchServices(services, "product page").map((s) => s.title)).toEqual(["Product Page & Conversion Optimization"]);
  });
  it("'SEO' finds Shopify SEO", () => {
    expect(matchServices(services, "SEO").map((s) => s.title)).toEqual(["Shopify SEO & Organic Growth"]);
  });
  it("returns nothing for unmatched queries", () => {
    expect(matchServices(services, "zebra")).toEqual([]);
  });
});
