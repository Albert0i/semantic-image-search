**Direct Answer:**  
In SQLite, **window functions** are SQL functions that perform calculations across a set of rows related to the current row, defined by an `OVER` clause. Unlike aggregate functions, they don’t collapse rows into one result — they preserve row identity while adding analytic values such as ranks, running totals, or moving averages.  

---

## 🔍 What Are Window Functions?
- A **window function** operates over a “window” of rows in the result set.  
- The **`OVER` clause** defines the window: it can include **PARTITION BY** (grouping rows), **ORDER BY** (sorting within partitions), and **frame clauses** (defining subsets like “rows between current and preceding”).  
- They are also called **analytic functions** because they allow advanced analysis without restructuring the dataset.

---

## ⚡ Difference from Aggregate Functions
| Feature | Aggregate Function | Window Function |
|---------|-------------------|-----------------|
| Result | Collapses rows into one | Preserves all rows |
| Example | `SUM(amount)` → one value per group | `SUM(amount) OVER (...)` → running total per row |
| Use Case | Group totals | Rankings, moving averages, cumulative sums |

---

## 🛠 Categories of Window Functions in SQLite
1. **Ranking Functions**  
   - `ROW_NUMBER()` → sequential numbering of rows.  
   - `RANK()` → assigns rank with gaps for ties.  
   - `DENSE_RANK()` → assigns rank without gaps.  
   - `NTILE(n)` → divides rows into n buckets.

2. **Aggregate Window Functions**  
   - `SUM()`, `AVG()`, `MIN()`, `MAX()`, `COUNT()` used with `OVER`.  
   - Example: running totals, moving averages.

3. **Value Functions**  
   - `LEAD(expr, offset)` → value from a following row.  
   - `LAG(expr, offset)` → value from a preceding row.  
   - `FIRST_VALUE(expr)` → first value in the window.  
   - `LAST_VALUE(expr)` → last value in the window.  

4. **Distribution Functions**  
   - `CUME_DIST()` → cumulative distribution.  
   - `PERCENT_RANK()` → relative rank as a fraction.  

---

## 📖 Examples

### Ranking Customers by Spending
```sql
SELECT name, SUM(amount) AS total,
       RANK() OVER (ORDER BY SUM(amount) DESC) AS rank
FROM orders
GROUP BY name;
```
- Preserves each customer row but adds a rank column.

### Running Total of Sales
```sql
SELECT order_date, amount,
       SUM(amount) OVER (ORDER BY order_date) AS running_total
FROM orders;
```
- Shows cumulative sales over time.

### Comparing Current vs Previous Order
```sql
SELECT id, amount,
       LAG(amount, 1) OVER (ORDER BY id) AS prev_amount
FROM orders;
```
- Adds a column showing the previous order’s amount.

---

## ⚠️ Limitations
- **Performance**: Window functions can be heavy on large datasets. Indexing helps.  
- **SQLite Version**: Supported from SQLite 3.25.0 (2018) onward. Older versions don’t have them.  
- **No cross‑database frames**: They only operate within the current query context.

---

## ✨ Why They Matter
- Enable **advanced analytics** directly in SQL without extra queries.  
- Simplify problems like rankings, cumulative totals, and comparisons.  
- Make SQLite viable for lightweight BI and reporting tasks.

---
