
exports.up = function(knex) {
  return knex.schema.table('users', table => {
    table.dropColumn('name');
  })
};

exports.down = function(knex) {
  return knex.schema.table('users', table => {
    table.string('name', 128)
      .notNullable();
  })
};
