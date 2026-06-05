# nevoflux-docs

Documentation site for **NevoFlux** (the AI-native browser), served at
**docs.nevoflux.app**.

Built with [Next.js](https://nextjs.org) + [Fumadocs](https://fumadocs.dev)
(MDX), configured as a **static export**. The structure follows
[`zen-browser/docs`](https://github.com/zen-browser/docs); the visual style
(palette, Bricolage Grotesque font, dark mode) matches
[`nevoflux-www`](../nevoflux-www).

## Commands

Uses **bun**.

```bash
bun install        # install dependencies
bun run dev        # dev server at http://localhost:3001
bun run build      # static export to out/ (+ writes out/index.html redirect)
bun run start      # serve the built out/ locally
bun run typecheck  # fumadocs-mdx + next typegen + tsc --noEmit
bun run lint       # eslint
```

## How it works

- **Content** lives in `content/docs/**` as MDX. English files are `*.mdx`;
  Simplified Chinese files use the `*.zh.mdx` suffix. Navigation/order is set in
  `meta.json` (and `meta.zh.json`) per folder.
- **i18n** — English (default) and Simplified Chinese, both URL-prefixed
  (`/en`, `/zh`). Configured in `src/lib/i18n.ts`. Because static export cannot
  run middleware, the root `/` redirect to `/en/` is produced at build time by
  `scripts/static-root-redirect.mjs`.
- **Styling** — `src/app/global.css` imports the Fumadocs Tailwind v4 preset and
  overrides its `--color-fd-*` design tokens with the NevoFlux teal/cyan palette,
  matching `nevoflux-www/src/styles/global.css`. The Bricolage Grotesque font is
  self-hosted via `@fontsource` (no Google Fonts request at build).
- **Search** — Fumadocs static (client-side) search. The build-time index is
  produced by `src/app/api/search/route.ts` (`staticGET`); Chinese uses the
  Orama Mandarin tokenizer.

## Project layout

| Path                                | Description                                  |
| ----------------------------------- | -------------------------------------------- |
| `content/docs/`                     | MDX documentation content (en + `.zh`)       |
| `src/app/[lang]/(home)/`            | Localized landing page                       |
| `src/app/[lang]/docs/`             | Docs layout + `[[...slug]]` page renderer    |
| `src/app/api/search/route.ts`       | Static search index                          |
| `src/lib/i18n.ts`                   | Locale config                                |
| `src/lib/source.ts`                 | Fumadocs content source loader               |
| `src/lib/layout.shared.tsx`         | Shared nav/links + UI translations           |
| `src/app/global.css`                | Theme tokens + font (the NevoFlux re-skin)   |

## Deployment (Cloudflare Pages)

`bun run build` produces a fully static site in `out/`. It deploys to
**Cloudflare Pages** at `docs.nevoflux.app` — there is no server/OpenNext step.

**Git integration (recommended).** In the Pages project settings:

| Setting                 | Value           |
| ----------------------- | --------------- |
| Build command           | `bun run build` |
| Build output directory  | `out`           |
| Framework preset        | None            |

`wrangler.jsonc` declares `pages_build_output_dir: "./out"` so the output dir is
also picked up automatically.

**CLI deploy (optional).** `bun run deploy` runs the build then
`wrangler pages deploy`. `bun run preview:cf` serves the built output locally via
`wrangler pages dev`.

> Note: this is a **static** site, so do **not** use the Next.js / OpenNext
> (`opennextjs-cloudflare`) preset — it expects a server build and will fail.
