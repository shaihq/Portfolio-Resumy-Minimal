/**
 * Design System — Spacing & Layout Tokens (Single Source of Truth)
 *
 * ALL spacing, container widths, and layout patterns MUST come from here.
 * Never hardcode max-w-[640px] or px-5 md:px-8 in components.
 *
 * Usage:
 *   import { layout, spacing } from "@/tokens/spacing";
 *   <div className={layout.pageContainer}>...</div>
 *   <div className={layout.section}>...</div>
 */

// ─── Spacing Scale ───
// Based on 4px grid, matching Tailwind defaults.

export const spacing = {
  /** 0px */
  none: "0",
  /** 4px */
  xs: "1",
  /** 8px */
  sm: "2",
  /** 12px */
  md: "3",
  /** 16px */
  base: "4",
  /** 20px */
  lg: "5",
  /** 24px */
  xl: "6",
  /** 32px */
  "2xl": "8",
  /** 48px */
  "3xl": "12",
  /** 64px */
  "4xl": "16",
} as const;

// ─── Container ───

export const container = {
  /** Main content max width */
  maxWidth: "max-w-[640px]",
  /** Full width + centered */
  base: "w-full max-w-[640px]",
} as const;

// ─── Layout Class Strings ───
// Pre-built className strings for layout patterns.

export const layout = {
  /** Root page wrapper — centers content, sets min-h, transitions */
  pageWrapper:
    "min-h-screen flex justify-center transition-colors duration-700",

  /** Main content column — max-width container with dashed borders */
  pageContainer:
    "w-full max-w-[640px] custom-dashed-x relative min-h-screen flex flex-col transition-colors duration-700",

  /** Standard section — consistent horizontal padding and vertical spacing */
  section: "px-5 md:px-8 py-8",

  /** Section with less vertical padding */
  sectionCompact: "px-5 md:px-8 py-4",

  /** Section with more bottom padding */
  sectionLarge: "px-5 md:px-8 py-8 pb-16",

  /** Header area — more top padding for navbar clearance */
  header: "px-5 md:px-8 pt-12 md:pt-16 pb-6",

  /** Header area for sub-pages (no navbar offset needed) */
  subHeader: "px-5 md:px-8 pt-8 pb-6",

  /** Media section (images) — horizontal padding only */
  media: "px-5 md:px-8 pb-4",

  /** Dashed horizontal rule separator */
  separator: "custom-dashed-t",

  /** Footer section */
  footer: "px-5 md:px-8 py-4 text-center",
} as const;

// ─── Section Spacing Gaps ───

export const sectionGap = {
  /** Gap after section heading (mb-4) */
  headingToContent: "mb-4",
  /** Gap after section heading - larger (mb-6) */
  headingToContentLarge: "mb-6",
  /** Gap between items in a list */
  listItem: "space-y-1",
  /** Gap between recommendation cards */
  cards: "space-y-6",
  /** Grid gap for project cards */
  projectGrid: "gap-x-5 gap-y-8",
  /** Grid gap for contact buttons */
  contactGrid: "gap-3",
} as const;

// ─── Component-specific layout ───

export const componentLayout = {
  /** Project card grid */
  projectGrid: "grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-8",
  /** Contact buttons — 2 column on larger screens */
  contactGridHalf: "grid grid-cols-1 md:grid-cols-2 gap-3",
  /** Contact buttons — 4 column on larger screens */
  contactGridQuarter: "grid grid-cols-2 md:grid-cols-4 gap-3",
  /** Avatar size — large (profile) */
  avatarLarge: "w-[80px] h-[80px]",
  /** Avatar size — standard (navbar) */
  avatarNav: "h-10 w-10",
  /** Navbar icon button */
  navIconButton: "h-9 w-9",
  /** Project image aspect ratio */
  projectImageAspect: "aspect-[4/3]",
} as const;
