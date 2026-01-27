// routes/api.js
import express from 'express';
import { db } from '../sqlite.js'
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

const stmtImages = db.prepare('SELECT * FROM images WHERE id = ?');
const stmtImagesFullPath = db.prepare('SELECT fullPath FROM images WHERE id = ?');
const stmtImagesVec = db.prepare('SELECT * FROM images_vec WHERE rowid = ?');

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

// POST /api/v1/search
router.post('/search', express.json(), (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Missing query' });
    }

    // Example: naive search by filename or hash
    const stmt = db.prepare(`
      SELECT * FROM images
      WHERE fileName LIKE ? OR hash LIKE ?
    `);
    const rows = stmt.all(`%${query}%`, `%${query}%`);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;