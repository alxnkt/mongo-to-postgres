# Simple migrate data from MongoDb to PostgreSQL

This tiny tool is used to simple migrate data from MongoDb database
to PostgreSQL database. It uses appropriate ORMs: mongoose and 
knex respectively to transfer data.

# Requrements
* Node.js 13+
* MongoDb 4+
* PostgreSQL 12+

# Usage

1. Clone repository:
`# git clone https://github.com/alxnkt/mongo-to-postgres`

2. Define migration options in `settings.js` file:

3. Run `index.js` script. Connection string are defined in env variables:
`MONGO_CONNECTION_STRING=mongodb://host/db PG_CONNECTION_STRING=postgres://user:password@host:5432/db node index.js`