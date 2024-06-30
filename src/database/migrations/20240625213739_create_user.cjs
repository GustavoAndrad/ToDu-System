
exports.up = function(knex) {
  return knex.schema
    .createTable("User",(table) => {
      table.uuid("ID").primary();
      table.string("NAME", 100).notNullable();
      table.date("DATE_BIRTH").notNullable();
      table.string("EMAIL", 255).notNullable().unique();
      table.string("PASSWORD", 60).notNullable();
      table.boolean("NOTIFICATE").notNullable().defaultTo(true);
      table.tinyint("HOURS_NOTIFICATION").notNullable().unsigned().defaultTo(24);

    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTable("User");
};
