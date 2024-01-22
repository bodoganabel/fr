import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import { productEntities } from './gql/product/product.entities';
import { producerEntities } from './gql/producer/producer.entities';
import { baseEntities } from './gql/base.entities';
import { productQueries } from './gql/product/product.queries';
import { productResolvers } from './gql/product/product.resolvers';

// Initialize the Express app
const app = express();
app.use(cors());

// Connect to MongoDB
const url = 'mongodb://root:secret@localhost:27018/frDb';
const client = new MongoClient(url);


async function main() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db('frDb');
        const productsCollection = db.collection('products');
        const producersCollection = db.collection('producers');

        // Schema
        const schema = buildSchema(`
        ${baseEntities}
        ${productEntities}
        ${producerEntities}

        ${productQueries} 
        
        `);



        const resolvers = {
            ...productResolvers(productsCollection),
        };

        app.use('/graphql', graphqlHTTP({
            schema: schema,
            rootValue: resolvers,
            graphiql: true,
        }));

        app.listen(4000, () => console.log('Running a GraphQL API server at http://localhost:4000/graphql'));
    } catch (e) {
        console.error(e);
    }
}

main().catch(console.error);
