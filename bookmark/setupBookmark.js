
const bookmarkInstances = {};

async function bookmarkInitialize() {
    await mysqlInitialize();
    await postgresInitialize();
    await sqlliteInitialize();
    return bookmarkInstances;
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
      bookmarkInstances.mysql = require('bookshelf')(knex)
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
  bookmarkInstances.postgres = require('bookshelf')(knex)
}

async function sqlliteInitialize() {
    const { path } = require("../config.json").sqlite;
    const knex = require('knex')({
      client: 'sqlite3',
      useNullAsDefault : true,
      connection: {
        filename: path
      }
    });
    bookmarkInstances.sqlite = require('bookshelf')(knex)
}

exports.bookmarkInitialize = bookmarkInitialize;
