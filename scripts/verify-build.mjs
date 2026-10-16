import { readFile, readdir, access } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import assert from 'node:assert/strict';
import { resolveDeployment } from '../config/environment.mjs';
const deployment = resolveDeployment(process.env);
const dist = resolve('dist');
async function walk(dir) { return (await Promise.all((await readdir(dir, { withFileTypes: true })).map(e => e.isDirectory() ? walk(join(dir, e.name)) : join(dir, e.name)))).flat(); }
const files = await walk(dist);
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
for (const file of pages) {
  const html = await readFile(file, 'utf8');
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
  const isRoot = file === join(dist, 'index.html');
  const is404 = file === join(dist, '404.html');
  assert(!/\/(nl\/ingredienten|en\/ingredients)\//.test(html), 'Removed Ingredients route is still linked');
  assert(!/placeholder\.svg|social-card\.svg|tijdelijk beeld|temporary brand artwork|voorbeeldburger|sample burger|The Classic|The Green|The Special/i.test(html), 'Placeholder content remains: ' + file);
  assert(html.includes('href="/fonts/roboto/roboto-latin-normal.woff2"'), 'Missing local font preload: ' + file);
  assert(!/https?:\/\/fonts\.(googleapis|gstatic)\.com/.test(html), 'Unexpected external font request');
  if (deployment.staging || prototypePaths.includes(file)) assert(html.includes('<meta name="robots" content="noindex,nofollow"'), 'Missing noindex: ' + file);
  else if (isRoot) assert(html.includes('<meta name="robots" content="noindex,follow"'));
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
  assert(home.includes('/media/pixel/10x10%20cm%20drukwerk.svg'), 'Missing original mascot');
  assert(home.includes('truck-1.') && home.includes('type="image/webp"') && home.includes('fetchpriority="high"'), 'Missing optimized original truck hero');
  assert(home.includes(locale === 'nl' ? 'Smashburgers' : 'Almere-based smash burger food truck'));
  for (const html of [home, locations]) {
    for (const [day, name, query] of [
      [locale === 'nl' ? 'Zondag' : 'Sunday', 'Almere Muziekwijk', 'Almere Muziekwijk'],
      [locale === 'nl' ? 'Maandag' : 'Monday', 'Homerusplein, Almere Poort', 'Homerusplein, Almere Poort'],
    ]) {
      assert(html.includes(day) && html.includes(name), 'Missing regular location');
      assert(html.includes('https://www.google.com/maps/search/?api=1&amp;query=' + encodeURIComponent(query)), 'Missing Google Maps search link');
    }
    assert(!/openingHours|\d{1,2}:\d{2}/.test(html), 'Opening times were not supplied');
  }
  assert(menu.includes('/media/posters-01.jpg') && menu.includes('posters-01.') && menu.includes('type="image/webp"'), 'Missing official optimized poster and full-size link');
  for (const product of ['Single Smash Burger', 'Double Smash Burger', 'Triple Smash Burger']) assert(menu.includes(product));
  for (const cents of [795, 1095, 995, 1295, 1195, 1495, 350, 325]) {
    const price = new Intl.NumberFormat(locale === 'nl' ? 'nl-NL' : 'en-IE', { style: 'currency', currency: 'EUR' }).format(cents / 100);
    assert(menu.includes(price), 'Missing official price ' + price);
  }
  assert(menu.includes(locale === 'nl' ? 'burger, friet en frisdrank' : 'burger, fries and a soft drink'), 'Missing combo contents');
}
for (const relative of ['media/truck-1.jpeg', 'media/posters-01.jpg', 'media/pixel/10x10 cm drukwerk.svg', 'media/logo/10x10 cm logo drukwerk.svg']) {
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
if (deployment.staging) {
  assert.equal(await readFile(join(dist, '_headers'), 'utf8'), '/*\n  X-Robots-Tag: noindex, nofollow\n');
  await assert.rejects(access(join(dist, 'CNAME')));
} else {
  assert.equal((await readFile(join(dist, 'CNAME'), 'utf8')).trim(), 'www.fullstackburgers.nl');
  await assert.rejects(access(join(dist, '_headers')));
  for (const loc of sitemap.matchAll(/<loc>(.*?)<\/loc>/g)) assert(loc[1].startsWith(deployment.url + '/'));
}
console.log('Verified ' + deployment.environment + ': 8 localized pages, root/404 and 2 prototype pages; official menu/prices, locations/maps, original images/mascot, removed Ingredients routes, fonts, SEO, noindex, sitemap, robots, headers and CNAME.');
