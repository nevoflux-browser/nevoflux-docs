import '@fontsource/bricolage-grotesque/400.css';
import '@fontsource/bricolage-grotesque/500.css';
import '@fontsource/bricolage-grotesque/600.css';
import '@fontsource/bricolage-grotesque/700.css';
import '../global.css';

import type { Metadata } from 'next';
import { Provider } from '@/components/provider';
import { i18nProvider } from 'fumadocs-ui/i18n';
import { translations } from '@/lib/layout.shared';
import { i18n } from '@/lib/i18n';
import { appName, siteDescription, docsUrl } from '@/lib/shared';

const KEYWORDS = [
  'NevoFlux',
  'AI browser',
  'AI-native browser',
  'browser agent',
  'AI agent',
  'browser automation',
  'GBrain',
  'knowledge base',
  'Canvas',
  'MCP',
  'Model Context Protocol',
];

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<'/[lang]'>): Promise<Metadata> {
  const { lang } = await params;
  const isZh = lang === 'zh';
  const siteName = isZh ? `${appName} 文档` : `${appName} Docs`;
  const description = isZh
    ? 'NevoFlux 是一款 AI 原生浏览器。官方文档:安装、配置、技能、Canvas 与 GBrain 知识库。'
    : siteDescription;
  const url = `${docsUrl}/${lang}/docs`;

  return {
    metadataBase: new URL(docsUrl),
    title: { default: siteName, template: `%s — ${siteName}` },
    description,
    applicationName: siteName,
    keywords: KEYWORDS,
    authors: [{ name: appName, url: 'https://nevoflux.app' }],
    creator: appName,
    publisher: appName,
    robots: { index: true, follow: true },
    icons: { icon: '/favicon.svg' },
    alternates: {
      canonical: url,
      languages: {
        en: `${docsUrl}/en/docs`,
        zh: `${docsUrl}/zh/docs`,
        'x-default': `${docsUrl}/en/docs`,
      },
    },
    openGraph: {
      type: 'website',
      siteName,
      title: siteName,
      description,
      url,
      locale: isZh ? 'zh_CN' : 'en_US',
      alternateLocale: isZh ? 'en_US' : 'zh_CN',
      images: ['/logo256.png'],
    },
    twitter: {
      card: 'summary',
      title: siteName,
      description,
      images: ['/logo256.png'],
    },
  };
}

export default async function Layout({ params, children }: LayoutProps<'/[lang]'>) {
  const { lang } = await params;

  return (
    <html lang={lang} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <Provider i18n={i18nProvider(translations, lang)}>{children}</Provider>
      </body>
    </html>
  );
}
