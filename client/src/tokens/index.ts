/**
 * Design System — Token Index (Single Source of Truth)
 *
 * Central re-export of all design tokens.
 * Import from here for convenience:
 *
 *   import { fontClass, layout, motionPresets, cardPreset } from "@/tokens";
 */

// Colors
export { semanticColors, colors, colorClasses } from "./colors";

// Typography
export {
  fontFamily,
  fontWeight,
  typeScale,
  fontClass,
  bodyFontStyle,
} from "./typography";

// Spacing & Layout
export {
  spacing,
  container,
  layout,
  sectionGap,
  componentLayout,
} from "./spacing";

// Animation
export {
  easing,
  transition,
  stagger,
  containerVariants,
  itemVariants,
  accordionVariants,
  charVariants,
  wordContainerVariants,
  iconBounceVariants,
  imageHoverScale,
  navIconHover,
  storyCardHover,
  grayscaleHover,
  motionPresets,
} from "./animation";

// Component Presets
export {
  navPreset,
  cardPreset,
  textPreset,
  interactivePreset,
  pagePreset,
} from "./components";
