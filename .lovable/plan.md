# Service pages, categories and Work Samples — plan

Nothing in this plan has been run. Design, Portfolio pages, contact form, sign-in and the existing dashboard tabs stay as they are unless a step says otherwise.

## What I found
- `/shopify-services/$slug` and `/other-services/$slug` only show placeholder text. There is no `/services/$slug` page yet.
- Service cards (`blocks.tsx`) link to the two category detail URLs above, depending on category.
- `services.category` only allows `shopify` or `other` (database check rule). Pricing types: `hidden`, `starting`, `quote`.
- FAQs and process steps are site-wide. They are not linked to individual services.
- `projects.services` holds service slugs as text. Work samples would be a new, separate thing.
- Dashboard saves go straight from the browser to the database. Each save is blocked unless the signed-in user has the admin role (row rules use `has_role`). There is no extra check on the server.
- Photos are saved as 10-year signed links in `cover_url` and `gallery`. The `portfolio` storage bucket is private.
- The first account to sign up automatically becomes admin. Your account is already admin.

## Order of work

### Step 1 — Database changes (written out, nothing applied until you approve)
**Migration A: categories**
- New table `service_categories`: id, slug (unique), name, sort_order, published, created_at. Grants, row rules: the public can read published rows, admins can do anything.
- Add the 5 starting categories, all published: `shopify` (Shopify), `google-business-profile`, `ai-ugc-videos`, `email-marketing`, `newsletter-design`.
- Add `services.category_id` (nullable). Fill it in for the existing 10 services from `category='shopify'`.
- Replace the `category in ('shopify','other')` rule with a link to `service_categories.slug`, so the existing text column keeps working.
- Add `services.faq_ids uuid[]` and `services.show_process boolean default true`. Both optional.
- Database rule: a service can't be published as "starting price" without a price.
- Rollback: drop the new columns, the table and the price rule, then restore the old category check. This only works if every service is still `shopify`/`other`.

**Migration B: Work Samples**
- `work_samples`: id, slug, title, summary, media_path, media_type (image/video), external_url, status (draft/published), sort_order, created_at.
- `work_sample_links`: sample_id, service_id (nullable), category_id (nullable). Each link needs exactly one of the two. This lets one sample appear under several services or categories without copying the media.
- Grants and row rules. The public can read a sample only when it is published, and a link only when its sample is published. Only admins can write.
- Rollback: drop both tables.

**Migration C: photo storage paths**
- Add `projects.cover_path text` and `projects.gallery_paths text[]`. Fill them by taking the file path out of the existing signed links.
- Mark `cover_url`/`gallery` as no longer used. They stay in place and aren't deleted.
- Rollback: drop the two new columns. The old links still work until 2036.

**Migration D: remove first-account-admin rule**
- Drop the `on_auth_user_created_admin` trigger and the `grant_first_admin()` function. Your existing admin role isn't touched.
- Rollback: recreate both from `0001_first_user_admin.sql`.
- Note: you asked me not to change sign-in or roles in this planning step. This migration changes them, so it only runs once you approve the plan.

### Step 2 — Server-side admin checks
- New `src/lib/admin.functions.ts`. Server functions protected by sign-in that first confirm `has_role(admin)`, then save: services, categories, samples, sample links, projects, project order, FAQs, testimonials, steps, settings, duplicate, plus a signed upload link for photos.
- Update `src/start.ts` to send the sign-in token if it doesn't already.
- Row rules stay in place as a second layer.

### Step 3 — Public reading (`src/lib/content.functions.ts`, `queries.ts`)
- `getService` returns the service with its category, chosen FAQs, process steps (when shown), and published samples linked to the service or its category.
- New: `getCategories`, `getWorkSamples(categorySlug)`, and `getServicesByCategory(slug)`, which replaces the shopify/other filter. The old function stays as a wrapper.
- Photos: the server reads the stored paths and creates 1-hour signed links for published items only. It falls back to `cover_url` while old rows exist. The service role key is used only inside the server handler and never reaches the browser.

### Step 4 — Pages
- New `src/routes/services.$slug.tsx`: the full detail page with headline, summary, problem, included items, deliverables, approach, price, FAQs, process, work samples and a call to action. Empty sections are hidden. Has its own page title and description, and a canonical link. Shows a "not found" page for missing or unpublished services.
- `shopify-services.$slug.tsx` and `other-services.$slug.tsx` become permanent redirects to `/services/$slug`.
- `shopify-services.index.tsx` and `other-services.index.tsx` stay as listing pages. Other Services lists every published category except Shopify.
- New `src/routes/work-samples.$category.tsx`, plus `work-samples.index.tsx` listing the categories. Shows "No work samples published yet." when there are none. No samples are invented.
- `blocks.tsx`: service cards link to `/services/$slug`.
- `portfolio.index.tsx` and `portfolio.$slug.tsx`: use the server-signed photo links. Layout unchanged.

### Step 5 — Navigation
- Remove the "Other Services" link only from `SiteHeader.tsx` (NAV) and `SiteFooter.tsx`. Every other link stays.

### Step 6 — Dashboard (`src/routes/_authenticated/admin.tsx`)
- New tabs for Categories (add, rename, reorder with arrows and Save order, publish/unpublish) and Work Samples (upload, link to services or categories).
- Services tab: pick a category, pick FAQs, show process on/off, search and filter by category and status, Duplicate (copies as a draft with a `-copy` slug), and Preview.
- Preview opens `/services/$slug?preview=1`. It only shows a draft when the server confirms you are admin.
- Publishing is blocked with a message when "starting price" is chosen and no price is entered. The database rule blocks it too.
- Portfolio tab: search and filter. Photos save storage paths. Existing reorder and Save order keep working.
- All saves go through the Step 2 server functions.

### Step 7 — Tests and checks
- Automated tests to add or extend:
  - a price-publish rule test
  - redirect targets
  - storage path pulled from a signed link
  - category reorder helper
  - existing order and search tests
- Signed-in browser checks:
  - creating, editing, duplicating and previewing a draft
  - a draft stays hidden from visitors (returns not found)
  - publishing shows it
  - old URLs redirect
  - "Other Services" is gone from the header and footer, and its page still loads
  - Portfolio and sample images display
  - mobile and desktop layouts
- Access checks with a signed-out visitor and a signed-in non-admin: every admin save is refused, and draft rows and draft photos can't be read.
- Security scan after the migrations.
- What I can't run:
  - checks on the live site after publishing
  - real social-preview crawlers
  - how long signed links take to expire in practice
  - a non-admin test account: I'd need you to create one, since signups stop becoming admin after Migration D

## What gets affected
- Tables: `services` (new columns, category rule), `projects` (new path columns), new `service_categories`, `work_samples`, `work_sample_links`. The sign-up trigger is dropped. FAQs, steps, testimonials, settings, enquiries and subscribers are unchanged.
- Pages: the two `$slug` pages become redirects. The index pages and Portfolio pages stay (Portfolio only changes how photos load). New `/services/$slug` and `/work-samples/*`.
- Components: `SiteHeader`, `SiteFooter`, `blocks.tsx` (card link), and the dashboard.

## What I need from you
1. Confirm the 4 new categories should start **published**. That means visitors would see them empty until you add services. Alternatively they can start as drafts.
2. Confirm I can drop the first-account-admin rule now. After that, new accounts never get admin access automatically.
3. Should the Shopify category also have its own `/work-samples/shopify` page? I'm assuming yes.
4. No new secrets are needed. The server uses the existing built-in service key, which I would only check exists by name.
