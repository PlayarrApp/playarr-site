#!/usr/bin/env node
/**
 * Fails when the production dependencies in package.json and the
 * "This website" list on the licences page disagree. Each listed package is an
 * <li data-pkg="name"> in src/pages/legal/licences.astro.
 *
 * Scope: this repo's direct production dependencies only. The Rust, Android,
 * iOS and web-app lists on the page come from another repository and are not
 * checked here.
 *
 * shortcut: direct dependencies only, not transitive; upgrade if the page ever
 * claims to list the full tree.
 */

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import assert from 'node:assert/strict'

/** Returns { missing, stale } as sorted arrays. */
export function diff(deps, listed) {
  const d = new Set(deps)
  const l = new Set(listed)
  return {
    missing: [...d].filter((x) => !l.has(x)).sort(),
    stale: [...l].filter((x) => !d.has(x)).sort(),
  }
}

export function listedPackages(source) {
  return [...source.matchAll(/data-pkg="([^"]+)"/g)].map((m) => m[1])
}

function selfTest() {
  assert.deepEqual(listedPackages('<li data-pkg="a">A</li><li data-pkg="@b/c">'), ['a', '@b/c'])
  assert.deepEqual(diff(['a', 'b'], ['a', 'b']), { missing: [], stale: [] })
  assert.deepEqual(diff(['a', 'b'], ['a', 'z']), { missing: ['b'], stale: ['z'] })
}

selfTest()

const root = new URL('..', import.meta.url)
const pkg = JSON.parse(readFileSync(new URL('package.json', root), 'utf8'))
const page = readFileSync(fileURLToPath(new URL('src/pages/legal/licences.astro', root)), 'utf8')
const { missing, stale } = diff(Object.keys(pkg.dependencies ?? {}), listedPackages(page))

for (const m of missing) console.error(`missing from licences page: ${m}`)
for (const s of stale) console.error(`listed but not a production dependency: ${s}`)
if (missing.length || stale.length) process.exit(1)
console.log('licences page matches package.json production dependencies')
