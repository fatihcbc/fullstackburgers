import { resolveDeployment } from '../../config/environment.mjs';
export const deployment = resolveDeployment({ DEPLOY_ENV: import.meta.env.DEPLOY_ENV });
export const site = {
  name: 'Fullstack Burgers',
  url: deployment.url,
  timeZone: 'Europe/Amsterdam',
  // Add verified address, telephone, opening hours and social URLs before launch.
  business: { '@type': 'FoodEstablishment' },
};
// Replace these files or paths; presentation does not depend on final artwork.
export const assets = {
  hero: '/media/burger-placeholder.svg',
  burger: '/media/burger-placeholder.svg',
  story: '/media/story-placeholder.svg',
  social: '/media/social-placeholder.svg',
  socialCard: '/media/social-card.svg',
};
