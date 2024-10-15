import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('user_id').primary();
    table.string('name').notNullable();
  })  .createTable('emotions', (table) => {
    table.increments('emotion_id').primary();
    table.uuid('user_id').notNullable().references('user_id').inTable('users').onDelete('CASCADE');
    table.enu('emotion_type', ['positive', 'negative']).notNullable();
    table.integer('intensity').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('emotions');
  await knex.schema.dropTableIfExists('users');
}

