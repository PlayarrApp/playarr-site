# Playarr site

The public marketing and documentation site for **Playarr**: the self-hosted
server and its native clients. It also owns the clients hub (`/clients`,
`/clients/<id>`) and the legal pages (`/legal/*`), which are the single source
of truth for that content.

Astro with MDX, static output, no runtime.

## How it is served

This repository deploys the assets-only Cloudflare Worker `playarr-site`
(`wrangler.jsonc`). The Worker has no route, custom domain or `workers.dev`
address. The `playarr-web` Worker serves `playarr.app` and calls this Worker
through a service binding named `SITE`, forwarding:

`/` (signed-out visitors), `/docs`, `/docs/*`, `/legal`, `/legal/*`, `/features`,
`/faq`, `/apps`, `/integrations`, `/clients`, `/clients/*`, `/_site/*`,
`/sitemap-index.xml`, `/sitemap-*.xml` and `/robots.txt`.

Everything else on `playarr.app` (the web app, `/login`, `/downloads/*`,
`/vidaa-store/`) stays with `playarr-web`, so links to it are same-origin
(`/login`, `/downloads/...`). Build assets and public files live under
`/_site/` so nothing collides with the app's own root-level files.

Deployments run only from GitHub Actions (`.github/workflows/deploy.yml`) on
pushes to `main`, using the `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`
repository secrets. Never deploy by hand.

## Layout

```
├── src/
│   ├── pages/            Marketing pages, /clients/*, /legal/*
│   │   └── docs/         [...slug].astro renders the docs collection
│   ├── content/docs/     Installation and setup documentation (Markdown)
│   ├── components/       Shared UI primitives
│   ├── layouts/          BaseLayout (shell) and DocsLayout (sidebar)
│   ├── data/             Platform matrix (platforms.ts, the one source for
│   │                      client availability), hub copy, install commands
│   ├── styles/           Design tokens copied from the Playarr web client
│   └── consts.ts         Site strings, navigation, outbound links
├── public/_site/         Static files, served under /_site/
├── scripts/check-copy.mjs  Copy compliance linter, see below
└── wrangler.jsonc        Assets-only Worker configuration
```

## Local development

```sh
pnpm install
pnpm dev          # http://localhost:4321
pnpm build        # static output to dist/
pnpm check        # astro check + copy linter
```

The hub's `/downloads/*` links and the server release manifest
(`/downloads/server/latest.json`) are served by `playarr-web`, so they only
resolve on playarr.app, not under `pnpm dev`.

## The copy linter (read this before writing any page)

`scripts/check-copy.mjs` is not a style checker. It exists because
for a project of this shape **the exposure surface is the
marketing, not the code**: TickBox, Grokster and Filmspeler were each sunk
primarily by their own promotional conduct rather than by what their software
did.

It enforces three things:

| Severity | Meaning |
| --- | --- |
| `error` | Acquisition-adjacent or adult-content-adjacent language. Never permitted anywhere on the site. |
| `claim` | Capability that is not generally available. Permitted only alongside an explicit status qualifier in the same file. |
| `review` | Genuinely ambiguous wording. Reported for a human; does not fail the build. |

Run it with `pnpm lint:copy`, or `pnpm lint:copy:strict` to fail on review hits
too. It runs as part of `pnpm check`.

## Rules the content must follow

1. **Playarr plays media the operator already holds.** Nothing on this site
   describes acquiring, indexing, searching for or obtaining content.
2. **Never present planned work as shipped.** There is no 1.0 release and
   nothing is published to any app store on any platform. Anything unbuilt
   carries a visible label.
3. **This site is the authority on availability.** Status wording lives only in
   `src/data/platforms.ts`; the hub and the marketing pages both read it.
4. **Playarr has no filesystem scanner.** Its catalogue is built entirely
   from connected library-management applications. Do not describe those
   connections as optional extras.
5. **The permission model is only partly enforced.** Library grants,
   `can_stream` and `can_download` are live; rating ceilings, tag rules,
   session caps and time windows are modelled but not yet called on any
   request path. The site must not claim parental controls.
6. **British English**, and the required FFmpeg, TMDB and trademark notices
   stay in the footer and on `/legal/licences`.
