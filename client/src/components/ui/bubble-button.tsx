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

function getBarColor(pct: number): string {
  if (pct > 0.5) return "#22c55e";
  if (pct > 0.2) return "#f59e0b";
  return "#ef4444";
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
    const barColor = getBarColor(pct);
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
            "group relative inline-flex cursor-pointer select-none items-center gap-2 overflow-hidden rounded-full border h-9 px-4 text-sm font-medium transition-all",
            open
              ? "border-foreground/20 bg-foreground text-background dark:bg-foreground dark:text-background"
              : "border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
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
              className="absolute right-0 top-[calc(100%+8px)] w-[268px] rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#2A2520] shadow-xl shadow-black/[0.08] p-4 z-50"
            >
              {/* Balance numbers */}
              <div className="flex items-baseline gap-1.5 mb-3">
                <span className="text-[32px] font-bold leading-none text-foreground tabular-nums">
                  {remaining}
                </span>
                <span className="text-[13px] text-foreground/35 font-medium">/ {limit} credits left</span>
              </div>

              {/* Single fill bar */}
              <div className="relative h-[6px] w-full rounded-full bg-black/[0.07] dark:bg-white/[0.08] overflow-hidden mb-1.5">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${pct * 100}%` }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
                  style={{ backgroundColor: barColor }}
                />
              </div>

              {/* Sub-labels */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-[11px] text-foreground/35">
                  {consumed} used · resets monthly
                </span>
                <span
                  className="text-[11px] font-semibold"
                  style={{ color: status.color }}
                >
                  {status.text}
                </span>
              </div>

              {/* Divider */}
              <div className="h-px bg-black/[0.06] dark:bg-white/[0.06] mb-3" />

              {/* Usage hint */}
              <p className="text-[12px] text-foreground/40 leading-relaxed mb-3">
                Credits power mock interviews and scout chats.
              </p>

              {/* CTA */}
              <button className="w-full flex items-center justify-center gap-2 h-9 rounded-full bg-[#1A1A1A] dark:bg-white text-white dark:text-black text-[13px] font-medium transition-opacity hover:opacity-80">
                <Sparkles className="w-3.5 h-3.5" />
                Get more credits
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
