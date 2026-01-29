/*
   scanFolderCont.js 
*/
import { db } from './utils/sqlite.js'
import { getImageCaption } from './utils/captioner.js'
import { sha256FileSync } from './utils/utils.js'

async function main() {
  console.log('🧭 Starting updating database...');

  // Select all image records
  const rows = db.prepare('SELECT id, title, fullPath, hash FROM images;').all();

  const updateStmt = db.prepare(`
    UPDATE images SET title = ?, hash = ?, indexedAt=?, updateIdent=updateIdent + 1 WHERE id = ?;
  `);

  for (const row of rows) {
    try {
      const filePath = row.fullPath;
      const now = new Date();

      if (row.title === '' && row.hash === '') {
        getImageCaption(filePath).then(output => { 
          //console.log('generated_text = ', output[0].generated_text) 
          const hash = sha256FileSync(filePath);
  
          updateStmt.run(output[0].generated_text, hash, now.toISOString(), row.id)
          
          console.log(`✅ Updated: ${filePath}`);
        }).catch(error => {
          console.log(error)
        })
      } else {
        console.log(`⏭️ Skipping: ${filePath}`);
      }
    } catch (error) {
      console.error(`❌ Error processing ${row.fullPath}:`, error);
    }
  }
}

/*
   main
*/
await main();

// /*
//    node src/scanFolder.js 

//    node src/scanFolder.js "./img"

//    npm run scan -- "./img"
//    npm run scan -- "D:\\RU2026\\semantic-image-search\\img"
//    npm run scan -- "D:\\Tmp"
// */