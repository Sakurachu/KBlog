"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/data";
import { makeSlug, readingTime } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "@/lib/types";

function field(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function safePath(value: string, fallback = "/") {
  return value.startsWith("/") && !value.startsWith("//") ? value : fallback;
}

async function requireAdmin() {
  const { user, profile } = await getCurrentUser();
  if (!user || profile?.role !== "admin") redirect("/login?next=/studio");
  return user;
}

export async function signInAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = field(formData, "email");
  const password = field(formData, "password");
  const supabase = await createClient();

  if (!supabase) return { error: "请先配置 Supabase 环境变量。" };
  if (!email || !password) return { error: "请输入邮箱和密码。" };

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "登录失败，请检查邮箱、密码或邮箱验证状态。" };

  revalidatePath("/", "layout");
  redirect(safePath(field(formData, "next")));
}

export async function signUpAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = field(formData, "email");
  const password = field(formData, "password");
  const displayName = field(formData, "displayName");
  const supabase = await createClient();

  if (!supabase) return { error: "请先配置 Supabase 环境变量。" };
  if (!displayName || displayName.length > 32) {
    return { error: "昵称需为 1 至 32 个字符。" };
  }
  if (password.length < 8) return { error: "密码至少需要 8 个字符。" };

  const headerStore = await headers();
  const origin =
    headerStore.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName },
      emailRedirectTo: `${origin}/auth/confirm`,
    },
  });

  if (error) return { error: error.message };
  return { success: "注册成功。请打开验证邮件，验证后即可登录评论。" };
}

export async function signOutAction() {
  const supabase = await createClient();
  if (supabase) await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function createCommentAction(
  postId: string,
  postSlug: string,
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const content = field(formData, "content");
  const supabase = await createClient();
  if (!supabase) return { error: "演示模式暂不能提交评论，请先连接 Supabase。" };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "请先登录，再参与讨论。" };
  if (content.length < 2 || content.length > 1000) {
    return { error: "评论需为 2 至 1000 个字符。" };
  }

  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    user_id: user.id,
    content,
    approved: true,
  });
  if (error) return { error: "评论提交失败，请稍后重试。" };

  revalidatePath(`/posts/${postSlug}`);
  return { success: "评论已发布。" };
}

export async function savePostAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireAdmin();
  const supabase = await createClient();
  const id = field(formData, "id");
  const title = field(formData, "title");
  const content = field(formData, "content");
  const excerpt = field(formData, "excerpt");
  const categoryId = field(formData, "categoryId");
  const status = field(formData, "status") === "published" ? "published" : "draft";

  if (title.length < 2 || content.length < 20 || !categoryId) {
    return { error: "标题、分区和正文均为必填项，正文至少 20 个字符。" };
  }

  const payload = {
    title,
    slug: makeSlug(field(formData, "slug") || title),
    excerpt: excerpt || content.replace(/[#>*_`\n]/g, " ").slice(0, 140),
    content,
    cover_image: field(formData, "coverImage") || "/images/writing-desk.jpg",
    category_id: categoryId,
    author_id: user.id,
    status,
    featured: formData.get("featured") === "on",
    reading_time: readingTime(content),
    published_at:
      status === "published"
        ? field(formData, "publishedAt") || new Date().toISOString()
        : null,
    updated_at: new Date().toISOString(),
  };

  const query = id
    ? supabase!.from("posts").update(payload).eq("id", id)
    : supabase!.from("posts").insert(payload);
  const { error } = await query;
  if (error) {
    return {
      error: error.code === "23505" ? "这个链接别名已经被使用。" : "保存失败，请检查输入。",
    };
  }

  revalidatePath("/", "layout");
  redirect("/studio?saved=1");
}

export async function deletePostAction(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase!.from("posts").delete().eq("id", field(formData, "id"));
  revalidatePath("/", "layout");
  redirect("/studio");
}

export async function deleteCommentAction(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase!.from("comments").delete().eq("id", field(formData, "id"));
  revalidatePath("/studio");
}
