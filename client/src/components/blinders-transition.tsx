/**
 * Blinders page transition — two panels (top + bottom half) slide in from the
 * edges and meet in the centre. A shuffle-text loader + progress bar appear at
 * the seam between them, then the panels split apart to reveal the new page.
 */

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { BlindersContext } from "@/hooks/use-blinders-transition";

// ─── Timing (ms) ─────────────────────────────────────────────────────────────

const CLOSE_MS  = 500;   // panels sweep to centre
const HOLD_MS   = 900;   // loader stays visible (navigate happens here)
const OPEN_MS   = 520;   // panels sweep back out

// ─── Easing ──────────────────────────────────────────────────────────────────

const EASE_CLOSE = [0.76, 0, 0.24, 1] as const;
const EASE_OPEN  = [0.22, 1, 0.36, 1] as const;

// ─── Shuffle-text ────────────────────────────────────────────────────────────

const POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%·—∙◦";
const WORDS = ["LOADING", "CRAFTING", "PREPARING", "BUILDING", "RENDERING"];

function randomChar() {
  return POOL[Math.floor(Math.random() * POOL.length)];
}

function ShuffleWord({ word, run }: { word: string; run: boolean }) {
  const [chars, setChars] = useState<string[]>(() => word.split("").map(randomChar));
  const rafRef   = useRef(0);
  const startRef = useRef(0);

  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    if (!run) { setChars(word.split("").map(randomChar)); return; }

    startRef.current = performance.now();
    const RESOLVE_MS = 480; // time for all characters to settle

    const tick = (now: number) => {
      const t = Math.min((now - startRef.current) / RESOLVE_MS, 1);
      setChars(
        word.split("").map((ch, i) => {
          const threshold = i / word.length;
          return t >= threshold ? ch : randomChar();
        }),
      );
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [run, word]);

  return (
    <span className="font-mono tracking-[0.22em]">
      {chars.map((c, i) => (
        <span
          key={i}
          className={c === word[i] ? "text-foreground" : "text-foreground/30"}
        >
          {c}
        </span>
      ))}
    </span>
  );
}

function LoaderContent({ phase }: { phase: "closing" | "opening" | "idle" }) {
  const active = phase !== "idle";

  // Cycle through words while active
  const [wordIdx, setWordIdx] = useState(0);
  const [runShuffle, setRunShuffle] = useState(false);
  const cycleRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!active) {
      setWordIdx(0);
      setRunShuffle(false);
      if (cycleRef.current) clearInterval(cycleRef.current);
      return;
    }
    setRunShuffle(true);
    // Cycle to a new word every 420 ms
    cycleRef.current = setInterval(() => {
      setWordIdx(i => (i + 1) % WORDS.length);
      setRunShuffle(false);
      // Tiny delay so ShuffleWord re-mounts scrambled before resolving
      setTimeout(() => setRunShuffle(true), 30);
    }, 420);
    return () => { if (cycleRef.current) clearInterval(cycleRef.current); };
  }, [active]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="loader"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="flex flex-col items-center gap-3 select-none"
        >
          {/* Shuffle text */}
          <div className="flex items-center gap-2.5">
            <ShuffleWord word={WORDS[wordIdx]} run={runShuffle} />
            {/* Animated dots */}
            <span className="flex gap-[3px] items-center">
              {[0, 1, 2].map(i => (
                <motion.span
                  key={i}
                  className="w-[3px] h-[3px] rounded-full bg-foreground/40 block"
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }}
                />
              ))}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-48 h-[2px] bg-foreground/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-foreground rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: active ? "100%" : "0%" }}
              transition={{
                duration: (CLOSE_MS + HOLD_MS + OPEN_MS) / 1000,
                ease: "linear",
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Types ───────────────────────────────────────────────────────────────────

type Phase = "idle" | "closing" | "opening";

// ─── Provider ────────────────────────────────────────────────────────────────

export function BlindersProvider({ children }: { children: React.ReactNode }) {
  const [, navigate] = useLocation();
  const [phase, setPhase] = useState<Phase>("idle");
  const inFlight = useRef(false);
  const timers   = useRef<ReturnType<typeof setTimeout>[]>([]);

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

    // 2 — panels closed + loader visible → navigate
    const t1 = setTimeout(() => {
      navigate(path);

      // 3 — hold briefly so loader is visible on the new page too
      const t2 = setTimeout(() => {
        setPhase("opening");

        // 4 — panels sweep open → reset
        const t3 = setTimeout(() => {
          setPhase("idle");
          inFlight.current = false;
        }, OPEN_MS + 60);
        timers.current.push(t3);
      }, HOLD_MS);
      timers.current.push(t2);
    }, CLOSE_MS + 40);
    timers.current.push(t1);
  };

  const topY    = phase === "closing" ? "0%"   : "-100%";
  const bottomY = phase === "closing" ? "0%"   : "100%";

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
        {/* ── Top panel ── */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-1/2 bg-background"
          initial={{ y: "-100%" }}
          animate={{ y: topY }}
          transition={panelTransition}
        />

        {/* ── Bottom panel ── */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1/2 bg-background"
          initial={{ y: "100%" }}
          animate={{ y: bottomY }}
          transition={panelTransition}
        />

        {/* ── Loader — sits at the seam between both panels ── */}
        <div
          className="absolute left-0 right-0 flex flex-col items-center"
          style={{ top: "50%", transform: "translateY(-50%)" }}
        >
          <LoaderContent phase={phase} />
        </div>
      </div>
    </BlindersContext.Provider>
  );
}
