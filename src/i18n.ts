export const locales = ['nl', 'en'] as const;
export type Locale = typeof locales[number];
export const pages = ['home', 'menu', 'about', 'ingredients', 'locations'] as const;
export type Page = typeof pages[number];
const slugs = {
  nl: { home: '', menu: 'menu', about: 'over-ons', ingredients: 'ingredienten', locations: 'locaties-evenementen' },
  en: { home: '', menu: 'menu', about: 'about', ingredients: 'ingredients', locations: 'locations-events' },
};
export function pageUrl(locale: Locale, page: Page) { return '/' + locale + '/' + (slugs[locale][page] ? slugs[locale][page] + '/' : ''); }
export const copy = {
  nl: {
    nav: { home: 'Home', menu: 'Menu', about: 'Over ons', ingredients: 'Ingrediënten', locations: 'Locaties & evenementen' },
    descriptions: { home: 'Ontdek Fullstack Burgers. Bekijk ons voorbeeldmenu en volg de plannen voor onze volgende stop.', menu: 'Een eerste blik op het Fullstack Burgers menu. Ontdek de burgers die we aan het ontwikkelen zijn.', about: 'Maak kennis met het verhaal achter Fullstack Burgers en onze plannen voor de toekomst.', ingredients: 'Ontdek de ingrediënten en smaken die we onderzoeken voor Fullstack Burgers.', locations: 'Volg de toekomstige locaties en evenementen van Fullstack Burgers. Bevestigde stops volgen later.' },
    skip: 'Ga naar inhoud', preview: 'In ontwikkeling · voorbeeldcontent en tijdelijke beelden',
    eyebrow: 'Fullstack Burgers / Binnenkort', hero: 'Grote trek.\nGoed gebouwd.',
    intro: 'Een nieuwe burgerervaring is in de maak. Ontdek de eerste ideeën voor ons menu, ons verhaal en waar je ons straks vindt.',
    menuCta: 'Ontdek het menu', locationCta: 'Vind onze volgende stop',
    stop: 'De volgende stop', stopTitle: 'Onze route krijgt vorm.', stopText: 'Er zijn nog geen bevestigde locaties of tijden. Zodra onze planning klaar is, vind je die hier.',
    showcase: 'De eerste selectie', showcaseText: 'Drie ideeën om naar uit te kijken. Namen en samenstellingen zijn voorlopig.',
    story: 'Achter de burgers', storyTitle: 'Een goed idee begint bij de basis.', storyText: 'Dit is de plek voor ons verhaal: de mensen, de foodtruck en de liefde voor burgers. Het volledige verhaal volgt binnenkort.',
    storyCta: 'Maak kennis met ons', ingredients: 'Wat erin gaat', ingredientsTitle: 'Van de eerste hap tot de laatste.', ingredientsText: 'We werken aan de details. Informatie over herkomst, leveranciers en allergenen volgt zodra het menu definitief is.',
    ingredientItems: ['Het broodje', 'De burger', 'De finishing touch'], ingredientDetails: ['Een basis die alles samenbrengt.', 'Het middelpunt van iedere hap.', 'Sauzen en toppings die het afmaken.'],
    social: 'Een kijkje achter de schermen', socialText: 'Hier delen we straks momenten uit de keuken en onderweg. Onze officiële social links volgen later.',
    socialLabels: ['Uit de keuken', 'Onderweg', 'Samen aan tafel'],
    placeholder: 'Voorbeeld', imageLabel: 'Tijdelijk beeld', footer: 'Burgers in ontwikkeling. Meer volgt binnenkort.',
    menuIntro: 'Ons menu krijgt vorm. Dit zijn voorbeeldburgers; beschikbaarheid, prijzen en allergenen worden later bevestigd.',
    aboutIntro: 'Fullstack Burgers krijgt vorm. Binnenkort delen we hier wie we zijn en wat ons drijft.',
    aboutDetail: 'Ruimte voor het echte verhaal', aboutBody: 'De ontstaansgeschiedenis, het team en de foodtruck krijgen hier een eigen plek. Deze tekst wordt vervangen door ons definitieve verhaal.',
    locationsIntro: 'Een plek om onze route te volgen: van een volgende stop tot een bijzonder evenement.',
    eventsTitle: 'Locaties & plannen', unconfirmed: 'Nog niet bevestigd', noDate: 'Datum volgt',
  },
  en: {
    nav: { home: 'Home', menu: 'Menu', about: 'About', ingredients: 'Ingredients', locations: 'Locations & events' },
    descriptions: { home: 'Discover Fullstack Burgers. Explore our sample menu and follow the plans for our next stop.', menu: 'A first look at the Fullstack Burgers menu. Explore the burgers we are developing.', about: 'Meet the story behind Fullstack Burgers and discover our plans for the future.', ingredients: 'Explore the ingredients and flavours we are considering for Fullstack Burgers.', locations: 'Follow future Fullstack Burgers locations and events. Confirmed stops will be announced later.' },
    skip: 'Skip to content', preview: 'In development · sample content and temporary artwork',
    eyebrow: 'Fullstack Burgers / Coming soon', hero: 'Big appetite.\nBuilt properly.',
    intro: 'A new burger experience is taking shape. Explore our first menu ideas, our story and where you might find us next.',
    menuCta: 'Explore the menu', locationCta: 'Find our next stop',
    stop: 'The next stop', stopTitle: 'Our route is taking shape.', stopText: 'No locations or times are confirmed yet. When our schedule is ready, you will find it here.',
    showcase: 'The first selection', showcaseText: 'Three ideas to look forward to. Names and recipes are provisional.',
    story: 'Behind the burgers', storyTitle: 'A good idea starts with the basics.', storyText: 'A space for our story: the people, the foodtruck and a love for burgers. The full story is coming soon.',
    storyCta: 'Get to know us', ingredients: 'What goes in', ingredientsTitle: 'From the first bite to the last.', ingredientsText: 'We are working on the details. Sourcing, suppliers and allergen information will follow once the menu is final.',
    ingredientItems: ['The bun', 'The burger', 'The finishing touch'], ingredientDetails: ['A foundation that brings it together.', 'The centre of every bite.', 'Sauces and toppings to finish it off.'],
    social: 'A look behind the scenes', socialText: 'This space will share moments from the kitchen and the road. Official social links will follow later.',
    socialLabels: ['In the kitchen', 'On the road', 'Around the table'],
    placeholder: 'Sample', imageLabel: 'Temporary artwork', footer: 'Burgers in development. More coming soon.',
    menuIntro: 'Our menu is taking shape. These are sample burgers; availability, prices and allergens will be confirmed later.',
    aboutIntro: 'Fullstack Burgers is taking shape. Soon we will share who we are and what drives us.',
    aboutDetail: 'Room for the real story', aboutBody: 'Our beginnings, team and foodtruck will each have a place here. This text will be replaced with our finished story.',
    locationsIntro: 'A place to follow our route, from the next stop to a special event.',
    eventsTitle: 'Locations & plans', unconfirmed: 'Not yet confirmed', noDate: 'Date to follow',
  },
};
