db = db.getSiblingDB('frDb');

db.createUser({
  user: 'root',
  pwd: 'secret',
  roles: [
    { role: 'dbOwner', db: 'frDb' },
    { role: 'readWrite', db: 'frDb' },
  ],
});

db.createCollection('users');
db.createCollection('products')
db.createCollection('producers')


// Inserting a producer document into the 'producers' collection
db.producers.insertOne({
  name: 'Pro manufact BT',
  country: 'Hungary',
  region: 'EU'
});
