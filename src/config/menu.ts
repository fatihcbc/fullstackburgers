// Current menu: version 03 poster, with confirmed snack portions and Red Bull pricing.
export const chickenSnacks = [
  { name: 'Chicken Strips', allergenId: 'classic-chicken-strips', pieces: 4, priceCents: 595, description: {
    nl: 'Goudbruine, krokante kipstrips, lekker mals en sappig vanbinnen.',
    en: 'Golden, crispy chicken strips with a tender, juicy centre.',
  } },
  { name: 'Spicy Chicken Strips', allergenId: 'spicy-chicken-strips', pieces: 4, priceCents: 595, description: {
    nl: 'Krokante kipstrips op Amerikaanse wijze, lekker pittig gekruid.',
    en: 'Crispy American-style chicken strips with a delicious spicy kick.',
  } },
  { name: 'Hot Wings', allergenId: 'hot-wings', pieces: 4, priceCents: 595, description: {
    nl: 'Krokante kippenvleugels met een smaakvol gekruid korstje.',
    en: 'Crispy, flavourful chicken wings with a deliciously seasoned coating.',
  } },
] as const;

export const drinks = [
  { name: 'Coca-Cola', priceCents: 325 },
  { name: 'Coca-Cola Zero', priceCents: 325 },
  { name: 'Fernandes', detail: { nl: 'diverse smaken', en: 'assorted flavours' }, priceCents: 325 },
  { name: 'Red Bull', priceCents: 395 },
] as const;

export const redBullComboSurchargeCents = 100;
