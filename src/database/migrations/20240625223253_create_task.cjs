/* eslint-disable linebreak-style */
/* eslint-disable linebreak-style */

exports.up = function(knex) {
  return knex.schema
    .createTable("Task",(table) => {
      table.uuid("ID").primary();
      table.uuid("ID_USER").references("ID").inTable("User").onDelete("CASCADE");
      table.string("TITLE", 50).notNullable();
      table.string("DESCRIPTION", 300);
      table.enum("STATUS", ["DONE", "IN PROGRESS", "PENDING", "LATE"]).notNullable().defaultTo("PENDING");
      table.enum("PRIORITY", ["LOW", "MID", "HIGH"]).notNullable();
      
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTable("Task");
};
