import { Collection, ObjectId } from "mongodb";

export function productResolvers(productsCollection: Collection) {
    return {
        // Fetch a single product by its _id from your database
        async product({ _id }: { _id: string }) {
            const product = await productsCollection.findOne({ _id: new ObjectId(_id) });
            if (!product) {
                throw new Error('Product not found');
            }
            return product;
        },

        // Fetch a single product by its producer's _id from your database
        async productByProducer({ _id }: { _id: string }) {
            const product = await productsCollection.findOne({ producerId: new ObjectId(_id) });
            if (!product) {
                throw new Error('Product not found');
            }
            return product;
        },
    }
}