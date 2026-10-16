// Confirmed information only. No opening times or exact Muziekwijk pitch supplied.
export const regularLocations = [
  { day: { nl: 'Zondag', en: 'Sunday' }, name: 'Almere Muziekwijk', query: 'Almere Muziekwijk' },
  { day: { nl: 'Maandag', en: 'Monday' }, name: 'Homerusplein, Almere Poort', query: 'Homerusplein, Almere Poort' },
] as const;
export const sides = [
  { name: { nl: 'Friet', en: 'Fries' }, priceCents: 350 },
  { name: { nl: 'Frisdrank', en: 'Soft Drinks' }, priceCents: 325 },
] as const;
export const mapsUrl = (query: string) => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(query);
export const formatPrice = (cents: number, locale: 'nl' | 'en') => new Intl.NumberFormat(locale === 'nl' ? 'nl-NL' : 'en-IE', { style: 'currency', currency: 'EUR' }).format(cents / 100);
