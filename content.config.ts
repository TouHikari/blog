import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '*.md',
      schema: z.object({
        title: z.string().optional(),
        description: z.string().optional()
      })
    }),
    blog: defineCollection({
      type: 'page',
      source: 'blog/*.md',
      schema: z.object({
        date: z.string().or(z.date()),
        draft: z.boolean().optional(),
        tags: z.array(z.string()).optional(),
        toc: z.boolean().optional()
      }).passthrough()
    }),
    test: defineCollection({
      type: 'page',
      source: 'test/*.md',
      schema: z.object({
        date: z.string().or(z.date()).optional(),
        draft: z.boolean().optional(),
        toc: z.boolean().optional()
      }).passthrough()
    })
  }
})
