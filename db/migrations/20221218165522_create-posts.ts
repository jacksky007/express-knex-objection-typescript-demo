import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('posts', (table) => {
    table.increments()
    table.integer('user_id').unsigned()
    table.string('title', 255)
    table.string('content')
    table.timestamps(true, true, true)

    table.foreign('user_id').references('id').inTable('users')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('posts')
}
