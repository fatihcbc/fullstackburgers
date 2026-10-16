import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
const common = {
  locale: z.enum(['nl', 'en']),
  translationKey: z.string(),
  title: z.string(),
  description: z.string(),
  draft: z.boolean().default(false),
  placeholder: z.boolean().default(true),
};
const burgers = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/burgers' }),
  schema: z.object({
    ...common, order: z.number().int().default(0),
    openingPriceCents: z.number().int().positive(), openingComboPriceCents: z.number().int().positive(),
    standardPriceCents: z.number().int().positive(), standardComboPriceCents: z.number().int().positive(),
  }).refine(v => v.standardPriceCents >= v.openingPriceCents && v.standardComboPriceCents >= v.openingComboPriceCents, { message: 'Future standard prices must not be lower than opening prices' }),
});
const announcements = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/announcements' }),
  schema: z.object({ ...common,
    // Explicit offsets avoid server/browser timezone ambiguity. End is exclusive.
    startsAt: z.iso.datetime({ offset: true }),
    endsAt: z.iso.datetime({ offset: true }),
    priority: z.number().int().default(0),
  }).refine(v => Date.parse(v.endsAt) > Date.parse(v.startsAt), { message: 'endsAt must follow startsAt' }),
});
const events = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/events' }),
  schema: z.object({ ...common,
    startsAt: z.iso.datetime({ offset: true }).optional(),
    endsAt: z.iso.datetime({ offset: true }).optional(),
    location: z.string().optional(),
    address: z.string().optional(),
    status: z.enum(['unconfirmed', 'confirmed', 'cancelled']).default('unconfirmed'),
  }).refine(v => !v.endsAt || (!!v.startsAt && Date.parse(v.endsAt) > Date.parse(v.startsAt)), { message: 'Event end requires an earlier start' }),
});
export const collections = { burgers, announcements, events };
