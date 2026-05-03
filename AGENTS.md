@CLAUDE.md

## Project overview
Next.js 16 blog frontend. Fetches posts from an external GraphQL CMS (defined in `integrations/cms/`). Uses ISR cache invalidation via `POST /api/revalidate`.

## Package manager
Use **pnpm** (not npm/yarn). Workspace root uses `pnpm-workspace.yaml`.

## Commands
- `pnpm dev` - Start dev server (port 3000)
- `pnpm build` - Production build
- `pnpm lint` - ESLint (flat config using `eslint-config-next`)

No test script defined. No typecheck script defined.

## Key environment variables
- `CMS_HOST` - GraphQL CMS endpoint (e.g. `http://localhost:4502`)
- `CMS_USERNAME` + `CMS_PASSWORD` - Basic auth for CMS (optional pair)
- `REVALIDATE_SECRET` - HMAC-SHA256 secret for `/api/revalidate` webhook

## ISR / Revalidation
`POST /api/revalidate` accepts JSON with `entity`, `event`, `slug`, and optional `previousSlug`. Requires HMAC-SHA256 signature in `x-revalidate-signature` header (format: `sha256=<hex>`). Cache tags: `posts:list` for list, `post:<slug>` for detail. See `.rest` for example payloads and signature generation commands.

## Architecture
- `app/` - Next.js App Router pages (`/`, `/blog`, `/blog/[slug]`, `/api/revalidate`)
- `components/` - Shared UI components
- `features/posts/` - Post data layer (service + mapper)
- `integrations/cms/` - CMS GraphQL client and queries
- `contexts/` - React contexts (e.g. theme)
- `providers/` - Provider components
- `types/` - TypeScript types (`post.ts`, `cms/post.ts`)

## CMS integration
GraphQL endpoint: `<CMS_HOST>/content/cq:graphql/weblog/endpoint..json`. Uses Basic auth if `CMS_USERNAME`/`CMS_PASSWORD` are both set. Server-only code (imports `server-only` in integration and API files).

## Styling
Tailwind CSS v4 with `@tailwindcss/postcss` (no `tailwind.config.js`). Uses `@import "tailwindcss"` in CSS. Utility classes like `bg-amber-300`, `text-4xl`, `rounded-[2rem]`.

## ESLint
Flat config (`eslint.config.mjs`). Extends `eslint-config-next/typescript` + `eslint-config-next/core-web-vitals`. No custom overrides beyond ignores.

## Next.js quirks (v16)
This codebase uses Next.js 16 APIs. APIs, conventions, and file structure may differ from training data. Read `node_modules/next/dist/docs/` for breaking changes before writing code that relies on undocumented behavior.