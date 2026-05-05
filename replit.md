# Designfolio – Replit.md

## Overview

Designfolio is an AI-powered portfolio builder and job-matching platform built for product designers. It has two main areas:

1. **Portfolio Builder** (`/`) – A drag-and-drop, theme-switchable designer portfolio editor where users can build and publish their personal design portfolio with customizable templates, sections, and content.
2. **Jobs Dashboard** (`/jobs`) – An AI-driven job matching board that finds relevant design roles, rates them by match score, supports Kanban-style tracking, and includes an AI avatar-powered mock interview system via Anam AI.

Supporting pages include a marketing landing page (`/landing`), signup flow (`/signup`), project detail view (`/project/:id`), and a privacy policy page.

---

## User Preferences

Preferred communication style: Simple, everyday language.

---

## System Architecture

### Frontend Architecture

- **Framework**: React 18 with TypeScript, bundled by Vite
- **Routing**: `wouter` (lightweight client-side router) – chosen over React Router for simplicity
- **State Management**: React Context (for theme and template selection), TanStack React Query (for server data fetching/caching)
- **Styling**: Tailwind CSS v4 (`@import "tailwindcss"` style), with CSS custom properties for theming (light/dark). Uses `tw-animate-css` for animation utilities.
- **Component Library**: shadcn/ui (New York style) built on top of Radix UI primitives. Components live in `client/src/components/ui/`
- **Animations**: Framer Motion (`motion/react`) used heavily for page transitions, micro-interactions, drag reordering, and cursor effects
- **Drag and Drop**: `@dnd-kit` used for the Kanban job board
- **Theme**: `next-themes` manages dark/light mode with CSS variable switching. Custom animated theme togglers available.
- **Icons**: Lucide React + `lucide-animated` for animated icon variants

**Key UI patterns:**
- Floating navigation sidebar (left side) for main app navigation
- Top floating navbar for portfolio editing controls (theme, publish, avatar)
- Drag-to-reorder sections using Framer Motion `Reorder`
- Fluid dropdown for switching portfolio templates
- Animated publish dropdown showing domain + update status

**Page structure:**
```
client/
  src/
    pages/       – Route-level page components
    components/  – Reusable components
      ui/        – shadcn/ui + custom UI components
    hooks/       – Custom React hooks (useTemplate, useIsMobile, useToast)
    lib/         – Utilities (queryClient, cn helper)
    assets/      – Images, Lottie animations
```

### Backend Architecture

- **Runtime**: Node.js with Express, written in TypeScript, run via `tsx`
- **Structure**: Thin API server with minimal routes. The main API endpoint proxies requests to the Anam AI service to create interview sessions.
- **Storage**: Currently uses in-memory storage (`MemStorage`) for the user entity. The storage interface (`IStorage`) is defined to allow easy swapping to a database-backed implementation.
- **Build**: Custom `script/build.ts` runs both Vite (client) and esbuild (server) to produce a `dist/` folder. Server is bundled as a CommonJS file.
- **Dev server**: Vite is mounted as middleware inside the Express server in development, enabling HMR.

**API Routes:**
- `POST /api/anam/session` – Creates an Anam AI persona session for mock interviews. Accepts `company`, `role`, and `description` and returns a session token. The system prompt is dynamically generated based on the job details.

### Data Storage

- **Database**: PostgreSQL via Drizzle ORM (configured in `drizzle.config.ts`, requires `DATABASE_URL` env var)
- **Schema** (`shared/schema.ts`): Currently only a `users` table with `id` (UUID), `username`, and `password` fields
- **Validation**: `drizzle-zod` generates Zod schemas from Drizzle table definitions
- **Current state**: The app uses `MemStorage` in the server, not yet wired to Postgres. The Drizzle config and schema are set up and ready; DB integration just needs to replace `MemStorage` with a Drizzle-backed implementation.

### Authentication & Authorization

- No authentication is implemented yet. The schema has a users table, and `passport`/`passport-local`/`express-session`/`connect-pg-simple` are in the dependency list (indicating planned session-based auth), but none are wired up in the current routes.

### Theming System

- CSS custom properties on `:root` and `.dark` selectors define the color palette
- `next-themes` wraps the app and handles class toggling (`class` strategy on `<html>`)
- A `TemplateContext` tracks which portfolio template is active (e.g., "Minimal") and propagates it to the home page components
- Multiple animated theme-toggle components exist as UI variants

---

## External Dependencies

### Anam AI (`@anam-ai/js-sdk`)
- Used in the Jobs page for AI avatar-powered mock interviews
- The server creates a session via `POST https://api.anam.ai` using `ANAM_API_KEY` (env var)
- A specific persona (`KEVIN_LLM_ID`) is used as the AI interviewer avatar
- The client SDK connects to the Anam stream for real-time video/audio interaction

### Google Fonts
- Loaded via `<link>` in `index.html`: Caveat, Geist Mono, DM Mono, Inter, Manrope

### Radix UI
- Full suite of Radix primitives used via shadcn/ui wrappers (Dialog, Sheet, Dropdown, Tooltip, Accordion, etc.)

### Framer Motion
- Extensive use for animations: page transitions, drag-reorder, presence animations, spring physics, scroll-linked transforms

### TanStack React Query
- Client-side data fetching and caching. Configured with `staleTime: Infinity` and no refetch on window focus (suitable for mostly-static portfolio data).

### Lottie React
- Used to render the AI Assistant animation in the jobs page (`AI-Assistant.json`)

### DND Kit
- Powers the Kanban board in the jobs dashboard. Uses `@dnd-kit/core`, `@dnd-kit/sortable`, and `@dnd-kit/utilities`.

### Replit Vite Plugins
- `@replit/vite-plugin-runtime-error-modal` – Overlay for runtime errors in dev
- `@replit/vite-plugin-cartographer` – Replit-specific dev tooling (dev only)
- `@replit/vite-plugin-dev-banner` – Dev banner (dev only)
- Custom `vite-plugin-meta-images.ts` – Updates OG/Twitter image meta tags to use the correct Replit deployment domain

### Environment Variables Required
| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string for Drizzle |
| `ANAM_API_KEY` | API key for Anam AI avatar sessions |