import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { i18n } from '@/lib/i18n';
import { uiTranslations } from 'fumadocs-ui/i18n';
import { zhCN } from '@fumadocs/language/zh-cn';
import { appName, githubUrl, siteUrl } from '@/lib/shared';
import { Logo } from '@/components/logo';

// UI string translations for Fumadocs' own components (search box, TOC, etc.).
export const translations = i18n
  .translations()
  .extend(uiTranslations())
  .preset('zh', zhCN())
  .add('ui', {
    zh: {
      displayName: '简体中文',
    },
  });

/**
 * Shared layout options (nav title, links, github), localized.
 * See https://fumadocs.dev/docs/ui/layouts/shared
 */
export function baseOptions(locale: string): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <Logo className="size-6" />
          {appName}
        </>
      ),
      // Logo / title links back to the main marketing site, not the docs home.
      url: siteUrl,
    },
    githubUrl,
    links: [
      {
        text: locale === 'zh' ? '文档' : 'Documentation',
        url: `/${locale}/docs`,
        active: 'nested-url',
      },
    ],
  };
}
