import type { Locale } from '../i18n';

type Translation = Record<Locale, string>;
interface AllergenItem {
  id: string;
  name: Translation;
  known?: Translation;
  pending?: Translation;
  note?: Translation;
}
interface AllergenSection { id: string; title: Translation; items: AllergenItem[]; }

// Only information supplied by the business. Pending specifications are not inferred.
export const allergenSections: AllergenSection[] = [
  { id: 'smash-burgers', title: { nl: 'Smash Burgers', en: 'Smash Burgers' }, items: [
    { id: 'smash-burger-profile', name: { nl: 'Single Smash Burger, Double Smash Burger & Triple Smash Burger', en: 'Single Smash Burger, Double Smash Burger & Triple Smash Burger' },
      known: { nl: 'De House Burger Sauce bevat ei, mosterd, soja, gluten uit tarwe/gerst en vis. De aioli bevat ei.', en: 'House Burger Sauce contains egg, mustard, soy, wheat/barley gluten and fish. Aioli contains egg.' },
      pending: { nl: 'Het volledige allergenenprofiel van de burgers is nog niet bevestigd. Specificaties van de overige burgeringrediënten en de volledige aiolispecificatie moeten nog worden gecontroleerd.', en: 'The complete burger allergen profile is not yet confirmed. Specifications for the remaining burger ingredients and the complete aioli specification still require verification.' },
      note: { nl: 'Deze drie burgers staan bij elkaar omdat hun allergenenprofielen grotendeels overeenkomen. De genoemde sausallergenen vormen geen volledige allergenenlijst voor de burger.', en: 'These three burgers are grouped because their allergen profiles are substantially the same. The listed sauce allergens are not a complete allergen list for the burger.' } },
  ] },
  { id: 'chicken-burger', title: { nl: 'Chicken Burger', en: 'Chicken Burger' }, items: [
    { id: 'chicken-original', name: { nl: 'Chicken Burger (Original)', en: 'Chicken Burger (Original)' },
      known: { nl: 'De huisgemaakte Honey Mustard Mayo bevat ei en mosterd.', en: 'Our homemade Honey Mustard Mayo contains egg and mustard.' },
      pending: { nl: 'De allergeneninformatie van Family Chicken Crunchy Filetburger Original en het volledige burgerprofiel moeten nog worden bevestigd.', en: 'Allergen information for Family Chicken Crunchy Filetburger Original and the complete burger profile still require verification.' },
      note: { nl: 'Op het menu: Crispy Chicken Burger, gemaakt met Family Chicken Crunchy Filetburger Original. De sausinformatie is geen volledige allergenenlijst voor de burger.', en: 'Listed on the menu as Crispy Chicken Burger, made with Family Chicken Crunchy Filetburger Original. The sauce information is not a complete allergen list for the burger.' } },
  ] },
  { id: 'chicken-snacks', title: { nl: 'Kipsnacks', en: 'Chicken Snacks' }, items: [
    { id: 'classic-chicken-strips', name: { nl: 'Classic Chicken Strips', en: 'Classic Chicken Strips' }, known: { nl: 'Tarwe (gluten).', en: 'Wheat (gluten).' }, note: { nl: 'Op het menu: Chicken Strips.', en: 'Listed on the menu as Chicken Strips.' } },
    { id: 'spicy-chicken-strips', name: { nl: 'Hot & Spicy Chicken Strips', en: 'Hot & Spicy Chicken Strips' }, known: { nl: 'Tarwe (gluten) en ei.', en: 'Wheat (gluten) and egg.' }, note: { nl: 'Op het menu: Spicy Chicken Strips.', en: 'Listed on the menu as Spicy Chicken Strips.' } },
    { id: 'hot-wings', name: { nl: 'Hot Wings', en: 'Hot Wings' }, pending: { nl: 'Allergeneninformatie moet nog worden bevestigd.', en: 'Allergen information is pending verification.' } },
  ] },
  { id: 'fries', title: { nl: 'Friet', en: 'Fries' }, items: [
    { id: 'fries-profile', name: { nl: 'Friet', en: 'Fries' },
      note: { nl: 'In de beschikbare ingrediënteninformatie zijn geen allergenen geïdentificeerd. Dit is geen garantie dat de friet geschikt is voor jouw allergie of intolerantie.', en: 'No allergens have been identified in the available ingredient information. This does not guarantee that the fries are suitable for your allergy or intolerance.' },
      pending: { nl: 'Risico op kruiscontact: friet en gepaneerde kip worden met dezelfde frituurapparatuur bereid. Daardoor kunnen allergenen van de kip of paneerlaag in de friet terechtkomen. Bespreek dit vóór het bestellen met ons personeel.', en: 'Cross-contact risk: fries and breaded chicken are prepared using the same fryer equipment. Allergens from the chicken or breading can therefore transfer to the fries. Discuss this with our staff before ordering.' } },
  ] },
  { id: 'sauces', title: { nl: 'Sauzen', en: 'Sauces' }, items: [
    { id: 'house-burger-sauce', name: { nl: 'House Burger Sauce', en: 'House Burger Sauce' }, known: { nl: 'Ei, mosterd, soja, gluten uit tarwe/gerst en vis.', en: 'Egg, mustard, soy, wheat/barley gluten and fish.' } },
    { id: 'honey-mustard-mayo', name: { nl: 'Honey Mustard Mayo', en: 'Honey Mustard Mayo' }, known: { nl: 'Ei en mosterd.', en: 'Egg and mustard.' } },
    { id: 'aioli', name: { nl: 'Aioli', en: 'Aioli' }, known: { nl: 'Ei.', en: 'Egg.' }, pending: { nl: 'Volledige productspecificatie moet nog worden bevestigd.', en: 'Complete product specification is pending verification.' } },
    { id: 'fritessaus', name: { nl: 'Fritessaus', en: 'Fritessaus' }, known: { nl: 'Ei en mosterd.', en: 'Egg and mustard.' }, pending: { nl: 'Volledige productspecificatie moet nog worden bevestigd.', en: 'Complete product specification is pending verification.' } },
    { id: 'mustard', name: { nl: 'Mosterd', en: 'Mustard' }, known: { nl: 'Mosterd.', en: 'Mustard.' } },
    { id: 'ketchup', name: { nl: 'Ketchup', en: 'Ketchup' }, pending: { nl: 'Allergeneninformatie moet nog worden bevestigd.', en: 'Allergen information is pending verification.' } },
  ] },
];

export const allergenCopy = {
  nl: {
    noticeTitle: 'Een allergie of intolerantie? Vertel het ons vóór je bestelt.',
    notice: 'Meld allergieën en intoleranties altijd vóór het bestellen bij ons personeel. Kruiscontact kan in onze foodtruckkeuken niet volledig worden uitgesloten.',
    limits: 'Deze pagina maakt onderscheid tussen bevestigde ingrediënteninformatie en informatie die nog moet worden gecontroleerd. Een ontbrekend allergeen of een onvolledige specificatie betekent niet dat een product geschikt is voor jouw allergie.',
    jump: 'Ga naar productgroep', known: 'Bevestigde ingrediëntenallergenen', pending: 'Nog te bevestigen', fryer: 'Gedeelde frituur: risico op kruiscontact', back: 'Terug naar het menu',
  },
  en: {
    noticeTitle: 'An allergy or intolerance? Tell us before ordering.',
    notice: 'Always inform our staff about allergies or intolerances before ordering. Cross-contact cannot be completely excluded in our food truck kitchen.',
    limits: 'This page distinguishes confirmed ingredient information from information still awaiting verification. An unlisted allergen or incomplete specification does not mean a product is suitable for your allergy.',
    jump: 'Jump to product group', known: 'Confirmed ingredient allergens', pending: 'Pending verification', fryer: 'Shared fryer: cross-contact risk', back: 'Back to the menu',
  },
} as const;
