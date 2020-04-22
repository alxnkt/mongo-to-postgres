import mongoose from 'mongoose';
import Knex from 'knex';
import { connections } from '../settings.js';

const mongooseConn = mongoose.connect(connections.mongo,
  {
    useNewUrlParser: true, useUnifiedTopology: true
  });

const knex = Knex({
  client: 'pg',
  connection: connections.postgres
});

export { mongoose, mongooseConn, knex };
