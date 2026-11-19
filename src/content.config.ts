import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string(),
    order: z.number(),
    keywords: z.array(z.string()).optional(),
  }),
});

const careers = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/careers' }),
  schema: z.object({
    title: z.string(),
    department: z.string(),
    location: z.string(),
    type: z.string(),
    summary: z.string(),
    open: z.boolean().default(true),
  }),
});

export const collections = { services, careers };
