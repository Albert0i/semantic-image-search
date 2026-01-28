
import 'dotenv/config'
import { pipeline } from '@xenova/transformers';

const captioner = await pipeline(
   'image-to-text', 
   'Xenova/vit-gpt2-image-captioning'
   );
 
/*
   Caption from image. 
*/
export async function getImageCaption(image_url) { 
    const output = await captioner(image_url);

   return output
}

/*
pipelines.ImageToTextPipeline
https://huggingface.co/docs/transformers.js/main/en/api/pipelines#pipelinesimagetotextpipeline

Image To Text pipeline using a AutoModelForVision2Seq. This pipeline predicts a caption for a given image.

Example: Generate a caption for an image w/ Xenova/vit-gpt2-image-captioning.

Copied
const captioner = await pipeline('image-to-text', 'Xenova/vit-gpt2-image-captioning');
const url = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/cats.jpg';
const output = await captioner(url);
// [{ generated_text: 'a cat laying on a couch with another cat' }]

output = [
  { generated_text: 'a cat laying on a couch with a cat laying on it' }
]
*/
