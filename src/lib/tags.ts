const TAG_RE = /#([a-zA-ZÀ-ÿ\u00f1\u00d1\w-]+)/g;

export function parseTags(text: string): { display: string; tags: string[] } {
  const tags: string[] = [];
  const display = text
    .replace(TAG_RE, (_, tag) => {
      tags.push(tag.toLowerCase());
      return "";
    })
    .replace(/\s+/g, " ")
    .trim();
  return { display, tags };
}
