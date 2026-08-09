export function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/[^\w]+/g, '-');
}

export type MarkdownHeadingSection = {
  id: string;
  title: string;
  body: string;
  accent?: "copper";
};

// -- One trailing `[!key](value)` annotation, anchored to the end of the heading.
const ANNOTATION = /\s*\[!(\w+)\]\(([^)]*)\)$/;

// Peels every trailing annotation off a heading, right to left, leaving the
// display title. Order between annotations does not matter.
function parseHeading(raw: string): { title: string; attrs: Record<string, string> } {
  const attrs: Record<string, string> = {};
  let title = raw.trim();

  for (let m = title.match(ANNOTATION); m; m = title.match(ANNOTATION)) {
    attrs[m[1]] = m[2].trim();
    title = title.replace(ANNOTATION, '').trim();
  }

  return { title, attrs };
}

// Splits a markdown document on '## ' headings, one section per heading.
// A heading carries its non-body section fields as trailing annotations:
// `[!id](custom-slug)` pins the anchor id, which otherwise slugifies from the
// heading text, and `[!accent](copper)` accents the section title. Content
// before the first heading (e.g. a leading '# Title') is dropped.
export function splitMarkdownSections(markdown: string): MarkdownHeadingSection[] {
  const sections: MarkdownHeadingSection[] = [];

  for (const line of markdown.split('\n')) {
    const heading = line.match(/^##\s+(.+)/);
    if (heading) {
      const { title, attrs } = parseHeading(heading[1]);
      if (attrs.accent && attrs.accent !== "copper")
        throw new Error(`Unknown section accent "${attrs.accent}" on heading "${title}"`);
      const accent = attrs.accent as MarkdownHeadingSection["accent"];

      sections.push({
        id: attrs.id ?? slugify(title),
        title,
        body: '',
        ...(accent && { accent }),
      });
    } else if (sections.length) {
      const last = sections[sections.length - 1];
      last.body += (last.body ? '\n' : '') + line;
    }
  }

  return sections.map((s) => ({ ...s, body: s.body.trim() }));
}
