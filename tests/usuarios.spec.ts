import request from 'supertest'
import { describe, test, beforeAll, afterAll, beforeEach, expect } from 'vitest'
import { app } from '../src/app'
import { execSync } from 'child_process'

describe('Usuarios routes', () => {
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
  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  test('Deve ser possivel criar um usuário', async () => {
    const response = await request(app.server).post('/usuarios').send({
      nome: 'Usuario teste 1',
      senha: '12345678',
      email: 'usuario.teste1@teste.com',
    })

    expect(response.statusCode).toEqual(201)
  })

  test('Não Deve ser possivel criar um usuário com e-mail ja cadastrado', async () => {
    await request(app.server).post('/usuarios').send({
      nome: 'Usuario teste 1',
      senha: '12345678',
      email: 'usuario.teste1@teste.com',
    })

    const response = await request(app.server).post('/usuarios').send({
      nome: 'Usuario teste 1',
      senha: '12345678',
      email: 'usuario.teste1@teste.com',
    })

    expect(response.statusCode).toEqual(400)
  })

  test('Deve ser possivel fazer login', async () => {
    await request(app.server).post('/usuarios').send({
      nome: 'Usuario teste 1',
      senha: '12345678',
      email: 'usuario.teste1@teste.com',
    })

    const response = await request(app.server).post('/usuarios/login').send({
      senha: '12345678',
      email: 'usuario.teste1@teste.com',
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body.usuario).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        nome: 'Usuario teste 1',
      }),
    )
  })

  test('Não Deve ser possivel fazer login de um e-mail não cadastrado', async () => {
    const response = await request(app.server).post('/usuarios/login').send({
      senha: '12345678',
      email: 'usuario.teste1@teste.com',
    })

    expect(response.statusCode).toEqual(400)
  })
})
