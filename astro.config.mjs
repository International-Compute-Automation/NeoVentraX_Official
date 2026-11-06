// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

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
  integrations: [sitemap({ filter: (page) => !Object.keys(redirects).some((r) => page.endsWith(`${r}/`)) })],
  build: { inlineStylesheets: 'auto' },
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
});
