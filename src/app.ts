import fastify from 'fastify'
import { usuariosRoutes } from './routes/usuarios'
import fastifyCookie from '@fastify/cookie'
import { refeicoesRoutes } from './routes/refeicoes'

export const app = fastify()

app.register(fastifyCookie)

app.register(usuariosRoutes, { prefix: 'usuarios' })
app.register(refeicoesRoutes, { prefix: 'refeicoes' })

app.get('/', (request, reply) => {
  return { mensagem: 'Ola mundo!' }
})
