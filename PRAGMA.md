
# 📘 Tutorial: Using PRAGMA in SQLite

## 1. What is PRAGMA?
- **Definition:** A SQLite‑specific command to modify or query the environment.  
- **Scope:** Applies to the current connection/session.  
- **Persistence:** Some settings (like `journal_mode=WAL`) persist in the database file, but most reset when you reconnect.  
- **Syntax:**
  ```sql
  PRAGMA pragma_name;
  PRAGMA pragma_name = value;
  ```

---

## 2. Common PRAGMAs and Examples

| PRAGMA | Purpose | Example | Output |
|--------|---------|---------|--------|
| `synchronous` | Controls how carefully SQLite waits for disk writes | `PRAGMA synchronous=OFF;` | Faster inserts, less safe |
| `journal_mode` | Sets rollback journal behavior | `PRAGMA journal_mode=WAL;` | Returns `wal` |
| `temp_store` | Where temp tables/indices are stored | `PRAGMA temp_store=MEMORY;` | Returns `memory` |
| `cache_size` | Number of pages in memory cache | `PRAGMA cache_size=-200000;` | Returns `-200000` |
| `foreign_keys` | Enforces foreign key constraints | `PRAGMA foreign_keys=ON;` | Returns `1` |
| `table_info` | Schema details of a table | `PRAGMA table_info(users);` | Lists columns |

---

## 3. Performance Tuning Example
Suppose you’re importing a large SQL dump:

```sql
PRAGMA synchronous=OFF;
PRAGMA journal_mode=MEMORY;
PRAGMA temp_store=MEMORY;
PRAGMA cache_size=-200000;

BEGIN;
.read bigdump.sql
COMMIT;

PRAGMA synchronous=FULL;
PRAGMA journal_mode=DELETE;
```

- **Before import:** Switch to fast settings (`OFF`, `MEMORY`).  
- **During import:** Wrap inserts in a transaction for speed.  
- **After import:** Restore safe defaults (`FULL`, `DELETE`).  

---

## 4. Schema Inspection Example
You can query metadata about tables:

```sql
PRAGMA table_info(customers);
```

Output:
```
cid | name     | type    | notnull | dflt_value | pk
0   | id       | INTEGER | 1       | NULL       | 1
1   | name     | TEXT    | 0       | NULL       | 0
2   | email    | TEXT    | 0       | NULL       | 0
```

This is useful for debugging or dynamically generating queries.

---

## 5. Safety vs Speed Trade‑off
- **Safe defaults:**  
  - `PRAGMA synchronous=FULL;`  
  - `PRAGMA journal_mode=DELETE;`  
- **Fast import mode:**  
  - `PRAGMA synchronous=OFF;`  
  - `PRAGMA journal_mode=MEMORY;`  

Choose based on whether you prioritize durability or performance.

---

## 6. Key Takeaways
- **PRAGMAs are SQLite‑specific** and not portable to other databases.  
- **Always restore safe defaults** after bulk imports.  
- **Use PRAGMAs for introspection** (`table_info`, `foreign_keys`) as well as tuning.  

---

Sources: [SQLite official PRAGMA documentation](https://sqlite.org/pragma.html), [Tutorialspoint SQLite PRAGMA guide](https://www.tutorialspoint.com/sqlite/sqlite_pragma.htm)  

