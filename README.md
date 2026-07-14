# Kairos Blog

一个可直接部署到 Vercel 的个人博客。管理员可以创建、编辑、发布文章并管理评论；读者通过邮箱注册和验证后可以评论。数据库、登录和行级权限由 Supabase 提供。

## 功能

- 首页精选、最近文章、随笔 / 技术 / 生活分区
- Markdown 文章正文与写作预览
- 管理员写作台、草稿 / 发布状态、文章编辑和删除
- 读者邮箱注册、验证、登录和评论
- 管理员评论管理
- PostgreSQL 数据库和 Supabase RLS 权限
- 响应式页面、文章 SEO、Open Graph、`sitemap.xml` 和 `robots.txt`
- 未配置数据库时自动显示本地演示内容

## 本地运行

要求 Node.js 20.9 或更高版本。

```bash
npm install
Copy-Item .env.example .env.local
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。没有填写 Supabase 环境变量时，网站会以只读演示模式运行。

## 连接 Supabase

1. 在 [Supabase](https://supabase.com/dashboard) 创建项目。
2. 打开项目的 SQL Editor，执行 [`supabase/migrations/001_initial.sql`](./supabase/migrations/001_initial.sql)。脚本会创建表、触发器、RLS 策略、三个分区和三篇示例文章。
3. 从 `Project Settings > API` 取得 Project URL 和 anon key，填入 `.env.local`：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. 在 `Authentication > URL Configuration` 中添加允许的重定向地址：

```text
http://localhost:3000/auth/confirm
https://你的域名/auth/confirm
```

5. 在网站注册你的管理员账号并完成邮箱验证，然后在 SQL Editor 执行：

```sql
update public.profiles
set role = 'admin'
where id = (select id from auth.users where email = '你的邮箱');
```

重新登录后，顶部会出现“写作台”。读者账号固定为 `reader`，不能通过前端提升权限。

## 部署到 Vercel

1. 把仓库推送到 GitHub、GitLab 或 Bitbucket。
2. 在 [Vercel New Project](https://vercel.com/new) 导入仓库，框架会自动识别为 Next.js。
3. 在 Vercel 项目的 `Settings > Environment Variables` 添加：

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_SITE_URL=https://你的域名
```

4. 部署后，把正式域名的 `/auth/confirm` 地址加入 Supabase Redirect URLs。
5. 在 Vercel `Settings > Domains` 添加你的域名，按提示配置 DNS。域名生效后，将 `NEXT_PUBLIC_SITE_URL` 改成正式域名并重新部署。

不要把 Supabase `service_role` key 放进这个项目或 Vercel 的公开环境变量。当前实现只使用 anon key，真正的写入权限由登录状态和 RLS 控制。

## 数据结构

- `profiles`：读者资料和 `reader` / `admin` 角色
- `categories`：博客分区
- `posts`：文章、Markdown 正文、草稿和精选状态
- `comments`：已登录读者的评论

评论默认即时展示，管理员可以从写作台移除。若之后需要先审后发，可把迁移文件中 `comments.approved` 的默认值改为 `false`，并在写作台增加“通过”操作。

## 图片来源

示例图片已保存到 `public/images`，不依赖运行时外链：

- [Aaron Burden / Unsplash](https://unsplash.com/photos/aL6JVv_5_qE)
- [Edgar / Unsplash](https://unsplash.com/photos/D65d_X1st-c)
- [John Tuesday / Unsplash](https://unsplash.com/photos/UukDrMuTs94)

使用前请同时参考 [Unsplash License](https://unsplash.com/license)。
