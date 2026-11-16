// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import { existsSync, readFileSync } from 'node:fs';
import { parseEnv } from 'node:util';

const ind = (slug) => `/industries/${slug}/`;
const to = (target, slugs) => Object.fromEntries(slugs.map((s) => [`/${s}`, target]));

// Pages removed in the 2026 restructure → closest new page (keeps old links and search results working)
const redirects = {
  // old industry pages → the seven sectors (or the overview)
  ...to(ind('engineering'), ['construction', 'architecture', 'mechanical']),
  ...to(ind('legal-compliance'), ['legal', 'environmental']),
  ...to(ind('taxation-finance'), ['accounting']),
  ...to(ind('manufacturing'), ['manufacturing', 'mining']),
  ...to(ind('supply-chain'), ['retail']),
  ...to('/industries/', ['healthcare-pharmaceuticals', 'oil-gas', 'restaurants-fb', 'hospitality', 'public-safety',
    'telecommunications-wireless', 'sports', 'public-administration', 'hardware-networking', 'airlines-aviation']),
  // non-recruitment services were discontinued → recruitment services
  ...to('/services/', ['recruitment-services', 'product-support', 'payroll-services', 'product-development', 'accounting-and-bookkeeping']),
  // renamed pages
  ...to('/hire-talent/', ['posting-clients-jobs-or-request-for-assistance']),
};

// https://astro.build/config
export default defineConfig({
  site: 'https://neoventrax.com',
  trailingSlash: 'always',
  redirects,
  // Pages are rendered by Astro's own Node server on each request, reading the Industries content
  // straight from the site database (src/lib/site-content.ts). Run: node dist/server/entry.mjs
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  build: { inlineStylesheets: 'auto' },
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  vite: {
    plugins: [{
      // production build only: bundle every dependency into dist/server so the server needs no node_modules.
      // (In `astro dev` this would push CommonJS packages like pg through Vite's ESM runner → "require is not defined".)
      name: 'nvx-bundle-deps-for-build',
      config: (_, { command }) => (command === 'build' ? { ssr: { noExternal: true, external: ['pg-native'] } } : undefined),
    }, {
      // `astro dev` only: put .env into process.env, where src/lib/site-content.ts reads SITE_DATABASE_URL at runtime
      // (Vite exposes .env only as import.meta.env). `npm run start` and PM2 provide the env themselves.
      name: 'nvx-dev-env',
      apply: 'serve',
      config() {
        // re-read on every dev restart (Astro restarts when .env changes) and overwrite old values
        if (existsSync('.env')) Object.assign(process.env, parseEnv(readFileSync('.env', 'utf8')));
      },
    }],
  },
});
