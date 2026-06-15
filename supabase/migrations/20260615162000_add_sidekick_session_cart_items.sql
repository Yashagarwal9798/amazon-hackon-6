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

create index if not exists sidekick_session_cart_items_session_updated_idx
  on public.sidekick_session_cart_items(session_id, updated_at desc);

alter table public.sidekick_session_cart_items disable row level security;
