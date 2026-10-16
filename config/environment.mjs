/** Resolve build policy explicitly; Astro's production mode also includes staging builds. */
export function resolveDeployment(env = {}) {
  const environment = env.DEPLOY_ENV || 'production';
  if (!['production', 'staging'].includes(environment)) {
    throw new Error('DEPLOY_ENV must be production or staging');
  }
  if (env.CF_PAGES === '1' && (environment !== 'staging' || env.CF_PAGES_BRANCH !== 'development')) {
    throw new Error('Cloudflare Pages must build development with DEPLOY_ENV=staging');
  }
  return {
    environment,
    staging: environment === 'staging',
    url: environment === 'staging' ? 'https://beta.fullstackburgers.nl' : 'https://www.fullstackburgers.nl',
  };
}
