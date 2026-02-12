import Database from 'better-sqlite3';

// Create an in-memory SQLite database
const db = new Database(':memory:');

// Register the ageday function
db.function('ageday', (iDate, gDate) => {
  // Convert input dates to 8-digit strings
  const sdate = String(iDate).padStart(8, '0');

  // If gDate is missing or NULL, use today's date
  const cdate = (gDate !== undefined && gDate !== null)
    ? String(gDate).padStart(8, '0')
    : new Date().toISOString().slice(0,10).replace(/-/g,'');

  // Extract year and month-day parts
  const sYear = parseInt(sdate.slice(0,4), 10);
  const sMD   = parseInt(sdate.slice(4), 10);
  const cYear = parseInt(cdate.slice(0,4), 10);
  const cMD   = parseInt(cdate.slice(4), 10);

  // Age calculation logic
  return cMD >= sMD ? cYear - sYear : cYear - sYear - 1;
});

// Example usage
console.log(db.prepare('SELECT ageday(19661223, NULL) AS age').get().age); 
// → age based on today’s date

console.log(db.prepare('SELECT ageday(19661223, 20250212) AS age').get().age); 
// → age based on explicit gDate

/*
A **User‑Defined Function (UDF)** in SQLite is a custom function that you register from your host language (like Node.js, Python, or C) so it can be called inside SQL queries. Unlike databases such as Oracle or PostgreSQL, SQLite doesn’t support `CREATE FUNCTION` directly in SQL. Instead, you extend SQLite by binding your own logic through the API.

### Example in Node.js (ES6 with better‑sqlite3)

```js
import Database from 'better-sqlite3';

// Create an in-memory database
const db = new Database(':memory:');

// Register a simple UDF
db.function('reverse', (str) => {
  if (typeof str !== 'string') return null;
  return [...str].reverse().join('');
});

// Use it in SQL
const { result } = db.prepare('SELECT reverse("Albatross") AS result').get();
console.log(result); // → ssortablA
```

### Another Example: Age Calculation
```js
db.function('ageday', (iDate, gDate) => {
  const sdate = String(iDate).padStart(8, '0');
  const cdate = gDate && gDate !== null
    ? String(gDate).padStart(8, '0')
    : new Date().toISOString().slice(0,10).replace(/-/g,'');

  const sYear = parseInt(sdate.slice(0,4), 10);
  const sMD   = parseInt(sdate.slice(4), 10);
  const cYear = parseInt(cdate.slice(0,4), 10);
  const cMD   = parseInt(cdate.slice(4), 10);

  return cMD >= sMD ? cYear - sYear : cYear - sYear - 1;
});

console.log(db.prepare('SELECT ageday(19900101, NULL) AS age').get().age);
```

### Key Takeaways
- UDFs let you embed custom logic into SQL queries.  
- They are registered in your host language, not created in SQL.  
- Once registered, they behave like built‑in functions (`SUM`, `SUBSTR`, etc.).  

This makes SQLite highly flexible, allowing you to combine SQL’s power with your own domain‑specific logic.  

I can also show you how to build **aggregate UDFs** (like a custom `GROUP_CONCAT` or `AVG`) if you’d like to see how to extend SQLite even further.

*/