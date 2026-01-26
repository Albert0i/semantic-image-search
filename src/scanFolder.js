/*
   scanFolder.js 
*/
import fs from 'fs';
import path from 'path';
import { db } from './sqlite.js'
import { sha256FileSync } from './utils.js'
import { getImageEmbeds } from './embedder.js'

const IMG_EXTENSIONS = /\.(jpg|jpeg|png|bmp|gif|tiff)$/i;
const DEFAULT_FOLDER = path.resolve('./samples');
const DATA_FOLDER = path.resolve('./data');

const userArgs = process.argv.slice(2);
const rawPath = userArgs[0];
const targetFolder = rawPath ? path.resolve(rawPath) : DEFAULT_FOLDER;

let folderCount = 0;
let imageCount = 0;

/**
 * Recursively walks through folders and buffers image paths
 */
function scanDirectory(dir) {
  folderCount++;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      scanDirectory(fullPath);
    } else if (IMG_EXTENSIONS.test(entry.name)) {
      imageCount++; 
      insertDatabase(fullPath)
    }
  }
}

// Prepare insert statement 
const insertImage = db.prepare(`
  INSERT INTO images (fileName, fullPath, fileFormat, fileSize, hash, 
                      indexedAt, createdAt, modifiedAt, updateIdent)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         `);
const insertImageVector = db.prepare(`
    INSERT INTO images_vec(rowid, embedding) VALUES (?, ?)
  `);

/**
 * Insert image data to database
 */
function insertDatabase(filePath) {
    const stat = fs.statSync(filePath);
    const now = new Date();

    const fileName = path.basename(filePath);
    const fileFormat = path.extname(filePath).slice(1).toLowerCase();
    const fileSize = stat.size;
    const indexedAt = now.toISOString();
    const createdAt = stat.birthtime.toISOString();
    const modifiedAt = stat.mtime.toISOString();
    const hash = sha256FileSync(filePath)
        
    const result = insertImage.run(fileName, filePath, fileFormat, fileSize, hash, 
                                   indexedAt, createdAt, modifiedAt, 0)
    const id = result.lastInsertRowid
    
    getImageEmbeds(filePath).then(embedding => {
          //console.log('embedding = ', embedding.data)
          process.stdout.write('.');
          insertImageVector.run(BigInt(id), new Uint8Array(new Float32Array(embedding.data).buffer));
        }).catch(error => {
          console.log(error)
        })
}

/**
 * Main entry point
 */
async function main() {
  if (!fs.existsSync(targetFolder)) {
    console.error(`[ERROR] Folder not found: ${targetFolder}`);
    process.exit(1);
  }

  if (!fs.existsSync(DATA_FOLDER)) {
    fs.mkdirSync(DATA_FOLDER);
  }

  console.log(`🧭 Scanning folder: ${targetFolder}`);
  scanDirectory(targetFolder);
  
  console.log(`✅ Scan complete: ${imageCount} images found in ${folderCount} folders`);
}

/*
   main
*/
main();
