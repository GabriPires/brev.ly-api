import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

export const createLink: FastifyPluginAsyncZod = async (server) => {
  server.post('/links', {}, async (request, reply) => {})
}
