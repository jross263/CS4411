const {performance} = require('perf_hooks');
const User = require('./entities/User');

const benchmarkSpeeds = {
  'mysql':{},
  'postgres':{},
  'sqlite': {}
};


async function typeormBenchmark(typeormInstances, users){
  console.log("\nTYPEORM-INSERT 5000 USERS");
  await insertBenchmark(typeormInstances, users, 'mysql');
  await insertBenchmark(typeormInstances, users, 'postgres');
  await insertBenchmark(typeormInstances, users, 'sqlite');
  console.log("\nTYPEORM-UPDATE 5000 USERS");
  await updateBenchmark(typeormInstances, users, 'mysql');
  await updateBenchmark(typeormInstances, users, 'postgres');
  await updateBenchmark(typeormInstances, users, 'sqlite');
  console.log("\nTYPEORM-SELECT 5000 USERS");
  await selectBenchmark(typeormInstances, 'mysql');
  await selectBenchmark(typeormInstances, 'postgres');
  await selectBenchmark(typeormInstances, 'sqlite');
  console.log("\nTYPEORM-DELETE 5000 USERS");
  await deleteBenchmark(typeormInstances, 'mysql');
  await deleteBenchmark(typeormInstances, 'postgres');
  await deleteBenchmark(typeormInstances, 'sqlite');
  return benchmarkSpeeds;
}

async function insertBenchmark(typeormInstances, users, dbms){
  const start = performance.now();
  for(let i = 0; i < users.length; i++){
    await typeormInstances[dbms].createQueryBuilder()
    .insert()
    .into(User)
    .values([
        {
          firstName: users[i].name.first,
          lastName: users[i].name.last,
          email: users[i].email,
          username: users[i].login.username,
          password:  users[i].login.password
        }, 
     ])
    .execute();
  }
  const end = performance.now();
  benchmarkSpeeds[dbms]['insert'] = (Math.round((end - start) * 100) / 100).toFixed(2);
}

async function updateBenchmark(typeormInstances, users, dbms){
  const start = performance.now();
  for(let i = 1; i < users.length + 1; i++){
    await typeormInstances[dbms].createQueryBuilder()
    .update(User)
    .set({
          firstName: users[users.length - i].name.first, 
          lastName: users[users.length - i].name.last, 
          email: users[users.length - i].email,
          username: users[users.length - i].login.username,
          password:  users[users.length - i].login.password
        })
     .where("id = :id", { id: i })
    .execute();
  }
  const end = performance.now();
  benchmarkSpeeds[dbms]['update'] = (Math.round((end - start) * 100) / 100).toFixed(2);
}

async function selectBenchmark(typeormInstances, dbms){
  const start = performance.now();
  await typeormInstances[dbms].createQueryBuilder()
    .select("user")
    .from(User, "user")
    .getMany();
  const end = performance.now();
  benchmarkSpeeds[dbms]['select'] = (Math.round((end - start) * 100) / 100).toFixed(2);
}

async function deleteBenchmark(typeormInstances, dbms){
  const start = performance.now();
  await typeormInstances[dbms].createQueryBuilder()
    .delete()
    .from(User)
    .execute();
  const end = performance.now();
  benchmarkSpeeds[dbms]['delete'] = (Math.round((end - start) * 100) / 100).toFixed(2);
}

exports.typeormBenchmark = typeormBenchmark;