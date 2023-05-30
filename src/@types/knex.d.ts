// tipagem das tabelas do banco

// eslint-disable-next-line no-unused-vars
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  interface Usuario {
    id: string
    nome: string
    email: string
    senha: string
  }
  interface Refeicao {
    id?: string
    id_usuario?: string
    nome: string
    descricao?: string
    dieta: boolean
    dt_criacao?: string
  }

  export interface Tables {
    usuarios: Usuario
    refeicoes: Refeicao
  }
}
