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

create index if not exists amazon_cart_items_user_updated_idx
  on public.amazon_cart_items(user_id, updated_at desc);

create index if not exists amazon_cart_items_user_product_idx
  on public.amazon_cart_items(user_id, product_id);

alter table public.amazon_cart_items disable row level security;
