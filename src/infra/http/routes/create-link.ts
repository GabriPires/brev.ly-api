import { createLink } from '@/app/functions/create-link'
import { isLeft, unwrapEither } from '@/shared/either'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const createLinkRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    '/links',
    {
      schema: {
        body: z.object({
          originalUrl: z.string().url(),
        }),
        response: {
          201: z.object({
            shortHash: z.string(),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { originalUrl } = request.body

      const result = await createLink({
        originalUrl,
      })

      if (isLeft(result)) {
        return reply.status(400).send({
          message: 'Invalid URL',
        })
      }

      const { shortHash } = unwrapEither(result)

      return reply.status(201).send({
        shortHash,
      })
    }
  )
}
