---
name: ThumbnailUpload relative/absolute conflict
description: Using template literal for className in ThumbnailUpload causes `relative` to silently win over caller-supplied `absolute` in Tailwind's CSS cascade.
---

The `ThumbnailUpload` component hardcodes `relative` in its className via template literal concatenation. When a caller passes `className="absolute inset-0 ..."`, both `relative` and `absolute` end up in the DOM class list. Tailwind's CSS output defines `.absolute` before `.relative`, so `.relative` wins by cascade order — the wrapper is positioned relatively, not absolutely, making the hero image invisible.

**Why:** Template literal merging does not resolve conflicting utilities. `tailwind-merge` (via `cn()`) does.

**How to apply:** Any component that hardcodes a position utility and also accepts a `className` prop must use `cn("relative ...", className)` so tailwind-merge can resolve conflicts. Never use template literals for className when position utilities might conflict.
