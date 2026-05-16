import * as React from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";
import { Zap } from "lucide-react";

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

/* ─── Colour palette ─────────────────────────────────────────────────── */
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
// 240° sweep: 8-o'clock (240°) → top → 4-o'clock (120°)
const A0    = 240;
const A1    = 120;
const SWEEP = 240;
const CX    = 120;   // SVG center x  (viewBox width = 240)
const CY    = 108;   // SVG center y
const R     = 82;    // arc radius
const SW    = 19;    // stroke width

// Arc endpoints are at y = CY + R * |cos(240°)| = CY + R*0.5
// => 108 + 41 = 149.  SVG height = 149 + 16 = 165 (a little breathing room)
const VB_W  = CX * 2;       // 240
const VB_H  = CY + R * 0.5 + 16; // 165

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

/* ─── Particles — strictly clipped to stroke area ────────────────────── */
const SPARKS = Array.from({ length: 20 }, (_, i) => ({
  id:       i,
  frac:     Math.random(),
  radOff:   (Math.random() - 0.5) * (SW * 0.6),  // ±~5.7px — well inside stroke
  size:     0.9 + Math.random() * 1.8,
  dur:      1.8 + Math.random() * 2.4,
  delay:    Math.random() * 4,
  opacity:  0.3 + Math.random() * 0.5,
}));
function ArcSparks({ filledSweep, clipId }: { filledSweep: number; clipId: string }) {
  return (
    <g clipPath={`url(#${clipId})`}>
      {SPARKS.map((s) => {
        const deg = A0 + s.frac * filledSweep;
        const p   = pt(CX, CY, R + s.radOff, deg);
        return (
          <circle key={s.id} cx={p.x} cy={p.y} r={s.size} fill="white"
            style={{ opacity: s.opacity, animation: `pulse-dot ${s.dur}s ${s.delay}s ease-in-out infinite` }}
          />
        );
      })}
    </g>
  );
}

/* ─── Liquid Gauge SVG ───────────────────────────────────────────────── */
function LiquidGauge({ pct, remaining, limit, uid }: {
  pct: number; remaining: number; limit: number; uid: string;
}) {
  const c           = palette(pct);
  const filled_sw   = SWEEP * Math.min(Math.max(pct, 0), 1);
  const filledEnd   = (A0 + filled_sw) % 360;

  const track  = arcPath(CX, CY, R, A0, A1);
  const filled = filled_sw > 0.5 ? arcPath(CX, CY, R, A0, filledEnd) : "";
  const empty  = filled_sw < SWEEP - 0.5 ? arcPath(CX, CY, R, filledEnd, A1) : "";
  const capPt  = filled && pct > 0.02 && pct < 0.99 ? pt(CX, CY, R, filledEnd) : null;

  // Animated count-up (uses state so it lives inside SVG text safely)
  const mv   = useMotionValue(0);
  const sp   = useSpring(mv, { stiffness: 50, damping: 18 });
  const [disp, setDisp] = React.useState(0);
  React.useEffect(() => sp.on("change", (v) => setDisp(Math.round(v))), [sp]);
  React.useEffect(() => { const t = setTimeout(() => mv.set(remaining), 120); return () => clearTimeout(t); }, [remaining, mv]);

  // Score position: center of the arc gap, visually between center and bottom
  const scoreY = CY + R * 0.22;   // ≈ 126 — comfortably inside the opening
  const labelY = CY + R * 0.44;   // ≈ 144 — just above arc endpoints (≈149)

  return (
    // overflow:visible so glow can bleed without clipping
    // The parent card does NOT use overflow:hidden
    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} width={VB_W} height={VB_H}
      style={{ display: "block", overflow: "visible", margin: "0 auto" }}>
      <defs>
        {/* Fill gradient: bright (top) → deep (bottom) */}
        <linearGradient id={`fg-${uid}`} gradientUnits="userSpaceOnUse"
          x1={CX} y1={CY - R} x2={CX} y2={CY + R * 0.55}>
          <stop offset="0%"   stopColor={c.bright} />
          <stop offset="40%"  stopColor={c.mid}    />
          <stop offset="100%" stopColor={c.deep}   />
        </linearGradient>

        {/* Gloss: white → transparent, top half only */}
        <linearGradient id={`gg-${uid}`} gradientUnits="userSpaceOnUse"
          x1={CX} y1={CY - R} x2={CX} y2={CY}>
          <stop offset="0%"   stopColor="white" stopOpacity="0.40" />
          <stop offset="100%" stopColor="white" stopOpacity="0"    />
        </linearGradient>

        {/* Focused glow filter — modest radius to avoid over-bloom */}
        <filter id={`af-${uid}`} x="-35%" y="-35%" width="170%" height="170%"
          colorInterpolationFilters="sRGB">
          <feDropShadow dx="0" dy="0" stdDeviation="3"  floodColor={c.glow} floodOpacity="0.9" />
          <feDropShadow dx="0" dy="0" stdDeviation="8"  floodColor={c.glow} floodOpacity="0.4" />
          <feDropShadow dx="0" dy="2" stdDeviation="14" floodColor={c.glow} floodOpacity="0.2" />
        </filter>

        {/* Wide bloom blur */}
        <filter id={`bf-${uid}`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="5" />
        </filter>

        {/* Clip for particles — exactly the filled stroke area */}
        {filled && (
          <clipPath id={`cp-${uid}`} clipPathUnits="userSpaceOnUse">
            <path d={filled} fill="none" stroke="white"
              strokeWidth={SW - 4} strokeLinecap="round" />
          </clipPath>
        )}
      </defs>

      {/* ── Track: depth shadow ── */}
      <path d={track} fill="none" stroke="rgba(0,0,0,0.5)"  strokeWidth={SW + 3} strokeLinecap="round" />
      {/* ── Track: dark surface ── */}
      <path d={track} fill="none" stroke="rgba(12,13,16,0.95)" strokeWidth={SW} strokeLinecap="round" />
      {/* ── Track: rim glint ── */}
      <path d={track} fill="none" stroke="rgba(255,255,255,0.045)" strokeWidth={1.2} strokeLinecap="round" />

      {/* ── Empty-arc tick marks ── */}
      {empty && <Ticks startDeg={(A0 + filled_sw) % 360} endDeg={A1} color={c.label} />}

      {/* ── Filled arc: wide bloom ── */}
      {filled && (
        <motion.path d={filled} fill="none"
          stroke={c.glow} strokeWidth={SW + 12} strokeLinecap="round"
          style={{ filter: `url(#bf-${uid})`, opacity: 0.28 }}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.08 }} />
      )}

      {/* ── Filled arc: focused glow ── */}
      {filled && (
        <motion.path d={filled} fill="none"
          stroke={c.glow} strokeWidth={SW + 2} strokeLinecap="round"
          style={{ filter: `url(#af-${uid})`, opacity: 0.55 }}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.08 }} />
      )}

      {/* ── Filled arc: main gradient body ── */}
      {filled && (
        <motion.path d={filled} fill="none"
          stroke={`url(#fg-${uid})`} strokeWidth={SW} strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.08 }} />
      )}

      {/* ── Filled arc: gloss overlay ── */}
      {filled && (
        <motion.path d={filled} fill="none"
          stroke={`url(#gg-${uid})`} strokeWidth={SW} strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.08 }} />
      )}

      {/* ── Filled arc: inner rim line ── */}
      {filled && (
        <motion.path d={arcPath(CX, CY, R - SW * 0.42, A0, filledEnd)} fill="none"
          stroke="rgba(255,255,255,0.18)" strokeWidth={1.2} strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }} />
      )}

      {/* ── Particles — clipped to filled stroke area ── */}
      {filled && pct > 0.03 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.75, duration: 0.6 }}>
          <ArcSparks filledSweep={filled_sw} clipId={`cp-${uid}`} />
        </motion.g>
      )}

      {/* ── Leading-edge cap dot ── */}
      {capPt && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
          <circle cx={capPt.x} cy={capPt.y} r={SW * 0.42} fill={c.bright} opacity={0.25}
            style={{ filter: `blur(${SW * 0.3}px)` }} />
          <circle cx={capPt.x} cy={capPt.y} r={SW * 0.19} fill={c.bright} opacity={0.95}
            style={{ animation: "pulse-dot 2s ease-in-out infinite" }} />
        </motion.g>
      )}

      {/* ── Score number — static SVG text, only opacity animated ── */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.5 }}>
        <text x={CX} y={scoreY}
          textAnchor="middle" dominantBaseline="central"
          fill="white" fontSize="38" fontWeight="700"
          style={{ userSelect: "none", letterSpacing: "-1.5px", fontFamily: "inherit" }}>
          {disp}
        </text>
      </motion.g>

      {/* ── "/ N credits left" label — no glow, plain subdued text ── */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.45, duration: 0.5 }}>
        <text x={CX} y={labelY}
          textAnchor="middle" dominantBaseline="central"
          fill="rgba(255,255,255,0.30)" fontSize="9" fontWeight="400"
          style={{ userSelect: "none", letterSpacing: "0.5px", fontFamily: "inherit" }}>
          / {limit} credits left
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
}

/* ─── Component ──────────────────────────────────────────────────────── */
const UsageBadge = React.forwardRef<HTMLDivElement, UsageBadgeProps>(
  ({ icon, planName, usage, limit, className }, ref) => {
    const [open, setOpen] = React.useState(false);
    const containerRef   = React.useRef<HTMLDivElement>(null);
    const uid = React.useId().replace(/:/g, "");

    const remaining = usage;
    const pct    = limit > 0 ? remaining / limit : 0;
    const c      = palette(pct);
    const status = pct > 0.5 ? "Healthy" : pct > 0.2 ? "Running low" : "Almost out";

    React.useEffect(() => {
      if (!open) return;
      const h = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
      };
      document.addEventListener("mousedown", h);
      return () => document.removeEventListener("mousedown", h);
    }, [open]);

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
            <span className="ml-0.5 opacity-50 text-xs">/ {limit}</span>
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

              {/* Glass card — NO overflow:hidden so SVG glow is never clipped */}
              <div style={{
                background: "linear-gradient(160deg, rgba(22,24,28,0.98) 0%, rgba(13,14,17,1) 100%)",
                border:     "1px solid rgba(255,255,255,0.09)",
                borderRadius: 22,
                boxShadow: [
                  "0 24px 56px rgba(0,0,0,0.65)",
                  "0 4px 12px rgba(0,0,0,0.4)",
                  "inset 0 1px 0 rgba(255,255,255,0.07)",
                ].join(", "),
                padding: "20px 20px 18px",
                position: "relative",
              }}>

                {/* Top gloss streak */}
                <div style={{
                  position: "absolute", top: 0, left: "18%", right: "18%", height: 1,
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.13), transparent)",
                  pointerEvents: "none",
                }} />

                {/* Gauge — full width, self-contained */}
                <div style={{ marginLeft: -20, marginRight: -20, marginTop: -20, marginBottom: 8 }}>
                  <LiquidGauge pct={pct} remaining={remaining} limit={limit} uid={uid} />
                </div>

                {/* Title row + status pill */}
                <div style={{
                  display: "flex", alignItems: "center",
                  justifyContent: "space-between", marginBottom: 8,
                }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "white", letterSpacing: "-0.2px" }}>
                    AI Balance
                  </span>
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    background: `${c.glow}18`,
                    border: `1px solid ${c.glow}38`,
                    borderRadius: 20, padding: "3px 9px",
                  }}>
                    <div style={{
                      width: 5, height: 5, borderRadius: "50%",
                      background: c.mid,
                      boxShadow: `0 0 5px ${c.glow}`,
                      animation: "pulse-dot 2.2s ease-in-out infinite",
                    }} />
                    <span style={{ fontSize: 10, fontWeight: 600, color: c.label, letterSpacing: "0.2px" }}>
                      {status}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p style={{
                  fontSize: 12, color: "rgba(255,255,255,0.40)",
                  lineHeight: 1.6, margin: "0 0 14px",
                }}>
                  Credits power mock interviews and scout chats.
                </p>

                {/* CTA */}
                <style>{`
                  .liq-cta-v3 {
                    position: relative; overflow: hidden; cursor: pointer; width: 100%;
                    background: linear-gradient(155deg, ${c.bright}1a 0%, ${c.deep}35 100%);
                    border: 1px solid ${c.glow}48;
                    border-radius: 40px; height: 34px;
                    display: flex; align-items: center; justify-content: center; gap: 7px;
                    box-shadow: 0 0 10px ${c.glow}22, inset 0 1px 0 rgba(255,255,255,0.08);
                    transition: all 0.2s ease;
                  }
                  .liq-cta-v3::before {
                    content:""; position:absolute; top:0; left:0; right:0; height:48%;
                    background:linear-gradient(180deg,rgba(255,255,255,0.06) 0%,transparent 100%);
                    border-radius:40px 40px 0 0; pointer-events:none;
                  }
                  .liq-cta-v3:hover {
                    background: linear-gradient(155deg, ${c.bright}28 0%, ${c.deep}50 100%);
                    border-color: ${c.glow}78;
                    box-shadow: 0 0 18px ${c.glow}38, inset 0 1px 0 rgba(255,255,255,0.12);
                    transform: translateY(-1px);
                  }
                  .liq-cta-v3:active { transform: translateY(1px); }
                `}</style>
                <button className="liq-cta-v3">
                  <Zap style={{ width: 12, height: 12, color: c.bright, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: c.label, letterSpacing: "0.1px" }}>
                    Get more credits
                  </span>
                </button>
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
