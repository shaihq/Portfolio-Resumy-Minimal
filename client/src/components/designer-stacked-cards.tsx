import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface CaseStudy {
  tags: string[];
  title: string;
  description: string;
  image: string;
  slug: string;
  flip: boolean;
}

interface Props {
  projects: CaseStudy[];
  onProjectClick: (slug: string) => void;
}

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2 C12 2 12.8 7.2 15.5 9.5 C18.2 11.8 23 12 23 12 C23 12 18.2 12.2 15.5 14.5 C12.8 16.8 12 22 12 22 C12 22 11.2 16.8 8.5 14.5 C5.8 12.2 1 12 1 12 C1 12 5.8 11.8 8.5 9.5 C11.2 7.2 12 2 12 2Z" />
    </svg>
  );
}

/**
 * Scroll-stacking cards — reference pattern:
 *
 * Each card lives in its own `position: sticky; top: 0; height: 100vh` section.
 * The outer wrapper is N × 100vh tall, giving (N-1) × 100vh of scroll room.
 * As you scroll, later cards naturally slide on top of earlier ones (DOM order = z-order).
 * Earlier cards scale down slightly as they get covered, creating the deck-of-cards look.
 *
 * One useScroll on the outer wrapper drives all scale transforms:
 *   Card 0 scales 1 → 0.85 during scroll progress 0 → 0.5
 *   Card 1 scales 1 → 0.90 during scroll progress 0.5 → 1
 *   Card 2 stays at 1 (it's the frontmost card)
 */
export function DesignerStackedCards({ projects, onProjectClick }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const n = projects.length; // 3

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // targetScale formula from reference: 1 - (totalCards - index) * 0.05
  // Card 0: 1 - 3*0.05 = 0.85  |  Card 1: 1 - 2*0.05 = 0.90  |  Card 2: stays at 1
  const scale0 = useTransform(scrollYProgress, [0, 0.5], [1, 0.85]);
  const scale1 = useTransform(scrollYProgress, [0.5, 1], [1, 0.90]);
  const scale2 = useTransform(scrollYProgress, [0, 1], [1, 1]); // constant

  const scales = [scale0, scale1, scale2];

  return (
    // Outer wrapper — N × 100vh tall so the browser has room to scroll
    <div ref={containerRef} style={{ height: `${n * 100}vh`, position: "relative" }}>
      {projects.map((cs, i) => (
        /*
         * Each card IS its own sticky section.
         * When you scroll, card i+1 slides up from below and sits on top of card i
         * because it's later in the DOM (higher natural z-order).
         * No absolute positioning, no overflow-hidden clipping.
         */
        <div
          key={cs.slug}
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: i + 1,
          }}
        >
          {/* Section header — only on first card */}
          {i === 0 && (
            <div className="absolute top-8 left-0 right-0 px-6 md:px-0">
              {/* Badge + divider row */}
              <div className="flex items-center gap-3 mb-4">
                {/* Blue diamond sparkle */}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                  <path d="M7 0L8.4 5.6L14 7L8.4 8.4L7 14L5.6 8.4L0 7L5.6 5.6L7 0Z" fill="#3B82F6"/>
                </svg>
                <span className="text-[10.5px] font-bold tracking-[0.22em] uppercase text-[#64748B] dark:text-[#64748B]">
                  Selected Work
                </span>
                <div className="flex-1 h-px bg-[#E2E8F0] dark:bg-[#1E293B]" />
              </div>

              {/* Title */}
              <h2
                className="text-[#0F172A] dark:text-[#F8FAFC]"
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "clamp(22px, 3.2vw, 38px)",
                  fontWeight: 600,
                  lineHeight: 1.15,
                  letterSpacing: "-0.025em",
                }}
              >
                check out some of{" "}
                <span className="text-[#94A3B8] dark:text-[#475569]">my work</span>
              </h2>
            </div>
          )}

          {/* Card — scale from center-top as later cards stack on it */}
          <motion.div
            style={{
              scale: scales[i],
              transformOrigin: "top center",
              // Slight upward offset so cards sit a touch above center (ref: calc(-5vh + index*25px))
              top: `calc(-5vh + ${i * 25}px)`,
              position: "relative",
              width: "100%",
            }}
          >
            {/* Sparkle decorations */}
            <SparkleIcon
              className={`absolute ${cs.flip ? "bottom-4 left-5" : "top-4 right-5"} w-5 h-5 text-[#94A3B8] dark:text-[#334155] opacity-70`}
            />
            <SparkleIcon
              className={`absolute ${cs.flip ? "top-5 right-6" : "bottom-5 left-6"} w-3 h-3 text-[#CBD5E1] dark:text-[#1E293B] opacity-50`}
            />

            {/* Card body */}
            <div
              className={`relative flex flex-col ${
                cs.flip ? "md:flex-row-reverse" : "md:flex-row"
              } items-center gap-8 md:gap-12 rounded-[24px] border border-dashed border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#0F172A] px-7 py-8 md:px-10 md:py-10 overflow-hidden`}
              style={{
                boxShadow:
                  i === n - 1
                    ? "0 8px 48px rgba(15,23,42,0.10)"
                    : "0 4px 24px rgba(15,23,42,0.07)",
              }}
            >
              {/* Text side */}
              <div className="flex-1 flex flex-col items-start min-w-0">
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {cs.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10.5px] font-semibold tracking-[0.13em] uppercase text-[#475569] dark:text-[#94A3B8] bg-[#F1F5F9] dark:bg-[#1E293B] px-2.5 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Headline */}
                <h3
                  className="text-[#0F172A] dark:text-[#F8FAFC] mb-4"
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "clamp(18px, 2.4vw, 26px)",
                    fontWeight: 600,
                    lineHeight: 1.2,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {cs.title}
                </h3>

                {/* Description */}
                <p className="text-[14px] leading-[1.7] text-[#475569] dark:text-[#94A3B8] max-w-[360px] mb-6 font-['Inter']">
                  {cs.description}
                </p>

                {/* CTA */}
                <button
                  onClick={() => onProjectClick(cs.slug)}
                  className="group/cta inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-[#0F172A] dark:text-[#F8FAFC] hover:text-[#1D4ED8] dark:hover:text-[#93C5FD] transition-colors duration-200"
                >
                  Read case study
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
                </button>
              </div>

              {/* Image side */}
              <div className="w-full md:w-[44%] flex-shrink-0">
                <div className="relative rounded-[16px] overflow-hidden bg-[#E2E8F0] dark:bg-[#1E293B] shadow-[0_4px_32px_rgba(15,23,42,0.08)] dark:shadow-[0_4px_32px_rgba(0,0,0,0.4)]">
                  <img
                    src={cs.image}
                    alt={cs.title}
                    className="w-full h-auto object-cover aspect-[4/3] block"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      ))}
    </div>
  );
}
