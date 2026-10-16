/** Resolve build policy explicitly; Astro's production mode also includes staging builds. */
export function resolveDeployment(env = {}) {
  const environment = env.DEPLOY_ENV || 'production';
  if (!['production', 'staging'].includes(environment)) {
    throw new Error('DEPLOY_ENV must be production or staging');
  }
  const expectedBranch = environment === 'staging' ? 'development' : 'main';
  if (env.CF_PAGES === '1' && (env.DEPLOY_ENV !== environment || env.CF_PAGES_BRANCH !== expectedBranch)) {
    throw new Error('Cloudflare Pages requires explicit DEPLOY_ENV: development + staging or main + production');
  }
  return {
    environment,
    staging: environment === 'staging',
    url: environment === 'staging' ? 'https://beta.fullstackburgers.nl' : 'https://www.fullstackburgers.nl',
  };
}
