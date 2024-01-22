import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import { productEntities } from './gql/product/product.entities';
import { producerEntities } from './gql/producer/producer.entities';
import { baseEntities } from './gql/base.entities';

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

        // Define a schema
        const schema = buildSchema(`
        ${baseEntities}
        ${productEntities}
        ${producerEntities}

        type Query {
            test(_id: String!): Product
        } 
        `);

        // Root provides a resolver function for each API endpoint
        const root = {
            async test({ _id }: { _id: string }) {
                console.log('test: ' + _id);
                // Fetch a single product by its _id from your database
                return /* IMPLEMENT THIS */
            },
        };

        app.use('/graphql', graphqlHTTP({
            schema: schema,
            rootValue: root,
            graphiql: true,
        }));

        app.listen(4000, () => console.log('Running a GraphQL API server at http://localhost:4000/graphql'));
    } catch (e) {
        console.error(e);
    }
}

main().catch(console.error);
