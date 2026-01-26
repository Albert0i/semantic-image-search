
import { createHash } from 'crypto';
import { readFileSync } from 'fs';

export function sha256FileSync(path) {
  const fileBuffer = readFileSync(path);   // read file into memory
  const hash = createHash('sha256');       // create SHA-256 hash object
  hash.update(fileBuffer);                 // feed file data
  return hash.digest('hex');               // return hex string
}


// All used SQLs
export const SQL_create_table = `
    DROP TABLE IF EXISTS images;
    CREATE TABLE images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fileName VARCHAR(255) NOT NULL,
      fullPath VARCHAR(255) NOT NULL,
      fileFormat VARCHAR(16) NOT NULL,
      fileSize INTEGER NOT NULL,      
      hash CHAR(64) NOT NULL,
      embedding float[768] NOT NULL, 
      indexedAt VARCHAR(24) NOT NULL,
      createdAt VARCHAR(24) NOT NULL,
      modifiedAt VARCHAR(24) NOT NULL,
      updateIdent INTEGER NOT NULL DEFAULT 0,
      UNIQUE(fullPath)
    );

    DROP TABLE IF EXISTS audit;
    CREATE TABLE audit (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      auditKey   VARCHAR(128) NOT NULL,
      auditValue VARCHAR(128) NOT NULL,
      updateIdent INTEGER NOT NULL DEFAULT 0,
      UNIQUE(auditKey)
    );
    VACUUM;
  `;

export const SQL_insert = `
    INSERT INTO files (fileName, fullPath, fileFormat, fileSize, isTextFile, 
                       content, hash, indexedAt, createdAt, modifiedAt)
    VALUES (?, ?, ?, ?, ?, 
            ?, ?, ?, ?, ?)
  `;

export const SQL_update = `
    UPDATE files SET updateIdent = updateIdent + 1 WHERE fullPath = ?
  `;

export const SQL_create_table_fs = `
    DROP TABLE IF EXISTS files_fts;
    CREATE VIRTUAL TABLE files_fts USING fts5(
      content,
      content='files',
      content_rowid='id'
    );

    INSERT INTO files_fts(rowid, content)
    SELECT id, content FROM files WHERE isTextFile = 1;

    CREATE TRIGGER files_ai AFTER INSERT ON files
    WHEN new.isTextFile = 1
    BEGIN
      INSERT INTO files_fts(rowid, content) VALUES (new.id, new.content);
    END;

    CREATE TRIGGER files_au AFTER UPDATE ON files
    WHEN new.isTextFile = 1
    BEGIN
      UPDATE files_fts SET content = new.content WHERE rowid = new.id;
    END;

    CREATE TRIGGER files_ad AFTER DELETE ON files
    BEGIN
      DELETE FROM files_fts WHERE rowid = old.id;
    END;
`

// export function writeAudit(db, key, value, flush = true) {
//   const sql = `
//     INSERT INTO audit (auditKey, auditValue)
//     VALUES (?, ?)
//   `;

//   try {
//     db.prepare(sql).run(key, value);
//     console.log(`✅ Audit added: ${key} → ${value}`);

//     if (flush) {
//       db.exec('PRAGMA wal_checkpoint(FULL)');
//       console.log('🧾 WAL checkpoint triggered — data flushed to disk.');
//     }
//   } catch (err) {
//     console.error('❌ Failed to write audit entry:', err);
//   }
// }

// export function removeDuplicates(input) {
//   return [...new Set(
//     input
//       .split(',')
//       .map(s => s.trim())
//       .filter(Boolean)
//   )].join(', ');
// }
