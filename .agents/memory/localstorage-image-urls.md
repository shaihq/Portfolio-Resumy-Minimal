---
name: localStorage stale Vite image URLs
description: Vite-bundled asset URLs change hash on every rebuild; saving them to localStorage causes image to break on next load.
---

When a React component saves `imageUrl` (a Vite-bundled static import) to localStorage and the app rebuilds, the hashed URL changes (e.g. `/assets/image-Abc123.png` → `/assets/image-Xyz789.png`). The old URL 404s, breaking the image permanently until localStorage is cleared.

**Why:** Vite hashes asset filenames for cache busting. These hashes are ephemeral and must not be treated as stable identifiers.

**How to apply:** Only persist user-uploaded image URLs (those starting with `data:`, `http://`, or `https://`) to localStorage. Discard any stored imageUrl that does not match these patterns and fall back to the fresh module import. Apply the same check in both the `useState` initializer and the `updateMeta`/save function.

```ts
const isUserImage = (url: string) =>
  url.startsWith("data:") || url.startsWith("http://") || url.startsWith("https://");

// In useState initializer:
if (!parsed.imageUrl || !isUserImage(parsed.imageUrl)) delete parsed.imageUrl;

// In save function:
const toSave = { ...next };
if (!toSave.imageUrl || !isUserImage(toSave.imageUrl)) delete toSave.imageUrl;
```
