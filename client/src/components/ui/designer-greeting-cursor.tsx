import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";

const GREETINGS = ["Hello!", "नमस्ते", "Bonjour", "こんにちは"];

// Module-level flag — resets on every page load/refresh, persists across template switches
let hasShownGreeting = false;

export function DesignerGreetingCursor() {
  const [pos, setPos] = useState({ x: -999, y: -999 });
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(hasShownGreeting);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (hasShownGreeting) return;

    // Hide system cursor
    document.body.style.cursor = "none";

    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);

    // Schedule each greeting + final teardown
    const timers: ReturnType<typeof setTimeout>[] = [];
    GREETINGS.forEach((_, i) => {
      timers.push(setTimeout(() => setIndex(i), i * 720));
    });
    timers.push(
      setTimeout(() => {
        hasShownGreeting = true;
        document.body.style.cursor = "";
        setDone(true);
      }, GREETINGS.length * 720 + 380)
    );

    const cleanup = () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("mousemove", onMove);
      document.body.style.cursor = "";
    };
    cleanupRef.current = cleanup;
    return cleanup;
  }, []);

  if (done) return null;

  // Don't render until we have a real mouse position
  const hasPos = pos.x > -900;

  return createPortal(
    <div className="fixed inset-0 pointer-events-none z-[99999]">
      <AnimatePresence mode="wait">
        {hasPos && (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.72, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: -6 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute pointer-events-none"
            style={{ left: pos.x + 18, top: pos.y + 14 }}
          >
            <div className="bg-white rounded-full px-4 py-[9px] shadow-[0_4px_24px_rgba(0,0,0,0.14)] border border-black/[0.06]">
              <span
                className="text-[14px] font-semibold text-[#0F0F0F] whitespace-nowrap"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {GREETINGS[index]}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>,
    document.body
  );
}
