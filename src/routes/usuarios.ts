import { FastifyInstance } from 'fastify'
import z from 'zod'
import { knex } from '../database'
import { randomUUID } from 'crypto'

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
    await knex('usuarios').insert({ email, nome, senha, id: randomUUID() })

    return reply.status(201).send()
  })

  app.post('/login', async (request, reply) => {
    // validar os dados
    const loginUsuarioBodySchema = z.object({
      email: z.string().email(),
      senha: z.string(),
    })

    const { email, senha } = loginUsuarioBodySchema.parse(request.body)

    // busca o usuario
    const usuario = await knex('usuarios')
      .select('id', 'nome')
      .where({ email, senha })
      .first()

    if (!usuario) {
      return reply.status(400).send({ mensagem: 'Usuário / senha inválidos' })
    }

    return {
      usuario,
    }
  })
}
