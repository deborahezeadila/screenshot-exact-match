export const CONCEPT_LABEL = "Concept" as const;

export type DesignSample = {
  slug: string;
  title: string;
  niche: string;
  focus: string;
  summary: string;
  visual: "skincare" | "fashion" | "home" | "accessories";
  breakdown: { navigation: string; productPages: string; mobile: string; customerExperience: string; recommendation: string };
};

export const DESIGN_SAMPLES: readonly DesignSample[] = [
  {
    slug: "skincare-routine-store",
    title: "Skincare Routine Store",
    niche: "Beauty & Skincare",
    focus: "Product presentation and routine building",
    summary: "A concept store that helps shoppers build a skincare routine by concern, with clear ingredient and usage information on every product.",
    visual: "skincare",
    breakdown: {
      navigation: "Shoppers start from their skin concern (for example dryness, oiliness or dark spots) rather than from product categories, so the menu answers 'What do I need?' before 'What is this called?'.",
      productPages: "Each product page shows what it does, how to use it in a routine and its key ingredients in plain language. Related products appear as the next step in the routine, not as a generic list.",
      mobile: "On phones, the add-to-cart button stays visible while scrolling, and the routine steps are shown as a short vertical sequence that is easy to read with one thumb.",
      customerExperience: "Trust comes from clear usage instructions, visible shipping and returns information, and a short guide that explains which products work together.",
      recommendation: "Organise navigation by customer concern, add a 'build your routine' section to product pages, and keep ingredient information readable without needing to open a separate tab.",
    },
  },
  {
    slug: "fashion-fit-confidence-store",
    title: "Fashion Store with Fit Guidance",
    niche: "Fashion",
    focus: "Size guidance and mobile product galleries",
    summary: "A concept clothing store built around fit confidence, with size guidance and a swipeable product gallery designed for phones.",
    visual: "fashion",
    breakdown: {
      navigation: "Collections are organised by occasion and fit (for example 'everyday', 'work' or 'relaxed fit'), with a visible size guide link on every product card.",
      productPages: "Product pages show the garment on different body types, a clear size chart beside the add-to-bag button, and fabric details written in simple language.",
      mobile: "Product photos swipe full-width, with zoom available on tap. The size selector is a large, thumb-friendly control near the top of the page.",
      customerExperience: "Returns and exchange information appears before checkout, and sizing help is available without leaving the product page.",
      recommendation: "Put the size guide next to the size selector, use consistent photo angles across products, and show delivery and return details before the cart.",
    },
  },
  {
    slug: "home-living-room-shopping",
    title: "Home & Living Room Shopping",
    niche: "Home & Living",
    focus: "Room-based navigation and collection storytelling",
    summary: "A concept homeware store that lets shoppers browse by room, with collection pages that explain how pieces work together.",
    visual: "home",
    breakdown: {
      navigation: "The main menu uses rooms (living room, bedroom, kitchen) so shoppers can imagine a finished space, with collections linked from each room page.",
      productPages: "Product pages include dimensions in both centimetres and inches, care instructions, and two or three photos of the item in a real room setting.",
      mobile: "Room pages use a simple two-column grid on phones, with filters for colour and price that open as a bottom sheet instead of taking over the screen.",
      customerExperience: "Delivery timescales for large items are shown early, and the store explains what to expect when a delivery needs assembly or a signature.",
      recommendation: "Use room-based categories, show dimensions clearly, and place delivery information for larger items near the add-to-cart button.",
    },
  },
  {
    slug: "accessories-gift-finder",
    title: "Accessories Store with Gift Finder",
    niche: "Accessories",
    focus: "Gift discovery and detail-led product photography",
    summary: "A concept accessories store with a gift finder for shoppers who are not sure what to buy, and close-up photography that shows materials clearly.",
    visual: "accessories",
    breakdown: {
      navigation: "A 'Gift finder' link sits in the main menu, asking about the recipient, budget and occasion before showing a short list of suggestions.",
      productPages: "Close-up photos show materials and finishes, and each product lists its size, weight and care in one compact block.",
      mobile: "The gift finder is a three-step flow with one question per screen and large answer buttons, so it works well on a phone.",
      customerExperience: "Gift wrapping options and delivery dates appear on the product page, and checkout clearly shows the estimated delivery date.",
      recommendation: "Add a guided gift finder, show materials with close-up photos, and display the delivery date before the shopper reaches checkout.",
    },
  },
];

export function getDesignSample(slug: string): DesignSample | undefined {
  return DESIGN_SAMPLES.find((s) => s.slug === slug);
}
