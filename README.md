# NeoVentraX — Astro site

A fast static rebuild of https://neoventrax.com (42 pages) with Astro.

## Run it

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static site in ./dist
npm run preview    # serve ./dist locally
```

Deploy `dist/` to any static host (Netlify, Vercel, Cloudflare Pages, or plain hosting).

## Forms

The Contact and Submit-Your-Resume forms need somewhere to send data. Copy `.env.example` to `.env`
and set `PUBLIC_FORM_ENDPOINT` to a form backend URL (e.g. Formspree, Web3Forms, Basin, or your own API).
Without it, forms fall back to opening the visitor's email client addressed to hr@neoventrax.com.

## Structure

- `src/pages/index.astro` — homepage (hand-built sections)
- `src/pages/[slug].astro` — template for the 39 inner pages (job listings, articles, services, testimonials)
- `src/pages/contact-us.astro`, `src/pages/submit-your-resume.astro` — form pages
- `src/lib/content.ts` — turns the page data in `src/data/pages/*.json` into clean structured content
- `src/components/` — Header (mega-menu), Footer, PageHero, JobCard, InfoCard, CtaBand, forms, icons
- `src/styles/global.css` — design tokens (colors, type scale, buttons, cards, forms)
- `src/data/nav.ts` — menu, contact details, social links, form endpoint
- `public/uploads/` — images as WebP (with 768px variants for phones)

To edit text on an inner page, change the matching JSON file in `src/data/pages/`. Homepage copy lives in `src/pages/index.astro`.

"Apply now" buttons on job pages open the resume form with the position pre-filled (`/submit-your-resume/?position=...`).

## Why it's faster than the WordPress site

- Pre-rendered static HTML, no PHP/database on each request
- No Divi/jQuery bundle; ~10 KB of JS total (mobile menu + forms only)
- Content is visible immediately (no fade-in animations hiding text)
- Images converted to WebP, lazy-loaded, with responsive sizes; hero image preloaded
- Fonts self-hosted (no Google Fonts round-trips); shared CSS cached across pages
