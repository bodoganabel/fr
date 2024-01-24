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
    const stream = createReadStream(csvFilePath).pipe(csvParser());
    let batch: IProductInput[] = [];
    const errors: unknown[] = [];

    let isBatchProcessing = false;
    let processedCount = 0;

    stream.on('readable', async () => {
        if (isBatchProcessing) {
            // If a batch is currently being processed, don't read new data.
            return;
        }

        let data;
        while (null !== (data = stream.read()) && !isBatchProcessing) {
            const product = mapDataToProduct(data);
            batch.push(product);

            if (batch.length >= BATCH_SIZE) {
                isBatchProcessing = true;
                try {
                    await processBatch(batch, errors, () => {
                        processedCount += batch.length;
                        process.stdout.write(`upserted: ${processedCount}\r`);
                    });
                    batch.length = 0; // Clear the batch
                } catch (error) {
                    console.error('Error during batch processing:', error);
                    errors.push(error);
                }
                isBatchProcessing = false;
            }
        }
    });

    stream.on('end', async () => {
        // Handle any remaining products
        if (batch.length > 0) {
            try {
                await processBatch(batch, errors, () => {
                    processedCount += batch.length;
                    console.log(`Final batch processed. Total products processed: ${processedCount}`);
                });
            } catch (error) {
                console.error('Error during the final batch processing:', error);
            }
        }
        console.log(`Import completed. Total products processed: ${processedCount}`);
    });

    stream.on('error', (error) => {
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

async function processBatch(batch: IProductInput[], errors: unknown[], successCallback: () => void) {
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
