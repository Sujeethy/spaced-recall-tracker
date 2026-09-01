-- ==============================================================================
-- Spaced Recall Tracker: Production Supabase PostgreSQL Schema
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. CATEGORIES
create table if not exists public.categories (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) on delete cascade default auth.uid(),
    name text not null,
    color text default '#6366f1',
    "order" integer default 1,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique (user_id, name)
);

-- 2. TAGS
create table if not exists public.tags (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) on delete cascade default auth.uid(),
    name text not null,
    unique (user_id, name)
);

-- 3. TOPICS
create table if not exists public.topics (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) on delete cascade default auth.uid(),
    title text not null,
    description text default '',
    notes text default '',
    learned_at date not null default current_date,
    category_id uuid references public.categories(id) on delete set null,
    difficulty text check (difficulty in ('easy', 'medium', 'hard')) default 'medium',
    chatgpt_url text default '',
    questions jsonb default '[]'::jsonb,
    archived boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. TOPIC TAGS (Junction Table)
create table if not exists public.topic_tags (
    topic_id uuid references public.topics(id) on delete cascade not null,
    tag_id uuid references public.tags(id) on delete cascade not null,
    primary key (topic_id, tag_id)
);

-- 5. RECALL SESSIONS
create table if not exists public.recall_sessions (
    id uuid primary key default uuid_generate_v4(),
    topic_id uuid references public.topics(id) on delete cascade not null,
    user_id uuid references auth.users(id) on delete cascade default auth.uid(),
    interval_days integer not null,
    recall_index integer not null,
    scheduled_date date not null,
    completed_at timestamp with time zone default null,
    status text check (status in ('upcoming', 'due', 'completed', 'overdue', 'skipped', 'rescheduled')) default 'upcoming',
    rescheduled_from date default null,
    notes text default null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. USER SETTINGS
create table if not exists public.user_settings (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) on delete cascade default auth.uid() unique,
    recall_intervals integer[] default array[0, 1, 3, 5, 9, 15, 25, 40, 60, 90, 120, 180, 365],
    notification_enabled boolean default false,
    notification_time text default '10:00',
    notification_frequency text default 'daily',
    remind_overdue boolean default true,
    remind_due_today boolean default true,
    timezone text default 'UTC',
    theme text default 'system',
    week_start_day integer default 1,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- INDEXES FOR HIGH-PERFORMANCE QUERYING
-- ==============================================================================
create index if not exists idx_topics_user_learned on public.topics(user_id, learned_at desc);
create index if not exists idx_topics_category on public.topics(category_id);
create index if not exists idx_recall_sessions_user_date on public.recall_sessions(user_id, scheduled_date);
create index if not exists idx_recall_sessions_topic on public.recall_sessions(topic_id);
create index if not exists idx_recall_sessions_status on public.recall_sessions(status);

-- ==============================================================================
-- AUTOMATIC updated_at TRIGGER
-- ==============================================================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

create or replace trigger trigger_topics_updated_at
    before update on public.topics
    for each row execute function public.handle_updated_at();

create or replace trigger trigger_categories_updated_at
    before update on public.categories
    for each row execute function public.handle_updated_at();

create or replace trigger trigger_recall_sessions_updated_at
    before update on public.recall_sessions
    for each row execute function public.handle_updated_at();

create or replace trigger trigger_user_settings_updated_at
    before update on public.user_settings
    for each row execute function public.handle_updated_at();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
alter table public.categories enable row level security;
alter table public.tags enable row level security;
alter table public.topics enable row level security;
alter table public.topic_tags enable row level security;
alter table public.recall_sessions enable row level security;
alter table public.user_settings enable row level security;

-- Categories RLS
create policy "Users can manage their own categories"
    on public.categories for all
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- Tags RLS
create policy "Users can manage their own tags"
    on public.tags for all
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- Topics RLS
create policy "Users can manage their own topics"
    on public.topics for all
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- Topic Tags RLS
create policy "Users can manage their own topic tags"
    on public.topic_tags for all
    using (exists (select 1 from public.topics t where t.id = topic_tags.topic_id and t.user_id = auth.uid()))
    with check (exists (select 1 from public.topics t where t.id = topic_tags.topic_id and t.user_id = auth.uid()));

-- Recall Sessions RLS
create policy "Users can manage their own recall sessions"
    on public.recall_sessions for all
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- User Settings RLS
create policy "Users can manage their own settings"
    on public.user_settings for all
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- ==============================================================================
-- REALTIME SUBSCRIPTIONS
-- ==============================================================================
alter publication supabase_realtime add table public.topics;
alter publication supabase_realtime add table public.recall_sessions;
alter publication supabase_realtime add table public.categories;
