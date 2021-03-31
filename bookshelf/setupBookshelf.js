
const bookshelfInstances = {};
const User = require('./models/users');

async function bookshelfInitialize() {
  console.log("\nBOOKSHELF-INITALIZE")
  await mysqlInitialize();
  await postgresInitialize();
  await sqlliteInitialize();
  return bookshelfInstances;
}

async function mysqlInitialize() {
    const { host, user, password, database } = require("../config.json").mysql;
    const knex = require('knex')({
        client: 'mysql2',
        connection: {
          host,
          user,
          password,
          database
        }
      });
      bookshelfInstances.mysql = require('bookshelf')(knex)
      await knex.schema.dropTableIfExists('bookshelfUser');
      await knex.schema.createTable('bookshelfUser', User)
}

async function postgresInitialize() {
  const { host, user, password, database } = require("../config.json").postgres;
  const knex = require('knex')({
    client: 'pg',
    connection: {
      host,
      user,
      password,
      database
    }
  });
  bookshelfInstances.postgres = require('bookshelf')(knex)
  await knex.schema.dropTableIfExists('bookshelfUser');
  await knex.schema.createTable('bookshelfUser', User)
}

async function sqlliteInitialize() {
    const knex = require('knex')({
      client: 'sqlite3',
      useNullAsDefault : true,
      connection: {
        filename: ':memory:'
      }
    });
    bookshelfInstances.sqlite = require('bookshelf')(knex)
    await knex.schema.dropTableIfExists('bookshelfUser');
    await knex.schema.createTable('bookshelfUser', User)
}

exports.bookshelfInitialize = bookshelfInitialize;
