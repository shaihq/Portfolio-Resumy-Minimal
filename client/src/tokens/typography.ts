/**
 * Design System — Typography Tokens (Single Source of Truth)
 *
 * ALL font families, sizes, weights, and line-heights MUST come from here.
 * Never hardcode font-['Inter'] or text-[14px] directly — use these tokens.
 *
 * Usage:
 *   import { typography, fontClass } from "@/tokens/typography";
 *   <h1 className={fontClass.pageTitle}>...</h1>
 *   <p className={fontClass.body}>...</p>
 */

// ─── Font Families ───

export const fontFamily = {
  /** Primary body font */
  sans: "Inter",
  /** Monospace for labels/headings */
  mono: "DM Mono",
  /** Decorative/cursive for signatures */
  cursive: "Cedarville Cursive",
} as const;

// ─── Font Weights ───

export const fontWeight = {
  /** Regular body weight (450 is the custom weight used) */
  body: 450,
  /** Medium for names, labels */
  medium: 500,
  /** Semibold for page titles */
  semibold: 600,
  /** Bold for section headings */
  bold: 700,
} as const;

// ─── Type Scale ───
// Based on the existing design patterns found in the codebase.

export const typeScale = {
  /** Page title: "Hey I'm Matt." — 24px semibold */
  pageTitle: {
    size: "text-2xl", // 24px
    weight: "font-semibold",
    tracking: "tracking-tight",
    family: "font-sans",
  },
  /** Section heading: "INTRO", "EXPERIENCE" — 14px bold mono uppercase */
  sectionHeading: {
    size: "text-[14px]",
    weight: "font-bold",
    tracking: "tracking-widest",
    family: `font-['DM_Mono']`,
    transform: "uppercase",
  },
  /** Sub-section heading (project details) — 11px bold mono uppercase */
  subSectionHeading: {
    size: "text-[11px]",
    weight: "font-bold",
    tracking: "tracking-widest",
    family: `font-['DM_Mono']`,
    transform: "uppercase",
  },
  /** Body text — 16px weight-450 */
  body: {
    size: "text-base", // 16px
    weight: "", // uses fontWeight.body via style
    lineHeight: "leading-[1.7]",
    family: "font-sans",
  },
  /** Body tight (experience description) — 15px weight-450 */
  bodySmall: {
    size: "text-[15px]",
    weight: "",
    lineHeight: "leading-relaxed",
    family: "font-sans",
  },
  /** Caption text — 13px medium */
  caption: {
    size: "text-[13px]",
    weight: "font-medium",
    family: "font-sans",
  },
  /** Detail label (project details key) — 12px medium uppercase */
  detailLabel: {
    size: "text-xs",
    weight: "font-medium",
    tracking: "tracking-wide",
    transform: "uppercase",
    family: "font-sans",
  },
  /** Micro text (game, footer) — 10px mono */
  micro: {
    size: "text-[10px]",
    weight: "font-bold",
    tracking: "tracking-widest",
    family: `font-['DM_Mono']`,
    transform: "uppercase",
  },
  /** Footer text — 12px */
  footer: {
    size: "text-xs",
    weight: "",
    family: "font-sans",
  },
} as const;

// ─── Pre-built Class Strings ───
// Ready-to-use className strings for each text style.

export const fontClass = {
  /** Page title: 24px semibold tight tracking */
  pageTitle: "text-2xl font-semibold tracking-tight",

  /** Section heading: 14px bold DM Mono uppercase wide tracking */
  sectionHeading:
    "text-[14px] font-bold font-['DM_Mono'] uppercase tracking-widest",

  /** Sub-section heading: 11px bold DM Mono uppercase */
  subSectionHeading:
    "text-[11px] font-bold font-['DM_Mono'] uppercase tracking-widest",

  /** Body text: 16px with 1.7 line height */
  body: "text-base leading-[1.7]",

  /** Body small: 15px with relaxed leading */
  bodySmall: "text-[15px] leading-relaxed",

  /** Caption: 13px medium */
  caption: "text-[13px] font-medium",

  /** Detail label: 12px medium uppercase */
  detailLabel: "text-xs font-medium uppercase tracking-wide",

  /** Micro text: 10px DM Mono uppercase */
  micro: "text-[10px] font-bold font-['DM_Mono'] uppercase tracking-widest",

  /** Footer: 12px */
  footer: "text-xs",

  /** Cursive/signature font */
  cursive: "font-['Cedarville_Cursive']",
} as const;

// ─── Font Weight 450 Style ───
// Tailwind doesn't support non-standard font weights.
// Use this inline style where weight 450 is needed.

export const bodyFontStyle = { fontWeight: fontWeight.body } as const;
