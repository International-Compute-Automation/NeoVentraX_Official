import builtIn from '../data/images.json';

export type ImageMeta = { src: string; w: number; h: number; srcset?: string };

/** width / height / srcset of the images in public/, keyed by their public path.
 *  Images from the site database are described by the live content (Astro.locals.site.images). */
export const imageManifest = builtIn as Record<string, ImageMeta>;
