import { pipeline } from '@xenova/transformers';

const captioner = await pipeline('image-to-text', 'Xenova/vit-gpt2-image-captioning');

/*
   Embedding from image. 
*/
export async function getImageCaption(image_url) { 
    const output = await captioner(image_url);

   return output
}

/*
output = [
  { generated_text: 'a cat laying on a couch with a cat laying on it' }
]
*/
