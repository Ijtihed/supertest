"use client";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function attrEscape(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function processInline(s: string): string {
  const escaped = escapeHtml(s);
  const linkHtml: string[] = [];
  const withPh = escaped.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    (_m, text: string, url: string) => {
      const rawUrl = url
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">");
      const trimmed = rawUrl.trim();
      const href = /^https?:\/\//i.test(trimmed) ? trimmed : "#";
      const i = linkHtml.length;
      linkHtml.push(
        `<a href="${attrEscape(href)}" class="text-primary underline underline-offset-2" target="_blank" rel="noopener noreferrer">${text}</a>`,
      );
      return `\0LINK${i}\0`;
    },
  );
  let out = withPh.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/\*([^*]+?)\*/g, "<em>$1</em>");
  linkHtml.forEach((html, i) => {
    out = out.split(`\0LINK${i}\0`).join(html);
  });
  return out;
}

function simpleMarkdownToHtml(content: string): string {
  const lines = content.split("\n");
  const blocks: string[] = [];
  let i = 0;
  while (i < lines.length) {
    if (lines[i].startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(`<li>${processInline(lines[i].slice(2))}</li>`);
        i++;
      }
      blocks.push(
        `<ul class="list-disc pl-6 my-2 space-y-1">${items.join("")}</ul>`,
      );
    } else {
      const paraLines: string[] = [];
      while (i < lines.length && !lines[i].startsWith("- ")) {
        paraLines.push(processInline(lines[i]));
        i++;
      }
      blocks.push(paraLines.join("<br />"));
    }
  }
  return blocks.join("");
}

export function SimpleMarkdown({ content }: { content: string }) {
  const html = simpleMarkdownToHtml(content);
  return (
    <div
      className="font-body text-secondary leading-relaxed max-w-2xl text-lg [&_ul]:font-body [&_ul]:my-2"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
