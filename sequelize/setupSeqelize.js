const { Sequelize, DataTypes } = require("sequelize");
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
    const { host, user, password, database } = require("../config.json").mysql;
    sequelizeInstances.mysql = new Sequelize(database, user, password, { host: host, dialect: "mysql", logging:false });
    Users(sequelizeInstances.mysql);
    await sequelizeInstances.mysql.sync({ force: true });
}

async function postgresInitialize() {
    const { host, user, password, database } = require("../config.json").postgres;
    sequelizeInstances.postgres = new Sequelize(database, user, password, { host: host, dialect: "postgres", logging:false });
    Users(sequelizeInstances.postgres);
    await sequelizeInstances.postgres.sync({ force: true });
}

async function sqlliteInitialize() {
    sequelizeInstances.sqlite = new Sequelize('sqlite::memory:',{logging:false});
    Users(sequelizeInstances.sqlite);
    await sequelizeInstances.sqlite.sync({ force: true });;
}

exports.sequelizeInitialize = sequelizeInitialize;
