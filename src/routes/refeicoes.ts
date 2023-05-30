import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { knex } from '../database'
import { randomUUID } from 'crypto'
import { checkUsuarioLogado } from '../middlewares/check-usuario-logado'

export async function refeicoesRoutes(app: FastifyInstance) {
  app.addHook('preHandler', checkUsuarioLogado)
  app.addHook(
    'preHandler',
    async function (request: FastifyRequest, reply: FastifyReply) {
      const { idUsuario } = request.cookies
      const existeUsuario = await knex('usuarios')
        .select()
        .where({ id: idUsuario })
        .first()
      if (!existeUsuario) {
        return reply.status(401).send({ mensagem: 'Não autorizado' })
      }
    },
  )

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
      nome: z.string().optional(),
      descricao: z.string().optional(),
      dieta: z.boolean().optional(),
      dtCriacao: z.string().datetime().optional(),
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

  app.delete('/:id', async (request, reply) => {
    const refeicaoParamsSchema = z.object({ id: z.string().uuid() })

    const { id } = refeicaoParamsSchema.parse(request.params)
    const { idUsuario } = request.cookies

    const registroDeletado = await knex('refeicoes')
      .del()
      .where({ id, id_usuario: idUsuario })

    if (registroDeletado <= 0) {
      return reply.status(404).send()
    }

    return reply.status(204).send()
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

  app.get('/:id', async (request, reply) => {
    const { idUsuario } = request.cookies

    const refeicaoParamsSchema = z.object({ id: z.string().uuid() })

    const { id } = refeicaoParamsSchema.parse(request.params)

    const refeicao = await knex('refeicoes')
      .select()
      .where({ id, id_usuario: idUsuario })
      .first()

    const refeicaoResponse = {
      ...refeicao,
      dieta: !!refeicao?.dieta,
    }

    return { refeicao: refeicaoResponse }
  })

  app.get('/metricas', async (request, reply) => {
    const { idUsuario } = request.cookies

    const totalRefeicoesRegistrada = await knex('refeicoes')
      .count('*', { as: 'registradas' })
      .where({ id_usuario: idUsuario })
      .first()

    const refeicoesDentroDieta = await knex('refeicoes')
      .select('*')
      .where({ id_usuario: idUsuario, dieta: true })
      .orderBy('dt_criacao', 'desc')

    const totalRefeicoesForaDieta = await knex('refeicoes')
      .count('*', { as: 'foraDaDieta' })
      .where({ id_usuario: idUsuario, dieta: false })
      .first()

    const melhorSequencia = await knex
      .max('qnt', { as: 'melhorSequencia' })
      .from(
        knex
          .count('dieta', { as: 'qnt' })
          .from('refeicoes')
          .where({ id_usuario: idUsuario, dieta: true })
          .groupBy('dt_criacao'),
      )
      .first()

    const totalRefeicoesDentroDieta = {
      dentroDaDieta: refeicoesDentroDieta.length,
    }

    return {
      metricas: {
        ...totalRefeicoesRegistrada,
        ...totalRefeicoesDentroDieta,
        ...totalRefeicoesForaDieta,
        ...melhorSequencia,
      },
    }
  })
}
