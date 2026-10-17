/**
 * Single source of truth for site-wide strings, navigation and outbound links.
 *
 * Copy on this site is legally load-bearing: promotional conduct, not source
 * code, is what sank comparable projects. Playarr is described here strictly as a playback, library and
 * metadata layer over media the operator already holds. Nothing on this site
 * describes acquiring, indexing or searching for content.
 */

export const SITE = {
  name: 'Playarr',
  clientName: 'Playarr',
  tagline: 'Your library. Every screen.',
  description:
    'Playarr is a self-hosted media server that turns the library you already own into a polished viewing experience, with native Playarr apps for phones, tablets, televisions and the browser.',
  locale: 'en-GB',
} as const

/** Outbound destinations. The hosted Playarr Web App is the primary call to action. */
export const LINKS = {
  /** The hosted Playarr Web App sign-in, same origin: playarr.app serves this site and the app. */
  playarrApp: '/login',
  /** Clients hub, served by this site. */
  playarrClients: '/clients',
  repo: 'https://github.com/PlayarrApp/playarr',
  issues: 'https://github.com/PlayarrApp/playarr/issues',
  licence: 'https://github.com/PlayarrApp/playarr/blob/main/LICENSE',
} as const

export const NAV: ReadonlyArray<{ href: string; label: string }> = [
  { href: '/features', label: 'Features' },
  { href: '/apps', label: 'Apps' },
  { href: '/integrations', label: 'Integrations' },
  { href: '/docs/install', label: 'Install' },
  { href: '/faq', label: 'FAQ' },
]

export const FOOTER_GROUPS: ReadonlyArray<{
  title: string
  links: ReadonlyArray<{ href: string; label: string; external?: boolean }>
}> = [
  {
    title: 'Product',
    links: [
      { href: '/features', label: 'Features' },
      { href: '/apps', label: 'Apps' },
      { href: '/integrations', label: 'Integrations' },
      { href: '/faq', label: 'FAQ' },
    ],
  },
  {
    title: 'Install',
    links: [
      { href: '/docs/install', label: 'Choose a setup' },
      { href: '/docs/install/single-server', label: 'Single server' },
      { href: '/docs/install/docker-compose', label: 'Docker Compose' },
      { href: '/docs/install/kubernetes', label: 'Kubernetes' },
      { href: '/docs/first-run', label: 'First run' },
    ],
  },
  {
    title: 'Playarr',
    links: [
      { href: LINKS.playarrApp, label: 'Open the web app' },
      { href: LINKS.playarrClients, label: 'All clients' },
      { href: '/docs/clients', label: 'Client setup' },
    ],
  },
  {
    title: 'Project',
    links: [
      { href: LINKS.repo, label: 'Source', external: true },
      { href: LINKS.issues, label: 'Issues', external: true },
      { href: '/legal/licences', label: 'Licences & attribution' },
      { href: '/legal/acceptable-use', label: 'Acceptable use' },
      { href: '/legal', label: 'Legal' },
      { href: '/legal/privacy', label: 'Privacy' },
      { href: '/legal/terms', label: 'Terms' },
      { href: '/legal/account-deletion', label: 'Account deletion' },
    ],
  },
]
