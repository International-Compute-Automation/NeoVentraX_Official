// PM2 config for the NeoVentraX dev site. The pipeline copies it into the release as ecosystem.config.cjs.
const path = require('node:path');
const os = require('node:os');
const { node22, siteEnv } = require('./pm2-shared.cjs');

module.exports = {
  apps: [
    {
      name: 'neoventrax-dev',
      // Astro's own Node server; it reads the Industries content live from the site database
      script: 'dist/server/entry.mjs',
      interpreter: node22(),
      cwd: path.join(os.homedir(), 'neoventrax-dev', 'current'),
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_memory_restart: '400M',
      env: {
        // SITE_DATABASE_URL etc. from ~/neoventrax-dev/shared/.env on the server (never in the repo)
        ...siteEnv('neoventrax-dev'),
        NODE_ENV: 'production',
        PORT: '4000',
        HOST: '0.0.0.0',
      },
    },
  ],
};
