export const productEntities = `
    type Product {
        _id: ObjectId!
        vintage: String!
        name: String!
        producerId: ObjectId!
        producer: Producer!
    }
`;