const fs = require("fs");
var path = require("path");

const relativePath = (name) =>
  path.join(__dirname, ".", "collections", name + ".json");

const getCollection = (name) => {
  let collectionPath = relativePath(name);
  return JSON.parse(fs.readFileSync(collectionPath));
};

const saveCollection = (name, data) => {
  let collectionPath = relativePath(name);
  fs.writeFileSync(collectionPath, JSON.stringify(data));
};

const insertItem = async (item, collectionName) => {
  let collection = await getCollection(collectionName);
  collection.push(item);
  await saveCollection(collectionName, collection);
};

const getAllItems = async (collectionName) => {
  return await getCollection(collectionName);
};

const getItemByAtribute = async (collectionName, atributeName, value) => {
  let collection = await getCollection(collectionName);
  return collection.find((element) => element[atributeName] === value);
};

const updateItemByAtribute = async (
  collectionName,
  atributeName,
  value,
  updatedItem
) => {
  let collection = await getCollection(collectionName);
  let objectIndex = collection.findIndex(
    (element) => element[atributeName] === value
  );
  if (!objectIndex) {
    return undefined;
  }
  collection[objectIndex] = updatedItem;
  await saveCollection(collectionName, collection);
  return updatedItem;
};

const deleteItemByAtribute = async (collectionName, atributeName, value) => {
  let collection = await getCollection(collectionName);
  let objectIndex = collection.findIndex(
    (element) => element[atributeName] === value
  );
  if (!objectIndex) {
    return undefined;
  }
  collection.splice(objectIndex, 1);
  console.log(collection);
  await saveCollection(collectionName, collection);
  return 1;
};

module.exports.insertItem = insertItem;
module.exports.getAllItems = getAllItems;
module.exports.getItemByAtribute = getItemByAtribute;
module.exports.updateItemByAtribute = updateItemByAtribute;
module.exports.deleteItemByAtribute = deleteItemByAtribute;
