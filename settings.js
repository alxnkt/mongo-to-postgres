const connections = {
  mongo: 'mongodb://localhost/dbname',
  postgres: 'postgres://postgres:secret@localhost:5432/dbname'
};

const collections = [
  // Define your database migration settings here
];

export { connections, collections };
