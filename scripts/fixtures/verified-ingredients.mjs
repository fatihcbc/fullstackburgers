// Independent checks against the nine declarations supplied by the business.
export const verifiedIngredients = {
  brioche: {
    nl: 'TARWEbloem, water, suiker, koolzaadolie, volle MELKpoeder, hele eieren, TARWEgluten, zout, gist, natuurlijk aroma, gedeactiveerde gist, MELKeiwit, geroosterd gemout roggemeel.',
    en: 'WHEAT flour, water, sugar, rapeseed oil, whole MILK powder, whole EGGS, WHEAT gluten, salt, yeast, natural flavouring, deactivated yeast, MILK protein, roasted malted RYE flour.',
    allergens: ['egg', 'gluten', 'milk'],
  },
  mayonnaise: {
    nl: 'Koolzaadolie (78%), gepasteuriseerd vloeibaar scharreleigeel (6,6%), azijn, water, mosterd (water, mosterdzaad, azijn, specerijen), glucose-fructosestroop, zout, suiker, citroenzuur, kaliumsorbaat, guarpitmeel, calciumdinatrium-EDTA, natuurlijk aroma, carotenen.',
    en: 'Rapeseed oil (78%), pasteurized liquid free-range egg yolk (6.6%), vinegar, water, mustard (water, mustard seeds, vinegar, spices), glucose-fructose syrup, salt, sugar, citric acid, potassium sorbate, guar gum, calcium disodium EDTA, natural flavouring, carotenes.',
    allergens: ['egg', 'mustard'],
  },
  ketchup: {
    nl: 'Tomatenpuree (134 g verse tomaten per 100 g saus), azijn, glucose-fructosestroop, gemodificeerd zetmeel (maïs, aardappel), zout, specerijen, natuurlijk aroma, kaliumsorbaat, citroenzuur, uienextract, acesulfaam-K, aspartaam.',
    en: 'Tomato puree (134 g fresh tomatoes per 100 g sauce), vinegar, glucose-fructose syrup, modified starch (corn, potato), salt, spices, natural flavouring, potassium sorbate, citric acid, onion extract, acesulfame-K, aspartame.',
    allergens: [],
  },
  mustard: {
    nl: 'Water, mosterdzaad, natuurazijn, zout, kurkuma, xanthaangom, natuurlijk aroma.',
    en: 'Water, mustard seed, natural vinegar, salt, turmeric, xanthan gum, natural flavouring.',
    allergens: ['mustard'],
  },
  cheddar: {
    nl: 'Gepasteuriseerde koemelk, zout, zuursel, microbieel stremsel, kleurstof (carotenen).',
    en: "Pasteurized cow's milk, salt, starter culture, microbial rennet, colouring (carotenes).",
    allergens: ['milk'],
  },
  gouda: {
    nl: 'Gepasteuriseerde koemelk, zout, melkzuur, dierlijk stremsel, kleurstof (carotenen).',
    en: "Pasteurized cow's milk, salt, lactic acid, animal rennet, colouring (carotenes).",
    allergens: ['milk'],
  },
  aioli: {
    nl: 'Geëmulgeerde saus (koolzaadolie, water, glucose-fructosestroop, scharreleigeel (3,3%), maïszetmeel, zout, gemodificeerd zetmeel, citroenzuur, azijnzuur, guarpitmeel, kaliumsorbaat, kruiden), knoflook (10%), olijfolie (10%), zout (2%), water, citroensap.',
    en: 'Emulsified sauce (rapeseed oil, water, glucose-fructose syrup, free-range egg yolk (3.3%), corn starch, salt, modified starch, citric acid, acetic acid, guar gum, potassium sorbate, herbs), garlic (10%), olive oil (10%), salt (2%), water, lemon juice.',
    allergens: ['egg'],
  },
  fries: {
    nl: 'Aardappel (94,9%), palmolie (4%), dextrose, stabilisator (trifosfaten).',
    en: 'Potato (94.9%), palm oil (4%), dextrose, stabilizer (triphosphates).',
    allergens: [],
  },
  fryingOil: {
    nl: 'Koolzaadolie, zonnebloemolie, palmolie, aroma, antischuimmiddel (dimethylpolysiloxaan).',
    en: 'Rapeseed oil, sunflower oil, palm oil, flavouring, anti-foaming agent (dimethylpolysiloxane).',
    allergens: [],
  },
};
