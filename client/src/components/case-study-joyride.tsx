import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Compass } from "lucide-react";

interface JoyrideStep {
  target: string;
  title: string;
  description: string;
  prefer: "below" | "above";
  scrollBehavior?: "smooth" | "instant";
}

const STEPS: JoyrideStep[] = [
  {
    target: "view-toggle",
    title: "Immersive or Editorial",
    description:
      "Switch your hero between a full-bleed cinematic view and a clean editorial layout. Each changes the whole feel of your case study.",
    prefer: "below",
    scrollBehavior: "instant",
  },
  {
    target: "add-section",
    title: "Build your story",
    description:
      "Add sections to structure your case study — rich text, image grids, side-by-side layouts, galleries, code embeds, and more.",
    prefer: "above",
    scrollBehavior: "smooth",
  },
];

const TOOLTIP_W = 288;
const TOOLTIP_H = 168;
const PAD = 10;
const MOBILE_BP = 520;

interface Rect { top: number; left: number; width: number; height: number }

function measureEl(target: string): { el: Element; rect: Rect } | null {
  const el = document.querySelector(`[data-joyride="${target}"]`);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return {
    el,
    rect: {
      top: r.top - PAD,
      left: r.left - PAD,
      width: r.width + PAD * 2,
      height: r.height + PAD * 2,
    },
  };
}

function tooltipPosition(rect: Rect, prefer: JoyrideStep["prefer"], isMobile: boolean) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // On mobile: always pin to bottom of screen
  if (isMobile) {
    const w = Math.min(TOOLTIP_W, vw - 32);
    return {
      top: vh - TOOLTIP_H - 20,
      left: (vw - w) / 2,
      width: w,
      arrowDir: "none" as const,
      arrowLeft: 0,
    };
  }

  const spaceBelow = vh - (rect.top + rect.height);
  const spaceAbove = rect.top;
  const placeBelow =
    prefer === "below" ? spaceBelow >= TOOLTIP_H + 16 : spaceAbove < TOOLTIP_H + 16;

  const top = placeBelow
    ? rect.top + rect.height + 12
    : rect.top - TOOLTIP_H - 12;

  const cx = rect.left + rect.width / 2;
  const left = Math.max(16, Math.min(cx - TOOLTIP_W / 2, vw - TOOLTIP_W - 16));
  const arrowLeft = Math.max(16, Math.min(cx - left - 8, TOOLTIP_W - 32));

  return {
    top: Math.max(16, Math.min(top, vh - TOOLTIP_H - 16)),
    left,
    width: TOOLTIP_W,
    arrowDir: placeBelow ? ("top" as const) : ("bottom" as const),
    arrowLeft,
  };
}

export function CaseStudyJoyride() {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);
  const [tipPos, setTipPos] = useState<ReturnType<typeof tooltipPosition> | null>(null);
  const [scrolling, setScrolling] = useState(false);

  const isMobile = () => window.innerWidth < MOBILE_BP;

  const recalc = useCallback((stepIdx: number) => {
    const result = measureEl(STEPS[stepIdx].target);
    if (!result) return;
    setRect(result.rect);
    setTipPos(tooltipPosition(result.rect, STEPS[stepIdx].prefer, isMobile()));
  }, []);

  // Scroll to element then remeasure after scroll settles
  const scrollAndFocus = useCallback((stepIdx: number) => {
    const result = measureEl(STEPS[stepIdx].target);
    if (!result) return;

    const behavior = STEPS[stepIdx].scrollBehavior ?? "smooth";
    const vh = window.innerHeight;
    const elRect = result.el.getBoundingClientRect();
    const isInView = elRect.top >= 80 && elRect.bottom <= vh - 80;

    if (!isInView) {
      setScrolling(true);
      result.el.scrollIntoView({ behavior, block: "center" });
      // Wait for scroll animation to finish before measuring
      const delay = behavior === "smooth" ? 520 : 80;
      setTimeout(() => {
        setScrolling(false);
        recalc(stepIdx);
      }, delay);
    } else {
      recalc(stepIdx);
    }
  }, [recalc]);

  useEffect(() => {
    if (!active) return;
    setRect(null);
    setTipPos(null);
    scrollAndFocus(step);
  }, [active, step, scrollAndFocus]);

  // Recalc on resize
  useEffect(() => {
    if (!active) return;
    const onResize = () => recalc(step);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [active, step, recalc]);

  const start = () => { setStep(0); setRect(null); setTipPos(null); setActive(true); };
  const close = () => { setActive(false); };
  const next = () => step < STEPS.length - 1 ? setStep(s => s + 1) : close();
  const prev = () => step > 0 && setStep(s => s - 1);
  const isLast = step === STEPS.length - 1;

  return (
    <>
      {/* Floating trigger */}
      <button
        onClick={start}
        className="fixed bottom-[108px] right-6 z-[100] w-9 h-9 flex items-center justify-center bg-[#1A1A1A] dark:bg-[#F0EDE7] rounded-full shadow-xl border border-white/10 dark:border-black/10 text-white dark:text-[#1A1A1A] hover:scale-110 active:scale-95 transition-transform duration-150"
        aria-label="Start quick tour"
        title="Quick tour"
      >
        <Compass className="w-4 h-4" />
      </button>

      {createPortal(
        <AnimatePresence>
          {active && (
            <>
              {/* Transparent click-away layer */}
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[210] cursor-default"
                onClick={close}
              />

              {/* Spotlight — box-shadow trick */}
              <AnimatePresence mode="wait">
                {rect && !scrolling && (
                  <motion.div
                    key={`spot-${step}`}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="fixed z-[211] pointer-events-none"
                    style={{
                      top: rect.top,
                      left: rect.left,
                      width: rect.width,
                      height: rect.height,
                      borderRadius: 12,
                      boxShadow: "0 0 0 9999px rgba(0,0,0,0.5)",
                      border: "1.5px solid rgba(255,255,255,0.24)",
                      outline: "4px solid rgba(255,255,255,0.07)",
                    }}
                  />
                )}
              </AnimatePresence>

              {/* Tooltip */}
              <AnimatePresence mode="wait">
                {tipPos && !scrolling && (
                  <motion.div
                    key={`tip-${step}`}
                    initial={{ opacity: 0, y: tipPos.arrowDir === "top" ? -10 : tipPos.arrowDir === "bottom" ? 10 : 12, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
                    className="fixed z-[212] pointer-events-auto"
                    style={{ top: tipPos.top, left: tipPos.left, width: tipPos.width }}
                  >
                    {/* Arrow — desktop only */}
                    {tipPos.arrowDir === "top" && (
                      <div
                        className="absolute -top-[6px] w-3 h-3 rotate-45 bg-white dark:bg-[#1E1C1A] border-l border-t border-black/[0.07] dark:border-white/[0.1]"
                        style={{ left: tipPos.arrowLeft, borderRadius: "2px 0 0 0" }}
                      />
                    )}
                    {tipPos.arrowDir === "bottom" && (
                      <div
                        className="absolute -bottom-[6px] w-3 h-3 rotate-45 bg-white dark:bg-[#1E1C1A] border-r border-b border-black/[0.07] dark:border-white/[0.1]"
                        style={{ left: tipPos.arrowLeft, borderRadius: "0 0 2px 0" }}
                      />
                    )}

                    <div className="bg-white dark:bg-[#1E1C1A] rounded-2xl shadow-2xl border border-black/[0.07] dark:border-white/[0.09] overflow-hidden">
                      <div className="px-5 pt-4 pb-0 flex items-center gap-1.5">
                        {/* Progress pills */}
                        {STEPS.map((_, i) => (
                          <motion.div
                            key={i}
                            animate={{
                              width: i === step ? 20 : 6,
                              background: i === step
                                ? "#1A1A1A"
                                : i < step
                                ? "rgba(26,26,26,0.3)"
                                : "rgba(26,26,26,0.12)",
                            }}
                            transition={{ duration: 0.25 }}
                            className="h-[6px] rounded-full"
                            style={{ width: i === step ? 20 : 6 }}
                          />
                        ))}
                      </div>

                      <div className="px-5 pt-3.5 pb-5">
                        <h3 className="text-[14.5px] font-semibold text-[#1A1A1A] dark:text-[#F0EDE7] mb-1.5 tracking-[-0.01em] leading-snug">
                          {STEPS[step].title}
                        </h3>
                        <p className="text-[12.5px] text-[#7A736C] dark:text-[#9E9893] leading-[1.65] mb-4">
                          {STEPS[step].description}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-[#C4BDB6] dark:text-[#5A554E] font-medium tabular-nums select-none">
                            {step + 1} of {STEPS.length}
                          </span>
                          <div className="flex items-center gap-2">
                            {step > 0 && (
                              <button
                                onClick={(e) => { e.stopPropagation(); prev(); }}
                                className="h-[30px] px-3 text-[12px] font-medium rounded-full border border-black/10 dark:border-white/10 text-[#7A736C] dark:text-[#9E9893] hover:text-[#1A1A1A] dark:hover:text-[#F0EDE7] hover:border-black/20 dark:hover:border-white/20 transition-colors flex items-center gap-0.5"
                              >
                                <ChevronLeft className="w-3 h-3" /> Back
                              </button>
                            )}
                            <button
                              onClick={(e) => { e.stopPropagation(); next(); }}
                              className="h-[30px] px-4 text-[12px] font-semibold rounded-full bg-[#1A1A1A] dark:bg-[#F0EDE7] text-white dark:text-[#1A1A1A] hover:bg-[#2A2A2A] dark:hover:bg-[#E5E2DC] transition-colors flex items-center gap-1"
                            >
                              {isLast ? "Done" : <>Next <ChevronRight className="w-3 h-3" /></>}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
