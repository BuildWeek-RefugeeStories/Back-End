
exports.up = function(knex) {
  return knex.schema.dropTableIfExists('users')
  .createTable('users', table => {
    table.increments();
    table.string('first_name', 128)
    .notNullable();
    table.string('last_name', 128)
    .notNullable();
    table.string('email', 128)
    .notNullable();
    table.string('password', 128)
    .notNullable();
    table.string('country', 128);
  })
};

exports.down = function(knex) {
  return knex.schema.table('users', table => {
    table.dropColumn('id');
  })
};
