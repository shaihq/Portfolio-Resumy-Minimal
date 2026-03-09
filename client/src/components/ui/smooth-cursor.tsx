"use client";

import { motion, useSpring } from "motion/react";
import { FC, useEffect, useRef, useState } from "react";

interface Position {
  x: number;
  y: number;
}

export interface SmoothCursorProps {
  springConfig?: {
    damping: number;
    stiffness: number;
    mass: number;
    restDelta: number;
  };
}

const CursorDesign: FC<{ isHovering: boolean }> = ({ isHovering }) => {
  return (
    <motion.div
      className="relative flex items-center justify-center rounded-full pointer-events-none z-[9999]"
      animate={{
        width: isHovering ? 48 : 12,
        height: isHovering ? 48 : 12,
        backgroundColor: isHovering ? "rgba(227, 121, 65, 0.15)" : "#E37941",
        border: isHovering ? "1px solid rgba(227, 121, 65, 0.5)" : "0px solid transparent",
      }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
    >
      <motion.div
        className="absolute rounded-full bg-[#E37941]"
        animate={{
          width: isHovering ? 6 : 0,
          height: isHovering ? 6 : 0,
          opacity: isHovering ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      />
    </motion.div>
  );
};

export function SmoothCursor({
  springConfig = {
    damping: 45,
    stiffness: 400,
    mass: 1,
    restDelta: 0.001,
  },
}: SmoothCursorProps) {
  const [isHovering, setIsHovering] = useState(false);
  const lastMousePos = useRef<Position>({ x: 0, y: 0 });

  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);

  useEffect(() => {
    // Add global style to hide normal cursor
    const style = document.createElement("style");
    style.innerHTML = `
      * {
        cursor: none !important;
      }
    `;
    document.head.appendChild(style);

    const smoothMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      // Check if hovering over a clickable element
      const target = e.target as HTMLElement;
      if (target) {
        const isClickable = target.closest('a, button, [class*="cursor-pointer"], input, textarea, select');
        setIsHovering(!!isClickable);
      }
    };

    let rafId: number;
    const throttledMouseMove = (e: MouseEvent) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        smoothMouseMove(e);
        rafId = 0;
      });
    };

    window.addEventListener("mousemove", throttledMouseMove);

    return () => {
      window.removeEventListener("mousemove", throttledMouseMove);
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [cursorX, cursorY]);

  return (
    <motion.div
      style={{
        position: "fixed",
        left: cursorX,
        top: cursorY,
        translateX: "-50%",
        translateY: "-50%",
        zIndex: 9999,
        pointerEvents: "none",
        willChange: "transform",
      }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30,
      }}
    >
      <CursorDesign isHovering={isHovering} />
    </motion.div>
  );
}
