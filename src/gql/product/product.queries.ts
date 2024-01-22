import { Collection, ObjectId } from "mongodb";

export const productQueries = `
    type Query {
        product(_id: String!): Product
    }
`