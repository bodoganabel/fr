import { Collection, ObjectId } from "mongodb";
import { IProductInput } from "./product.entities";

export function productResolvers(productsCollection: Collection, producerCollection: Collection) {
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

        async createMultipleProducts(productsInput: { products: IProductInput[] }) {
            const products = productsInput.products;

            console.log('products:');
            console.log(products);
            try {
                const validProducts = [];
                const invalidProducts = [];

                // Check if producerId exists for each product
                for (const product of products) {
                    const producerExists = await producerCollection.findOne({ _id: new ObjectId(product.producerId) });
                    if (producerExists) {
                        validProducts.push(product);
                    } else {
                        invalidProducts.push(product);
                        console.error(`Error: Producer not found for product: `, product);
                    }
                }

                if (validProducts.length === 0) {
                    throw new Error('No valid products to insert.');
                }

                // Insert only valid products
                const result = await productsCollection.insertMany(validProducts);

                // Fetch the inserted documents using the insertedIds
                const insertedProducts = await productsCollection.find({
                    _id: { $in: Object.values(result.insertedIds) }
                }).toArray();

                return insertedProducts;
            } catch (error: any) {
                throw new Error('Error creating multiple products: ' + error.message);
            }
        }
    }
}