/* eslint-disable linebreak-style */

exports.up = function(knex) {
  return knex.schema
    .createTable("Code_2FA",(table) => {
      table.uuid("ID_USER").references("ID").inTable("User").onDelete("CASCADE");
      table.smallint("IDENTITY_CODE").unsigned().notNullable().unique();
      table.timestamp("EXPIRATION_DATE").notNullable();

    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTable("Code_2FA");
};
