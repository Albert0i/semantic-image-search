// api.js
import express from 'express';
import { db } from '../utils/sqlite.js'
import { getTextEmbeds } from '../utils/embedder.js'
import { normalizeVector } from '../utils/utils.js'
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const router = express.Router();

const supportedFormats = ['jpg', 'jpeg', 'png', 'bmp', 'gif', 'tiff'];
const mimeTypes = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  bmp: 'image/bmp',
  gif: 'image/gif',
  tiff: 'image/tiff'
};

// Prepare all SQL statements 
const stmtImages = db.prepare(`
                          SELECT f1.*, vec_length(f2.embedding) as vec_length 
                          FROM images f1, images_vec f2 
                          WHERE f1.id = f2.rowid AND id = ?`
                        );
const stmtImagesFullPath = db.prepare('SELECT fullPath FROM images WHERE id = ?');
const stmtImagesVec = db.prepare('SELECT * FROM images_vec WHERE rowid = ?');
const stmtImagesQuery = db.prepare(`
                          SELECT rowid, distance
                          FROM images_vec
                          WHERE embedding MATCH ?
                          ORDER BY distance ASC
                          LIMIT ?;
      `)

// GET /info/:id
router.get('/info/:id', (req, res) => {
  try {
    //const stmt = db.prepare('SELECT * FROM images WHERE id = ?');
    const row = stmtImages.get(req.params.id);
    if (!row) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /embed/:id
router.get('/embed/:id', (req, res) => {
  try {
    //const stmt = db.prepare('SELECT * FROM images_vec WHERE rowid = ?');
    const row = stmtImagesVec.get(req.params.id);
    if (!row) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /image/:id → full size
router.get('/image/:id', (req, res) => {
    try {
      //const stmt = db.prepare('SELECT fullPath FROM images WHERE id = ?');
      const row = stmtImagesFullPath.get(req.params.id);
  
      if (!row) return res.status(404).json({ error: 'Image record not found' });
  
      const filePath = row.fullPath;
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Image file not found on disk' });
      }
  
      const ext = path.extname(filePath).toLowerCase().replace('.', '');
      if (!supportedFormats.includes(ext)) {
        return res.status(415).json({ error: `Unsupported file format: ${ext}` });
      }
  
      res.setHeader('Content-Type', mimeTypes[ext]);
      fs.createReadStream(filePath).pipe(res);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  // GET /preview/:id → scaled down
  router.get('/preview/:id', async (req, res) => {
    try {
      //const stmt = db.prepare('SELECT fullPath FROM images WHERE id = ?');
      const row = stmtImagesFullPath.get(req.params.id);
  
      if (!row) return res.status(404).json({ error: 'Image record not found' });
  
      const filePath = row.fullPath;
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Image file not found on disk' });
      }
  
      const ext = path.extname(filePath).toLowerCase().replace('.', '');
      if (!supportedFormats.includes(ext)) {
        return res.status(415).json({ error: `Unsupported file format: ${ext}` });
      }
  
      // Allow dynamic width/height via query string, default width=800
      const width = parseInt(req.query.width) || 512;
      const height = req.query.height ? parseInt(req.query.height) : null;
  
      res.setHeader('Content-Type', mimeTypes[ext]);
      sharp(filePath)
        .resize({ width, height })
        .pipe(res);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });  

// POST /search
router.post('/search', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Missing query' });
    }
    
    const text_embeds = await getTextEmbeds(query)
    const query_embedding = normalizeVector(text_embeds.tolist()[0]);
    
    const rows = stmtImagesQuery.all(new Uint8Array(new Float32Array(query_embedding).buffer), 10)

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /info
router.get('/info', (req, res) => {
  try {
    // 1. Total images
    const totalImages = db.prepare('SELECT COUNT(*) AS count FROM images').get();

    // 2. Count by fileFormat
    const formatRows = db.prepare(`
      SELECT fileFormat, COUNT(*) AS count
      FROM images
      GROUP BY fileFormat
      ORDER BY count DESC
    `).all();

    const formats = {};
    for (const row of formatRows) {
      formats[row.fileFormat] = row.count;
    }

    // 3. Untitled (title='' and hash='')
    const untitled = db.prepare(`
      SELECT COUNT(*) AS count
      FROM images
      WHERE title = '' AND hash = ''
    `).get();

    // 4. Last indexed date and max update count
    const lastRow = db.prepare(`
      SELECT MAX(indexedAt) AS lastIndexed,
             MAX(updateIdent) AS maxUpdateIdent
      FROM images
    `).get();

    // 5. Count from images_vec
    const vecCount = db.prepare('SELECT COUNT(*) AS count FROM images_vec').get();

    // 6. Vector length (first embedding)
    const vecLenRow = db.prepare(`
      SELECT vec_length(embedding) AS length
      FROM images_vec
      LIMIT 1
    `).get();

    // 7. SQLite + SQLite-vec versions
    const versions = db.prepare(`
      SELECT sqlite_version() AS sqlite_version,
             vec_version() AS vec_version
    `).get();

    // Return JSON in requested shape
    res.json({
      images: totalImages.count,
      formats,
      untitled_images: untitled.count,
      last_indexed: lastRow.lastIndexed,
      max_updated: lastRow.maxUpdateIdent,

      images_vec: vecCount.count,
      vec_length: vecLenRow ? vecLenRow.length : null,

      versions: {
        sqlite: versions.sqlite_version,
        sqlite_vec: versions.vec_version
      },
      
    });
  } catch (err) {
    console.error('[ERROR] /api/v1/api/info failed:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
/*
{
  "images": 3813,
  "formats": {
    "png": 3222,
    "jpg": 588,
    "jpeg": 2,
    "gif": 1
  },
  "untitled_images": 3763,
  "last_indexed": "2026-01-29T07:09:51.702Z",
  "max_updated": 1,
  "images_vec": 3813,
  "vec_length": 512,
  "versions": {
    "sqlite": "3.51.1",
    "sqlite_vec": "v0.1.7-alpha.2"
  }
}
*/

export default router;
/*
curl -X POST http://localhost:3000/api/v1/search -H "Content-Type: application/json" -d "{\"query\":\"cat\"}" | jq 
*/