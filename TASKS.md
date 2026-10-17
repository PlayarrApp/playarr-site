# Tasks

Live task board for the Playarr marketing site. This repository is public: no environment data (host names, addresses, registries, node names) in any row.

## 3. Go live on playarr.app
ETA: 2026-10-18 18:00 ICT

| ID | Task | Status | Owner | Branch | Depends | ETA | Notes |
|---|---|---|---|---|---|---|---|
| 5 | Serve this Worker on playarr.app: the `playarr-web` Worker forwards signed-out `/`, `/docs`, `/legal`, `/clients`, `/features`, `/faq`, `/apps`, `/integrations`, `/_site/*`, sitemaps and `robots.txt` here through its `SITE` service binding | done | | | | | Live after PlayarrApp/playarr PR [#53](https://github.com/PlayarrApp/playarr/pull/53) merged (94f7d62a) and playarr-web deployed main ec07873d. Includes trailing-slash forms in `run_worker_first`. |
| 6 | Verify on playarr.app once live: signed-out `/` shows this site, signed-in `/` (cookie `playarr_signed_in=1`) shows the app, every marketing route returns 200, `/features/` redirects to `/features`, unknown paths return 404 | done | | | 3.5 | Checked 2026-10-17: signed-out `/` shows this site; signed-in `/` shows the app; `/docs`, `/legal`, `/legal/terms`, `/legal/privacy`, `/clients`, `/features`, `/faq`, `/apps`, `/integrations`, `/sitemap-index.xml`, `/sitemap-0.xml`, `/robots.txt` return 200; `/features/` returns 307 to `/features`. 404s are checked only under this site's own prefixes (`/docs/x`, `/legal/x`, `/_site/x` return 404). Unknown top-level paths are app-owned: the web app returns its SPA shell (200) and shows its own not-found screen, as confirmed by the Playarr routing owner. `/sitemap.xml` is unpublished on purpose; `robots.txt` points to `/sitemap-index.xml`. |

## 2. Legal pages and copy (Playarr epic 60, site part)
ETA: 2026-10-17 16:05 ICT

| ID | Task | Status | Owner | Branch | Depends | ETA | Notes |
|---|---|---|---|---|---|---|---|
| 3 | Acceptable use, privacy, terms, licences, contact and library-manager wording made accurate against the code | done | | legal/epic-60 | | | Merged as a6d5e55 ([#1](https://github.com/PlayarrApp/playarr-site/pull/1)), deployed by Actions (version ed335897). Requests described per the "Where requests go" admin setting (default Direct to the operator's Radarr or Sonarr); privacy names Firebase Cloud Messaging, Play In-App Updates, Google Cast (Android and web), the Hugging Face model download and TMDB artwork; terms with no governing-law clause; support@playarr.app as the rights-holder contact with complaint guidance; "*arr stack" framing removed; licence names checked against package metadata; TMDB logo and notices. Reviewed twice against the code. |
| 4 | Licences page: keep the third-party list current when dependencies change | todo | | | | | Owner decision 2026-10-17: no DCO and no CLA. |

## 1. Standalone marketing site
ETA: 2026-10-17 15:40 ICT

| ID | Task | Status | Owner | Branch | Depends | ETA | Notes |
|---|---|---|---|---|---|---|---|
| 1 | Fresh public repository with the marketing site, legal pages, docs and the `/clients` hub | done | | | | | Single initial commit 8e28a79; delete_branch_on_merge on. |
| 2 | Deploy as the assets-only `playarr-site` Worker through GitHub Actions on hosted runners only, gated to `main` by the `production` environment | done | | | | | Deploy run [39017982042](https://github.com/PlayarrApp/playarr-site/actions/runs/39017982042); no public route by design (`workers_dev` false, `drop-trailing-slash`). |
