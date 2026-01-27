import { getTextEmbeds, getImageEmbeds } from './utils/embedder.js'
import { getImageCaption } from './utils/captioner.js'

/*
   Embedding from text. 
*/
const text = "It's the economy, stupid"
const text_embeds = await getTextEmbeds(text)

console.log('text_embeds =', text_embeds)

/*
   Embedding from image. 
*/
const image_url = "./img/cat.jpg"
const image_embeds = await getImageEmbeds(image_url)

console.log('image_embeds =', image_embeds)

const image_caption = await getImageCaption(image_url)
console.log('image_caption =', image_caption)

/*
   huggingface/transformers.js
   examples/semantic-image-search
   https://github.com/huggingface/transformers.js/tree/main/examples/semantic-image-search
*/