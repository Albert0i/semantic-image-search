
## 🧱 Step-by-Step: Using SQLite with Prisma ORM

### 1. 📦 Setup Your Project
```bash
mkdir hello-prisma
cd hello-prisma
npm init -y
npm install prisma @prisma/client sqlite3
npx prisma init
```
This creates a `prisma` folder with a `schema.prisma` file and sets up Prisma CLI.

---

### 2. 🗂️ Configure SQLite in `schema.prisma`
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

generator client {
  provider = "prisma-client-js"
}
```

---

### 3. 🧬 Define Your Data Model
Let’s say you want a `Post` model:
```prisma
model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  createdAt DateTime @default(now())
}
```

---

### 4. 🚀 Run Migration and Generate Client
```bash
npx prisma migrate dev --name init
npx prisma generate
```
This creates the SQLite database (`dev.db`) and generates the Prisma Client.

---

### 5. 🧪 Use Prisma Client in Code
Create a file like `index.js` or `index.ts`:
```js
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const newPost = await prisma.post.create({
    data: {
      title: 'Hello SQLite',
      content: 'This is powered by Prisma.',
    },
  })

  const allPosts = await prisma.post.findMany()
  console.log(allPosts)
}

main()
```

---

### 6. 🧹 Optional: Seed Script
You can create a `seed.js` to populate initial data:
```js
await prisma.post.createMany({
  data: [
    { title: 'First Post', published: true },
    { title: 'Second Post', published: false },
  ],
})
```

---

## 🧭 Why Use Prisma with SQLite?
| Feature            | Benefit                                                                 |
|--------------------|-------------------------------------------------------------------------|
| Lightweight setup  | No server needed — SQLite is file-based                                 |
| Type-safe queries  | Prisma generates types from your schema                                 |
| Easy migrations    | Prisma CLI handles schema evolution                                     |
| Ideal for dev/test | Perfect for prototyping, local apps, or embedded systems                |

---

## ⚠️ Considerations
- **SQLite is not ideal for high-concurrency production apps** — use PostgreSQL or MySQL for scaling.  
- **Prisma’s migrations are schema-first**, so you define models in `.prisma` and generate SQL from there.  
- **SQLite file (`dev.db`) is local** — make sure it’s backed up if used seriously.

---
