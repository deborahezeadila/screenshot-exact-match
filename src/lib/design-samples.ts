export const REFERENCE_LABEL = "Design reference only — not my client work" as const;

export type DesignSample = {
  slug: string;
  storeName: string;
  domain: string; // display text only, never a link
  niche: string;
  designFocus: string;
  summary: string;
  observations: { navigation: string; productPages: string; customerExperience: string; takeaway: string };
};

export const DESIGN_SAMPLES: readonly DesignSample[] = [
  {
    slug: "rituaria",
    storeName: "Rituária",
    domain: "rituaria.com.br",
    niche: "Beauty, skincare and wellness supplements",
    designFocus: "Category navigation and promotional messaging",
    summary: "A Brazilian wellness and skincare store that organises its range by health goal and category, with a strong promotional layer on every page.",
    observations: {
      navigation: "The menu is split into supplements, skincare and bundles (rituais), and the categories are organised by health goal, so visitors can start from what they want to achieve.",
      productPages: "On the homepage, product cards show the discount, the regular and promotional price, and a clear buy button. Bundles are presented as complete rituals rather than single items.",
      customerExperience: "Shipping thresholds, cashback and instalment offers appear in a top bar, so the purchase conditions are visible early. The page is dense, with many promotions shown together.",
      takeaway: "Clear goal-based categories and visible purchase conditions are worth studying. A lighter promotional layer would make the offers easier to scan.",
    },
  },
  {
    slug: "sallve",
    storeName: "Sallve",
    domain: "sallve.com.br",
    niche: "Skincare (dermocosmetics)",
    designFocus: "Concern-based navigation and guided routine building",
    summary: "A Brazilian skincare brand whose store helps visitors find products by skin concern and skin type, and offers routine and ingredient guidance.",
    observations: {
      navigation: "The menu offers three routes: product category, skin concern and skin type, so shoppers can start from their problem rather than a product name.",
      productPages: "Product cards show customer ratings, the regular and promotional price, and the instalment price. Bundles are grouped by routine, and an ingredient glossary is linked from the footer.",
      customerExperience: "A guided question area helps visitors choose a routine, and customer reviews appear on the homepage. Contact by WhatsApp and email is listed with opening hours.",
      takeaway: "Routing by skin concern and offering a guided help area are strong patterns to study for a skincare or beauty store.",
    },
  },
  {
    slug: "simple-organic",
    storeName: "Simple Organic",
    domain: "simpleorganic.com.br",
    niche: "Vegan and clean beauty (skincare and makeup)",
    designFocus: "Diagnostic tool, routine bundles and ingredient education",
    summary: "A vegan beauty brand that combines product categories, a skin diagnostic tool and ingredient education on one store.",
    observations: {
      navigation: "The header puts products, bundles (kits e rotinas), a skin diagnostic tool, and the skin-type routes next to each other, so the diagnostic is one click from the homepage.",
      productPages: "Product cards show discounts, instalment prices and labels such as 'lançamento' and 'best-seller'. Ingredients have their own short explanations, linked from the homepage.",
      customerExperience: "Sustainability and clean-formula messages sit alongside purchase information, and a newsletter sign-up appears in the footer with a clear privacy link.",
      takeaway: "A diagnostic tool and ingredient explanations can help a shopper choose with confidence. Keeping labels such as 'best-seller' consistent across products helps scanning.",
    },
  },
] as const;

export function getDesignSample(slug: string): DesignSample | undefined {
  return DESIGN_SAMPLES.find((s) => s.slug === slug);
}
