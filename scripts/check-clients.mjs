// Checks the clients manifest schema, the checked-in fallback and link resolution.
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { isManifest, resolve, groupByFamily } from '../src/data/variants.ts'

const fb = JSON.parse(readFileSync(new URL('../src/data/clients.fallback.json', import.meta.url), 'utf8'))
assert.ok(isManifest(fb), 'fallback matches the schema')
assert.equal(new Set(fb.variants.map((v) => v.id)).size, fb.variants.length, 'unique ids')
assert.ok(!isManifest({ ...fb, variants: [{ ...fb.variants[0], route: 'nope' }] }), 'bad route rejected')
assert.ok(!isManifest({ ...fb, variants: [{ ...fb.variants[0], asset: '../x' }] }), 'path in asset rejected')

const dl = resolve({ ...fb.variants[0], route: 'download', asset: 'a b.zip', store_url: null }, '1.2.3')
assert.equal(dl.href, 'https://github.com/PlayarrApp/playarr/releases/download/v1.2.3/a%20b.zip')
assert.equal(resolve({ ...fb.variants[0], route: 'store', store_url: null }, '1').shown, 'pending', 'no link means coming soon')
assert.equal(resolve({ ...fb.variants[0], route: 'store', store_url: 'javascript:x' }, '1').href, null, 'unsafe url dropped')
assert.equal(groupByFamily(fb).find(([f]) => f === 'Samsung TV')[1].length, 2, 'Samsung has two variants')
console.log('clients checks passed')
