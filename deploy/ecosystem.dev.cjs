// PM2 config for the NeoVentraX dev site. The pipeline copies it into the release as ecosystem.config.cjs.
const path = require('node:path');
const os = require('node:os');

module.exports = {
  apps: [
    {
      name: 'neoventrax-dev',
      script: 'server.cjs',
      cwd: path.join(os.homedir(), 'neoventrax-dev', 'current'),
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_memory_restart: '200M',
      env: {
        NODE_ENV: 'production',
        PORT: '4000',
        HOSTNAME: '0.0.0.0',
      },
    },
  ],
};
