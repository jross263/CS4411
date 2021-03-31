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
        throw "Invalid database name supplied in config.json for postgres, or supplied user is currently logged in";
    }
}

async function fetchUserList(){
    const axios = require('axios');
    console.log("Generating random users...")
    const res = await axios.get('https://randomuser.me/api/?results=5000')
    return res.data.results
}

async function main(users) {
    const { sequelizeInitialize } = require("./sequelize/setupSeqelize");
    const { sequelizeBenchmark } = require('./sequelize/benchmark');
    const { typeormInitialize } = require("./typeorm/setupTypeORM");
    const { typeormBenchmark } = require('./typeorm/benchmark');
    const { bookshelfInitialize } = require('./bookshelf/setupBookshelf')
    const { bookshelfBenchmark } = require('./bookshelf/benchmark');
    
    const sequelizeInstances = await sequelizeInitialize();
    const sequelizeBenchmarkSpeeds = await sequelizeBenchmark(sequelizeInstances, users);

    

    const typeormInstances = await typeormInitialize();
    const typeormBenchmarkSpeeds = await typeormBenchmark(typeormInstances, users);

    

    const bookmarkInstances = await bookshelfInitialize();
    const bookshelfBenchmarkSpeeds = await bookshelfBenchmark(bookmarkInstances, users);

    const tables = {
        'insert': {
            'sequelize':{
                'mysql':{},
                'postgres':{},
                'sqlite': {}
            },
            'typeorm':{
                'mysql':{},
                'postgres':{},
                'sqlite': {}
            },
            'bookshelf':{
                'mysql':{},
                'postgres':{},
                'sqlite': {}
            }
        },
        'update': {
            'sequelize':{
                'mysql':{},
                'postgres':{},
                'sqlite': {}
            },
            'typeorm':{
                'mysql':{},
                'postgres':{},
                'sqlite': {}
            },
            'bookshelf':{
                'mysql':{},
                'postgres':{},
                'sqlite': {}
            }
        },
        'select': {
            'sequelize':{
                'mysql':{},
                'postgres':{},
                'sqlite': {}
            },
            'typeorm':{
                'mysql':{},
                'postgres':{},
                'sqlite': {}
            },
            'bookshelf':{
                'mysql':{},
                'postgres':{},
                'sqlite': {}
            }
        },
        'delete': {
            'sequelize':{
                'mysql':{},
                'postgres':{},
                'sqlite': {}
            },
            'typeorm':{
                'mysql':{},
                'postgres':{},
                'sqlite': {}
            },
            'bookshelf':{
                'mysql':{},
                'postgres':{},
                'sqlite': {}
            }
        }
    }
    Object.keys(sequelizeBenchmarkSpeeds).forEach(ele => {
        tables.insert.sequelize[ele] = sequelizeBenchmarkSpeeds[ele].insert
        tables.update.sequelize[ele] = sequelizeBenchmarkSpeeds[ele].update
        tables.select.sequelize[ele] = sequelizeBenchmarkSpeeds[ele].select
        tables.delete.sequelize[ele] = sequelizeBenchmarkSpeeds[ele].delete
    });
    Object.keys(typeormBenchmarkSpeeds).forEach(ele => {
        tables.insert.typeorm[ele] = typeormBenchmarkSpeeds[ele].insert
        tables.update.typeorm[ele] = typeormBenchmarkSpeeds[ele].update
        tables.select.typeorm[ele] = typeormBenchmarkSpeeds[ele].select
        tables.delete.typeorm[ele] = typeormBenchmarkSpeeds[ele].delete
    });
    Object.keys(bookshelfBenchmarkSpeeds).forEach(ele => {
        tables.insert.bookshelf[ele] = bookshelfBenchmarkSpeeds[ele].insert
        tables.update.bookshelf[ele] = bookshelfBenchmarkSpeeds[ele].update
        tables.select.bookshelf[ele] = bookshelfBenchmarkSpeeds[ele].select
        tables.delete.bookshelf[ele] = bookshelfBenchmarkSpeeds[ele].delete
    });


    console.log("\n\nINSERT DATA (ms)")
    console.table(tables.insert)
    console.log("\nUPDATE DATA (ms)")
    console.table(tables.update)
    console.log("\nSELECT DATA (ms)")
    console.table(tables.select)
    console.log("\nDELETE DATA (ms)")
    console.table(tables.delete)
    
    Object.keys(sequelizeInstances).forEach(ele => sequelizeInstances[ele].close());
    Object.keys(typeormInstances).forEach(ele => typeormInstances[ele].close());
    Object.keys(bookmarkInstances).forEach(ele => bookmarkInstances[ele].knex.destroy());
    
}

if (require.main === module) {
    Promise.all([createMySQLDB(),createPostgresDB(),fetchUserList()]).then((data)=>{
        main(data[2]);
    }).catch((e)=>{
        console.log(e);
    })
}