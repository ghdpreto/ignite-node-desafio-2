import { knex as setupKnex, Knex } from 'knex'

export const configDb: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: './db/dev.db',
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
}

export const knex = setupKnex(configDb)
