import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('refeicoes', (table) => {
    table.uuid('id').primary().notNullable()
    table.uuid('id_usuario').unsigned().references('usuarios.id')
    table.text('nome').notNullable()
    table.text('descricao')
    table.boolean('dieta').notNullable()
    table.timestamp('dt_criacao').defaultTo(knex.fn.now()).notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('refeicoes')
}
