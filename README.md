# socially-social-app

A full-stack social media app built for learning and practice purposes.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

🎥 **Tutorial reference:**  
[Codesistency – YouTube](https://www.youtube.com/watch?v=vUYopHWOURg&list=LL&index=1&t=679s&ab_channel=Codesistency)

---

## 🔧 Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS, ShadCN
- **Authentication:** Clerk
- **Database:** PostgreSQL (via Neon)
- **ORM:** Prisma

---

## 🚀 Features & Highlights

- 🧩 Server Components, Layouts, Route Handlers, Server Actions
- 💡 Special Next.js files: `loading.tsx`, `error.tsx`, `not-found.tsx`
- 📡 API integration using Route Handlers
- 🔄 Data fetching, caching & revalidation
- 🎭 Client & Server Component separation
- 🛣️ Dynamic & static routing
- 🎨 Tailwind + ShadCN styling
- 🔐 Authentication and authorization
- 📤 File uploads with UploadThing
- 🗃️ Database integration with Prisma
- 📝 Forms using Server Actions
- ⚡ Optimistic UI updates

---

## 🗒️ TODO Conventions

- `TODO: INFO` – contextual notes that explain functionality or how to use a piece of code.
- `TODO: IMPORTANT` – high-priority follow-ups that should be addressed before shipping.
- `TODO:` – regular backlog items or nice-to-have improvements.

## 📒 Workbench Notes

- Keep rolling out the RHF + Zod setup: finish converting the post actions first, then apply the same pattern across the rest of the application.
- Carve out the Clerk login modal—and any similar UI—into dedicated parallel-route slots such as `@modal` whenever possible.
- Review Suspense usage patterns once the `use cache` (PPR) guidance is finalized to ensure our caching strategy remains aligned.

---

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### Useful Prisma CLI commands

- `npx prisma studio` – Opens the Prisma Studio GUI for browsing and editing your database
- `npx prisma generate` – Generates the Prisma Client from your schema
- `npx prisma migrate dev` – Creates and applies migrations in development
- `npx prisma migrate deploy` – Applies migrations in production
- `npx prisma migrate reset` – Resets the database and reapplies all migrations
- `npx prisma db push` – Pushes the current schema state to the database without migrations
- `npx prisma format` – Formats the Prisma schema file
