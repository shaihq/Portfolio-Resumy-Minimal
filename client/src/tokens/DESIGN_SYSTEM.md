# Design System — Single Source of Truth

All design decisions (colors, typography, spacing, animation, component patterns) live in `client/src/tokens/`. **Never hardcode** hex colors, font weights, animation variants, or layout values directly in components.

---

## Quick Reference

```tsx
import { colors, colorClasses } from "@/tokens/colors";
import { fontClass, typeScale, bodyFontStyle } from "@/tokens/typography";
import { layout, componentLayout, sectionGap } from "@/tokens/spacing";
import {
  containerVariants,
  itemVariants,
  transition,
  easing,
} from "@/tokens/animation";
import {
  navPreset,
  cardPreset,
  textPreset,
  interactivePreset,
  pagePreset,
} from "@/tokens/components";
```

---

## File Map

| File            | What it owns                                                                                                    |
| --------------- | --------------------------------------------------------------------------------------------------------------- |
| `colors.ts`     | Semantic HSL variables, surface/text/divider/brand palettes, pre-built Tailwind class strings                   |
| `typography.ts` | Font families (Inter, DM Mono, Cedarville Cursive), weights (450, 500, 600, 700), type scale, className presets |
| `spacing.ts`    | 4 px grid, container max-width, section/header/footer layout classes, component sizing                          |
| `animation.ts`  | Framer Motion easing curves, transitions, stagger configs, all reusable Variants, hover presets                 |
| `components.ts` | Pre-built className strings for navbar, cards, text elements, interactive elements, page wrappers               |
| `index.ts`      | Barrel re-export — import everything from `@/tokens`                                                            |

---

## Rules

1. **Colors** — Use CSS custom properties (`var(--color-*)`) or Tailwind semantic classes (`text-foreground`, `bg-background`). Never write a raw hex `#XXXXXX` in a component.
2. **Font weight 450** — Use the `font-body` utility class (defined in `index.css`). Never write `style={{ fontWeight: 450 }}`.
3. **Animation variants** — Import `containerVariants` / `itemVariants` from `@/tokens/animation`. Never re-declare them inside a page component.
4. **Inline CSS** — Never use `dangerouslySetInnerHTML` for styles. All custom CSS goes in `index.css`.
5. **Component classes** — Use `navPreset.*`, `cardPreset.*`, `textPreset.*`, etc. When building a new component type, add a new preset to `components.ts` first.
6. **Spacing** — Use `layout.*` for page-level sections, `componentLayout.*` for element sizing, `sectionGap.*` for vertical rhythm.

---

## Adding New Tokens

### New color

1. Add the CSS custom property to `index.css` (`:root` and `.dark` blocks)
2. Add the JS reference to `colors.ts`
3. Optionally add a `colorClasses` entry for convenience

### New component preset

1. Add a new export to `components.ts` with descriptive property names
2. Import and use in the component file

### New animation

1. Add variants/transitions to `animation.ts`
2. Import in the page or component that needs it

---

## Example: Building a New Section

```tsx
import { motion } from "framer-motion";
import {
  containerVariants,
  itemVariants,
  transition,
} from "@/tokens/animation";
import { layout } from "@/tokens/spacing";
import { textPreset, cardPreset } from "@/tokens/components";

export function NewSection() {
  return (
    <motion.section
      className={layout.section}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2 className={textPreset.sectionHeading} variants={itemVariants}>
        Section Title
      </motion.h2>
      <motion.div className={cardPreset.projectCard} variants={itemVariants}>
        Card content
      </motion.div>
    </motion.section>
  );
}
```

This guarantees visual consistency even during rapid prototyping / vibe coding.
