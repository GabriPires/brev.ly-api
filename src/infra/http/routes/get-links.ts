import { getLinks } from '@/app/functions/get-links'
import { unwrapEither } from '@/shared/either'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const getLinksRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    '/links',
    {
      schema: {
        response: {
          200: z.object({
            links: z.array(
              z.object({
                id: z.string(),
                originalUrl: z.string(),
                shortHash: z.string(),
                accessCount: z.number(),
              })
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      const result = await getLinks()

      const { links } = unwrapEither(result)

      return reply.status(201).send({
        links,
      })
    }
  )
}
