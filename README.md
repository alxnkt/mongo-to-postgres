# Simple migrate data from MongoDb to PostgreSQL

This tiny tool is used to simple migrate data from MongoDb database
to PostgreSQL database. It uses appropriate ORMs: `mongoose` and 
`knex` respectively to transfer data.

## Requirements
* Node.js 13+
* MongoDb 4+
* PostgreSQL 12+

## Usage

### 1. Clone repository:

`$ git clone https://github.com/alxnkt/mongo-to-postgres`

### 2. Define connection strings and migration settings in `settings.js` file:

**IMPORTANT NOTE**

**You MUST respect the order of the tables. Tables with foreign keys MUST BE placed AFTER tables, from which these keys are.**

*You can use this sample schema.*

```
const connections = {
  mongo: 'mongodb://localhost/dbname',
  postgres: 'postgres://postgres:secret@localhost:5432/dbname'
};

const collections = [
  // Define your database migration settings here
  {
    collectionName: 'department',  // collection name in Mongo
    tableName: 'departments',      // table name in Postgres
    fieldsRename: [
      ['createdAt', 'created_at'], // set new name for field (optional)
      ['updatedAt', 'updated_at']  // set new name for other field (optional)
    ],
    fieldsRedefine: [
      ['dep_type', 1]              // force to set value for all records (optional)
    ]
  },
  {
    collectionName: 'award',       // collection name in Mongo
    tableName: 'awards',           // table name in Postgres
  },
  {
    collectionName: 'employee',    // collection name in Mongo
    tableName: 'employees',        // table name in Postgres
    foreignKeys: {
      department: 'department',    // foreign keys (field: collection) (optional)
    },
    links: {                       // "many-to-many" links
      awards: ['emplyees__awards', 'employee_id', 'award_id']
    }
  }
];

export { connections, collections };
```

### 3. Run migration

`$ migrate`