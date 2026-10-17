// @ts-check
import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'

/*
 * The public marketing and documentation site for Playarr Server and the Playarr
 * clients. Static output only: every page is prerendered and served by the
 * assets-only `playarr-site` Cloudflare Worker (see wrangler.jsonc).
 *
 * The site is served from playarr.app: the `playarr-web` Worker forwards the
 * marketing routes here through a service binding. Build assets go under
 * /_site/ and public files under public/_site/, so nothing collides with the
 * web app's own root-level files.
 */
export default defineConfig({
  site: 'https://playarr.app',
  output: 'static',
  trailingSlash: 'never',
  build: { assets: '_site' },
  redirects: { '/docs': '/docs/install' },
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: false,
    },
  },
})
