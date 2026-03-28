/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    // 1. Create the Users Table
    .createTable('users', function(table) {
      table.increments('id').primary(); // Unique ID (1, 2, 3...)
      table.string('username').notNullable().unique(); // Username must be unique
      table.string('password_hash').notNullable(); // Encrypted password
      table.timestamps(true, true); // Adds created_at and updated_at
    })
    // 2. Create the SocialProfiles Table
    .createTable('social_profiles', function(table) {
      table.increments('id').primary();
      
      // Link this profile to a user (Foreign Key)
      table.integer('user_id').unsigned().notNullable();
      table.foreign('user_id').references('users.id').onDelete('CASCADE');

      // The Social Columns from your sketch
      table.string('tiktok');
      table.string('instagram');
      table.string('telegram');
      table.string('facebook');
      table.string('X');
      table.string('phone');
      table.string('email');

      table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  // If we need to undo the changes, drop tables in reverse order
  return knex.schema
    .dropTableIfExists('social_profiles')
    .dropTableIfExists('users');
};