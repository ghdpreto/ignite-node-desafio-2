// tipagem das tabelas do banco

// eslint-disable-next-line no-unused-vars
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    usuarios: {
      id: string
      nome: string
      email: string
      senha: string
    }
  }
}
