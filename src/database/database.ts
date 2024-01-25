// database.ts

import { Collection, Db, MongoClient } from 'mongodb';

//const url = 'mongodb://root:secret@localhost:27018/frDb';
const url = `mongodb://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@mongodb:27017/${process.env.DATABASE_NAME}`
const client = new MongoClient(url);
const dbName = 'frDb';

let db: Db;
let productsCollection: Collection;
let producersCollection: Collection;

const connectToDB = async () => {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        db = client.db(dbName);
        productsCollection = db.collection('products');
        producersCollection = db.collection('producers');
    } catch (e) {
        console.error(e);
    }
};

const getDB = () => db;
const getProductsCollection = () => productsCollection;
const getProducersCollection = () => producersCollection;



export {
    connectToDB,
    getDB,
    getProductsCollection,
    getProducersCollection,
};
