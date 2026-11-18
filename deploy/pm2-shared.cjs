// Shared by deploy/ecosystem.dev.cjs and ecosystem.prod.cjs (the pipeline ships it next to them).
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

/**
 * The website needs Node 22+ (Astro 7), while the server's system Node is 20 (used by other apps).
 * Run it on the newest Node 22 installed for this user with nvm (`nvm install 22`).
 */
function node22() {
  const dir = path.join(os.homedir(), '.nvm', 'versions', 'node');
  const versions = fs.existsSync(dir) ? fs.readdirSync(dir).filter((v) => /^v22\./.test(v)) : [];
  const newest = versions.sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).pop();
  if (!newest) throw new Error('Node 22 not found: run `nvm install 22` as this user first');
  return path.join(dir, newest, 'bin', 'node');
}

/**
 * Secrets kept on the server, never in the repo (ICA deployment guide: <app>/shared/.env), e.g.
 * ~/neoventrax-prod/shared/.env with SITE_DATABASE_URL = read-only connection to the site-content database.
 * Missing file -> the site shows its built-in content.
 */
function siteEnv(appDir) {
  const file = path.join(os.homedir(), appDir, 'shared', '.env');
  if (!fs.existsSync(file)) return {};
  const env = {};
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m) env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2');
  }
  return env;
}

module.exports = { node22, siteEnv };
