import type { APIRoute } from 'astro';
import { GENERAL_PAGES } from '../lib/content';
import { industryHref } from '../data/industries';

/** Fixed pages of the site (src/pages); general content pages and live sectors are added below. */
const FIXED = ['/', '/about-company/', '/services/', '/industries/', '/our-process/', '/success-stories/', '/insights/', '/contact-us/', '/hire-talent/', '/submit-your-resume/'];

/**
 * Sitemap for search engines, generated on each request so it always lists the sectors that are
 * currently published in the CMS. (Kept at the address the old sitemap integration used.)
 */
export const GET: APIRoute = ({ locals, site }) => {
  const paths = [...FIXED, ...GENERAL_PAGES.map((g) => `/${g.slug}/`), ...locals.site.industries.map((i) => industryHref(i.slug))];
  const base = (site?.href ?? 'https://neoventrax.com/').replace(/\/$/, '');
  const urls = [...new Set(paths)].sort().map((p) => `<url><loc>${base}${p}</loc></url>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=300' },
  });
};
