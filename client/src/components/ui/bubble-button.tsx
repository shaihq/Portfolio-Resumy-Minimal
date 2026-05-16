import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

const keyframes = `
  @keyframes bubble-rise {
    0%   { transform: translateY(0) scale(1); opacity: 0.4; }
    100% { transform: translateY(-100px) scale(0); opacity: 0; }
  }
`;

const BUBBLES = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  width:  Math.random() * 12 + 4,
  height: Math.random() * 12 + 4,
  left:   Math.random() * 95,
  duration: 2 + Math.random() * 3,
  delay:    Math.random() * 4,
}));

const Bubbles = () => (
  <>
    <style>{keyframes}</style>
    <div className="absolute inset-0 z-[5] overflow-hidden rounded-full pointer-events-none">
      {BUBBLES.map((b) => (
        <span
          key={b.id}
          className="absolute bottom-[-10px] block rounded-full bg-foreground/20 [animation-play-state:paused] group-hover:[animation-play-state:running]"
          style={{
            width: `${b.width}px`,
            height: `${b.height}px`,
            left: `${b.left}%`,
            animation: `bubble-rise ${b.duration}s ${b.delay}s linear infinite`,
          }}
        />
      ))}
    </div>
  </>
);

export interface UsageBadgeProps {
  icon: React.ReactNode;
  planName: string;
  usage: number;
  limit: number;
  tooltipContent?: React.ReactNode;
  className?: string;
}

const SEGMENT_COUNT = 10;

function hexToRgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

function lerpColor(a: string, b: string, t: number): string {
  const [r1, g1, b1] = hexToRgb(a);
  const [r2, g2, b2] = hexToRgb(b);
  return `rgb(${Math.round(r1 + (r2 - r1) * t)},${Math.round(g1 + (g2 - g1) * t)},${Math.round(b1 + (b2 - b1) * t)})`;
}

function getGradientEnds(pct: number): [string, string] {
  if (pct > 0.5) return ["#16a34a", "#86efac"];
  if (pct > 0.2) return ["#ea580c", "#fcd34d"];
  return ["#dc2626", "#f97316"];
}

function segmentColor(pct: number, index: number, total: number): string {
  const [start, end] = getGradientEnds(pct);
  const t = total > 1 ? index / (total - 1) : 0;
  return lerpColor(start, end, t);
}

function getStatusLabel(pct: number): { text: string; color: string } {
  if (pct > 0.5) return { text: "Healthy", color: "#22c55e" };
  if (pct > 0.2) return { text: "Running low", color: "#f59e0b" };
  return { text: "Almost out", color: "#ef4444" };
}

const UsageBadge = React.forwardRef<HTMLDivElement, UsageBadgeProps>(
  ({ icon, planName, usage, limit, className }, ref) => {
    const [open, setOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    const remaining = usage;
    const consumed = limit - usage;
    const pct = limit > 0 ? remaining / limit : 0;
    const filledSegments = Math.round(pct * SEGMENT_COUNT);
    const status = getStatusLabel(pct);

    React.useEffect(() => {
      if (!open) return;
      const handler = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    return (
      <div ref={containerRef} className="relative">
        {/* Badge trigger */}
        <div
          ref={ref}
          role="button"
          tabIndex={0}
          onClick={() => setOpen((o) => !o)}
          onKeyDown={(e) => e.key === "Enter" && setOpen((o) => !o)}
          className={cn(
            "group relative inline-flex cursor-pointer select-none items-center gap-2 overflow-hidden rounded-full h-9 px-4 text-sm font-medium text-foreground transition-all hover:bg-accent hover:text-accent-foreground",
            open
              ? "border-2 border-input bg-accent text-accent-foreground"
              : "border border-input bg-background",
            className
          )}
        >
          <Bubbles />
          <div className="relative z-10 flex-shrink-0">{icon}</div>
          <div className="relative z-10 whitespace-nowrap">
            <span>{planName}:</span>
            <span className="ml-1.5 font-semibold">{usage}</span>
            <span className="ml-0.5 opacity-50 text-xs">/ {limit}</span>
          </div>
        </div>

        {/* Dropdown */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.97 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-0 top-[calc(100%+8px)] w-[268px] rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#2A2520] shadow-xl shadow-black/[0.1] p-4 z-50"
            >
              {/* Balance numbers */}
              <div className="flex items-baseline gap-1.5 mb-3">
                <span className="text-[32px] font-bold leading-none text-foreground tabular-nums">
                  {remaining}
                </span>
                <span className="text-[13px] text-foreground/50 font-medium">/ {limit} credits left</span>
              </div>

              {/* Staggered segmented bar */}
              <div className="flex gap-[3px] mb-1.5">
                {Array.from({ length: SEGMENT_COUNT }, (_, i) => {
                  const filled = i < filledSegments;
                  return (
                    <div key={i} className="flex-1 h-[6px] rounded-full overflow-hidden bg-black/[0.07] dark:bg-white/[0.08]">
                      <motion.div
                        className="h-full rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: filled ? "100%" : "0%" }}
                        transition={{
                          delay: filled ? i * 0.04 : 0,
                          duration: 0.25,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        style={{ backgroundColor: segmentColor(pct, i, filledSegments) }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Divider */}
              <div className="h-px bg-black/[0.06] dark:bg-white/[0.06] mb-3" />

              {/* Usage hint */}
              <p className="text-[12px] text-foreground/55 leading-relaxed mb-3">
                Credits power mock interviews and scout chats.
              </p>

              {/* CTA */}
              <style>{`
                .credits-cta {
                  position: relative;
                  overflow: hidden;
                  background: linear-gradient(170deg, #edc84a 0%, #c8920c 42%, #7c5200 100%);
                  box-shadow:
                    inset 0 0.3rem 0.9rem rgba(255,220,80,0.35),
                    inset 0 -0.1rem 0.3rem rgba(0,0,0,0.55),
                    inset 0 -0.35rem 0.8rem rgba(200,146,12,0.45),
                    0 0.4rem 1rem rgba(0,0,0,0.28),
                    0 0.1rem 0.25rem rgba(0,0,0,0.4);
                  transition: all 0.2s ease;
                }
                .credits-cta::before {
                  content: "";
                  position: absolute;
                  left: -15%; right: -15%;
                  bottom: 20%; top: -120%;
                  border-radius: 50%;
                  background: rgba(251,191,36,0.1);
                  pointer-events: none;
                  transition: transform 0.3s ease;
                }
                .credits-cta::after {
                  content: "";
                  position: absolute;
                  left: 6%; right: 6%;
                  top: 0; bottom: 48%;
                  border-radius: 100px 100px 0 0;
                  box-shadow: inset 0 10px 8px -10px rgba(251,191,36,0.55);
                  background: linear-gradient(180deg, rgba(251,191,36,0.2) 0%, rgba(0,0,0,0) 100%);
                  pointer-events: none;
                  transition: all 0.3s ease;
                }
                .credits-cta:hover {
                  box-shadow:
                    inset 0 0.3rem 0.6rem rgba(255,220,80,0.5),
                    inset 0 -0.1rem 0.3rem rgba(0,0,0,0.55),
                    inset 0 -0.35rem 0.9rem rgba(200,146,12,0.65),
                    0 0.6rem 1.4rem rgba(0,0,0,0.32),
                    0 0.1rem 0.3rem rgba(0,0,0,0.4);
                }
                .credits-cta:hover::before {
                  transform: translateY(-5%);
                }
                .credits-cta:hover::after {
                  opacity: 0.45;
                  transform: translateY(5%);
                }
                .credits-cta:hover .credits-cta-inner {
                  transform: translateY(-2px);
                }
                .credits-cta:active {
                  transform: translateY(2px);
                  box-shadow:
                    inset 0 0.3rem 0.5rem rgba(251,191,36,0.5),
                    inset 0 -0.1rem 0.3rem rgba(0,0,0,0.7),
                    inset 0 0.3rem 0.8rem rgba(0,0,0,0.25),
                    0 0.15rem 0.4rem rgba(0,0,0,0.2);
                }
                .credits-cta-inner {
                  display: flex;
                  align-items: center;
                  gap: 6px;
                  position: relative;
                  z-index: 1;
                  transition: transform 0.2s ease;
                }
              `}</style>
              <button className="credits-cta w-full flex items-center justify-center h-9 rounded-full text-[13px] font-semibold text-amber-50">
                <span className="credits-cta-inner">
                  <Sparkles className="w-3.5 h-3.5" />
                  Get more credits
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

UsageBadge.displayName = "UsageBadge";

export { UsageBadge };
