import type { Locale } from '../i18n';
type Translation = Record<Locale, string>;
const both = (text: string): Translation => ({ nl: text, en: text });

// The 14 EU categories. Only business-supplied product information is used below.
export const allergenCategories = [
  { id: 'gluten', name: { nl: 'Glutenbevattende granen', en: 'Cereals containing gluten' } },
  { id: 'crustaceans', name: { nl: 'Schaaldieren', en: 'Crustaceans' } },
  { id: 'egg', name: { nl: 'Ei', en: 'Egg' } },
  { id: 'fish', name: { nl: 'Vis', en: 'Fish' } },
  { id: 'peanuts', name: { nl: 'Pinda’s', en: 'Peanuts' } },
  { id: 'soy', name: { nl: 'Soja', en: 'Soy' } },
  { id: 'milk', name: { nl: 'Melk', en: 'Milk' } },
  { id: 'nuts', name: { nl: 'Noten', en: 'Nuts' } },
  { id: 'celery', name: { nl: 'Selderij', en: 'Celery' } },
  { id: 'mustard', name: { nl: 'Mosterd', en: 'Mustard' } },
  { id: 'sesame', name: { nl: 'Sesamzaad', en: 'Sesame' } },
  { id: 'sulphites', name: { nl: 'Zwaveldioxide en sulfieten', en: 'Sulphur dioxide and sulphites' } },
  { id: 'lupin', name: { nl: 'Lupine', en: 'Lupin' } },
  { id: 'molluscs', name: { nl: 'Weekdieren', en: 'Molluscs' } },
] as const;
export type AllergenId = typeof allergenCategories[number]['id'];
interface CompositionPart { text: Translation; allergens?: AllergenId[]; }
export interface Ingredient {
  name: Translation;
  supplier?: string;
  composition?: CompositionPart[];
  declared: AllergenId[];
  components?: string[];
  // True only when available information supports a 'not identified' cell.
  reviewed: boolean;
  note?: Translation;
}
export const ingredients: Record<string, Ingredient> = {
  brioche: {
    name: { nl: 'Brioche burgerbroodje', en: 'Brioche burger bun' }, supplier: 'METRO Chef Brioche Burgerbun 6×77 g', declared: [], reviewed: true,
    composition: [
      { text: { nl: 'TARWEbloem', en: 'WHEAT flour' }, allergens: ['gluten'] },
      { text: { nl: ', water, suiker, koolzaadolie, ', en: ', water, sugar, rapeseed oil, ' } },
      { text: { nl: 'volle MELKpoeder', en: 'whole MILK powder' }, allergens: ['milk'] },
      { text: both(', ') },
      { text: { nl: 'hele eieren', en: 'whole EGGS' }, allergens: ['egg'] },
      { text: both(', ') },
      { text: { nl: 'TARWEgluten', en: 'WHEAT gluten' }, allergens: ['gluten'] },
      { text: { nl: ', zout, gist, natuurlijk aroma, gedeactiveerde gist, ', en: ', salt, yeast, natural flavouring, deactivated yeast, ' } },
      { text: { nl: 'MELKeiwit', en: 'MILK protein' }, allergens: ['milk'] },
      { text: both(', ') },
      { text: { nl: 'geroosterd gemout roggemeel', en: 'roasted malted RYE flour' }, allergens: ['gluten'] },
      { text: both('.') },
    ],
    note: { nl: 'Glutenbronnen: tarwe en rogge.', en: 'Gluten sources: wheat and rye.' },
  },
  beef: { name: { nl: 'Rundvlees-smashpatty (minimaal 60 g)', en: 'Beef smash patty (at least 60 g)' }, declared: [], reviewed: false },
  cheddar: { name: { nl: 'Cheddar kaas', en: 'Cheddar cheese' }, supplier: 'METRO Chef Cheddar 50+ sliced 500 g', declared: [], reviewed: true,
    composition: [
      { text: { nl: 'Gepasteuriseerde koemelk', en: "Pasteurized cow's milk" }, allergens: ['milk'] },
      { text: { nl: ', zout, zuursel, microbieel stremsel, kleurstof (carotenen).', en: ', salt, starter culture, microbial rennet, colouring (carotenes).' } },
    ] },
  gouda: { name: { nl: 'Goudse kaas', en: 'Gouda cheese' }, supplier: 'METRO Chef Young Gouda 48+ slices 500 g', declared: [], reviewed: true,
    composition: [
      { text: { nl: 'Gepasteuriseerde koemelk', en: "Pasteurized cow's milk" }, allergens: ['milk'] },
      { text: { nl: ', zout, melkzuur, dierlijk stremsel, kleurstof (carotenen).', en: ', salt, lactic acid, animal rennet, colouring (carotenes).' } },
    ] },
  onion: { name: { nl: 'Verse rauwe ui', en: 'Fresh raw onion' }, declared: [], reviewed: false },
  pickles: { name: { nl: 'Plakjes dille-augurk', en: 'Sliced dill pickles' }, declared: [], reviewed: false },
  friedOnions: { name: { nl: 'Krokant gebakken uitjes', en: 'Crispy fried onions' }, declared: [], reviewed: false },
  houseSauce: {
    name: both('House Burger Sauce'), declared: ['egg', 'mustard'], reviewed: false,
    components: ['worcestershire', 'kikkoman'],
    note: { nl: 'Eigen recept. Ei en mosterd zijn eerder bevestigd; de overige hieronder genoemde allergenen komen uit worcestersaus en sojasaus. Dit is geen volledige ingrediëntenlijst.', en: 'Our own recipe. Egg and mustard were previously confirmed; the other allergens below come from Worcestershire sauce and soy sauce. This is not a complete ingredient list.' },
  },
  worcestershire: {
    name: { nl: 'Worcestersaus', en: 'Worcestershire sauce' }, declared: ['gluten', 'fish'], reviewed: false,
    note: { nl: 'Bevestigd: gluten uit gerst en vis.', en: 'Confirmed: barley gluten and fish.' },
  },
  kikkoman: {
    name: { nl: 'Sojasaus', en: 'Soy sauce' }, supplier: 'Kikkoman soy sauce', declared: ['gluten', 'soy'], reviewed: false,
    note: { nl: 'Bevestigd: gluten uit tarwe en soja.', en: 'Confirmed: wheat gluten and soy.' },
  },
  honeyMayo: { name: both('Honey Mustard Mayo'), declared: ['egg', 'mustard'], reviewed: false },
  mayonnaise: { name: { nl: 'Mayonaise', en: 'Mayonnaise' }, supplier: 'METRO Chef Mayonaise 80% 750 ml', declared: [], reviewed: true,
    composition: [
      { text: { nl: 'Koolzaadolie (78%), ', en: 'Rapeseed oil (78%), ' } },
      { text: { nl: 'gepasteuriseerd vloeibaar scharreleigeel (6,6%)', en: 'pasteurized liquid free-range egg yolk (6.6%)' }, allergens: ['egg'] },
      { text: { nl: ', azijn, water, ', en: ', vinegar, water, ' } },
      { text: { nl: 'mosterd', en: 'mustard' }, allergens: ['mustard'] },
      { text: { nl: ' (water, ', en: ' (water, ' } },
      { text: { nl: 'mosterdzaad', en: 'mustard seeds' }, allergens: ['mustard'] },
      { text: { nl: ', azijn, specerijen), glucose-fructosestroop, zout, suiker, citroenzuur, kaliumsorbaat, guarpitmeel, calciumdinatrium-EDTA, natuurlijk aroma, carotenen.', en: ', vinegar, spices), glucose-fructose syrup, salt, sugar, citric acid, potassium sorbate, guar gum, calcium disodium EDTA, natural flavouring, carotenes.' } },
    ] },
  aioli: { name: both('Aioli'), supplier: 'BRESC Aioli Clasico 1 kg', declared: [], reviewed: true,
    composition: [
      { text: { nl: 'Geëmulgeerde saus (koolzaadolie, water, glucose-fructosestroop, ', en: 'Emulsified sauce (rapeseed oil, water, glucose-fructose syrup, ' } },
      { text: { nl: 'scharreleigeel (3,3%)', en: 'free-range egg yolk (3.3%)' }, allergens: ['egg'] },
      { text: { nl: ', maïszetmeel, zout, gemodificeerd zetmeel, citroenzuur, azijnzuur, guarpitmeel, kaliumsorbaat, kruiden), knoflook (10%), olijfolie (10%), zout (2%), water, citroensap.', en: ', corn starch, salt, modified starch, citric acid, acetic acid, guar gum, potassium sorbate, herbs), garlic (10%), olive oil (10%), salt (2%), water, lemon juice.' } },
    ] },
  mustard: { name: { nl: 'Franse mosterd', en: 'French mustard' }, supplier: 'Marne Franse Mosterd 800 ml', declared: [], reviewed: true,
    composition: [
      { text: { nl: 'Water, ', en: 'Water, ' } },
      { text: { nl: 'mosterdzaad', en: 'mustard seed' }, allergens: ['mustard'] },
      { text: { nl: ', natuurazijn, zout, kurkuma, xanthaangom, natuurlijk aroma.', en: ', natural vinegar, salt, turmeric, xanthan gum, natural flavouring.' } },
    ] },
  ketchup: { name: { nl: 'Tomatenketchup', en: 'Tomato ketchup' }, supplier: 'METRO Chef Tomato Ketchup 750 ml', declared: [], reviewed: true,
    composition: [{ text: {
      nl: 'Tomatenpuree (134 g verse tomaten per 100 g saus), azijn, glucose-fructosestroop, gemodificeerd zetmeel (maïs, aardappel), zout, specerijen, natuurlijk aroma, kaliumsorbaat, citroenzuur, uienextract, acesulfaam-K, aspartaam.',
      en: 'Tomato puree (134 g fresh tomatoes per 100 g sauce), vinegar, glucose-fructose syrup, modified starch (corn, potato), salt, spices, natural flavouring, potassium sorbate, citric acid, onion extract, acesulfame-K, aspartame.',
    } }], note: { nl: 'Bevat een bron van fenylalanine.', en: 'Contains a source of phenylalanine.' } },
  chickenFillet: { name: { nl: 'Krokante kipfilet (Original)', en: 'Crunchy chicken fillet (Original)' }, supplier: 'Family Chicken Crunchy Filetburger Original', declared: [], reviewed: false },
  chickenBun: { name: { nl: 'Zacht burgerbroodje', en: 'Soft burger bun' }, declared: [], reviewed: false },
  coleslaw: { name: both('Coleslaw'), declared: [], reviewed: false },
  classicStrips: { name: both('Classic Chicken Strips'), declared: ['gluten'], reviewed: false, note: { nl: 'Glutenbron: tarwe. Op het menu: Chicken Strips.', en: 'Gluten source: wheat. Listed on the menu as Chicken Strips.' } },
  spicyStrips: { name: both('Hot & Spicy Chicken Strips'), declared: ['gluten', 'egg'], reviewed: false, note: { nl: 'Glutenbron: tarwe. Op het menu: Spicy Chicken Strips.', en: 'Gluten source: wheat. Listed on the menu as Spicy Chicken Strips.' } },
  wings: { name: both('Hot Wings'), declared: [], reviewed: false },
  fries: { name: { nl: 'Friet', en: 'French fries' }, supplier: 'METRO Chef Frites 9×9 mm 2.5 kg', declared: [], reviewed: true,
    composition: [{ text: { nl: 'Aardappel (94,9%), palmolie (4%), dextrose, stabilisator (trifosfaten).', en: 'Potato (94.9%), palm oil (4%), dextrose, stabilizer (triphosphates).' } }],
    note: { nl: 'Geen EU-14-allergenen geïdentificeerd in de aangeleverde ingrediëntendeclaratie.', en: 'No EU 14 allergens identified in the supplied ingredient declaration.' } },
  fryingOil: { name: { nl: 'Frituurolie', en: 'Frying oil' }, supplier: 'METRO Chef Frituurolie 15 L', declared: [], reviewed: true,
    composition: [{ text: { nl: 'Koolzaadolie, zonnebloemolie, palmolie, aroma, antischuimmiddel (dimethylpolysiloxaan).', en: 'Rapeseed oil, sunflower oil, palm oil, flavouring, anti-foaming agent (dimethylpolysiloxane).' } }],
    note: { nl: 'Geen EU-14-allergenen geïdentificeerd in de aangeleverde ingrediëntendeclaratie.', en: 'No EU 14 allergens identified in the supplied ingredient declaration.' } },
};

export interface Product {
  id: string;
  name: Translation;
  recipe: { ingredient: string; quantity?: number }[];
  sharedFryer?: boolean;
}
const toppings = [{ ingredient: 'aioli' }, { ingredient: 'onion' }, { ingredient: 'pickles' }, { ingredient: 'friedOnions' }, { ingredient: 'houseSauce' }];
export const productGroups: { id: string; legacyId?: string; name: Translation; products: Product[] }[] = [
  { id: 'smash-burgers', legacyId: 'smash-burger-profile', name: both('Smash Burgers'), products: [
    { id: 'single-smash', name: both('Single Smash Burger'), recipe: [{ ingredient: 'brioche', quantity: 1 }, { ingredient: 'beef', quantity: 1 }, { ingredient: 'cheddar', quantity: 1 }, ...toppings] },
    { id: 'double-smash', name: both('Double Smash Burger'), recipe: [{ ingredient: 'brioche', quantity: 1 }, { ingredient: 'beef', quantity: 2 }, { ingredient: 'cheddar', quantity: 1 }, { ingredient: 'gouda', quantity: 1 }, ...toppings] },
    { id: 'triple-smash', name: both('Triple Smash Burger'), recipe: [{ ingredient: 'brioche', quantity: 1 }, { ingredient: 'beef', quantity: 3 }, { ingredient: 'cheddar', quantity: 2 }, { ingredient: 'gouda', quantity: 1 }, ...toppings] },
  ] },
  { id: 'chicken-burger', name: { nl: 'Kipburgers', en: 'Chicken Burgers' }, products: [
    { id: 'chicken-original', name: both('Chicken Burger (Original)'), sharedFryer: true, recipe: [{ ingredient: 'chickenBun' }, { ingredient: 'chickenFillet' }, { ingredient: 'coleslaw' }, { ingredient: 'pickles' }, { ingredient: 'honeyMayo' }, { ingredient: 'fryingOil' }] },
  ] },
  { id: 'chicken-snacks', name: { nl: 'Kipsnacks', en: 'Chicken Snacks' }, products: [
    { id: 'classic-chicken-strips', name: both('Classic Chicken Strips'), sharedFryer: true, recipe: [{ ingredient: 'classicStrips' }, { ingredient: 'fryingOil' }] },
    { id: 'spicy-chicken-strips', name: both('Hot & Spicy Chicken Strips'), sharedFryer: true, recipe: [{ ingredient: 'spicyStrips' }, { ingredient: 'fryingOil' }] },
    { id: 'hot-wings', name: both('Hot Wings'), sharedFryer: true, recipe: [{ ingredient: 'wings' }, { ingredient: 'fryingOil' }] },
  ] },
  { id: 'fries', name: { nl: 'Friet', en: 'Fries' }, products: [
    { id: 'fries-profile', name: { nl: 'Friet', en: 'French fries' }, sharedFryer: true, recipe: [{ ingredient: 'fries' }, { ingredient: 'fryingOil' }] },
  ] },
  { id: 'sauces', name: { nl: 'Sauzen', en: 'Sauces' }, products: [
    { id: 'house-burger-sauce', name: both('House Burger Sauce'), recipe: [{ ingredient: 'houseSauce' }] },
    { id: 'honey-mustard-mayo', name: both('Honey Mustard Mayo'), recipe: [{ ingredient: 'honeyMayo' }] },
    { id: 'aioli', name: both('Aioli'), recipe: [{ ingredient: 'aioli' }] },
    { id: 'mayonnaise', name: { nl: 'Mayonaise', en: 'Mayonnaise' }, recipe: [{ ingredient: 'mayonnaise' }] },
    { id: 'mustard', name: { nl: 'Franse mosterd', en: 'French mustard' }, recipe: [{ ingredient: 'mustard' }] },
    { id: 'ketchup', name: { nl: 'Tomatenketchup', en: 'Tomato ketchup' }, recipe: [{ ingredient: 'ketchup' }] },
  ] },
];

export function ingredientIds(id: string, ancestors: string[] = []): string[] {
  if (!ingredients[id] || ancestors.includes(id)) throw new Error('Invalid ingredient reference: ' + id);
  return [id, ...(ingredients[id].components ?? []).flatMap(child => ingredientIds(child, [...ancestors, id]))];
}
export function declaredAllergens(id: string): AllergenId[] {
  return [...new Set(ingredientIds(id).flatMap(key => [...ingredients[key].declared, ...(ingredients[key].composition ?? []).flatMap(part => part.allergens ?? [])]))];
}
export function productIngredients(product: Product): string[] {
  return [...new Set(product.recipe.flatMap(item => ingredientIds(item.ingredient)))];
}
export type AllergenState = 'contains' | 'notIdentified' | 'unavailable';
export function productAllergenState(product: Product, allergen: AllergenId): AllergenState {
  const ids = productIngredients(product);
  if (product.recipe.some(item => declaredAllergens(item.ingredient).includes(allergen))) return 'contains';
  return ids.every(id => ingredients[id].reviewed) ? 'notIdentified' : 'unavailable';
}
export const indicatorSymbols = { contains: '●', notIdentified: '—', unavailable: '?' } as const;

export const allergenCopy = {
  nl: {
    overview: 'Allergenenoverzicht', guide: 'Ingrediëntenwijzer', information: 'Belangrijke informatie',
    noticeTitle: 'Een allergie of intolerantie? Vertel het ons vóór je bestelt.',
    notice: 'Meld allergieën en intoleranties altijd vóór het bestellen bij ons personeel. Kruiscontact kan in onze foodtruckkeuken niet volledig worden uitgesloten.',
    limits: 'Dit overzicht toont bevestigde allergenen uit de beschikbare ingrediënteninformatie. Een vraagteken betekent dat informatie ontbreekt. Een streepje is geen garantie dat een product geschikt is voor jouw allergie of intolerantie.',
    fryer: 'Friet en gepaneerde kipproducten worden met dezelfde frituurapparatuur bereid. Daardoor kunnen allergenen worden overgedragen. Bespreek dit vóór het bestellen met ons personeel.',
    risk: 'Kruiscontactrisico door gedeelde frituurapparatuur. Dit is een waarschuwing voor het product, geen verklaring over een specifiek allergeen.',
    contains: 'Bevat dit allergeen', notIdentified: 'Geen allergeen geïdentificeerd in de beschikbare ingrediënteninformatie', unavailable: 'Informatie niet beschikbaar',
    scroll: 'Veeg horizontaal om alle 14 allergenen te bekijken. De productnaam blijft zichtbaar. Selecteer een product voor de ingrediëntenwijzer.',
    product: 'Product', legend: 'Legenda', table: 'Allergenen per product: alle 14 EU-allergenen',
    composition: 'Beschikbare ingrediënten', declared: 'Bevestigde allergenen', quantity: 'Aantal',
    ingredientUnavailable: 'Volledige ingrediëntenlijst niet beschikbaar', specification: 'Niet genoemde allergenen zijn niet bevestigd als afwezig.',
    guideIntro: 'Klap een ingrediënt open voor de beschikbare samenstelling en bevestigde allergenen. Vetgedrukte woorden markeren verklaarde allergenen.',
    back: 'Terug naar het menu', backMatrix: 'Terug naar het overzicht', jump: 'Op deze pagina',
  },
  en: {
    overview: 'Allergen Overview', guide: 'Ingredients Guide', information: 'Important Information',
    noticeTitle: 'An allergy or intolerance? Tell us before ordering.',
    notice: 'Always inform our staff about allergies or intolerances before ordering. Cross-contact cannot be completely excluded in our food truck kitchen.',
    limits: 'This overview shows confirmed allergens from the available ingredient information. A question mark means information is missing. A dash does not guarantee that a product is suitable for your allergy or intolerance.',
    fryer: 'Fries and breaded chicken products are prepared using the same fryer equipment. Allergens can therefore transfer between products. Discuss this with our staff before ordering.',
    risk: 'Cross-contact risk from shared fryer equipment. This is a product-level warning, not a declaration about a specific allergen.',
    contains: 'Contains this allergen', notIdentified: 'No allergen identified in the available ingredient information', unavailable: 'Information unavailable',
    scroll: 'Scroll horizontally to see all 14 allergens. Product names stay visible. Select a product to open its ingredients guide.',
    product: 'Product', legend: 'Legend', table: 'Allergens by product: all 14 EU allergen categories',
    composition: 'Available ingredients', declared: 'Confirmed allergens', quantity: 'Quantity',
    ingredientUnavailable: 'Complete ingredient list unavailable', specification: 'Unlisted allergens have not been confirmed absent.',
    guideIntro: 'Expand an ingredient to see the available composition and confirmed allergens. Declared allergens are highlighted in bold.',
    back: 'Back to the menu', backMatrix: 'Back to the overview', jump: 'On this page',
  },
} as const;
