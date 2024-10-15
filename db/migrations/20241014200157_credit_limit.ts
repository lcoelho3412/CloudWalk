import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('credit_limits', (table) => {
    table.increments('limit_id').primary(); // Auto-incrementing primary key
    table.uuid('user_id').notNullable().references('user_id').inTable('users').onDelete('CASCADE'); // Foreign key to users table
    table.decimal('credit_limit', 10, 2).notNullable(); // Credit limit
    table.timestamp('updated_at').defaultTo(knex.fn.now()); // Timestamp for last update

    // Correct unique constraint definition
    table.unique('user_id');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('credit_limits');
}

