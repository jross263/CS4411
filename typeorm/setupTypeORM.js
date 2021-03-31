const {createConnection} = require('typeorm');

const typeormInstances = {};

async function typeormInitialize() {
    console.log("\nTYPEORM-INITALIZE")
    await mysqlInitialize();
    await postgresInitialize();
    await sqlliteInitialize();
    return typeormInstances;
}

async function mysqlInitialize() {
    const { host, user, password, database } = require("../config.json").mysql;
    typeormInstances.mysql = await createConnection({ name:"mysql", type: "mysql", host, port: 3306, username: user, password, database, entities: [require('./entities/User')], synchronize:true, dropSchema:true });
}

async function postgresInitialize() {
    const { host, user, password, database } = require("../config.json").postgres;
    typeormInstances.postgres = await createConnection({ name:"postgres", type: "postgres", host, port: 5432, username: user, password, database, entities: [require('./entities/User')], synchronize:true, dropSchema:true });
}

async function sqlliteInitialize() {
    typeormInstances.sqlite = await createConnection({ name:"sqlite", type: "sqlite", database:":memory:", entities: [require('./entities/User')], synchronize:true, dropSchema:true });
}

exports.typeormInitialize = typeormInitialize;
