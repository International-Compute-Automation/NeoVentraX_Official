# NeoVentraX — Astro site

The https://neoventrax.com website, built with Astro and served by Astro's own Node server.

## Run it

```bash
npm install
cp .env.example .env   # fill in what you need (see below)
npm run dev            # http://localhost:4321
npm run build          # production build in ./dist
npm run start          # run the production build (reads .env), http://localhost:4321 or $PORT
```

## Forms

The Contact, Submit-Your-Resume and Hire-Talent forms post to the site's own endpoint
`/api/forms/` (`src/pages/api/forms.ts`). It checks the submission (required fields, email,
resume: PDF/Word/RTF/TXT up to 5 MB, a hidden anti-spam field, max 5 per visitor per 10 minutes)
and emails it to `FORM_MAIL_TO`, with the resume attached and Reply-To set to the visitor.

Set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` (and optionally `FORM_MAIL_TO`, `FORM_MAIL_FROM`)
in `.env`, or on the server in `~/neoventrax-dev/shared/.env` and `~/neoventrax-prod/shared/.env`.
Without them the forms answer "temporarily unavailable" and nothing is sent.

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

## Deployment (ICA CI/CD)

Follows the ICA Corp deployment runbook: GitHub Actions → Docker build → rsync over Cloudflare SSH → PM2.

| Env | Branch | Port | PM2 name | Server folder |
| --- | --- | --- | --- | --- |
| Dev | `dev` | 4000 | `neoventrax-dev` | `~/neoventrax-dev` |
| Prod | `main` | 4001 | `neoventrax-prod` | `~/neoventrax-prod` |

- `Dockerfile` builds the site; the `artifact` stage contains only `dist/` (Astro Node server with all dependencies bundled in).
- PM2 runs `dist/server/entry.mjs` on Node 22; `deploy/pm2-shared.cjs` loads `~/<app>/shared/.env`.
- `deploy/ecosystem.{dev,prod}.cjs` are the PM2 configs (copied into each release as `ecosystem.config.cjs`).
- `.github/workflows/deploy-{dev,prod}.yml` run on push to `dev` / `main`.
- Repo settings needed: secrets `SSH_PRIVATE_KEY`, `SSH_HOST`, `SSH_USER`; variable `DEPLOY_ENABLED=true`. Server secrets (database, SMTP) go in `~/<app>/shared/.env`.
- Rollback: `ln -sfn ~/neoventrax-prod/releases/<sha> ~/neoventrax-prod/current && pm2 reload neoventrax-prod`
