import fastify from 'fastify'

export const app = fastify()

app.get('/', (request, reply) => {
  return { mensagem: 'Ola mundo!' }
})
