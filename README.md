# Frontend

Public Aarnav Scientific website only.

## Run

```bash
npm install
npm run dev
```

Default local port: `3000`.

Set `BACKEND_URL` and `NEXT_PUBLIC_API_URL` to the backend, normally `http://localhost:3001` for local development.

The public frontend no longer imports Prisma or queries the database directly. Server-rendered catalogue, blog, certificates, export data, testimonials, partners, and sitemap data are read through backend APIs.
