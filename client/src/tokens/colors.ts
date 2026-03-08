/**
 * Design System — Color Tokens (Single Source of Truth)
 *
 * ALL colors in the application MUST come from here.
 * Never hardcode hex values like #F0EDE7 or #1A1A1A in components.
 *
 * Usage in Tailwind classes:
 *   Use the semantic CSS variable names (bg-background, text-foreground, etc.)
 *   For custom tokens not in Tailwind theme, use the `colors` export.
 *
 * Usage in inline styles (rare):
 *   import { colors } from "@/tokens/colors";
 *   style={{ color: colors.surface.card }}
 */

// ─── Semantic Color Tokens (map to CSS variables in index.css) ───
// These match the Tailwind theme via `--color-*` in @theme inline block.
// Use via Tailwind: bg-background, text-foreground, bg-card, etc.

export const semanticColors = {
  light: {
    background: "42 16% 92%", // #F0EDE7
    foreground: "20 10% 15%", // #1A1A1A (approx #2B2623)
    card: "46 29% 94%", // #F5F2EC
    cardForeground: "20 10% 15%",
    popover: "46 29% 94%",
    popoverForeground: "20 10% 15%",
    primary: "20 10% 15%",
    primaryForeground: "46 29% 94%",
    secondary: "46 15% 88%",
    secondaryForeground: "20 10% 15%",
    muted: "46 15% 88%",
    mutedForeground: "20 5% 45%", // #7A736C
    accent: "46 15% 88%",
    accentForeground: "20 10% 15%",
    destructive: "0 84% 60%",
    destructiveForeground: "0 0% 100%",
    border: "46 15% 80%",
    input: "46 15% 80%",
    ring: "20 10% 15%",
  },
  dark: {
    background: "20 10% 10%", // #1A1A1A (approx #1C1917)
    foreground: "46 29% 94%", // #F0EDE7
    card: "20 10% 12%", // #2A2520 (approx #211E1B)
    cardForeground: "46 29% 94%",
    popover: "20 10% 12%",
    popoverForeground: "46 29% 94%",
    primary: "46 29% 94%",
    primaryForeground: "20 10% 10%",
    secondary: "20 10% 15%",
    secondaryForeground: "46 29% 94%",
    muted: "20 10% 15%",
    mutedForeground: "46 10% 60%", // #B5AFA5
    accent: "20 10% 15%",
    accentForeground: "46 29% 94%",
    destructive: "0 84% 60%",
    destructiveForeground: "0 0% 100%",
    border: "20 10% 20%",
    input: "20 10% 20%",
    ring: "46 29% 94%",
  },
} as const;

// ─── Extended Color Palette ───
// For colors used in the app that are NOT in the Tailwind semantic system.
// Use these via Tailwind arbitrary values or the `colors` export.

export const colors = {
  /** Surface colors beyond card/background */
  surface: {
    /** White surface for cards in light mode: bg-white dark:bg-card */
    white: "hsl(0, 0%, 100%)",
    /** Elevated card background — light: #FFF, dark: #2A2520 */
    elevated: {
      light: "#FFFFFF",
      dark: "#2A2520",
    },
    /** Subtle hover — light: #F5F5F5, dark: #3A3531 */
    subtle: {
      light: "#F5F5F5",
      dark: "#3A3531",
    },
    /** Hover state for subtle surfaces */
    subtleHover: {
      light: "#E8E8E8",
      dark: "#4A4540",
    },
  },

  /** Text colors beyond foreground/muted-foreground */
  text: {
    /** Section heading label — light: #463B34, dark: #D4C9BC */
    heading: {
      light: "#463B34",
      dark: "#D4C9BC",
    },
    /** Tertiary text (lighter than muted) — light: #666666, dark: #9E9893 */
    tertiary: {
      light: "#666666",
      dark: "#9E9893",
    },
    /** Muted text — light: #7A736C, dark: #B5AFA5 */
    muted: {
      light: "#7A736C",
      dark: "#B5AFA5",
    },
    /** Secondary muted — light: #888888, dark: #7A736C */
    secondaryMuted: {
      light: "#888888",
      dark: "#7A736C",
    },
    /** Icon subtle — light: #7A736C, dark: #9E9893 */
    icon: {
      light: "#7A736C",
      dark: "#9E9893",
    },
  },

  /** Border/divider colors beyond border */
  divider: {
    /** Dashed border — light: #E5D7C4, dark: #3A352E */
    dashed: {
      light: "#E5D7C4",
      dark: "#3A352E",
    },
    /** Table/detail border — light: #C8C4BD, dark: #3A352E */
    table: {
      light: "#C8C4BD",
      dark: "#3A352E",
    },
    /** Detail panel bg — light: #E7E3D9, dark: #2A2520 */
    panelBg: {
      light: "#E7E3D9",
      dark: "#2A2520",
    },
  },

  /** Brand accent */
  brand: {
    red: "#FF553E",
  },

  /** Opacity-based overlays — use via Tailwind classes */
  overlay: {
    hoverLight: "black/[0.03]",
    hoverLightStrong: "black/[0.05]",
    hoverDark: "white/[0.05]",
    borderLight: "black/5",
    borderLightStrong: "black/10",
    borderDark: "white/10",
    borderDarkStrong: "white/20",
  },
} as const;

// ─── Tailwind Class Mappings ───
// Pre-built Tailwind class strings for consistent usage.
// Import and spread these in your components.

export const colorClasses = {
  /** Page-level wrapper */
  page: "bg-background text-foreground",

  /** Section heading (e.g., "INTRO", "EXPERIENCE") */
  sectionHeading: "text-[var(--color-heading)]",

  /** Body/muted text */
  bodyMuted: "text-muted-foreground",

  /** Tertiary text */
  bodyTertiary: "text-[var(--color-tertiary)]",

  /** Icon default color */
  iconDefault: "text-[var(--color-icon)]",

  /** Elevated card surface */
  cardSurface: "bg-[var(--color-surface-elevated)]",

  /** Subtle surface (e.g., navbar buttons) */
  subtleSurface:
    "bg-[var(--color-surface-subtle)] hover:bg-[var(--color-surface-subtle-hover)]",

  /** Overlay hover */
  hoverOverlay: "hover:bg-black/[0.03] dark:hover:bg-white/[0.05]",

  /** Card border */
  cardBorder: "border-black/5 dark:border-white/10",
  cardBorderHover: "hover:border-black/10 dark:hover:border-white/20",

  /** Selection */
  selection: "selection:bg-foreground selection:text-background",
} as const;
