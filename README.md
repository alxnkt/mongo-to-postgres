# Simple migrate data from MongoDb to PostgreSQL

This tiny tool is used to simple migrate data from MongoDb database
to PostgreSQL database. It uses appropriate ORMs: `mongoose` and 
`knex` respectively to transfer data.

## Requirements
* Node.js 13+ **(NOT 14!!!)**
* MongoDb 4+
* PostgreSQL 12+

## Usage

### 1. Install package

`$ yarn add mongo-to-postgres`

OR

`$ npm i mongo-to-postgres`

### 2. Create file `migrate.js`, set migration settings in it

**IMPORTANT NOTES**

**1. You MUST respect the order of the tables. Tables with foreign keys MUST BE placed AFTER tables, from which these keys are.**

**2. This sample assumes that you have postgres database with empty schema.**

```javascript
import migrate from 'mongo-to-postgres';

migrate({
  // Define connection strings
  connections: {
    mongo: 'mongodb://localhost/dbname',
    postgres: 'postgres://postgres:secret@localhost:5432/dbname'
  },
  // Define your database migration settings
  collections: [
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
  ]
});
```

### 3. Set `package.json` `"type"` field

```json
{
  "type": "module",
  "dependencies": {
    "mongo-to-postgres": "^0.0.4"
  }
}
```

### 4. Run migration

`$ node migrate.js`