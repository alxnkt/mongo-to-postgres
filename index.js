#!/usr/bin/env node

import mongoose from 'mongoose';
import Knex from 'knex';
import getFromMongo from './src/get-from-mongo.js';
import putToPostgres from './src/put-to-postgres.js';
// import { collections } from './settings.js';
// import { mongooseConn, knex } from './src/db-connection.js';

export default async ({ connections, collections }) => {
  console.log('Starting migration...');

  let mongooseConn;
  process.stdout.write('Connectiong to mongo... ');
  try {
    mongooseConn = await mongoose.connect(connections.mongo,
      {
        useNewUrlParser: true, useUnifiedTopology: true
      });
    console.log('connected.');
  } catch (err) {
    console.log('ERROR');
    console.err(err);
  }

  let knex;
  process.stdout.write('Connectiong to postgres... ');
  try {
    knex = Knex({
      client: 'pg',
      connection: connections.postgres
    });
    console.log('connected.');
  } catch (err) {
    console.err(err);
  }

  performProcess(mongooseConn, knex, collections)
    .then(() => console.log('Finished successfully.'))
    .catch((err) => console.error(err))
    .finally(() => process.exit(0));
};

async function performProcess(mongooseConn, knex, collections) {
  for (const collection of collections) {
    const rows = await getFromMongo(mongooseConn, collection.collectionName);
    const idsMap = await putToPostgres({
      knex,
      collections,
      tableName: collection.tableName,
      rows: rows
    });
    collection.idsMap = idsMap;
  }
}
