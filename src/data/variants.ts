import fallback from './clients.fallback.json' with { type: 'json' }

export type VariantRoute = 'download' | 'store' | 'testflight' | 'hosted' | 'web' | 'pending'

export interface Variant {
  id: string
  family: string
  name: string
  min_os: string
  route: VariantRoute
  asset: string | null
  store_url: string | null
  note: string
}

export interface ClientsManifest {
  version: string
  published_at: string
  variants: Variant[]
}

const RELEASES = 'https://github.com/PlayarrApp/playarr/releases'
const ROUTES = ['download', 'store', 'testflight', 'hosted', 'web', 'pending']

/** Trust boundary: the manifest comes from the network, so check its shape. */
export function isManifest(m: unknown): m is ClientsManifest {
  const x = m as ClientsManifest
  return (
    typeof x?.version === 'string' &&
    /^[0-9][0-9A-Za-z.+-]*$/.test(x.version) &&
    Array.isArray(x.variants) &&
    x.variants.length > 0 &&
    x.variants.every(
      (v) =>
        typeof v?.id === 'string' &&
        typeof v.family === 'string' &&
        typeof v.name === 'string' &&
        typeof v.min_os === 'string' &&
        ROUTES.includes(v.route) &&
        (v.asset === null || (typeof v.asset === 'string' && !v.asset.includes('/'))) &&
        (v.store_url === null || typeof v.store_url === 'string'),
    )
  )
}

/*
 * Build-time fetch. The site is static, so the scheduled deploy workflow
 * (hourly) rebuilds it and a new release shows within the hour. Any failure,
 * including a release without clients.json, falls back to the checked-in copy.
 */
export async function loadManifest(): Promise<ClientsManifest> {
  try {
    const res = await fetch(`${RELEASES}/latest/download/clients.json`, { signal: AbortSignal.timeout(10_000) })
    if (res.ok) {
      const json: unknown = await res.json()
      if (isManifest(json)) return json
    }
  } catch {
    // fall through to the checked-in copy
  }
  return fallback as ClientsManifest
}

export interface Resolved extends Variant {
  /** Route actually shown: a variant with no link target is "pending", never presented as available. */
  shown: VariantRoute
  href: string | null
}

const SAFE_URL = /^(https:\/\/|\/(?!\/))/

export function resolve(v: Variant, version: string): Resolved {
  const href =
    v.route === 'download' && v.asset
      ? `${RELEASES}/download/v${version}/${encodeURIComponent(v.asset)}`
      : v.store_url && SAFE_URL.test(v.store_url)
        ? v.store_url
        : null
  return { ...v, href, shown: v.route !== 'pending' && href ? v.route : 'pending' }
}

export function groupByFamily(m: ClientsManifest): [string, Resolved[]][] {
  const groups = new Map<string, Resolved[]>()
  for (const v of m.variants) {
    const list = groups.get(v.family) ?? []
    list.push(resolve(v, m.version))
    groups.set(v.family, list)
  }
  return [...groups]
}

export const ROUTE_LABEL: Record<VariantRoute, string> = {
  download: 'Download',
  store: 'Store',
  testflight: 'TestFlight',
  hosted: 'Hosted',
  web: 'Open',
  pending: 'Coming soon',
}

export const ROUTE_TONE = { download: 'ok', store: 'ok', testflight: 'neutral', hosted: 'neutral', web: 'ok', pending: 'warn' } as const
