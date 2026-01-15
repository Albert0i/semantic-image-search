
# 📖 TanStack Query Tutorial

TanStack Query (`@tanstack/query-core`) is a **framework‑agnostic data‑fetching and caching library**. It transforms raw `fetch` calls into a robust data layer with caching, retries, deduplication, and lifecycle management.

---

## 1. Setup

Install the core package and `node-fetch`:

```bash
npm install @tanstack/query-core node-fetch
```

---

## 2. Basic Query

```js
import { QueryClient } from '@tanstack/query-core';
import fetch from 'node-fetch';

const queryClient = new QueryClient();

async function fetchUsers() {
  const res = await fetch('https://jsonplaceholder.typicode.com/users');
  if (!res.ok) throw new Error('Network error');
  return res.json();
}

queryClient.fetchQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
}).then(data => {
  console.log('Fetched users:', data);
});
```

👉 This fetches data and caches it under the key `['users']`.

---

## 3. Caching

```js
// First call hits the network
await queryClient.fetchQuery({ queryKey: ['users'], queryFn: fetchUsers });

// Second call reuses cached data instantly
const cached = queryClient.getQueryData(['users']);
console.log('Cached result:', cached);
```

---

## 4. Deduplication

```js
// Two simultaneous calls with the same key
const p1 = queryClient.fetchQuery({ queryKey: ['users'], queryFn: fetchUsers });
const p2 = queryClient.fetchQuery({ queryKey: ['users'], queryFn: fetchUsers });

const [d1, d2] = await Promise.all([p1, p2]);
console.log('Deduplicated results:', d1.length, d2.length);
```

👉 Only one network request is made; both promises resolve with the same cached data.

---

## 5. Retries

```js
async function unstableFetch() {
  const res = await fetch('https://httpstat.us/503'); // returns 503
  if (!res.ok) throw new Error('Temporary error');
  return res.json();
}

queryClient.fetchQuery({
  queryKey: ['unstable'],
  queryFn: unstableFetch,
  retry: 3, // retry up to 3 times
}).catch(err => {
  console.error('Failed after retries:', err.message);
});
```

👉 TanStack Query retries automatically with exponential backoff.

---

## 6. Stale State Control

```js
await queryClient.fetchQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
  staleTime: 1000 * 60 * 5, // 5 minutes
});

// Within 5 minutes, data is considered "fresh"
console.log('Fresh data:', queryClient.getQueryData(['users']));
```

👉 After 5 minutes, the query becomes stale and will refetch on next use.

---

## 7. Invalidation

```js
// Invalidate cached query
queryClient.invalidateQueries({ queryKey: ['users'] });

// Next fetch will hit the network again
await queryClient.fetchQuery({ queryKey: ['users'], queryFn: fetchUsers });
console.log('Refetched after invalidation');
```

---

## 8. Cancelling

TanStack Query supports **cancelling ongoing requests** via `AbortController`. This prevents wasted bandwidth and race conditions.

```js
async function fetchUsersWithCancel({ signal }) {
  const res = await fetch('https://jsonplaceholder.typicode.com/users', { signal });
  if (!res.ok) throw new Error('Network error');
  return res.json();
}

// Start a query
const promise = queryClient.fetchQuery({
  queryKey: ['users'],
  queryFn: fetchUsersWithCancel,
});

// Cancel it before completion
setTimeout(() => {
  queryClient.cancelQueries({ queryKey: ['users'] });
  console.log('Query cancelled');
}, 100);
```

👉 When cancelled, the `signal` aborts the `fetch` call, and the query is marked as cancelled without caching results.

---

## 🌱 Key Takeaway
TanStack Query in Node.js ES6 gives you:
- **Caching**: Store and reuse results.  
- **Deduplication**: Prevent duplicate requests.  
- **Retries**: Handle transient errors gracefully.  
- **Stale control**: Balance freshness vs performance.  
- **Invalidation**: Keep data synchronized after changes.  
- **Cancelling**: Abort unnecessary queries to save resources.  

Together, these features make TanStack Query a **complete data lifecycle manager** for backend services or vanilla JS apps.
