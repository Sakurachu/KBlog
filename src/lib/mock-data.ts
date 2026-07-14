import type { Category, Comment, Post } from "@/lib/types";

export const mockCategories: Category[] = [
  {
    id: "cat-notes",
    name: "随笔",
    slug: "notes",
    description: "日常观察、阅读片段，以及那些值得慢慢想一想的事。",
    accent: "coral",
  },
  {
    id: "cat-tech",
    name: "技术",
    slug: "technology",
    description: "关于产品、代码与数字生活的实践记录。",
    accent: "teal",
  },
  {
    id: "cat-life",
    name: "生活",
    slug: "life",
    description: "城市漫游、旅行和认真生活的微小证据。",
    accent: "yellow",
  },
];

export const mockPosts: Post[] = [
  {
    id: "post-quiet-system",
    title: "给生活留一点空白：我的低负担记录系统",
    slug: "a-quiet-note-system",
    excerpt:
      "记录不必成为另一项待办。一个真正有用的系统，应该在需要时出现，在日子向前时安静退后。",
    content: `## 记录不是为了记住一切

过去我总想找到一套完美的笔记方法：每条信息都被分类，每个念头都有去处。后来才发现，过度整理只会让记录本身变成负担。

现在，我只保留三个入口：**今天发生了什么、我正在想什么、接下来想试什么**。它们足够宽松，也足够清晰。

## 一个可以长期使用的结构

每天只写几行，不追求完整。周末回看时，把真正值得延伸的内容挑出来，写成一篇短文或一个行动。

> 好的记录系统不是仓库，而是一扇会偶尔打开的窗。

工具可以更换，习惯也会变化。真正重要的是，在密集的日常里给自己留下一点能被重新看见的时间。`,
    cover_image: "/images/writing-desk.jpg",
    status: "published",
    reading_time: 5,
    featured: true,
    published_at: "2026-07-08T09:00:00.000Z",
    created_at: "2026-07-08T09:00:00.000Z",
    category_id: "cat-notes",
    category: mockCategories[0],
  },
  {
    id: "post-small-web",
    title: "重新理解个人网站：它不是简历的另一种样子",
    slug: "personal-web-is-a-place",
    excerpt:
      "当平台不断变化，个人网站的价值也许正是它足够缓慢、足够独立，而且允许不完整。",
    content: `## 网站是一块可以长期照料的地方

社交平台擅长分发，个人网站擅长沉淀。这里没有统一的内容格式，也不需要追赶每一次热点。

我更愿意把它看作一个持续生长的房间：文章是书架，链接是窗户，评论则是偶尔来访的朋友留下的便签。

## 小而明确

一个首页、几个分区、一套舒服的阅读样式，已经足够开始。先让写作发生，再慢慢调整结构。`,
    cover_image: "/images/architecture.jpg",
    status: "published",
    reading_time: 4,
    featured: false,
    published_at: "2026-06-26T11:30:00.000Z",
    created_at: "2026-06-26T11:30:00.000Z",
    category_id: "cat-tech",
    category: mockCategories[1],
  },
  {
    id: "post-coast",
    title: "沿海岸走一段没有目的地的路",
    slug: "a-walk-by-the-coast",
    excerpt:
      "风很大，信号很弱。没有路线的一次散步，反而让那些被忽略的细节重新变得清晰。",
    content: `## 下午四点的海岸

风把云推得很快，海面没有明亮的颜色。沿着岸边向前走时，我没有打开地图，也没有计算还剩多少时间。

我们习惯给行动加上目的：走路为了运动，阅读为了学习，休息为了恢复效率。但有些时间不必兑换成任何成果。

回程时天色暗了一点。那段没有被记录的路，成了这一天最清晰的部分。`,
    cover_image: "/images/coast.jpg",
    status: "published",
    reading_time: 3,
    featured: false,
    published_at: "2026-06-12T07:00:00.000Z",
    created_at: "2026-06-12T07:00:00.000Z",
    category_id: "cat-life",
    category: mockCategories[2],
  },
];

export const mockComments: Comment[] = [
  {
    id: "comment-demo",
    content: "很喜欢“记录系统不是仓库”这个比喻。少一点整理，反而更愿意持续写下去。",
    created_at: "2026-07-10T12:20:00.000Z",
    approved: true,
    user_id: "demo-reader",
    post_id: "post-quiet-system",
    profile: { display_name: "山茶" },
  },
];
