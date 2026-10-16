import type { APIRoute } from 'astro';
import { locales, pages, pageUrl } from '../i18n';
import { site, deployment } from '../config/site';
export const GET: APIRoute = () => {
  const urls = deployment.staging ? '' : locales.flatMap(locale => pages.map(page => {
    const alternates = locales.map(l => '<xhtml:link rel="alternate" hreflang="' + l + '" href="' + site.url + pageUrl(l, page) + '" />').join('');
    return '<url><loc>' + site.url + pageUrl(locale, page) + '</loc>' + alternates + '<xhtml:link rel="alternate" hreflang="x-default" href="' + site.url + pageUrl('nl', page) + '" /></url>';
  })).join('');
  return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">' + urls + '</urlset>', { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
