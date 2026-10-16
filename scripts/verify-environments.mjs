import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { resolveDeployment } from '../config/environment.mjs';

assert.throws(() => resolveDeployment({ DEPLOY_ENV: 'invalid' }));
for (const settings of [
  { CF_PAGES: '1', CF_PAGES_BRANCH: 'development' },
  { CF_PAGES: '1', CF_PAGES_BRANCH: 'main', DEPLOY_ENV: 'staging' },
  { CF_PAGES: '1', CF_PAGES_BRANCH: 'development', DEPLOY_ENV: 'production' },
]) assert.throws(() => resolveDeployment(settings));
assert.equal(resolveDeployment({ CF_PAGES: '1', CF_PAGES_BRANCH: 'development', DEPLOY_ENV: 'staging' }).staging, true);

function run(args, environment) {
  const result = spawnSync(process.execPath, args, {
    stdio: 'inherit',
    env: { ...process.env, DEPLOY_ENV: environment, CF_PAGES: '0', CF_PAGES_BRANCH: '' },
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
