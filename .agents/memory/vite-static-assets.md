---
name: Static image imports outside Vite root
description: Images imported via @assets alias (attached_assets/) are outside client/ root; may fail in dev with fs.strict:true and produce stale hashed URLs in prod.
---

The project uses `root: client/` in vite.config.ts with `fs.strict: true`. The `@assets` alias points to `attached_assets/` which is a sibling of `client/`, outside the root.

Static PNG imports from `@assets/` can fail to serve in dev mode and always generate hashed bundle URLs that break when saved to localStorage and the app rebuilds.

**Why:** Vite's `fs.strict: true` restricts served files to within the configured root. Images outside the root are unreliable.

**How to apply:** All static image assets that are imported by React components must live inside `client/src/assets/` (aliased as `@/assets/`). Copy files from `attached_assets/` to `client/src/assets/images/` and update imports to use `@/assets/images/`.
