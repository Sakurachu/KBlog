export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  accent: string;
  sort_order?: number;
};

export type ColumnTheme = "precision" | "notebook" | "gallery";

export type Column = Category & {
  theme: ColumnTheme;
  categorySlugs: string[];
  cover: string;
  eyebrow: string;
};

export type Profile = {
  id: string;
  display_name: string;
  role: "reader" | "admin";
  created_at?: string;
};

export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  status: "draft" | "published";
  reading_time: number;
  featured: boolean;
  published_at: string | null;
  created_at: string;
  updated_at?: string;
  category_id: string;
  author_id?: string | null;
  category: Category;
};

export type Comment = {
  id: string;
  content: string;
  created_at: string;
  approved: boolean;
  user_id: string;
  post_id: string;
  profile: Pick<Profile, "display_name"> | null;
};

export type PostSummary = Pick<
  Post,
  | "id"
  | "title"
  | "slug"
  | "excerpt"
  | "cover_image"
  | "reading_time"
  | "published_at"
  | "category"
>;

export type ActionState = {
  error?: string;
  success?: string;
};
