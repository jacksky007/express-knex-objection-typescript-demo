import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('comments', (table) => {
    table.increments()
    table.integer('user_id').unsigned()
    table.integer('post_id').unsigned()
    table.string('content')
    table.timestamps(true, true, true)

    table.foreign('user_id').references('id').inTable('users')
    table.foreign('post_id').references('id').inTable('posts')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('comments')
}
