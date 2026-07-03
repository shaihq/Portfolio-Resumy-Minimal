/**
 * Blinders page transition — two panels (top + bottom half) slide in from the
 * edges and meet in the centre like a book binding closing, then split apart
 * to reveal the new page.
 *
 * Timing is driven by setTimeout rather than onAnimationComplete to avoid
 * Framer Motion edge cases. Panels are always mounted; visibility is controlled
 * purely by the y transform so there is no AnimatePresence conflict.
 */

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { BlindersContext } from "@/hooks/use-blinders-transition";

// ─── Timing ──────────────────────────────────────────────────────────────────

const CLOSE_MS = 460; // how long the panels take to close
const OPEN_MS  = 500; // how long the panels take to open

// ─── Easing ──────────────────────────────────────────────────────────────────

const EASE_CLOSE = [0.76, 0, 0.24, 1] as const;
const EASE_OPEN  = [0.25, 1, 0.5,  1] as const;

// ─── Types ───────────────────────────────────────────────────────────────────

type Phase = "idle" | "closing" | "opening";

// ─── Provider ────────────────────────────────────────────────────────────────

export function BlindersProvider({ children }: { children: React.ReactNode }) {
  const [, navigate] = useLocation();
  const [phase, setPhase]   = useState<Phase>("idle");
  const inFlight            = useRef(false);
  const timers              = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => () => clearTimers(), []);

  const transitionTo = (path: string) => {
    if (inFlight.current) return;
    inFlight.current = true;
    clearTimers();

    // Step 1 — panels sweep to centre.
    setPhase("closing");

    // Step 2 — once closed: navigate + open panels.
    const t1 = setTimeout(() => {
      navigate(path);
      setPhase("opening");

      // Step 3 — once open: reset to idle.
      const t2 = setTimeout(() => {
        setPhase("idle");
        inFlight.current = false;
      }, OPEN_MS + 50);

      timers.current.push(t2);
    }, CLOSE_MS + 40);

    timers.current.push(t1);
  };

  // y positions: panels are off-screen in "idle" and "opening", at 0 when "closing".
  const topY    = phase === "closing" ? "0%"   : "-100%";
  const bottomY = phase === "closing" ? "0%"   : "100%";

  const panelTransition =
    phase === "closing"
      ? { duration: CLOSE_MS / 1000, ease: EASE_CLOSE }
      : { duration: OPEN_MS  / 1000, ease: EASE_OPEN  };

  return (
    <BlindersContext.Provider value={{ transitionTo }}>
      {children}

      {/* Always-mounted overlay — pointer-events:none so it never blocks clicks */}
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

        {/* Seam line — visible only when panels are fully closed */}
        <motion.div
          className="absolute left-0 right-0 bg-border"
          style={{ top: "50%", height: 1, translateY: "-50%" }}
          animate={{ opacity: phase === "closing" ? 1 : 0 }}
          transition={{ duration: 0.15, delay: phase === "closing" ? CLOSE_MS / 1000 - 0.1 : 0 }}
        />
      </div>
    </BlindersContext.Provider>
  );
}
