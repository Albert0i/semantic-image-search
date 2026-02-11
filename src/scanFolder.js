/*
   scanFolder.js 
*/
import fs from 'fs';
import path from 'path';
import { db } from './utils/sqlite.js';
import { normalizeVector } from './utils/utils.js';
import { getImageEmbeds } from './utils/embedder.js';

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
async function scanDirectory(dir) {
  folderCount++;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      await scanDirectory(fullPath);
    } else if (IMG_EXTENSIONS.test(entry.name)) {
      imageCount++;
      await insertDatabase(fullPath);
    }
  }
}

// Prepare insert statements
const insertImage = db.prepare(`
  INSERT INTO images (fileName, fullPath, fileFormat, fileSize, hash,
                      indexedAt, createdAt, modifiedAt, updateIdent)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(fullPath) DO UPDATE SET
          indexedAt = excluded.indexedAt,
          updateIdent = updateIdent + 1
        RETURNING rowid, updateIdent;
`);
const checkImageVector = db.prepare(`SELECT rowid FROM images_vec WHERE rowid = ?;`);
const insertImageVector = db.prepare(`
    INSERT INTO images_vec(rowid, embedding) VALUES (?, ?);
`);

/**
 * Insert image data to database
 */
async function insertDatabase(filePath) {
  const stat = fs.statSync(filePath);
  const now = new Date(Date.now() + 8 * 60 * 60 * 1000);
  const fileName = path.basename(filePath);
  const fileFormat = path.extname(filePath).slice(1).toLowerCase();
  const fileSize = stat.size;
  const indexedAt = now.toISOString();
  const createdAt = stat.birthtime.toISOString();
  const modifiedAt = stat.mtime.toISOString();

  const hash = ''; // Delay hash generation!

  const { id, updateIdent } = insertImage.get(
    fileName, filePath, fileFormat, fileSize, hash,
    indexedAt, createdAt, modifiedAt, 0
  );

  const row = checkImageVector.get(id);

  if (typeof row === "undefined") {
    try {
      const embedding = await getImageEmbeds(filePath);

      insertImageVector.run(
        BigInt(id),
        new Uint8Array(new Float32Array(normalizeVector(embedding.data)).buffer)
      );

      console.log(`✅ Processed: ${filePath}`);
    } catch (error) {
      console.error(`❌ Error processing ${filePath}:`, error);
    }
  } else {
    console.log(`⏭️ Skipping: ${filePath}`);
  }
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
  await scanDirectory(targetFolder);

  console.log(`✅ Scan complete: ${imageCount} images found in ${folderCount} folders`);
}

main();

/*
   node src/scanFolder.js 

   node src/scanFolder.js "./img"

   npm run scan -- "./img"
   npm run scan -- "D:\\RU2026\\semantic-image-search\\img"
   npm run scan -- "D:\\Tmp"
   npm run scan -- "H:\\Tmp"
*/