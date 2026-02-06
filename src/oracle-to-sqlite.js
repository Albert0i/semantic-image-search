// oracle-to-sqlite.js
import fs from 'fs/promises';
import path from 'path';

// --- Utility ---
async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

// --- Core Transformer (version two: multi-line INSERT fix)
function transformSql(sql, fileName) {
  // Derive prefixed table name from filename: PH201212.BMBDG.sql.txt → PH201212_BMBDG
  const baseName = path.basename(fileName, path.extname(fileName));
  const tableName = baseName.replace(/\./g, '_');

  // -- Split after ; OR before -- Data
  const statements = sql.split(/(?<=;)|(?<=-- Data)/)   
    
  const output = [];
  let insertBuffer = ""; // buffer for multi-line INSERT

  function checkAndOutputInsertBuffer() {
    // If we are currently buffering an INSERT
    if (insertBuffer.length != 0) {
      output.push(insertBuffer)
      insertBuffer = ""
    }
  }

  for (let stmt of statements) {
    stmt = stmt.trim();
    if (!stmt) continue;

    // 1) Discard ALTER SESSION
    if (/^\s*ALTER\s+SESSION\b/i.test(stmt)) continue;
    
    // 3) Discard COMMENT 
    if (/^\s*--/.test(stmt)) continue
    if (/^COMMENT\s\b/i.test(stmt)) continue;

    // 2) CREATE TABLE
    if (/^CREATE\s+TABLE\b/i.test(stmt)) {
      // Replace table name (first token after CREATE TABLE)
      stmt = stmt.replace(/^(CREATE\s+TABLE\s+)(\S+)/i, (_, pfx) => `${pfx}${tableName.replace('_sql', '')}`);
      stmt = mapDataTypes(stmt);
      output.push(stmt);

      continue;
    }

    // 4) INSERT
    if (/^INSERT\s+INTO\b/i.test(stmt)) {
      checkAndOutputInsertBuffer()

      // Replace only the table name token after INSERT INTO
      stmt = stmt.replace(/^(INSERT\s+INTO\s+)(\S+)/i, (_, __, tbl) => `INSERT INTO ${tableName.replace('_sql', '')}`);

      // Starting buffering...?
      insertBuffer = cleanAllControlChars(stmt);

      continue;
    }
      
    // Other things encountered... Continue buffering...
    stmt = cleanAllControlChars(stmt);
    insertBuffer += stmt
  }
  checkAndOutputInsertBuffer()

  return output.join('\n') + '\n';
}

// --- Helpers ---
function mapDataTypes(stmt) {
  let out = stmt;

  // VARCHAR2 / NVARCHAR2 / CHAR
  out = out.replace(/\bVARCHAR2\s*\(\s*(\d+)\s*CHAR\s*\)(?=[,\s)])/gi, (m, n) => `VARCHAR(${n})`);
  out = out.replace(/\bVARCHAR2\s*\(\s*(\d+)\s*BYTE\s*\)(?=[,\s)])/gi, (m, n) => `VARCHAR(${n})`);
  out = out.replace(/\bVARCHAR2\s*\(\s*(\d+)\s*\)(?=[,\s)])/gi, (m, n) => `VARCHAR(${n})`);
  out = out.replace(/\bNVARCHAR2\s*\(\s*(\d+)\s*(CHAR|BYTE)?\s*\)(?=[,\s)])/gi, (m, n) => `VARCHAR(${n})`);
  out = out.replace(/\bCHAR\s*\(\s*(\d+)\s*(CHAR|BYTE)?\s*\)(?=[,\s)])/gi, (m, n) => `CHAR(${n})`);

  // NUMBER / DECIMAL
  out = out.replace(/\bNUMBER\s*\(\s*(\d+)\s*,\s*0\s*\)(?=[,\s)])/gi, 'INTEGER');
  out = out.replace(/\bDECIMAL\s*\(\s*(\d+)\s*,\s*0\s*\)(?=[,\s)])/gi, 'INTEGER');
  out = out.replace(/\bNUMBER\s*\(\s*\d+\s*,\s*\d+\s*\)(?=[,\s)])/gi, 'REAL');
  out = out.replace(/\bDECIMAL\s*\(\s*\d+\s*,\s*\d+\s*\)(?=[,\s)])/gi, 'REAL');
  out = out.replace(/\bNUMBER\s*\(\s*\d+\s*\)(?=[,\s)])/gi, 'INTEGER');
  out = out.replace(/\bDECIMAL\s*\(\s*\d+\s*\)(?=[,\s)])/gi, 'INTEGER');
  out = out.replace(/\bNUMBER\b(?=[,\s)])/gi, 'REAL');

  // DATE / TIMESTAMP
  out = out.replace(/\bDATE\b(?=[,\s)])/gi, 'TEXT');
  out = out.replace(/\bTIMESTAMP(?:\s*\(\s*\d+\s*\))?\b(?=[,\s)])/gi, 'TEXT');

  // CLOB / RAW
  out = out.replace(/\bCLOB\b(?=[,\s)])/gi, 'TEXT');
  out = out.replace(/\bRAW\s*\(\s*\d+\s*\)(?=[,\s)])/gi, 'BLOB');

  return out;
}

// Clean only control characters
function cleanAllControlChars(stmt) {
  // Strip ASCII control characters (0x00–0x1F and 0x7F) everywhere
  return stmt.replace(/[\x00-\x1F\x7F]/g, '');
}

// --- Folder Walker ---
async function processFolder(inputDir, outputDir) {
  await ensureDir(outputDir);
  const entries = await fs.readdir(inputDir, { withFileTypes: true });

  for (const entry of entries) {
    const inPath = path.join(inputDir, entry.name);
    const outPath = path.join(outputDir, entry.name);

    if (entry.isDirectory()) {
      await processFolder(inPath, outPath);
    } else if (
      entry.isFile() &&
      (entry.name.toLowerCase().endsWith('.sql') || entry.name.toLowerCase().endsWith('.txt'))
    ) {
      const raw = await fs.readFile(inPath, 'utf8');
      const finalSql = transformSql(raw, entry.name);

      await ensureDir(path.dirname(outPath));
      const baseName = path.basename(outPath, path.extname(outPath));
      
      const outFile = path.join(path.dirname(outPath), baseName);

      await fs.writeFile(outFile, finalSql, 'utf8');
      console.log(`✓ Converted ${inPath} → ${outFile}`);
    }
  }
}

// --- Main ---
const [,, inputDir, outputDir] = process.argv;

if (!inputDir || !outputDir) {
  console.log('Usage: node src/oracle-to-sqlite.js <input_folder> <output_folder>');
  console.log('Example: node src/oracle-to-sqlite.js "C:\\MYLIB\\2025" "C:\\MYLIB.SQLITE\\2025"');
  process.exit(1);
}

processFolder(inputDir, outputDir).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});

/*
   node src/oracle-to-sqlite.js "H:\\PHLIB\\2012" "H:\\PHLIB.SQLITE\\2012"

   loaddb.bat H:\PHLIB.db H:\PHLIB.SQLITE\2012
*/