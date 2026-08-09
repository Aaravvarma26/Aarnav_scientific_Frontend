# Previous Frontend - Separated Public Site

This package contains the public-facing Next.js site extracted from the previous combined UI project.

- Public pages remain under `src/app/(frontend)`.
- Shared public components remain under `src/components/frontend` and `src/components/common`.
- Browser-side `/api/*` and `/uploads/*` requests continue to proxy to `BACKEND_URL` through `next.config.mjs`.
- Server-rendered reads now use `src/common/backend.ts` instead of Prisma, so this UI no longer requires direct database access.
- Database schema, seeds, scripts, and uploaded files are preserved in the separated backend package.
