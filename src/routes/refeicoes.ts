import { FastifyInstance } from 'fastify'
import z from 'zod'
import { knex } from '../database'
import { randomUUID } from 'crypto'
import { checkUsuarioLogado } from '../middlewares/check-usuario-logado'

export async function refeicoesRoutes(app: FastifyInstance) {
  app.addHook('preHandler', checkUsuarioLogado)

  app.post('/', async (request, reply) => {
    const refeicaoBodySchema = z.object({
      nome: z.string(),
      descricao: z.string().optional(),
      dieta: z.boolean(),
      dtCriacao: z.string().datetime(),
    })
    const { idUsuario } = request.cookies

    const { dieta, dtCriacao, nome, descricao } = refeicaoBodySchema.parse(
      request.body,
    )

    await knex('refeicoes').insert({
      id: randomUUID(),
      id_usuario: idUsuario,
      dieta,
      descricao,
      dt_criacao: dtCriacao.toString(),
      nome,
    })

    return reply.status(201).send()
  })

  app.put('/:id', async (request, reply) => {
    const refeicaoBodySchema = z.object({
      nome: z.string(),
      descricao: z.string().optional(),
      dieta: z.boolean(),
      dtCriacao: z.string().datetime(),
    })

    const refeicaoParamsSchema = z.object({
      id: z.string().uuid(),
    })
    const { idUsuario } = request.cookies

    const { id } = refeicaoParamsSchema.parse(request.params)
    const { dieta, dtCriacao, nome, descricao } = refeicaoBodySchema.parse(
      request.body,
    )

    const refeicaoAtual = await knex('refeicoes')
      .select()
      .where({ id, id_usuario: idUsuario })
      .first()

    if (!refeicaoAtual) {
      return reply.status(404).send({ mensagem: 'ID Refeição não localizado' })
    }

    const refeicaoAtualizado = {
      ...refeicaoAtual,
      nome,
      descricao,
      dieta,
      dt_criacao: dtCriacao,
    }

    await knex('refeicoes')
      .update({ ...refeicaoAtualizado })
      .where({ id, id_usuario: idUsuario })

    return reply.status(200).send({ refeicao: { ...refeicaoAtualizado } })
  })

  app.get('/', async (request, reply) => {
    const { idUsuario } = request.cookies

    const refeicoes = await knex('refeicoes')
      .select()
      .where({ id_usuario: idUsuario })

    const refeicoesResponse = refeicoes.map((el) => {
      return {
        ...el,
        dieta: !!el.dieta,
      }
    })

    return { refeicoes: refeicoesResponse }
  })
}
