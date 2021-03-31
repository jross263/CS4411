const {performance} = require('perf_hooks');

const benchmarkSpeeds = {
  'mysql':{},
  'postgres':{},
  'sqlite': {}
};

async function sequelizeBenchmark(sequelizeInstances, users){
  console.log("\nSEQUELIZE-INSERT 5000 USERS");
  await insertBenchmark(sequelizeInstances, users, 'mysql');
  await insertBenchmark(sequelizeInstances, users, 'postgres');
  await insertBenchmark(sequelizeInstances, users, 'sqlite');
  console.log("\nSEQUELIZE-UPDATE 5000 USERS");
  await updateBenchmark(sequelizeInstances, users, 'mysql');
  await updateBenchmark(sequelizeInstances, users, 'postgres');
  await updateBenchmark(sequelizeInstances, users, 'sqlite');
  console.log("\nSEQUELIZE-SELECT 5000 USERS");
  await selectBenchmark(sequelizeInstances, 'mysql');
  await selectBenchmark(sequelizeInstances, 'postgres');
  await selectBenchmark(sequelizeInstances, 'sqlite');
  console.log("\nSEQUELIZE-DELETE 5000 USERS");
  await deleteBenchmark(sequelizeInstances, 'mysql');
  await deleteBenchmark(sequelizeInstances, 'postgres');
  await deleteBenchmark(sequelizeInstances, 'sqlite');
  return benchmarkSpeeds;
}

async function insertBenchmark(sequelizeInstances, users, dbms){
  const start = performance.now();
  for(let i = 0; i < users.length; i++){
    await sequelizeInstances[dbms].models.sequelizeUser.create({
      firstName: users[i].name.first, 
      lastName: users[i].name.last, 
      email: users[i].email,
      username: users[i].login.username,
      password:  users[i].login.password
    })
  }
  const end = performance.now();
  benchmarkSpeeds[dbms]['insert'] = (Math.round((end - start) * 100) / 100).toFixed(2);
}

async function updateBenchmark(sequelizeInstances, users, dbms){
  const start = performance.now();
  for(let i = 1; i < users.length + 1; i++){
    await sequelizeInstances[dbms].models.sequelizeUser.update({
      firstName: users[users.length - i].name.first, 
      lastName: users[users.length - i].name.last, 
      email: users[users.length - i].email,
      username: users[users.length - i].login.username,
      password:  users[users.length - i].login.password
    },{
      where: {
        id: i
      }
    })
  }
  const end = performance.now();
  benchmarkSpeeds[dbms]['update'] = (Math.round((end - start) * 100) / 100).toFixed(2);
}

async function selectBenchmark(sequelizeInstances, dbms){
  const start = performance.now();
  await sequelizeInstances[dbms].models.sequelizeUser.findAll();
  const end = performance.now();
  benchmarkSpeeds[dbms]['select'] = (Math.round((end - start) * 100) / 100).toFixed(2);
}

async function deleteBenchmark(sequelizeInstances, dbms){
  const start = performance.now();
  await sequelizeInstances[dbms].models.sequelizeUser.destroy({
    truncate: true
  });
  const end = performance.now();
  benchmarkSpeeds[dbms]['delete'] = (Math.round((end - start) * 100) / 100).toFixed(2);
}

exports.sequelizeBenchmark = sequelizeBenchmark;