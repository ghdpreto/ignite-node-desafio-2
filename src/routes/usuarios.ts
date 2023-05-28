import { FastifyInstance } from 'fastify'
import z from 'zod'
import { knex } from '../database'

export async function usuariosRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    // valida os dados
    const criarUsuarioBodySchema = z.object({
      nome: z.string(),
      email: z.string().email(),
      senha: z.string().min(8).max(10),
    })

    const { email, nome, senha } = criarUsuarioBodySchema.parse(request.body)
    // valida se ja tem cadastro (email)

    const existeCadastro = await knex('usuarios').select().where({ email })

    if (existeCadastro.length >= 1) {
      reply.status(400).send({ mensagem: 'Usuario já cadastrado' })
    }

    // criar o usuario
    await knex('usuarios').insert({ email, nome, senha })

    return reply.status(201).send()
  })
}
