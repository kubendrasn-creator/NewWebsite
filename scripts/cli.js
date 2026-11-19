import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const astroBin = path.resolve(__dirname, '../node_modules/astro/bin/astro.mjs');

const result = spawnSync(process.execPath, [astroBin, ...process.argv.slice(2)], {
  stdio: 'inherit',
  env: {
    ...process.env,
    ASTRO_TELEMETRY_DISABLED: '1',
  },
});

process.exit(result.status ?? 0);
