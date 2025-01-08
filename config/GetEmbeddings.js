import { pipeline } from "@xenova/transformers";


// Function to generate embeddings for a given data source
export async function getEmbedding(data) {
    // console.log("Embedding called")
    const embedder = await pipeline(
        'feature-extraction', 
        'Xenova/nomic-embed-text-v1');
    const results = await embedder(data, { pooling: 'mean', normalize: true });
    // console.log(results)
    return Array.from(results.data);
}
