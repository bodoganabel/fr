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
