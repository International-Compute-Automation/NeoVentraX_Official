// PM2 config for the NeoVentraX prod site. The pipeline copies it into the release as ecosystem.config.cjs.
const path = require('node:path');
const os = require('node:os');
const { node22, siteEnv } = require('./pm2-shared.cjs');

module.exports = {
  apps: [
    {
      name: 'neoventrax-prod',
      // Astro's own Node server; it reads the Industries content live from the site database
      script: 'dist/server/entry.mjs',
      interpreter: node22(),
      cwd: path.join(os.homedir(), 'neoventrax-prod', 'current'),
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_memory_restart: '400M',
      env: {
        // SITE_DATABASE_URL etc. from ~/neoventrax-prod/shared/.env on the server (never in the repo)
        ...siteEnv('neoventrax-prod'),
        NODE_ENV: 'production',
        PORT: '4001',
        HOST: '0.0.0.0',
      },
    },
  ],
};
