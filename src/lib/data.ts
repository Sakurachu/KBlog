import { cache } from "react";
import {
  editorialCategories,
  editorialPosts,
} from "@/lib/editorial-data";
import {
  processAtlasCategory,
  processAtlasPosts,
} from "@/lib/process-atlas-data";
import { createClient, hasSupabaseEnv } from "@/lib/supabase/server";
import type { Category, Comment, Post, Profile } from "@/lib/types";

const localCategories = [processAtlasCategory, ...editorialCategories];
const localPosts = [...processAtlasPosts, ...editorialPosts];

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
  if (!hasSupabaseEnv()) return localCategories;
  const supabase = await createClient();
  const { data } = await supabase!
    .from("categories")
    .select("id, name, slug, description, accent")
    .order("sort_order");

  const databaseCategories = (data ?? []) as Category[];
  const editorialSlugs = new Set(localCategories.map((category) => category.slug));

  return [
    ...localCategories,
    ...databaseCategories.filter((category) => !editorialSlugs.has(category.slug)),
  ];
});

export async function getPublishedPosts(options?: {
  category?: string;
  limit?: number;
}): Promise<Post[]> {
  const filteredLocalPosts = options?.category
    ? localPosts.filter((post) => post.category.slug === options.category)
    : localPosts;

  if (!hasSupabaseEnv()) {
    return filteredLocalPosts.slice(0, options?.limit ?? filteredLocalPosts.length);
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
  const { data } = await query;
  const databasePosts = (data ?? []) as unknown as Post[];
  const editorialSlugs = new Set(filteredLocalPosts.map((post) => post.slug));
  const combined = [
    ...filteredLocalPosts,
    ...databasePosts.filter((post) => !editorialSlugs.has(post.slug)),
  ].sort((a, b) => {
    const aTime = a.published_at ? new Date(a.published_at).getTime() : 0;
    const bTime = b.published_at ? new Date(b.published_at).getTime() : 0;
    return bTime - aTime;
  });

  return combined.slice(0, options?.limit ?? combined.length);
}

export async function getFeaturedPost() {
  const posts = await getPublishedPosts();
  return posts.find((post) => post.featured) ?? posts[0] ?? null;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const editorialPost = localPosts.find((post) => post.slug === slug);
  if (editorialPost) return editorialPost;
  if (!hasSupabaseEnv()) return null;

  const supabase = await createClient();
  const { data } = await supabase!
    .from("posts")
    .select(postSelect)
    .eq("slug", slug)
    .maybeSingle();

  return data as unknown as Post | null;
}

export async function getComments(postId: string): Promise<Comment[]> {
  if (!hasSupabaseEnv()) return [];

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
  const editorialPost = localPosts.find((post) => post.id === id);
  if (editorialPost) return editorialPost;
  const supabase = await createClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("posts")
    .select(postSelect)
    .eq("id", id)
    .maybeSingle();
  return data as unknown as Post | null;
}
