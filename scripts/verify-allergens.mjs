import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import assert from 'node:assert/strict';

for (const locale of ['nl', 'en']) {
  const route = locale === 'nl' ? '/nl/allergenen/' : '/en/allergens/';
  const html = await readFile(join('dist', route, 'index.html'), 'utf8');
  const menu = await readFile(join('dist', locale, 'menu', 'index.html'), 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, 'Allergen anchor IDs must be unique');
  for (const id of ['smash-burgers', 'chicken-burger', 'chicken-snacks', 'fries', 'sauces', 'classic-chicken-strips', 'spicy-chicken-strips', 'hot-wings', 'house-burger-sauce', 'honey-mustard-mayo', 'aioli', 'fritessaus', 'mustard', 'ketchup']) assert(ids.includes(id), 'Missing allergen anchor: ' + id);
  const menuLinks = [...menu.matchAll(/href="([^"#]+)#([^"]+)"/g)].filter(match => match[1] === route);
  assert.equal(menuLinks.length, 9, 'Each burger/snack/fries entry and sauces need a direct allergen link');
  assert.equal(menuLinks.filter(match => match[2] === 'smash-burgers').length, 3);
  for (const target of ['chicken-burger', 'classic-chicken-strips', 'spicy-chicken-strips', 'hot-wings', 'fries', 'sauces']) assert.equal(menuLinks.filter(match => match[2] === target).length, 1, 'Wrong product allergen link: ' + target);
  for (const link of [...menuLinks, ...html.matchAll(/href="()#([^"]+)"/g)]) assert(ids.includes(link[2]), 'Broken allergen fragment: ' + link[2]);
  const notice = html.match(/<aside\b[^>]*>([\s\S]*?)<\/aside>/)?.[1];
  assert(notice?.includes(locale === 'nl' ? 'vóór het bestellen bij ons personeel' : 'our staff about allergies or intolerances before ordering'), 'Missing before-ordering allergy notice');
  assert(notice.includes(locale === 'nl' ? 'niet volledig worden uitgesloten' : 'cannot be completely excluded'), 'Missing kitchen cross-contact warning');
  assert(!/allergen-free|allerg[eé]envrij|gluten-free|glutenvrij/i.test(html), 'Never claim allergen-free products');
  const card = id => {
    const body = [...html.matchAll(/<article\b[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/article>/g)].find(match => match[1] === id)?.[2];
    assert(body, 'Missing allergen product: ' + id);
    return body;
  };
  const knownLabel = locale === 'nl' ? 'Bevestigde ingrediëntenallergenen' : 'Confirmed ingredient allergens';
  for (const [id, nl, en] of [
    ['classic-chicken-strips', 'Tarwe (gluten).', 'Wheat (gluten).'],
    ['spicy-chicken-strips', 'Tarwe (gluten) en ei.', 'Wheat (gluten) and egg.'],
    ['house-burger-sauce', 'Ei, mosterd, soja, gluten uit tarwe/gerst en vis.', 'Egg, mustard, soy, wheat/barley gluten and fish.'],
    ['honey-mustard-mayo', 'Ei en mosterd.', 'Egg and mustard.'],
    ['aioli', 'Ei.', 'Egg.'], ['fritessaus', 'Ei en mosterd.', 'Egg and mustard.'], ['mustard', 'Mosterd.', 'Mustard.'],
  ]) assert(card(id).includes(knownLabel + ':</strong> ' + (locale === 'nl' ? nl : en)), 'Incorrect confirmed ingredient allergens: ' + id);
  for (const id of ['hot-wings', 'ketchup']) {
    assert(card(id).includes(locale === 'nl' ? 'Nog te bevestigen' : 'Pending verification'));
    assert(!card(id).includes(knownLabel), 'Do not invent known allergens: ' + id);
  }
  for (const id of ['aioli', 'fritessaus']) assert(card(id).includes(locale === 'nl' ? 'Volledige productspecificatie' : 'Complete product specification'));
  assert(card('smash-burger-profile').includes(locale === 'nl' ? 'geen volledige allergenenlijst' : 'not a complete allergen list'));
  for (const name of ['Single Smash Burger', 'Double Smash Burger', 'Triple Smash Burger']) assert(card('smash-burger-profile').includes(name));
  assert(card('chicken-original').includes('Family Chicken Crunchy Filetburger Original'));
  assert(card('chicken-original').includes(locale === 'nl' ? 'moeten nog worden bevestigd' : 'still require verification'));
  const fries = card('fries-profile');
  assert(fries.includes(locale === 'nl' ? 'geen allergenen geïdentificeerd' : 'No allergens have been identified'));
  assert(fries.includes(locale === 'nl' ? 'dezelfde frituurapparatuur' : 'same fryer equipment'));
  assert(fries.includes(locale === 'nl' ? 'gepaneerde kip' : 'breaded chicken'));
}
console.log('Verified bilingual allergen facts, incomplete specifications, safety notices and all product/jump anchors.');
