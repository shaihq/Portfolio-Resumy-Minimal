/**
 * Blinders page transition — two panels (top + bottom half) that slide in from
 * the edges and meet in the centre like a book binding closing, then split back
 * apart to reveal the new page.
 *
 * Usage:
 *   1. Wrap your router tree with <BlindersProvider>
 *   2. import { useBlindersTransition } from "@/hooks/use-blinders-transition"
 *   3. Call transitionTo("/project/slug") instead of navigate()
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { BlindersContext } from "@/hooks/use-blinders-transition";

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase = "idle" | "closing" | "opening";

// ─── Easing ───────────────────────────────────────────────────────────────────

// Sharp ease-in for closing (panels accelerate toward centre)
const EASE_CLOSE: [number, number, number, number] = [0.76, 0, 0.24, 1];
// Gentle ease-out for opening (panels decelerate away from centre)
const EASE_OPEN: [number, number, number, number] = [0.25, 1, 0.5, 1];

const CLOSE_DURATION = 0.46;
const OPEN_DURATION  = 0.52;

// ─── Provider ─────────────────────────────────────────────────────────────────

export function BlindersProvider({ children }: { children: React.ReactNode }) {
  const [location, navigate] = useLocation();
  const [phase, setPhase] = useState<Phase>("idle");
  const pendingPath  = useRef<string>("");
  // Guards to prevent double-firing when both panels complete at the same time.
  const closingFired = useRef(false);
  const openingFired = useRef(false);
  // Ref-based in-flight lock — independent of render cycle so same-tick calls
  // cannot overwrite pendingPath before the state update is committed.
  const inFlight = useRef(false);

  const transitionTo = useCallback((path: string) => {
    if (inFlight.current) return;
    inFlight.current = true;
    pendingPath.current = path;
    closingFired.current = false;
    openingFired.current = false;
    setPhase("closing");
  }, []);

  // If the location changes BEFORE navigation has happened (e.g. browser back
  // during the closing animation), abort so panels don't freeze on screen.
  // We only guard the "closing" phase — "opening" means navigate() already fired
  // and the location is legitimately changing to pendingPath.
  useEffect(() => {
    if (phase === "closing" && location !== pendingPath.current) {
      inFlight.current = false;
      setPhase("idle");
    }
  }, [location, phase]);

  // Called when either panel finishes its "closing" animation.
  const onCloseComplete = () => {
    if (closingFired.current) return;
    closingFired.current = true;
    // Navigate AFTER panels have fully covered the screen.
    navigate(pendingPath.current);
    setPhase("opening");
  };

  // Called when either panel finishes its "opening" animation.
  const onOpenComplete = () => {
    if (openingFired.current) return;
    openingFired.current = true;
    inFlight.current = false;
    setPhase("idle");
  };

  // Each panel's animated `y` target depends on the current phase.
  // "idle"    → off-screen  (no render cost — panels are invisible)
  // "closing" → slide to 0  (cover the screen)
  // "opening" → slide back off-screen
  const topY    = phase === "idle" ? "-100%" : phase === "closing" ? "0%" : "-100%";
  const bottomY = phase === "idle" ? "100%"  : phase === "closing" ? "0%" : "100%";

  const topTransition =
    phase === "closing"
      ? { duration: CLOSE_DURATION, ease: EASE_CLOSE }
      : { duration: OPEN_DURATION,  ease: EASE_OPEN, delay: 0.04 };

  const bottomTransition =
    phase === "closing"
      ? { duration: CLOSE_DURATION, ease: EASE_CLOSE }
      : { duration: OPEN_DURATION,  ease: EASE_OPEN, delay: 0.04 };

  return (
    <BlindersContext.Provider value={{ transitionTo }}>
      {children}

      {/* Overlay — pointer-events:none so it never blocks interaction */}
      <div
        className="fixed inset-0 z-[500] overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        {/* ── Top panel ── */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-1/2 bg-background"
          style={{ originY: 0 }}
          initial={{ y: "-100%" }}
          animate={{ y: topY }}
          transition={topTransition}
          onAnimationComplete={() => {
            if (phase === "closing") onCloseComplete();
            if (phase === "opening") onOpenComplete();
          }}
        />

        {/* ── Bottom panel ── */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1/2 bg-background"
          style={{ originY: 1 }}
          initial={{ y: "100%" }}
          animate={{ y: bottomY }}
          transition={bottomTransition}
          onAnimationComplete={() => {
            if (phase === "closing") onCloseComplete();
            if (phase === "opening") onOpenComplete();
          }}
        />

        {/* ── Seam line — visible only when panels meet at centre ── */}
        <motion.div
          className="absolute left-0 right-0 bg-border"
          style={{ top: "50%", height: 1, translateY: "-50%" }}
          initial={{ opacity: 0 }}
          animate={{
            opacity:
              phase === "closing" ? [0, 0, 1]
              : phase === "opening" ? [1, 0]
              : 0,
          }}
          transition={{
            duration: phase === "closing" ? CLOSE_DURATION : OPEN_DURATION * 0.4,
          }}
        />
      </div>
    </BlindersContext.Provider>
  );
}
