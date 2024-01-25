import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import cors from 'cors';

import { connectToDB } from './database/database';
import { schema } from './gql';

// Initialize the Express app
const app = express();
app.use(cors());



async function main() {
    try {

        // Connect to MongoDB
        await connectToDB();

        // https://github.com/graphql/express-graphql
        // If no context is created here, the request object is passed instead
        // Todo: add type to request
        app.use('/graphql', graphqlHTTP((req: any) => ({
            schema,
            graphiql: {
                headerEditorEnabled: true
            },
            context: {
                isAuth: req.isAuth,
                user: req.user,
                error: req.error
                // loaders: {
                //     rolesLoader: rolesDataLoader
                // }
            },
            customFormatErrorFn: (err: any) => {
                if (!err.originalError) {
                    return err
                }
                /* 
                    You can add the following to any resolver
                    const error = new Error('My message')
                    error.data = [...]
                    error.code = 001
                */
                const message = err.message || 'An error occured.'
                const code = err.originalError.code
                const data = err.originalError.data
                return {
                    // ...err, 
                    message,
                    code,
                    data
                }
            }
        })))

        const PORT = 4000; // Can be improved later to get from .env

        app.listen(PORT, () => console.log(`Running a GraphQL API server at http://localhost:${PORT}/graphql`));

    } catch (e) {
        console.error(e);
    }
}

main().catch(console.error);
