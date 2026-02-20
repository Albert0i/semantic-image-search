// upload.js
import 'dotenv/config';
import { Router } from 'express';
import path from 'path';
import { promises as fs } from 'fs';
import multer from 'multer';
import iconv from 'iconv-lite';

const router = Router();

const MAX_IMAGES_UPLOAD = process.env.MAX_IMAGES_UPLOAD || 10

// Multer config
const storage = multer.diskStorage({
    destination: async (_, __, cb) => {
      const today = new Date();
      const yyyyMMdd = today.toISOString().slice(0, 10); // e.g., "2025-10-07"
      // The upload folder
      const uploadDir = path.resolve('./upload', yyyyMMdd);
  
      // Ensure the folder exists *before* Multer uses it
      try {
        await fs.access(uploadDir);
      } catch {
        await fs.mkdir(uploadDir, { recursive: true });
      }
  
      cb(null, uploadDir);
    },
    filename: (_, file, cb) => {
      // Preserve original image name and handle Chinese
      const raw = Buffer.from(file.originalname, 'binary');
      const decoded = iconv.decode(raw, 'utf8');
      cb(null, decoded);
    }
  });
  
  // Multer middleware configured with custom diskStorage.
  // Handles multipart/form-data uploads, saves files to date-based folders,
  // and decodes original filenames (including symbolic or Chinese glyphs).
  //const upload = multer({ storage });
  const upload = multer({
    storage,
    limits: {
      fileSize: 10 * 1024 * 1024,  // 10 MB per file!!!
      files: MAX_IMAGES_UPLOAD     // Max files per request
    }
  });
  
  // GET /upload — render upload page
  router.get('/', async (req, res) => {  
    res.render('upload', { message: "", max: MAX_IMAGES_UPLOAD });
  });
  
  // POST /upload — handle image uploads
  router.post('/', upload.array('images', MAX_IMAGES_UPLOAD), async (req, res) => { 
    // Access uploaded files via req.files which contain decoded filenames and paths
    const imgs = req.files.map(f => f.filename)
    const count = imgs.length;
  
    const listed = imgs.map(name => `'${name}'`);
    const last = listed.pop();
    const joined = listed.length ? listed.join(', ') + ' and ' + last : last;
  
    const message = `${count} image${ count > 1? "s": "" } uploaded and ${ count > 1? "they are": "it is" } ${joined}.`;
    console.log(message)
  
    // Wait for 5 seconds... 
    //await new Promise(r => setTimeout(r, 5000));
    res.render('upload', { message, max: MAX_IMAGES_UPLOAD } );
  }); 

export default router;