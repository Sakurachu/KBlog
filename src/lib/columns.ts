import type { Category, Column, ColumnTheme } from "@/lib/types";

export const columnThemes: Record<
  ColumnTheme,
  { name: string; accent: string; cover: string; description: string }
> = {
  precision: {
    name: "精密 · 深绿",
    accent: "teal",
    cover: "/images/semiconductor-wafer.webp",
    description: "网格、清晰层次与技术图谱，适合专业知识。",
  },
  notebook: {
    name: "纸页 · 暖白",
    accent: "coral",
    cover: "/images/writing-desk.jpg",
    description: "暖色纸页与舒展的文字，适合随笔和长文。",
  },
  gallery: {
    name: "漫游 · 海蓝",
    accent: "yellow",
    cover: "/images/coast.jpg",
    description: "开阔的图片与轻松的留白，适合生活和摄影。",
  },
};

export const precisionSlugs = [
  "precision",
  "process-atlas",
  "alignment-basics",
  "advanced-packaging",
  "display-manufacturing",
  "technology",
];

export const defaultColumnCategories: Category[] = [
  {
    id: "10000000-0000-0000-0000-000000000004",
    slug: "precision",
    name: "精密制造",
    description: "从微米级装配到纳米级对准，把复杂的技术与工艺讲清楚。",
    accent: "teal",
    sort_order: 0,
  },
  {
    id: "10000000-0000-0000-0000-000000000001",
    slug: "notes",
    name: "随笔",
    description: "阅读留下的回声，日常冒出的念头，还有那些想慢慢说的话。",
    accent: "coral",
    sort_order: 1,
  },
  {
    id: "10000000-0000-0000-0000-000000000003",
    slug: "life",
    name: "生活记录",
    description: "走过的地方、看见的光影，以及平凡日子里的小小发现。",
    accent: "yellow",
    sort_order: 3,
  },
];

export function themeForAccent(accent: string): ColumnTheme {
  return accent === "teal"
    ? "precision"
    : accent === "yellow"
      ? "gallery"
      : "notebook";
}

export function buildColumns(categories: Category[]): Column[] {
  const merged = [
    ...defaultColumnCategories.map(
      (item) =>
        categories.find((category) => category.slug === item.slug) ?? item,
    ),
    ...categories.filter(
      (item) =>
        !precisionSlugs.includes(item.slug) &&
        !["notes", "life"].includes(item.slug),
    ),
  ];
  return merged
    .map((category) => {
      const theme = themeForAccent(category.accent);
      return {
        ...category,
        theme,
        cover: columnThemes[theme].cover,
        eyebrow:
          category.slug === "precision"
            ? "Kairos · Semi"
            : category.slug === "notes"
              ? "Between the lines"
              : category.slug === "life"
                ? "Out in the world"
                : "A personal collection",
        categorySlugs:
          category.slug === "precision" ? precisionSlugs : [category.slug],
      };
    })
    .sort((a, b) => (a.sort_order ?? 100) - (b.sort_order ?? 100));
}

export const defaultColumns = buildColumns(defaultColumnCategories);

export function columnForCategory(
  category: Category,
  columns: Column[] = defaultColumns,
): Column {
  return (
    columns.find((column) => column.categorySlugs.includes(category.slug)) ??
    buildColumns([category]).find((column) => column.slug === category.slug) ??
    defaultColumns[0]
  );
}

export function categoryUrl(
  category: Category,
  columns: Column[] = defaultColumns,
) {
  const column = columnForCategory(category, columns);
  return column.slug === category.slug
    ? `/columns/${column.slug}`
    : `/sections/${category.slug}`;
}
