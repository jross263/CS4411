const { Sequelize, DataTypes } = require("sequelize");

const sequelizeInstances = {};

async function sequelizeInitialize() {
    await mysqlInitialize();
    await postgresInitialize();
    await sqlliteInitialize();
    return sequelizeInstances;
}

async function mysqlInitialize() {
    const { host, user, password, database } = require("../config.json").mysql;
    sequelizeInstances.mysql = new Sequelize(database, user, password, { host: host, dialect: "mysql" });
}

async function postgresInitialize() {
    const { host, user, password, database } = require("../config.json").postgres;
    sequelizeInstances.postgres = new Sequelize(database, user, password, { host: host, dialect: "postgres" });
}

async function sqlliteInitialize() {
    const { path } = require("../config.json").sqlite;
    sequelizeInstances.sqlite = new Sequelize({ dialect: "sqlite", storage: path, });
}

exports.sequelizeInitialize = sequelizeInitialize;
