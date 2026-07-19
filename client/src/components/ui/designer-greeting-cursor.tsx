"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";

const GREETINGS = ["Hello!", "नमस्ते", "Bonjour", "こんにちは"];
const TYPE_MS   = 68;
const DELETE_MS = 36;
const HOLD_MS   = 860;
const BLUR_MS   = 170;

// Resets on every page load / refresh — persists across template switches
let hasShownGreeting = false;

export function DesignerGreetingCursor() {
  const [pos, setPos]             = useState({ x: -999, y: -999 });
  const [displayText, setDisplay] = useState("");
  const [blurring, setBlurring]   = useState(false);
  const [visible, setVisible]     = useState(false); // true once first mousemove
  const [done, setDone]           = useState(hasShownGreeting);

  // All sequencing lives in refs to avoid stale-closure issues
  const charRef    = useRef(0);
  const wordRef    = useRef(0);
  const phaseRef   = useRef<"typing" | "holding" | "deleting" | "blurring">("typing");
  const timerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (hasShownGreeting) return;

    document.body.style.cursor = "none";

    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };
    window.addEventListener("mousemove", onMove);

    const schedule = (fn: () => void, ms: number) => {
      timerRef.current = setTimeout(fn, ms);
    };

    const tick = () => {
      const word = GREETINGS[wordRef.current];

      if (phaseRef.current === "typing") {
        if (charRef.current < word.length) {
          charRef.current++;
          setDisplay(word.slice(0, charRef.current));
          schedule(tick, TYPE_MS);
        } else {
          phaseRef.current = "holding";
          schedule(tick, HOLD_MS);
        }

      } else if (phaseRef.current === "holding") {
        if (wordRef.current === GREETINGS.length - 1) {
          // Last word — fade out and finish
          schedule(() => {
            hasShownGreeting = true;
            document.body.style.cursor = "";
            setDone(true);
          }, 420);
        } else {
          phaseRef.current = "deleting";
          schedule(tick, DELETE_MS);
        }

      } else if (phaseRef.current === "deleting") {
        if (charRef.current > 0) {
          charRef.current--;
          setDisplay(word.slice(0, charRef.current));
          schedule(tick, DELETE_MS);
        } else {
          // Blur morph — briefly blur, swap word, unblur
          phaseRef.current = "blurring";
          setBlurring(true);
          schedule(() => {
            wordRef.current++;
            charRef.current = 0;
            setDisplay("");
            setBlurring(false);
            phaseRef.current = "typing";
            schedule(tick, 90);
          }, BLUR_MS);
        }
      }
    };

    // Slight delay so the pill appears naturally on first mouse move
    schedule(tick, 280);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      window.removeEventListener("mousemove", onMove);
      document.body.style.cursor = "";
    };
  }, []);

  if (done) return null;

  return createPortal(
    <div className="fixed inset-0 pointer-events-none z-[99999]">
      <AnimatePresence>
        {visible && (
          <motion.div
            key="greeting-badge"
            initial={{ opacity: 0, scale: 0.8, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, filter: "blur(8px)" }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="absolute pointer-events-none"
            style={{ left: pos.x + 20, top: pos.y + 16 }}
          >
            {/* Glass pill — layout-animated so it morphs width smoothly */}
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 480, damping: 38, mass: 0.7 }}
              className="flex items-center backdrop-blur-xl rounded-full px-[18px] py-[10px] overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.78)",
                border: "1px solid rgba(255,255,255,0.55)",
                boxShadow:
                  "0 6px 32px rgba(0,0,0,0.14), 0 1px 0 rgba(255,255,255,0.7) inset, 0 -1px 0 rgba(0,0,0,0.04) inset",
              }}
            >
              {/* Text + cursor — blur applied only during word-switch morph */}
              <motion.span
                animate={{
                  filter: blurring ? "blur(7px)" : "blur(0px)",
                  opacity: blurring ? 0.35 : 1,
                }}
                transition={{ duration: 0.16, ease: "easeInOut" }}
                className="flex items-center"
              >
                <span
                  className="text-[14px] font-semibold tracking-[-0.01em] text-[#0D0D0D] whitespace-nowrap select-none"
                  style={{ fontFamily: "Inter, sans-serif", minWidth: "2px" }}
                >
                  {displayText}
                </span>

                {/* Blinking cursor bar */}
                <motion.span
                  animate={{ opacity: [1, 1, 0, 0] }}
                  transition={{
                    duration: 0.9,
                    repeat: Infinity,
                    ease: "linear",
                    times: [0, 0.45, 0.5, 0.95],
                  }}
                  className="inline-block ml-[2px] align-middle rounded-[1px]"
                  style={{
                    width: "1.5px",
                    height: "15px",
                    background: "rgba(13,13,13,0.75)",
                    verticalAlign: "middle",
                    position: "relative",
                    top: "-0.5px",
                  }}
                />
              </motion.span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>,
    document.body
  );
}
