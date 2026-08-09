# Structure Mapping

This is the separated public frontend built only from the supplied previous project files.
The reference frontend was used only to identify frontend responsibility; no reference-project source, data, or assets were copied here.

Active ownership:
- `src/app/(frontend)` public routes
- `src/components/frontend` public UI
- `src/components/common` shared public controls
- `public` public website assets
- `src/common/backend.ts` server-side backend HTTP access
- `/api/*` and `/uploads/*` proxy to `BACKEND_URL`

Admin routes/components, Prisma/database files, API route handlers, seeds, and uploads are not part of this active frontend build.
