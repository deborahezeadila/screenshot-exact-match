create type public.app_role as enum ('admin');
create table public.user_roles (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, role public.app_role not null, unique(user_id, role));
grant select on public.user_roles to authenticated; grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create or replace function public.has_role(_user_id uuid, _role public.app_role) returns boolean language sql stable security definer set search_path = public as $$ select exists (select 1 from public.user_roles where user_id=_user_id and role=_role) $$;
create policy "own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());

create table public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category text not null default 'shopify' check (category in ('shopify','other')),
  title text not null,
  summary text not null,
  hero_headline text,
  problem text,
  included text[] not null default '{}',
  deliverables text[] not null default '{}',
  approach text,
  keywords text[] not null default '{}',
  pricing_type text not null default 'hidden' check (pricing_type in ('hidden','starting','quote')),
  starting_price numeric,
  pricing_note text,
  video_url text,
  sort_order int not null default 0,
  status text not null default 'draft' check (status in ('draft','published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.services to anon, authenticated; grant insert, update, delete on public.services to authenticated; grant all on public.services to service_role;
alter table public.services enable row level security;
create policy "public read published services" on public.services for select to anon, authenticated using (status='published' or public.has_role(auth.uid(),'admin'));
create policy "admin manage services" on public.services for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.faqs (id uuid primary key default gen_random_uuid(), question text not null, answer text not null, sort_order int not null default 0, published boolean not null default true, created_at timestamptz not null default now());
grant select on public.faqs to anon, authenticated; grant insert, update, delete on public.faqs to authenticated; grant all on public.faqs to service_role;
alter table public.faqs enable row level security;
create policy "read faqs" on public.faqs for select to anon, authenticated using (published or public.has_role(auth.uid(),'admin'));
create policy "admin faqs" on public.faqs for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.process_steps (id uuid primary key default gen_random_uuid(), title text not null, description text not null, sort_order int not null default 0, created_at timestamptz not null default now());
grant select on public.process_steps to anon, authenticated; grant insert, update, delete on public.process_steps to authenticated; grant all on public.process_steps to service_role;
alter table public.process_steps enable row level security;
create policy "read steps" on public.process_steps for select to anon, authenticated using (true);
create policy "admin steps" on public.process_steps for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.projects (id uuid primary key default gen_random_uuid(), slug text not null unique, title text not null, summary text not null, cover_url text, project_type text not null default 'concept' check (project_type in ('client','concept','practice')), services text[] not null default '{}', background text, goal text, problem text, role text, process text, results text, gallery text[] not null default '{}', featured boolean not null default false, status text not null default 'draft' check (status in ('draft','published')), sort_order int not null default 0, created_at timestamptz not null default now());
grant select on public.projects to anon, authenticated; grant insert, update, delete on public.projects to authenticated; grant all on public.projects to service_role;
alter table public.projects enable row level security;
create policy "read projects" on public.projects for select to anon, authenticated using (status='published' or public.has_role(auth.uid(),'admin'));
create policy "admin projects" on public.projects for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.testimonials (id uuid primary key default gen_random_uuid(), author text not null, company text, quote text not null, published boolean not null default false, created_at timestamptz not null default now());
grant select on public.testimonials to anon, authenticated; grant insert, update, delete on public.testimonials to authenticated; grant all on public.testimonials to service_role;
alter table public.testimonials enable row level security;
create policy "read testimonials" on public.testimonials for select to anon, authenticated using (published or public.has_role(auth.uid(),'admin'));
create policy "admin testimonials" on public.testimonials for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.site_settings (key text primary key, value text not null default '', updated_at timestamptz not null default now());
grant select on public.site_settings to anon, authenticated; grant insert, update, delete on public.site_settings to authenticated; grant all on public.site_settings to service_role;
alter table public.site_settings enable row level security;
create policy "read settings" on public.site_settings for select to anon, authenticated using (true);
create policy "admin settings" on public.site_settings for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.enquiries (id uuid primary key default gen_random_uuid(), name text not null, email text not null, message text not null, wants_updates boolean not null default false, status text not null default 'new' check (status in ('new','replied','handled')), ip_hash text, created_at timestamptz not null default now());
grant select, update, delete on public.enquiries to authenticated; grant all on public.enquiries to service_role;
alter table public.enquiries enable row level security;
create policy "admin enquiries" on public.enquiries for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.subscribers (id uuid primary key default gen_random_uuid(), email text not null unique, consent_text text not null, consent_at timestamptz not null default now(), source text not null default 'website', status text not null default 'subscribed' check (status in ('subscribed','unsubscribed')), unsubscribe_token uuid not null default gen_random_uuid(), unsubscribed_at timestamptz, created_at timestamptz not null default now());
grant select, update, delete on public.subscribers to authenticated; grant all on public.subscribers to service_role;
alter table public.subscribers enable row level security;
create policy "admin subscribers" on public.subscribers for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

insert into public.site_settings(key,value) values ('whatsapp',''),('linkedin',''),('instagram',''),('tiktok',''),('x',''),('facebook',''),('youtube',''),('pinterest',''),('substack_url',''),('business_email','');

insert into public.process_steps(title,description,sort_order) values
('Discuss your needs','We talk through your store, your goals and what is getting in the way.',1),
('Review and prioritise','I review the store or project and identify the most important priorities.',2),
('Agree on scope','We agree on clear deliverables, timelines and how we will communicate.',3),
('Do the work','I complete the work, sharing progress and agreed review points along the way.',4),
('Test, deliver, next steps','Everything is tested before handover, then we discuss what could come next.',5);

insert into public.faqs(question,answer,sort_order) values
('Do you work with clients outside my country?','Yes. I work with Shopify store owners and businesses internationally, communicating online.',1),
('Can you work on an existing Shopify store?','Yes. Many projects involve improving, fixing or optimising a store that is already live.',2),
('How is pricing decided?','Some services have starting prices and others are quoted based on scope. Get in touch and I will explain what applies to your project.',3),
('How do we start?','Use the Contact Me button to share a little about your store and what you need. I will review your message and reply.',4);

insert into public.services(slug,title,summary,keywords,included,sort_order,status) values
('store-design-development','Shopify Store Design & Development','Store creation, redesigns, theme customization, and custom sections.','{design,development,theme,redesign,build,sections,new store}','{"New store setup","Store redesigns","Theme customization","Custom sections"}',1,'published'),
('dropshipping-product-research','Shopify Dropshipping & Product Research','Dropshipping setup, product research, sourcing support, supplier setup, and product imports.','{dropshipping,products,research,sourcing,supplier,import}','{"Dropshipping setup","Product research","Sourcing support","Supplier setup","Product imports"}',2,'published'),
('store-management','Shopify Store Management','Store maintenance, inventory updates, order operations, product uploads, and ongoing management.','{management,maintenance,inventory,orders,uploads,ongoing}','{"Store maintenance","Inventory updates","Order operations","Product uploads"}',3,'published'),
('seo-organic-growth','Shopify SEO & Organic Growth','On-page SEO, metadata, collection optimization, and search visibility improvements.','{seo,search,google,metadata,organic,collections,visibility}','{"On-page SEO","Metadata","Collection optimization","Search visibility improvements"}',4,'published'),
('speed-optimization-bug-fixes','Shopify Speed Optimization & Bug Fixes','Performance improvements, Core Web Vitals investigation, theme issues, and technical troubleshooting.','{speed,performance,fast,slow,bugs,fix,core web vitals,troubleshooting}','{"Performance improvements","Core Web Vitals investigation","Theme issue fixes","Technical troubleshooting"}',5,'published'),
('product-page-conversion','Product Page & Conversion Optimization','Product page improvements, landing pages, cart experience, and conversion rate optimization.','{product page,conversion,cro,landing page,cart,checkout}','{"Product page improvements","Landing pages","Cart experience","Conversion rate optimization"}',6,'published'),
('apps-integrations-automation','Shopify Apps, Integrations & Automation','App installation, payment and shipping setup, integrations, and automated workflows.','{apps,integrations,automation,payments,shipping,workflow}','{"App installation","Payment and shipping setup","Integrations","Automated workflows"}',7,'published'),
('marketing-sales-channels','Shopify Marketing & Sales Channels','Email marketing integrations, social commerce, tracking, and sales channel setup.','{marketing,email,social,tracking,channels,instagram,tiktok}','{"Email marketing integrations","Social commerce","Tracking setup","Sales channel setup"}',8,'published'),
('advanced-solutions','Advanced Shopify Solutions','Store migrations, wholesale, international selling, and custom functionality.','{advanced,migration,wholesale,international,custom}','{"Store migrations","Wholesale","International selling","Custom functionality"}',9,'published'),
('consultation-store-audits','Shopify Consultation & Store Audits','Store reviews, problem diagnosis, and prioritized improvement recommendations.','{consultation,audit,review,diagnosis,recommendations}','{"Store reviews","Problem diagnosis","Prioritized recommendations"}',10,'published');
