export const productMutations = `
    type Mutation {
        createMultipleProducts(products: [ProductInput!]!): [Product!]!
    }
`