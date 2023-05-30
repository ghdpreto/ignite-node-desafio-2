import request from 'supertest'
import { describe, test, beforeAll, afterAll, beforeEach, expect } from 'vitest'
import { app } from '../src/app'
import { execSync } from 'child_process'
import { randomUUID } from 'crypto'

let usuarioLogado: request.Response

describe('Refeicoes routes', () => {
  // agauarda o app ficar up
  beforeAll(async () => {
    await app.ready()
  })

  // fechar o app apos todos os testes
  afterAll(async () => {
    await app.close()
  })

  // antes de cada teste
  // cria um novo banco
  beforeEach(async () => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')

    // cadastro o usuario
    await request(app.server).post('/usuarios').send({
      nome: 'Usuario teste 1',
      senha: '12345678',
      email: 'usuario.teste1@teste.com',
    })

    // faz o login
    usuarioLogado = await request(app.server).post('/usuarios/login').send({
      senha: '12345678',
      email: 'usuario.teste1@teste.com',
    })
  })

  test.skip('Deve ser possivel cadastrar uma refeicao', async () => {
    const idUsuario = usuarioLogado.get('Set-Cookie')

    const refeicao = {
      nome: 'X-SALADA',
      dieta: true,
      dtCriacao: new Date().toISOString(),
    }

    const criarRefeicaoResponse = await request(app.server)
      .post('/refeicoes')
      .send(refeicao)
      .set('Cookie', idUsuario)

    expect(criarRefeicaoResponse.statusCode).toEqual(201)
  })

  test.skip('Deve ser possivel listar refeicoes de um usuario logado', async () => {
    const idUsuario = usuarioLogado.get('Set-Cookie')

    await request(app.server)
      .post('/refeicoes')
      .send({
        nome: 'X-SALADA-1',
        dieta: true,
        dtCriacao: new Date().toISOString(),
      })
      .set('Cookie', idUsuario)

    const listarRefeicoes = await request(app.server)
      .get('/refeicoes')
      .set('Cookie', idUsuario)

    expect(listarRefeicoes.statusCode).toEqual(200)
    expect(listarRefeicoes.body.refeicoes).toEqual([
      expect.objectContaining({
        nome: 'X-SALADA-1',
        dieta: true,
      }),
    ])
  })

  test('Deve ser possivel atualizar uma refeicao', async () => {
    const idUsuario = usuarioLogado.get('Set-Cookie')

    await request(app.server)
      .post('/refeicoes')
      .send({
        nome: 'X-SALADA-1',
        dieta: true,
        dtCriacao: new Date().toISOString(),
      })
      .set('Cookie', idUsuario)

    const listarRefeicoes = await request(app.server)
      .get('/refeicoes')
      .set('Cookie', idUsuario)

    const idRefeicao = listarRefeicoes.body.refeicoes[0].id

    const refeicaoAtualizada = {
      dieta: false,
      nome: 'ATUALIZADA',
      descricao: 'NOVA DESCRICAO',
      dtCriacao: new Date().toISOString(),
    }

    const responseRefeicaoAtualizada = await request(app.server)
      .put(`/refeicoes/${idRefeicao}`)
      .send({
        ...refeicaoAtualizada,
      })
      .set('Cookie', idUsuario)

    expect(responseRefeicaoAtualizada.statusCode).toEqual(200)
    expect(responseRefeicaoAtualizada.body.refeicao).toEqual(
      expect.objectContaining({
        nome: refeicaoAtualizada.nome,
        dieta: refeicaoAtualizada.dieta,
        descricao: refeicaoAtualizada.descricao,
        dt_criacao: refeicaoAtualizada.dtCriacao,
      }),
    )
  })

  test('Não deve ser possivel atualizar uma refeicao não cadastrada', async () => {
    const idUsuario = usuarioLogado.get('Set-Cookie')

    const refeicaoAtualizada = {
      dieta: false,
      nome: 'ATUALIZADA',
      descricao: 'NOVA DESCRICAO',
      dtCriacao: new Date().toISOString(),
    }

    const responseRefeicaoAtualizada = await request(app.server)
      .put(`/refeicoes/${randomUUID()}`)
      .send({
        ...refeicaoAtualizada,
      })
      .set('Cookie', idUsuario)

    expect(responseRefeicaoAtualizada.statusCode).toEqual(404)
  })
})
