import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, Compass } from "lucide-react";

interface JoyrideStep {
  target: string;
  title: string;
  description: string;
  prefer: "below" | "above";
}

const STEPS: JoyrideStep[] = [
  {
    target: "view-toggle",
    title: "Immersive or Editorial",
    description:
      "Switch your case study hero between a full-bleed cinematic view and a clean editorial layout. Try both — each changes the whole feel.",
    prefer: "below",
  },
  {
    target: "add-section",
    title: "Build your story",
    description:
      "Add sections to structure your case study — rich text, image grids, side-by-side layouts, galleries, code embeds, and more.",
    prefer: "above",
  },
];

const TOOLTIP_W = 292;
const TOOLTIP_H = 172;
const PAD = 9;

interface Rect { top: number; left: number; width: number; height: number }

function measure(target: string): Rect | null {
  const el = document.querySelector(`[data-joyride="${target}"]`);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return {
    top: r.top - PAD,
    left: r.left - PAD,
    width: r.width + PAD * 2,
    height: r.height + PAD * 2,
  };
}

function tooltipPosition(rect: Rect, prefer: JoyrideStep["prefer"]) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const spaceBelow = vh - (rect.top + rect.height);
  const spaceAbove = rect.top;
  const placeBelow =
    prefer === "below" ? spaceBelow >= TOOLTIP_H + 16 : spaceAbove < TOOLTIP_H + 16;

  const top = placeBelow
    ? rect.top + rect.height + 12
    : rect.top - TOOLTIP_H - 12;

  const cx = rect.left + rect.width / 2;
  const left = Math.max(16, Math.min(cx - TOOLTIP_W / 2, vw - TOOLTIP_W - 16));

  // Arrow direction + offset
  const arrowDir = placeBelow ? "top" : "bottom";
  const arrowLeft = Math.max(16, Math.min(cx - left - 8, TOOLTIP_W - 32));

  return { top: Math.max(16, top), left, arrowDir, arrowLeft };
}

export function CaseStudyJoyride() {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);
  const [tipPos, setTipPos] = useState<ReturnType<typeof tooltipPosition> | null>(null);

  const recalc = useCallback((stepIdx: number) => {
    const r = measure(STEPS[stepIdx].target);
    if (!r) return;
    setRect(r);
    setTipPos(tooltipPosition(r, STEPS[stepIdx].prefer));
  }, []);

  useEffect(() => {
    if (!active) return;
    const id = setTimeout(() => recalc(step), 60);
    return () => clearTimeout(id);
  }, [active, step, recalc]);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setActive(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  const start = () => { setStep(0); setRect(null); setTipPos(null); setActive(true); };
  const close = () => setActive(false);
  const next = () => step < STEPS.length - 1 ? setStep(s => s + 1) : close();
  const prev = () => step > 0 && setStep(s => s - 1);

  const isLast = step === STEPS.length - 1;

  return (
    <>
      {/* Floating trigger button */}
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
              {/* Click-away backdrop (transparent — shadow comes from spotlight) */}
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="fixed inset-0 z-[210] cursor-default"
                onClick={close}
              />

              {/* Spotlight — box-shadow trick creates dark overlay with cutout */}
              <AnimatePresence mode="wait">
                {rect && (
                  <motion.div
                    key={`spot-${step}`}
                    initial={{ opacity: 0, scale: 0.93 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    className="fixed z-[211] pointer-events-none"
                    style={{
                      top: rect.top,
                      left: rect.left,
                      width: rect.width,
                      height: rect.height,
                      borderRadius: 12,
                      boxShadow: "0 0 0 9999px rgba(0,0,0,0.48)",
                      border: "1.5px solid rgba(255,255,255,0.22)",
                      outline: "4px solid rgba(255,255,255,0.06)",
                    }}
                  />
                )}
              </AnimatePresence>

              {/* Tooltip card */}
              <AnimatePresence mode="wait">
                {tipPos && (
                  <motion.div
                    key={`tip-${step}`}
                    initial={{ opacity: 0, y: tipPos.arrowDir === "top" ? -10 : 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: tipPos.arrowDir === "top" ? -6 : 6, scale: 0.97 }}
                    transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
                    className="fixed z-[212] pointer-events-auto"
                    style={{ top: tipPos.top, left: tipPos.left, width: TOOLTIP_W }}
                  >
                    {/* Arrow */}
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

                    <div className="relative bg-white dark:bg-[#1E1C1A] rounded-2xl shadow-2xl border border-black/[0.07] dark:border-white/[0.09] overflow-hidden">
                      {/* Top bar */}
                      <div className="flex items-center justify-between px-5 pt-4 pb-0">
                        {/* Progress pills */}
                        <div className="flex items-center gap-1.5">
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
                              className="h-[6px] rounded-full dark:opacity-90"
                              style={{ width: i === step ? 20 : 6 }}
                            />
                          ))}
                        </div>
                        <button
                          onClick={close}
                          className="w-6 h-6 flex items-center justify-center rounded-full text-[#B5AFA5] hover:text-[#1A1A1A] dark:text-[#6A6460] dark:hover:text-[#F0EDE7] hover:bg-black/5 dark:hover:bg-white/5 transition-colors -mr-1"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
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
                                onClick={prev}
                                className="h-[30px] px-3.5 text-[12px] font-medium rounded-full border border-black/10 dark:border-white/10 text-[#7A736C] dark:text-[#9E9893] hover:text-[#1A1A1A] dark:hover:text-[#F0EDE7] hover:border-black/20 dark:hover:border-white/20 transition-colors"
                              >
                                Back
                              </button>
                            )}
                            <button
                              onClick={next}
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
