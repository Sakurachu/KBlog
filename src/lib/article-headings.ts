export type ArticleHeading = { id: string; text: string; depth: number };

export function getArticleHeadings(content: string): ArticleHeading[] {
  const lines = content.split(/\r?\n/);
  const headings: ArticleHeading[] = [];
  let fence: { character: string; length: number } | null = null;
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    const marker = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
    if (marker) {
      if (!fence) fence = { character: marker[1][0], length: marker[1].length };
      else if (
        marker[1][0] === fence.character &&
        marker[1].length >= fence.length &&
        !marker[2].trim()
      )
        fence = null;
      continue;
    }
    if (fence) continue;
    const atx = line.match(/^ {0,3}(#{1,3})\s+(.+?)(?:\s+#+)?\s*$/);
    const setext = lines[index + 1]?.match(/^ {0,3}(=+|-+)\s*$/);
    if (!atx && (!setext || !line.trim() || /^\s{4}|^\s*[>#*-]/.test(line)))
      continue;
    const text = (atx?.[2] ?? line.trim())
      .replace(/!?\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/[*_~`]/g, "");
    headings.push({
      id: `section-${index + 1}`,
      text,
      depth: atx ? atx[1].length : setext![1][0] === "=" ? 1 : 2,
    });
    if (!atx) index++;
  }
  return headings;
}
