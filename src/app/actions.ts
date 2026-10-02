"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCategories, getCurrentUser } from "@/lib/data";
import { columnThemes, precisionSlugs } from "@/lib/columns";
import type { ColumnTheme } from "@/lib/types";
import { makeSlug, readingTime } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "@/lib/types";

function field(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function safePath(value: string, fallback = "/") {
  return value.startsWith("/") && !value.startsWith("//") ? value : fallback;
}

async function siteOrigin() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (configured) return configured;

  const headerStore = await headers();
  return headerStore.get("origin") || "http://localhost:3000";
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

  const origin = await siteOrigin();
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

export async function requestPasswordResetAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = field(formData, "email");
  const supabase = await createClient();

  if (!supabase) return { error: "请先配置 Supabase 环境变量。" };
  if (!/^\S+@\S+\.\S+$/.test(email)) return { error: "请输入有效的邮箱地址。" };

  const origin = await siteOrigin();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/confirm?next=/reset-password`,
  });

  if (error) return { error: "暂时无法发送重置邮件，请稍后再试。" };
  return {
    success: "如果该邮箱已注册，重置密码邮件将在几分钟内送达。",
  };
}

export async function updatePasswordAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const password = field(formData, "password");
  const confirmPassword = field(formData, "confirmPassword");
  const supabase = await createClient();

  if (!supabase) return { error: "请先配置 Supabase 环境变量。" };
  if (password.length < 8) return { error: "新密码至少需要 8 个字符。" };
  if (password !== confirmPassword) return { error: "两次输入的密码不一致。" };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "重置链接已失效，请重新申请重置邮件。" };

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: "密码更新失败，请更换密码或重新申请重置邮件。" };

  revalidatePath("/", "layout");
  return { success: "密码已更新。之后请使用新密码登录。" };
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
  if (!supabase)
    return { error: "演示模式暂不能提交评论，请先连接 Supabase。" };

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
  const status =
    field(formData, "status") === "published" ? "published" : "draft";

  if (title.length < 2 || content.length < 20 || !categoryId) {
    return { error: "标题、专栏 / 专题和正文均为必填项，正文至少 20 个字符。" };
  }

  const selectedCategory = (await getCategories()).find(
    (category) => category.id === categoryId,
  );
  if (!selectedCategory) return { error: "请选择有效的专栏或专题。" };
  // Built-in columns and technical topics are available before their first database post.
  const { data: existingCategory, error: lookupError } = await supabase!
    .from("categories")
    .select("id")
    .eq("slug", selectedCategory.slug)
    .maybeSingle();
  if (lookupError) return { error: "暂时无法读取专栏，请稍后重试。" };
  let resolvedCategoryId = existingCategory?.id as string | undefined;
  if (!resolvedCategoryId) {
    const { data: createdCategory, error: createError } = await supabase!
      .from("categories")
      .insert({
        name: selectedCategory.name,
        slug: selectedCategory.slug,
        description: selectedCategory.description,
        accent: selectedCategory.accent,
        sort_order: selectedCategory.sort_order ?? 100,
      })
      .select("id")
      .single();
    if (createError)
      return { error: "无法创建所属专栏 / 专题，请刷新后重试。" };
    resolvedCategoryId = createdCategory.id;
  }

  const payload = {
    title,
    slug: makeSlug(field(formData, "slug") || title),
    excerpt: excerpt || content.replace(/[#>*_`\n]/g, " ").slice(0, 140),
    content,
    cover_image: field(formData, "coverImage") || "/images/writing-desk.jpg",
    category_id: resolvedCategoryId,
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
      error:
        error.code === "23505"
          ? "这个链接别名已经被使用。"
          : "保存失败，请检查输入。",
    };
  }

  revalidatePath("/", "layout");
  redirect("/studio?saved=1");
}

export async function saveColumnAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const supabase = await createClient();
  const name = field(formData, "name");
  const slug = field(formData, "slug");
  const description = field(formData, "description");
  const theme = field(formData, "theme") as ColumnTheme;
  const sortOrder = Number(field(formData, "sortOrder"));
  const editing = field(formData, "editing") === "yes";
  if (!name || name.length > 40 || description.length > 240)
    return { error: "名称需为 1–40 字，介绍最多 240 字。" };
  if (
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ||
    slug.length > 60 ||
    (precisionSlugs.includes(slug) && slug !== "precision")
  )
    return {
      error:
        "链接标识需为小写英文、数字或连字符，且不能使用已有技术专题的标识。",
    };
  if (
    !Object.hasOwn(columnThemes, theme) ||
    !Number.isInteger(sortOrder) ||
    sortOrder < 0 ||
    sortOrder > 1000
  )
    return { error: "请选择有效的风格，排序值需为 0–1000 的整数。" };
  if (
    (await getCategories()).some(
      (category) => category.name === name && category.slug !== slug,
    )
  ) {
    return { error: "这个专栏名称已经被使用。" };
  }
  const { data: existing, error: lookupError } = await supabase!
    .from("categories")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (lookupError) return { error: "专栏读取失败，请稍后再试。" };
  if (!editing && (existing || ["precision", "notes", "life"].includes(slug)))
    return { error: "这个链接标识已经被使用。" };
  const payload = {
    name,
    slug,
    description,
    accent: columnThemes[theme].accent,
    sort_order: sortOrder,
  };
  const { error } = existing
    ? await supabase!.from("categories").update(payload).eq("id", existing.id)
    : await supabase!.from("categories").insert(payload);
  if (error)
    return {
      error:
        error.code === "23505"
          ? "专栏名称或链接标识已被使用。"
          : "保存失败，请稍后重试。",
    };
  revalidatePath("/", "layout");
  return { success: "专栏已保存，风格会自动应用到专栏和文章页面。" };
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
