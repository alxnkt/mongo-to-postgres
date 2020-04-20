import { mongoose, mongooseConn } from './db-connection.js';

/**
   * Get data from source collection
   * @param {string} collectionName - Collection name
   * @return {Array} Retrieved objects
   */
export default async (collectionName) => {
  const Model = (await mongooseConn).model(collectionName,
    new mongoose.Schema({}, { collection: collectionName })
  );
  const result = await Model.find({});
  return result.map((r) => {
    delete r._doc.__v;
    return r._doc;
  });
};
