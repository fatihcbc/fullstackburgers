import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import assert from 'node:assert/strict';
import { allergenCategories, ingredients, productGroups, declaredAllergens, productIngredients, productAllergenState } from '../src/config/allergens.ts';
import { verifiedIngredients } from './fixtures/verified-ingredients.mjs';

const categories = ['gluten', 'crustaceans', 'egg', 'fish', 'peanuts', 'soy', 'milk', 'nuts', 'celery', 'mustard', 'sesame', 'sulphites', 'lupin', 'molluscs'];
assert.deepEqual(allergenCategories.map(category => category.id), categories);
const products = productGroups.flatMap(group => group.products);
assert.equal(products.length, 14);
const product = id => { const result = products.find(item => item.id === id); assert(result, id); return result; };
const sorted = values => [...values].sort();
assert.deepEqual(sorted(declaredAllergens('brioche')), ['egg', 'gluten', 'milk']);
assert.deepEqual(sorted(declaredAllergens('houseSauce')), ['egg', 'fish', 'gluten', 'mustard', 'soy']);
assert.deepEqual(sorted(declaredAllergens('worcestershire')), ['fish', 'gluten']);
assert.deepEqual(sorted(declaredAllergens('kikkoman')), ['gluten', 'soy']);
const exactBun = 'TARWEbloem, water, suiker, koolzaadolie, volle MELKpoeder, hele eieren, TARWEgluten, zout, gist, natuurlijk aroma, gedeactiveerde gist, MELKeiwit, geroosterd gemout roggemeel.';
assert.equal(ingredients.brioche.composition.map(part => part.text.nl).join(''), exactBun, 'Preserve the confirmed bun composition exactly');
const declaredProducts = {
  'single-smash': ['gluten', 'egg', 'fish', 'soy', 'milk', 'mustard'],
  'double-smash': ['gluten', 'egg', 'fish', 'soy', 'milk', 'mustard'],
  'triple-smash': ['gluten', 'egg', 'fish', 'soy', 'milk', 'mustard'],
  'chicken-original': ['egg', 'mustard'],
  'classic-chicken-strips': ['gluten'], 'spicy-chicken-strips': ['gluten', 'egg'],
  'hot-wings': [], 'fries-profile': [],
  'house-burger-sauce': ['gluten', 'egg', 'fish', 'soy', 'mustard'],
  'honey-mustard-mayo': ['egg', 'mustard'], 'aioli': ['egg'], 'mayonnaise': ['egg', 'mustard'], 'mustard': ['mustard'], 'ketchup': [],
};
for (const [id, expected] of Object.entries(declaredProducts)) {
  assert.deepEqual(sorted(categories.filter(category => productAllergenState(product(id), category) === 'contains')), sorted(expected), 'Changed confirmed allergens: ' + id);
  const reviewedProducts = ['fries-profile', 'mayonnaise', 'aioli', 'mustard', 'ketchup'];
  for (const category of categories.filter(category => !expected.includes(category))) assert.equal(productAllergenState(product(id), category), reviewedProducts.includes(id) ? 'notIdentified' : 'unavailable', 'Missing data must not imply absence: ' + id);
}
for (const item of products) { assert(productIngredients(item).length); for (const entry of item.recipe) assert(ingredients[entry.ingredient]); }
assert(!productIngredients(product('chicken-original')).includes('brioche'), 'Do not assume an unconfirmed chicken bun supplier');
assert(!('fritessaus' in ingredients) && !products.some(item => item.id === 'fritessaus'), 'Unused Fritessaus must not remain active');
assert.equal(Object.keys(verifiedIngredients).length, 9);
for (const [id, expected] of Object.entries(verifiedIngredients)) {
  assert.equal(ingredients[id].reviewed, true);
  assert(ingredients[id].supplier, 'Keep internal supplier traceability: ' + id);
  assert.deepEqual(sorted(declaredAllergens(id)), expected.allergens, 'Wrong verified ingredient allergens: ' + id);
  for (const locale of ['nl', 'en']) assert.equal(ingredients[id].composition.map(part => part.text[locale]).join(''), expected[locale], 'Incomplete or changed declaration: ' + id + '/' + locale);
}
assert.equal(ingredients.aioli.supplier, 'BRESC Aioli Clasico 1 kg', 'Keep the verified 1 kg formulation');
for (const id of ['beef', 'onion', 'pickles', 'friedOnions', 'houseSauce', 'worcestershire', 'kikkoman', 'honeyMayo', 'chickenFillet', 'chickenBun', 'coleslaw', 'classicStrips', 'spicyStrips', 'wings']) assert.equal(ingredients[id].reviewed, false, 'Do not upgrade unrelated verification status: ' + id);
const component = await readFile('src/components/Allergens.astro', 'utf8');
assert(/\.matrix-scroll\s*\{[^}]*overflow-x:\s*auto/.test(component), 'Matrix must scroll horizontally');
assert(/\.product-name\s*\{[^}]*position:\s*sticky;\s*left:\s*0/.test(component), 'Product names must remain visible while scrolling');
assert(component.includes('writing-mode: vertical-rl') && component.includes('flex-wrap: wrap'), 'Preserve responsive headings and page links');
for (const id of ['fries-profile', 'chicken-original', 'classic-chicken-strips', 'spicy-chicken-strips', 'hot-wings']) assert(product(id).sharedFryer);
for (const [id, counts] of [['single-smash', [1, 1, 0]], ['double-smash', [2, 1, 1]], ['triple-smash', [3, 2, 1]]]) {
  assert.deepEqual(['beef', 'cheddar', 'gouda'].map(ingredient => product(id).recipe.find(entry => entry.ingredient === ingredient)?.quantity ?? 0), counts, 'Incorrect burger recipe: ' + id);
}

for (const locale of ['nl', 'en']) {
  const route = locale === 'nl' ? '/nl/allergenen/' : '/en/allergens/';
  const html = await readFile(join('dist', route, 'index.html'), 'utf8');
  const menu = await readFile(join('dist', locale, 'menu', 'index.html'), 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, 'Allergen IDs must be unique');
  for (const id of ['allergen-overview', 'ingredients-guide', 'important-information', 'smash-burger-profile', ...productGroups.map(group => group.id)]) assert(ids.includes(id), 'Missing section/legacy anchor: ' + id);
  for (const item of products) for (const id of [item.id, 'ingredients-' + item.id]) assert(ids.includes(id), 'Missing product anchor: ' + id);
  for (const brand of ['METRO Chef', 'BRESC', 'Marne', 'Kikkoman', 'Family Chicken']) assert(!html.includes(brand), 'Supplier branding leaked into public guide: ' + brand);
  assert(!/fritessaus/i.test(html), 'Unused Fritessaus must not appear in the public guide');
  for (const id of Object.keys(verifiedIngredients)) {
    const disclosures = [...html.matchAll(/<details\b[^>]*data-ingredient="([^"]+)"[^>]*>([\s\S]*?)<\/details>/g)].filter(match => match[1] === id);
    assert(disclosures.length > 0, 'Verified declaration is not publicly visible: ' + id);
    for (const disclosure of disclosures) {
      assert(!disclosure[2].includes(locale === 'nl' ? 'Volledige ingrediëntenlijst niet beschikbaar' : 'Complete ingredient list unavailable'), 'Verified ingredient marked unavailable: ' + id);
      const composition = disclosure[2].match(/<span\b[^>]*class="label"[^>]*>[^<]*<\/span>\s*([\s\S]*?)<\/p>/)?.[1];
      assert.equal(composition?.replace(/<[^>]*>/g, '').replaceAll('&#39;', "'").replaceAll('&amp;', '&'), verifiedIngredients[id][locale], 'Rendered declaration is incomplete: ' + id);
      assert(disclosure[2].includes(ingredients[id].name[locale]), 'Wrong public ingredient label: ' + id);
      if (verifiedIngredients[id].allergens.length) assert(/<strong\b/.test(composition), 'Declared allergens must be highlighted: ' + id);
    }
  }
  assert(html.includes(locale === 'nl' ? 'Bevat een bron van fenylalanine.' : 'Contains a source of phenylalanine.'), 'Ketchup needs its phenylalanine warning');
  const table = html.match(/<table\b[^>]*>([\s\S]*?)<\/table>/)?.[1];
  assert(table && table.includes('<caption'), 'Matrix must have a caption');
  assert.equal((table.match(/scope="col"/g) ?? []).length, 15, 'Product plus all 14 allergen headings');
  assert.equal((table.match(/scope="rowgroup"/g) ?? []).length, 5);
  for (const row of table.matchAll(/<tr\b[^>]*data-product="([^"]+)"[^>]*>([\s\S]*?)<\/tr>/g)) {
    const item = product(row[1]);
    assert(row[2].includes('scope="row"') && row[2].includes('href="#ingredients-' + item.id + '"'));
    assert.equal((row[2].match(/<td\b/g) ?? []).length, 14);
    for (const category of categories) assert(row[2].includes('data-allergen="' + category + '" data-state="' + productAllergenState(item, category) + '"'), 'Wrong rendered matrix state');
    if (item.sharedFryer) assert(row[2].includes('href="#important-information"'), 'Missing fryer risk indicator');
  }
  for (const link of html.matchAll(/href="#([^"]+)"/g)) assert(ids.includes(link[1]), 'Broken internal guide link: ' + link[1]);
  const menuLinks = [...menu.matchAll(/href="([^"#]+)#([^"]+)"/g)].filter(match => match[1] === route);
  assert.equal(menuLinks.length, 9);
  assert.equal(menuLinks.filter(match => match[2] === 'smash-burgers').length, 3);
  for (const link of menuLinks) assert(ids.includes(link[2]), 'Broken menu deep link: ' + link[2]);
  for (const id of ['chicken-burger', 'classic-chicken-strips', 'spicy-chicken-strips', 'hot-wings', 'fries', 'sauces']) assert.equal(menuLinks.filter(link => link[2] === id).length, 1);
  assert((html.match(/<details\b/g) ?? []).length > 40, 'Ingredients should use native expandable disclosures');
  assert.equal((html.match(/<details\b/g) ?? []).length, (html.match(/<summary\b/g) ?? []).length);
  assert(/<strong\b[^>]*>(TARWEbloem|WHEAT flour)<\/strong>/.test(html));
  assert(new RegExp('<strong\\b[^>]*>' + (locale === 'nl' ? 'geroosterd gemout roggemeel' : 'roasted malted RYE flour') + '<\\/strong>').test(html));
  for (const name of (locale === 'nl' ? ['Worcestersaus', 'Sojasaus', 'Krokante kipfilet (Original)'] : ['Worcestershire sauce', 'Soy sauce', 'Crunchy chicken fillet (Original)'])) assert(html.includes(name));
  const notice = html.match(/<aside\b[^>]*>([\s\S]*?)<\/aside>/)?.[1];
  assert(notice?.includes(locale === 'nl' ? 'vóór het bestellen bij ons personeel' : 'our staff about allergies or intolerances before ordering'));
  assert(notice.includes(locale === 'nl' ? 'niet volledig worden uitgesloten' : 'cannot be completely excluded'));
  assert(html.includes(locale === 'nl' ? 'dezelfde frituurapparatuur' : 'same fryer equipment'));
  assert(html.includes(locale === 'nl' ? 'gepaneerde kipproducten' : 'breaded chicken products'));
  assert(!/allergen-free|allerg[eé]envrij|gluten-free|glutenvrij/i.test(html));
  assert(html.includes('role="region"') && html.includes('tabindex="0"') && html.includes('aria-describedby="matrix-help allergen-legend"'));
}
console.log('Verified 14-category matrices, shared ingredient derivation, expandable guides, safety notices and all legacy/product anchors in both languages.');
