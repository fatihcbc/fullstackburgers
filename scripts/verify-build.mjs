import { readFile, readdir, access } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import assert from 'node:assert/strict';
import { resolveDeployment } from '../config/environment.mjs';
const deployment = resolveDeployment(process.env);
const dist = resolve('dist');
async function walk(dir) { return (await Promise.all((await readdir(dir, { withFileTypes: true })).map(e => e.isDirectory() ? walk(join(dir, e.name)) : join(dir, e.name)))).flat(); }
const files = await walk(dist);
const originalMascot = await readFile('public/media/pixel/10x10 cm drukwerk.svg', 'utf8');
const favicon = await readFile(join(dist, 'icons/favicon.svg'), 'utf8');
for (const shape of originalMascot.matchAll(/<(?:path|polygon)\b[^>]*\/>/g)) assert(favicon.includes(shape[0]), 'Favicon must preserve original face features');
assert(favicon.includes('clip-path="url(#face)"'), 'Favicon should isolate the original face');
for (const size of [16, 32, 48, 180]) {
  const name = size === 180 ? 'apple-touch-icon.png' : 'favicon-' + size + '.png';
  const png = await readFile(join(dist, 'icons', name));
  assert.equal(png.subarray(1, 4).toString('ascii'), 'PNG');
  assert.equal(png.readUInt32BE(16), size);
  assert.equal(png.readUInt32BE(20), size);
}
const ico = await readFile(join(dist, 'favicon.ico'));
assert.equal(ico.readUInt16LE(0), 0);
assert.equal(ico.readUInt16LE(2), 1);
assert.equal(ico.readUInt16LE(4), 3);
for (const [index, size] of [16, 32, 48].entries()) {
  const entry = 6 + index * 16;
  assert.equal(ico[entry], size);
  assert.equal(ico[entry + 1], size);
  const offset = ico.readUInt32LE(entry + 12);
  const length = ico.readUInt32LE(entry + 8);
  assert.deepEqual(ico.subarray(offset, offset + length), await readFile(join(dist, 'icons/favicon-' + size + '.png')));
}
await assert.rejects(access(join(dist, 'favicon.svg')), 'Old generic favicon must be removed');
const fontFiles = files.filter(file => file.endsWith('.woff2'));
assert.equal(fontFiles.length, 4, 'Expected normal/italic Latin and Latin Extended Roboto faces');
for (const file of fontFiles) {
  const bytes = await readFile(file);
  assert.equal(bytes.subarray(0, 4).toString('ascii'), 'wOF2', 'Invalid WOFF2 font');
}
for (const file of files.filter(file => file.endsWith('.css'))) {
  const css = await readFile(file, 'utf8');
  assert(!/https?:\/\/fonts\.(googleapis|gstatic)\.com/.test(css), 'Fonts must be self-hosted');
  for (const url of css.matchAll(/url\(["']?(\/fonts\/[^)"']+)/g)) await access(join(dist, url[1]));
}
const prototypePaths = [join(dist, 'design', 'retro', 'index.html'), join(dist, 'en', 'design', 'retro', 'index.html')];
const pages = files.filter(f => f.endsWith('.html') && !f.endsWith('404.html') && f !== join(dist, 'index.html') && !prototypePaths.includes(f));
assert.equal(pages.length, 8, 'Expected four pages in both languages after Ingredients removal');
const titles = new Set(); const descriptions = new Set();
const routePairs = [['', ''], ['menu/', 'menu/'], ['over-ons/', 'about/'], ['locaties-evenementen/', 'locations-events/']];
for (const pair of routePairs) {
  for (const [index, locale] of ['nl', 'en'].entries()) {
    const html = await readFile(join(dist, locale, pair[index], 'index.html'), 'utf8');
    assert(html.includes('<html lang="' + locale + '"'), 'Wrong document language');
    assert(html.includes('rel="canonical" href="' + deployment.url + '/' + locale + '/' + pair[index] + '"'), 'Wrong page canonical');
    for (const [alternate, language] of ['nl', 'en'].entries()) assert(html.includes('hreflang="' + language + '" href="' + deployment.url + '/' + language + '/' + pair[alternate] + '"'), 'Wrong reciprocal hreflang target');
    assert(html.includes('hreflang="x-default" href="' + deployment.url + '/nl/' + pair[0] + '"'), 'Wrong default language target');
  }
}
for (const [path, expected] of [
  ['nl/index.html', 'Smashburgers in Almere | Fullstack Burgers'],
  ['nl/menu/index.html', 'Smashburger menu in Almere | Fullstack Burgers'],
  ['nl/locaties-evenementen/index.html', 'Foodtruck in Almere: Muziekwijk en Poort | Fullstack Burgers'],
]) assert((await readFile(join(dist, path), 'utf8')).includes('<title>' + expected + '</title>'), 'Required Dutch SEO title missing');
for (const file of pages) {
  const html = await readFile(file, 'utf8');
  assert(!html.includes('truck-1'), 'Backup truck image must not be referenced by website pages');
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
  assert(title && !titles.has(title), 'Missing or duplicate title: ' + file); titles.add(title);
  const description = html.match(/<meta name="description" content="([^"]+)"/s)?.[1];
  assert(description && !descriptions.has(description), 'Missing or duplicate description: ' + file); descriptions.add(description);
  assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1, 'Expected one h1: ' + file);
  assert.match(html, /<html lang="(nl|en)"/);
  assert(html.includes('rel="canonical" href="' + deployment.url + '/'), 'Wrong canonical origin');
  for (const lang of ['nl', 'en', 'x-default']) assert(html.includes('hreflang="' + lang + '"'), 'Missing alternate ' + lang);
  for (const tag of ['og:title', 'og:description', 'og:url', 'og:image']) assert(html.includes('property="' + tag + '"'), 'Missing ' + tag);
  const json = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)?.[1];
  assert(json, 'Missing structured data'); assert.equal(JSON.parse(json).name, 'Fullstack Burgers');
  for (const match of html.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
    const target = decodeURI(match[1]);
    assert(!target.startsWith('//'), 'Unexpected protocol-relative URL');
    await access(join(dist, target, target.endsWith('/') ? 'index.html' : ''));
  }
  for (const img of html.matchAll(/<img\b[^>]*>/g)) { assert(/\balt(?:\s|=|>)/.test(img[0]), 'Missing image alt'); assert(/\bwidth=/.test(img[0]) && /\bheight=/.test(img[0]), 'Missing image dimensions'); }
  assert(!/<script\b[^>]*src=/.test(html), 'Phase 1 should ship no client JavaScript');
}
const sitemap = await readFile(join(dist, 'sitemap.xml'), 'utf8');
assert.equal((sitemap.match(/<loc>/g) ?? []).length, deployment.staging ? 0 : 8);
const robots = await readFile(join(dist, 'robots.txt'), 'utf8');
assert.equal(robots, 'User-agent: *\nAllow: /\n' + (deployment.staging ? '' : 'Sitemap: ' + deployment.url + '/sitemap.xml\n'));
assert.equal((await readFile('CNAME', 'utf8')).trim(), 'www.fullstackburgers.nl');
assert.equal((await readFile('public/CNAME', 'utf8')).trim(), 'www.fullstackburgers.nl');
for (const file of files.filter(f => f.endsWith('.html'))) {
  const html = await readFile(file, 'utf8');
  assert(!html.includes('truck-1'), 'Backup truck image must not be displayed');
  assert(!html.includes('<figcaption'), 'Truck photo captions must remain removed');
  const isRoot = file === join(dist, 'index.html');
  const is404 = file === join(dist, '404.html');
  if (isRoot) {
    assert(html.includes('rel="canonical" href="' + deployment.url + '/nl/"'), 'Root must retain the Dutch homepage canonical');
    assert(!/http-equiv="refresh"/i.test(html) && !/<script\b[^>]*src=/.test(html), 'Root must remain accessible without redirect scripts');
  }
  if (!is404 && !prototypePaths.includes(file)) {
    assert.equal(/Staging · website in (ontwikkeling|development)/.test(html), deployment.staging, 'Staging indicator must follow the deployment environment');
    const schema = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
    assert.equal(schema['@context'], 'https://schema.org');
    assert.equal(schema['@type'], 'FoodEstablishment');
    assert.equal(schema['@id'], deployment.url + '/#business');
    assert.equal(schema.name, 'Fullstack Burgers');
    assert.equal(schema.url, deployment.url);
    assert.equal(schema.servesCuisine, 'Smash burgers');
    assert.deepEqual(schema.areaServed, { '@type': 'City', name: 'Almere' });
    assert.equal(schema.logo, deployment.url + '/media/logo/10x10%20cm%20logo%20drukwerk.svg');
    assert.equal(schema.image, deployment.url + '/media/truck-2.png');
    assert.equal(schema.hasMenu, deployment.url + (html.includes('<html lang="en"') ? '/en/menu/' : '/nl/menu/'));
    for (const unconfirmed of ['address', 'openingHours', 'openingHoursSpecification', 'telephone', 'sameAs', 'geo']) assert(!(unconfirmed in schema), 'Unconfirmed business detail: ' + unconfirmed);
  }
  if (!deployment.staging) assert(!/Staging · website in (ontwikkeling|development)/.test(html), 'Staging label visible on production');
  for (const icon of ['/favicon.ico', '/icons/favicon.svg', '/icons/favicon-32.png', '/icons/apple-touch-icon.png']) assert(html.includes('href="' + icon + '"'), 'Missing favicon reference: ' + file);
  assert(!html.includes('href="/favicon.svg"'), 'Generic favicon reference remains');
  assert(!/\/(nl\/ingredienten|en\/ingredients)\//.test(html), 'Removed Ingredients route is still linked');
  assert(!/placeholder\.svg|social-card\.svg|tijdelijk beeld|temporary brand artwork|voorbeeldburger|sample burger|The Classic|The Green|The Special/i.test(html), 'Placeholder content remains: ' + file);
  assert(html.includes('href="/fonts/roboto/roboto-latin-normal.woff2"'), 'Missing local font preload: ' + file);
  assert(!/https?:\/\/fonts\.(googleapis|gstatic)\.com/.test(html), 'Unexpected external font request');
  if (deployment.staging || prototypePaths.includes(file)) assert(html.includes('<meta name="robots" content="noindex,nofollow"'), 'Missing noindex: ' + file);
  else if (is404) assert(html.includes('<meta name="robots" content="noindex"'));
  else assert(!html.includes('name="robots"'), 'Production page unexpectedly restricted');
  const otherOrigin = deployment.staging ? 'https://www.fullstackburgers.nl' : 'https://beta.fullstackburgers.nl';
  assert(!html.includes(otherOrigin), 'Mixed environment URLs: ' + file);
  for (const match of html.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
    const target = decodeURI(match[1]);
    assert(!target.startsWith('//'), 'Unexpected protocol-relative URL');
    await access(join(dist, target, target.endsWith('/') ? 'index.html' : ''));
  }
  for (const match of html.matchAll(/https:\/\/(?:www|beta)\.fullstackburgers\.nl[^\s"<]*/g)) {
    const url = new URL(match[0]);
    if (url.hash) continue;
    await access(join(dist, decodeURI(url.pathname), url.pathname.endsWith('/') ? 'index.html' : ''));
  }
}
for (const path of ['nl/ingredienten/index.html', 'en/ingredients/index.html']) await assert.rejects(access(join(dist, path)), 'Ingredients page must no longer exist');
for (const locale of ['nl', 'en']) {
  const home = await readFile(join(dist, locale, 'index.html'), 'utf8');
  const menu = await readFile(join(dist, locale, 'menu/index.html'), 'utf8');
  const locationPath = locale === 'nl' ? 'locaties-evenementen' : 'locations-events';
  const locations = await readFile(join(dist, locale, locationPath, 'index.html'), 'utf8');
  assert(locations.includes(locale === 'nl' ? '>Onze foodtruck in Almere</h1>' : '>Our food truck in Almere</h1>'), 'Missing localized location heading');
  assert(locations.includes(locale === 'nl' ? 'Op maandag vind je onze smashburger-foodtruck op het Homerusplein in Almere Poort.' : 'On Mondays, our smash burger food truck is at Homerusplein in Almere Poort.'), 'Missing confirmed Monday location copy');
  assert(home.includes('/media/pixel/10x10%20cm%20drukwerk.svg'), 'Missing original mascot');
  assert(home.includes('truck-2.') && home.includes('type="image/webp"') && home.includes('fetchpriority="high"'), 'Missing optimized original truck hero');
  assert(home.includes(locale === 'nl' ? 'Smashburgers' : 'Almere-based smash burger food truck'));
  const prototype = await readFile(prototypePaths[locale === 'nl' ? 0 : 1], 'utf8');
  const currency = cents => new Intl.NumberFormat(locale === 'nl' ? 'nl-NL' : 'en-IE', { style: 'currency', currency: 'EUR' }).format(cents / 100);
  for (const html of [home, menu, prototype]) {
    assert(html.includes(locale === 'nl' ? 'OPENINGSPRIJZEN' : 'OPENING PRICES'), 'Missing opening prices badge');
    assert(html.includes(locale === 'nl' ? 'De standaardprijzen hieronder gelden later.' : 'The standard prices below apply later.'), 'Future standard pricing needs explanation');
    assert(!/<(?:del|s)\b/.test(html), 'Opening prices must not use previous-price strikethrough');
    for (const [size, burger, combo, standardBurger, standardCombo] of [
      ['Single', 795, 1095, 895, 1295], ['Double', 995, 1295, 1095, 1495], ['Triple', 1195, 1495, 1295, 1695],
    ]) {
      const card = [...html.matchAll(/<article\b[^>]*>([\s\S]*?)<\/article>/g)].find(match => match[1].includes(size + ' Smash Burger'))?.[1];
      assert(card, 'Missing priced burger card: ' + size);
      const opening = [...card.matchAll(/class="price-line opening-price"[^>]*>[\s\S]*?<strong[^>]*>([^<]+)<\/strong>/g)].map(match => match[1]);
      const standard = [...card.matchAll(/class="price-line future-price"[^>]*>[\s\S]*?<span class="price-value"[^>]*>([^<]+)<\/span>/g)].map(match => match[1]);
      assert.deepEqual(opening, [currency(burger), currency(combo)], 'Wrong opening prices: ' + size);
      assert.deepEqual(standard, [currency(standardBurger), currency(standardCombo)], 'Wrong future standard prices: ' + size);
      assert(card.includes(locale === 'nl' ? 'Later standaard' : 'Future standard price'), 'Missing future standard label');
    }
  }
  for (const html of [home, locations, prototype]) {
    for (const [day, name, url] of [
      [locale === 'nl' ? 'Zondag' : 'Sunday', 'Almere Muziekwijk', 'https://maps.app.goo.gl/EsycCHAQrW5B5s397'],
      [locale === 'nl' ? 'Maandag' : 'Monday', 'Homerusplein, Almere Poort', 'https://maps.app.goo.gl/9kqmWKQLQ9rSy3kZ9'],
    ]) {
      assert(html.includes(day) && html.includes(name), 'Missing regular location');
      const link = [...html.matchAll(/<a\b([^>]+)>([\s\S]*?)<\/a>/g)].find(match => match[1].includes('href="' + url.replaceAll('&', '&amp;') + '"'));
      assert(link, 'Incorrect directions URL for ' + name);
      assert(link[1].includes('target="_blank"') && link[1].includes('rel="noopener noreferrer"'), 'Directions must safely open a new tab');
      const label = locale === 'nl' ? 'Route bekijken' : 'Get directions';
      assert(link[2].includes(label), 'Wrong directions button label');
      assert(link[1].includes('aria-label="' + label + ': ' + name), 'Directions need a location-specific accessible name');
    }
    assert(!html.includes('google.com/maps/search'), 'Locations must use the exact supplied Maps URLs');
    assert(!/Bekijk op Google Maps|View on Google Maps/.test(html), 'Old directions label remains');
    assert(!/openingHours|\d{1,2}:\d{2}/.test(html), 'Opening times were not supplied');
  }
  assert(menu.includes('/media/posters-03-lowsized.jpeg') && menu.includes('posters-03-lowsized.') && menu.includes('type="image/webp"'), 'Missing official optimized poster and full-size link');
  for (const product of ['Single Smash Burger', 'Double Smash Burger', 'Triple Smash Burger']) assert(menu.includes(product));
  for (const cents of [795, 1095, 995, 1295, 1195, 1495, 350, 325]) {
    const price = new Intl.NumberFormat(locale === 'nl' ? 'nl-NL' : 'en-IE', { style: 'currency', currency: 'EUR' }).format(cents / 100);
    assert(menu.includes(price), 'Missing official price ' + price);
  }
  assert(menu.includes(locale === 'nl' ? 'burger, friet en frisdrank' : 'burger, fries and a soft drink'), 'Missing combo contents');
}
for (const relative of ['media/truck-1.jpeg', 'media/truck-2.png', 'media/posters-01.jpg', 'media/posters-03-lowsized.jpeg', 'media/pixel/10x10 cm drukwerk.svg', 'media/logo/10x10 cm logo drukwerk.svg']) {
  assert.deepEqual(await readFile(join(dist, relative)), await readFile(join('public', relative)), 'Original asset changed in output');
}
for (const [index, file] of prototypePaths.entries()) {
  const html = await readFile(file, 'utf8');
  const locale = index === 0 ? 'nl' : 'en';
  assert(html.includes('<html lang="' + locale + '"'), 'Wrong prototype language');
  assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1);
  assert(html.includes('href="/design/retro/"') && html.includes('href="/en/design/retro/"'), 'Missing prototype language switch');
  const path = index === 0 ? '/design/retro/' : '/en/design/retro/';
  assert(html.includes('rel="canonical" href="' + deployment.url + path + '"'));
  assert(!sitemap.includes('/design/retro/'), 'Prototype must stay out of the sitemap');
  assert(html.includes('type="image/webp"') && html.includes('fetchpriority="high"'), 'Missing optimized priority hero');
  for (const img of html.matchAll(/<img\b[^>]*>/g)) {
    assert(/\balt="[^"]+"/.test(img[0]) || (/\balt=""/.test(img[0]) && /aria-hidden="true"/.test(img[0])), 'Image needs descriptive alt or explicit decorative treatment');
    assert(/\bwidth=/.test(img[0]) && /\bheight=/.test(img[0]), 'Missing image dimensions');
  }
  for (const srcset of html.matchAll(/srcset="([^"]+)"/g)) {
    for (const candidate of srcset[1].split(',')) await access(join(dist, candidate.trim().split(/\s+/)[0]));
  }
  assert(!/<script\b/.test(html), 'Prototype should need no client JavaScript');
}
const headersFile = await readFile(join(dist, '_headers'), 'utf8');
// Check the emitted rules using Cloudflare's documented placeholder/splat semantics.
// This models only the syntax used here; live edge behavior still needs deployment QA.
const headerRules = headersFile.trim().split(/\n\s*\n/).map(block => {
  const [pattern, header] = block.split('\n');
  assert.equal(header.trim(), 'X-Robots-Tag: noindex, nofollow');
  const absolute = pattern.startsWith('https://');
  const target = absolute ? pattern.slice('https://'.length) : pattern;
  const escaped = target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = new RegExp('^' + escaped.replace(/:[A-Za-z]\w*/g, '[^./]+').replaceAll('\\*', '.*') + '$');
  return { pattern, absolute, match };
});
const headerFor = input => {
  const url = new URL(input);
  return headerRules.some(rule => rule.match.test((rule.absolute ? url.hostname : '') + url.pathname)) ? 'noindex, nofollow' : undefined;
};
const pagePaths = files.filter(file => file.endsWith('.html')).map(file => '/' + file.slice(dist.length + 1).replaceAll('\\', '/'));
const testPaths = ['/', '/nl/', '/en/menu/', '/missing-page/', '/robots.txt', '/sitemap.xml', '/icons/favicon.svg', ...pagePaths];
const pagesHosts = ['fullstackburgers-production.pages.dev', 'a1b2c3d4.fullstackburgers-production.pages.dev', 'main.fullstackburgers-production.pages.dev', 'feature-menu.fullstackburgers-production.pages.dev'];
for (const hostname of pagesHosts) for (const path of testPaths) for (const scheme of ['http', 'https']) {
  assert.equal(headerFor(scheme + '://' + hostname + path), 'noindex, nofollow', 'Pages hostname not protected: ' + hostname + path);
}
for (const hostname of ['www.fullstackburgers.nl', 'fullstackburgers.nl', 'www.fullstackburgers.nl.pages.dev.example.com', 'fullstackburgers-production.pages.dev.example.com']) {
  for (const path of testPaths) assert.equal(headerFor('https://' + hostname + path), deployment.staging ? 'noindex, nofollow' : undefined, 'Unexpected public-host header: ' + hostname + path);
}
assert.equal(headerFor('https://www.fullstackburgers.nl/?next=https://fullstackburgers-production.pages.dev/'), deployment.staging ? 'noindex, nofollow' : undefined, 'Query strings must not select a Pages hostname rule');
if (deployment.staging) {
  assert.equal(headersFile, '/*\n  X-Robots-Tag: noindex, nofollow\n');
  assert.equal(headerFor('https://beta.fullstackburgers.nl/nl/'), 'noindex, nofollow');
  await assert.rejects(access(join(dist, 'CNAME')));
} else {
  assert.equal((await readFile(join(dist, 'CNAME'), 'utf8')).trim(), 'www.fullstackburgers.nl');
  assert.deepEqual(headerRules.map(rule => rule.pattern), ['https://:project.pages.dev/*', 'https://:version.:project.pages.dev/*'], 'Production must have only hostname-specific Pages rules');
  for (const loc of sitemap.matchAll(/<loc>(.*?)<\/loc>/g)) assert(loc[1].startsWith(deployment.url + '/'));
}
console.log('Verified ' + deployment.environment + ': 8 localized pages, root/404 and 2 prototype pages; official menu/prices, locations/maps, original images/mascot, removed Ingredients routes, fonts, SEO, noindex, sitemap, robots, headers and CNAME.');
