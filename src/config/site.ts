import { resolveDeployment } from '../../config/environment.mjs';
export const deployment = resolveDeployment({ DEPLOY_ENV: import.meta.env.DEPLOY_ENV });
export const site = {
  name: 'Fullstack Burgers',
  url: deployment.url,
  timeZone: 'Europe/Amsterdam',
  // Add verified address, telephone, opening hours and social URLs before launch.
  business: { '@type': 'FoodEstablishment', servesCuisine: 'Smash burgers', areaServed: { '@type': 'City', name: 'Almere' } },
};
export const assets = {
  socialCard: '/media/truck-2.png',
};
