import type { Industry } from './industries';

/**
 * Wording of the /industries/ page and of every sector page.
 * Source of truth: the "Industries Page" single type in the Strapi CMS (separate NeoVentraX-CMS project),
 * read live from the site database (src/lib/site-content.ts). The defaults below are used when no site
 * database is configured, and for any field left empty in the CMS.
 * In sector texts, {sector} is replaced with the sector name.
 */
export const pageDefaults = {
  seoTitle: 'Industries',
  seoDescription:
    'Specialized Non-IT recruitment across seven sectors: engineering, legal & compliance, taxation & finance, manufacturing, supply chain, human resources and executive search.',
  heroTitle: 'Industries We Serve',
  heroLead: 'Talent solutions across key Non-IT sectors in the United States.',
  heroImage: '/uploads/2025-09-Manufacturing-min-scaled.webp',
  listingCtaTitle: 'Ready to build a stronger team?',
  listingCtaText: 'Tell us about the roles you need to fill — or the role you want next. We’ll take it from there.',
  notSureLabel: 'Not sure?',
  notSureText: 'Tell us about your role and we’ll match you with the right sector specialist.',
  notSureButton: 'Start a Search',
  expertiseHeading: 'Our Expertise',
  hireButton: 'Hire {sector} talent',
  resumeLink: 'Looking for a role? Submit your resume',
  rolesHeading: 'Roles We Recruit For',
  positionsLabel: 'positions',
  moreText: 'And more —',
  moreLinkText: 'tell us about your role',
  featuredEyebrow: 'Featured roles',
  featuredHeading: 'In-demand {sector} positions',
  featuredLead: 'Interested in one of these positions? Apply with your resume and we’ll match you with suitable openings.',
  otherSectorsHeading: 'Other sectors we serve',
  sectorCtaTitle: 'Hiring in {sector}?',
  sectorCtaText: 'Tell us about the role — we’ll research the market and bring you qualified, screened candidates.',
};
export type IndustriesPage = typeof pageDefaults;

/** CMS values over the defaults; empty CMS fields keep the default. */
export function withPageDefaults(fromCms: Record<string, unknown> = {}): IndustriesPage {
  const filled = Object.fromEntries(Object.entries(fromCms).filter(([k, v]) => k in pageDefaults && typeof v === 'string' && v.trim() !== ''));
  return { ...pageDefaults, ...filled };
}

/** Replace {sector} in a template text. */
export const withSector = (text: string, sector: string) => text.replaceAll('{sector}', sector);

/** Page title, hero lead and SEO description of a sector page (CMS values, or defaults derived from the sector). */
export function sectorPage(ind: Industry) {
  return {
    title: ind.pageTitle || (ind.slug === 'executive-search' ? 'Executive Search' : `${ind.title} Recruitment`),
    lead: ind.heroLead || ind.intro[0].split('. ')[0] + '.',
    description: ind.seoDescription || `${ind.title} recruitment across the USA — ${ind.roleLine.replace(/\.$/, '')} and more.`,
  };
}
