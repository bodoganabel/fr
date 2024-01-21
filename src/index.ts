import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import cors from 'cors';
import { MongoClient } from 'mongodb';

// Initialize the Express app
const app = express();
app.use(cors());

// Connect to MongoDB
const url = 'connection-string';
const client = new MongoClient(url);

async function main() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");

        // Define a schema
        const schema = buildSchema(`
            type Query {
                hello: String
            }
        `);

        // Root provides a resolver function for each API endpoint
        const root = {
            hello: () => {
                return 'Hello world!';
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
