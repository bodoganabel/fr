# Tasks
Breakdown of the full task

* ✅ [FR-0]: Define subtasks
* ✅ [FR-1]: Initialize repo, run express & graphql server
* ✅ [FR-2]: Create mongodb dev instance & connect
* [FR-3]: Create product entities
* [FR-4]: Query product by _id
* [FR-5]: Query product by producer _id
* [FR-6]: Mutation - Create multiple products
* [FR-7]: Mutation - Update single products
* [FR-8]: Mutation - Delete multiple products
* [FR-9]: Mutation - Synchronize multiple products
** - fetching csv
** - upserting in batch





# Simple Product API 

Build a simple product api in TypeScript, which can manage product and producer entities using
MongoDB.
Preferred a graphql api, but if you are not familiar with graphql, a simple rest is perfect as well.
(Do not use Apollo ecosystem, please)
## Entities
The api deals with the following two entities:
Product
• _id: ObjectId!
• vintage: String!
• name: String!
• producerId: ObjectId!
• producer: Producer!
Producer
• _id: ObjectId!
• name: String!
• country: String
• region: String

## Requirements
Queries
• Query a single product by its _id.
• Query products by producer _id.Only the single query (by _id) must be able to join the
producer by the graphql query, eg:
query {
product(_id: "...") {
name
producer {
name
country
region
}
}
}
(If you are working with REST instead of graphql, use a query param for this purpose.)
Mutations
• Create multiple products
• Update a single product
• Delete multiple products
## Product synchronization mutation
Create a mutation which
• returns true before it does anything,
• in the background it starts a process which
o fetches a CSV file as a NodeJS stream,
o groups by Vintage + Product Name + Producer (as a unique field
combination on products) and proceeds an upsert into the MongoDB. This
grouping and upsert shall happen in batches (~100 operation / request) within
the stream. (Do not worry about proceeding the upsert multiple times on the
same product during the stream.)
o If the stream aborts for some reason, it should not cause an unhandled rejection.
Just log it to the console.