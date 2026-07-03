/**
 * Blinders page transition
 *
 * Phase sequence:
 *  idle → closing → loading → fading → opening → idle
 *
 * The loader fades out completely (fading phase) before the panels
 * sweep open, so there is no overlap between the two.
 */

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { BlindersContext } from "@/hooks/use-blinders-transition";

// ─── Timing (ms) ─────────────────────────────────────────────────────────────

const CLOSE_MS    = 420;   // panels sweep to centre
const PROGRESS_MS = 1200;  // progress bar fills
const FADE_MS     = 260;   // loader fades out — blinders don't move yet
const OPEN_MS     = 500;   // panels sweep open

// Navigate fires halfway through progress so the new page is ready to show
const NAV_DELAY_MS = PROGRESS_MS * 0.45;

// ─── Easing ──────────────────────────────────────────────────────────────────

const EASE_CLOSE = [0.76, 0, 0.24, 1] as const;
const EASE_OPEN  = [0.22, 1, 0.36, 1] as const;

// ─── Types ───────────────────────────────────────────────────────────────────

type Phase = "idle" | "closing" | "loading" | "fading" | "opening";

// ─── Seam loader ─────────────────────────────────────────────────────────────

function SeamLoader({ phase }: { phase: Phase }) {
  // Visible only during "loading". AnimatePresence handles the fade-out
  // when phase switches to "fading", giving a clean exit before panels move.
  const show = phase === "loading";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="seam-loader"
          className="flex flex-col items-center gap-3 select-none"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: FADE_MS / 1000, ease: "easeInOut" }}
        >
          {/* Label */}
          <p className="text-[9px] font-mono tracking-[0.35em] uppercase text-foreground/30">
            loading
          </p>

          {/* Progress track */}
          <div
            className="relative w-56 rounded-full overflow-hidden"
            style={{ height: 4, background: "color-mix(in srgb, currentColor 7%, transparent)" }}
          >
            {/* Gradient fill */}
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, color-mix(in srgb, currentColor 30%, transparent) 0%, currentColor 100%)",
              }}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{
                duration: PROGRESS_MS / 1000,
                ease: [0.33, 1, 0.68, 1], // cubic ease-out — fast start, smooth finish
              }}
            />

            {/* Leading-edge glow dot */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 rounded-full"
              style={{
                width: 6,
                height: 6,
                background: "currentColor",
                boxShadow: "0 0 6px 2px color-mix(in srgb, currentColor 60%, transparent)",
                translateX: "-50%",
              }}
              initial={{ left: "0%" }}
              animate={{ left: "100%" }}
              transition={{
                duration: PROGRESS_MS / 1000,
                ease: [0.33, 1, 0.68, 1],
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function BlindersProvider({ children }: { children: React.ReactNode }) {
  const [, navigate]      = useLocation();
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

    // 1 — sweep panels to centre
    setPhase("closing");

    const push = (fn: () => void, delay: number) => {
      const id = setTimeout(fn, delay);
      timers.current.push(id);
      return id;
    };

    push(() => {
      // 2 — panels closed → start filling progress
      setPhase("loading");

      // navigate midway so new page is painted behind panels before they open
      push(() => navigate(path), NAV_DELAY_MS);

      push(() => {
        // 3 — progress done → fade the loader out (panels stay put)
        setPhase("fading");

        push(() => {
          // 4 — loader gone → sweep panels open
          setPhase("opening");

          push(() => {
            // 5 — done
            setPhase("idle");
            inFlight.current = false;
          }, OPEN_MS + 60);
        }, FADE_MS);
      }, PROGRESS_MS);
    }, CLOSE_MS + 30);
  };

  // Panels are at centre during closing, loading, and fading.
  // They are off-screen in idle and opening.
  const closed  = phase === "closing" || phase === "loading" || phase === "fading";
  const topY    = closed ? "0%"    : "-100%";
  const bottomY = closed ? "0%"    : "100%";

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

        {/* Loader — centred at the seam */}
        <div
          className="absolute inset-x-0 flex justify-center"
          style={{ top: "50%", transform: "translateY(-50%)" }}
        >
          <SeamLoader phase={phase} />
        </div>
      </div>
    </BlindersContext.Provider>
  );
}
