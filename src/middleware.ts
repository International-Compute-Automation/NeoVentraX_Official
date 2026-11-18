import { defineMiddleware } from 'astro:middleware';
import { getMedia, getSiteContent } from './lib/site-content';

const MEDIA = /^\/site-media\/([\w.-]+)$/;

export const onRequest = defineMiddleware(async (context, next) => {
  // Images uploaded in the CMS, served straight from the site database. Handled here (not as a page
  // route) because file addresses have no trailing slash. Names contain a content hash, so they never
  // change: browsers may cache them forever.
  const media = context.url.pathname.match(MEDIA);
  if (media) {
    const file = await getMedia(media[1]).catch(() => undefined);
    if (!file) return new Response('Not found', { status: 404 });
    return new Response(new Uint8Array(file.bytes), {
      headers: { 'Content-Type': file.mime, 'Content-Length': String(file.bytes.length), 'Cache-Control': 'public, max-age=31536000, immutable' },
    });
  }

  // Every page gets the live Industries content from the site database as Astro.locals.site.
  context.locals.site = await getSiteContent();
  return next();
});
