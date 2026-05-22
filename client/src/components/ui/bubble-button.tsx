import * as React from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";
import { Zap } from "lucide-react";
import { useTheme } from "next-themes";

/* ─── Keyframes ─────────────────────────────────────────────────────── */
const KEYFRAMES = `
  @keyframes bubble-rise {
    0%   { transform: translateY(0) scale(1);     opacity: 0.4; }
    100% { transform: translateY(-100px) scale(0); opacity: 0;   }
  }
  @keyframes pulse-dot {
    0%, 100% { opacity: 0.5;  }
    50%       { opacity: 1;   }
  }
  @property --btn-angle {
    syntax: "<angle>";
    inherits: false;
    initial-value: 0deg;
  }
  @keyframes rotate-btn-gradient {
    to { --btn-angle: 360deg; }
  }
`;

/* ─── Badge bubbles ──────────────────────────────────────────────────── */
const BUBBLES = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  width:    Math.random() * 12 + 4,
  height:   Math.random() * 12 + 4,
  left:     Math.random() * 95,
  duration: 2 + Math.random() * 3,
  delay:    Math.random() * 4,
}));
const BadgeBubbles = () => (
  <>
    <style>{KEYFRAMES}</style>
    <div className="absolute inset-0 z-[5] overflow-hidden rounded-full pointer-events-none">
      {BUBBLES.map((b) => (
        <span key={b.id}
          className="absolute bottom-[-10px] block rounded-full bg-foreground/20 [animation-play-state:paused] group-hover:[animation-play-state:running]"
          style={{
            width: `${b.width}px`, height: `${b.height}px`, left: `${b.left}%`,
            animation: `bubble-rise ${b.duration}s ${b.delay}s linear infinite`,
          }}
        />
      ))}
    </div>
  </>
);

/* ─── Colour palette (gauge accent — same in both modes) ─────────────── */
function palette(pct: number) {
  if (pct > 0.5) return { bright: "#b5f546", mid: "#4ade80", deep: "#166534", glow: "#22c55e", label: "#86efac" };
  if (pct > 0.2) return { bright: "#fde68a", mid: "#f59e0b", deep: "#92400e", glow: "#d97706", label: "#fcd34d" };
  return           { bright: "#fca5a5", mid: "#ef4444", deep: "#7f1d1d", glow: "#dc2626", label: "#fca5a5" };
}

/* ─── Polar helpers (clock° — 0 = 12 o'clock, clockwise) ─────────────── */
function pt(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.sin(rad), y: cy - r * Math.cos(rad) };
}
function arcPath(cx: number, cy: number, r: number, a1: number, a2: number) {
  const s  = pt(cx, cy, r, a1);
  const e  = pt(cx, cy, r, a2);
  const sw = ((a2 - a1) + 360) % 360;
  if (sw < 0.1) return "";
  return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${r} ${r} 0 ${sw > 180 ? 1 : 0} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
}

/* ─── Gauge geometry ─────────────────────────────────────────────────── */
const A0    = 240;
const A1    = 120;
const SWEEP = 240;
const CX    = 120;
const CY    = 108;
const R     = 82;
const SW    = 19;
const VB_W  = CX * 2;
const VB_H  = CY + R * 0.5 + 16;

/* ─── Tick marks ─────────────────────────────────────────────────────── */
function Ticks({ startDeg, endDeg, color }: { startDeg: number; endDeg: number; color: string }) {
  const sweep = ((endDeg - startDeg) + 360) % 360;
  const n = 12;
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const deg    = startDeg + (i / (n - 1)) * sweep;
        const inner  = pt(CX, CY, R - 3, deg);
        const outer  = pt(CX, CY, R + 3, deg);
        return (
          <line key={i}
            x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y}
            stroke={color} strokeWidth="0.8" strokeLinecap="round" opacity="0.25"
          />
        );
      })}
    </>
  );
}


/* ─── Liquid Gauge SVG ───────────────────────────────────────────────── */
function LiquidGauge({ pct, remaining, limit, uid, isDark }: {
  pct: number; remaining: number; limit: number; uid: string; isDark: boolean;
}) {
  const c           = palette(pct);
  const filled_sw   = SWEEP * Math.min(Math.max(pct, 0), 1);
  const filledEnd   = (A0 + filled_sw) % 360;

  const track  = arcPath(CX, CY, R, A0, A1);
  const filled = filled_sw > 0.5 ? arcPath(CX, CY, R, A0, filledEnd) : "";
  const empty  = filled_sw < SWEEP - 0.5 ? arcPath(CX, CY, R, filledEnd, A1) : "";
  const capPt  = filled && pct > 0.02 && pct < 0.99 ? pt(CX, CY, R, filledEnd) : null;

  const mv   = useMotionValue(0);
  const sp   = useSpring(mv, { stiffness: 50, damping: 18 });
  const [disp, setDisp] = React.useState(0);
  React.useEffect(() => sp.on("change", (v) => setDisp(Math.round(v))), [sp]);
  React.useEffect(() => { const t = setTimeout(() => mv.set(remaining), 120); return () => clearTimeout(t); }, [remaining, mv]);

  const scoreY = CY - 16;
  const labelY = CY + 16;

  /* ── adaptive track colors ── */
  const trackShadow  = isDark ? "rgba(0,0,0,0.50)"       : "rgba(0,0,0,0.08)";
  const trackSurface = isDark ? "hsl(20,10%,14%)"        : "rgba(215,210,203,0.90)";
  const trackRim     = isDark ? "hsl(20,10%,22%)"        : "rgba(255,255,255,0.60)";
  const scoreColor   = isDark ? "hsl(46,29%,94%)"           : "#1A1A1A";
  const labelColor   = isDark ? "rgba(240,237,232,0.68)"   : "rgba(26,26,26,0.62)";

  return (
    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} width={VB_W} height={VB_H}
      style={{ display: "block", overflow: "visible", margin: "0 auto" }}>
      <defs>
        <linearGradient id={`fg-${uid}`} gradientUnits="userSpaceOnUse"
          x1={CX} y1={CY - R} x2={CX} y2={CY + R * 0.55}>
          <stop offset="0%"   stopColor={c.bright} />
          <stop offset="40%"  stopColor={c.mid}    />
          <stop offset="100%" stopColor={c.deep}   />
        </linearGradient>
        <linearGradient id={`gg-${uid}`} gradientUnits="userSpaceOnUse"
          x1={CX} y1={CY - R} x2={CX} y2={CY}>
          <stop offset="0%"   stopColor="white" stopOpacity="0.35" />
          <stop offset="100%" stopColor="white" stopOpacity="0"    />
        </linearGradient>
        <filter id={`af-${uid}`} x="-35%" y="-35%" width="170%" height="170%"
          colorInterpolationFilters="sRGB">
          <feDropShadow dx="0" dy="0" stdDeviation="3"  floodColor={c.glow} floodOpacity="0.55" />
          <feDropShadow dx="0" dy="0" stdDeviation="7"  floodColor={c.glow} floodOpacity="0.20" />
        </filter>
        <filter id={`bf-${uid}`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      {/* ── Track ── */}
      <path d={track} fill="none" stroke={trackSurface} strokeWidth={SW + 6} strokeLinecap="round" />


      {/* ── Filled arc: narrower than track so track peeks around it ── */}
      {filled && (
        <motion.path d={filled} fill="none"
          stroke={c.glow} strokeWidth={SW + 4} strokeLinecap="round"
          style={{ filter: `url(#bf-${uid})`, opacity: 0.10 }}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.08 }} />
      )}
      {filled && (
        <motion.path d={filled} fill="none"
          stroke={c.glow} strokeWidth={SW - 4} strokeLinecap="round"
          style={{ filter: `url(#af-${uid})`, opacity: 0.22 }}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.08 }} />
      )}
      {filled && (
        <motion.path d={filled} fill="none"
          stroke={`url(#fg-${uid})`} strokeWidth={SW - 4} strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.08 }} />
      )}
      {filled && (
        <motion.path d={filled} fill="none"
          stroke={`url(#gg-${uid})`} strokeWidth={SW - 4} strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.08 }} />
      )}
      {filled && (
        <motion.path d={arcPath(CX, CY, R - (SW - 4) * 0.42, A0, filledEnd)} fill="none"
          stroke={isDark ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.50)"} strokeWidth={1.2} strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }} />
      )}

      {capPt && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
          <circle cx={capPt.x} cy={capPt.y} r={SW * 0.42} fill={c.bright} opacity={0.25}
            style={{ filter: `blur(${SW * 0.3}px)` }} />
          <circle cx={capPt.x} cy={capPt.y} r={SW * 0.19} fill={c.bright} opacity={0.95}
            style={{ animation: "pulse-dot 2s ease-in-out infinite" }} />
        </motion.g>
      )}

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.5 }}>
        <text x={CX} y={scoreY}
          textAnchor="middle" dominantBaseline="central"
          fill={scoreColor} fontSize="38" fontWeight="700"
          style={{ userSelect: "none", letterSpacing: "-1.5px", fontFamily: "inherit" }}>
          {disp}
        </text>
      </motion.g>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.45, duration: 0.5 }}>
        <text x={CX} y={labelY}
          textAnchor="middle" dominantBaseline="central"
          fill={labelColor} fontSize="11" fontWeight="500"
          style={{ userSelect: "none", letterSpacing: "1px", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase" }}>
          AI CREDITS LEFT
        </text>
      </motion.g>
    </svg>
  );
}

/* ─── Props ──────────────────────────────────────────────────────────── */
export interface UsageBadgeProps {
  icon: React.ReactNode;
  planName: string;
  usage: number;
  limit: number;
  tooltipContent?: React.ReactNode;
  className?: string;
  onGetMoreCredits?: () => void;
}

/* ─── Component ──────────────────────────────────────────────────────── */
const UsageBadge = React.forwardRef<HTMLDivElement, UsageBadgeProps>(
  ({ icon, planName, usage, limit, className, onGetMoreCredits }, ref) => {
    const [open, setOpen] = React.useState(false);
    const [btnHovered, setBtnHovered] = React.useState(false);
    const containerRef   = React.useRef<HTMLDivElement>(null);
    const uid = React.useId().replace(/:/g, "");

    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);
    const isDark = mounted ? resolvedTheme === "dark" : false;

    const remaining = usage;
    const pct = limit > 0 ? remaining / limit : 0;
    const c   = palette(pct);

    React.useEffect(() => {
      if (!open) return;
      const h = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
      };
      document.addEventListener("mousedown", h);
      return () => document.removeEventListener("mousedown", h);
    }, [open]);

    /* ── adaptive card tokens ── */
    const card = isDark ? {
      background:  "linear-gradient(160deg, hsl(20,10%,13%) 0%, hsl(20,10%,10%) 100%)",
      border:      "1px solid hsl(20,10%,20%)",
      boxShadow:   "0 4px 24px rgba(0,0,0,0.28), 0 1px 4px rgba(0,0,0,0.18)",
      gloss:       "linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)",
      descColor:   "hsl(46,10%,60%)",
    } : {
      background:  "linear-gradient(160deg, #FDFCFB 0%, #F0EDE7 100%)",
      border:      "1px solid rgba(26,26,26,0.10)",
      boxShadow:   "0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
      gloss:       "linear-gradient(90deg, transparent, rgba(255,255,255,0.70), transparent)",
      descColor:   "rgba(26,26,26,0.45)",
    };


    return (
      <div ref={containerRef} className="relative">

        {/* Trigger badge */}
        <div ref={ref} role="button" tabIndex={0}
          onClick={() => setOpen((o) => !o)}
          onKeyDown={(e) => e.key === "Enter" && setOpen((o) => !o)}
          className={cn(
            "group relative inline-flex cursor-pointer select-none items-center gap-2 overflow-hidden rounded-full h-9 px-4 text-sm font-medium text-foreground transition-all hover:bg-accent hover:text-accent-foreground",
            open ? "border-2 border-input bg-accent text-accent-foreground" : "border border-input bg-background",
            className,
          )}>
          <BadgeBubbles />
          <div className="relative z-10 flex-shrink-0">{icon}</div>
          <div className="relative z-10 whitespace-nowrap">
            <span>{planName}:</span>
            <span className="ml-1.5 font-semibold">{usage}</span>
            <span className="ml-1 opacity-50 text-xs">Credits</span>
          </div>
        </div>

        {/* Dropdown */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1,  y: 0,   scale: 1    }}
              exit={{    opacity: 0,  y: -8,  scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-0 top-[calc(100%+10px)] z-50"
              style={{ width: 272 }}>

              <div style={{
                background:   card.background,
                border:       card.border,
                borderRadius: 22,
                boxShadow:    card.boxShadow,
                padding:      "20px 20px 18px",
                position:     "relative",
                overflow:     "visible",
              }}>

                {/* Top gloss streak */}
                <div style={{
                  position: "absolute", top: 0, left: "18%", right: "18%", height: 1,
                  background: card.gloss,
                  pointerEvents: "none",
                }} />

                {/* Gauge */}
                <div style={{ marginLeft: -20, marginRight: -20, marginTop: -20, marginBottom: 8, overflow: "visible" }}>
                  <LiquidGauge pct={pct} remaining={remaining} limit={limit} uid={uid} isDark={isDark} />
                </div>

                {/* Credit breakdown */}
                <div style={{ marginBottom: 14 }}>
                  {[
                    { label: "Mock Interview", left: 8  },
                    { label: "Resume Tailor",  left: 30 },
                    { label: "Cover Letter",   left: 30 },
                  ].map(({ label, left }, idx, arr) => {
                    const labelColor = isDark ? "rgba(240,237,232,0.82)" : "rgba(26,26,26,0.80)";
                    const countColor = isDark ? "rgba(240,237,232,0.55)" : "rgba(26,26,26,0.50)";
                    const trackColor = isDark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.12)";
                    const fillColor  = isDark ? "rgba(255,255,255,0.70)" : "rgba(26,26,26,0.58)";
                    return (
                      <motion.div key={label}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ delay: 0.05 + idx * 0.05, duration: 0.22 }}
                        style={{
                          display: "flex", alignItems: "center", gap: 10,
                          marginBottom: idx < arr.length - 1 ? 10 : 0,
                        }}>
                        {/* Label */}
                        <span style={{ fontSize: 12, fontWeight: 500, color: labelColor, whiteSpace: "nowrap", minWidth: 96 }}>
                          {label}
                        </span>
                        {/* Bar */}
                        <div style={{ flex: 1, height: 2.5, borderRadius: 99, overflow: "hidden", background: trackColor }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.14 + idx * 0.07 }}
                            style={{ height: "100%", borderRadius: 99, background: fillColor }}
                          />
                        </div>
                        {/* Left count */}
                        <span style={{ fontSize: 11, fontWeight: 600, color: countColor, whiteSpace: "nowrap", minWidth: 36, textAlign: "right", letterSpacing: "-0.2px" }}>
                          {left} Left
                        </span>
                      </motion.div>
                    );
                  })}
                </div>

                {/* CTA — rotating gradient border button */}
                <div
                  role="button" tabIndex={0}
                  onMouseEnter={() => setBtnHovered(true)}
                  onMouseLeave={() => setBtnHovered(false)}
                  style={{
                    borderRadius: 50, padding: "2px",
                    background: isDark
                      ? "conic-gradient(from var(--btn-angle, 0deg), #ffffff 0deg, #d0ccc6 6deg, #706c68 18deg, #302e2b 32deg, #1c1916 60deg, #1c1916 300deg, #302e2b 328deg, #706c68 342deg, #d0ccc6 354deg, #ffffff 360deg)"
                      : "conic-gradient(from var(--btn-angle, 0deg), #ffffff 0deg, #c8c4be 6deg, #686460 18deg, #282522 32deg, #1c1916 60deg, #1c1916 300deg, #282522 328deg, #686460 342deg, #c8c4be 354deg, #ffffff 360deg)",
                    animation: "rotate-btn-gradient 3s linear infinite",
                    cursor: "pointer",
                    transform: btnHovered ? "scale(1.025)" : "scale(1)",
                    boxShadow: btnHovered
                      ? isDark
                        ? "0 0 0 1px hsl(20,10%,26%), 0 4px 16px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.10)"
                        : "0 0 0 1px hsl(20,10%,60%), 0 4px 16px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.70)"
                      : isDark
                        ? "0 0 0 1px hsl(20,10%,22%), inset 0 1px 0 rgba(255,255,255,0.06)"
                        : "0 0 0 1px hsl(20,10%,72%), inset 0 1px 0 rgba(255,255,255,0.5)",
                    transition: "transform 220ms cubic-bezier(0.34,1.56,0.64,1), box-shadow 200ms ease",
                  }}
                >
                  <div
                    onClick={() => { setOpen(false); onGetMoreCredits?.(); }}
                    style={{
                    background: isDark
                      ? btnHovered ? "hsl(46,35%,97%)" : "hsl(46,29%,94%)"
                      : btnHovered ? "hsl(20,12%,18%)"  : "hsl(20,10%,15%)",
                    borderRadius: 48,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    gap: 6, padding: "8px 0",
                    fontSize: 13, fontWeight: 600,
                    color: isDark ? "hsl(20,10%,10%)" : "hsl(46,29%,94%)",
                    transition: "background 200ms ease",
                  }}>
                    <Zap size={12} />
                    Get more credits
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

UsageBadge.displayName = "UsageBadge";
export { UsageBadge };
