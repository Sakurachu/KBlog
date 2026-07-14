export function formatDate(date: string | null) {
  if (!date) return "尚未发布";

  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function makeSlug(value: string) {
  const ascii = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return ascii || `post-${Date.now()}`;
}

export function readingTime(content: string) {
  const latinWords = content.match(/[a-zA-Z0-9]+/g)?.length ?? 0;
  const chineseCharacters = content.match(/[\u4e00-\u9fa5]/g)?.length ?? 0;
  return Math.max(1, Math.ceil((latinWords + chineseCharacters / 2) / 220));
}
