
import 'dotenv/config'
import { AutoTokenizer, CLIPTextModelWithProjection } from "@xenova/transformers";
import { AutoProcessor, RawImage, CLIPVisionModelWithProjection } from '@xenova/transformers';

// Load processor and vision model
export const model_id = process.env.MODEL_ID

// Load tokenizer and text model
const tokenizer = await AutoTokenizer.from_pretrained(model_id);
const text_model = await CLIPTextModelWithProjection.from_pretrained(model_id);

// Load processor and vision model
const processor = await AutoProcessor.from_pretrained(model_id);
const vision_model = await CLIPVisionModelWithProjection.from_pretrained(model_id, {
    quantized: false,
});

/*
   Embedding from text. 
*/
export async function getTextEmbeds(text) {
   // Run tokenization
   const text_inputs = tokenizer(text, { padding: true, truncation: true });

   // Compute embeddings
   const { text_embeds } = await text_model(text_inputs);
   
   return text_embeds
}

/*
   Embedding from image. 
*/
export async function getImageEmbeds(image_url) { 
   // Read image
   const image = await RawImage.read(image_url);

   // Run processor
   const image_inputs = await processor(image);

   // Compute embeddings
   const { image_embeds } = await vision_model(image_inputs);

   return image_embeds
}

/*
   huggingface/transformers.js

   examples/semantic-image-search
   https://github.com/huggingface/transformers.js/tree/main/examples/semantic-image-search

   examples/semantic-image-search-client
   https://github.com/huggingface/transformers.js/tree/main/examples/semantic-image-search-client

   examples/tokenizer-playground
   https://github.com/huggingface/transformers.js/tree/main/examples/tokenizer-playground
*/