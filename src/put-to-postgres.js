/**
   * Insert data to destination table
   * @param {object} kenx - knex object
   * @param {Array} collections - Array of collections
   * @param {string} tableName - Table name
   * @param {string} rows - Objects to insert
   * @return {Array} Ids map
   */
export default async ({ knex, collections, tableName, rows }) => {
  const { foreignKeys, fieldsRename, fieldsRedefine, links } =
    collections.find(c => c.tableName === tableName);

  const idsMap = []; // array for identifiers maps
  for (const currentRow of rows) {
    // rename fields (if necessary)
    if (fieldsRename) {
      for (const value of Object.values(fieldsRename)) {
        if (value[1]) {
          currentRow[value[1]] = currentRow[value[0]];
        }
        delete currentRow[value[0]];
      }
    }

    // redefine attributes
    if (fieldsRedefine) {
      for (const field of fieldsRedefine) {
        currentRow[field[0]] = field[1];
      }
    }

    // map foreign keys
    if (foreignKeys) {
      for (const [fieldName, collectionName] of Object.entries(foreignKeys)) {
        const foreignCollection = collections.find(c => c.collectionName === collectionName);
        const maps = foreignCollection.idsMap;
        if (!Array.isArray(currentRow[fieldName])) {
          const mapedField = maps
            .find(x => x.oldId === (currentRow[fieldName] ? currentRow[fieldName].toString() : null));
          currentRow[fieldName] = mapedField
            ? currentRow[fieldName] = mapedField.newId
            : currentRow[fieldName] = null;
        }
      }
    }

    // save and then delete Mongo _id
    const oldId = currentRow._id.toString();
    delete currentRow._id;

    // remove arrays from row object
    const rowCopy = JSON.parse(JSON.stringify(currentRow));
    for (const fieldName of Object.keys(rowCopy)) {
      if (Array.isArray(rowCopy[fieldName])) {
        delete rowCopy[fieldName];
      }
    }
    // insert current row
    const newId = await knex(tableName)
      .returning('id')
      .insert(rowCopy);

    // save id mapping
    idsMap.push({ oldId, newId: newId[0] });

    // many-to-many links
    if (links) {
      for (const [fieldName, linksTableAttrs] of Object.entries(links)) {
        for (const relatedField of currentRow[fieldName]) {
          const foreignCollection = collections.find(c => c.collectionName === foreignKeys[fieldName]);
          let foreignKey;
          let linkRow = {};
          // if related field contains just ID
          if (relatedField.constructor.name === 'ObjectID') {
            foreignKey = relatedField.toString();
          } else {
          // or if it contains additional fields
            const func = linksTableAttrs[3];
            const res = func(linkRow, relatedField);
            foreignKey = res.foreignKey;
            linkRow = res.linkRow;
          }
          const map = foreignCollection.idsMap.find(x => x.oldId === foreignKey);
          linkRow[linksTableAttrs[1]] = newId[0];
          linkRow[linksTableAttrs[2]] = map.newId;
          await knex(linksTableAttrs[0])
            .insert(linkRow);
        }
      }
    }
    // next row
  }

  console.log(`Inserted ${rows.length} rows to "${tableName}" table`);
  return idsMap;
};
