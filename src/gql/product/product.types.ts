import gql from "graphql-tag";
import { IProducer } from "../producer/producer.types";

export const productTypes = gql`
type Product {
        _id: String!
        vintage: String!
        name: String!
        producerId: String!
        producer: Producer!
    }

    input ProductInput {
        vintage: String!
        name: String!
        producerId: String!
    }

    input UpdateProductInput {
    _id: String!
    vintage: String
    name: String
    producerId: String
}

    type Query {
        product(_id: String!): Product
        productsByProducer(_id: String!): [Product!]!
    }

    type Mutation {
        createMultipleProducts(products: [ProductInput!]!): [Product!]!
        updateProduct(product: UpdateProductInput!): Product!
        deleteMultipleProducts(_ids: [String!]!): [String!]!
        importProductsFromCSV: Boolean!
    }
`;


export interface IProduct {
    _id: string;
    vintage: string;
    name: string;
    producerId: string;
    producer: IProducer;
}

export interface IProductInput {
    vintage: string,
    name: string,
    producerId: string,
}

export interface IUpdateProductInput extends IProductInput {
    _id: string
}