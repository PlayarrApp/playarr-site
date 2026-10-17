/*
 * Install commands shown on the clients hub pages. Download URLs are
 * same-origin: playarr-web serves /downloads/*, this site only links to them.
 */

export const SMART_TV_INSTALL = {
  webos: {
    appId: 'com.playarr.tv',
    downloadHref: '/downloads/webos/playarr-webos.ipk',
    officialGuideHref: 'https://webostv.developer.lge.com/develop/getting-started/developer-mode-app',
    sourceHref: 'https://github.com/ThomasMcFarlane/playarr/tree/main/clients/tv-web/apps/tv-webos',
    steps: [
      [],
      [
        'git clone https://github.com/ThomasMcFarlane/playarr.git',
        'cd playarr/clients/tv-web',
        'npm install -g pnpm@11.13.0',
        'pnpm install --frozen-lockfile',
        'npm install -g @webos-tools/cli',
        'pnpm --filter @playarr-tv/app-webos run package:ipk',
      ],
      [
        'ares-setup-device --add playarr-tv -i "host=<TV-IP>" -i "port=9922" -i "username=prisoner"',
        'ares-novacom --device playarr-tv --getkey',
        'ares-device --system-info --device playarr-tv',
      ],
      [
        'ares-install --device playarr-tv apps/tv-webos/out/com.playarr.tv_*_all.ipk',
        'ares-launch --device playarr-tv com.playarr.tv',
      ],
    ],
  },
  tizen: {
    appId: 'StrmarrTV1.Playarr Server',
    downloadHref: '/downloads/tizen/playarr-tizen.wgt',
    officialGuideHref: 'https://developer.samsung.com/smarttv/develop/getting-started/using-sdk/tv-device.html',
    sourceHref: 'https://github.com/ThomasMcFarlane/playarr/tree/main/clients/tv-web/apps/tv-tizen',
    steps: [
      [],
      [],
      [
        'git clone https://github.com/ThomasMcFarlane/playarr.git',
        'cd playarr/clients/tv-web',
        'npm install -g pnpm@11.13.0',
        'pnpm install --frozen-lockfile',
        'pnpm --filter @playarr-tv/app-tizen... run build',
        'tizen package -t wgt -s <certificate-profile> -- apps/tv-tizen/dist',
      ],
      [
        'sdb connect <TV-IP>',
        'sdb devices',
        'tizen list tv',
        'tizen install -n <generated-package>.wgt -t <target-name> -- apps/tv-tizen/dist',
        'tizen run -p StrmarrTV1.Playarr Server -t <target-name>',
      ],
    ],
  },
} as const

const SERVER_IMAGE = 'ghcr.io/thomasmcfarlane/playarr'

const SERVER_DOCKER_COMPOSE = `services:
  playarr:
    image: ${SERVER_IMAGE}:latest
    container_name: playarr
    restart: unless-stopped
    ports:
      - "8484:8484"
    environment:
      DATABASE_URL: sqlite:///data/playarr.db
      PLAYARR_JWT_SECRET: change-me-to-a-long-random-string
    volumes:
      - playarr-data:/data
volumes:
  playarr-data:`

export const SERVER_INSTALL_COMMANDS = {
  docker: [
    `docker pull ${SERVER_IMAGE}:latest`,
    `docker run -d --name playarr --restart unless-stopped -p 8484:8484 -v playarr-data:/data -e DATABASE_URL=sqlite:///data/playarr.db -e PLAYARR_JWT_SECRET="$(openssl rand -hex 32)" ${SERVER_IMAGE}:latest`,
    'curl http://localhost:8484/healthz',
  ],
  compose: [SERVER_DOCKER_COMPOSE, 'docker compose up -d'],
  systemd: [
    'tar -xzf playarr-server-linux-amd64.tar.gz',
    'cd playarr-server-*-linux-amd64',
    'sudo ./systemd/install.sh',
    'sudoedit /etc/playarr/playarr.env',
    'sudo systemctl enable --now playarr.service',
    'journalctl -u playarr.service -f',
  ],
  helm: [
    `# set image.repository to ${SERVER_IMAGE} and image.tag to a release version`,
    'helm template playarr infra/kubernetes/helm/playarr-standalone --values my-values.yaml',
  ],
  relay: [
    'PLAYARR_RELAY_REGISTER=true',
    'PLAYARR_ACME_CHALLENGE=relay-dns-01',
    'PLAYARR_ACME_DOMAIN=v4-<A>-<B>-<C>-<D>.relay.playarr.app',
    'PLAYARR_ACME_ACCEPT_TERMS=true',
  ],
} as const

export const SERVER_ARCHES = ['amd64', 'arm64'] as const
export const SERVER_FALLBACK_VERSION = '0.1.0'
/** Same-origin: playarr-web serves the release manifest. */
export const SERVER_RELEASE_MANIFEST = '/downloads/server/latest.json'
export const serverDownloadUrl = (arch: (typeof SERVER_ARCHES)[number]) =>
  `/downloads/server/playarr-server-linux-${arch}.tar.gz`
