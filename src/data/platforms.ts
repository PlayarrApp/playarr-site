import copy from './clients-copy.json'

/** Matches the tones accepted by the Pill component. */
export type Tone = 'ok' | 'warn' | 'neutral'

/*
 * The single platform data source. This site is the authority on client
 * availability: the clients hub (/clients, /clients/<id>) and the marketing
 * pages (/apps, /docs/clients) both read from here, and must never present a
 * platform as more available than it is. Nothing is on any app store, and
 * several routes are developer-mode sideloads. See docs/roadmap.md in the
 * Playarr repository for the underlying status.
 */

export type ClientStatus = 'available' | 'experimental' | 'soon'
export type ClientIconId =
  | 'vidaa'
  | 'android'
  | 'apple'
  | 'webos'
  | 'tizen'
  | 'roku'
  | 'chromecast'
  | 'xbox'
  | 'harmony'
  | 'firetv'
  | 'server'

const COPY = copy as Record<string, string>

/** English hub copy by key (the `pages.clients.*` strings, minus the prefix). */
export function clientCopy(key: string, vars: Record<string, string> = {}): string {
  const text = COPY[key]
  if (text === undefined) throw new Error(`Missing clients copy key: ${key}`)
  return text.replace(/\{\{(\w+)\}\}/g, (_, name: string) => vars[name] ?? '')
}

export const STATUS_TONE: Record<ClientStatus, Tone> = {
  available: 'ok',
  experimental: 'neutral',
  soon: 'warn',
}

export const statusLabel = (status: ClientStatus) => clientCopy(`status.${status}`)

export interface HubClient {
  id: ClientIconId
  status: ClientStatus
  /** Same-origin download served by playarr-web, when one exists. */
  downloadPath?: string
  /** Copy key for the long description, when the hub has one. */
  descriptionKey?: string
  /** Short, share-friendly copy for the per-client page meta description. */
  social: string
}

/** Hub order is the display order. */
export const HUB_CLIENTS: readonly HubClient[] = [
  { id: 'vidaa', status: 'experimental', social: 'Install the Playarr launcher on compatible Hisense VIDAA smart TVs.' },
  { id: 'android', status: 'available', social: 'Watch Playarr on Android phones, tablets and Android TV.' },
  { id: 'apple', status: 'soon', descriptionKey: 'ios.description', social: 'A native Playarr app for iPhone, iPad and Apple TV is coming soon.' },
  { id: 'webos', status: 'experimental', descriptionKey: 'webos.description', social: 'The complete Playarr TV experience on LG smart TVs.' },
  { id: 'tizen', status: 'experimental', descriptionKey: 'tizen.description', social: 'The complete Playarr TV experience on Samsung smart TVs.' },
  { id: 'roku', status: 'experimental', downloadPath: '/downloads/roku/playarr-roku.zip', descriptionKey: 'roku.description', social: 'Sideload the Playarr channel on Roku televisions.' },
  { id: 'chromecast', status: 'soon', descriptionKey: 'chromecast.description', social: 'Casting Playarr to Chromecast built-in devices is coming soon.' },
  { id: 'xbox', status: 'soon', descriptionKey: 'xbox.description', social: 'A native Playarr client for Xbox Series X|S and Xbox One is coming soon.' },
  { id: 'harmony', status: 'soon', descriptionKey: 'harmony.description', social: 'A native Playarr client for HarmonyOS is coming soon.' },
  { id: 'firetv', status: 'soon', descriptionKey: 'firetv.description', social: 'A native Playarr client for Amazon Fire TV is coming soon.' },
  // Not a playback client: the server every client connects to.
  { id: 'server', status: 'experimental', descriptionKey: 'server.description', social: 'Download and install Playarr Server for Linux, Docker and Kubernetes.' },
]

export interface Platform {
  id: string
  name: string
  devices: string
  status: string
  tone: Tone
  /** What a person actually does today to get it running. */
  route: string
  /** Where this platform's install page lives on the clients hub (same origin). */
  href: string
}

const PLATFORM_ROWS: readonly (Omit<Platform, 'status' | 'tone'> & Partial<Pick<Platform, 'status' | 'tone'>>)[] = [
  {
    id: 'web',
    name: 'Web',
    devices: 'Any modern browser',
    status: 'Available',
    tone: 'ok',
    route: 'Open playarr.app and point it at your server. Nothing to install.',
    href: '/login',
  },
  {
    id: 'android',
    name: 'Android',
    devices: 'Phones, tablets, Android TV, Google TV',
    route: 'One signed universal package, installed directly from the clients hub.',
    href: '/clients/android',
  },
  {
    id: 'vidaa',
    name: 'Hisense VIDAA',
    devices: 'VIDAA televisions',
    route: 'Open the web app in the television browser. A launcher tile is experimental.',
    href: '/clients/vidaa',
  },
  {
    id: 'roku',
    name: 'Roku',
    devices: 'Roku players and Roku TV',
    route: 'Enable Developer Mode and side-load the package from the clients hub.',
    href: '/clients/roku',
  },
  {
    id: 'webos',
    name: 'LG webOS',
    devices: 'LG televisions',
    route: 'Build from source, then install with LG Developer Mode and ares-install.',
    href: '/clients/webos',
  },
  {
    id: 'tizen',
    name: 'Samsung Tizen',
    devices: 'Samsung televisions',
    route: 'Build and sign from source with Tizen Studio, then install over sdb.',
    href: '/clients/tizen',
  },
  {
    id: 'apple',
    name: 'Apple',
    devices: 'iPhone, iPad, Apple TV',
    route: 'Native SwiftUI apps exist in the repository; there is no installable build yet.',
    href: '/clients/apple',
  },
  {
    id: 'harmony',
    name: 'HarmonyOS',
    devices: 'Huawei phones, tablets, Vision TVs',
    route: 'A native ArkTS client is in development; there is no installable build yet.',
    href: '/clients/harmony',
  },
]

/** Marketing summary of each platform; status and tone come from HUB_CLIENTS so they cannot drift. */
export const PLATFORMS: readonly Platform[] = PLATFORM_ROWS.map((row) => {
  const hub = HUB_CLIENTS.find((client) => client.id === row.id)
  if (!hub) return { ...row, status: row.status ?? 'Available', tone: row.tone ?? 'ok' }
  return { ...row, status: statusLabel(hub.status), tone: STATUS_TONE[hub.status] }
})
