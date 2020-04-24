import mongoose from 'mongoose';

/**
   * Get data from source collection
   * @param {string} mongooseConn - Connection to mongoose
   * @param {string} collectionName - Collection name
   * @return {Array} Retrieved objects
   */
export default async (mongooseConn, collectionName) => {
  const Model = mongooseConn.model(collectionName,
    new mongoose.Schema({}, { collection: collectionName })
  );
  const result = await Model.find({});
  return result.map((r) => {
    delete r._doc.__v;
    return r._doc;
  });
};
