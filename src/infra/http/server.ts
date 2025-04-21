import { env } from '@/env'
import fastify from 'fastify'

const server = fastify()

server.listen({ port: env.PORT, host: '0.0.0.0' }).then(() => {
  console.log('HTTP server running')
})
