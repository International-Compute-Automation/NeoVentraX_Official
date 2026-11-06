/**
 * Turns the page data extracted from the old Divi site into clean, structured content
 * that the redesigned templates can style freely.
 */
import * as cheerio from 'cheerio';
import { nav } from '../data/nav';

type Raw = { slug: string; title: string; description: string; css: string; sections: any[] };

export type Card = {
  title: string;
  subtitle?: string;
  image?: string;
  html: string;          // cleaned body
  summary: string;       // short plain-text preview
  location?: string;     // e.g. "Across USA" for job roles
  button?: { text: string; href: string };
  avatar?: string;       // testimonial avatar
};
export type Group = { heading?: string; lead?: string; cards: Card[] };
export type Category = 'about' | 'jobs' | 'employers' | 'employees' | 'services' | 'contact' | 'home';
export type Page = {
  slug: string;
  title: string;
  description: string;
  category: Category;
  categoryLabel: string;
  heroImage?: string;
  intro: string;         // cleaned html
  groups: Group[];
  hasForm?: 'contact' | 'resume';
  map?: string;
};

const rawPages = import.meta.glob<Raw>('../data/pages/*.json', { eager: true, import: 'default' });

const CATEGORY_BY_LABEL: Record<string, Category> = {
  'About Us': 'about', 'Find a Job': 'jobs', Employers: 'employers', Employees: 'employees', Services: 'services',
};

export function categoryOf(slug: string): { category: Category; label: string } {
  if (slug === 'home') return { category: 'home', label: 'Home' };
  if (slug === 'contact-us') return { category: 'contact', label: 'Contact' };
  for (const item of nav) {
    if (item.children?.some((c) => c.href === `/${slug}/`)) return { category: CATEGORY_BY_LABEL[item.label] ?? 'about', label: item.label };
  }
  return { category: 'about', label: 'NeoVentraX' };
}

/** Strip WordPress/Divi wrapper noise, inline styles and empty nodes. */
export function cleanHtml(html: string): string {
  if (!html) return '';
  const $ = cheerio.load(`<root>${html}</root>`, null, false);
  const root = $('root');
  root.find('span, font').each((_, el) => { $(el).replaceWith($(el).contents()); });
  // unwrap divs (deepest first) — turn text-only divs into paragraphs
  root.find('div').get().reverse().forEach((el) => {
    const $el = $(el);
    const hasBlock = $el.children('p,ul,ol,h1,h2,h3,h4,h5,h6,div,table,blockquote').length > 0;
    if (!hasBlock && $el.text().trim()) $el.replaceWith(`<p>${$el.html()}</p>`);
    else $el.replaceWith($el.contents());
  });
  root.find('*').removeAttr('style').removeAttr('class');
  root.find('h1, h2').each((_, el) => { (el as any).tagName = 'h3'; });
  root.find('p, li, h3, h4, h5, h6').each((_, el) => {
    const $el = $(el);
    if (!$el.text().replace(/ /g, ' ').trim() && !$el.find('img').length) $el.remove();
  });
  root.find('a[href^="http"]').attr('target', '_blank').attr('rel', 'noopener');
  return (root.html() ?? '').replace(/\n{2,}/g, '\n').replace(/(<br\s*\/?>\s*){2,}/g, '<br>').trim();
}

export const textOf = (html: string) => cheerio.load(html ?? '').text().replace(/\s+/g, ' ').trim();

function summarize(html: string, max = 170) {
  const t = textOf(html).replace(/^Job description\s*/i, '').replace(/\s*(Key\s+)?Roles?\s+and\s+Responsibilities:?[\s\S]*$/i, '');
  return t.length > max ? t.slice(0, t.lastIndexOf(' ', max)) + '…' : t;
}

function heroImageOf(raw: Raw) {
  return raw.css.match(/dv-section-0[^{]*\{[^}]*url\((\/uploads\/[^)]+)\)/)?.[1];
}

const isHeading = (html: string) => /^\s*<h[1-6]/i.test(html);

function buildCard(mods: any[]): Card | null {
  const texts = mods.filter((m) => m.type === 'text');
  const image = mods.find((m) => m.type === 'image')?.src;
  const blurb = mods.find((m) => m.type === 'blurb');
  const button = mods.find((m) => m.type === 'button');
  if (blurb) {
    // testimonial: blurb holds person + role, text holds the quote
    return {
      title: blurb.title, subtitle: textOf(blurb.html), avatar: blurb.img ?? undefined,
      html: cleanHtml(texts.map((t) => t.html).join('')), summary: summarize(texts.map((t) => t.html).join('')),
    };
  }
  const headingMods = texts.filter((t) => isHeading(t.html));
  if (!headingMods.length) return null;
  const titleMod = headingMods[headingMods.length > 1 ? 1 : 0];
  let title = textOf(titleMod.html);
  let subtitle = headingMods.length > 1 ? textOf(headingMods[0].html) : undefined;
  const bodyHtml = cleanHtml(texts.filter((t) => !headingMods.includes(t)).map((t) => t.html).join(''));
  const loc = title.match(/\(([^)]+)\)\s*$/);
  if (loc) title = title.replace(loc[0], '').trim();
  return {
    title, subtitle, image, html: bodyHtml, summary: summarize(bodyHtml), location: loc?.[1],
    button: button ? { text: button.text, href: button.href } : undefined,
  };
}

function normalize(raw: Raw): Page {
  const { category, label } = categoryOf(raw.slug);
  const page: Page = {
    slug: raw.slug, title: '', description: raw.description, category, categoryLabel: label,
    heroImage: heroImageOf(raw), intro: '', groups: [],
  };
  const [hero, ...rest] = raw.sections;
  const heroText = hero?.rows.flatMap((r: any) => r.cols.flatMap((c: any) => c.mods)).find((m: any) => m.type === 'text');
  page.title = heroText ? textOf(heroText.html) : raw.title;
  if (/^[A-Z\s&]+$/.test(page.title)) page.title = page.title.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

  let group: Group | null = null;
  const pushGroup = (g: Group) => { page.groups.push(g); group = g; };

  for (const s of rest) {
    for (const m of s.modules ?? []) if (m.type === 'map') page.map = m.src;
    for (const r of s.rows) {
      const allMods = r.cols.flatMap((c: any) => c.mods);
      const form = allMods.find((m: any) => m.type === 'form');
      if (form) { page.hasForm = form.form; continue; }
      const map = allMods.find((m: any) => m.type === 'map');
      if (map) { page.map = map.src; continue; }

      if (r.cols.length === 1) {
        const mods = r.cols[0].mods;
        const texts = mods.filter((m: any) => m.type === 'text');
        const firstH = texts[0] && /^\s*<h([1-6])/i.exec(texts[0].html);
        if (firstH && (firstH[1] === '1' || firstH[1] === '2') ) {
          pushGroup({ heading: textOf(texts[0].html), lead: cleanHtml(texts.slice(1).map((t: any) => t.html).join('')), cards: [] });
          continue;
        }
        if (firstH) { // single full-width card (e.g. careers job opening)
          const card = buildCard(mods);
          if (card) { if (!group) pushGroup({ cards: [] }); group!.cards.push(card); }
          continue;
        }
        const html = cleanHtml(texts.map((t: any) => t.html).join(''));
        if (!page.intro && !page.groups.length) page.intro = html;
        else if (group && !group.cards.length) group.lead = (group.lead ?? '') + html;
        else pushGroup({ lead: html, cards: [] });
        continue;
      }
      // multi-column row → cards
      if (!group) pushGroup({ cards: [] });
      for (const c of r.cols) {
        const card = buildCard(c.mods);
        if (card) group!.cards.push(card);
      }
    }
  }
  page.groups = page.groups.filter((g) => g.heading || g.lead || g.cards.length);
  return page;
}

export const pages: Page[] = Object.values(rawPages).filter((r) => r.slug !== 'home').map(normalize);
export const getPage = (slug: string) => pages.find((p) => p.slug === slug)!;
export const pagesIn = (category: Category) =>
  nav.flatMap((n) => n.children ?? []).map((c) => pages.find((p) => `/${p.slug}/` === c.href)).filter((p): p is Page => !!p && p.category === category);
