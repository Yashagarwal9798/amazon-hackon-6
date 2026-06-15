-- Amazon Sidekick schedule MVP schema.
-- Run this against an existing project that already has sidekick_chat_sessions.

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

create index if not exists sidekick_schedules_user_next_run_idx
  on public.sidekick_schedules(user_id, next_run_at);

create index if not exists sidekick_schedules_session_idx
  on public.sidekick_schedules(session_id);

alter table public.sidekick_schedules disable row level security;
