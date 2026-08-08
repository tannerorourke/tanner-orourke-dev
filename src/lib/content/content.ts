import { readFileSync } from 'node:fs';
import { join } from 'path';

import type { ProjectContent } from "@/lib/types/project";
import { home } from "@/content/home";
import chronos from "@/content/projects/chronos/content.json";
import fire from "@/content/projects/fire/content.json";
import firs from "@/content/projects/firs/content.json";
import nanous from "@/content/projects/nanous/content.json";
import facts from "@/content/projects/facts/content.json";
import negation from "@/content/projects/negation/content.json";
import { SectionTypes } from '@/components/ui/Section';
import { splitMarkdownSections } from '@/lib/markdown/sections';


// Resolve any section whose body is a `[!file](name.md)` by splitting the
// referenced file's '## ' headings into one section per heading.
function resolveProject(p: ProjectContent): ProjectContent {
  if (!p.sections) return p;
  const dir = join(process.cwd(), 'src/content/projects', p.pid);

  const sections = p.sections.flatMap((s): SectionTypes[] => {
    if (!(s?.body && s.body.startsWith("[!file]"))) return [s];

    const match = s.body.match(/^\[!file\]\((.+)\)$/);
    const fp = match?.[1];
    if (!fp)
      throw new Error(`Bad [!file] reference: "${s.body}"`);

    const file = readFileSync(join(dir, fp), 'utf-8');
    return splitMarkdownSections(file).map((section) => ({
      ...section,
      type: "block",
    }));
  });

  return { ...p, sections };
}



const projectList: ProjectContent[] = ([
  fire,
  facts,
  nanous,
  chronos,
  negation,
  firs,
] as unknown as ProjectContent[])
  .map(resolveProject)
  .filter((p) => p.live)
  .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

const projects: Record<string, ProjectContent> =
  Object.fromEntries(projectList.map((p) => [p.pid, p]));

const projectMeta = {
  num: projectList.length,
  pids: Object.fromEntries(
    projectList.map((p) => [
      p.pid,
      { title: p.title, subtitle: p.subtitle ?? "", eyebrow: p.eyebrow ?? "" },
    ]),
  ) as Record<string, { title: string; subtitle: string; eyebrow: string }>,
};

export const content = {
  home,
  projects,
  projectList,
  projectMeta,
};

export function getProjectContent(slug: string): ProjectContent | null {
  return content.projects[slug] ?? null;
}

export function getAllProjectSlugs(): string[] {
  return content.projectList.map((p) => p.pid);
}
