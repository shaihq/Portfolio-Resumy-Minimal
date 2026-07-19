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
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2 C12 2 12.8 7.2 15.5 9.5 C18.2 11.8 23 12 23 12 C23 12 18.2 12.2 15.5 14.5 C12.8 16.8 12 22 12 22 C12 22 11.2 16.8 8.5 14.5 C5.8 12.2 1 12 1 12 C1 12 5.8 11.8 8.5 9.5 C11.2 7.2 12 2 12 2Z" />
    </svg>
  );
}

/**
 * Scroll-driven card stacking:
 * - Card 0 stays fixed at center (front of deck)
 * - Card 1 slides up from below and stacks behind card 0 (during scroll 0→50%)
 * - Card 2 slides up from below and stacks behind card 1 (during scroll 50→100%)
 * - Section height = projects.length × 100vh so there's room to scroll through all stacks
 */
export function DesignerStackedCards({ projects, onProjectClick }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // ── Card 1: slides in during first half ──────────────────────────────────
  const card1Y     = useTransform(scrollYProgress, [0, 0.5],       [900, -30]);
  const card1Scale = useTransform(scrollYProgress, [0.1, 0.5],     [1,   0.96]);
  const card1Opacity = useTransform(scrollYProgress, [0, 0.08],    [0,   1]);

  // ── Card 2: slides in during second half ─────────────────────────────────
  const card2Y     = useTransform(scrollYProgress, [0.5, 1],       [900, -56]);
  const card2Scale = useTransform(scrollYProgress, [0.6, 1],       [1,   0.92]);
  const card2Opacity = useTransform(scrollYProgress, [0.5, 0.58],  [0,   1]);

  const motionStyles = [
    // Card 0 — always at the front, fully visible
    { y: 0 as unknown as number, scale: 1, zIndex: 30, opacity: 1 },
    // Card 1 — arrives first, sits just behind card 0
    { y: card1Y, scale: card1Scale, zIndex: 20, opacity: card1Opacity },
    // Card 2 — arrives last, sits furthest back
    { y: card2Y, scale: card2Scale, zIndex: 10, opacity: card2Opacity },
  ];

  return (
    // Tall container to give scroll room (N × 100vh = 300vh for 3 cards → 200vh of scroll)
    <div ref={containerRef} style={{ height: `${projects.length * 100}vh` }}>
      {/* Sticky viewport — stays visible for the entire scroll range */}
      <div
        className="sticky top-0 overflow-hidden"
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Section label */}
        <div className="flex items-center gap-4 mb-10 w-full max-w-4xl px-8">
          <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#64748B] dark:text-[#64748B]">
            Selected Work
          </span>
          <div className="flex-1 h-px bg-[#E2E8F0] dark:bg-[#1E293B]" />
        </div>

        {/*
          Stack wrapper:
          – height: PEEK_BUFFER (80px) + CARD_HEIGHT (420px) = 500px
          – All cards are absolute, top: PEEK_BUFFER
          – Their y-transform shifts them up/down relative to that baseline
          – z-index: card 0 (30) > card 1 (20) > card 2 (10)
          – Peeking works because cards with negative y show above card 0,
            but card 0's z-index hides overlapping areas below card 0's top
        */}
        <div
          className="relative w-full max-w-4xl mx-auto"
          style={{ height: 500 }}
        >
          {projects.map((cs, i) => (
            <motion.div
              key={cs.slug}
              style={{
                position: "absolute",
                left: 24,
                right: 24,
                top: 80, // peek buffer — cards peek above this into the 80px gap
                y: motionStyles[i].y,
                scale: motionStyles[i].scale,
                zIndex: motionStyles[i].zIndex,
                opacity: motionStyles[i].opacity,
                willChange: "transform",
              }}
            >
              {/* Sparkle decorations */}
              <SparkleIcon
                className={`absolute ${cs.flip ? "bottom-4 left-5" : "top-4 right-5"} w-5 h-5 text-[#94A3B8] dark:text-[#334155] opacity-70`}
              />
              <SparkleIcon
                className={`absolute ${cs.flip ? "top-5 right-6" : "bottom-5 left-6"} w-3 h-3 text-[#CBD5E1] dark:text-[#1E293B] opacity-50`}
              />

              {/* Card */}
              <div
                className={`relative flex flex-col ${
                  cs.flip ? "md:flex-row-reverse" : "md:flex-row"
                } items-center gap-8 md:gap-10 rounded-[24px] border border-dashed border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#0F172A] px-7 py-8 md:px-10 md:py-10 overflow-hidden`}
                style={{
                  boxShadow:
                    i === 0
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
                  <p className="text-[14px] leading-[1.7] text-[#475569] dark:text-[#94A3B8] max-w-[340px] mb-6 font-['Inter']">
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
          ))}
        </div>
      </div>
    </div>
  );
}
