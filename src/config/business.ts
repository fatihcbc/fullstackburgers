// Confirmed information only. No opening times supplied.
export const mapsUrl = (query: string) => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(query);
export const regularLocations = [
  { day: { nl: 'Zondag', en: 'Sunday' }, name: 'Almere Muziekwijk', directionsUrl: 'https://maps.app.goo.gl/EsycCHAQrW5B5s397' },
  { day: { nl: 'Maandag', en: 'Monday' }, name: 'Homerusplein, Almere Poort', directionsUrl: mapsUrl('Homerusplein, Almere Poort') },
] as const;
export const sides = [
  { name: { nl: 'Friet', en: 'Fries' }, priceCents: 350 },
  { name: { nl: 'Frisdrank', en: 'Soft Drinks' }, priceCents: 325 },
] as const;
export const formatPrice = (cents: number, locale: 'nl' | 'en') => new Intl.NumberFormat(locale === 'nl' ? 'nl-NL' : 'en-IE', { style: 'currency', currency: 'EUR' }).format(cents / 100);
