export const productQueries = `
    type Query {
        product(_id: String!): Product
        productByProducer(_id: String!): Product
    }
`