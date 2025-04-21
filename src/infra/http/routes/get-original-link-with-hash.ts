import { getOriginalLinkWithHash } from '@/app/functions/get-original-link-with-hash'
import { isLeft, unwrapEither } from '@/shared/either'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const getOriginalLinkWithHashRoute: FastifyPluginAsyncZod = async (
  server
) => {
  server.get(
    '/links/:hash',
    {
      schema: {
        params: z.object({
          hash: z.string(),
        }),
        response: {
          200: z.object({
            originalUrl: z.string(),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { hash } = request.params

      const result = await getOriginalLinkWithHash({
        hash,
      })

      if (isLeft(result)) {
        return reply.status(400).send({
          message: 'Link not found.',
        })
      }

      const { originalUrl } = unwrapEither(result)

      return reply.status(200).send({
        originalUrl,
      })
    }
  )
}
