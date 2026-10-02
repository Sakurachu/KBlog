# Kairos Blog

一个可直接部署到 Vercel 的个人博客。管理员可以创建、编辑、发布文章并管理评论；读者通过邮箱注册和验证后可以评论。数据库、登录和行级权限由 Supabase 提供。

## 功能

- 个人博客首页、精选阅读、最近文章、专栏目录、归档与关于页面
- 精密制造、随笔、生活专栏，各自延续深绿、暖白纸页和海蓝图片风格
- 精密制造内保留精密工艺图解、对准基础、先进封装、显示制造等专题，原文章链接不变
- 专栏管理：新建、改名、介绍、排序与三种风格选择，文章自动继承所属专栏风格
- 所有专栏的实时搜索、专栏 / 专题筛选、日期 / 阅读时间排序、网格 / 列表视图与分批加载
- 文章目录定位、阅读进度、字号调整、链接复制与工艺海报放大查看
- Markdown 文章正文与写作预览
- 管理员写作台、草稿 / 发布状态、文章编辑和删除
- 读者邮箱注册、验证、登录和评论
- 管理员评论管理
- PostgreSQL 数据库和 Supabase RLS 权限
- 响应式页面、移动端导航、键盘操作、文章 SEO、Open Graph、`sitemap.xml` 和 `robots.txt`
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
- `categories`：专栏和技术专题；`accent` 保存风格（`teal` 为精密、`coral` 为纸页、`yellow` 为漫游），`sort_order` 保存顺序
- `posts`：文章、Markdown 正文、草稿和精选状态
- `comments`：已登录读者的评论

评论默认即时展示，管理员可以从写作台移除。若之后需要先审后发，可把迁移文件中 `comments.approved` 的默认值改为 `false`，并在写作台增加“通过”操作。

## 专栏与写作

访问 `/studio/columns` 管理专栏；文章编辑器会按专栏组织分类选项，并预览所属专栏的阅读风格。三个内置专栏在第一次保存设置或写入文章时使用现有 `categories` 表，无需额外数据库迁移。专栏的链接标识创建后保持固定，改名不会影响旧链接。

`/columns/precision` 汇集精密制造的技术专题及旧 `technology` 分类；`/columns/notes` 和 `/columns/life` 使用已有随笔、生活文章。旧 `/sections/notes`、`/sections/life` 会跳转到对应专栏，其他技术专题地址继续可用。新增数据库分类会自动成为可配置的新专栏。本地内置技术文章仍通过仓库管理，数据库文章通过写作台管理。

运行 `npm run test:columns` 验证专栏分组、风格继承、排序、输入校验、数据库分类 ID 解析和管理员授权。测试使用数据库替身，不写入真实数据。

## 图片来源

示例图片已保存到 `public/images`，不依赖运行时外链：

- [Aaron Burden / Unsplash](https://unsplash.com/photos/aL6JVv_5_qE)
- [Edgar / Unsplash](https://unsplash.com/photos/D65d_X1st-c)
- [John Tuesday / Unsplash](https://unsplash.com/photos/UukDrMuTs94)

使用前请同时参考 [Unsplash License](https://unsplash.com/license)。
