# PMS Codex MVP

## Run

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

Open `http://localhost:3000/workspace`.
