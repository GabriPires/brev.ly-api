import { deleteLink } from '@/app/functions/delete-link'
import { isLeft } from '@/shared/either'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const deleteLinkRoute: FastifyPluginAsyncZod = async (server) => {
  server.delete(
    '/links',
    {
      schema: {
        body: z.object({
          id: z.string(),
        }),
        response: {
          200: z.object({
            message: z.string(),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.body

      const result = await deleteLink({
        id,
      })

      if (isLeft(result)) {
        return reply.status(400).send({
          message: 'Not found.',
        })
      }

      return reply.status(200).send({
        message: 'Link deleted successfully.',
      })
    }
  )
}
