import { makeExecutableSchema } from '@graphql-tools/schema';
import { mergeResolvers } from '@graphql-tools/merge';

import { producerTypes } from './producer/producer.types';
import { productTypes } from './product/product.types';
import { productResolvers } from './product/product.resolvers';




// Multiple files to keep your project modularised
export const schema = makeExecutableSchema({
    typeDefs: [
        producerTypes, // First defines the type Query
        productTypes, // Others extends type Query
    ],
    resolvers: mergeResolvers(
        productResolvers,
    )
})

