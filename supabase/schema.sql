-- Amazon Sidekick initial Supabase schema.
-- Run this in Supabase Dashboard -> SQL Editor.
-- MVP note: RLS is disabled for these demo tables so the Vite anon client can read/write.
-- Before production, enable RLS and replace these demo access rules with user-scoped policies.

create extension if not exists pgcrypto;

create table if not exists public.sidekick_chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id text not null default 'demo-user',
  title text not null default 'New Sidekick chat',
  active_mode text,
  latest_cart_draft_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sidekick_chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sidekick_chat_sessions(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.sidekick_cart_drafts (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sidekick_chat_sessions(id) on delete cascade,
  user_id text not null default 'demo-user',
  title text not null,
  mode text not null,
  status text not null default 'ready_for_review'
    check (status in ('needs_clarification', 'ready_for_review', 'committed')),
  review_needed boolean not null default false,
  subtotal numeric(10, 2) not null default 0,
  missing_slots jsonb not null default '[]'::jsonb,
  evidence jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'sidekick_chat_sessions_latest_cart_fk'
  ) then
    alter table public.sidekick_chat_sessions
      add constraint sidekick_chat_sessions_latest_cart_fk
      foreign key (latest_cart_draft_id)
      references public.sidekick_cart_drafts(id)
      on delete set null;
  end if;
end $$;

create table if not exists public.sidekick_cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_draft_id uuid not null references public.sidekick_cart_drafts(id) on delete cascade,
  requirement_name text not null,
  product_id uuid,
  product_title text not null,
  brand text not null,
  quantity numeric(10, 2) not null default 1,
  unit text not null default 'pack',
  pack_size text not null,
  price numeric(10, 2) not null default 0,
  rating numeric(2, 1) not null default 0,
  available boolean not null default true,
  delivery_eta_minutes integer not null default 7,
  reason text not null default '',
  alternatives jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.sidekick_session_cart_items (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sidekick_chat_sessions(id) on delete cascade,
  user_id text not null default 'demo-user',
  source_cart_draft_ids uuid[] not null default array[]::uuid[],
  source_cart_item_ids uuid[] not null default array[]::uuid[],
  requirement_name text not null,
  product_id uuid,
  product_title text not null,
  brand text not null,
  quantity numeric(10, 2) not null default 1,
  unit text not null default 'pack',
  pack_size text not null,
  price numeric(10, 2) not null default 0,
  rating numeric(2, 1) not null default 0,
  available boolean not null default true,
  delivery_eta_minutes integer not null default 7,
  reason text not null default '',
  image_url text,
  alternatives jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_catalog (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  brand text not null,
  category text not null,
  aliases text[] not null default array[]::text[],
  pack_size text not null,
  unit text not null default 'pack',
  price numeric(10, 2) not null,
  rating numeric(2, 1) not null default 0,
  available boolean not null default true,
  delivery_eta_minutes integer not null default 7,
  image_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.amazon_cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id text not null default 'demo-user',
  source_cart_draft_id uuid references public.sidekick_cart_drafts(id) on delete set null,
  source_cart_item_id uuid references public.sidekick_cart_items(id) on delete set null,
  product_id uuid references public.product_catalog(id) on delete set null,
  product_title text not null,
  brand text not null,
  quantity numeric(10, 2) not null default 1,
  unit text not null default 'pack',
  pack_size text not null,
  price numeric(10, 2) not null default 0,
  image_url text,
  added_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sidekick_schedules (
  id uuid primary key default gen_random_uuid(),
  user_id text not null default 'demo-user',
  session_id uuid references public.sidekick_chat_sessions(id) on delete cascade,
  request_text text not null,
  schedule_type text not null check (schedule_type in ('once', 'recurring')),
  run_at timestamptz,
  recurrence_days text[] not null default array[]::text[],
  recurrence_time time,
  timezone text not null default 'Asia/Kolkata',
  next_run_at timestamptz not null,
  reminder_email text,
  email_reminder_enabled boolean not null default true,
  email_status text not null default 'pending_provider'
    check (email_status in ('disabled', 'pending_provider', 'queued', 'sent', 'failed')),
  status text not null default 'active'
    check (status in ('active', 'paused', 'completed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_preference_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id text not null unique default 'demo-user',
  preferred_brands_by_category jsonb not null default '{}'::jsonb,
  saved_product_ids uuid[] not null default array[]::uuid[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_purchase_history (
  id uuid primary key default gen_random_uuid(),
  user_id text not null default 'demo-user',
  product_id uuid references public.product_catalog(id) on delete set null,
  product_title text not null,
  brand text not null,
  category text not null,
  quantity numeric(10, 2) not null default 1,
  purchased_at timestamptz not null default now()
);

create table if not exists public.recipe_documents (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  aliases text[] not null default array[]::text[],
  cuisine text not null default 'Indian',
  base_servings integer not null default 4,
  ingredients jsonb not null default '[]'::jsonb,
  instructions text,
  source text,
  created_at timestamptz not null default now()
);

create table if not exists public.occasion_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  aliases text[] not null default array[]::text[],
  required_slots jsonb not null default '[]'::jsonb,
  item_requirements jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.emergency_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  aliases text[] not null default array[]::text[],
  item_requirements jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.healthcare_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  aliases text[] not null default array[]::text[],
  safety_message text not null,
  item_requirements jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists sidekick_chat_sessions_user_updated_idx
  on public.sidekick_chat_sessions(user_id, updated_at desc);

create index if not exists sidekick_chat_messages_session_created_idx
  on public.sidekick_chat_messages(session_id, created_at asc);

create index if not exists sidekick_cart_drafts_session_updated_idx
  on public.sidekick_cart_drafts(session_id, updated_at desc);

create index if not exists sidekick_session_cart_items_session_updated_idx
  on public.sidekick_session_cart_items(session_id, updated_at desc);

create index if not exists amazon_cart_items_user_updated_idx
  on public.amazon_cart_items(user_id, updated_at desc);

create index if not exists amazon_cart_items_user_product_idx
  on public.amazon_cart_items(user_id, product_id);

create index if not exists sidekick_schedules_user_next_run_idx
  on public.sidekick_schedules(user_id, next_run_at);

create index if not exists sidekick_schedules_session_idx
  on public.sidekick_schedules(session_id);

create index if not exists product_catalog_category_idx
  on public.product_catalog(category);

create index if not exists product_catalog_brand_idx
  on public.product_catalog(brand);

alter table public.sidekick_chat_sessions disable row level security;
alter table public.sidekick_chat_messages disable row level security;
alter table public.sidekick_cart_drafts disable row level security;
alter table public.sidekick_cart_items disable row level security;
alter table public.sidekick_session_cart_items disable row level security;
alter table public.amazon_cart_items disable row level security;
alter table public.sidekick_schedules disable row level security;
alter table public.product_catalog disable row level security;
alter table public.user_preference_profiles disable row level security;
alter table public.user_purchase_history disable row level security;
alter table public.recipe_documents disable row level security;
alter table public.occasion_templates disable row level security;
alter table public.emergency_templates disable row level security;
alter table public.healthcare_templates disable row level security;
