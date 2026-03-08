/**
 * Design System — Component Presets (Single Source of Truth)
 *
 * Pre-built className patterns for common UI elements.
 * These ensure consistency when vibe-coding new sections/pages.
 *
 * Usage:
 *   import { preset } from "@/tokens/components";
 *   <button className={preset.navButton}>...</button>
 *   <div className={preset.projectCard}>...</div>
 */

import { cn } from "@/lib/utils";

// ─── Navbar Presets ───

export const navPreset = {
  /** Navbar container — fixed, centered, pill-shaped */
  wrapper:
    "fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none pt-4 px-4",

  /** Navbar bar — pill background */
  bar: "bg-[var(--color-surface-elevated)] border border-black/8 dark:border-white/10 rounded-full shadow-sm pointer-events-auto max-w-[640px] w-full",

  /** Navbar inner layout */
  inner: "px-2 md:px-2 py-2 flex items-center justify-between gap-8",

  /** Navbar icon button (Insights, Themes, Preview) */
  iconButton: cn(
    "group h-9 w-9 rounded-full hover:cursor-pointer",
    "bg-[var(--color-surface-subtle)] hover:bg-[var(--color-surface-subtle-hover)]",
    "border border-black/10 dark:border-white/10",
    "text-[var(--color-icon)] hover:text-foreground",
  ),

  /** Dropdown trigger button */
  dropdownTrigger: cn(
    "rounded-full flex items-center gap-1 hover:cursor-pointer",
    "bg-[var(--color-surface-subtle)] hover:bg-[var(--color-surface-subtle-hover)]",
    "border border-black/10 dark:border-white/10",
    "text-foreground font-medium px-3 text-sm",
  ),

  /** Primary CTA button (Publish) */
  publishButton:
    "bg-black hover:bg-[#2A2A2A] dark:bg-white dark:hover:bg-[#E8E8E8] text-white dark:text-black font-medium px-6 h-9 text-sm rounded-full hover:cursor-pointer",

  /** Tooltip styling */
  tooltip: "bg-foreground text-background text-xs px-2 py-1 rounded",
} as const;

// ─── Card Presets ───

export const cardPreset = {
  /** Project card wrapper — clickable with hover state */
  projectCard:
    "group cursor-pointer flex flex-col p-4 -m-4 rounded-2xl hover:bg-black/[0.05] dark:hover:bg-white/[0.05] transition-all duration-300",

  /** Project card image container */
  projectImage:
    "rounded-xl overflow-hidden mb-4 aspect-[4/3] bg-[var(--color-surface-elevated)] drop-shadow-sm border border-black/5 dark:border-white/10 group-hover:border-black/10 dark:group-hover:border-white/20 transition-colors",

  /** Project card title */
  projectTitle: "font-medium text-base mb-1.5 text-foreground",

  /** Project card description */
  projectDescription: "text-base text-muted-foreground leading-relaxed",

  /** Recommendation card container */
  recommendationCard:
    "bg-[var(--color-surface-elevated)] rounded-2xl border border-black/5 dark:border-white/10 drop-shadow-sm overflow-hidden group",

  /** Recommendation card inner quote area */
  recommendationQuote:
    "border border-dashed border-[var(--color-divider-dashed)] rounded-xl p-4",

  /** Contact/action button */
  actionButton: cn(
    "w-full flex items-center justify-between px-4 py-4 h-auto",
    "bg-[var(--color-surface-elevated)] rounded-xl",
    "border border-black/5 dark:border-white/10 shadow-sm",
    "hover:bg-gray-50 dark:hover:bg-[var(--color-surface-card-hover)] transition-colors group",
  ),

  /** Detail table container */
  detailTable:
    "border border-[var(--color-divider-table)] rounded-lg overflow-hidden bg-[var(--color-divider-panel-bg)]",

  /** Detail table row */
  detailTableRow: "flex justify-between items-center px-4 py-3",

  /** Detail table row border (not last) */
  detailTableRowBorder: "border-b border-[var(--color-divider-table)]",
} as const;

// ─── Text Presets ───

export const textPreset = {
  /** Section heading: "INTRO", "EXPERIENCE" */
  sectionHeading:
    "text-[14px] font-bold text-[var(--color-heading)] font-['DM_Mono'] uppercase tracking-widest",

  /** Sub-section heading (smaller) */
  subSectionHeading:
    "text-[11px] font-bold text-[var(--color-heading)] font-['DM_Mono'] uppercase tracking-widest",

  /** Page title */
  pageTitle: "text-2xl font-semibold tracking-tight text-foreground",

  /** Subtitle / role */
  subtitle: "text-muted-foreground text-base",

  /** Body paragraph */
  body: "text-muted-foreground leading-[1.7] text-base",

  /** Small body paragraph */
  bodySmall:
    "text-muted-foreground text-[15px] leading-relaxed break-words whitespace-normal",

  /** Link with underline */
  link: "text-[13px] font-medium flex items-center gap-1.5 border-b border-foreground pb-0.5 hover:opacity-70 transition-opacity w-fit text-foreground",

  /** Year/prefix in experience list */
  yearPrefix: "text-[var(--color-icon)]",

  /** Experience role text */
  roleText:
    "text-[var(--color-icon)] group-hover:text-foreground transition-colors",

  /** Footer text */
  footerText: "text-xs text-[var(--color-icon)]",

  /** Action button label */
  actionLabel: "text-foreground font-medium text-sm",

  /** Action button icon */
  actionIcon: "text-[var(--color-icon)] group-hover:text-foreground",

  /** Micro text (dino game status) */
  micro: "text-[11px] font-bold font-['DM_Mono'] uppercase tracking-widest",

  /** Detail row label (project details) */
  detailLabel: "text-sm font-medium",
} as const;

// ─── Interactive Presets ───

export const interactivePreset = {
  /** Experience row — clickable with hover */
  experienceRow:
    "rounded-lg transition-colors hover:bg-black/[0.03] dark:hover:bg-white/[0.05] -mx-3 px-3",

  /** Experience expand button */
  experienceButton:
    "w-full flex justify-between items-center py-2.5 text-base group",

  /** Social link icon */
  socialLink: "hover:opacity-70 transition-opacity",

  /** Cursor follow label */
  cursorLabel:
    "bg-foreground text-background px-3 py-1.5 rounded-full text-[13px] font-medium shadow-2xl flex items-center gap-1.5",

  /** Stack tool icon */
  stackIcon: "w-8 h-8 flex items-center justify-center cursor-pointer",
} as const;

// ─── Page Template Presets ───
// Complete page-level class patterns.

export const pagePreset = {
  /** Full page wrapper with font, colors, selection */
  wrapper: cn(
    "min-h-screen flex justify-center font-['Inter'] transition-colors duration-700",
    "bg-background text-foreground",
    "selection:bg-foreground selection:text-background",
  ),

  /** Content column with dashed borders */
  column: cn(
    "w-full max-w-[640px] custom-dashed-x relative min-h-screen flex flex-col",
    "font-['Inter'] transition-colors duration-700",
    "bg-background",
  ),
} as const;
