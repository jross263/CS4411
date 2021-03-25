const createConnection = require('typeorm').createConnection;

const typeormInstances = {};

async function typeormInitialize() {
    await mysqlInitialize();
    await postgresInitialize();
    await sqlliteInitialize();
    return typeormInstances;
}

async function mysqlInitialize() {
    const { host, user, password, database } = require("../config.json").mysql;
    typeormInstances.mysql = await createConnection({ name:"mysql", type: "mysql", host, port: 3306, username: user, password, database });
}

async function postgresInitialize() {
  const { host, user, password, database } = require("../config.json").postgres;
  typeormInstances.postgres = await createConnection({ name:"postgres", type: "postgres", host, port: 5432, username: user, password, database });
}

async function sqlliteInitialize() {
    const { path } = require("../config.json").sqlite;
    typeormInstances.sqlite = await createConnection({ name:"sqlite", type: "sqlite", database:path });
}

exports.typeormInitialize = typeormInitialize;
