async function createMySQLDB() {
    // load driver and confg file
    const mysql = require('mysql2/promise');
    const { host, user, password, database } = require('./config.json').mysql;
    // create the connection
    const connection = await mysql.createConnection({ host, user, password });
    // create DB
    try{
        await connection.execute(`CREATE DATABASE IF NOT EXISTS ${database}`);
        await connection.end();
    }catch(e){
        await connection.end();
        throw "Invalid database name supplied in config.json for mysql";
    }    
}

async function createPostgresDB() {
    // load driver and confg file
    const { Client } = require('pg')
    const { host, user, password, database } = require('./config.json').postgres;
    // create the connection
    const client = new Client({user, host, password});
    // connect to DB
    await client.connect();
    try{
        await client.query(`DROP DATABASE IF EXISTS ${database}`);
        await client.query(`CREATE DATABASE ${database}`);
        await client.end();
    }catch(e){
        await client.end();
        throw "Invalid database name supplied in config.json for postgres";
    }
}

const createSQLiteDB = () => new Promise((resolve, reject)=>{
    // load driver and confg file
    const sqlite3 = require('sqlite3');
    const { path } = require('./config.json').sqlite;
    // create the connection
    const cratesqliteDB = () => new Promise((resolve, reject)=>{
        const db = new sqlite3.Database(path, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
            if (err) {
                reject("Error creating sqlite database");
            } else {
                
                resolve(db);
            }
        });
    })
    cratesqliteDB().then((db)=>{
        const closesqliteDB = () => new Promise((resolve, reject)=>{
            db.close((err) => {
                if (err) {
                    reject("Error closing sqlite database");
                }
                resolve();
              });
        })
        closesqliteDB().then(()=>{
            resolve();
        }).catch((e)=>{
            reject(e);
        })
    }).catch((e)=>{
        reject(e);
    });
})

async function main() {
    const { sequelizeInitialize } = require("./sequelize/setupSeqelize");
    const { typeormInitialize } = require("./typeorm/setupTypeORM");
    const { bookmarkInitialize } = require("./bookmark/setupBookmark");

    const sequelizeInstances = await sequelizeInitialize();
    const typeormInstances = await typeormInitialize();
    const bookmarkInstances = await bookmarkInitialize();
    
    Object.keys(sequelizeInstances).forEach(ele => sequelizeInstances[ele].close());
    Object.keys(typeormInstances).forEach(ele => typeormInstances[ele].close());
    Object.keys(bookmarkInstances).forEach(ele => bookmarkInstances[ele].knex.destroy());
    
}

if (require.main === module) {
    Promise.all([createMySQLDB(),createPostgresDB(),createSQLiteDB()]).then(()=>{
        main();
    }).catch((e)=>{
        console.log(e);
    })
}