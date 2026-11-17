/**
 * '/sitemap.xml': the home page and every live project page, the site's only indexable routes.
 * '/about', '/work' and '/contact' redirect to the home page and stay out. Built by 'npm run build'.
 */
import type { MetadataRoute } from 'next';
import { content } from '@/lib/content/content';

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000');

export default function sitemap(): MetadataRoute.Sitemap {
  const home: MetadataRoute.Sitemap[number] = {
    url: BASE_URL, changeFrequency: 'yearly', priority: 1.0,
  };

  // -- lastmod is the write-up's own date; a build time on every entry teaches crawlers to ignore it
  const projectRoutes: MetadataRoute.Sitemap = content.projectList.map(({ pid, publishedAt, updatedAt }) => ({
    url: `${BASE_URL}/${pid}`,
    lastModified: updatedAt ?? publishedAt,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [home, ...projectRoutes];
}
