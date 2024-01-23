import { ObjectId } from "mongodb";

export const productEntities = `
    type Product {
        _id: ObjectId!
        vintage: String!
        name: String!
        producerId: ObjectId!
        producer: Producer!
    }

    input ProductInput {
        vintage: String!
        name: String!
        producerId: ObjectId!
    }
`;

export interface IProductInput {
    vintage: string;
    name: string;
    producerId: ObjectId;
}