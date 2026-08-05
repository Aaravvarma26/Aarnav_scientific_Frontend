# Frontend deployment

Domain: `https://aarnavscientific.co.in`
Backend proxy target: `https://api.api.aarnavscientific.co.in`

1. Upload this frontend folder to the frontend Node.js application.
2. Copy `.env.production` values into Hostinger environment variables and replace database placeholders.
3. Build command: `npm ci && npx prisma generate && npm run build`
4. Start command: `npm run start`
5. The frontend proxies `/api/*` and `/uploads/*` to the backend, preserving first-party admin cookies.
