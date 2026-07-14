import { cache } from "react";
import { mockCategories, mockComments, mockPosts } from "@/lib/mock-data";
import { createClient, hasSupabaseEnv } from "@/lib/supabase/server";
import type { Category, Comment, Post, Profile } from "@/lib/types";

const postSelect = `
  id, title, slug, excerpt, content, cover_image, status, reading_time,
  featured, published_at, created_at, updated_at, category_id, author_id,
  category:categories(id, name, slug, description, accent)
`;

export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  if (!supabase) return { user: null, profile: null };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, profile: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, display_name, role, created_at")
    .eq("id", user.id)
    .single();

  return { user, profile: profile as Profile | null };
});

export const getCategories = cache(async (): Promise<Category[]> => {
  if (!hasSupabaseEnv()) return mockCategories;
  const supabase = await createClient();
  const { data } = await supabase!
    .from("categories")
    .select("id, name, slug, description, accent")
    .order("sort_order");

  return (data ?? []) as Category[];
});

export async function getPublishedPosts(options?: {
  category?: string;
  limit?: number;
}): Promise<Post[]> {
  if (!hasSupabaseEnv()) {
    const filtered = options?.category
      ? mockPosts.filter((post) => post.category.slug === options.category)
      : mockPosts;
    return filtered.slice(0, options?.limit ?? filtered.length);
  }

  const supabase = await createClient();
  const select = options?.category
    ? postSelect.replace("category:categories(", "category:categories!inner(")
    : postSelect;
  let query = supabase!
    .from("posts")
    .select(select)
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (options?.category) {
    query = query.eq("categories.slug", options.category);
  }
  if (options?.limit) query = query.limit(options.limit);

  const { data } = await query;
  return (data ?? []) as unknown as Post[];
}

export async function getFeaturedPost() {
  if (!hasSupabaseEnv()) {
    return mockPosts.find((post) => post.featured) ?? mockPosts[0];
  }

  const supabase = await createClient();
  const { data } = await supabase!
    .from("posts")
    .select(postSelect)
    .eq("status", "published")
    .eq("featured", true)
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (data) return data as unknown as Post;
  const [latest] = await getPublishedPosts({ limit: 1 });
  return latest ?? null;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!hasSupabaseEnv()) {
    return mockPosts.find((post) => post.slug === slug) ?? null;
  }

  const supabase = await createClient();
  const { data } = await supabase!
    .from("posts")
    .select(postSelect)
    .eq("slug", slug)
    .maybeSingle();

  return data as unknown as Post | null;
}

export async function getComments(postId: string): Promise<Comment[]> {
  if (!hasSupabaseEnv()) {
    return mockComments.filter((comment) => comment.post_id === postId);
  }

  const supabase = await createClient();
  const { data } = await supabase!
    .from("comments")
    .select(
      "id, content, created_at, approved, user_id, post_id, profile:profiles(display_name)",
    )
    .eq("post_id", postId)
    .eq("approved", true)
    .order("created_at", { ascending: false });

  return (data ?? []) as unknown as Comment[];
}

export async function getStudioData() {
  const supabase = await createClient();
  if (!supabase) return { posts: [], comments: [] };

  const [{ data: posts }, { data: comments }] = await Promise.all([
    supabase.from("posts").select(postSelect).order("updated_at", { ascending: false }),
    supabase
      .from("comments")
      .select(
        "id, content, created_at, approved, user_id, post_id, profile:profiles(display_name)",
      )
      .order("created_at", { ascending: false })
      .limit(30),
  ]);

  return {
    posts: (posts ?? []) as unknown as Post[],
    comments: (comments ?? []) as unknown as Comment[],
  };
}

export async function getPostById(id: string): Promise<Post | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("posts")
    .select(postSelect)
    .eq("id", id)
    .maybeSingle();
  return data as unknown as Post | null;
}
