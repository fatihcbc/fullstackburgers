import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { resolveDeployment } from '../config/environment.mjs';

assert.throws(() => resolveDeployment({ DEPLOY_ENV: 'invalid' }));
for (const branch of ['development', 'main', 'feature/example', '', undefined]) {
  for (const environment of ['staging', 'production', 'invalid', '', undefined]) {
    const settings = { CF_PAGES: '1', CF_PAGES_BRANCH: branch, DEPLOY_ENV: environment };
    if ((branch === 'development' && environment === 'staging') || (branch === 'main' && environment === 'production')) {
      const result = resolveDeployment(settings);
      assert.equal(result.environment, environment);
      assert.equal(result.staging, environment === 'staging');
      assert.equal(result.url, environment === 'staging' ? 'https://beta.fullstackburgers.nl' : 'https://www.fullstackburgers.nl');
    } else assert.throws(() => resolveDeployment(settings), 'Unsafe Cloudflare branch/environment combination');
  }
}
assert.equal(resolveDeployment({}).environment, 'production', 'Local builds retain the production default');
assert.equal(resolveDeployment({ DEPLOY_ENV: 'staging' }).staging, true);
console.log('Verified Cloudflare guard: exactly 2 allowed combinations; 23 invalid combinations rejected.');

function run(args, environment) {
  const result = spawnSync(process.execPath, args, {
    stdio: 'inherit',
    env: { ...process.env, DEPLOY_ENV: environment, CF_PAGES: '1', CF_PAGES_BRANCH: environment === 'staging' ? 'development' : 'main' },
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
run(['node_modules/astro/bin/astro.mjs', 'check'], 'production');
// Build staging first, then production to also check that staging artifacts are cleared.
for (const environment of ['staging', 'production']) {
  run(['node_modules/astro/bin/astro.mjs', 'build'], environment);
  run(['scripts/verify-build.mjs'], environment);
}
