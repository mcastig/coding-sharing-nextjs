# NoteCode – Create & Share Your Code

**Live demo → [coding-sharing-nextjs.vercel.app](https://coding-sharing-nextjs.vercel.app/)**

A code-sharing web app built with Next.js 16. Write a snippet, hit **Share**, and get a permanent link anyone can open.

## Features

- Monaco Editor with syntax highlighting and minimap
- Language selector: HTML, CSS, JavaScript, TypeScript, Python
- Theme selector: Light / Dark
- Share button generates a unique URL and saves the snippet to MongoDB
- Copy Link button shows the shortened URL after sharing
- Share button re-enables whenever code or language is edited (theme change preserves the shared state)
- Fully responsive — stacked toolbar and scaled typography on mobile

## Tech stack

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **MongoDB** via the official Node.js driver
- **Monaco Editor** (`@monaco-editor/react`)
- **uuid** for snippet IDs
- **Jest** + **React Testing Library** for unit tests

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Start MongoDB

The app requires a running MongoDB instance on port `27017`. The easiest way is Docker:

```bash
docker compose up -d
```

Or point `MONGODB_URI` at a [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (see step 3).

### 3. Configure environment

Create `.env.local` in the project root:

```env
MONGODB_URI=mongodb://localhost:27017/notecode
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev        # development server (Turbopack)
npm run build      # production build
npm run start      # serve production build
npm run lint       # ESLint
npm test           # Jest unit tests
npm run test:watch # Jest in watch mode
```

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/snippets` | Save a snippet; returns `{ id }` |
| `GET` | `/api/snippets/:id` | Retrieve a snippet by ID |

## Project structure

```
app/
  layout.tsx                  Root layout (Outfit font, metadata)
  globals.css                 Tailwind v4 @theme tokens and base styles
  page.tsx                    Home page — editor with default HTML snippet
  [id]/page.tsx               Shared snippet page — server-side MongoDB fetch
  api/snippets/
    route.ts                  POST /api/snippets
    [id]/route.ts             GET  /api/snippets/:id

components/
  CodeEditor/
    CodeEditor.tsx            Monaco editor, share flow state, router navigation
    CodeEditor.css            Editor dark/light background, minimap padding
    CodeEditor.test.tsx       Unit tests
  EditorToolbar/
    EditorToolbar.tsx         Language/theme selects, Share and Copy Link buttons
    EditorToolbar.css         Toolbar, select, button styles
    EditorToolbar.test.tsx    Unit tests
  Header/
    Header.tsx                Logo, tagline, heading
    Header.css                Responsive font sizes
    Header.test.tsx           Unit tests
  PageLayout/
    PageLayout.tsx            Hero background, purple section, content wrapper
    PageLayout.css            Purple gradient with bowl curve
    PageLayout.test.tsx       Unit tests

lib/
  mongodb.ts                  MongoClient singleton with dev hot-reload guard
  constants.ts                DEFAULT_HTML snippet, LANGUAGES array, THEMES array

public/
  NoteCodeLogo.svg            App logo
  Hero-Background-notecode.svg  Page background arc lines
  Share.svg / link.svg / down-arrow.svg  UI icons

docker-compose.yml            MongoDB service
```
