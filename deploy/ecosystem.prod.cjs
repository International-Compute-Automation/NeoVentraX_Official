// PM2 config for the NeoVentraX prod site. The pipeline copies it into the release as ecosystem.config.cjs.
const path = require('node:path');
const os = require('node:os');

module.exports = {
  apps: [
    {
      name: 'neoventrax-prod',
      script: 'server.cjs',
      cwd: path.join(os.homedir(), 'neoventrax-prod', 'current'),
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_memory_restart: '200M',
      env: {
        NODE_ENV: 'production',
        PORT: '3210',
        HOSTNAME: '0.0.0.0',
      },
    },
  ],
};
