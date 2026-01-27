import { db } from './utils/sqlite.js'

console.log(db.exec(`
    DROP TABLE IF EXISTS images;
    CREATE TABLE images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fileName VARCHAR(255) NOT NULL,
        title TEXT NOT NULL DEFAULT '', 
        fullPath VARCHAR(255) NOT NULL,
        fileFormat VARCHAR(16) NOT NULL,
        fileSize INTEGER NOT NULL,      
        hash CHAR(64) NOT NULL,
        indexedAt VARCHAR(24) NOT NULL,
        createdAt VARCHAR(24) NOT NULL,
        modifiedAt VARCHAR(24) NOT NULL,
        updateIdent INTEGER NOT NULL DEFAULT 0,
        UNIQUE(fullPath)
    );`))

console.log(db.exec(`
    DROP TABLE IF EXISTS images_vec;
    CREATE VIRTUAL TABLE images_vec USING vec0 (
        embedding float[768]
    );`))

console.log(db.exec('vacuum;'))
db.close()

console.log('All Done Bye Bye')
