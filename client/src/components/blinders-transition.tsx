/**
 * Blinders page transition — panels close, a minimal progress line fills at
 * the seam, then panels open once progress is complete.
 */

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { BlindersContext } from "@/hooks/use-blinders-transition";

// ─── Timing (ms) ─────────────────────────────────────────────────────────────

const CLOSE_MS    = 420;   // panels sweep closed
const PROGRESS_MS = 1100;  // progress bar fills (navigate fires halfway through)
const OPEN_MS     = 480;   // panels sweep open — only after progress hits 100%

// ─── Easing ──────────────────────────────────────────────────────────────────

const EASE_CLOSE = [0.76, 0, 0.24, 1] as const;
const EASE_OPEN  = [0.22, 1, 0.36, 1] as const;

// ─── Types ───────────────────────────────────────────────────────────────────

type Phase = "idle" | "closing" | "loading" | "opening";

// ─── Seam loader — sits exactly between the two panels ───────────────────────

function SeamLoader({ phase }: { phase: Phase }) {
  const visible = phase === "loading" || phase === "opening";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="seam-loader"
          className="flex flex-col items-center gap-2.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Label */}
          <motion.p
            className="text-[10px] font-mono tracking-[0.3em] uppercase text-foreground/35 select-none"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3, delay: 0.05 }}
          >
            loading
          </motion.p>

          {/* Progress track */}
          <div className="relative w-52 h-px bg-foreground/10 rounded-full overflow-hidden">
            {/* Fill */}
            {phase === "loading" && (
              <motion.div
                className="absolute inset-y-0 left-0 bg-foreground/50 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{
                  duration: PROGRESS_MS / 1000,
                  ease: [0.4, 0, 0.2, 1],
                }}
              />
            )}
            {/* Stay full while opening */}
            {phase === "opening" && (
              <div className="absolute inset-0 bg-foreground/50 rounded-full" />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function BlindersProvider({ children }: { children: React.ReactNode }) {
  const [, navigate]    = useLocation();
  const [phase, setPhase] = useState<Phase>("idle");
  const inFlight          = useRef(false);
  const timers            = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => () => clearTimers(), []);

  const transitionTo = (path: string) => {
    if (inFlight.current) return;
    inFlight.current = true;
    clearTimers();

    // 1 — panels sweep to centre
    setPhase("closing");

    const t1 = setTimeout(() => {
      // 2 — panels fully closed → start progress bar
      setPhase("loading");

      // 2a — navigate midway through the progress so the page is ready by the time panels open
      const tNav = setTimeout(() => navigate(path), PROGRESS_MS * 0.45);
      timers.current.push(tNav);

      // 3 — progress complete → panels sweep open
      const t2 = setTimeout(() => {
        setPhase("opening");

        // 4 — fully open → idle
        const t3 = setTimeout(() => {
          setPhase("idle");
          inFlight.current = false;
        }, OPEN_MS + 60);
        timers.current.push(t3);
      }, PROGRESS_MS);
      timers.current.push(t2);
    }, CLOSE_MS + 30);
    timers.current.push(t1);
  };

  const topY    = (phase === "closing" || phase === "loading") ? "0%"    : "-100%";
  const bottomY = (phase === "closing" || phase === "loading") ? "0%"    : "100%";

  const panelTransition =
    phase === "closing"
      ? { duration: CLOSE_MS / 1000, ease: EASE_CLOSE }
      : { duration: OPEN_MS  / 1000, ease: EASE_OPEN  };

  return (
    <BlindersContext.Provider value={{ transitionTo }}>
      {children}

      <div
        className="fixed inset-0 z-[500] overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        {/* Top panel */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-1/2 bg-background"
          initial={{ y: "-100%" }}
          animate={{ y: topY }}
          transition={panelTransition}
        />

        {/* Bottom panel */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1/2 bg-background"
          initial={{ y: "100%" }}
          animate={{ y: bottomY }}
          transition={panelTransition}
        />

        {/* Seam loader — centred between both panels */}
        <div
          className="absolute inset-x-0 flex flex-col items-center"
          style={{ top: "50%", transform: "translateY(-50%)" }}
        >
          <SeamLoader phase={phase} />
        </div>
      </div>
    </BlindersContext.Provider>
  );
}
