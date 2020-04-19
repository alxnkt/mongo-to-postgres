import mongoose from 'mongoose';
import Knex from 'knex';

const mongooseConn = mongoose.connect(process.env.MONGO_CONNECTION_STRING,
  {
    useNewUrlParser: true, useUnifiedTopology: true
  });

const knex = Knex({
  client: 'pg',
  connection: process.env.PG_CONNECTION_STRING,
});

export { mongoose, mongooseConn, knex };
