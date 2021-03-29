const {performance} = require('perf_hooks');

async function sequelizeBenchmark(sequelizeInstances, users){
  console.log("\nSEQUELIZE-INSERT 250 USERS");
  await insertBenchmark(sequelizeInstances, users, 'mysql');
  await insertBenchmark(sequelizeInstances, users, 'postgres');
  await insertBenchmark(sequelizeInstances, users, 'sqlite');
  console.log("\nSEQUELIZE-UPDATE 250 USERS");
  await updateBenchmark(sequelizeInstances, users, 'mysql');
  await updateBenchmark(sequelizeInstances, users, 'postgres');
  await updateBenchmark(sequelizeInstances, users, 'sqlite');
  console.log("\nSEQUELIZE-SELECT 250 USERS");
  await selectBenchmark(sequelizeInstances, 'mysql');
  await selectBenchmark(sequelizeInstances, 'postgres');
  await selectBenchmark(sequelizeInstances, 'sqlite');
  console.log("\nSEQUELIZE-DELETE 250 USERS");
  await deleteBenchmark(sequelizeInstances, 'mysql');
  await deleteBenchmark(sequelizeInstances, 'postgres');
  await deleteBenchmark(sequelizeInstances, 'sqlite');
}

async function insertBenchmark(sequelizeInstances, users, orm){
  const start = performance.now();
  for(let i = 0; i < users.length; i++){
    await sequelizeInstances[orm].models.sequelizeUser.create({
      firstName: users[i].name.first, 
      lastName: users[i].name.last, 
      email: users[i].email,
      username: users[i].login.username,
      password:  users[i].login.password
    })
  }
  const end = performance.now();
  console.log(`${orm.toUpperCase()} ${end - start}ms`);
}

async function updateBenchmark(sequelizeInstances, users, orm){
  const start = performance.now();
  for(let i = 0; i < users.length; i++){
    await sequelizeInstances[orm].models.sequelizeUser.update({
      firstName: users[users.length - 1 - i].name.first, 
      lastName: users[users.length - 1 - i].name.last, 
      email: users[users.length - 1 - i].email,
      username: users[users.length - 1 - i].login.username,
      password:  users[users.length - 1 - i].login.password
    },{
      where: {
        id: i
      }
    })
  }
  const end = performance.now();
  console.log(`${orm.toUpperCase()} ${end - start}ms`);
}

async function selectBenchmark(sequelizeInstances, orm){
  const start = performance.now();
  await sequelizeInstances[orm].models.sequelizeUser.findAll();
  const end = performance.now();
  console.log(`${orm.toUpperCase()} ${end - start}ms`);
}

async function deleteBenchmark(sequelizeInstances, orm){
  const start = performance.now();
  await sequelizeInstances[orm].models.sequelizeUser.destroy({
    truncate: true
  });
  const end = performance.now();
  console.log(`${orm.toUpperCase()} ${end - start}ms`);
}

exports.sequelizeBenchmark = sequelizeBenchmark;