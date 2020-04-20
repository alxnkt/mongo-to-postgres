import getFromMongo from './src/get-from-mongo.js';
import putToPostgres from './src/put-to-postgres.js';
import collections from './settings.js';

async function performProcess () {
  for (const collection of collections) {
    const rows = await getFromMongo(collection.collectionName);
    const idsMap = await putToPostgres({
      tableName: collection.tableName,
      rows: rows
    });
    collection.idsMap = idsMap;
  }
}

console.log('Migration started:');
performProcess()
  .then(() => console.log('Finished successfully.'))
  .catch((err) => console.error(err))
  .finally(() => process.exit(0));
