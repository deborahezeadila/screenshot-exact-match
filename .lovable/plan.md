# Phase 1 — Service pages, Work Samples and categories (plan only)

Nothing here has been run. You approve each step separately. Steps marked **[APPROVAL: auth/roles]**, **[APPROVAL: storage]** or **[APPROVAL: public visibility]** change those things.

These stay as they are: site design, Portfolio pages (only the way photos are linked changes), the contact form, sign-in, and every current dashboard tab.

## What exists today
- `/shopify-services/$slug` and `/other-services/$slug` show placeholder text only. There is no `/services/$slug` page yet.
- `services` has: title, slug, category (only `shopify` or `other` allowed), summary, hero_headline, problem, included, deliverables, approach, keywords, pricing_type (hidden/starting/quote), starting_price, pricing_note, sort_order, status.
- FAQs and process steps apply to the whole site, not to one service.
- Dashboard saves go from the browser straight to the database. Each save is blocked unless you have the admin role, but there is no separate server check.
- Portfolio photos are saved as 10-year signed links. The private `portfolio` bucket has a 10 MB limit and no file-type limit.
- The first account to sign up became admin automatically (that's you).

---

## Step 1 — Migration A: categories **[APPROVAL: public visibility]**
- New `service_categories` table: id, slug (unique), name, intro, sort_order, published, created_at. Access permissions plus row rules:
  - Visitors read published categories only.
  - Only admins can change them.
- Add the 5 categories: `shopify`, `google-business-profile`, `ai-ugc-videos`, `email-marketing`, `newsletter-design`.
  - Shopify is published.
  - The other 4 are published too, so their empty work-sample pages show the clean message (or drafts, if you prefer).
- Replace the `shopify/other` rule on `services.category` with a link to `service_categories.slug`. Existing `shopify` values already match.
- Effect on data: none. The 10 Shopify services stay unchanged.
- Rollback: remove the link and recreate the old rule (only works if every service is still shopify/other), then drop the table.

## Step 2 — Migration B: extra service fields
New optional columns on `services`, all empty or with a default, so existing rows are untouched:
- intro, pain_points[], who_for, who_not_for, how_i_help
- process_mode (`site` / `custom` / `hidden`), custom_process (pairs of title + text)
- faq_ids[] (picks from existing FAQs) and custom_faqs (question + answer pairs)
- cta_title, cta_text
- seo_title, meta_description, featured (default off)

Price rule:
- **Quote-based is the default.** Starting price only applies when a price is entered.
- A database rule blocks saving `status='published'` with `pricing_type='starting'` and no price.
- That rule is added "not valid" first, so existing rows aren't rejected. The current 10 are all `hidden`/quote.

Rollback: drop the new columns and the rule.

## Step 3 — Migration C: Work Samples **[APPROVAL: public visibility]**
- `work_samples` table with these columns:
  - id, slug, title, summary, body
  - sample_type (`concept` / `demonstration` / `client_project`)
  - client_name (optional)
  - results (optional) plus `results_verified` (true/false). Results show to visitors only when marked verified.
  - cover_path, media_paths[] (images in the private bucket), external_url (optional)
  - featured, sort_order, status (draft/published), created_at
- `work_sample_links` table: sample_id plus either service_id or category_id (exactly one).
  - One sample can link to many services and categories. The media is stored once and never copied.
- Row rules:
  - Visitors read published samples only, and links only when their sample is published.
  - Only admins can change samples or links.
- Effect on data: new tables only. No samples are created.
- Rollback: drop both tables.

## Step 4 — Migration D: Portfolio photo paths
- Add `projects.cover_path` and `projects.gallery_paths[]`. Fill them by taking the file path out of the existing signed links.
- Mark the old link columns as no longer used. They are kept, not deleted.
- Rollback: drop the new columns. The old links keep working until 2036.

## Step 5 — Server-side admin checks
- New `src/lib/admin.functions.ts`: server functions that confirm you're signed in and have the admin role, then save. Covered:
  - services, categories, samples and links, projects (including project order)
  - FAQs, testimonials, process steps, social and contact settings
  - duplicate and delete
  - an upload link for photos
- The row rules stay as a second layer of protection.
- `src/start.ts`: make sure the sign-in token is sent with these saves.
- No change to sign-in itself or to roles.

## Step 6 — Public reading and signed photo links
- `src/lib/content.functions.ts` and `src/lib/queries.ts`:
  - New: `getServiceFull(slug)`, `getCategories`, `getServicesByCategory`, `getWorkSamples(categorySlug?)`, `getWorkSample(slug)`.
  - `getService` and `getServices` keep working as before.
- Photos: the server creates 1-hour signed links, only for published projects and samples. It falls back to the old saved link while any rows still need it.
  - The service key is used only inside the server and never sent to the browser.
- Admin preview: `getServicePreview` checks for the admin role, then returns a draft. Visitors calling it get "not found".

## Step 7 — Service detail page (A)
- New `src/routes/services.$slug.tsx`. Sections, in order:
  - headline and introduction
  - problem and pain points
  - who it's for / who it may not suit
  - how I help, what's included, deliverables
  - process
  - pricing (quote-based unless a price is entered)
  - FAQs
  - linked work samples
  - final call to action, which opens the existing contact form
- Empty sections are hidden.
- Unpublished or missing services show the "not found" page.
- `?preview=1` shows a draft only to a signed-in admin, with a "Draft preview" banner and a no-index tag.
- Page title and description come from the SEO fields (or fall back to title and summary), with a canonical link to `/services/$slug`.
- `shopify-services.$slug.tsx` and `other-services.$slug.tsx` become permanent redirects to `/services/$slug`.
- `blocks.tsx`: service cards link to `/services/$slug`.

## Step 8 — Work Samples pages (C)
- `src/routes/work-samples.index.tsx` lists published categories.
- `src/routes/work-samples.$category.tsx` shows samples linked to that category or to any of its services.
  - With none, it shows "No work samples published here yet."
  - An unknown or unpublished category shows "not found".
- `src/routes/work-samples.$category.$slug.tsx` (optional sample detail page) shows a type badge (Concept / Demonstration / Client project). Results appear only when verified.

## Step 9 — Navigation (E)
- `SiteHeader.tsx` and `SiteFooter.tsx`: remove only "Other Services". Optionally add "Work Samples" (your call).
- `/other-services` stays and lists published services outside Shopify. Its links point to `/services/$slug`.
- The 4 new categories still get `/services/{slug}` pages for their services and `/work-samples/{category}` pages. Neither depends on the menu link.

## Step 10 — Dashboard (B, C, D) in `src/routes/_authenticated/admin.tsx`
- **Services tab:**
  - every field from Step 2, plus category, slug, keywords, featured, display order (arrows + Save order) and status
  - search, filter (category, status), Duplicate (copies as a draft with a `-copy` slug), Delete (confirm box), Preview
  - "Save draft" and "Publish" are separate buttons. Saving never changes the status.
  - Publish is blocked with a message when "starting price" has no price.
- **Categories tab:** add, rename, reorder, publish/unpublish. Deleting is blocked while services are linked to the category.
- **Work Samples tab:**
  - fields from Step 3, photo upload, linking to several services and categories
  - search, filter, duplicate, delete with confirmation, preview, separate draft/publish buttons
- **Portfolio tab:** unchanged, except photos now save as storage paths. Search and filter added.
- FAQs, testimonials, process steps and Contact & social tabs stay. They switch to the server-checked saves.

## Step 11 — Storage file-type limit **[APPROVAL: storage]**
- Limit the `portfolio` bucket to image/jpeg, image/png, image/webp, image/gif. This uses the bucket settings tool, not a migration.
- Effect:
  - Applies only to new uploads. No existing file is removed or changed.
  - Published pages only read files, so they can't break.
  - Uploading another file type (e.g. a PDF or video) will be refused, with a clear message in the dashboard.
- Rollback: remove the type limit.

## Step 12 — Optional: stop "first account becomes admin" **[APPROVAL: auth/roles]**
- Drop the trigger `on_auth_user_created_admin` and the function `grant_first_admin()`. Your admin role stays.
- This is separate from everything else. It is safe to skip or do later.
- Rollback: recreate both from `0001_first_user_admin.sql`.

---

## Later phase (not Phase 1): video hosting
Options to compare later. Costs are not confirmed and need checking:
- a private storage bucket for video, possibly needing a higher project file limit
- YouTube or Vimeo embeds (free or paid plans)
- a dedicated video service such as Mux or Cloudflare Stream (usage-based)

Until then, a sample can use an external link.

## Tests (I)
**Automated (I will run):**
- price rule: published + starting with no price is refused; quote is allowed
- redirect targets for both old URL patterns
- storage path pulled from signed links
- category and service reorder helpers
- "Save draft never publishes"
- the existing gallery order, project order and search tests

**Browser checks while signed in as you (I will run):**
- create, edit, duplicate, delete and preview a service, a category and a sample, using temporary items deleted afterwards
- visitors get "not found" for a draft; it appears after publishing
- old URLs redirect
- "Other Services" is gone from the header and footer, and `/other-services` still works
- Portfolio and sample photos display
- the empty work-sample message shows
- mobile and desktop layouts
- signed out: every admin save is refused, and no draft rows or photos come back

**Database:** security scan and check of the row rules after each migration.

**What I can't run:**
- a signed-in non-admin test (needs a second account you create)
- checks on the live site after publishing
- how real social-preview cards look
- how long signed links take to expire in practice

**For you to check manually:**
- all wording on the 4 new services
- whether results shown as verified are true
- the live site after publishing
- uploading from your own phone

## What gets affected
- **Tables:**
  - changed: `services` (new columns, category rule), `projects` (new photo-path columns)
  - new: `service_categories`, `work_samples`, `work_sample_links`
  - unchanged: FAQs, steps, testimonials, settings, enquiries, subscribers
- **Pages:**
  - the two `$slug` pages become redirects
  - the index pages and Portfolio pages stay
  - new `/services/$slug` and `/work-samples/*`
- **Components:** `SiteHeader`, `SiteFooter`, `blocks.tsx` (card links), the dashboard.

## What I need from you
1. Should the 4 new categories start published (empty-message pages show) or as drafts?
2. Do you want a "Work Samples" link added to the header?
3. Should I do Step 12 now, later, or never?
4. The text for the 4 new services, or should they be created as empty drafts for you to fill in?
5. No new secrets are needed. I'd only check that the built-in server key exists, by name.
