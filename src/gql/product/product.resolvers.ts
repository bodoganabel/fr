import { ObjectId } from "mongodb";
import { IProduct, IProductInput } from "./product.types";
import { getProducersCollection, getProductsCollection } from "../../database/database";


export const productResolvers = {

    Product: {
        async producer(product: IProduct, args: any) {
            return await getProducersCollection().findOne({ _id: new ObjectId(product.producerId) });
        }
    },

    Query: {
        // Fetch a single product by its _id from your database
        async product(parent: any, args: { _id: string }) {
            const { _id } = args;
            const product = await getProductsCollection().findOne({ _id: new ObjectId(_id) });
            if (!product) {
                throw new Error('Product not found');
            }
            return product;
        },

        // Fetch a single product by its producer's _id from your database
        async productsByProducer(parent: any, args: { _id: string }) {
            const { _id } = args;

            console.log('_id:');
            console.log(_id);

            const products = await getProductsCollection().find({ producerId: _id }).toArray();
            console.log('products:');
            console.log(products);
            if (!products) {
                throw new Error('Product not found');
            }
            return products;
        },
    },
    Mutation: {
        async createMultipleProducts(parent: any, args: { products: IProductInput[] }, context: any, info: any) {
            const products = args.products;

            console.log('products:');
            console.log(products);
            try {
                const validProducts = [];
                const invalidProducts = [];

                // Check if producerId exists for each product
                for (const product of products) {
                    const producerExists = await getProducersCollection().findOne({ _id: new ObjectId(product.producerId) });
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
                const result = await getProductsCollection().insertMany(validProducts);

                // Fetch the inserted documents using the insertedIds
                const insertedProducts = await getProductsCollection().find({
                    _id: { $in: Object.values(result.insertedIds) }
                }).toArray();

                return insertedProducts;
            } catch (error: any) {
                throw new Error('Error creating multiple products: ' + error.message);
            }
        }
    }
}
