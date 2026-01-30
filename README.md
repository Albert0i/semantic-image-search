### Semantic Image Search
> "Every struggle, no matter what its goal, is forced by life to make
adjustments; it becomes a different struggle, serves different ends,
and sometimes accomplishes the very opposite of what it set out to
do. *Only slight goals are worth pursuing, because only a slight goal
can be entirely fulfilled.* "<br /><br />"Todo esforço, qualquer que seja o fim para que tenda, sofre, ao manifestar-se, os desvios que a vida lhe impõe; torna-se outro esforço, serve outros fins, consuma por vezes o mesmo contrário do que pretendera realizar. *Só um baixo fim vale a pena, porque só um baixo fim se pode inteiramente efetuar.*"<br/>--- The Book of Disquiet by Fernando Pessoa


#### Prologue
In the year of 2026, when "[AI slop](https://techcrunch.com/2026/01/05/microsofts-nadella-wants-us-to-stop-thinking-of-ai-as-slop/)" and "[Microslop](https://cybernews.com/ai-news/microsoft-ai-microslop-copilot/?utm_source=cn_facebook&utm_medium=social&utm_campaign=cybernews&utm_content=post&source=cn_facebook&medium=social&campaign=cybernews&content=post)" become internet buzzwords, all these impose introspection to what AI can do for human being. While most AI concept *stagnate* on fancy stage, the technique that prevails is *AI features* like  **semantic search**. 


#### I. Simplicity over functionality
The key to [semantic search](https://en.wikipedia.org/wiki/Semantic_search) is generation of vector embedding and calculation of vector distance. While most people can't afford to buy [NVIDIA](https://www.nvidia.com/zh-tw/) card but can still try semantic search. Tools are deliberately chosen in an effort to deliver decent performance even though running on moderate to low-end notebook comp;uters. 

- [SQLite](https://sqlite.org/): zero-configuration database engine. 
- [@xenova/transformers](https://www.npmjs.com/package/@xenova/transformers): model are downloaded and cached automatically.


#### II. Project Setup
1. Clone the [repo](https://github.com/Albert0i/semantic-image-search.git): 
```
git clone https://github.com/Albert0i/semantic-image-search.git
```

2. Install packages: 
```
cd semantic-image-search

npm install 
```

3. create an `.env` file: 
```
MODEL_ID=Xenova/clip-vit-base-patch16
DB_PATH='./data/samples.db'
PORT=3000
MAX_RETURN=100
```

4. Create tables in SQLite: 
```
npm run create
```

5. Scan your image folder: 
```
npm run scan -- "C:\\MyPhotos"
```

6. Optionally, add *title* to all images: 
```
npm run cont 
```

7. Start the server: 
```
npm start 
```

8. Navigate to [http://localhost:3000/](http://localhost:3000/) and have fun... 


#### III. 


#### IV. 


#### V. Bibliography 
1. [SQLite Is ULTIMATE Choice For 99% of Projects](https://youtu.be/9RArbqGOvsw)
2. [This SQLite Fork is SO GOOD (and it’s open source)](https://youtu.be/CrIkUwo8FiY)
3. [SQLite](https://sqlite.org/)
4. [sqlite-vec](https://github.com/asg017/sqlite-vec)
5. [transformers.js](https://github.com/huggingface/transformers.js)
6. [Hugging Face](https://huggingface.co/)
7. [ServiceStack/images](https://github.com/ServiceStack/images)
8. [Setting up Express MVC + EJS + TailwindCSS (4.0)](https://medium.com/@hannnirin/setting-up-express-mvc-ejs-tailwindcss-4-0-2ccac72dad59)
9. [The Book of Disquiet by Fernando Pessoa](https://dn720004.ca.archive.org/0/items/english-collections-1/Book%20of%20Disquiet%2C%20The%20-%20Fernando%20Pessoa.pdf)


#### Epilogue 

ALL tools invented should help and facilitate human life; not monitor and spy on human. 

```
./node_modules/@xenova.transformers/.cache/Xenova
```


### EOF (2026/01/31)