// csvImport.ts
import { ReadStream, createReadStream } from 'fs';
import csvParser from 'csv-parser'; // Make sure to install the csv-parser package
import { getProductsCollection } from '../../database/database';
import { IProduct, IProductInput } from '../product/product.types';
import path from 'path';

const BATCH_SIZE = 100;
const mock_path = path.join(__dirname, '../', '../', 'database/all_listings.csv')
console.log('mock_path', mock_path);

/* 
IMPORTANT!
node's ReadStream has a bug:
https://github.com/nodejs/node-v0.x-archive/issues/3767

piped read stream does not unpause 
*/

export async function importProductsFromCSV(csvFilePath: string = mock_path) {
    const stream = createReadStream(csvFilePath);
    let batch: IProductInput[] = [];
    const errors: unknown[] = [];

    let isBatchProcessing = false; // Flag to check if a batch is currently being processed
    let processedCount = 0; // Make this a scope-wide variable

    stream.pipe(csvParser())
        .on('data', async (data) => {
            stream.pause(); // Always pause the stream when new data arrives
            const product = mapDataToProduct(data);
            batch.push(product);

            if (batch.length >= BATCH_SIZE && !isBatchProcessing) {
                console.log('batch:');
                console.log(batch);
                isBatchProcessing = true; // Set the flag
                try {
                    await processBatch(batch, stream, errors, () => {
                        processedCount += batch.length;
                        console.log(`Batch processed. Total product upserted: ${processedCount}`)
                    });
                    batch.length = 0; // Clear the batch
                    console.log(`Batch processed. Current total processed count: ${processedCount}`);
                } catch (error) {
                    console.error('Error during batch processing:', error);
                    errors.push(error); // Store the error
                }
                isBatchProcessing = false; // Reset the flag
                stream.resume(); // Resume the stream after processing
            } else {
                stream.resume(); // If the batch size hasn't been reached, resume the stream
            }
        })
        .on('end', async () => {
            if (batch.length > 0) {
                try {
                    await upsertBatch(batch);
                    processedCount += batch.length; // Update the processed count
                } catch (error) {
                    console.error('Error during the final batch upsert:', error);
                }
            }
            console.log(`Import completed. Total products processed: ${processedCount}`);
        })
        .on('error', (error) => {
            console.error('Stream error:', error);
        });
}


function mapDataToProduct(data: { [key: string]: any }): IProductInput {
    return {
        vintage: data['Vintage'],
        name: data['Product Name'],
        producerId: data['Producer'] // Assuming Producer is the ID, if not, you might need additional logic to fetch or map it to the ID.
    };
}

async function processBatch(batch: IProductInput[], stream: ReadStream, errors: unknown[], successCallback: () => void) {
    try {
        await upsertBatch(batch);
        successCallback();
    } catch (error) {
        console.error('Error during batch upsert:', error);
        errors.push(error); // Store the error
        throw error; // Rethrow the error to be caught in the .on('data') handler
    }
}

async function upsertBatch(batch: IProductInput[]) {
    // Group by 'Vintage + Product Name + Producer'
    const grouped: any = groupBy(batch, (product: IProduct) => `${product.vintage}_${product.name}_${product.producerId}`);

    for (const groupKey in grouped) {
        if (grouped.hasOwnProperty(groupKey)) {
            const products = grouped[groupKey];
            // Take the first product as a sample for upsert
            const productSample = products[0];

            // Perform upsert operation in MongoDB for each unique group
            await getProductsCollection().updateOne(
                { vintage: productSample.vintage, name: productSample.name, producerId: productSample.producerId },
                { $set: productSample },
                { upsert: true }
            );
        }
    }
}

function groupBy(array: any, keyGetter: any) {
    const map: any = {};
    array.forEach((item: any) => {
        const key = keyGetter(item);
        if (!map[key]) {
            map[key] = [];
        }
        map[key].push(item);
    });
    return map;
}
