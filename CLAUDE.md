# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # start dev server (Turbopack)
npm run build    # production build
npm run start    # run production build locally
npm run lint     # run ESLint
```

There is no test runner configured.

## Stack

- **Next.js 16.2.4** with **App Router** (no Pages Router)
- **React 19.2.4**
- **TypeScript** (strict mode, `@/*` alias maps to repo root)
- **Tailwind CSS v4** (CSS-first config via `@theme` in `globals.css`; no `tailwind.config.*`)
- **MongoDB** via the official Node.js driver (`lib/mongodb.ts` singleton)
- **Monaco Editor** via `@monaco-editor/react` (dynamically imported, SSR disabled)
- **uuid** for snippet ID generation

## Environment

```
MONGODB_URI=mongodb://localhost:27017/notecode   # required – set in .env.local
```

## Project structure

```
app/
  layout.tsx              Outfit font, metadata
  globals.css             @theme tokens (nc-dark, nc-blue, etc.), body base styles
  page.tsx                Home page (/)
  [id]/page.tsx           Shared snippet page; awaits params, fetches from MongoDB
  api/snippets/
    route.ts              POST – saves snippet, returns { id }
    [id]/route.ts         GET  – retrieves snippet by UUID

components/
  CodeEditor.tsx          'use client' – Monaco editor, language/theme selectors,
                          Share + Copy Link buttons, share flow state

lib/
  mongodb.ts              MongoClient singleton with dev hot-reload guard
  constants.ts            DEFAULT_HTML snippet, LANGUAGES array, THEMES array

public/                   SVG assets (logo, icons, hero background)
```

## Key patterns in this codebase

**`CodeEditor` share flow**
- `isShared` starts `true` on `/:id` (snippet already saved), `false` on `/`
- Any edit (code, language, theme) sets `isShared = false`, re-enabling the Share button
- Share POSTs to `/api/snippets`, gets a UUID, then `router.push(`/${id}`)`
- Copy Link button is shown only when `isShared === true`

**Monaco dynamic import**
```tsx
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })
```
The SSR bailout warning in dev logs is expected and harmless.

**Theme values**
- `'vs'` → Monaco light theme
- `'vs-dark'` → Monaco dark theme

**Tailwind custom colors** (defined in `globals.css @theme`)
- `nc-dark` → `#121826`
- `nc-medium` → `#364153`
- `nc-light` → `#CED6E1`
- `nc-blue` → `#406AFF`
- `nc-white` → `#FFFFFE`

## Critical: App Router conventions in this version

**Always read the relevant guide in `node_modules/next/dist/docs/` before writing code.**

### params is a Promise

```tsx
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
}
```

Same applies to route handlers:
```ts
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
}
```

### Server vs Client Components

- Layouts and pages are **Server Components by default** — they can be `async` and query MongoDB directly.
- Add `'use client'` only when you need state, event handlers, `useEffect`, or browser APIs.

### Caching

Not enabled (`cacheComponents` is not set). Use the legacy model if needed — see `node_modules/next/dist/docs/01-app/02-guides/caching-without-cache-components.md`.

### Navigation

Use `<Link>` from `next/link`, not `<a>`, for client-side navigation with prefetching.

Docs reference: `node_modules/next/dist/docs/`
