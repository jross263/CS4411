const {performance} = require('perf_hooks');
const User = require('./models/users');

const benchmarkSpeeds = {
  'mysql':{},
  'postgres':{},
  'sqlite': {}
};

const Users = {
  'mysql': null,
  'postgres': null,
  'sqlite': null
}


async function bookshelfBenchmark(bookshelfInstances, users){

  Users.mysql =  await bookshelfInstances.mysql.model('User', {
    tableName: 'bookshelfUser',
  })
  Users.postgres =  await bookshelfInstances.postgres.model('User', {
    tableName: 'bookshelfUser',
  })
  Users.sqlite =  await bookshelfInstances.sqlite.model('User', {
    tableName: 'bookshelfUser',
  })

  console.log("\nBOOKSHELF-INSERT 5000 USERS");
  await insertBenchmark(users, 'mysql');
  await insertBenchmark(users, 'postgres');
  await insertBenchmark(users, 'sqlite');
  console.log("\nBOOKSHELF-UPDATE 5000 USERS");
  await updateBenchmark(users, 'mysql');
  await updateBenchmark(users, 'postgres');
  await updateBenchmark(users, 'sqlite');
  console.log("\nBOOKSHELF-SELECT 5000 USERS");
  await selectBenchmark('mysql');
  await selectBenchmark('postgres');
  await selectBenchmark('sqlite');
  console.log("\nBOOKSHELF-DELETE 5000 USERS");
  await deleteBenchmark('mysql');
  await deleteBenchmark('postgres');
  await deleteBenchmark('sqlite');
  return benchmarkSpeeds;
}

async function insertBenchmark(users, dbms){
  const start = performance.now();
  for(let i = 0; i < users.length; i++){
    await Users[dbms].forge({
      firstName: users[i].name.first, 
      lastName: users[i].name.last, 
      email: users[i].email,
      username: users[i].login.username,
      password:  users[i].login.password
    }).save();
  }
  const end = performance.now();
  benchmarkSpeeds[dbms]['insert'] = (Math.round((end - start) * 100) / 100).toFixed(2);
}

async function updateBenchmark(users, dbms){
  const start = performance.now();
  for(let i = 1; i < users.length + 1; i++){
    await Users[dbms].where({id:i}).save({
      firstName: users[users.length - i].name.first, 
      lastName: users[users.length - i].name.last, 
      email: users[users.length - i].email,
      username: users[users.length - i].login.username,
      password:  users[users.length - i].login.password
    },{patch:true});
  }
  const end = performance.now();
  benchmarkSpeeds[dbms]['update'] = (Math.round((end - start) * 100) / 100).toFixed(2);
}

async function selectBenchmark(dbms){
  const start = performance.now();
  await Users[dbms].fetchAll();
  const end = performance.now();
  benchmarkSpeeds[dbms]['select'] = (Math.round((end - start) * 100) / 100).toFixed(2);
}

async function deleteBenchmark(dbms){
  const start = performance.now();
  await Users[dbms].where('id', '!=', '0').destroy();
  const end = performance.now();
  benchmarkSpeeds[dbms]['delete'] = (Math.round((end - start) * 100) / 100).toFixed(2);
}

exports.bookshelfBenchmark = bookshelfBenchmark;