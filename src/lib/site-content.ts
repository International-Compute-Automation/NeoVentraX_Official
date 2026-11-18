/**
 * Live connection to the site-content database (written by the Strapi CMS, see the NeoVentraX-CMS project).
 *
 * Every request asks the database one tiny question: "when did the CMS last write?" (site.sync_status).
 * Only when that changes is the content re-read, so a Publish in the CMS is visible on the next page view
 * while normal traffic costs one indexed lookup. If the database is unreachable, the last content read keeps
 * being served (or, if nothing was ever read, the built-in content), so the site never goes down with it.
 *
 * Env (runtime, server only): SITE_DATABASE_URL - read-only role nvx_site_reader. Not set -> built-in content.
 */
import pg from 'pg';
import { marked } from 'marked';
import { builtInIndustries, type Industry } from '../data/industries';
import { withPageDefaults, type IndustriesPage } from '../data/industries-page';
import { imageManifest, type ImageMeta } from './images';

export type SiteContent = {
  industries: Industry[];
  industriesPage: IndustriesPage;
  /** width/height/srcset of the images served from the database (/site-media/...) */
  images: Record<string, ImageMeta>;
  source: 'database' | 'built-in';
  version: string;
};

type ImageRef = { file: string; width: number; height: number; variants?: { file: string; width: number }[] };

const BUILT_IN: SiteContent = {
  industries: builtInIndustries,
  industriesPage: withPageDefaults(),
  images: {},
  source: 'built-in',
  version: 'built-in',
};

const MEDIA_PATH = '/site-media/';
/** how often to re-check the database for a newer version (ms); every request within this window reuses the answer */
const CHECK_INTERVAL = 1000;

let pool: pg.Pool | undefined;
let current: SiteContent | undefined;
let lastCheck = 0;
let checking: Promise<SiteContent> | undefined;

function db() {
  const url = process.env.SITE_DATABASE_URL;
  if (!url) return undefined;
  if (!pool) {
    pool = new pg.Pool({ connectionString: url, max: 4, idleTimeoutMillis: 30_000, connectionTimeoutMillis: 3_000 });
    // When the database stops it closes our idle connections. Without this handler Node treats that
    // as an unhandled error and the whole website exits; with it we keep serving the last content.
    pool.on('error', (err) => console.error(`[site-content] database connection lost: ${err.message}`));
  }
  return pool;
}

/** The current Industries content. Cheap: re-reads the database only after the CMS wrote something new. */
export async function getSiteContent(): Promise<SiteContent> {
  const p = db();
  if (!p) return BUILT_IN;
  if (current && Date.now() - lastCheck < CHECK_INTERVAL) return current;
  checking ??= refresh(p).finally(() => (checking = undefined));
  return checking;
}

async function refresh(p: pg.Pool): Promise<SiteContent> {
  try {
    const { rows } = await p.query('SELECT synced_at FROM site.sync_status WHERE id = 1');
    lastCheck = Date.now();
    const version = rows[0]?.synced_at?.toISOString() ?? 'empty';
    if (current?.version === version) return current;
    current = await load(p, version);
    console.log(`[site-content] loaded version ${version}: ${current.industries.length} industries`);
    return current;
  } catch (err) {
    lastCheck = Date.now(); // don't hammer a database that is down
    console.error(`[site-content] database unavailable, serving ${current ? 'the last loaded' : 'built-in'} content: ${err}`);
    return current ?? BUILT_IN;
  }
}

async function load(p: pg.Pool, version: string): Promise<SiteContent> {
  const [industryRows, pageRows, mediaRows] = await Promise.all([
    p.query('SELECT * FROM site.industries ORDER BY sort_order, title'),
    p.query("SELECT content FROM site.pages WHERE key = 'industries'"),
    p.query('SELECT file_name FROM site.media'),
  ]);
  if (!industryRows.rows.length) throw new Error('the site database has no published industries');

  const files = new Set(mediaRows.rows.map((r) => r.file_name as string));
  const images: Record<string, ImageMeta> = {};
  const image = (ref: ImageRef | undefined, label: string) => {
    if (!ref?.file || !files.has(ref.file)) throw new Error(`image of "${label}" is missing from the site database`);
    const src = MEDIA_PATH + ref.file;
    const variants = (ref.variants ?? []).filter((v) => files.has(v.file)).map((v) => `${MEDIA_PATH}${v.file} ${v.width}w`);
    images[src] = { src, w: ref.width, h: ref.height, srcset: variants.length ? [...variants, `${src} ${ref.width}w`].join(', ') : undefined };
    return src;
  };

  const industries: Industry[] = industryRows.rows.map((d) => ({
    slug: d.slug,
    title: d.title,
    icon: d.icon,
    image: image(d.image, d.title),
    roleLine: d.role_line,
    intro: paragraphs(d.intro),
    levels: (d.levels as Industry['levels']).filter((l) => l.roles.length),
    roles: [],
    roleCards: (d.role_cards as { title: string; location?: string; summary: string; details?: string }[]).map((c) => ({
      title: c.title,
      location: c.location || 'Across USA',
      summary: c.summary,
      html: c.details?.trim() ? (marked.parse(c.details) as string).trim() : `<p>${escapeHtml(c.summary)}</p>`,
    })),
    pageTitle: d.page_title?.trim() || undefined,
    heroLead: d.hero_lead?.trim() || undefined,
    seoDescription: d.seo_description?.trim() || undefined,
  }));

  const { heroImage, ...texts } = (pageRows.rows[0]?.content ?? {}) as Record<string, unknown> & { heroImage?: ImageRef };
  const industriesPage = withPageDefaults(texts);
  if (heroImage) industriesPage.heroImage = image(heroImage, 'Industries Page');

  return { industries, industriesPage, images, source: 'database', version };
}

/** Bytes of one image from the database, for /site-media/<file>. */
export async function getMedia(file: string): Promise<{ mime: string; bytes: Buffer } | undefined> {
  const p = db();
  if (!p) return undefined;
  const { rows } = await p.query('SELECT mime, bytes FROM site.media WHERE file_name = $1', [file]);
  return rows[0] ? { mime: rows[0].mime, bytes: rows[0].bytes } : undefined;
}

/** width/height/srcset of an image, whether it lives in public/ or in the database. */
export const imageMeta = (site: SiteContent | undefined, src: string) => site?.images[src] ?? imageManifest[src];

const paragraphs = (text: string) => text.split(/\n\s*\n/).map((p) => p.replace(/\s+/g, ' ').trim()).filter(Boolean);
const escapeHtml = (t: string) => t.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
