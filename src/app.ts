import fastify from 'fastify'
import { usuariosRoutes } from './routes/usuarios'

export const app = fastify()

app.register(usuariosRoutes, { prefix: 'usuarios' })

app.get('/', (request, reply) => {
  return { mensagem: 'Ola mundo!' }
})
