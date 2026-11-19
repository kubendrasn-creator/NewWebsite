import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const services = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/services' }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    shortTitle: z.string(),
    text: z.string(),
    items: z.array(z.string()).default([]),
    advantages: z.array(z.string()).default([]),
    order: z.number(),
    icon: z.string(),
  }),
});

const pillars = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/pillars' }),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    text: z.string(),
    image: z.string(),
    order: z.number(),
  }),
});

const whyApt = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/why-apt' }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    pageTitle: z.string(),
    slug: z.string(),
    cardText: z.string(),
    intro: z.string().optional(),
    body: z.string().optional(),
    models: z.array(z.object({
      name: z.string(),
      description: z.string(),
    })).optional(),
    order: z.number(),
  }),
});

const audience = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/audience' }),
  schema: z.object({
    id: z.string(),
    letter: z.string(),
    text: z.string(),
    matchedServices: z.array(z.string()),
    order: z.number(),
  }),
});

const careers = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/careers' }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    status: z.string(),
    order: z.number(),
  }),
});

const site = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/site' }),
  schema: z.object({
    siteName: z.string(),
    nav: z.array(z.object({
      name: z.string(),
      href: z.string(),
      children: z.array(z.object({
        name: z.string(),
        href: z.string(),
      })).optional(),
    })),
    hero: z.object({
      headline: z.string(),
      subtext: z.string(),
      primaryCTA: z.string(),
      primaryCTALink: z.string(),
      secondaryCTA: z.string(),
      secondaryCTALink: z.string(),
    }),
    about: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      p1: z.string(),
      p2: z.string(),
      audienceHeading: z.string(),
    }),
    contact: z.object({
      usPhone: z.string(),
      indPhone: z.string(),
      generalEmail: z.string(),
      salesEmail: z.string(),
      indiaAddress: z.string(),
      arcCaption: z.string(),
    }),
  }),
});

export const collections = {
  services,
  pillars,
  whyApt,
  audience,
  careers,
  site,
};
