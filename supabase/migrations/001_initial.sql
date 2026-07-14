create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 32),
  role text not null default 'reader' check (role in ('reader', 'admin')),
  created_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text not null default '',
  accent text not null default 'coral' check (accent in ('coral', 'teal', 'yellow')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 2 and 120),
  slug text not null unique,
  excerpt text not null default '',
  content text not null,
  cover_image text not null default '/images/writing-desk.jpg',
  status text not null default 'draft' check (status in ('draft', 'published')),
  reading_time integer not null default 1 check (reading_time > 0),
  featured boolean not null default false,
  published_at timestamptz,
  category_id uuid not null references public.categories(id) on delete restrict,
  author_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null check (char_length(content) between 2 and 1000),
  approved boolean not null default true,
  created_at timestamptz not null default now()
);

create index posts_published_at_idx on public.posts(published_at desc)
  where status = 'published';
create index posts_category_id_idx on public.posts(category_id);
create index comments_post_id_created_at_idx on public.comments(post_id, created_at desc);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'display_name', ''), split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger posts_touch_updated_at
  before update on public.posts
  for each row execute procedure public.touch_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;

create policy "Profiles are publicly readable"
  on public.profiles for select
  using (true);

create policy "Admins can update profiles"
  on public.profiles for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "Categories are publicly readable"
  on public.categories for select
  using (true);

create policy "Admins can create categories"
  on public.categories for insert
  with check (public.is_admin());

create policy "Admins can update categories"
  on public.categories for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can delete categories"
  on public.categories for delete
  using (public.is_admin());

create policy "Published posts are public and admins can see all"
  on public.posts for select
  using (status = 'published' or public.is_admin());

create policy "Admins can create posts"
  on public.posts for insert
  with check (public.is_admin() and author_id = auth.uid());

create policy "Admins can update posts"
  on public.posts for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can delete posts"
  on public.posts for delete
  using (public.is_admin());

create policy "Approved comments are public and owners can see their own"
  on public.comments for select
  using (approved or user_id = auth.uid() or public.is_admin());

create policy "Verified readers can comment"
  on public.comments for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Readers can delete their own comments"
  on public.comments for delete
  to authenticated
  using (user_id = auth.uid() or public.is_admin());

insert into public.categories (id, name, slug, description, accent, sort_order) values
  ('10000000-0000-0000-0000-000000000001', '随笔', 'notes', '日常观察、阅读片段，以及那些值得慢慢想一想的事。', 'coral', 1),
  ('10000000-0000-0000-0000-000000000002', '技术', 'technology', '关于产品、代码与数字生活的实践记录。', 'teal', 2),
  ('10000000-0000-0000-0000-000000000003', '生活', 'life', '城市漫游、旅行和认真生活的微小证据。', 'yellow', 3)
on conflict (slug) do nothing;

insert into public.posts (
  id, title, slug, excerpt, content, cover_image, status, reading_time,
  featured, published_at, category_id
) values
  (
    '20000000-0000-0000-0000-000000000001',
    '给生活留一点空白：我的低负担记录系统',
    'a-quiet-note-system',
    '记录不必成为另一项待办。一个真正有用的系统，应该在需要时出现，在日子向前时安静退后。',
    $md$## 记录不是为了记住一切

过去我总想找到一套完美的笔记方法：每条信息都被分类，每个念头都有去处。后来才发现，过度整理只会让记录本身变成负担。

现在，我只保留三个入口：**今天发生了什么、我正在想什么、接下来想试什么**。它们足够宽松，也足够清晰。

## 一个可以长期使用的结构

每天只写几行，不追求完整。周末回看时，把真正值得延伸的内容挑出来，写成一篇短文或一个行动。

> 好的记录系统不是仓库，而是一扇会偶尔打开的窗。

工具可以更换，习惯也会变化。真正重要的是，在密集的日常里给自己留下一点能被重新看见的时间。$md$,
    '/images/writing-desk.jpg', 'published', 5, true, '2026-07-08 09:00:00+00',
    '10000000-0000-0000-0000-000000000001'
  ),
  (
    '20000000-0000-0000-0000-000000000002',
    '重新理解个人网站：它不是简历的另一种样子',
    'personal-web-is-a-place',
    '当平台不断变化，个人网站的价值也许正是它足够缓慢、足够独立，而且允许不完整。',
    $md$## 网站是一块可以长期照料的地方

社交平台擅长分发，个人网站擅长沉淀。这里没有统一的内容格式，也不需要追赶每一次热点。

我更愿意把它看作一个持续生长的房间：文章是书架，链接是窗户，评论则是偶尔来访的朋友留下的便签。

## 小而明确

一个首页、几个分区、一套舒服的阅读样式，已经足够开始。先让写作发生，再慢慢调整结构。$md$,
    '/images/architecture.jpg', 'published', 4, false, '2026-06-26 11:30:00+00',
    '10000000-0000-0000-0000-000000000002'
  ),
  (
    '20000000-0000-0000-0000-000000000003',
    '沿海岸走一段没有目的地的路',
    'a-walk-by-the-coast',
    '风很大，信号很弱。没有路线的一次散步，反而让那些被忽略的细节重新变得清晰。',
    $md$## 下午四点的海岸

风把云推得很快，海面没有明亮的颜色。沿着岸边向前走时，我没有打开地图，也没有计算还剩多少时间。

我们习惯给行动加上目的：走路为了运动，阅读为了学习，休息为了恢复效率。但有些时间不必兑换成任何成果。

回程时天色暗了一点。那段没有被记录的路，成了这一天最清晰的部分。$md$,
    '/images/coast.jpg', 'published', 3, false, '2026-06-12 07:00:00+00',
    '10000000-0000-0000-0000-000000000003'
  )
on conflict (slug) do nothing;
