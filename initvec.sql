PRAGMA integrity_check;

.load ./vec0

-- 1. Total images
SELECT 'images: '||COUNT(*) AS count FROM images;

-- 2. Count by fileFormat
SELECT 'formats: '||fileFormat, COUNT(*) AS count
FROM images
GROUP BY fileFormat
ORDER BY count DESC; 

-- 3. Untitled (title='' and hash='')
SELECT 'untitled_images: '||COUNT(*) AS count
FROM images
WHERE title = '' AND hash = ''; 

-- 4. Last indexed date and max update count
SELECT 'last_indexed: '||MAX(indexedAt) AS lastIndexed
FROM images;

SELECT 'max_updated: '||MAX(updateIdent) AS maxUpdateIdent
FROM images;

-- 5. Count from images_vec
SELECT 'images_vec: '||COUNT(*) AS count FROM images_vec; 

-- 6. Vector length (first embedding)
SELECT 'vec_length: '||vec_length(embedding) AS length
FROM images_vec
LIMIT 1; 

-- 8. Database size 
SELECT 'database_size: '||ROUND((page_count * page_size) / (1024.0 * 1024.0), 2)||'MB' AS size_mb
FROM pragma_page_count(), pragma_page_size();

-- 
SELECT ''; 