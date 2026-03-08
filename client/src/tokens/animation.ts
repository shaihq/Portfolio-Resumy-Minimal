/**
 * Design System — Animation Tokens (Single Source of Truth)
 *
 * ALL Framer Motion variants and transition presets MUST come from here.
 * Never duplicate containerVariants/itemVariants in page components.
 *
 * Usage:
 *   import { motion as m } from "@/tokens/animation";
 *   <motion.div variants={m.container} initial="hidden" animate="visible">
 *     <motion.div variants={m.item}>...</motion.div>
 *   </motion.div>
 */

import type { Variants, Transition } from "framer-motion";

// ─── Easing Curves ───

export const easing = {
  /** Default smooth easing — used for page transitions */
  smooth: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number],
  /** Snappy easing — used for accordions and quick interactions */
  snappy: [0.23, 1, 0.32, 1] as [number, number, number, number],
  /** Theme panel slide — custom cubic bezier */
  panel: [0.32, 0.72, 0, 1] as [number, number, number, number],
} as const;

// ─── Transition Presets ───

export const transition = {
  /** Default item transition */
  default: {
    duration: 0.8,
    ease: easing.smooth,
  } satisfies Transition,

  /** Quick transition for interactive elements */
  quick: {
    duration: 0.3,
    ease: easing.snappy,
  } satisfies Transition,

  /** Spring transition for bouncy interactions */
  spring: {
    type: "spring" as const,
    stiffness: 400,
    damping: 10,
  } satisfies Transition,

  /** Accordion expand/collapse */
  accordion: {
    duration: 0.3,
    ease: easing.snappy,
  } satisfies Transition,

  /** Theme panel slide */
  panel: {
    duration: 0.5,
    ease: easing.panel,
  } satisfies Transition,

  /** Color transition (theme switch) */
  colorShift: {
    duration: 0.7,
  } satisfies Transition,

  /** Image hover scale */
  imageHover: {
    duration: 0.5,
  } satisfies Transition,

  /** Character reveal in text animations */
  charReveal: {
    duration: 0.3,
  } satisfies Transition,
} as const;

// ─── Stagger Presets ───

export const stagger = {
  /** Default stagger for page sections */
  default: {
    staggerChildren: 0.1,
    delayChildren: 0.1,
  },
  /** Fast stagger for list items */
  fast: {
    staggerChildren: 0.05,
    delayChildren: 0.05,
  },
  /** Character-by-character text reveal */
  charReveal: {
    staggerChildren: 0.015,
  },
} as const;

// ─── Variant Presets ───

/** Page-level container — stagger children on enter */
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: stagger.default,
  },
};

/** Standard item reveal — blur-up fade-in */
export const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    filter: "blur(10px)",
    y: 10,
  },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: transition.default,
  },
};

/** Accordion content expand/collapse */
export const accordionVariants: Variants = {
  collapsed: {
    height: 0,
    opacity: 0,
  },
  expanded: {
    height: "auto",
    opacity: 1,
  },
};

/** Character reveal for text animations */
export const charVariants: Variants = {
  hidden: {
    opacity: 0,
    filter: "blur(10px)",
  },
  show: {
    opacity: 1,
    filter: "blur(0px)",
  },
};

/** Word container for text reveal */
export const wordContainerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: stagger.charReveal,
  },
};

/** Icon hover bounce — use with whileHover="hover" initial="rest" */
export const iconBounceVariants = (rotation: number = 15): Variants => ({
  rest: { scale: 1, rotate: 0 },
  hover: { scale: 1.3, rotate: rotation },
});

/** Image scale on hover */
export const imageHoverScale = {
  className: "transition-transform duration-500 group-hover:scale-110",
} as const;

/** Icon hover in navbar */
export const navIconHover = {
  className:
    "transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110",
} as const;

/** Story card hover */
export const storyCardHover = {
  whileHover: { rotate: 0, scale: 1.1, zIndex: 50 },
} as const;

/** Grayscale icon hover */
export const grayscaleHover = {
  className: "grayscale hover:grayscale-0 transition-all duration-300",
} as const;

// ─── Bundled Exports ───
// Convenience object for importing all motion presets at once.

export const motionPresets = {
  container: containerVariants,
  item: itemVariants,
  accordion: accordionVariants,
  char: charVariants,
  wordContainer: wordContainerVariants,
  iconBounce: iconBounceVariants,
  easing,
  transition,
  stagger,
} as const;
