import { FastifyReply, FastifyRequest } from 'fastify'

export async function checkUsuarioLogado(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const idUsuario = request.cookies.idUsuario

  if (!idUsuario) {
    return reply.status(401).send({ mensagem: 'Não autorizado' })
  }
}
