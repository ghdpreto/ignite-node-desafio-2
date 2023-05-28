import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('usuarios', (table) => {
    table.uuid('id').primary()
    table.text('nome').notNullable()
    table.text('email').notNullable()
    table.text('senha').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('usuarios')
}
