import type { APIRoute } from 'astro';
import { site, deployment } from '../config/site';
export const GET: APIRoute = () => new Response('User-agent: *\nAllow: /\n' + (deployment.staging ? '' : 'Sitemap: ' + site.url + '/sitemap.xml\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
