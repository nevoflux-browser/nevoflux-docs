import type { MetadataRoute } from 'next';
import { source } from '@/lib/source';
import { i18n } from '@/lib/i18n';
import { docsUrl } from '@/lib/shared';

// Emitted as /sitemap.xml at build time (works with output: 'export').
// Lists every doc page in both locales, with hreflang alternates linking en<->zh.
export const revalidate = false;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = docsUrl;
  const entries: MetadataRoute.Sitemap = [];

  for (const lang of i18n.languages) {
    for (const page of source.getPages(lang)) {
      const slug = page.slugs.join('/');
      const rel = slug ? `/docs/${slug}` : `/docs`;

      entries.push({
        url: `${base}/${lang}${rel}`,
        changeFrequency: 'weekly',
        priority: slug ? 0.7 : 0.9,
        alternates: {
          languages: Object.fromEntries(
            i18n.languages.map((l) => [l, `${base}/${l}${rel}`]),
          ),
        },
      });
    }
  }

  return entries;
}
