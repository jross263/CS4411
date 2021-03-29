const { Sequelize, DataTypes } = require("sequelize");
const {performance} = require('perf_hooks');
const Users = require("./models/users");

const sequelizeInstances = {};

async function sequelizeInitialize() {
    console.log("\nSEQUELIZE-INITALIZE")
    await mysqlInitialize();
    await postgresInitialize();
    await sqlliteInitialize();
    return sequelizeInstances;
}

async function mysqlInitialize() {
    const start = performance.now();
    const { host, user, password, database } = require("../config.json").mysql;
    sequelizeInstances.mysql = new Sequelize(database, user, password, { host: host, dialect: "mysql", logging:false });
    Users(sequelizeInstances.mysql);
    await sequelizeInstances.mysql.sync({ force: true });
    const end = performance.now();
    console.log(`MYSQL ${end - start}ms`);
}

async function postgresInitialize() {
    const start = performance.now();
    const { host, user, password, database } = require("../config.json").postgres;
    sequelizeInstances.postgres = new Sequelize(database, user, password, { host: host, dialect: "postgres", logging:false });
    Users(sequelizeInstances.postgres);
    await sequelizeInstances.postgres.sync({ force: true });
    const end = performance.now();
    console.log(`POSTGRES ${end - start}ms`);
}

async function sqlliteInitialize() {
    const start = performance.now();
    const { path } = require("../config.json").sqlite;
    sequelizeInstances.sqlite = new Sequelize({ dialect: "sqlite", storage: path, logging:false });
    Users(sequelizeInstances.sqlite);
    await sequelizeInstances.sqlite.sync({ force: true });
    const end = performance.now();
    console.log(`SQLITE ${end - start}ms`);
}

exports.sequelizeInitialize = sequelizeInitialize;
