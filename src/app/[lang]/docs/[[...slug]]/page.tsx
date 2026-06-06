import { source } from '@/lib/source';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/components/mdx';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { appName } from '@/lib/shared';
import type { Metadata } from 'next';

export default async function Page(props: PageProps<'/[lang]/docs/[[...slug]]'>) {
  const params = await props.params;
  const page = source.getPage(params.slug, params.lang);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            // allows linking to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(
  props: PageProps<'/[lang]/docs/[[...slug]]'>,
): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug, params.lang);
  if (!page) notFound();

  const slug = (params.slug ?? []).join('/');
  const pathFor = (lang: string) => (slug ? `/${lang}/docs/${slug}` : `/${lang}/docs`);
  const url = pathFor(params.lang);

  return {
    title: page.data.title,
    description: page.data.description,
    alternates: {
      canonical: url,
      languages: {
        en: pathFor('en'),
        zh: pathFor('zh'),
        'x-default': pathFor('en'),
      },
    },
    openGraph: {
      type: 'article',
      siteName: params.lang === 'zh' ? `${appName} 文档` : `${appName} Docs`,
      locale: params.lang === 'zh' ? 'zh_CN' : 'en_US',
      title: page.data.title,
      description: page.data.description,
      url,
      images: ['/logo256.png'],
    },
    twitter: {
      card: 'summary',
      title: page.data.title,
      description: page.data.description,
    },
  };
}
